"""Fixed temperature calibration per thermostat."""

from __future__ import annotations

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_UNAVAILABLE
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.setup import async_setup_component
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.bestthermostat import calibration
from custom_components.bestthermostat.calibration import find_calibration_entity
from custom_components.bestthermostat.room import RoomController

from .conftest import TRV_ATTRS
from .test_integration import MONDAY_7, create_room, settle

NUMBER_ATTRS = {"min": -5.0, "max": 5.0, "step": 0.5}


@pytest.fixture
async def devices(hass: HomeAssistant, trvs: list[ServiceCall]) -> list[ServiceCall]:
    """TRV devices; trv1 has a calibration entity, trv2 has none. Records number.set_value."""
    source = MockConfigEntry(domain="test")
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)
    for name in ("trv1", "trv2"):
        device = dev_reg.async_get_or_create(
            config_entry_id=source.entry_id, identifiers={("test", name)}, name=name
        )
        hass.states.async_remove(f"climate.{name}")
        ent_reg.async_get_or_create(
            "climate", "test", name, suggested_object_id=name, device_id=device.id
        )
        hass.states.async_set(f"climate.{name}", "heat", TRV_ATTRS)
        # Not a calibration entity, must be ignored.
        ent_reg.async_get_or_create(
            "number",
            "test",
            f"{name}_window",
            suggested_object_id=f"{name}_window_open_temperature",
            device_id=device.id,
        )
    trv1 = dev_reg.async_get_device(identifiers={("test", "trv1")})
    assert trv1 is not None
    ent_reg.async_get_or_create(
        "number",
        "test",
        "trv1_cal",
        suggested_object_id="trv1_local_temperature_calibration",
        device_id=trv1.id,
    )
    hass.states.async_set("number.trv1_local_temperature_calibration", "0.0", NUMBER_ATTRS)

    # Load "number" first, it would replace the fake service below.
    assert await async_setup_component(hass, "number", {})
    calls: list[ServiceCall] = []

    async def set_value(call: ServiceCall) -> None:
        calls.append(call)
        entity_id = call.data["entity_id"]
        state = hass.states.get(entity_id)
        assert state is not None
        hass.states.async_set(entity_id, str(call.data["value"]), state.attributes)

    hass.services.async_register("number", "set_value", set_value)
    return calls


def _cal(hass: HomeAssistant) -> str:
    state = hass.states.get("number.trv1_local_temperature_calibration")
    assert state is not None
    return state.state


async def _room_with_offsets(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, offsets: dict[str, float]
) -> RoomController:
    freezer.move_to(MONDAY_7)
    entry = await create_room(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trvs": ["climate.trv1", "climate.trv2"],
            "frost_temperature": 5.0,
            "hand_change": "until_next_slot",
            "sync_trvs": True,
        },
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "calibration"
    assert list(result["data_schema"].schema) == ["climate.trv1"]  # trv2 cannot be calibrated
    result = await hass.config_entries.options.async_configure(result["flow_id"], offsets)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await settle(hass)
    new = hass.config_entries.async_get_entry(entry.entry_id)
    assert new is not None
    return new.runtime_data  # type: ignore[no-any-return]


async def test_find_calibration_entity(hass: HomeAssistant, devices: list[ServiceCall]) -> None:
    """Only a number entity named like a calibration on the TRV's own device is found."""
    assert find_calibration_entity(hass, "climate.trv1") == (
        "number.trv1_local_temperature_calibration"
    )
    assert find_calibration_entity(hass, "climate.trv2") is None
    assert find_calibration_entity(hass, "climate.unknown") is None


async def test_offset_is_written_and_kept(
    hass: HomeAssistant,
    devices: list[ServiceCall],
    freezer: FrozenDateTimeFactory,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """The offset is written, rounded to the device step, and restored after a reset."""
    monkeypatch.setattr(calibration, "REWRITE_PAUSE", 0.0)
    room = await _room_with_offsets(hass, freezer, {"climate.trv1": -1.3})
    assert room.options["calibration"] == {"climate.trv1": -1.3}
    assert _cal(hass) == "-1.5"  # device step 0.5

    # The device resets its calibration (e.g. battery change): written again.
    hass.states.async_set("number.trv1_local_temperature_calibration", "0.0", NUMBER_ATTRS)
    await settle(hass)
    assert _cal(hass) == "-1.5"

    # Unavailable is not answered; the value is restored when it is back.
    count = len(devices)
    hass.states.async_set("number.trv1_local_temperature_calibration", STATE_UNAVAILABLE, {})
    await settle(hass)
    assert len(devices) == count
    hass.states.async_set("number.trv1_local_temperature_calibration", "0.0", NUMBER_ATTRS)
    await settle(hass)
    assert _cal(hass) == "-1.5"


async def test_offset_is_clamped(
    hass: HomeAssistant, devices: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """A value outside the device range is limited to it."""
    await _room_with_offsets(hass, freezer, {"climate.trv1": -8.0})
    assert _cal(hass) == "-5.0"


async def test_no_write_loop(
    hass: HomeAssistant, devices: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """A device that keeps reporting another value is not written again right away."""
    await _room_with_offsets(hass, freezer, {"climate.trv1": -1.0})
    count = len(devices)
    hass.states.async_set("number.trv1_local_temperature_calibration", "0.0", NUMBER_ATTRS)
    await settle(hass)
    assert len(devices) == count


async def test_empty_field_leaves_device_alone(
    hass: HomeAssistant, devices: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """Without an offset the calibration entity is never written."""
    room = await _room_with_offsets(hass, freezer, {})
    assert room.options["calibration"] == {}
    hass.states.async_set("number.trv1_local_temperature_calibration", "2.0", NUMBER_ATTRS)
    await settle(hass)
    assert devices == []
    assert _cal(hass) == "2.0"


async def test_offset_of_removed_trv_is_dropped(
    hass: HomeAssistant, devices: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """Removing a TRV from the room drops its offset; without calibratable TRVs no 2nd step."""
    room = await _room_with_offsets(hass, freezer, {"climate.trv1": -1.0})
    result = await hass.config_entries.options.async_init(room.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trvs": ["climate.trv2"],
            "frost_temperature": 5.0,
            "hand_change": "until_next_slot",
            "sync_trvs": True,
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    assert entry.options["calibration"] == {}
