"""WebSocket API used by the Lovelace card."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import datetime
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import DOMAIN, SIGNAL_UPDATE, VERSION
from .hub import get_hub
from .room import RoomController
from .schedule import MAX_TEMP, MIN_TEMP, TEMP_STEP

Connection = websocket_api.ActiveConnection

SNAPSHOT_DELAY = 0.15


SNAPSHOT_CACHE = f"{DOMAIN}_snapshot"


def _snapshot(hass: HomeAssistant) -> dict[str, Any]:
    """Full state for the cards, computed once per change for all subscribers."""
    if (cached := hass.data.get(SNAPSHOT_CACHE)) is not None:
        return cached  # type: ignore[no-any-return]
    snapshot = _build_snapshot(hass)
    hass.data[SNAPSHOT_CACHE] = snapshot
    return snapshot


def _build_snapshot(hass: HomeAssistant) -> dict[str, Any]:
    hub = get_hub(hass)
    return {
        "version": VERSION,
        "limits": {"min": MIN_TEMP, "max": MAX_TEMP, "step": TEMP_STEP},
        "rooms": sorted(
            (c.as_dict() for c in hub.controllers.values()), key=lambda r: r["name"].casefold()
        ),
        "variables": [v.to_dict() for v in hub.variables.values()],
        "global_schedules": [
            {**sched.to_dict(), **hub.global_usage(sched.id)} for sched in hub.schedules.values()
        ],
        "override": {
            "active": hub.override.active,
            "temperature": hub.override.temperature,
            "variable": hub.override.variable,
            "include_manual": hub.override.include_manual,
            "include_off": hub.override.include_off,
            "value": hub.override_value(),
        },
    }


def _dt(value: str | None) -> datetime | None:
    if not value:
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is None:
        raise HomeAssistantError(f"Invalid date/time {value!r}")
    return parsed


def _copy_to_rooms(
    hass: HomeAssistant, entry_id: str, schedule_id: str, targets: list[str]
) -> dict[str, Any]:
    """Copy a room's own schedule to other rooms (same name: replaced, else created)."""
    source = _room(hass, entry_id)
    sched = source.find_schedule(schedule_id)
    if source.is_global(sched.id):
        raise HomeAssistantError(f"{sched.name!r} is global and already shared")
    week = sched.week.to_dict()
    created, replaced = [], []
    for target_id in targets:
        if target_id == entry_id:
            continue
        target = _room(hass, target_id)
        existing = next(
            (
                s
                for s in target.state.schedules.values()
                if s.name.casefold() == sched.name.casefold()
            ),
            None,
        )
        if existing is None:
            target.create_schedule(sched.name, week=week)
            created.append(target.name)
        else:
            target.save_week(existing.id, week)
            replaced.append(target.name)
    return {"created": created, "replaced": replaced}


def _periods_result(pairs: list[tuple[RoomController, Any]]) -> dict[str, Any]:
    return {"periods": [{"entry_id": r.entry_id, **r.period_dict(p)} for r, p in pairs]}


def _period_fields(msg: dict[str, Any]) -> dict[str, Any]:
    return {
        "start": _dt(msg.get("start")),
        "end": _dt(msg.get("end")),
        "schedule": msg.get("schedule_id"),
        "mode": msg.get("mode"),
        "temperature": msg.get("temperature"),
        "summary": msg.get("summary"),
    }


def _room(hass: HomeAssistant, entry_id: str) -> RoomController:
    controller = get_hub(hass).controllers.get(entry_id)
    if controller is None:
        raise HomeAssistantError(f"Unknown room {entry_id}")
    return controller


def _handler(
    schema: dict[Any, Any],
    action: Callable[[HomeAssistant, dict[str, Any]], Any],
) -> Callable[[HomeAssistant, Connection, dict[str, Any]], None]:
    """Build a websocket command that runs ``action`` and returns its result."""

    @websocket_api.websocket_command(schema)
    @callback
    def _cmd(hass: HomeAssistant, connection: Connection, msg: dict[str, Any]) -> None:
        try:
            result = action(hass, msg)
        except HomeAssistantError as err:
            connection.send_error(msg["id"], "invalid", str(err))
            return
        connection.send_result(msg["id"], result)

    return _cmd


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@callback
def ws_subscribe(hass: HomeAssistant, connection: Connection, msg: dict[str, Any]) -> None:
    """Send the full state now and on every change."""

    pending: list[asyncio.TimerHandle | None] = [None]

    @callback
    def _send() -> None:
        pending[0] = None
        connection.send_message(websocket_api.event_message(msg["id"], _snapshot(hass)))

    @callback
    def _schedule(_entry_id: str | None = None) -> None:
        # Coalesce bursts (a global change touches every room, TRVs answer one
        # after another) into a single snapshot.
        if pending[0] is None:
            pending[0] = hass.loop.call_later(SNAPSHOT_DELAY, _send)

    unsub_dispatcher = async_dispatcher_connect(hass, SIGNAL_UPDATE, _schedule)

    @callback
    def _unsubscribe() -> None:
        unsub_dispatcher()
        if pending[0] is not None:
            pending[0].cancel()
            pending[0] = None

    connection.subscriptions[msg["id"]] = _unsubscribe
    connection.send_result(msg["id"])
    _send()


def async_register_websocket(hass: HomeAssistant) -> None:
    """Register all commands."""
    entry = vol.Required("entry_id")
    sched = vol.Required("schedule_id")
    t = f"{DOMAIN}/"

    def _ok(func: Callable[[HomeAssistant, dict[str, Any]], Any]) -> Callable[..., Any]:
        def wrapped(hass: HomeAssistant, msg: dict[str, Any]) -> Any:
            result = func(hass, msg)
            return {"ok": True} if result is None else result

        return wrapped

    commands = [
        _handler({vol.Required("type"): t + "state"}, lambda h, m: _snapshot(h)),
        _handler(
            {
                vol.Required("type"): t + "schedule/create",
                entry: str,
                vol.Required("name"): str,
                vol.Optional("copy_from"): str,
            },
            lambda h, m: (
                _room(h, m["entry_id"])
                .create_schedule(m["name"], copy_from=m.get("copy_from"))
                .to_dict()
            ),
        ),
        _handler(
            {
                vol.Required("type"): t + "schedule/rename",
                entry: str,
                sched: str,
                vol.Required("name"): str,
            },
            _ok(lambda h, m: _room(h, m["entry_id"]).rename_schedule(m["schedule_id"], m["name"])),
        ),
        _handler(
            {vol.Required("type"): t + "schedule/delete", entry: str, sched: str},
            _ok(lambda h, m: _room(h, m["entry_id"]).delete_schedule(m["schedule_id"])),
        ),
        _handler(
            {
                vol.Required("type"): t + "schedule/save",
                entry: str,
                sched: str,
                vol.Required("week"): dict,
            },
            _ok(lambda h, m: _room(h, m["entry_id"]).save_week(m["schedule_id"], m["week"])),
        ),
        _handler(
            {vol.Required("type"): t + "schedule/activate", entry: str, sched: str},
            _ok(lambda h, m: _room(h, m["entry_id"]).set_active_schedule(m["schedule_id"])),
        ),
        _handler(
            {
                vol.Required("type"): t + "room/mode",
                entry: str,
                vol.Required("mode"): str,
                vol.Optional("temperature"): vol.Coerce(float),
            },
            _ok(lambda h, m: _room(h, m["entry_id"]).set_mode(m["mode"], m.get("temperature"))),
        ),
        _handler(
            {
                vol.Required("type"): t + "room/temperature",
                entry: str,
                vol.Required("temperature"): vol.Coerce(float),
            },
            _ok(lambda h, m: _room(h, m["entry_id"]).set_temperature(m["temperature"])),
        ),
        _handler(
            {
                vol.Required("type"): t + "variable/create",
                vol.Required("name"): str,
                vol.Required("value"): vol.Coerce(float),
            },
            lambda h, m: get_hub(h).create_variable(m["name"], m["value"]).to_dict(),
        ),
        _handler(
            {
                vol.Required("type"): t + "variable/update",
                vol.Required("variable_id"): str,
                vol.Optional("name"): str,
                vol.Optional("value"): vol.Coerce(float),
            },
            _ok(
                lambda h, m: get_hub(h).update_variable(
                    m["variable_id"], name=m.get("name"), value=m.get("value")
                )
            ),
        ),
        _handler(
            {vol.Required("type"): t + "variable/delete", vol.Required("variable_id"): str},
            _ok(lambda h, m: get_hub(h).delete_variable(m["variable_id"])),
        ),
        _handler(
            {
                vol.Required("type"): t + "override/set",
                vol.Optional("active"): bool,
                vol.Optional("temperature"): vol.Coerce(float),
                vol.Optional("variable"): str,
                vol.Optional("include_manual"): bool,
                vol.Optional("include_off"): bool,
                vol.Optional("all_modes"): bool,
            },
            _ok(
                lambda h, m: get_hub(h).set_override(
                    active=m.get("active"),
                    temperature=m.get("temperature"),
                    variable=m.get("variable"),
                    include_manual=m.get("include_manual"),
                    include_off=m.get("include_off"),
                    all_modes=m.get("all_modes"),
                )
            ),
        ),
        _handler(
            {
                vol.Required("type"): t + "period/add",
                entry: str,
                vol.Optional("schedule_id"): str,
                vol.Optional("mode"): str,
                vol.Optional("temperature"): vol.Coerce(float),
                vol.Optional("start"): str,
                vol.Optional("end"): str,
                vol.Optional("summary"): str,
            },
            lambda h, m: _room(h, m["entry_id"]).period_dict(
                _room(h, m["entry_id"]).add_period(
                    start=_dt(m.get("start")),
                    end=_dt(m.get("end")),
                    schedule=m.get("schedule_id"),
                    mode=m.get("mode"),
                    temperature=m.get("temperature"),
                    summary=m.get("summary"),
                )
            ),
        ),
        _handler(
            {
                vol.Required("type"): t + "schedule/copy_to_rooms",
                entry: str,
                sched: str,
                vol.Required("targets"): [str],
            },
            lambda h, m: _copy_to_rooms(h, m["entry_id"], m["schedule_id"], m["targets"]),
        ),
        _handler(
            {
                vol.Required("type"): t + "global_schedule/create",
                vol.Required("name"): str,
                vol.Optional("copy_from"): str,
                vol.Optional("week"): dict,
                vol.Optional("rooms"): vol.Any(None, [str]),
            },
            lambda h, m: (
                get_hub(h)
                .create_global(
                    m["name"],
                    week=m.get("week"),
                    copy_from=m.get("copy_from"),
                    rooms=m.get("rooms"),
                )
                .to_dict()
            ),
        ),
        _handler(
            {
                vol.Required("type"): t + "global_schedule/rename",
                sched: str,
                vol.Required("name"): str,
            },
            _ok(lambda h, m: get_hub(h).rename_global(m["schedule_id"], m["name"])),
        ),
        _handler(
            {
                vol.Required("type"): t + "global_schedule/save",
                sched: str,
                vol.Required("week"): dict,
            },
            _ok(lambda h, m: get_hub(h).save_global_week(m["schedule_id"], m["week"])),
        ),
        _handler(
            {vol.Required("type"): t + "global_schedule/delete", sched: str},
            lambda h, m: get_hub(h).delete_global(m["schedule_id"]),
        ),
        _handler(
            {
                vol.Required("type"): t + "global_schedule/rooms",
                sched: str,
                vol.Required("rooms"): vol.Any(None, [str]),
            },
            _ok(lambda h, m: get_hub(h).set_global_rooms(m["schedule_id"], m["rooms"])),
        ),
        _handler(
            {
                vol.Required("type"): t + "global_schedule/assign",
                sched: str,
                vol.Required("entry_ids"): [str],
            },
            _ok(lambda h, m: get_hub(h).assign_global(m["schedule_id"], m["entry_ids"])),
        ),
        _handler(
            {
                vol.Required("type"): t + "schedule/make_global",
                entry: str,
                sched: str,
                vol.Optional("merge", default=[]): [
                    {vol.Required("entry_id"): str, vol.Required("schedule_id"): str}
                ],
                vol.Optional("all_rooms", default=False): bool,
            },
            lambda h, m: (
                get_hub(h)
                .make_global(
                    m["entry_id"],
                    m["schedule_id"],
                    [(x["entry_id"], x["schedule_id"]) for x in m["merge"]],
                    all_rooms=m["all_rooms"],
                )
                .to_dict()
            ),
        ),
        _handler(
            {
                vol.Required("type"): t + "period/add_group",
                vol.Required("entry_ids"): [str],
                vol.Optional("schedule_id"): str,
                vol.Optional("mode"): str,
                vol.Optional("temperature"): vol.Coerce(float),
                vol.Optional("start"): str,
                vol.Optional("end"): str,
                vol.Optional("summary"): str,
            },
            lambda h, m: _periods_result(
                get_hub(h).add_group_period(m["entry_ids"], **_period_fields(m))
            ),
        ),
        _handler(
            {
                vol.Required("type"): t + "period/update_group",
                vol.Required("group"): str,
                vol.Optional("schedule_id"): str,
                vol.Optional("mode"): str,
                vol.Optional("temperature"): vol.Coerce(float),
                vol.Optional("start"): str,
                vol.Optional("end"): str,
                vol.Optional("open_end"): bool,
                vol.Optional("summary"): str,
            },
            lambda h, m: _periods_result(
                get_hub(h).update_group_period(
                    m["group"], **_period_fields(m), open_end=m.get("open_end", False)
                )
            ),
        ),
        _handler(
            {vol.Required("type"): t + "period/cancel_group", vol.Required("group"): str},
            lambda h, m: {"rooms": get_hub(h).cancel_group_period(m["group"])},
        ),
        _handler(
            {
                vol.Required("type"): t + "period/update",
                entry: str,
                vol.Required("period_id"): str,
                vol.Optional("schedule_id"): str,
                vol.Optional("mode"): str,
                vol.Optional("temperature"): vol.Coerce(float),
                vol.Optional("start"): str,
                vol.Optional("end"): str,
                vol.Optional("open_end"): bool,
                vol.Optional("summary"): str,
            },
            lambda h, m: _room(h, m["entry_id"]).period_dict(
                _room(h, m["entry_id"]).update_period(
                    m["period_id"],
                    start=_dt(m.get("start")),
                    end=_dt(m.get("end")),
                    open_end=m.get("open_end", False),
                    schedule=m.get("schedule_id"),
                    mode=m.get("mode"),
                    temperature=m.get("temperature"),
                    summary=m.get("summary"),
                )
            ),
        ),
        _handler(
            {
                vol.Required("type"): t + "period/cancel",
                entry: str,
                vol.Optional("period_id"): str,
            },
            lambda h, m: {"removed": _room(h, m["entry_id"]).cancel_period(m.get("period_id"))},
        ),
    ]

    @callback
    def _invalidate(_entry_id: str | None = None) -> None:
        hass.data.pop(SNAPSHOT_CACHE, None)

    # Registered before any subscriber, so the cache is cleared before they rebuild it.
    async_dispatcher_connect(hass, SIGNAL_UPDATE, _invalidate)
    websocket_api.async_register_command(hass, ws_subscribe)
    for command in commands:
        websocket_api.async_register_command(hass, command)
