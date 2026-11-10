"""Base entities."""

from __future__ import annotations

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, NAME, SIGNAL_UPDATE, VERSION
from .hub import Hub
from .room import RoomController


class RoomEntity(Entity):
    """Entity belonging to a room device."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, controller: RoomController, key: str) -> None:
        """Initialize."""
        self.controller = controller
        self._attr_unique_id = f"{controller.entry_id}_{key}"
        self._attr_device_info = controller.device_info

    async def async_added_to_hass(self) -> None:
        """Subscribe to room updates."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, f"{SIGNAL_UPDATE}_{self.controller.entry_id}", self._handle_update
            )
        )
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_UPDATE, self._handle_global_update)
        )

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()

    @callback
    def _handle_global_update(self, entry_id: str | None) -> None:
        if entry_id is None:
            self.async_write_ha_state()


GLOBAL_DEVICE = DeviceInfo(
    identifiers={(DOMAIN, "global")},
    name=NAME,
    manufacturer=NAME,
    model="Einstellungen",
    sw_version=VERSION,
)


class GlobalEntity(Entity):
    """Entity on the global settings device."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_device_info = GLOBAL_DEVICE

    def __init__(self, hub: Hub, key: str) -> None:
        """Initialize."""
        self.hub = hub
        self._attr_unique_id = f"global_{key}"

    async def async_added_to_hass(self) -> None:
        """Subscribe to global updates."""
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_UPDATE, self._handle_update)
        )

    @callback
    def _handle_update(self, entry_id: str | None) -> None:
        if entry_id is None:
            self.async_write_ha_state()
