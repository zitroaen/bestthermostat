"""Select the active schedule of a room."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import RoomConfigEntry
from .entity import RoomEntity
from .room import RoomController


async def async_setup_entry(
    hass: HomeAssistant, entry: RoomConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the schedule select."""
    async_add_entities([ScheduleSelect(entry.runtime_data)])


class ScheduleSelect(RoomEntity, SelectEntity):
    """Active schedule."""

    _attr_translation_key = "schedule"

    def __init__(self, controller: RoomController) -> None:
        """Initialize."""
        super().__init__(controller, "schedule")

    @property
    def options(self) -> list[str]:
        """Schedule names."""
        return [s.name for s in self.controller.state.schedules.values()]

    @property
    def current_option(self) -> str | None:
        """Active schedule name."""
        return self.controller.state.schedule.name

    async def async_select_option(self, option: str) -> None:
        """Activate a schedule."""
        self.controller.set_active_schedule(option)
