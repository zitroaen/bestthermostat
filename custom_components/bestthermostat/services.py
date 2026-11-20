"""Services of Best Thermostat."""

from __future__ import annotations

from typing import Any

from homeassistant.const import ATTR_TEMPERATURE
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv, entity_registry as er
from homeassistant.helpers.service import async_extract_referenced_entity_ids
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


def room_schema(fields: dict[Any, Any]) -> Any:
    """Schema of a room service: a target (entities, devices, areas, floors, labels)."""
    return cv.make_entity_service_schema(fields)


def rooms_for(hass: HomeAssistant, call: ServiceCall) -> list[RoomController]:
    """Resolve the target of a call (rooms, areas, floors, labels) to room controllers.

    An entity named explicitly must belong to a room; rooms found through an area,
    floor, label or device are used, anything else there is ignored.
    """
    hub = get_hub(hass)
    registry = er.async_get(hass)

    def controller(entity_id: str) -> RoomController | None:
        entry = registry.async_get(entity_id)
        return hub.controllers.get(entry.config_entry_id or "") if entry else None

    selected = async_extract_referenced_entity_ids(hass, call)
    rooms: dict[str, RoomController] = {}
    for entity_id in sorted(selected.referenced):
        if (room := controller(entity_id)) is None:
            raise ServiceValidationError(f"{entity_id} is not a Best Thermostat room")
        rooms.setdefault(room.entry_id, room)
    for entity_id in sorted(selected.indirectly_referenced):
        if (room := controller(entity_id)) is not None:
            rooms.setdefault(room.entry_id, room)
    if not rooms:
        raise ServiceValidationError("The target contains no Best Thermostat room")
    return sorted(rooms.values(), key=lambda r: r.name.casefold())


def async_register_services(hass: HomeAssistant) -> None:
    """Register all services."""
    hub = get_hub(hass)

    async def set_active_schedule(call: ServiceCall) -> None:
        for room in rooms_for(hass, call):
            room.set_active_schedule(call.data[ATTR_SCHEDULE])

    async def set_mode(call: ServiceCall) -> None:
        for room in rooms_for(hass, call):
            room.set_mode(call.data[ATTR_MODE], call.data.get(ATTR_TEMPERATURE))

    async def get_schedule(call: ServiceCall) -> ServiceResponse:
        result: dict[str, Any] = {}
        for room in rooms_for(hass, call):
            data = room.as_dict()
            if key := call.data.get(ATTR_SCHEDULE):
                sched = room.find_schedule(key)
                data["schedules"] = [s for s in data["schedules"] if s["id"] == sched.id]
            result[room.climate_entity_id or room.entry_id] = data
        return {"rooms": result, "variables": [v.to_dict() for v in hub.variables.values()]}

    async def set_schedule(call: ServiceCall) -> None:
        for room in rooms_for(hass, call):
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
        rooms = rooms_for(hass, call)
        fields: dict[str, Any] = {
            "start": start,
            "end": end,
            "schedule": call.data.get(ATTR_SCHEDULE),
            "mode": call.data.get(ATTR_MODE),
            "temperature": call.data.get(ATTR_TEMPERATURE),
            "summary": call.data.get(ATTR_SUMMARY),
        }
        if len(rooms) > 1:  # planned together: one group, edited and cancelled together
            pairs = hub.add_group_period([r.entry_id for r in rooms], **fields)
        else:
            pairs = [(rooms[0], rooms[0].add_period(**fields))]
        return {"periods": [{"room": r.climate_entity_id, **r.period_dict(p)} for r, p in pairs]}

    async def update_period(call: ServiceCall) -> ServiceResponse:
        start = call.data.get(ATTR_START)
        end = call.data.get(ATTR_END)
        if (duration := call.data.get(ATTR_DURATION)) is not None:
            if end is not None:
                raise ServiceValidationError("Use either end or duration, not both")
            room = rooms_for(hass, call)[0]
            end = (start or room.find_period(call.data[ATTR_PERIOD_ID]).start) + duration
        result: list[Any] = []
        for room in rooms_for(hass, call):
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
        for room in rooms_for(hass, call):
            room.cancel_period(call.data.get(ATTR_PERIOD_ID))

    temp = vol.All(vol.Coerce(float), vol.Range(min=MIN_TEMP, max=MAX_TEMP))
    hass.services.async_register(
        DOMAIN,
        "add_period",
        add_period,
        room_schema(
            {
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
        room_schema(
            {
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
        room_schema({vol.Optional(ATTR_PERIOD_ID): cv.string}),
    )
    hass.services.async_register(
        DOMAIN,
        "set_active_schedule",
        set_active_schedule,
        room_schema({vol.Required(ATTR_SCHEDULE): cv.string}),
    )
    hass.services.async_register(
        DOMAIN,
        "set_mode",
        set_mode,
        room_schema(
            {
                vol.Required(ATTR_MODE): vol.In(MODES),
                vol.Optional(ATTR_TEMPERATURE): temp,
            }
        ),
    )
    hass.services.async_register(
        DOMAIN,
        "get_schedule",
        get_schedule,
        room_schema({vol.Optional(ATTR_SCHEDULE): cv.string}),
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        "set_schedule",
        set_schedule,
        room_schema({vol.Required(ATTR_SCHEDULE): cv.string, vol.Required(ATTR_WEEK): dict}),
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
