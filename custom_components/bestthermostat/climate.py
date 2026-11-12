"""Room thermostat bundling all TRVs of a room."""

from __future__ import annotations

from typing import Any

from homeassistant.components.climate import (
    ATTR_HVAC_MODE,
    ClimateEntity,
    ClimateEntityFeature,
    HVACAction,
    HVACMode,
)
from homeassistant.const import ATTR_TEMPERATURE, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import RoomConfigEntry
from .entity import RoomEntity
from .room import RoomController
from .schedule import MODE_AUTO, MODE_HEAT, MODE_OFF

HVAC_TO_MODE = {HVACMode.AUTO: MODE_AUTO, HVACMode.HEAT: MODE_HEAT, HVACMode.OFF: MODE_OFF}
MODE_TO_HVAC = {v: k for k, v in HVAC_TO_MODE.items()}


async def async_setup_entry(
    hass: HomeAssistant, entry: RoomConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the room climate entity."""
    async_add_entities([RoomClimate(entry.runtime_data)])


class RoomClimate(RoomEntity, ClimateEntity):
    """Thermostat of a room."""

    _attr_name = None
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE
        | ClimateEntityFeature.TURN_ON
        | ClimateEntityFeature.TURN_OFF
    )
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_target_temperature_step = 0.5
    # Change often and are of no use in the history; keep the recorder small.
    _unrecorded_attributes = frozenset(
        {
            "room_id",
            "period",
            "hand_until",
            "next_change",
            "next_temperature",
            "trvs",
            "trv_deviations",
        }
    )

    def __init__(self, controller: RoomController) -> None:
        """Initialize."""
        super().__init__(controller, "climate")

    async def async_added_to_hass(self) -> None:
        """Remember our entity id for the card."""
        await super().async_added_to_hass()
        self.controller.climate_entity_id = self.entity_id

    @property
    def _simple(self) -> bool:
        """Apple Home / Matter compatible modes: heat (= schedule) and off."""
        return self.controller.hub.simple_modes

    @property
    def hvac_modes(self) -> list[HVACMode]:
        """Available modes."""
        if self._simple:
            return [HVACMode.HEAT, HVACMode.OFF]
        return [HVACMode.AUTO, HVACMode.HEAT, HVACMode.OFF]

    @property
    def hvac_mode(self) -> HVACMode:
        """Current mode."""
        if self._simple:
            return HVACMode.OFF if self.controller.mode == MODE_OFF else HVACMode.HEAT
        return MODE_TO_HVAC[self.controller.mode]

    def _apply_hvac_mode(self, hvac_mode: HVACMode) -> None:
        if self._simple and hvac_mode in (HVACMode.HEAT, HVACMode.AUTO):
            # "Heat" means: follow the schedule. Already following it (possibly
            # through a period)? Then keep everything as it is.
            if self.controller.mode != MODE_AUTO:
                self.controller.set_mode(MODE_AUTO)
            return
        self.controller.set_mode(HVAC_TO_MODE[hvac_mode])

    @property
    def hvac_action(self) -> HVACAction | None:
        """Heating if one TRV heats."""
        return self.controller.hvac_action

    @property
    def current_temperature(self) -> float | None:
        """Average of the TRVs."""
        return self.controller.current_temperature

    @property
    def target_temperature(self) -> float | None:
        """Effective target."""
        return self.controller.target_temperature

    @property
    def min_temp(self) -> float:
        """Intersection of TRV limits."""
        return self.controller.limits()[0]

    @property
    def max_temp(self) -> float:
        """Intersection of TRV limits."""
        return self.controller.limits()[1]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Extra info for cards and automations."""
        controller = self.controller
        target = controller.target()
        nxt = controller.next_change()
        return {
            "room_id": controller.entry_id,
            "active_schedule": controller.active_schedule.name,
            "period": controller.period_dict(p) if (p := controller.active_period) else None,
            "target_source": target.source,
            "override_active": controller.override_active,
            "hand_until": controller.state.hand_until if controller.hand_active else None,
            "next_change": nxt[0] if nxt else None,
            "next_temperature": nxt[1] if nxt else None,
            "trvs": controller.trvs,
            "trv_deviations": controller.deviations_list(),
        }

    async def async_set_temperature(self, **kwargs: Any) -> None:
        """Set a temperature for the room."""
        if (mode := kwargs.get(ATTR_HVAC_MODE)) is not None:
            if not self._simple:
                self.controller.set_mode(HVAC_TO_MODE[HVACMode(mode)], kwargs.get(ATTR_TEMPERATURE))
                return
            self._apply_hvac_mode(HVACMode(mode))
        if (temperature := kwargs.get(ATTR_TEMPERATURE)) is not None:
            self.controller.set_temperature(temperature)

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        """Change the mode."""
        self._apply_hvac_mode(hvac_mode)

    async def async_turn_on(self) -> None:
        """Turn on = follow the schedule."""
        self.controller.set_mode(MODE_AUTO)

    async def async_turn_off(self) -> None:
        """Turn off = frost protection."""
        self.controller.set_mode(MODE_OFF)
