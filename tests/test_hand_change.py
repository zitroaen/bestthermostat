"""The behaviour for changes made on a thermostat can be switched at runtime."""

from __future__ import annotations

from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import HomeAssistantError
import pytest

from custom_components.bestthermostat.const import DOMAIN
from custom_components.bestthermostat.room import RoomController

from .conftest import TRV_ATTRS
from .test_integration import room, settle, temps  # noqa: F401


async def test_select_changes_behaviour_without_reload(
    hass: HomeAssistant,
    room: RoomController,  # noqa: F811
) -> None:
    """The select switches to "manual"; the room is not reloaded and remembers it."""
    entity_id = "select.arbeitszimmer_change_on_thermostat"
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state == "until_next_slot"
    assert state.attributes["options"] == ["manual", "until_next_slot", "ignore"]

    await hass.services.async_call(
        "select", "select_option", {"entity_id": entity_id, "option": "manual"}, blocking=True
    )
    await settle(hass)
    entry = hass.config_entries.async_get_entry(room.entry_id)
    assert entry is not None
    assert entry.runtime_data is room  # not reloaded
    assert entry.options["hand_change"] == "manual"
    assert hass.states.get(entity_id).state == "manual"  # type: ignore[union-attr]

    # A change on the thermostat now switches the room to manual mode.
    hass.states.async_set(
        "climate.trv1", "heat", {**TRV_ATTRS, "temperature": 23.0}, context=Context()
    )
    await settle(hass)
    assert room.state.mode == "heat"
    assert temps(hass) == (23.0, 23.0)

    # After a restart of the entry the choice is still there.
    await hass.config_entries.async_reload(room.entry_id)
    await settle(hass)
    assert entry.runtime_data.hand_change == "manual"


async def test_websocket_and_snapshot(
    hass: HomeAssistant,
    room: RoomController,  # noqa: F811
    hass_ws_client,  # type: ignore[no-untyped-def]
) -> None:
    """The cards read and change the behaviour via websocket."""
    client = await hass_ws_client(hass)
    await client.send_json(
        {
            "id": 1,
            "type": f"{DOMAIN}/room/hand_change",
            "entry_id": room.entry_id,
            "hand_change": "ignore",
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    assert room.hand_change == "ignore"
    assert room.as_dict()["hand_change"] == "ignore"
    with pytest.raises(HomeAssistantError):
        room.set_hand_change("sometimes")
