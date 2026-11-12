"""Services of Best Thermostat."""

from __future__ import annotations

from typing import Any

from homeassistant.const import ATTR_ENTITY_ID, ATTR_TEMPERATURE
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv, entity_registry as er
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import DOMAIN
from .hub import get_hub
from .room import RoomController
from .schedule import MAX_TEMP, MIN_TEMP, MODES

ATTR_SCHEDULE = "schedule"
ATTR_MODE = "mode"
ATTR_WEEK = "week"
ATTR_VARIABLE = "variable"
ATTR_VALUE = "value"
ATTR_ACTIVE = "active"
ATTR_ALL_MODES = "all_modes"
ATTR_INCLUDE_MANUAL = "include_manual"
ATTR_INCLUDE_OFF = "include_off"
ATTR_NAME = "name"
ATTR_START = "start"
ATTR_END = "end"
ATTR_DURATION = "duration"
ATTR_PERIOD_ID = "period_id"
ATTR_SUMMARY = "summary"
ATTR_OPEN_END = "open_end"

ROOM_SCHEMA: dict[Any, Any] = {vol.Required(ATTR_ENTITY_ID): cv.comp_entity_ids}


def rooms_for(hass: HomeAssistant, entity_ids: list[str]) -> list[RoomController]:
    """Resolve climate entity ids of rooms to their controllers."""
    hub = get_hub(hass)
    registry = er.async_get(hass)
    rooms: list[RoomController] = []
    for entity_id in entity_ids:
        entry = registry.async_get(entity_id)
        controller = hub.controllers.get(entry.config_entry_id or "") if entry else None
        if controller is None:
            raise ServiceValidationError(f"{entity_id} is not a Best Thermostat room")
        rooms.append(controller)
    return rooms


def async_register_services(hass: HomeAssistant) -> None:
    """Register all services."""
    hub = get_hub(hass)

    async def set_active_schedule(call: ServiceCall) -> None:
        for room in rooms_for(hass, call.data[ATTR_ENTITY_ID]):
            room.set_active_schedule(call.data[ATTR_SCHEDULE])

    async def set_mode(call: ServiceCall) -> None:
        for room in rooms_for(hass, call.data[ATTR_ENTITY_ID]):
            room.set_mode(call.data[ATTR_MODE], call.data.get(ATTR_TEMPERATURE))

    async def get_schedule(call: ServiceCall) -> ServiceResponse:
        result: dict[str, Any] = {}
        for room in rooms_for(hass, call.data[ATTR_ENTITY_ID]):
            data = room.as_dict()
            if key := call.data.get(ATTR_SCHEDULE):
                sched = room.find_schedule(key)
                data["schedules"] = [s for s in data["schedules"] if s["id"] == sched.id]
            result[room.climate_entity_id or room.entry_id] = data
        return {"rooms": result, "variables": [v.to_dict() for v in hub.variables.values()]}

    async def set_schedule(call: ServiceCall) -> None:
        for room in rooms_for(hass, call.data[ATTR_ENTITY_ID]):
            key = call.data[ATTR_SCHEDULE]
            try:
                room.find_schedule(key)
            except HomeAssistantError:  # unknown schedule: create it
                room.create_schedule(key, week=call.data[ATTR_WEEK])
            else:
                room.save_week(key, call.data[ATTR_WEEK])

    async def set_variable(call: ServiceCall) -> None:
        hub.update_variable(
            call.data[ATTR_VARIABLE], value=call.data.get(ATTR_VALUE), name=call.data.get(ATTR_NAME)
        )

    async def set_global_override(call: ServiceCall) -> None:
        hub.set_override(
            active=call.data.get(ATTR_ACTIVE),
            temperature=call.data.get(ATTR_TEMPERATURE),
            variable=call.data.get(ATTR_VARIABLE),
            include_manual=call.data.get(ATTR_INCLUDE_MANUAL),
            include_off=call.data.get(ATTR_INCLUDE_OFF),
            all_modes=call.data.get(ATTR_ALL_MODES),
        )

    async def add_period(call: ServiceCall) -> ServiceResponse:
        start = call.data.get(ATTR_START)
        end = call.data.get(ATTR_END)
        if (duration := call.data.get(ATTR_DURATION)) is not None:
            if end is not None:
                raise ServiceValidationError("Use either end or duration, not both")
            end = (start or dt_util.now()) + duration
        result: list[Any] = []
        for room in rooms_for(hass, call.data[ATTR_ENTITY_ID]):
            period = room.add_period(
                start=start,
                end=end,
                schedule=call.data.get(ATTR_SCHEDULE),
                mode=call.data.get(ATTR_MODE),
                temperature=call.data.get(ATTR_TEMPERATURE),
                summary=call.data.get(ATTR_SUMMARY),
            )
            result.append({"room": room.climate_entity_id, **room.period_dict(period)})
        return {"periods": result}

    async def update_period(call: ServiceCall) -> ServiceResponse:
        start = call.data.get(ATTR_START)
        end = call.data.get(ATTR_END)
        if (duration := call.data.get(ATTR_DURATION)) is not None:
            if end is not None:
                raise ServiceValidationError("Use either end or duration, not both")
            room = rooms_for(hass, call.data[ATTR_ENTITY_ID])[0]
            end = (start or room.find_period(call.data[ATTR_PERIOD_ID]).start) + duration
        result: list[Any] = []
        for room in rooms_for(hass, call.data[ATTR_ENTITY_ID]):
            period = room.update_period(
                call.data[ATTR_PERIOD_ID],
                start=start,
                end=end,
                open_end=call.data.get(ATTR_OPEN_END, False),
                schedule=call.data.get(ATTR_SCHEDULE),
                mode=call.data.get(ATTR_MODE),
                temperature=call.data.get(ATTR_TEMPERATURE),
                summary=call.data.get(ATTR_SUMMARY),
            )
            result.append({"room": room.climate_entity_id, **room.period_dict(period)})
        return {"periods": result}

    async def cancel_period(call: ServiceCall) -> None:
        for room in rooms_for(hass, call.data[ATTR_ENTITY_ID]):
            room.cancel_period(call.data.get(ATTR_PERIOD_ID))

    temp = vol.All(vol.Coerce(float), vol.Range(min=MIN_TEMP, max=MAX_TEMP))
    hass.services.async_register(
        DOMAIN,
        "add_period",
        add_period,
        vol.Schema(
            {
                **ROOM_SCHEMA,
                vol.Optional(ATTR_SCHEDULE): cv.string,
                vol.Optional(ATTR_MODE): vol.In(MODES),
                vol.Optional(ATTR_TEMPERATURE): temp,
                vol.Optional(ATTR_START): cv.datetime,
                vol.Optional(ATTR_END): cv.datetime,
                vol.Optional(ATTR_DURATION): cv.positive_time_period,
                vol.Optional(ATTR_SUMMARY): cv.string,
            }
        ),
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        "update_period",
        update_period,
        vol.Schema(
            {
                **ROOM_SCHEMA,
                vol.Required(ATTR_PERIOD_ID): cv.string,
                vol.Optional(ATTR_SCHEDULE): cv.string,
                vol.Optional(ATTR_MODE): vol.In(MODES),
                vol.Optional(ATTR_TEMPERATURE): temp,
                vol.Optional(ATTR_START): cv.datetime,
                vol.Optional(ATTR_END): cv.datetime,
                vol.Optional(ATTR_DURATION): cv.positive_time_period,
                vol.Optional(ATTR_OPEN_END): cv.boolean,
                vol.Optional(ATTR_SUMMARY): cv.string,
            }
        ),
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        "cancel_period",
        cancel_period,
        vol.Schema({**ROOM_SCHEMA, vol.Optional(ATTR_PERIOD_ID): cv.string}),
    )
    hass.services.async_register(
        DOMAIN,
        "set_active_schedule",
        set_active_schedule,
        vol.Schema({**ROOM_SCHEMA, vol.Required(ATTR_SCHEDULE): cv.string}),
    )
    hass.services.async_register(
        DOMAIN,
        "set_mode",
        set_mode,
        vol.Schema(
            {
                **ROOM_SCHEMA,
                vol.Required(ATTR_MODE): vol.In(MODES),
                vol.Optional(ATTR_TEMPERATURE): temp,
            }
        ),
    )
    hass.services.async_register(
        DOMAIN,
        "get_schedule",
        get_schedule,
        vol.Schema({**ROOM_SCHEMA, vol.Optional(ATTR_SCHEDULE): cv.string}),
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        "set_schedule",
        set_schedule,
        vol.Schema(
            {**ROOM_SCHEMA, vol.Required(ATTR_SCHEDULE): cv.string, vol.Required(ATTR_WEEK): dict}
        ),
    )
    hass.services.async_register(
        DOMAIN,
        "set_variable",
        set_variable,
        vol.Schema(
            {
                vol.Required(ATTR_VARIABLE): cv.string,
                vol.Optional(ATTR_VALUE): temp,
                vol.Optional(ATTR_NAME): cv.string,
            }
        ),
    )
    hass.services.async_register(
        DOMAIN,
        "set_global_override",
        set_global_override,
        vol.Schema(
            {
                vol.Optional(ATTR_ACTIVE): cv.boolean,
                vol.Optional(ATTR_TEMPERATURE): temp,
                vol.Optional(ATTR_VARIABLE): cv.string,
                vol.Optional(ATTR_INCLUDE_MANUAL): cv.boolean,
                vol.Optional(ATTR_INCLUDE_OFF): cv.boolean,
                vol.Optional(ATTR_ALL_MODES): cv.boolean,
            }
        ),
    )
