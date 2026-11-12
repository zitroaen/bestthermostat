"""Integration tests with a running Home Assistant."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE
from homeassistant.core import Context, HomeAssistant, ServiceCall
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.bestthermostat.const import (
    CONF_HAND_CHANGE,
    DOMAIN,
    ENTRY_TYPE_GLOBAL,
    HAND_MANUAL,
)
from custom_components.bestthermostat.hub import get_hub
from custom_components.bestthermostat.room import RoomController

from .conftest import TRV_ATTRS

BERLIN = ZoneInfo("Europe/Berlin")
MONDAY_7 = datetime(2026, 11, 9, 7, 0, tzinfo=BERLIN)


async def settle(hass: HomeAssistant) -> None:
    """Wait for all queued writes."""
    await hass.async_block_till_done(wait_background_tasks=True)
    get_hub(hass).sender.delay = 0
    await hass.async_block_till_done(wait_background_tasks=True)


def temps(hass: HomeAssistant) -> tuple[float, float]:
    """Current set-points of both TRVs."""
    return (
        hass.states.get("climate.trv1").attributes["temperature"],  # type: ignore[union-attr]
        hass.states.get("climate.trv2").attributes["temperature"],  # type: ignore[union-attr]
    )


async def create_room(hass: HomeAssistant, **options: object) -> ConfigEntry:
    """Create a room through the config flow."""
    get_hub_loaded = DOMAIN in hass.data
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert result["type"] is FlowResultType.FORM
    if get_hub_loaded or DOMAIN in hass.data:
        get_hub(hass).sender.delay = 0
    data = {
        "name": "Arbeitszimmer",
        "trvs": ["climate.trv1", "climate.trv2"],
        "frost_temperature": 5.0,
        "hand_change": "until_next_slot",
        "sync_trvs": True,
        **options,
    }
    result = await hass.config_entries.flow.async_configure(result["flow_id"], data)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await settle(hass)
    entry = hass.config_entries.async_get_entry(result["result"].entry_id)
    assert entry is not None
    return entry


@pytest.fixture
async def room(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> RoomController:
    """A room with two TRVs on Monday 07:00 (comfort 21 °C)."""
    freezer.move_to(MONDAY_7)
    entry = await create_room(hass)
    return entry.runtime_data


async def test_setup_creates_entities_and_global_entry(
    hass: HomeAssistant, room: RoomController
) -> None:
    """Room device, entities and the global entry exist; TRVs get the slot temperature."""
    assert temps(hass) == (21.0, 21.0)
    state = hass.states.get("climate.arbeitszimmer")
    assert state is not None
    assert state.state == "auto"
    assert state.attributes["temperature"] == 21.0
    assert state.attributes["current_temperature"] == 19.0
    assert hass.states.get("select.arbeitszimmer_schedule").state == "Default"  # type: ignore[union-attr]
    assert hass.states.get("sensor.arbeitszimmer_next_change") is not None
    assert hass.states.get("binary_sensor.arbeitszimmer_schedule_paused").state == "off"  # type: ignore[union-attr]
    entries = hass.config_entries.async_entries(DOMAIN)
    assert any(e.data.get("entry_type") == ENTRY_TYPE_GLOBAL for e in entries)
    assert hass.states.get("switch.best_thermostat_global_override") is not None
    assert hass.states.get("number.best_thermostat_comfort").state == "21.0"  # type: ignore[union-attr]


async def test_slot_change(
    hass: HomeAssistant, room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """At 22:00 both TRVs drop to eco."""
    freezer.move_to(datetime(2026, 11, 9, 22, 0, 1, tzinfo=BERLIN))
    async_fire_time_changed(hass)
    await settle(hass)
    assert temps(hass) == (17.0, 17.0)


async def test_switch_schedule(hass: HomeAssistant, room: RoomController) -> None:
    """Switching schedule applies immediately and persists."""
    week = {
        d: [{"start": "00:00", "temperature": 23}]
        for d in ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
    }
    room.create_schedule("Gast", week=week)
    await hass.services.async_call(
        "select",
        "select_option",
        {"entity_id": "select.arbeitszimmer_schedule", "option": "Gast"},
        blocking=True,
    )
    await settle(hass)
    assert temps(hass) == (23.0, 23.0)
    assert get_hub(hass)._data()["rooms"][room.entry_id]["active_schedule"] == "gast"
    with pytest.raises(HomeAssistantError):
        room.delete_schedule("Gast")


async def test_hand_change_until_next_slot(
    hass: HomeAssistant, room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """A change on one TRV is synced and holds until the next slot."""
    hass.states.async_set(
        "climate.trv1", "heat", {**TRV_ATTRS, "temperature": 24.0}, context=Context()
    )
    await settle(hass)
    assert temps(hass) == (24.0, 24.0)
    assert room.hand_active
    assert hass.states.get("binary_sensor.arbeitszimmer_schedule_paused").state == "on"  # type: ignore[union-attr]
    freezer.move_to(datetime(2026, 11, 9, 22, 0, 1, tzinfo=BERLIN))
    async_fire_time_changed(hass)
    await settle(hass)
    assert temps(hass) == (17.0, 17.0)
    assert not room.hand_active


async def test_hand_change_manual_mode(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """With hand_change=manual the room switches to manual mode."""
    freezer.move_to(MONDAY_7)
    entry = await create_room(hass, **{CONF_HAND_CHANGE: HAND_MANUAL})
    hass.states.async_set(
        "climate.trv2", "heat", {**TRV_ATTRS, "temperature": 19.5}, context=Context()
    )
    await settle(hass)
    assert temps(hass) == (19.5, 19.5)
    assert hass.states.get("climate.arbeitszimmer").state == "heat"  # type: ignore[union-attr]
    assert entry.runtime_data.state.manual_temperature == 19.5


async def test_hand_change_ignore(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """With hand_change=ignore the schedule value is restored."""
    freezer.move_to(MONDAY_7)
    await create_room(hass, hand_change="ignore")
    hass.states.async_set(
        "climate.trv2", "heat", {**TRV_ATTRS, "temperature": 26.0}, context=Context()
    )
    await settle(hass)
    assert temps(hass) == (21.0, 21.0)


async def test_own_writes_are_not_hand_changes(hass: HomeAssistant, room: RoomController) -> None:
    """Our own write echoed with a foreign context (Z2M) is not a hand change."""
    room.set_mode("heat", 22.0)
    await settle(hass)
    hass.states.async_set(
        "climate.trv1", "heat", {**TRV_ATTRS, "temperature": 22.0}, context=Context()
    )
    await settle(hass)
    assert room.state.mode == "heat"
    assert not room.hand_active


async def test_room_entity_actions(hass: HomeAssistant, room: RoomController) -> None:
    """Modes and temperature via the room thermostat."""
    room.set_temperature(22.5)
    await settle(hass)
    assert temps(hass) == (22.5, 22.5)
    assert room.hand_active
    room.set_mode("off")
    await settle(hass)
    assert temps(hass) == (5.0, 5.0)
    room.set_mode("heat")
    await settle(hass)
    assert temps(hass) == (5.0, 5.0)  # keeps the current target
    room.set_mode("heat", 20.0)
    await settle(hass)
    assert temps(hass) == (20.0, 20.0)
    room.set_mode("auto")
    await settle(hass)
    assert temps(hass) == (21.0, 21.0)


async def test_unavailable_trv_is_resynced(hass: HomeAssistant, room: RoomController) -> None:
    """An unavailable TRV does not block and gets the set-point once it returns."""
    hass.states.async_set("climate.trv2", STATE_UNAVAILABLE, {})
    await settle(hass)
    hub = get_hub(hass)
    hub.update_variable("comfort", value=22.0)
    await settle(hass)
    assert hass.states.get("climate.trv1").attributes["temperature"] == 22.0  # type: ignore[union-attr]
    assert hass.states.get("climate.arbeitszimmer").attributes["current_temperature"] == 19.0  # type: ignore[union-attr]
    hass.states.async_set("climate.trv2", "heat", {**TRV_ATTRS, "temperature": 17.0})
    await settle(hass)
    assert temps(hass) == (22.0, 22.0)


async def test_variable_change_and_delete_protection(
    hass: HomeAssistant, room: RoomController
) -> None:
    """Changing a variable updates rooms; used variables cannot be deleted."""
    hub = get_hub(hass)
    await hass.services.async_call(
        DOMAIN, "set_variable", {"variable": "Comfort", "value": 20.5}, blocking=True
    )
    await settle(hass)
    assert temps(hass) == (20.5, 20.5)
    with pytest.raises(HomeAssistantError):
        hub.delete_variable("comfort")
    var = hub.create_variable("Bad", 23.0)
    hub.delete_variable(var.id)
    assert var.id not in hub.variables


async def test_global_override_restores(hass: HomeAssistant, room: RoomController) -> None:
    """Override pauses schedules, follows its value and restores afterwards."""
    room.set_active_schedule("Default")
    await hass.services.async_call(
        DOMAIN, "set_global_override", {"active": True, "temperature": 16.0}, blocking=True
    )
    await settle(hass)
    assert temps(hass) == (16.0, 16.0)
    assert hass.states.get("switch.best_thermostat_global_override").state == "on"  # type: ignore[union-attr]
    # hand change during override is reverted
    hass.states.async_set(
        "climate.trv1", "heat", {**TRV_ATTRS, "temperature": 25.0}, context=Context()
    )
    await settle(hass)
    assert temps(hass) == (16.0, 16.0)
    get_hub(hass).set_override(variable="eco")
    await settle(hass)
    assert temps(hass) == (17.0, 17.0)
    await hass.services.async_call(
        "switch",
        "turn_off",
        {"entity_id": "switch.best_thermostat_global_override"},
        blocking=True,
    )
    await settle(hass)
    assert temps(hass) == (21.0, 21.0)
    assert room.state.mode == "auto"


async def test_override_only_auto_rooms(hass: HomeAssistant, room: RoomController) -> None:
    """By default rooms in manual mode are not affected."""
    room.set_mode("heat", 19.0)
    get_hub(hass).set_override(active=True, temperature=15.0)
    await settle(hass)
    assert temps(hass) == (19.0, 19.0)
    get_hub(hass).set_override(include_manual=True)
    await settle(hass)
    assert temps(hass) == (15.0, 15.0)
    get_hub(hass).set_override(active=False)
    await settle(hass)
    assert temps(hass) == (19.0, 19.0)


async def test_restart_keeps_state(hass: HomeAssistant, room: RoomController) -> None:
    """Reloading the room keeps schedules, mode and hand change."""
    room.create_schedule("Gast")
    room.set_temperature(23.0)
    entry_id = room.entry_id
    assert await hass.config_entries.async_reload(entry_id)
    await settle(hass)
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    new: RoomController = entry.runtime_data
    assert new is not room
    assert {s.name for s in new.state.schedules.values()} == {"Default", "Gast"}
    assert new.hand_active
    assert temps(hass) == (23.0, 23.0)


async def test_get_and_set_schedule_services(hass: HomeAssistant, room: RoomController) -> None:
    """Schedules can be read and written as JSON."""
    response = await hass.services.async_call(
        DOMAIN,
        "get_schedule",
        {"entity_id": "climate.arbeitszimmer"},
        blocking=True,
        return_response=True,
    )
    data = response["rooms"]["climate.arbeitszimmer"]  # type: ignore[index]
    assert data["schedules"][0]["week"]["mon"][0] == {"start": "00:00", "variable": "eco"}
    week = data["schedules"][0]["week"]
    week["mon"] = [{"start": "00:00", "temperature": 18.5}]
    await hass.services.async_call(
        DOMAIN,
        "set_schedule",
        {"entity_id": "climate.arbeitszimmer", "schedule": "Default", "week": week},
        blocking=True,
    )
    await settle(hass)
    assert temps(hass) == (18.5, 18.5)
    week["mon"] = [{"start": "01:00", "temperature": 18.5}]
    with pytest.raises(HomeAssistantError):
        await hass.services.async_call(
            DOMAIN,
            "set_schedule",
            {"entity_id": "climate.arbeitszimmer", "schedule": "Default", "week": week},
            blocking=True,
        )
    await hass.services.async_call(
        DOMAIN,
        "set_active_schedule",
        {"entity_id": "climate.arbeitszimmer", "schedule": "standard"},
        blocking=True,
    )
    await hass.services.async_call(
        DOMAIN,
        "set_mode",
        {"entity_id": "climate.arbeitszimmer", "mode": "off"},
        blocking=True,
    )
    await settle(hass)
    assert temps(hass) == (5.0, 5.0)


async def test_websocket(hass: HomeAssistant, room: RoomController, hass_ws_client) -> None:  # type: ignore[no-untyped-def]
    """The card API works."""
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": f"{DOMAIN}/subscribe"})
    msg = await client.receive_json()
    assert msg["success"]
    msg = await client.receive_json()
    assert msg["event"]["rooms"][0]["name"] == "Arbeitszimmer"
    await client.send_json(
        {
            "id": 2,
            "type": f"{DOMAIN}/schedule/create",
            "entry_id": room.entry_id,
            "name": "Gast",
            "copy_from": "standard",
        }
    )
    while (msg := await client.receive_json())["id"] != 2:
        pass
    assert msg["success"]
    assert msg["result"]["name"] == "Gast"
    await client.send_json(
        {
            "id": 3,
            "type": f"{DOMAIN}/schedule/delete",
            "entry_id": room.entry_id,
            "schedule_id": "standard",
        }
    )
    while (msg := await client.receive_json())["id"] != 3:
        pass
    assert not msg["success"]


async def test_options_flow(hass: HomeAssistant, room: RoomController) -> None:
    """TRVs can be changed later."""
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trvs": ["climate.trv1"],
            "frost_temperature": 7.0,
            "hand_change": "manual",
            "sync_trvs": False,
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await settle(hass)
    new: RoomController = hass.config_entries.async_get_entry(entry.entry_id).runtime_data  # type: ignore[union-attr]
    assert new.trvs == ["climate.trv1"]
    assert new.frost_temperature == 7.0


async def test_hide_trvs(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """TRVs are hidden on request and shown again when the option is turned off."""
    from homeassistant.helpers import entity_registry as er

    registry = er.async_get(hass)
    for name in ("trv1", "trv2"):
        hass.states.async_remove(f"climate.{name}")
        registry.async_get_or_create("climate", "test", name, suggested_object_id=name)
        hass.states.async_set(f"climate.{name}", "heat", TRV_ATTRS)
    registry.async_update_entity("climate.trv2", hidden_by=er.RegistryEntryHider.USER)
    freezer.move_to(MONDAY_7)
    entry = await create_room(hass, hide_trvs=True)
    assert registry.async_get("climate.trv1").hidden_by is er.RegistryEntryHider.INTEGRATION  # type: ignore[union-attr]
    assert registry.async_get("climate.trv2").hidden_by is er.RegistryEntryHider.USER  # type: ignore[union-attr]

    result = await hass.config_entries.options.async_init(entry.entry_id)
    await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trvs": ["climate.trv1", "climate.trv2"],
            "frost_temperature": 5.0,
            "hand_change": "manual",
            "sync_trvs": True,
            "hide_trvs": False,
        },
    )
    await settle(hass)
    assert registry.async_get("climate.trv1").hidden_by is None  # type: ignore[union-attr]
    assert registry.async_get("climate.trv2").hidden_by is er.RegistryEntryHider.USER  # type: ignore[union-attr]

    await hass.config_entries.options.async_configure(
        (await hass.config_entries.options.async_init(entry.entry_id))["flow_id"],
        {
            "trvs": ["climate.trv1", "climate.trv2"],
            "frost_temperature": 5.0,
            "hand_change": "manual",
            "sync_trvs": True,
            "hide_trvs": True,
        },
    )
    await settle(hass)
    assert registry.async_get("climate.trv1").hidden_by is er.RegistryEntryHider.INTEGRATION  # type: ignore[union-attr]
    await hass.config_entries.async_remove(entry.entry_id)
    await settle(hass)
    assert registry.async_get("climate.trv1").hidden_by is None  # type: ignore[union-attr]


async def test_override_manual_and_off_separately(
    hass: HomeAssistant, room: RoomController
) -> None:
    """'Also manual' and 'also off' are independent."""
    hub = get_hub(hass)
    hub.set_override(active=True, temperature=15.0, include_off=True)
    room.set_mode("heat", 19.0)
    await settle(hass)
    assert temps(hass) == (19.0, 19.0)  # manual not affected
    room.set_mode("off")
    await settle(hass)
    assert temps(hass) == (15.0, 15.0)  # off affected
    await hass.services.async_call(
        DOMAIN, "set_global_override", {"include_off": False, "include_manual": True}, blocking=True
    )
    await settle(hass)
    assert temps(hass) == (5.0, 5.0)
    room.set_mode("heat", 19.0)
    await settle(hass)
    assert temps(hass) == (15.0, 15.0)
    assert hass.states.get("switch.best_thermostat_override_also_for_manual").state == "on"  # type: ignore[union-attr]
    assert hass.states.get("switch.best_thermostat_override_also_for_off").state == "off"  # type: ignore[union-attr]
    await hass.services.async_call(
        "switch",
        "turn_on",
        {"entity_id": "switch.best_thermostat_override_also_for_off"},
        blocking=True,
    )
    assert hub.override.include_off


async def test_german_defaults(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """With Home Assistant in German, default names are German."""
    hass.config.language = "de"
    freezer.move_to(MONDAY_7)
    entry = await create_room(hass)
    controller: RoomController = entry.runtime_data
    assert controller.state.schedule.name == "Standard"
    assert {v.name for v in get_hub(hass).variables.values()} == {"Komfort", "Absenk"}
    period = controller.add_period(mode="off")
    assert controller.period_summary(period) == "Aus"


async def test_area_and_floor(hass: HomeAssistant, room: RoomController) -> None:
    """The room's floor comes from the room device's area, else from the TRVs."""
    from homeassistant.helpers import (
        area_registry as ar,
        device_registry as dr,
        entity_registry as er,
        floor_registry as fr,
    )

    floor = fr.async_get(hass).async_create("Obergeschoss", level=1)
    area = ar.async_get(hass).async_create("Reading room", floor_id=floor.floor_id)
    assert room.area_and_floor() == (None, None)

    # TRV area as fallback
    ent_reg = er.async_get(hass)
    hass.states.async_remove("climate.trv1")
    ent_reg.async_get_or_create("climate", "test", "trv1", suggested_object_id="trv1")
    ent_reg.async_update_entity("climate.trv1", area_id=area.id)
    area_info, floor_info = room.area_and_floor()
    assert area_info == {"id": area.id, "name": "Reading room", "icon": None}
    assert floor_info is not None and floor_info["name"] == "Obergeschoss"
    assert floor_info["level"] == 1

    # the room device's own area wins
    other = ar.async_get(hass).async_create("Bad")
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_device(identifiers={(DOMAIN, room.entry_id)})
    assert device is not None
    dev_reg.async_update_device(device.id, area_id=other.id)
    area_info, floor_info = room.area_and_floor()
    assert area_info == {"id": other.id, "name": "Bad", "icon": None}
    assert floor_info is None


async def test_simple_modes(hass: HomeAssistant, room: RoomController) -> None:
    """Apple Home / Matter compatible modes: heat = schedule, off = frost protection."""
    entries = hass.config_entries.async_entries(DOMAIN)
    global_entry = next(e for e in entries if e.data.get("entry_type") == ENTRY_TYPE_GLOBAL)
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "settings"}
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"simple_modes": True}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await settle(hass)
    state = hass.states.get("climate.arbeitszimmer")
    assert state is not None
    assert state.attributes["hvac_modes"] == ["heat", "off"]
    assert state.state == "heat"

    # a planned-period-free room following the schedule stays untouched on "heat"
    period = room.add_period(schedule="Default", end=None)
    await hass.services.async_call(
        "climate",
        "set_hvac_mode",
        {"entity_id": "climate.arbeitszimmer", "hvac_mode": "heat"},
        blocking=True,
    )
    assert room.state.periods == [period]
    room.cancel_period(period.id)

    await hass.services.async_call(
        "climate",
        "set_hvac_mode",
        {"entity_id": "climate.arbeitszimmer", "hvac_mode": "off"},
        blocking=True,
    )
    await settle(hass)
    assert temps(hass) == (5.0, 5.0)
    await hass.services.async_call(
        "climate",
        "set_hvac_mode",
        {"entity_id": "climate.arbeitszimmer", "hvac_mode": "heat"},
        blocking=True,
    )
    await settle(hass)
    assert room.state.mode == "auto"
    assert temps(hass) == (21.0, 21.0)
    # manual (set in the card) is shown as heat
    room.set_mode("heat", 19.0)
    await settle(hass)
    assert hass.states.get("climate.arbeitszimmer").state == "heat"  # type: ignore[union-attr]


async def test_target_variable(hass: HomeAssistant, room: RoomController) -> None:
    """The name of the variable behind the current target is reported."""
    data = room.as_dict()
    assert data["target_source"] == "schedule"
    assert data["target_variable"] == "Comfort"
    room.set_mode("heat", 19.0)
    assert room.as_dict()["target_variable"] is None


async def test_batteries(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """Battery entities on the TRV devices are found automatically."""
    from homeassistant.helpers import device_registry as dr, entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    source = MockConfigEntry(domain="test")
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)
    for i, (name, level) in enumerate((("trv1", "45"), ("trv2", "12")), start=1):
        device = dev_reg.async_get_or_create(
            config_entry_id=source.entry_id, identifiers={("test", name)}, name=f"TRV {i}"
        )
        hass.states.async_remove(f"climate.{name}")
        ent_reg.async_get_or_create(
            "climate", "test", name, suggested_object_id=name, device_id=device.id
        )
        hass.states.async_set(f"climate.{name}", "heat", TRV_ATTRS)
        ent_reg.async_get_or_create(
            "sensor",
            "test",
            f"{name}_bat",
            suggested_object_id=f"{name}_battery",
            device_id=device.id,
            original_device_class="battery",
        )
        hass.states.async_set(f"sensor.{name}_battery", level, {"unit_of_measurement": "%"})
    freezer.move_to(MONDAY_7)
    entry = await create_room(hass)
    controller: RoomController = entry.runtime_data
    batteries = {b["entity_id"]: b for b in controller.as_dict()["batteries"]}
    assert batteries["climate.trv1"]["level"] == 45.0
    assert batteries["climate.trv1"]["low"] is False
    assert batteries["climate.trv2"]["low"] is True
    assert batteries["climate.trv1"]["name"] == "TRV 1"
    assert batteries["climate.trv1"]["device_id"]


async def test_copy_schedule_to_rooms(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """A schedule can be copied to other rooms."""
    from custom_components.bestthermostat.websocket import _copy_to_rooms

    freezer.move_to(MONDAY_7)
    first = (await create_room(hass, trvs=["climate.trv1"])).runtime_data
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {
            "name": "Bad",
            "trvs": ["climate.trv2"],
            "frost_temperature": 5.0,
            "hand_change": "until_next_slot",
            "sync_trvs": True,
            "hide_trvs": False,
        },
    )
    second = hass.config_entries.async_get_entry(result["result"].entry_id).runtime_data  # type: ignore[union-attr]
    week = {
        d: [{"start": "00:00", "temperature": 23}]
        for d in ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
    }
    first.create_schedule("Gast", week=week)
    assert _copy_to_rooms(hass, first.entry_id, "gast", [second.entry_id]) == {
        "created": ["Bad"],
        "replaced": [],
    }
    assert second.find_schedule("Gast").week.to_dict() == first.find_schedule("Gast").week.to_dict()
    assert _copy_to_rooms(hass, first.entry_id, "gast", [second.entry_id, first.entry_id]) == {
        "created": [],
        "replaced": ["Bad"],
    }


async def test_global_change_sends_one_snapshot(
    hass: HomeAssistant, room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """A global change produces one coalesced card update, not one per room."""
    from unittest.mock import MagicMock

    from custom_components.bestthermostat import websocket as ws_module

    connection = MagicMock()
    connection.subscriptions = {}
    ws_module.ws_subscribe(hass, connection, {"id": 5, "type": "x"})
    connection.send_message.reset_mock()
    hub = get_hub(hass)
    for value in (15.0, 15.5, 16.0):
        hub.set_override(active=True, temperature=value)
    assert connection.send_message.call_count == 0  # coalesced, not yet sent
    freezer.tick(0.5)  # the frozen clock also drives the event loop timers
    for _ in range(5):
        await asyncio.sleep(0)
    assert connection.send_message.call_count == 1
    connection.subscriptions[5]()


async def test_no_timer_runs_after_unload(
    hass: HomeAssistant, room: RoomController, freezer: FrozenDateTimeFactory
) -> None:
    """Re-evaluating (e.g. after adding a period) must not orphan the pending timer."""
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    room.add_period(mode="off", end=dt_util.utcnow() + timedelta(days=3))
    room.cancel_period()
    calls = 0
    original = room.apply

    def counting() -> None:
        nonlocal calls
        calls += 1
        original()

    room.apply = counting  # type: ignore[method-assign]
    assert await hass.config_entries.async_unload(entry.entry_id)
    freezer.move_to(MONDAY_7 + timedelta(hours=20))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert calls == 0


async def test_trv_cannot_be_used_in_two_rooms(hass: HomeAssistant, room: RoomController) -> None:
    """A thermostat that belongs to a room cannot be added to another room."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {
            "name": "Office",
            "trvs": ["climate.trv2"],
            "frost_temperature": 5.0,
            "hand_change": "until_next_slot",
            "sync_trvs": True,
            "hide_trvs": False,
        },
    )
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"trvs": "trv_in_use"}
    assert result["description_placeholders"]["room"] == "Arbeitszimmer"

    # Editing the room itself keeps its own thermostats valid.
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {**entry.options, "trvs": ["climate.trv1", "climate.trv2"]}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY


async def test_deleted_variable_entity_is_removed(
    hass: HomeAssistant, room: RoomController
) -> None:
    """The number entity of a deleted variable disappears from the registry."""
    hub = get_hub(hass)
    var = hub.create_variable("Night", 16.0)
    await hass.async_block_till_done()
    registry = er.async_get(hass)
    entity_id = registry.async_get_entity_id("number", DOMAIN, f"global_variable_{var.id}")
    assert entity_id is not None
    hub.delete_variable(var.id)
    await hass.async_block_till_done()
    assert registry.async_get_entity_id("number", DOMAIN, f"global_variable_{var.id}") is None


async def test_sync_off_keeps_hand_change_on_one_trv(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """With sync off a hand change stays on its thermostat until the next slot."""
    freezer.move_to(MONDAY_7)
    room = (await create_room(hass, sync_trvs=False)).runtime_data
    assert temps(hass) == (21.0, 21.0)
    hass.states.async_set("climate.trv1", "heat", {**TRV_ATTRS, "temperature": 23.0})
    await settle(hass)
    assert temps(hass) == (23.0, 21.0)
    assert room.target().temperature == 21.0  # the room target does not change
    assert [d["entity_id"] for d in room.as_dict()["trv_deviations"]] == ["climate.trv1"]

    # Unrelated changes re-apply the room without touching the deviation.
    get_hub(hass).update_variable("eco", value=16.0)
    await settle(hass)
    assert temps(hass) == (23.0, 21.0)

    # The global override wins, afterwards the deviation is back.
    get_hub(hass).set_override(active=True, temperature=15.0)
    await settle(hass)
    assert temps(hass) == (15.0, 15.0)
    get_hub(hass).set_override(active=False)
    await settle(hass)
    assert temps(hass) == (23.0, 21.0)

    # Next slot (22:00, eco 16 °C) ends it.
    freezer.move_to(datetime(2026, 11, 9, 22, 0, 1, tzinfo=BERLIN))
    async_fire_time_changed(hass)
    await settle(hass)
    assert temps(hass) == (16.0, 16.0)
    assert room.as_dict()["trv_deviations"] == []


async def test_sync_off_explicit_room_change_ends_deviation(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """Setting the room temperature or mode applies to every thermostat again."""
    freezer.move_to(MONDAY_7)
    room = (await create_room(hass, sync_trvs=False)).runtime_data
    hass.states.async_set("climate.trv1", "heat", {**TRV_ATTRS, "temperature": 23.0})
    await settle(hass)
    room.set_temperature(20.0)
    await settle(hass)
    assert temps(hass) == (20.0, 20.0)

    hass.states.async_set("climate.trv2", "heat", {**TRV_ATTRS, "temperature": 18.0})
    await settle(hass)
    assert temps(hass) == (20.0, 18.0)
    room.set_mode("heat", 22.0)
    await settle(hass)
    assert temps(hass) == (22.0, 22.0)


async def test_sync_off_manual_setting(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """'Switch to manual' with sync off: room goes manual, only that TRV changes."""
    freezer.move_to(MONDAY_7)
    room = (await create_room(hass, sync_trvs=False, hand_change=HAND_MANUAL)).runtime_data
    hass.states.async_set("climate.trv2", "heat", {**TRV_ATTRS, "temperature": 19.0})
    await settle(hass)
    assert room.mode == "heat"
    assert room.target().temperature == 21.0
    assert temps(hass) == (21.0, 19.0)
    # Survives a reload of the room.
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    await hass.config_entries.async_reload(entry.entry_id)
    await settle(hass)
    assert temps(hass) == (21.0, 19.0)
    assert entry.runtime_data.as_dict()["trv_deviations"][0]["temperature"] == 19.0


async def test_battery_added_later_is_tracked(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """A battery entity that appears after the room started is picked up."""
    from homeassistant.helpers import device_registry as dr
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    source = MockConfigEntry(domain="test")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={("test", "trv1")}, name="TRV 1"
    )
    ent_reg = er.async_get(hass)
    hass.states.async_remove("climate.trv1")
    ent_reg.async_get_or_create(
        "climate", "test", "trv1", suggested_object_id="trv1", device_id=device.id
    )
    hass.states.async_set("climate.trv1", "heat", TRV_ATTRS)
    freezer.move_to(MONDAY_7)
    room = (await create_room(hass)).runtime_data
    assert room.as_dict()["batteries"] == []
    ent_reg.async_get_or_create(
        "sensor",
        "test",
        "trv1_bat",
        suggested_object_id="trv1_battery",
        device_id=device.id,
        original_device_class="battery",
    )
    hass.states.async_set("sensor.trv1_battery", "50", {"unit_of_measurement": "%"})
    await hass.async_block_till_done()
    assert room.as_dict()["batteries"][0]["level"] == 50.0
    notified = []
    room.notify = lambda: notified.append(True)  # type: ignore[method-assign]
    hass.states.async_set("sensor.trv1_battery", "40", {"unit_of_measurement": "%"})
    await hass.async_block_till_done()
    assert notified


async def test_manual_mode_during_override_keeps_room_value(
    hass: HomeAssistant, room: RoomController
) -> None:
    """Switching to manual while the override runs uses the room's own target."""
    get_hub(hass).set_override(active=True, temperature=15.0)
    room.set_mode("heat")
    assert room.state.manual_temperature == 21.0


async def test_set_temperature_with_mode_rounds(hass: HomeAssistant, room: RoomController) -> None:
    """climate.set_temperature with hvac_mode rounds like a plain temperature change."""
    from homeassistant.components.climate import HVACMode

    from custom_components.bestthermostat.climate import RoomClimate

    # The tests replace climate.set_temperature (for the fake TRVs), so call the entity.
    entity = next(
        e
        for e in hass.data["climate"].entities
        if isinstance(e, RoomClimate) and e.controller is room
    )
    await entity.async_set_temperature(temperature=21.3, hvac_mode=HVACMode.HEAT)
    assert room.mode == "heat"
    assert room.state.manual_temperature == 21.5
    await entity.async_set_temperature(temperature=23, hvac_mode=HVACMode.AUTO)
    assert room.mode == "auto"
    assert room.target().temperature == 23.0
    assert room.target().source == "hand"


async def test_variable_usage_names_unloaded_room(
    hass: HomeAssistant, room: RoomController
) -> None:
    """Usage of a variable in an unloaded room names the room."""
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert get_hub(hass).variable_usage("comfort") == ["Arbeitszimmer: Default"]
