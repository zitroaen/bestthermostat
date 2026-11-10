"""Global variables and override temperature."""

from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .entity import GlobalEntity
from .hub import Hub, get_hub
from .schedule import MIN_TEMP, TEMP_STEP


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up number entities."""
    hub = get_hub(hass)
    entities: list[NumberEntity] = [OverrideTemperature(hub)]
    entities.extend(VariableNumber(hub, vid) for vid in hub.variables)
    async_add_entities(entities)


class _TemperatureNumber(GlobalEntity, NumberEntity):
    _attr_native_min_value = MIN_TEMP
    _attr_native_max_value = 30.0
    _attr_native_step = TEMP_STEP
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_mode = NumberMode.BOX


class VariableNumber(_TemperatureNumber):
    """A user defined temperature variable."""

    _attr_translation_key = "variable"

    def __init__(self, hub: Hub, variable_id: str) -> None:
        """Initialize."""
        super().__init__(hub, f"variable_{variable_id}")
        self.variable_id = variable_id
        self._attr_name = hub.variables[variable_id].name

    @property
    def available(self) -> bool:
        """Unavailable once deleted."""
        return self.variable_id in self.hub.variables

    @property
    def native_value(self) -> float | None:
        """Value."""
        var = self.hub.variables.get(self.variable_id)
        return var.value if var else None

    async def async_set_native_value(self, value: float) -> None:
        """Change the variable; all rooms using it are updated."""
        self.hub.update_variable(self.variable_id, value=value)


class OverrideTemperature(_TemperatureNumber):
    """Temperature used while the global override is active."""

    _attr_translation_key = "override_temperature"

    def __init__(self, hub: Hub) -> None:
        """Initialize."""
        super().__init__(hub, "override_temperature")

    @property
    def native_value(self) -> float | None:
        """Override temperature."""
        return self.hub.override_value()

    async def async_set_native_value(self, value: float) -> None:
        """Set a fixed override temperature."""
        self.hub.set_override(temperature=value)
