"""Global override switches."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import GlobalEntity
from .hub import Hub, get_hub


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up switches."""
    hub = get_hub(hass)
    # Replaced by two separate switches in 0.1.7
    registry = er.async_get(hass)
    if old := registry.async_get_entity_id("switch", DOMAIN, "global_override_all_modes"):
        registry.async_remove(old)
    async_add_entities([OverrideSwitch(hub), OverrideManualSwitch(hub), OverrideOffSwitch(hub)])


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
            "include_manual": self.hub.override.include_manual,
            "include_off": self.hub.override.include_off,
        }

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Activate."""
        self.hub.set_override(active=True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Deactivate; every room returns to its previous behaviour."""
        self.hub.set_override(active=False)


class _OverrideOptionSwitch(GlobalEntity, SwitchEntity):
    """Base for the 'override also applies to …' switches."""

    _attr_entity_category = EntityCategory.CONFIG
    _option: str

    def __init__(self, hub: Hub) -> None:
        """Initialize."""
        super().__init__(hub, self._attr_translation_key)  # type: ignore[arg-type]

    @property
    def is_on(self) -> bool:
        """Enabled?"""
        return bool(getattr(self.hub.override, self._option))

    def _set(self, value: bool) -> None:
        if self._option == "include_manual":
            self.hub.set_override(include_manual=value)
        else:
            self.hub.set_override(include_off=value)

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable."""
        self._set(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable."""
        self._set(False)


class OverrideManualSwitch(_OverrideOptionSwitch):
    """If on, the override also affects rooms in manual mode."""

    _attr_translation_key = "override_manual"
    _option = "include_manual"


class OverrideOffSwitch(_OverrideOptionSwitch):
    """If on, the override also affects rooms in off (frost protection) mode."""

    _attr_translation_key = "override_off"
    _option = "include_off"
