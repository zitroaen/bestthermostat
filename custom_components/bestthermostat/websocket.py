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
        "rooms": sorted(
            (c.as_dict() for c in hub.controllers.values()), key=lambda r: r["name"].casefold()
        ),
        "variables": [v.to_dict() for v in hub.variables.values()],
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
    """Copy a schedule to other rooms (same name: replaced, otherwise created)."""
    source = _room(hass, entry_id)
    sched = source.find_schedule(schedule_id)
    week = sched.week.to_dict()
    created, replaced = [], []
    for target_id in targets:
        if target_id == entry_id:
            continue
        target = _room(hass, target_id)
        try:
            existing = target.find_schedule(sched.name)
        except HomeAssistantError:
            target.create_schedule(sched.name, week=week)
            created.append(target.name)
        else:
            target.save_week(existing.id, week)
            replaced.append(target.name)
    return {"created": created, "replaced": replaced}


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
