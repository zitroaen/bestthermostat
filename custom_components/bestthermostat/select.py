"""Select the active schedule of a room."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import RoomConfigEntry
from .const import HAND_CHANGE_OPTIONS
from .entity import RoomEntity
from .room import RoomController


async def async_setup_entry(
    hass: HomeAssistant, entry: RoomConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the selects of a room."""
    async_add_entities([ScheduleSelect(entry.runtime_data), HandChangeSelect(entry.runtime_data)])


class ScheduleSelect(RoomEntity, SelectEntity):
    """Active schedule."""

    _attr_translation_key = "schedule"

    def __init__(self, controller: RoomController) -> None:
        """Initialize."""
        super().__init__(controller, "schedule")

    @property
    def options(self) -> list[str]:
        """Own and visible global schedules (plus the one in effect, e.g. by a period)."""
        names = [s.name for s in self.controller.available_schedules()]
        if (active := self.controller.active_schedule.name) not in names:
            names.append(active)
        return names

    @property
    def current_option(self) -> str | None:
        """Active schedule name."""
        return self.controller.active_schedule.name

    async def async_select_option(self, option: str) -> None:
        """Activate a schedule."""
        self.controller.set_active_schedule(option)


class HandChangeSelect(RoomEntity, SelectEntity):
    """How a set-point changed on a thermostat is handled."""

    _attr_translation_key = "hand_change"
    _attr_entity_category = EntityCategory.CONFIG
    _attr_options = HAND_CHANGE_OPTIONS

    def __init__(self, controller: RoomController) -> None:
        """Initialize."""
        super().__init__(controller, "hand_change")

    @property
    def current_option(self) -> str | None:
        """Current behaviour."""
        return self.controller.hand_change

    async def async_select_option(self, option: str) -> None:
        """Change the behaviour."""
        self.controller.set_hand_change(option)
