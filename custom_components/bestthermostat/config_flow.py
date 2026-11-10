"""Config and options flows."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er, selector
import voluptuous as vol

from .const import (
    CONF_ENTRY_TYPE,
    CONF_FROST_TEMPERATURE,
    CONF_HAND_CHANGE,
    CONF_HIDE_TRVS,
    CONF_SYNC_TRVS,
    CONF_TRVS,
    DEFAULT_FROST_TEMPERATURE,
    DEFAULT_HAND_CHANGE,
    DEFAULT_HIDE_TRVS,
    DEFAULT_SYNC_TRVS,
    DOMAIN,
    ENTRY_TYPE_GLOBAL,
    ENTRY_TYPE_ROOM,
    GLOBAL_UNIQUE_ID,
    HAND_CHANGE_OPTIONS,
    NAME,
)
from .hub import get_hub
from .visibility import async_unhide_trvs

TEMP_SELECTOR = selector.NumberSelector(
    selector.NumberSelectorConfig(
        min=4, max=30, step=0.5, unit_of_measurement="°C", mode=selector.NumberSelectorMode.BOX
    )
)


def _room_schema(defaults: dict[str, Any], *, with_name: bool) -> vol.Schema:
    fields: dict[Any, Any] = {}
    if with_name:
        fields[vol.Required(CONF_NAME, default=defaults.get(CONF_NAME, ""))] = (
            selector.TextSelector()
        )
    fields[vol.Required(CONF_TRVS, default=defaults.get(CONF_TRVS, []))] = selector.EntitySelector(
        selector.EntitySelectorConfig(domain="climate", multiple=True)
    )
    fields[
        vol.Required(
            CONF_FROST_TEMPERATURE,
            default=defaults.get(CONF_FROST_TEMPERATURE, DEFAULT_FROST_TEMPERATURE),
        )
    ] = TEMP_SELECTOR
    fields[
        vol.Required(CONF_HAND_CHANGE, default=defaults.get(CONF_HAND_CHANGE, DEFAULT_HAND_CHANGE))
    ] = selector.SelectSelector(
        selector.SelectSelectorConfig(
            options=HAND_CHANGE_OPTIONS,
            translation_key=CONF_HAND_CHANGE,
            mode=selector.SelectSelectorMode.LIST,
        )
    )
    fields[
        vol.Required(CONF_SYNC_TRVS, default=defaults.get(CONF_SYNC_TRVS, DEFAULT_SYNC_TRVS))
    ] = selector.BooleanSelector()
    fields[
        vol.Required(CONF_HIDE_TRVS, default=defaults.get(CONF_HIDE_TRVS, DEFAULT_HIDE_TRVS))
    ] = selector.BooleanSelector()
    return vol.Schema(fields)


def _validate_trvs(hass: HomeAssistant, trvs: list[str]) -> str | None:
    if not trvs:
        return "no_trvs"
    registry = er.async_get(hass)
    for entity_id in trvs:
        if (entry := registry.async_get(entity_id)) and entry.platform == DOMAIN:
            return "own_entity"
    return None


def _options(user_input: dict[str, Any]) -> dict[str, Any]:
    return {
        CONF_TRVS: list(user_input[CONF_TRVS]),
        CONF_FROST_TEMPERATURE: float(user_input[CONF_FROST_TEMPERATURE]),
        CONF_HAND_CHANGE: user_input[CONF_HAND_CHANGE],
        CONF_SYNC_TRVS: bool(user_input[CONF_SYNC_TRVS]),
        CONF_HIDE_TRVS: bool(user_input.get(CONF_HIDE_TRVS, DEFAULT_HIDE_TRVS)),
    }


class BestThermostatConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create rooms (and the global settings entry)."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Create a room."""
        errors: dict[str, str] = {}
        if user_input is not None:
            name = user_input[CONF_NAME].strip()
            if not name:
                errors[CONF_NAME] = "no_name"
            elif any(
                e.title.casefold() == name.casefold()
                for e in self._async_current_entries()
                if e.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_ROOM
            ):
                errors[CONF_NAME] = "name_exists"
            elif error := _validate_trvs(self.hass, user_input[CONF_TRVS]):
                errors[CONF_TRVS] = error
            if not errors:
                return self.async_create_entry(
                    title=name,
                    data={CONF_ENTRY_TYPE: ENTRY_TYPE_ROOM},
                    options=_options(user_input),
                )
        return self.async_show_form(
            step_id="user",
            data_schema=_room_schema(user_input or {}, with_name=True),
            errors=errors,
        )

    async def async_step_import(self, import_data: dict[str, Any]) -> ConfigFlowResult:
        """Create the global settings entry (triggered automatically)."""
        await self.async_set_unique_id(GLOBAL_UNIQUE_ID)
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title=NAME, data={CONF_ENTRY_TYPE: ENTRY_TYPE_GLOBAL})

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Return the options flow for the entry type."""
        if config_entry.data.get(CONF_ENTRY_TYPE) == ENTRY_TYPE_GLOBAL:
            return GlobalOptionsFlow()
        return RoomOptionsFlow()


class RoomOptionsFlow(OptionsFlow):
    """Change TRVs and behaviour of a room."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Edit the room."""
        errors: dict[str, str] = {}
        if user_input is not None:
            if error := _validate_trvs(self.hass, user_input[CONF_TRVS]):
                errors[CONF_TRVS] = error
            else:
                removed = set(self.config_entry.options.get(CONF_TRVS, [])) - set(
                    user_input[CONF_TRVS]
                )
                async_unhide_trvs(self.hass, list(removed))
                return self.async_create_entry(data=_options(user_input))
        defaults = {**self.config_entry.options, **(user_input or {})}
        return self.async_show_form(
            step_id="init", data_schema=_room_schema(defaults, with_name=False), errors=errors
        )


class GlobalOptionsFlow(OptionsFlow):
    """Manage global variables."""

    def __init__(self) -> None:
        """Initialize."""
        self._var_id: str | None = None

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show the menu."""
        return self.async_show_menu(
            step_id="init", menu_options=["add_variable", "edit_variable", "remove_variable"]
        )

    def _var_selector(self) -> selector.SelectSelector:
        hub = get_hub(self.hass)
        return selector.SelectSelector(
            selector.SelectSelectorConfig(
                options=[
                    selector.SelectOptionDict(value=v.id, label=f"{v.name} ({v.value} °C)")
                    for v in hub.variables.values()
                ]
            )
        )

    def _done(self) -> ConfigFlowResult:
        return self.async_create_entry(data=dict(self.config_entry.options))

    async def async_step_add_variable(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Add a variable."""
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                get_hub(self.hass).create_variable(user_input[CONF_NAME], user_input["value"])
            except HomeAssistantError:
                errors["base"] = "variable_invalid"
            else:
                return self._done()
        return self.async_show_form(
            step_id="add_variable",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_NAME): selector.TextSelector(),
                    vol.Required("value", default=20.0): TEMP_SELECTOR,
                }
            ),
            errors=errors,
        )

    async def async_step_edit_variable(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick a variable to edit."""
        if user_input is not None:
            self._var_id = user_input["variable"]
            return await self.async_step_edit_variable_values()
        return self.async_show_form(
            step_id="edit_variable",
            data_schema=vol.Schema({vol.Required("variable"): self._var_selector()}),
        )

    async def async_step_edit_variable_values(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit name and value."""
        hub = get_hub(self.hass)
        assert self._var_id is not None
        var = hub.variables[self._var_id]
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                hub.update_variable(var.id, name=user_input[CONF_NAME], value=user_input["value"])
            except HomeAssistantError:
                errors["base"] = "variable_invalid"
            else:
                return self._done()
        return self.async_show_form(
            step_id="edit_variable_values",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_NAME, default=var.name): selector.TextSelector(),
                    vol.Required("value", default=var.value): TEMP_SELECTOR,
                }
            ),
            errors=errors,
        )

    async def async_step_remove_variable(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Remove a variable (only if unused)."""
        errors: dict[str, str] = {}
        placeholders = {"usage": ""}
        if user_input is not None:
            hub = get_hub(self.hass)
            if usage := hub.variable_usage(user_input["variable"]):
                errors["base"] = "variable_in_use"
                placeholders["usage"] = ", ".join(usage)
            else:
                hub.delete_variable(user_input["variable"])
                return self._done()
        return self.async_show_form(
            step_id="remove_variable",
            data_schema=vol.Schema({vol.Required("variable"): self._var_selector()}),
            errors=errors,
            description_placeholders=placeholders,
        )
