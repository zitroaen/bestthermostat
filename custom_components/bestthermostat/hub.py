"""Global state: variables, override, persistence and room registry."""

from __future__ import annotations

from dataclasses import dataclass
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store
from homeassistant.util import slugify

from .const import DEFAULT_VARIABLES, DOMAIN, SIGNAL_UPDATE, STORAGE_KEY, STORAGE_VERSION
from .i18n import text
from .schedule import GlobalOverride, ScheduleError, validate_temperature
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

    # ----------------------------------------------------------------- rooms

    def remove_room(self, entry_id: str) -> None:
        """Forget all data of a deleted room."""
        self.rooms_data.pop(entry_id, None)
        self.save()

    @callback
    def async_shutdown(self) -> None:
        """Stop background work."""
        self.sender.async_shutdown()
