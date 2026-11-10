"""Periods: time-limited activation of schedules/modes with automatic restore."""

from __future__ import annotations

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import HomeAssistantError
import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.bestthermostat.calendar import parse_summary
from custom_components.bestthermostat.const import DOMAIN
from custom_components.bestthermostat.hub import get_hub
from custom_components.bestthermostat.room import RoomController

from .conftest import TRV_ATTRS
from .test_integration import BERLIN, room, settle, temps  # noqa: F401

DAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
GUEST = {d: [{"start": "00:00", "temperature": 23}] for d in DAYS}


def at(hour: int, minute: int = 0, day: int = 9) -> datetime:
    return datetime(2026, 11, day, hour, minute, tzinfo=BERLIN)


async def tick(hass: HomeAssistant, freezer: FrozenDateTimeFactory, when: datetime) -> None:
    freezer.move_to(when)
    async_fire_time_changed(hass)
    await settle(hass)


@pytest.fixture
async def guest_room(room: RoomController) -> RoomController:  # noqa: F811
    room.create_schedule("Gast", week=GUEST)
    return room


async def test_period_now_until_cancelled(hass: HomeAssistant, guest_room: RoomController) -> None:
    """Activating 'Gast' now and cancelling restores the previous schedule."""
    period = guest_room.add_period(schedule="Gast")
    await settle(hass)
    assert temps(hass) == (23.0, 23.0)
    assert hass.states.get("select.arbeitszimmer_schedule").state == "Gast"  # type: ignore[union-attr]
    assert guest_room.state.active_schedule == "standard"  # base untouched
    assert hass.states.get("calendar.arbeitszimmer_periods").state == "on"  # type: ignore[union-attr]
    guest_room.cancel_period(period.id)
    await settle(hass)
    assert temps(hass) == (21.0, 21.0)
    assert hass.states.get("select.arbeitszimmer_schedule").state == "Standard"  # type: ignore[union-attr]


async def test_period_with_start_and_end(
    hass: HomeAssistant, guest_room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """A planned period starts and ends on its own."""
    guest_room.add_period(schedule="Gast", start=at(8), end=at(10))
    await settle(hass)
    assert temps(hass) == (21.0, 21.0)
    await tick(hass, freezer, at(8, 0) + timedelta(seconds=1))
    assert temps(hass) == (23.0, 23.0)
    await tick(hass, freezer, at(10, 0) + timedelta(seconds=1))
    assert temps(hass) == (21.0, 21.0)
    assert guest_room.state.periods == []


async def test_period_restores_manual_mode(
    hass: HomeAssistant, guest_room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """A room in manual mode returns to manual mode with its temperature."""
    guest_room.set_mode("heat", 19.0)
    guest_room.add_period(schedule="Gast", end=at(9))
    await settle(hass)
    assert temps(hass) == (23.0, 23.0)
    assert hass.states.get("climate.arbeitszimmer").state == "auto"  # type: ignore[union-attr]
    await tick(hass, freezer, at(9, 0) + timedelta(seconds=1))
    assert temps(hass) == (19.0, 19.0)
    assert hass.states.get("climate.arbeitszimmer").state == "heat"  # type: ignore[union-attr]


async def test_period_mode_off_and_heat(hass: HomeAssistant, guest_room: RoomController) -> None:
    """Periods can set a mode instead of a schedule."""
    off = guest_room.add_period(mode="off")
    await settle(hass)
    assert temps(hass) == (5.0, 5.0)
    guest_room.cancel_period(off.id)
    guest_room.add_period(temperature=22.5)  # implies manual
    await settle(hass)
    assert temps(hass) == (22.5, 22.5)
    with pytest.raises(HomeAssistantError):
        guest_room.add_period(schedule="Gast", mode="off")
    with pytest.raises(HomeAssistantError):
        guest_room.add_period()


async def test_latest_created_wins(
    hass: HomeAssistant, guest_room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """Overlapping periods: the most recently created one applies."""
    guest_room.add_period(schedule="Gast", end=at(12))
    freezer.tick(1)
    later = guest_room.add_period(mode="off", end=at(9))
    await settle(hass)
    assert temps(hass) == (5.0, 5.0)
    guest_room.cancel_period(later.id)
    await settle(hass)
    assert temps(hass) == (23.0, 23.0)


async def test_explicit_change_ends_period(hass: HomeAssistant, guest_room: RoomController) -> None:
    """Choosing a mode or schedule on the room ends the running period."""
    guest_room.add_period(schedule="Gast")
    guest_room.set_mode("off")
    await settle(hass)
    assert guest_room.state.periods == []
    assert temps(hass) == (5.0, 5.0)


async def test_hand_change_in_period(
    hass: HomeAssistant, guest_room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """A hand change during a period follows the room setting and ends with the period."""
    guest_room.add_period(schedule="Gast", end=at(8))
    await settle(hass)
    hass.states.async_set(
        "climate.trv1", "heat", {**TRV_ATTRS, "temperature": 24.0}, context=Context()
    )
    await settle(hass)
    assert temps(hass) == (24.0, 24.0)
    assert guest_room.state.hand_until is not None
    assert guest_room.state.hand_until <= at(8)
    await tick(hass, freezer, at(8) + timedelta(seconds=1))
    assert temps(hass) == (21.0, 21.0)


async def test_override_above_period(hass: HomeAssistant, guest_room: RoomController) -> None:
    """The global override still wins."""
    guest_room.add_period(schedule="Gast")
    get_hub(hass).set_override(active=True, temperature=16.0)
    await settle(hass)
    assert temps(hass) == (16.0, 16.0)
    get_hub(hass).set_override(active=False)
    await settle(hass)
    assert temps(hass) == (23.0, 23.0)


async def test_period_survives_reload(
    hass: HomeAssistant, guest_room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """Periods are persisted and still end after a restart."""
    guest_room.add_period(schedule="Gast", end=at(9))
    assert await hass.config_entries.async_reload(guest_room.entry_id)
    await settle(hass)
    new = hass.config_entries.async_get_entry(guest_room.entry_id).runtime_data  # type: ignore[union-attr]
    assert len(new.state.periods) == 1
    assert temps(hass) == (23.0, 23.0)
    await tick(hass, freezer, at(9) + timedelta(seconds=1))
    assert temps(hass) == (21.0, 21.0)


async def test_services(hass: HomeAssistant, guest_room: RoomController) -> None:
    """add_period returns the id, cancel_period ends it."""
    response = await hass.services.async_call(
        DOMAIN,
        "add_period",
        {"entity_id": "climate.arbeitszimmer", "schedule": "Gast", "duration": {"hours": 2}},
        blocking=True,
        return_response=True,
    )
    period = response["periods"][0]  # type: ignore[index]
    assert period["schedule"] == "gast"
    assert period["title"] == "Gast"
    await settle(hass)
    assert temps(hass) == (23.0, 23.0)
    with pytest.raises(HomeAssistantError):
        guest_room.delete_schedule("Gast")
    await hass.services.async_call(
        DOMAIN,
        "cancel_period",
        {"entity_id": "climate.arbeitszimmer", "period_id": period["id"]},
        blocking=True,
    )
    await settle(hass)
    assert temps(hass) == (21.0, 21.0)


async def test_calendar(hass: HomeAssistant, guest_room: RoomController) -> None:
    """Periods can be created, listed and deleted through the calendar."""
    await hass.services.async_call(
        "calendar",
        "create_event",
        {
            "entity_id": "calendar.arbeitszimmer_periods",
            "summary": "Gast",
            "start_date_time": "2026-11-09 06:00:00",
            "end_date_time": "2026-11-09 12:00:00",
        },
        blocking=True,
    )
    await settle(hass)
    assert temps(hass) == (23.0, 23.0)
    response = await hass.services.async_call(
        "calendar",
        "get_events",
        {"entity_id": "calendar.arbeitszimmer_periods", "duration": {"days": 1}},
        blocking=True,
        return_response=True,
    )
    events = response["calendar.arbeitszimmer_periods"]["events"]  # type: ignore[index]
    assert [e["summary"] for e in events] == ["Gast"]
    entity = hass.data["calendar"].get_entity("calendar.arbeitszimmer_periods")
    await entity.async_delete_event(guest_room.state.periods[0].id)
    await settle(hass)
    assert temps(hass) == (21.0, 21.0)


def test_parse_summary(guest_room_sync: None = None) -> None:
    """Event titles map to schedules and modes."""

    class Fake:
        class state:
            schedules = {
                "standard": type("S", (), {"id": "standard", "name": "Standard"})(),
                "gast": type("S", (), {"id": "gast", "name": "Gast"})(),
            }

    fake: RoomController = Fake()  # type: ignore[assignment]
    assert parse_summary(fake, "Besuch: Gast") == {"schedule": "gast"}
    assert parse_summary(fake, "Aus") == {"mode": "off"}
    assert parse_summary(fake, "Manuell 22,5 °C") == {"mode": "heat", "temperature": 22.5}
    assert parse_summary(fake, "Auto") == {"mode": "auto"}
    with pytest.raises(HomeAssistantError):
        parse_summary(fake, "Party")
