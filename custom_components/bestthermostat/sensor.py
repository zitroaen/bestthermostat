"""Next schedule change sensor."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import RoomConfigEntry
from .entity import RoomEntity
from .room import RoomController


async def async_setup_entry(
    hass: HomeAssistant, entry: RoomConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the sensor."""
    async_add_entities([NextChangeSensor(entry.runtime_data)])


class NextChangeSensor(RoomEntity, SensorEntity):
    """Time of the next slot change of the active schedule."""

    _attr_translation_key = "next_change"
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, controller: RoomController) -> None:
        """Initialize."""
        super().__init__(controller, "next_change")

    @property
    def native_value(self) -> datetime | None:
        """Next change."""
        nxt = self.controller.next_change()
        return nxt[0] if nxt else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Next temperature."""
        nxt = self.controller.next_change()
        return {"next_temperature": nxt[1] if nxt else None}
