"""Pure schedule logic for Best Thermostat.

This module deliberately has no Home Assistant imports so that it can be
unit-tested in isolation. All datetimes passed in must be timezone aware.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field, replace
from datetime import UTC, date, datetime, time, timedelta, tzinfo
from functools import cached_property
import itertools
from typing import Any

DAYS: tuple[str, ...] = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
GRID_MINUTES = 15
TEMP_STEP = 0.5
MIN_TEMP = 4.0
MAX_TEMP = 35.0
MAX_SLOTS_PER_DAY = 48

MODE_AUTO = "auto"
MODE_HEAT = "heat"
MODE_OFF = "off"
MODES = (MODE_AUTO, MODE_HEAT, MODE_OFF)

SOURCE_OVERRIDE = "override"
SOURCE_OFF = "off"
SOURCE_MANUAL = "manual"
SOURCE_HAND = "hand"
SOURCE_SCHEDULE = "schedule"

DEFAULT_COMFORT_VAR = "comfort"
DEFAULT_ECO_VAR = "eco"


class ScheduleError(ValueError):
    """Raised when schedule data is invalid."""


def parse_hhmm(value: str) -> int:
    """Parse ``HH:MM`` into minutes since midnight (validated against the grid)."""
    if not isinstance(value, str) or len(value) != 5 or value[2] != ":":
        raise ScheduleError(f"Invalid time {value!r}, expected HH:MM")
    try:
        hours, minutes = int(value[:2]), int(value[3:])
    except ValueError as err:
        raise ScheduleError(f"Invalid time {value!r}") from err
    if not (0 <= hours <= 23 and 0 <= minutes <= 59):
        raise ScheduleError(f"Invalid time {value!r}")
    if minutes % GRID_MINUTES:
        raise ScheduleError(f"Time {value!r} is not on the {GRID_MINUTES} minute grid")
    return hours * 60 + minutes


def format_hhmm(minutes: int) -> str:
    """Format minutes since midnight as ``HH:MM``."""
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def validate_temperature(value: Any) -> float:
    """Validate a temperature (number in 0.5 steps within limits)."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ScheduleError(f"Invalid temperature {value!r}")
    temp = float(value)
    if not MIN_TEMP <= temp <= MAX_TEMP:
        raise ScheduleError(f"Temperature {temp} outside {MIN_TEMP}..{MAX_TEMP}")
    if abs(temp / TEMP_STEP - round(temp / TEMP_STEP)) > 1e-6:
        raise ScheduleError(f"Temperature {temp} is not a multiple of {TEMP_STEP}")
    return round(temp * 2) / 2


@dataclass(frozen=True)
class Slot:
    """A schedule slot. Valid from ``start`` until the next slot starts."""

    start: int
    temperature: float | None = None
    variable: str | None = None

    def to_dict(self) -> dict[str, Any]:
        """Serialize."""
        data: dict[str, Any] = {"start": format_hhmm(self.start)}
        if self.variable is not None:
            data["variable"] = self.variable
        else:
            data["temperature"] = self.temperature
        return data

    @classmethod
    def from_dict(cls, raw: Any) -> Slot:
        """Deserialize and validate."""
        if not isinstance(raw, Mapping):
            raise ScheduleError(f"Slot must be an object, got {raw!r}")
        start = parse_hhmm(raw.get("start"))  # type: ignore[arg-type]
        variable = raw.get("variable")
        temperature = raw.get("temperature")
        if variable is not None and temperature is not None:
            raise ScheduleError("Slot must have either temperature or variable, not both")
        if variable is not None:
            if not isinstance(variable, str) or not variable:
                raise ScheduleError(f"Invalid variable {variable!r}")
            return cls(start=start, variable=variable)
        if temperature is None:
            raise ScheduleError("Slot needs a temperature or a variable")
        return cls(start=start, temperature=validate_temperature(temperature))


@dataclass(frozen=True)
class Week:
    """Seven days (Monday first), each a sorted tuple of slots starting at 00:00."""

    days: tuple[tuple[Slot, ...], ...]

    @cached_property
    def _serialized(self) -> dict[str, list[dict[str, Any]]]:
        return {DAYS[i]: [slot.to_dict() for slot in day] for i, day in enumerate(self.days)}

    def to_dict(self) -> dict[str, list[dict[str, Any]]]:
        """Serialize. The week is immutable, so the result is cached - do not modify it."""
        return self._serialized

    @classmethod
    def from_dict(cls, raw: Any) -> Week:
        """Deserialize and validate a full week."""
        if not isinstance(raw, Mapping):
            raise ScheduleError("Week must be an object with keys mon..sun")
        unknown = set(raw) - set(DAYS)
        if unknown:
            raise ScheduleError(f"Unknown day keys: {sorted(unknown)}")
        days = []
        for day in DAYS:
            if day not in raw:
                raise ScheduleError(f"Missing day {day}")
            days.append(_validate_day(day, raw[day]))
        return cls(days=tuple(days))

    def variables(self) -> set[str]:
        """Return all variables referenced in this week."""
        return {s.variable for day in self.days for s in day if s.variable}


def _validate_day(name: str, raw: Any) -> tuple[Slot, ...]:
    if not isinstance(raw, list) or not raw:
        raise ScheduleError(f"Day {name} needs at least one slot")
    if len(raw) > MAX_SLOTS_PER_DAY:
        raise ScheduleError(f"Day {name} has too many slots")
    slots = sorted((Slot.from_dict(item) for item in raw), key=lambda s: s.start)
    if slots[0].start != 0:
        raise ScheduleError(f"Day {name} must have a slot starting at 00:00")
    for prev, cur in itertools.pairwise(slots):
        if prev.start == cur.start:
            raise ScheduleError(f"Day {name} has two slots at {format_hhmm(cur.start)}")
    return tuple(slots)


@dataclass
class Schedule:
    """A named weekly plan of a room."""

    id: str
    name: str
    week: Week

    def to_dict(self) -> dict[str, Any]:
        """Serialize."""
        return {"id": self.id, "name": self.name, "week": self.week.to_dict()}

    @classmethod
    def from_dict(cls, raw: Mapping[str, Any]) -> Schedule:
        """Deserialize."""
        return cls(id=str(raw["id"]), name=str(raw["name"]), week=Week.from_dict(raw["week"]))


def default_week() -> Week:
    """Return a sensible default plan based on the comfort/eco variables."""
    eco, comfort = DEFAULT_ECO_VAR, DEFAULT_COMFORT_VAR
    workday = (Slot(0, variable=eco), Slot(6 * 60, variable=comfort), Slot(22 * 60, variable=eco))
    weekend = (Slot(0, variable=eco), Slot(8 * 60, variable=comfort), Slot(23 * 60, variable=eco))
    return Week(days=(workday,) * 5 + (weekend,) * 2)


def slot_at(week: Week, local: datetime) -> Slot:
    """Return the slot valid at the given local wall-clock time."""
    minutes = local.hour * 60 + local.minute
    current = week.days[local.weekday()][0]
    for slot in week.days[local.weekday()]:
        if slot.start <= minutes:
            current = slot
        else:
            break
    return current


def localize(day: date, minutes: int, tz: tzinfo) -> datetime:
    """Convert a local wall-clock time to an aware datetime.

    Non-existent times (DST gap) are moved forward to the next valid time,
    ambiguous times (DST fold) resolve to their first occurrence. The result is
    returned in UTC to avoid ambiguous comparisons (PEP 495).
    """
    naive = datetime.combine(day, time(minutes // 60, minutes % 60))
    for _ in range(24 * 60):
        candidate = naive.replace(tzinfo=tz, fold=0)
        back = candidate.astimezone(UTC).astimezone(tz).replace(tzinfo=None)
        if back == naive:
            return candidate.astimezone(UTC)
        naive += timedelta(minutes=1)
    raise ScheduleError("Could not localize time")  # pragma: no cover


def next_change(week: Week, now: datetime, tz: tzinfo) -> tuple[datetime, Slot] | None:
    """Return the next slot start strictly after ``now`` and its slot."""
    today = now.astimezone(tz).date()
    for offset in range(8):
        day = today + timedelta(days=offset)
        for slot in week.days[day.weekday()]:
            when = localize(day, slot.start, tz)
            if when > now:
                return when, slot
    return None  # pragma: no cover - a week always has slots


def resolve(slot: Slot, variables: Mapping[str, float]) -> float | None:
    """Return the temperature of a slot, resolving a variable reference."""
    if slot.variable is not None:
        value = variables.get(slot.variable)
        return None if value is None else float(value)
    return slot.temperature


def clamp(temp: float, min_temp: float | None, max_temp: float | None, step: float | None) -> float:
    """Clamp a temperature to device limits and round to its step."""
    if step and step > 0:
        temp = round(round(temp / step) * step, 2)
    if min_temp is not None and temp < min_temp:
        temp = float(min_temp)
    if max_temp is not None and temp > max_temp:
        temp = float(max_temp)
    return temp


@dataclass
class GlobalOverride:
    """Global override that pauses schedules."""

    active: bool = False
    temperature: float = 16.0
    variable: str | None = None
    include_manual: bool = False
    include_off: bool = False

    def applies_to(self, mode: str) -> bool:
        """Return True if the override affects a room in ``mode``."""
        if not self.active:
            return False
        if mode == MODE_HEAT:
            return self.include_manual
        if mode == MODE_OFF:
            return self.include_off
        return True

    def value(self, variables: Mapping[str, float]) -> float | None:
        """Return the override temperature."""
        if self.variable is not None:
            value = variables.get(self.variable)
            return None if value is None else float(value)
        return self.temperature


@dataclass
class Period:
    """A time-limited activation of a schedule and/or mode (priority above the room).

    ``end`` None means "until cancelled". Among overlapping periods the most
    recently created one wins.
    """

    id: str
    start: datetime
    end: datetime | None
    created: datetime
    schedule: str | None = None
    mode: str | None = None
    temperature: float | None = None
    summary: str | None = None

    def active_at(self, now: datetime) -> bool:
        """Return True if the period is in effect at ``now``."""
        return self.start <= now and (self.end is None or now < self.end)

    def expired(self, now: datetime) -> bool:
        """Return True if the period is over."""
        return self.end is not None and self.end <= now

    def to_dict(self) -> dict[str, Any]:
        """Serialize."""
        return {
            "id": self.id,
            "start": self.start.isoformat(),
            "end": self.end.isoformat() if self.end else None,
            "created": self.created.isoformat(),
            "schedule": self.schedule,
            "mode": self.mode,
            "temperature": self.temperature,
            "summary": self.summary,
        }

    @classmethod
    def from_dict(cls, raw: Mapping[str, Any]) -> Period:
        """Deserialize."""
        return cls(
            id=str(raw["id"]),
            start=datetime.fromisoformat(raw["start"]),
            end=datetime.fromisoformat(raw["end"]) if raw.get("end") else None,
            created=datetime.fromisoformat(raw["created"]),
            schedule=raw.get("schedule"),
            mode=raw.get("mode"),
            temperature=raw.get("temperature"),
            summary=raw.get("summary"),
        )


@dataclass(frozen=True)
class TrvDeviation:
    """A set-point changed on one thermostat that is not synced to the others.

    Used when "sync thermostats" is off. ``until`` None means: until the room's mode,
    schedule or temperature is changed explicitly or a period starts or ends.
    """

    temperature: float
    until: datetime | None = None

    def active(self, now: datetime) -> bool:
        """Return True while the deviation applies."""
        return self.until is None or now < self.until


@dataclass(frozen=True)
class Effective:
    """What currently controls a room after applying an active period."""

    mode: str
    schedule_id: str
    manual_temperature: float
    period: Period | None


@dataclass
class RoomState:
    """Persistent state of a room."""

    schedules: dict[str, Schedule]
    active_schedule: str
    mode: str = MODE_AUTO
    manual_temperature: float = 20.0
    hand_temperature: float | None = None
    hand_until: datetime | None = None
    periods: list[Period] = field(default_factory=list)
    trv_deviations: dict[str, TrvDeviation] = field(default_factory=dict)

    @property
    def schedule(self) -> Schedule:
        """Return the base (non-period) active schedule."""
        return self.schedules[self.active_schedule]

    def active_period(self, now: datetime) -> Period | None:
        """Return the period in effect (the most recently created active one)."""
        active = [p for p in self.periods if p.active_at(now)]
        return max(active, key=lambda p: p.created) if active else None

    def effective(self, now: datetime) -> Effective:
        """Return mode/schedule/manual temperature after applying an active period."""
        period = self.active_period(now)
        mode, schedule_id, manual = self.mode, self.active_schedule, self.manual_temperature
        if period is not None:
            if period.mode is not None:
                mode = period.mode
            elif period.schedule is not None:
                mode = MODE_AUTO
            if period.schedule is not None and period.schedule in self.schedules:
                schedule_id = period.schedule
            if period.temperature is not None:
                manual = period.temperature
        return Effective(mode, schedule_id, manual, period)

    def hand_active(self, now: datetime) -> bool:
        """Return True if a temporary hand change is in effect."""
        return (
            self.hand_temperature is not None
            and self.hand_until is not None
            and self.hand_until > now
            and self.effective(now).mode == MODE_AUTO
        )

    def variables(self) -> set[str]:
        """Return all variables referenced by any schedule."""
        result: set[str] = set()
        for schedule in self.schedules.values():
            result |= schedule.week.variables()
        return result


@dataclass(frozen=True)
class Target:
    """Computed target of a room."""

    temperature: float | None
    source: str


def compute_target(
    state: RoomState,
    *,
    frost_temperature: float,
    override: GlobalOverride,
    variables: Mapping[str, float],
    now: datetime,
    tz: tzinfo,
) -> Target:
    """Compute the effective target temperature of a room.

    Priority: global override > active period > hand change > room mode/schedule.
    """
    eff = state.effective(now)
    if override.applies_to(eff.mode):
        return Target(override.value(variables), SOURCE_OVERRIDE)
    if eff.mode == MODE_OFF:
        return Target(frost_temperature, SOURCE_OFF)
    if eff.mode == MODE_HEAT:
        return Target(eff.manual_temperature, SOURCE_MANUAL)
    if state.hand_active(now):
        return Target(state.hand_temperature, SOURCE_HAND)
    slot = slot_at(state.schedules[eff.schedule_id].week, now.astimezone(tz))
    return Target(resolve(slot, variables), SOURCE_SCHEDULE)


def copy_day(week: Week, source: int, targets: list[int]) -> Week:
    """Return a copy of ``week`` with day ``source`` copied onto ``targets``."""
    days = list(week.days)
    for target in targets:
        days[target] = week.days[source]
    return replace(week, days=tuple(days))
