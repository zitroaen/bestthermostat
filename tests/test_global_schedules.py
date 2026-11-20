"""Global schedules (shared by rooms) and periods planned for several rooms."""

from __future__ import annotations

from datetime import datetime

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import device_registry as dr, label_registry as lr
import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.bestthermostat.const import DOMAIN
from custom_components.bestthermostat.hub import Hub, get_hub
from custom_components.bestthermostat.room import RoomController

from .conftest import TRV_ATTRS
from .test_integration import BERLIN, MONDAY_7, create_room, settle

DAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
GUEST = {d: [{"start": "00:00", "temperature": 23}] for d in DAYS}
WARM = {d: [{"start": "00:00", "temperature": 22}] for d in DAYS}


def at(hour: int, minute: int = 0, day: int = 9) -> datetime:
    return datetime(2026, 11, day, hour, minute, tzinfo=BERLIN)


def temp(hass: HomeAssistant, entity_id: str) -> float:
    state = hass.states.get(entity_id)
    assert state is not None
    return float(state.attributes["temperature"])


def select_options(hass: HomeAssistant, entity_id: str) -> list[str]:
    state = hass.states.get(entity_id)
    assert state is not None
    return list(state.attributes["options"])


@pytest.fixture
async def rooms(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> tuple[RoomController, RoomController]:
    """Office (trv1, trv2) and Bathroom (trv3) on Monday 07:00 (comfort 21 °C)."""
    freezer.move_to(MONDAY_7)
    hass.states.async_set("climate.trv3", "heat", TRV_ATTRS)
    office = await create_room(hass, name="Office")
    bathroom = await create_room(hass, name="Bathroom", trvs=["climate.trv3"])
    return office.runtime_data, bathroom.runtime_data


@pytest.fixture
def hub(hass: HomeAssistant, rooms: tuple[RoomController, RoomController]) -> Hub:
    """The hub."""
    return get_hub(hass)


async def test_make_global_merges_identical_schedules(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """Turning a schedule global replaces identical own schedules of other rooms."""
    office, bathroom = rooms
    shared = hub.make_global(office.entry_id, "standard", [(bathroom.entry_id, "standard")])
    await settle(hass)
    assert shared.id.startswith("g_")
    assert shared.rooms == {office.entry_id, bathroom.entry_id}
    for room in rooms:
        assert room.state.schedules == {}
        assert room.state.active_schedule == shared.id
    assert temp(hass, "climate.trv1") == 21.0
    assert hass.states.get("select.office_schedule").state == "Default"  # type: ignore[union-attr]

    # One change applies to every room that uses it.
    hub.save_global_week(shared.id, WARM)
    await settle(hass)
    assert temp(hass, "climate.trv1") == 22.0
    assert temp(hass, "climate.trv3") == 22.0


async def test_make_global_rejects_different_plan(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """Only schedules with the same plan can be merged."""
    office, bathroom = rooms
    bathroom.save_week("standard", WARM)
    with pytest.raises(HomeAssistantError, match="different plan"):
        hub.make_global(office.entry_id, "standard", [(bathroom.entry_id, "standard")])
    assert hub.schedules == {}
    # All rooms: the bathroom's own "Default" clashes with the name.
    with pytest.raises(HomeAssistantError, match="Bathroom"):
        hub.make_global(office.entry_id, "standard", all_rooms=True)


async def test_room_without_own_schedules_survives_reload(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """A room that only uses global schedules does not get a new default schedule."""
    office, bathroom = rooms
    shared = hub.make_global(office.entry_id, "standard", [(bathroom.entry_id, "standard")])
    await settle(hass)
    await hass.config_entries.async_reload(office.entry_id)
    await settle(hass)
    reloaded: RoomController = hass.config_entries.async_get_entry(office.entry_id).runtime_data  # type: ignore[union-attr]
    assert reloaded.state.schedules == {}
    assert reloaded.state.active_schedule == shared.id
    assert temp(hass, "climate.trv1") == 21.0


async def test_visibility(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """A global schedule is only offered in the rooms it is visible in."""
    office, bathroom = rooms
    guest = hub.create_global("Guest", week=GUEST, rooms=[office.entry_id])
    await settle(hass)
    assert select_options(hass, "select.office_schedule") == ["Default", "Guest"]
    assert select_options(hass, "select.bathroom_schedule") == ["Default"]
    assert [s["name"] for s in bathroom.schedules_list()] == ["Default"]

    # Activating it in a room makes it available there.
    bathroom.set_active_schedule("Guest")
    await settle(hass)
    assert guest.rooms == {office.entry_id, bathroom.entry_id}
    assert temp(hass, "climate.trv3") == 23.0

    # A room whose active schedule it is cannot be removed.
    with pytest.raises(HomeAssistantError, match="Bathroom"):
        hub.set_global_rooms(guest.id, [office.entry_id])
    bathroom.set_active_schedule("Default")
    hub.set_global_rooms(guest.id, [office.entry_id])
    await settle(hass)
    assert select_options(hass, "select.bathroom_schedule") == ["Default"]

    # Names must not clash with a room's own schedule.
    bathroom.create_schedule("Holiday", week=WARM)
    with pytest.raises(HomeAssistantError, match="Bathroom"):
        hub.create_global("Holiday", week=GUEST)
    with pytest.raises(HomeAssistantError, match="already exists"):
        office.create_schedule("guest", week=WARM)
    hub.set_global_rooms(guest.id, None)
    assert select_options(hass, "select.bathroom_schedule") == ["Default", "Holiday", "Guest"]


async def test_period_uses_hidden_global_schedule(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """Visibility only affects the selection: a period may use any global schedule."""
    office, bathroom = rooms
    hub.create_global("Guest", week=GUEST, rooms=[office.entry_id])
    bathroom.add_period(schedule="Guest")
    await settle(hass)
    assert temp(hass, "climate.trv3") == 23.0
    listed = {s["name"]: s for s in bathroom.schedules_list()}
    assert listed["Guest"]["hidden"] is True
    assert listed["Guest"]["global"] is True


async def test_assign(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """Assigning activates a global schedule in several rooms at once."""
    office, bathroom = rooms
    guest = hub.create_global("Guest", week=GUEST, rooms=[])
    hub.assign_global(guest.id, [office.entry_id, bathroom.entry_id])
    await settle(hass)
    assert temp(hass, "climate.trv1") == 23.0
    assert temp(hass, "climate.trv3") == 23.0
    assert guest.rooms == {office.entry_id, bathroom.entry_id}
    assert hub.global_usage(guest.id)["active"] == [office.entry_id, bathroom.entry_id]


async def test_delete_switches_rooms_off(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """Deleting a global schedule in use switches the rooms off and drops its periods."""
    office, bathroom = rooms
    shared = hub.make_global(office.entry_id, "standard", [(bathroom.entry_id, "standard")])
    guest = hub.create_global("Guest", week=GUEST)
    office.add_period(schedule=guest.id, start=at(12), end=at(14))
    await settle(hass)

    result = hub.delete_global(guest.id)
    assert result == {"switched_off": [], "periods_removed": 1}
    assert office.state.periods == []

    office.create_schedule("Own", week=WARM)
    result = hub.delete_global(shared.id)
    await settle(hass)
    assert result == {"switched_off": ["Bathroom", "Office"], "periods_removed": 0}
    assert office.state.mode == "off"
    assert office.state.active_schedule == "own"
    # The bathroom had no other schedule: it keeps a copy of the deleted one.
    assert bathroom.state.mode == "off"
    assert bathroom.state.lookup(bathroom.state.active_schedule).name == "Default"
    assert temp(hass, "climate.trv1") == 5.0
    assert temp(hass, "climate.trv3") == 5.0
    assert hub.schedules == {}


async def test_variable_used_by_global_schedule(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """A variable used by a global schedule cannot be deleted."""
    var = hub.create_variable("Party", 23)
    await settle(hass)
    week = {d: [{"start": "00:00", "variable": var.id}] for d in DAYS}
    hub.create_global("Party plan", week=week)
    with pytest.raises(HomeAssistantError, match="Party plan"):
        hub.delete_variable(var.id)


async def test_group_period(
    hass: HomeAssistant,
    rooms: tuple[RoomController, RoomController],
    hub: Hub,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A period planned for several rooms is changed and cancelled together."""
    office, bathroom = rooms
    guest = hub.create_global("Guest", week=GUEST)
    pairs = hub.add_group_period(
        [office.entry_id, bathroom.entry_id], schedule=guest.id, start=at(8), end=at(10)
    )
    await settle(hass)
    group = pairs[0][1].group
    assert group is not None
    assert {p.id for _, p in pairs} == {group}

    hub.update_group_period(group, start=at(7, 30))
    await settle(hass)
    assert temp(hass, "climate.trv1") == 21.0
    freezer.move_to(at(7, 31))
    async_fire_time_changed(hass)
    await settle(hass)
    assert temp(hass, "climate.trv1") == 23.0
    assert temp(hass, "climate.trv3") == 23.0

    # Only here: the other room keeps its period.
    bathroom.cancel_period(group)
    await settle(hass)
    assert temp(hass, "climate.trv3") == 21.0
    assert temp(hass, "climate.trv1") == 23.0
    assert hub.cancel_group_period(group) == 1
    await settle(hass)
    assert temp(hass, "climate.trv1") == 21.0


async def test_group_period_is_all_or_nothing(
    hass: HomeAssistant, rooms: tuple[RoomController, RoomController], hub: Hub
) -> None:
    """If the period is invalid for one room, no room gets it."""
    office, bathroom = rooms
    office.create_schedule("Own", week=GUEST)
    with pytest.raises(HomeAssistantError):
        hub.add_group_period([office.entry_id, bathroom.entry_id], schedule="own")
    assert office.state.periods == []


async def test_services_with_label_target(
    hass: HomeAssistant,
    rooms: tuple[RoomController, RoomController],
    hub: Hub,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Services accept labels; a period for several rooms becomes a group."""
    office, _bathroom = rooms
    hub.create_global("Guest", week=GUEST, rooms=[])
    label = lr.async_get(hass).async_create("Apartment")
    devices = dr.async_get(hass)
    for room in rooms:
        device = devices.async_get_device(identifiers={(DOMAIN, room.entry_id)})
        assert device is not None
        devices.async_update_device(device.id, labels={label.label_id})
    await settle(hass)
    assert office.labels()[0]["name"] == "Apartment"

    response = await hass.services.async_call(
        DOMAIN,
        "add_period",
        {"label_id": label.label_id, "schedule": "Guest", "end": at(12)},
        blocking=True,
        return_response=True,
    )
    periods = response["periods"]  # type: ignore[index]
    assert len(periods) == 2
    assert periods[0]["group"] == periods[0]["id"] == periods[1]["id"]
    await settle(hass)
    assert temp(hass, "climate.trv1") == 23.0
    assert temp(hass, "climate.trv3") == 23.0

    await hass.services.async_call(
        DOMAIN,
        "cancel_period",
        {"label_id": label.label_id, "period_id": periods[0]["id"]},
        blocking=True,
    )
    await settle(hass)
    assert temp(hass, "climate.trv1") == 21.0

    await hass.services.async_call(
        DOMAIN,
        "set_active_schedule",
        {"label_id": label.label_id, "schedule": "Guest"},
        blocking=True,
    )
    await settle(hass)
    assert temp(hass, "climate.trv3") == 23.0
    assert hass.states.get("select.bathroom_schedule").state == "Guest"  # type: ignore[union-attr]


async def test_websocket(
    hass: HomeAssistant,
    rooms: tuple[RoomController, RoomController],
    hub: Hub,
    hass_ws_client,  # type: ignore[no-untyped-def]
) -> None:
    """The snapshot lists global schedules; the cards manage them via websocket."""
    office, bathroom = rooms
    client = await hass_ws_client(hass)
    msg_id = 0

    async def call(type_: str, **data: object) -> dict:  # type: ignore[type-arg]
        nonlocal msg_id
        msg_id += 1
        await client.send_json({"id": msg_id, "type": f"{DOMAIN}/{type_}", **data})
        msg = await client.receive_json()
        assert msg["success"], msg
        return msg["result"]  # type: ignore[no-any-return]

    shared = await call(
        "schedule/make_global",
        entry_id=office.entry_id,
        schedule_id="standard",
        merge=[{"entry_id": bathroom.entry_id, "schedule_id": "standard"}],
    )
    guest = await call("global_schedule/create", name="Guest", week=GUEST, rooms=None)
    await call("global_schedule/rooms", schedule_id=guest["id"], rooms=[office.entry_id])
    await call("global_schedule/rename", schedule_id=guest["id"], name="Visit")
    await call("global_schedule/save", schedule_id=guest["id"], week=WARM)
    added = await call(
        "period/add_group",
        entry_ids=[office.entry_id, bathroom.entry_id],
        schedule_id=guest["id"],
        start="2026-11-09T12:00",
        end="2026-11-09T14:00",
    )
    group = added["periods"][0]["group"]
    await call("period/update_group", group=group, end="2026-11-09T15:00")
    assert office.find_period(group).end == at(15)

    snap = await call("state")
    globals_ = {g["name"]: g for g in snap["global_schedules"]}
    assert globals_["Default"]["active"] == [office.entry_id, bathroom.entry_id]
    assert globals_["Visit"]["rooms"] == [office.entry_id]
    assert globals_["Visit"]["periods"] == [office.entry_id, bathroom.entry_id]
    room = next(r for r in snap["rooms"] if r["entry_id"] == bathroom.entry_id)
    assert [(s["name"], s.get("hidden", False)) for s in room["schedules"]] == [
        ("Default", False),
        ("Visit", True),
    ]

    assert (await call("period/cancel_group", group=group)) == {"rooms": 2}
    await call("global_schedule/assign", schedule_id=guest["id"], entry_ids=[bathroom.entry_id])
    result = await call("global_schedule/delete", schedule_id=guest["id"])
    assert result == {"switched_off": ["Bathroom"], "periods_removed": 0}
    assert bathroom.state.active_schedule == shared["id"]
    assert bathroom.state.mode == "off"
