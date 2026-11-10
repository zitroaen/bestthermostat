"""Global override switches."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .entity import GlobalEntity
from .hub import Hub, get_hub


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up switches."""
    hub = get_hub(hass)
    async_add_entities([OverrideSwitch(hub), OverrideAllModesSwitch(hub)])


class OverrideSwitch(GlobalEntity, SwitchEntity):
    """Global override: pause all schedules and use the override temperature."""

    _attr_translation_key = "override"

    def __init__(self, hub: Hub) -> None:
        """Initialize."""
        super().__init__(hub, "override")

    @property
    def is_on(self) -> bool:
        """Active?"""
        return self.hub.override.active

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Details."""
        return {
            "temperature": self.hub.override_value(),
            "variable": self.hub.override.variable,
            "all_modes": self.hub.override.all_modes,
        }

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Activate."""
        self.hub.set_override(active=True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Deactivate; every room returns to its previous behaviour."""
        self.hub.set_override(active=False)


class OverrideAllModesSwitch(GlobalEntity, SwitchEntity):
    """If on, the override also affects rooms in manual or off mode."""

    _attr_translation_key = "override_all_modes"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, hub: Hub) -> None:
        """Initialize."""
        super().__init__(hub, "override_all_modes")

    @property
    def is_on(self) -> bool:
        """Enabled?"""
        return self.hub.override.all_modes

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable."""
        self.hub.set_override(all_modes=True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable."""
        self.hub.set_override(all_modes=False)
