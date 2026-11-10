"""Best Thermostat: room-based weekly schedules for Zigbee TRVs."""

from __future__ import annotations

import logging

from homeassistant.config_entries import SOURCE_IMPORT, ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STOP, Platform
from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_ENTRY_TYPE,
    CONF_HIDE_TRVS,
    CONF_TRVS,
    DEFAULT_HIDE_TRVS,
    DOMAIN,
    ENTRY_TYPE_GLOBAL,
)
from .frontend_loader import async_register_card
from .hub import Hub, get_hub
from .room import RoomController
from .services import async_register_services
from .visibility import async_sync_trv_visibility, async_unhide_trvs
from .websocket import async_register_websocket

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

ROOM_PLATFORMS = [Platform.BINARY_SENSOR, Platform.CLIMATE, Platform.SELECT, Platform.SENSOR]
GLOBAL_PLATFORMS = [Platform.NUMBER, Platform.SWITCH]

type RoomConfigEntry = ConfigEntry[RoomController]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the shared parts of the integration."""
    hub = Hub(hass)
    await hub.async_load()
    hass.data[DOMAIN] = hub

    async def _on_stop(_event: Event) -> None:
        hub.async_shutdown()
        await hub.async_save_now()

    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, _on_stop)

    async_register_services(hass)
    async_register_websocket(hass)
    await async_register_card(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up a room or the global settings entry."""
    hub = get_hub(hass)
    if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_GLOBAL:
        hub.global_entry_id = entry.entry_id
        await hass.config_entries.async_forward_entry_setups(entry, GLOBAL_PLATFORMS)
        return True

    if not any(
        e.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_GLOBAL
        for e in hass.config_entries.async_entries(DOMAIN)
    ):
        hass.async_create_task(
            hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_IMPORT}, data={})
        )

    options = entry.options
    async_sync_trv_visibility(
        hass, list(options.get(CONF_TRVS, [])), options.get(CONF_HIDE_TRVS, DEFAULT_HIDE_TRVS)
    )

    controller = RoomController(hass, hub, entry)
    entry.runtime_data = controller
    hub.controllers[entry.entry_id] = controller
    await hass.config_entries.async_forward_entry_setups(entry, ROOM_PLATFORMS)
    controller.async_start()
    hub.save()
    hub.notify(None)
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def _async_reload(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload an entry."""
    hub = get_hub(hass)
    if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_GLOBAL:
        ok = await hass.config_entries.async_unload_platforms(entry, GLOBAL_PLATFORMS)
        if ok:
            hub.global_entry_id = None
        return ok
    ok = await hass.config_entries.async_unload_platforms(entry, ROOM_PLATFORMS)
    if ok:
        controller: RoomController = entry.runtime_data
        controller.async_stop()
        hub.rooms_data[entry.entry_id] = controller.state_to_dict()
        hub.controllers.pop(entry.entry_id, None)
        hub.save()
        hub.notify(None)
    return ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Delete stored data of a removed room."""
    if entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_GLOBAL:
        return
    async_unhide_trvs(hass, list(entry.options.get(CONF_TRVS, [])))
    if DOMAIN in hass.data:
        get_hub(hass).remove_room(entry.entry_id)
