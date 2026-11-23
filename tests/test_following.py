"""Thermostats without a known HVAC mode, and thermostats that do not follow."""
# ruff: noqa: F811  (fixture "room" is imported from test_integration)

from __future__ import annotations

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, ServiceCall
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.bestthermostat.const import FOLLOW_TIMEOUT
from custom_components.bestthermostat.room import RoomController

from .conftest import TRV_ATTRS
from .test_integration import room, settle, temps  # noqa: F401


def _ignore_writes_to(hass: HomeAssistant, entity_id: str) -> list[ServiceCall]:
    """Replace climate.set_temperature: ``entity_id`` accepts the call but keeps its value."""
    calls: list[ServiceCall] = []

    async def set_temperature(call: ServiceCall) -> None:
        calls.append(call)
        if call.data["entity_id"] == entity_id:
            return
        state = hass.states.get(call.data["entity_id"])
        assert state is not None
        attrs = {**state.attributes, "temperature": call.data["temperature"]}
        hass.states.async_set(call.data["entity_id"], state.state, attrs, context=call.context)

    hass.services.async_register("climate", "set_temperature", set_temperature)
    return calls


async def _wait(hass: HomeAssistant, freezer: FrozenDateTimeFactory, seconds: float) -> None:
    freezer.tick(timedelta(seconds=seconds))
    async_fire_time_changed(hass)
    await settle(hass)


async def test_trv_without_hvac_mode_is_driven(hass: HomeAssistant, room: RoomController) -> None:
    """A TRV in state "unknown" that reports a set-point gets the target and is measured."""
    hass.states.async_set(
        "climate.trv2",
        STATE_UNKNOWN,
        {**TRV_ATTRS, "temperature": 15.0, "current_temperature": 15.7},
    )
    await settle(hass)
    assert temps(hass) == (21.0, 21.0)
    assert room.current_temperature == 17.4  # (19.0 + 15.7) / 2, rounded


async def test_unknown_without_values_is_skipped(hass: HomeAssistant, room: RoomController) -> None:
    """A TRV in state "unknown" without a set-point is treated as unavailable."""
    hass.states.async_set("climate.trv2", STATE_UNKNOWN, {})
    await settle(hass)
    hass.states.async_set("climate.trv1", "heat", {**TRV_ATTRS, "temperature": 21.0})
    room.set_temperature(22.0)
    await settle(hass)
    assert hass.states.get("climate.trv1").attributes["temperature"] == 22.0  # type: ignore[union-attr]
    assert room.current_temperature == 19.0
    assert room.as_dict()["trvs_not_following"] == []


async def test_mode_reported_again_is_no_user_action(
    hass: HomeAssistant, room: RoomController
) -> None:
    """From "unknown" to "auto" the TRV is only resynced; its mode is not touched."""
    mode_calls: list[ServiceCall] = []

    async def set_hvac_mode(call: ServiceCall) -> None:
        mode_calls.append(call)

    hass.services.async_register("climate", "set_hvac_mode", set_hvac_mode)
    room.set_mode("heat", 23.0)
    await settle(hass)
    hass.states.async_set("climate.trv1", STATE_UNKNOWN, {**TRV_ATTRS, "temperature": 23.0})
    await settle(hass)
    hass.states.async_set("climate.trv1", "auto", {**TRV_ATTRS, "temperature": 15.0})
    await settle(hass)
    assert mode_calls == []
    assert room.mode == "heat"
    assert temps(hass) == (23.0, 23.0)


async def test_trv_not_following_is_reported(
    hass: HomeAssistant, room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """A TRV that keeps another set-point is reported after FOLLOW_TIMEOUT and gets one retry."""
    calls = _ignore_writes_to(hass, "climate.trv2")
    room.set_temperature(22.0)
    await settle(hass)
    assert temps(hass) == (22.0, 21.0)
    assert room.as_dict()["trvs_not_following"] == []

    await _wait(hass, freezer, FOLLOW_TIMEOUT - 60)
    assert room.as_dict()["trvs_not_following"] == []

    sent_before = len(calls)
    await _wait(hass, freezer, 61)
    lagging = room.as_dict()["trvs_not_following"]
    assert [(t["entity_id"], t["temperature"], t["target"]) for t in lagging] == [
        ("climate.trv2", 21.0, 22.0)
    ]
    assert [c.data["entity_id"] for c in calls[sent_before:]] == ["climate.trv2"]  # one retry
    state = hass.states.get("climate.arbeitszimmer")
    assert state is not None
    assert state.attributes["trvs_not_following"] == ["climate.trv2"]

    # No endless retries.
    sent_before = len(calls)
    await _wait(hass, freezer, 3 * FOLLOW_TIMEOUT)
    assert len(calls) == sent_before

    # The TRV takes the value (e.g. after a reconnect): the report disappears.
    hass.states.async_set("climate.trv2", "heat", {**TRV_ATTRS, "temperature": 22.0})
    await settle(hass)
    assert room.as_dict()["trvs_not_following"] == []
    state = hass.states.get("climate.arbeitszimmer")
    assert state is not None
    assert state.attributes["trvs_not_following"] == []


async def test_trv_following_in_time_is_not_reported(
    hass: HomeAssistant, room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """A TRV that follows within the timeout is never reported."""
    _ignore_writes_to(hass, "climate.trv2")
    room.set_temperature(22.0)
    await settle(hass)
    await _wait(hass, freezer, FOLLOW_TIMEOUT / 2)
    hass.states.async_set("climate.trv2", "heat", {**TRV_ATTRS, "temperature": 22.0})
    await settle(hass)
    await _wait(hass, freezer, FOLLOW_TIMEOUT)
    assert room.as_dict()["trvs_not_following"] == []


async def test_changed_target_restarts_the_wait(
    hass: HomeAssistant, room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """A new set-point gives a lagging TRV the full time again."""
    _ignore_writes_to(hass, "climate.trv2")
    room.set_temperature(22.0)
    await settle(hass)
    await _wait(hass, freezer, FOLLOW_TIMEOUT - 60)
    room.set_temperature(23.0)
    await settle(hass)
    await _wait(hass, freezer, 120)
    assert room.as_dict()["trvs_not_following"] == []
    await _wait(hass, freezer, FOLLOW_TIMEOUT)
    assert [t["target"] for t in room.as_dict()["trvs_not_following"]] == [23.0]


async def test_unavailable_trv_is_not_reported(
    hass: HomeAssistant, room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """An unavailable TRV cannot follow; it is not reported as not following."""
    hass.states.async_set("climate.trv2", STATE_UNAVAILABLE, {})
    await settle(hass)
    room.set_temperature(22.0)
    await settle(hass)
    await _wait(hass, freezer, FOLLOW_TIMEOUT + 1)
    assert room.as_dict()["trvs_not_following"] == []


async def test_follow_timer_is_cancelled_on_unload(
    hass: HomeAssistant, room: RoomController
) -> None:
    """Unloading the room cancels the pending follow check."""
    _ignore_writes_to(hass, "climate.trv2")
    room.set_temperature(22.0)
    await settle(hass)
    assert room._follow_timer is not None
    assert await hass.config_entries.async_unload(room.entry_id)
    assert room._follow_timer is None
