"""Shows whether the schedule of a room is currently paused."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import RoomConfigEntry
from .entity import RoomEntity
from .room import RoomController


async def async_setup_entry(
    hass: HomeAssistant, entry: RoomConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the binary sensor."""
    async_add_entities([PausedBinarySensor(entry.runtime_data)])


class PausedBinarySensor(RoomEntity, BinarySensorEntity):
    """On while manual mode, frost protection, a hand change or the override is active."""

    _attr_translation_key = "paused"

    def __init__(self, controller: RoomController) -> None:
        """Initialize."""
        super().__init__(controller, "paused")

    @property
    def is_on(self) -> bool:
        """Paused?"""
        return self.controller.schedule_paused

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Reason and end."""
        controller = self.controller
        return {
            "reason": controller.target().source,
            "until": controller.state.hand_until if controller.hand_active else None,
        }
