"""Global state: variables, override, persistence and room registry."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime
import logging
from typing import TYPE_CHECKING, Any
import uuid

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store
from homeassistant.util import slugify

from .const import DEFAULT_VARIABLES, DOMAIN, SIGNAL_UPDATE, STORAGE_KEY, STORAGE_VERSION
from .i18n import text
from .schedule import (
    GLOBAL_ID_PREFIX,
    GlobalOverride,
    Period,
    ScheduleError,
    SharedSchedule,
    Week,
    default_week,
    validate_temperature,
)
from .sender import Sender

if TYPE_CHECKING:
    from .room import RoomController

_LOGGER = logging.getLogger(__name__)


@dataclass
class Variable:
    """A user defined global temperature."""

    id: str
    name: str
    value: float

    def to_dict(self) -> dict[str, Any]:
        """Serialize."""
        return {"id": self.id, "name": self.name, "value": self.value}


def get_hub(hass: HomeAssistant) -> Hub:
    """Return the hub."""
    hub: Hub = hass.data[DOMAIN]
    return hub


class Hub:
    """Holds all state shared between rooms."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize."""
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.sender = Sender(hass)
        self.variables: dict[str, Variable] = {}
        self.override = GlobalOverride()
        self.rooms_data: dict[str, dict[str, Any]] = {}
        # Global schedules. The rooms hold a reference to this dict: never reassign it.
        self.schedules: dict[str, SharedSchedule] = {}
        self.controllers: dict[str, RoomController] = {}
        self.global_entry_id: str | None = None
        self.simple_modes = False

    async def async_load(self) -> None:
        """Load persisted data."""
        data = await self._store.async_load() or {}
        raw_vars = data.get("variables")
        if raw_vars is None:
            raw_vars = [
                {"id": vid, "name": text(self.hass, key), "value": value}
                for vid, (key, value) in DEFAULT_VARIABLES.items()
            ]
        self.variables = {
            v["id"]: Variable(v["id"], v["name"], float(v["value"])) for v in raw_vars
        }
        ov = data.get("override", {})
        self.override = GlobalOverride(
            active=bool(ov.get("active", False)),
            temperature=float(ov.get("temperature", 16.0)),
            variable=ov.get("variable"),
            include_manual=bool(ov.get("include_manual", ov.get("all_modes", False))),
            include_off=bool(ov.get("include_off", ov.get("all_modes", False))),
        )
        self.rooms_data = dict(data.get("rooms", {}))
        self.schedules.clear()
        for item in data.get("schedules", []):
            try:
                sched = SharedSchedule.from_dict(item)
            except (ScheduleError, KeyError, TypeError) as err:
                _LOGGER.error("Dropping invalid global schedule %s: %s", item.get("name"), err)
                continue
            self.schedules[sched.id] = sched

    def _data(self) -> dict[str, Any]:
        for entry_id, controller in self.controllers.items():
            self.rooms_data[entry_id] = controller.state_to_dict()
        return {
            "variables": [v.to_dict() for v in self.variables.values()],
            "override": {
                "active": self.override.active,
                "temperature": self.override.temperature,
                "variable": self.override.variable,
                "include_manual": self.override.include_manual,
                "include_off": self.override.include_off,
            },
            "rooms": self.rooms_data,
            "schedules": [s.to_dict() for s in self.schedules.values()],
        }

    @callback
    def save(self) -> None:
        """Schedule saving."""
        self._store.async_delay_save(self._data, 1)

    async def async_save_now(self) -> None:
        """Save immediately."""
        await self._store.async_save(self._data())

    # ---------------------------------------------------------------- notify

    @callback
    def notify(self, entry_id: str | None = None) -> None:
        """Tell entities and websocket subscribers about a change."""
        async_dispatcher_send(self.hass, SIGNAL_UPDATE, entry_id)

    @callback
    def apply_all(self) -> None:
        """Re-evaluate all rooms after a global change."""
        for controller in self.controllers.values():
            controller.apply()
            controller.notify_entities()
        self.notify(None)  # one update for the cards instead of one per room

    # ------------------------------------------------------------- variables

    def variable_values(self) -> dict[str, float]:
        """Return variable id -> value."""
        return {vid: v.value for vid, v in self.variables.items()}

    def find_variable(self, key: str) -> Variable:
        """Find a variable by id or (case-insensitive) name."""
        if key in self.variables:
            return self.variables[key]
        for var in self.variables.values():
            if var.name.casefold() == key.casefold():
                return var
        raise HomeAssistantError(f"Unknown variable {key!r}")

    def create_variable(self, name: str, value: float) -> Variable:
        """Create a variable."""
        name = name.strip()
        if not name:
            raise HomeAssistantError("Variable name must not be empty")
        if any(v.name.casefold() == name.casefold() for v in self.variables.values()):
            raise HomeAssistantError(f"Variable {name!r} already exists")
        base = slugify(name) or "variable"
        vid, i = base, 2
        while vid in self.variables:
            vid, i = f"{base}_{i}", i + 1
        var = Variable(vid, name, self._temp(value))
        self.variables[vid] = var
        self.save()
        self._variables_structure_changed()
        self.notify(None)
        return var

    def update_variable(
        self, vid: str, *, name: str | None = None, value: float | None = None
    ) -> None:
        """Update name and/or value of a variable."""
        var = self.find_variable(vid)
        if name is not None:
            name = name.strip()
            if not name:
                raise HomeAssistantError("Variable name must not be empty")
            if any(
                v.name.casefold() == name.casefold() and v.id != var.id
                for v in self.variables.values()
            ):
                raise HomeAssistantError(f"Variable {name!r} already exists")
            var.name = name
        if value is not None:
            var.value = self._temp(value)
        self.save()
        if name is not None:
            self._variables_structure_changed()
        self.apply_all()

    def variable_usage(self, vid: str) -> list[str]:
        """Return human readable places where a variable is used."""
        usages: list[str] = []
        for shared in self.schedules.values():
            if vid in shared.week.variables():
                usages.append(shared.name)
        for entry_id in set(self.rooms_data) | set(self.controllers):
            data = self.rooms_data.get(entry_id, {})
            controller = self.controllers.get(entry_id)
            if controller is not None:
                for sched in controller.state.schedules.values():
                    if vid in sched.week.variables():
                        usages.append(f"{controller.name}: {sched.name}")
                continue
            entry = self.hass.config_entries.async_get_entry(entry_id)
            room = entry.title if entry else "?"
            for sched in data.get("schedules", []):
                for day in sched.get("week", {}).values():
                    if any(slot.get("variable") == vid for slot in day):
                        usages.append(f"{room}: {sched.get('name', '?')}")
                        break
        if self.override.variable == vid:
            usages.append("Override")
        return usages

    def delete_variable(self, vid: str) -> None:
        """Delete a variable unless it is still used."""
        var = self.find_variable(vid)
        if usage := self.variable_usage(var.id):
            raise HomeAssistantError(f"Variable {var.name!r} is still used in: {', '.join(usage)}")
        del self.variables[var.id]
        self.save()
        self._variables_structure_changed()
        self.notify(None)

    def _variables_structure_changed(self) -> None:
        if self.global_entry_id:
            self.hass.config_entries.async_schedule_reload(self.global_entry_id)

    @staticmethod
    def _temp(value: float) -> float:
        try:
            return validate_temperature(value)
        except ScheduleError as err:
            raise HomeAssistantError(str(err)) from err

    # -------------------------------------------------------------- override

    def set_override(
        self,
        *,
        active: bool | None = None,
        temperature: float | None = None,
        variable: str | None = None,
        include_manual: bool | None = None,
        include_off: bool | None = None,
        all_modes: bool | None = None,
    ) -> None:
        """Change the global override."""
        if variable is not None:
            self.override.variable = self.find_variable(variable).id
        if temperature is not None:
            self.override.temperature = self._temp(temperature)
            if variable is None:
                self.override.variable = None
        if all_modes is not None:
            self.override.include_manual = all_modes
            self.override.include_off = all_modes
        if include_manual is not None:
            self.override.include_manual = include_manual
        if include_off is not None:
            self.override.include_off = include_off
        if active is not None:
            self.override.active = active
        self.save()
        self.apply_all()

    def override_value(self) -> float | None:
        """Return the current override temperature."""
        return self.override.value(self.variable_values())

    # ------------------------------------------------------ global schedules

    def parse_week(self, raw: Any) -> Week:
        """Validate a weekly plan and the variables it references."""
        try:
            week = Week.from_dict(raw)
        except ScheduleError as err:
            raise HomeAssistantError(str(err)) from err
        unknown = week.variables() - set(self.variables)
        if unknown:
            raise HomeAssistantError(f"Unknown variables: {', '.join(sorted(unknown))}")
        return week

    def find_global(self, key: str) -> SharedSchedule:
        """Find a global schedule by id or (case-insensitive) name."""
        if key in self.schedules:
            return self.schedules[key]
        for sched in self.schedules.values():
            if sched.name.casefold() == key.casefold():
                return sched
        raise HomeAssistantError(f"Unknown global schedule {key!r}")

    def _room(self, entry_id: str) -> RoomController:
        controller = self.controllers.get(entry_id)
        if controller is None:
            raise HomeAssistantError(f"Unknown room {entry_id}")
        return controller

    def _rooms_set(self, rooms: Iterable[str] | None) -> set[str] | None:
        if rooms is None:
            return None
        result = set(rooms)
        for entry_id in result:
            if entry_id not in self.controllers and entry_id not in self.rooms_data:
                raise HomeAssistantError(f"Unknown room {entry_id}")
        return result

    def _check_global_name(
        self,
        name: str,
        rooms: set[str] | None,
        *,
        ignore: str | None = None,
        merging: dict[str, str] | None = None,
    ) -> str:
        """A global name must be unique and must not clash with a room's own schedule."""
        name = name.strip()
        if not name:
            raise HomeAssistantError("Schedule name must not be empty")
        if any(
            s.id != ignore and s.name.casefold() == name.casefold() for s in self.schedules.values()
        ):
            raise HomeAssistantError(f"Schedule {name!r} already exists")
        merging = merging or {}
        clashes = [
            c.name
            for c in self.controllers.values()
            if (rooms is None or c.entry_id in rooms)
            and c.local_name_conflict(name, ignore=merging.get(c.entry_id))
        ]
        if clashes:
            raise HomeAssistantError(
                f"These rooms have an own schedule named {name!r}: {', '.join(sorted(clashes))}"
            )
        return name

    def _new_global_id(self, name: str) -> str:
        base = GLOBAL_ID_PREFIX + (slugify(name) or "plan")
        sid, i = base, 2
        while sid in self.schedules:
            sid, i = f"{base}_{i}", i + 1
        return sid

    @callback
    def _schedules_changed(self) -> None:
        """A global schedule changed: re-evaluate every room once and tell the cards."""
        self.save()
        for controller in self.controllers.values():
            controller.refresh()
        self.notify(None)

    @callback
    def create_global(
        self,
        name: str,
        *,
        week: Any = None,
        copy_from: str | None = None,
        rooms: Iterable[str] | None = None,
    ) -> SharedSchedule:
        """Create a global schedule (visible in ``rooms``; None = all rooms)."""
        room_set = self._rooms_set(rooms)
        name = self._check_global_name(name, room_set)
        if week is not None:
            parsed = self.parse_week(week)
        elif copy_from is not None:
            parsed = self.find_global(copy_from).week
        else:
            parsed = default_week()
        sched = SharedSchedule(self._new_global_id(name), name, parsed, rooms=room_set)
        self.schedules[sched.id] = sched
        self._schedules_changed()
        return sched

    @callback
    def rename_global(self, key: str, name: str) -> None:
        """Rename a global schedule."""
        sched = self.find_global(key)
        sched.name = self._check_global_name(name, sched.rooms, ignore=sched.id)
        self._schedules_changed()

    @callback
    def save_global_week(self, key: str, raw_week: Any) -> None:
        """Replace the plan of a global schedule (applies to every room using it)."""
        sched = self.find_global(key)
        sched.week = self.parse_week(raw_week)
        self._schedules_changed()

    def ensure_visible(self, sched: SharedSchedule, entry_id: str) -> None:
        """Make a schedule available in a room without checks (repairs stored data)."""
        if sched.rooms is not None and entry_id not in sched.rooms:
            sched.rooms.add(entry_id)
            self.save()

    def make_visible(self, sched: SharedSchedule, entry_id: str) -> None:
        """Make a schedule available in a room (fails on a name clash)."""
        if sched.visible_to(entry_id):
            return
        controller = self.controllers.get(entry_id)
        if controller is not None and controller.local_name_conflict(sched.name):
            raise HomeAssistantError(f"{controller.name} has an own schedule named {sched.name!r}")
        self.ensure_visible(sched, entry_id)

    @callback
    def set_global_rooms(self, key: str, rooms: Iterable[str] | None) -> None:
        """Choose the rooms that offer a global schedule (None = all rooms).

        A room whose active schedule it is keeps it: activate another one there first.
        """
        sched = self.find_global(key)
        room_set = self._rooms_set(rooms)
        if room_set is not None:
            active_in = [
                c.name
                for c in self.controllers.values()
                if c.state.active_schedule == sched.id and c.entry_id not in room_set
            ]
            if active_in:
                raise HomeAssistantError(
                    f"{sched.name!r} is active in {', '.join(sorted(active_in))}; "
                    "activate another schedule there first"
                )
        self._check_global_name(sched.name, room_set, ignore=sched.id)
        sched.rooms = room_set
        self._schedules_changed()

    @callback
    def assign_global(self, key: str, entry_ids: Iterable[str]) -> None:
        """Activate a global schedule in several rooms (makes it available there)."""
        sched = self.find_global(key)
        rooms = [self._room(e) for e in entry_ids]
        for room in rooms:  # check every room before changing any
            if not sched.visible_to(room.entry_id) and room.local_name_conflict(sched.name):
                raise HomeAssistantError(f"{room.name} has an own schedule named {sched.name!r}")
        for room in rooms:
            room.set_active_schedule(sched.id)

    def global_usage(self, schedule_id: str) -> dict[str, list[str]]:
        """Rooms (entry ids) whose active schedule or periods use a global schedule."""
        active, periods = [], []
        for entry_id, controller in self.controllers.items():
            if controller.state.active_schedule == schedule_id:
                active.append(entry_id)
            if any(p.schedule == schedule_id for p in controller.state.periods):
                periods.append(entry_id)
        return {"active": active, "periods": periods}

    @callback
    def delete_global(self, key: str) -> dict[str, Any]:
        """Delete a global schedule.

        Rooms that use it as their active schedule are switched off; periods that use
        it are removed (decided on purpose, see docs/decisions.md).
        """
        sched = self.find_global(key)
        switched_off: list[str] = []
        removed = 0
        for controller in self.controllers.values():
            off, count = controller.drop_global(sched.id)
            removed += count
            if off:
                switched_off.append(controller.name)
        for entry_id, raw in self.rooms_data.items():  # rooms that are not loaded
            if entry_id in self.controllers:
                continue
            periods = raw.get("periods", [])
            raw["periods"] = [p for p in periods if p.get("schedule") != sched.id]
            removed += len(periods) - len(raw["periods"])
            if raw.get("active_schedule") == sched.id:
                local = raw.get("schedules") or []
                if not local:
                    local = [{"id": "plan", "name": sched.name, "week": sched.week.to_dict()}]
                    raw["schedules"] = local
                raw["active_schedule"] = local[0]["id"]
                raw["mode"] = "off"
        del self.schedules[sched.id]
        self._schedules_changed()
        return {"switched_off": sorted(switched_off), "periods_removed": removed}

    @callback
    def make_global(
        self,
        entry_id: str,
        schedule_id: str,
        merge: Iterable[tuple[str, str]] = (),
        *,
        all_rooms: bool = False,
    ) -> SharedSchedule:
        """Turn a room's own schedule into a global one.

        ``merge`` lists (room, schedule) pairs with the same plan that are replaced by
        the new global schedule. It is offered in the source room and the merged rooms,
        or in all rooms with ``all_rooms``.
        """
        source = self._room(entry_id)
        sched = source.find_schedule(schedule_id)
        if source.is_global(sched.id):
            raise HomeAssistantError(f"{sched.name!r} is already global")
        pairs: dict[str, str] = {entry_id: sched.id}
        for other_id, other_sched in merge:
            if other_id == entry_id:
                continue
            other = self._room(other_id)
            local = other.state.schedules.get(other_sched)
            if local is None:
                raise HomeAssistantError(f"{other.name}: unknown schedule {other_sched!r}")
            if local.week != sched.week:
                raise HomeAssistantError(f"{other.name}: {local.name!r} has a different plan")
            pairs[other_id] = local.id
        rooms = None if all_rooms else set(pairs)
        name = self._check_global_name(sched.name, rooms, merging=pairs)
        shared = SharedSchedule(self._new_global_id(name), name, sched.week, rooms=rooms)
        self.schedules[shared.id] = shared
        for room_id, local_id in pairs.items():
            self.controllers[room_id].replace_schedule(local_id, shared.id)
        self._schedules_changed()
        return shared

    # ------------------------------------------------------------ group periods

    def _group_rooms(self, group: str) -> list[RoomController]:
        rooms = [
            c for c in self.controllers.values() if any(p.group == group for p in c.state.periods)
        ]
        if not rooms:
            raise HomeAssistantError(f"Unknown period group {group!r}")
        return rooms

    @callback
    def add_group_period(
        self,
        entry_ids: Iterable[str],
        *,
        start: datetime | None = None,
        end: datetime | None = None,
        schedule: str | None = None,
        mode: str | None = None,
        temperature: float | None = None,
        summary: str | None = None,
    ) -> list[tuple[RoomController, Period]]:
        """Plan the same period for several rooms; they share one id (the group)."""
        rooms = list(dict.fromkeys(self._room(e) for e in entry_ids))
        if not rooms:
            raise HomeAssistantError("Choose at least one room")
        group = uuid.uuid4().hex[:12]
        kwargs: dict[str, Any] = {
            "start": start,
            "end": end,
            "schedule": schedule,
            "mode": mode,
            "temperature": temperature,
            "summary": summary,
            "group": group,
        }
        for room in rooms:  # validate everything before changing anything
            room.add_period(**kwargs, validate_only=True)
        return [(room, room.add_period(**kwargs)) for room in rooms]

    @callback
    def update_group_period(self, group: str, **kwargs: Any) -> list[tuple[RoomController, Period]]:
        """Change a period in every room of its group."""
        rooms = self._group_rooms(group)
        for room in rooms:  # validate everything before changing anything
            room.update_period(group, **kwargs, validate_only=True)
        return [(room, room.update_period(group, **kwargs)) for room in rooms]

    @callback
    def cancel_group_period(self, group: str) -> int:
        """Cancel a period in every room of its group. Returns the number of rooms."""
        rooms = self._group_rooms(group)
        for room in rooms:
            room.cancel_period(group)
        return len(rooms)

    # ----------------------------------------------------------------- rooms

    def remove_room(self, entry_id: str) -> None:
        """Forget all data of a deleted room."""
        self.rooms_data.pop(entry_id, None)
        for sched in self.schedules.values():
            if sched.rooms is not None:
                sched.rooms.discard(entry_id)
        self.save()

    @callback
    def async_shutdown(self) -> None:
        """Stop background work."""
        self.sender.async_shutdown()
