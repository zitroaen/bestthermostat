"""Per-room controller: computes the target and keeps all TRVs in sync."""

from __future__ import annotations

from collections import Counter
from collections.abc import Callable
from datetime import datetime
import logging
from typing import Any
import uuid

from homeassistant.components.climate import (
    ATTR_CURRENT_TEMPERATURE,
    ATTR_HVAC_ACTION,
    ATTR_MAX_TEMP,
    ATTR_MIN_TEMP,
    ATTR_TARGET_TEMP_STEP,
    ATTR_TEMPERATURE,
    HVACAction,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, State, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
    floor_registry as fr,
)
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_call_later,
    async_track_point_in_time,
    async_track_state_change_event,
)
from homeassistant.util import dt as dt_util, slugify

from .const import (
    CONF_FROST_TEMPERATURE,
    CONF_HAND_CHANGE,
    CONF_SYNC_TRVS,
    CONF_TRVS,
    DEFAULT_FROST_TEMPERATURE,
    DEFAULT_HAND_CHANGE,
    DEFAULT_SCHEDULE_ID,
    DEFAULT_SYNC_TRVS,
    DOMAIN,
    HAND_IGNORE,
    HAND_MANUAL,
    NAME,
    SETTLE_SECONDS,
    SIGNAL_UPDATE,
    VERSION,
)
from .hub import Hub
from .i18n import text
from .schedule import (
    MODE_AUTO,
    MODE_HEAT,
    MODE_OFF,
    MODES,
    Effective,
    Period,
    RoomState,
    Schedule,
    ScheduleError,
    Target,
    Week,
    clamp,
    compute_target,
    default_week,
    next_change,
    resolve,
    validate_temperature,
)

_LOGGER = logging.getLogger(__name__)

TOLERANCE = 0.05


def _available(state: State | None) -> bool:
    return state is not None and state.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN)


def _float(value: Any) -> float | None:
    try:
        return None if value is None else float(value)
    except (TypeError, ValueError):
        return None


def state_from_dict(
    raw: dict[str, Any] | None, default_schedule_name: str = "Default"
) -> RoomState:
    """Restore a room state, falling back to defaults for anything broken."""
    schedules: dict[str, Schedule] = {}
    for item in (raw or {}).get("schedules", []):
        try:
            sched = Schedule.from_dict(item)
        except (ScheduleError, KeyError, TypeError) as err:
            _LOGGER.error("Dropping invalid stored schedule %s: %s", item.get("name"), err)
            continue
        schedules[sched.id] = sched
    if not schedules:
        schedules[DEFAULT_SCHEDULE_ID] = Schedule(
            DEFAULT_SCHEDULE_ID, default_schedule_name, default_week()
        )
    raw = raw or {}
    active = raw.get("active_schedule")
    if active not in schedules:
        active = next(iter(schedules))
    mode = raw.get("mode", MODE_AUTO)
    if mode not in MODES:
        mode = MODE_AUTO
    hand_until = dt_util.parse_datetime(raw["hand_until"]) if raw.get("hand_until") else None
    periods: list[Period] = []
    for item in raw.get("periods", []):
        try:
            periods.append(Period.from_dict(item))
        except (KeyError, TypeError, ValueError) as err:
            _LOGGER.error("Dropping invalid stored period %s: %s", item, err)
    return RoomState(
        schedules=schedules,
        active_schedule=active,
        mode=mode,
        manual_temperature=_float(raw.get("manual_temperature")) or 20.0,
        hand_temperature=_float(raw.get("hand_temperature")),
        hand_until=hand_until,
        periods=periods,
    )


def state_to_dict(state: RoomState) -> dict[str, Any]:
    """Serialize a room state."""
    return {
        "schedules": [s.to_dict() for s in state.schedules.values()],
        "active_schedule": state.active_schedule,
        "mode": state.mode,
        "manual_temperature": state.manual_temperature,
        "hand_temperature": state.hand_temperature,
        "hand_until": state.hand_until.isoformat() if state.hand_until else None,
        "periods": [p.to_dict() for p in state.periods],
    }


class RoomController:
    """Drives the TRVs of one room."""

    def __init__(self, hass: HomeAssistant, hub: Hub, entry: ConfigEntry) -> None:
        """Initialize."""
        self.hass = hass
        self.hub = hub
        self.entry_id = entry.entry_id
        self.name = entry.title
        options = {**entry.data, **entry.options}
        self.trvs: list[str] = list(options[CONF_TRVS])
        self.frost_temperature = float(
            options.get(CONF_FROST_TEMPERATURE, DEFAULT_FROST_TEMPERATURE)
        )
        self.hand_change: str = options.get(CONF_HAND_CHANGE, DEFAULT_HAND_CHANGE)
        self.sync_trvs: bool = options.get(CONF_SYNC_TRVS, DEFAULT_SYNC_TRVS)
        self.state = state_from_dict(
            hub.rooms_data.get(entry.entry_id), text(hass, "default_schedule")
        )
        self._unsubs: list[Callable[[], None]] = []
        self._timer: Callable[[], None] | None = None
        self._settle: dict[str, Callable[[], None]] = {}
        self.climate_entity_id: str | None = None
        self._last_period_id: str | None = None

    # ------------------------------------------------------------ lifecycle

    @property
    def device_info(self) -> DeviceInfo:
        """Device of this room."""
        return DeviceInfo(
            identifiers={(DOMAIN, self.entry_id)},
            name=self.name,
            manufacturer=NAME,
            model=text(self.hass, "model_room"),
            suggested_area=self._trv_area_name(),
            sw_version=VERSION,
        )

    def _trv_area_id(self) -> str | None:
        """Most common area of the room's thermostats."""
        dev_reg = dr.async_get(self.hass)
        ent_reg = er.async_get(self.hass)
        counts: Counter[str] = Counter()
        for entity_id in self.trvs:
            entry = ent_reg.async_get(entity_id)
            if entry is None:
                continue
            area_id = entry.area_id
            if area_id is None and entry.device_id:
                device = dev_reg.async_get(entry.device_id)
                area_id = device.area_id if device else None
            if area_id:
                counts[area_id] += 1
        return counts.most_common(1)[0][0] if counts else None

    def _trv_area_name(self) -> str | None:
        area_id = self._trv_area_id()
        area = ar.async_get(self.hass).async_get_area(area_id) if area_id else None
        return area.name if area else None

    def area_and_floor(self) -> tuple[dict[str, Any] | None, dict[str, Any] | None]:
        """Area of the room device (fallback: of its TRVs) and the area's floor."""
        device = dr.async_get(self.hass).async_get_device(identifiers={(DOMAIN, self.entry_id)})
        area_id = device.area_id if device and device.area_id else self._trv_area_id()
        area = ar.async_get(self.hass).async_get_area(area_id) if area_id else None
        if area is None:
            return None, None
        floor = None
        if area.floor_id and (f := fr.async_get(self.hass).async_get_floor(area.floor_id)):
            floor = {"id": f.floor_id, "name": f.name, "level": f.level, "icon": f.icon}
        return {"id": area.id, "name": area.name}, floor

    @callback
    def async_start(self) -> None:
        """Start listening and apply the current target."""
        now = dt_util.utcnow()
        if self.state.hand_until and not self.state.hand_active(now):
            self._clear_hand()
        self._drop_expired_periods(now)
        period = self.state.active_period(now)
        self._last_period_id = period.id if period else None
        self._unsubs.append(
            async_track_state_change_event(self.hass, self.trvs, self._on_trv_event)
        )
        self.apply()
        self._schedule_timer()

    @callback
    def async_stop(self) -> None:
        """Stop all listeners."""
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        for unsub in self._settle.values():
            unsub()
        self._settle.clear()
        if self._timer:
            self._timer()
            self._timer = None

    def state_to_dict(self) -> dict[str, Any]:
        """Serialize for storage."""
        return state_to_dict(self.state)

    @callback
    def notify(self) -> None:
        """Inform entities and the card."""
        async_dispatcher_send(self.hass, f"{SIGNAL_UPDATE}_{self.entry_id}")
        self.hub.notify(self.entry_id)

    def _changed(self) -> None:
        self.hub.save()
        self.apply()
        self._schedule_timer()
        self.notify()

    # --------------------------------------------------------- computations

    def target(self, now: datetime | None = None) -> Target:
        """Return the effective target."""
        return compute_target(
            self.state,
            frost_temperature=self.frost_temperature,
            override=self.hub.override,
            variables=self.hub.variable_values(),
            now=now or dt_util.utcnow(),
            tz=dt_util.get_default_time_zone(),
        )

    @property
    def target_temperature(self) -> float | None:
        """Return the effective target temperature."""
        return self.target().temperature

    def effective(self) -> Effective:
        """Return the effective mode/schedule after applying an active period."""
        return self.state.effective(dt_util.utcnow())

    @property
    def mode(self) -> str:
        """Effective operating mode."""
        return self.effective().mode

    @property
    def active_schedule(self) -> Schedule:
        """Effective active schedule."""
        return self.state.schedules[self.effective().schedule_id]

    @property
    def active_period(self) -> Period | None:
        """The period currently in effect."""
        return self.state.active_period(dt_util.utcnow())

    @property
    def override_active(self) -> bool:
        """Return True if the global override currently controls this room."""
        return self.hub.override.applies_to(self.mode)

    @property
    def hand_active(self) -> bool:
        """Return True if a temporary hand change is active."""
        return self.state.hand_active(dt_util.utcnow())

    @property
    def schedule_paused(self) -> bool:
        """Return True if the schedule is currently not in control."""
        return self.target().source != "schedule"

    def next_change(self) -> tuple[datetime, float | None] | None:
        """Return the next slot change of the active schedule and its temperature."""
        result = next_change(
            self.active_schedule.week, dt_util.utcnow(), dt_util.get_default_time_zone()
        )
        if result is None:
            return None
        when, slot = result
        return when, resolve(slot, self.hub.variable_values())

    def trv_states(self) -> list[State]:
        """Return the states of all available TRVs."""
        return [s for e in self.trvs if _available(s := self.hass.states.get(e))]  # type: ignore[misc]

    @property
    def current_temperature(self) -> float | None:
        """Average current temperature of the available TRVs."""
        temps = [
            t
            for s in self.trv_states()
            if (t := _float(s.attributes.get(ATTR_CURRENT_TEMPERATURE))) is not None
        ]
        return round(sum(temps) / len(temps), 1) if temps else None

    @property
    def hvac_action(self) -> HVACAction | None:
        """Heating if at least one TRV heats."""
        actions = [s.attributes.get(ATTR_HVAC_ACTION) for s in self.trv_states()]
        if HVACAction.HEATING in actions:
            return HVACAction.HEATING
        if self.mode == MODE_OFF and not self.override_active:
            return HVACAction.OFF
        if any(a is not None for a in actions):
            return HVACAction.IDLE
        return None

    def limits(self) -> tuple[float, float]:
        """Return the intersection of the TRV min/max temperatures."""
        mins = [_float(s.attributes.get(ATTR_MIN_TEMP)) for s in self.trv_states()]
        maxs = [_float(s.attributes.get(ATTR_MAX_TEMP)) for s in self.trv_states()]
        low = max([m for m in mins if m is not None], default=5.0)
        high = min([m for m in maxs if m is not None], default=30.0)
        if low > high:
            low, high = high, low
        return low, high

    @staticmethod
    def _for_trv(state: State, temperature: float) -> float:
        return clamp(
            temperature,
            _float(state.attributes.get(ATTR_MIN_TEMP)),
            _float(state.attributes.get(ATTR_MAX_TEMP)),
            _float(state.attributes.get(ATTR_TARGET_TEMP_STEP)) or 0.5,
        )

    # -------------------------------------------------------------- writing

    @callback
    def apply(self) -> None:
        """Send the target to every available TRV that deviates from it."""
        target = self.target()
        if target.temperature is None:
            _LOGGER.warning("%s: no target temperature (unknown variable?)", self.name)
            return
        for entity_id in self.trvs:
            state = self.hass.states.get(entity_id)
            if not _available(state):
                continue
            assert state is not None
            want = self._for_trv(state, target.temperature)
            current = _float(state.attributes.get(ATTR_TEMPERATURE))
            if (
                current is None
                or abs(current - want) > TOLERANCE
                or self.hub.sender.is_pending(entity_id)
            ):
                self.hub.sender.send(entity_id, want)

    # ------------------------------------------------------------ listeners

    @callback
    def _on_trv_event(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        new = event.data["new_state"]
        old = event.data["old_state"]
        self.notify()
        if not _available(new):
            return
        assert new is not None
        if not _available(old):
            # Startup or reconnect: make sure the TRV has the right set-point.
            self.apply()
            return
        assert old is not None
        new_t = _float(new.attributes.get(ATTR_TEMPERATURE))
        old_t = _float(old.attributes.get(ATTR_TEMPERATURE))
        if new_t is None or new_t == old_t:
            return
        if self.hub.sender.is_own(entity_id, new.context, new_t):
            return
        target = self.target().temperature
        if target is not None and abs(new_t - self._for_trv(new, target)) <= TOLERANCE:
            return
        if self.hub.sender.recently_sent(entity_id, SETTLE_SECONDS):
            # Probably a stale report right after our write - re-check later.
            self._recheck_later(entity_id)
            return
        self._handle_hand_change(entity_id, new_t)

    def _recheck_later(self, entity_id: str) -> None:
        if unsub := self._settle.pop(entity_id, None):
            unsub()

        @callback
        def _recheck(_now: datetime) -> None:
            self._settle.pop(entity_id, None)
            self.apply()

        self._settle[entity_id] = async_call_later(self.hass, SETTLE_SECONDS, _recheck)

    def _handle_hand_change(self, entity_id: str, temperature: float) -> None:
        if self.override_active:
            _LOGGER.info("%s: %s changed during global override, restoring", self.name, entity_id)
            self.apply()
            return
        if self.hand_change == HAND_IGNORE:
            _LOGGER.warning(
                "%s: %s changed its set-point to %s °C by itself or by hand; restoring. "
                "Disable internal schedules of the TRV if this happens unexpectedly",
                self.name,
                entity_id,
                temperature,
            )
            self.apply()
            return
        _LOGGER.info("%s: hand change on %s to %s °C", self.name, entity_id, temperature)
        self._set_temperature(temperature, from_trv=True)
        if not self.sync_trvs:
            # Only remember the new value, do not touch the other TRVs.
            self.hub.save()
            self._schedule_timer()
            self.notify()
            return
        self._changed()

    # ---------------------------------------------------------------- timer

    def _schedule_timer(self) -> None:
        if self._timer:
            self._timer()
            self._timer = None
        now = dt_util.utcnow()
        candidates: list[datetime] = []
        if (
            result := next_change(self.active_schedule.week, now, dt_util.get_default_time_zone())
        ) is not None:
            candidates.append(result[0])
        if self.state.hand_until and self.state.hand_until > now:
            candidates.append(self.state.hand_until)
        for period in self.state.periods:
            candidates.extend(t for t in (period.start, period.end) if t is not None and t > now)
        if candidates:
            self._timer = async_track_point_in_time(self.hass, self._on_timer, min(candidates))

    @callback
    def _on_timer(self, _now: datetime) -> None:
        self._timer = None
        now = dt_util.utcnow()
        changed = self._drop_expired_periods(now)
        period = self.state.active_period(now)
        if (period.id if period else None) != self._last_period_id:
            # A period started or ended: a hand change from before no longer applies.
            self._last_period_id = period.id if period else None
            self._clear_hand()
            changed = True
            _LOGGER.info("%s: period %s", self.name, f"{period.id} started" if period else "ended")
        if self.state.hand_until and not self.state.hand_active(now):
            self._clear_hand()
            changed = True
        if changed:
            self.hub.save()
        self.apply()
        self._schedule_timer()
        self.notify()

    def _clear_hand(self) -> None:
        self.state.hand_temperature = None
        self.state.hand_until = None

    # -------------------------------------------------------------- actions

    def _temp(self, value: float) -> float:
        try:
            return validate_temperature(value)
        except ScheduleError as err:
            raise HomeAssistantError(str(err)) from err

    def _set_temperature(self, temperature: float, *, from_trv: bool) -> None:
        state = self.state
        now = dt_util.utcnow()
        period = state.active_period(now)
        if period is not None:
            eff = state.effective(now)
            if eff.mode in (MODE_HEAT, MODE_OFF):
                # Adjust the period itself; it still ends as planned.
                period.mode = MODE_HEAT
                period.temperature = temperature
                return
            result = next_change(
                state.schedules[eff.schedule_id].week, now, dt_util.get_default_time_zone()
            )
            until = [t for t in (result[0] if result else None, period.end) if t is not None]
            state.hand_temperature = temperature
            state.hand_until = min(until) if until else None
            return
        if state.mode == MODE_HEAT:
            state.manual_temperature = temperature
        elif state.mode == MODE_OFF or self.hand_change == HAND_MANUAL:
            state.mode = MODE_HEAT
            state.manual_temperature = temperature
            self._clear_hand()
        else:  # auto with "until next slot" (also used for "ignore" via the room entity)
            result = next_change(
                state.schedule.week, dt_util.utcnow(), dt_util.get_default_time_zone()
            )
            state.hand_temperature = temperature
            state.hand_until = result[0] if result else None

    @callback
    def set_temperature(self, temperature: float) -> None:
        """Set a temperature via the room entity."""
        temperature = round(float(temperature) * 2) / 2
        low, high = self.limits()
        temperature = min(max(temperature, low), high)
        self._set_temperature(temperature, from_trv=False)
        self._changed()

    def _end_active_period(self) -> None:
        """An explicit mode/schedule choice on the room ends a running period."""
        if (period := self.active_period) is not None:
            _LOGGER.info("%s: period %s ended by explicit change", self.name, period.id)
            self.state.periods.remove(period)
            self._last_period_id = None

    @callback
    def set_mode(self, mode: str, temperature: float | None = None) -> None:
        """Set the operating mode (ends a running period)."""
        if mode not in MODES:
            raise HomeAssistantError(f"Unknown mode {mode!r}")
        current = self.target().temperature
        current_mode = self.mode
        self._end_active_period()
        if mode == MODE_HEAT:
            if temperature is not None:
                self.state.manual_temperature = self._temp(temperature)
            elif current_mode != MODE_HEAT and current:
                self.state.manual_temperature = current
        self.state.mode = mode
        self._clear_hand()
        self._changed()

    # ------------------------------------------------------------ schedules

    def find_schedule(self, key: str) -> Schedule:
        """Find a schedule by id or name."""
        if key in self.state.schedules:
            return self.state.schedules[key]
        for sched in self.state.schedules.values():
            if sched.name.casefold() == key.casefold():
                return sched
        raise HomeAssistantError(f"{self.name}: unknown schedule {key!r}")

    @callback
    def set_active_schedule(self, key: str) -> None:
        """Activate a schedule (ends a running period)."""
        sched = self.find_schedule(key)
        self._end_active_period()
        self.state.active_schedule = sched.id
        self._clear_hand()
        self._changed()

    def _check_name(self, name: str, ignore: str | None = None) -> str:
        name = name.strip()
        if not name:
            raise HomeAssistantError("Schedule name must not be empty")
        for sched in self.state.schedules.values():
            if sched.id != ignore and sched.name.casefold() == name.casefold():
                raise HomeAssistantError(f"Schedule {name!r} already exists")
        return name

    def _check_variables(self, week: Week) -> None:
        unknown = week.variables() - set(self.hub.variables)
        if unknown:
            raise HomeAssistantError(f"Unknown variables: {', '.join(sorted(unknown))}")

    @callback
    def create_schedule(
        self, name: str, *, copy_from: str | None = None, week: dict[str, Any] | None = None
    ) -> Schedule:
        """Create a schedule (optionally duplicating another one)."""
        name = self._check_name(name)
        if week is not None:
            parsed = self._parse_week(week)
        elif copy_from is not None:
            parsed = self.find_schedule(copy_from).week
        else:
            parsed = self.state.schedule.week
        sid = slugify(name) or "plan"
        if sid in self.state.schedules:
            sid = f"{sid}_{uuid.uuid4().hex[:6]}"
        sched = Schedule(sid, name, parsed)
        self.state.schedules[sid] = sched
        self._changed()
        return sched

    @callback
    def rename_schedule(self, key: str, name: str) -> None:
        """Rename a schedule."""
        sched = self.find_schedule(key)
        sched.name = self._check_name(name, ignore=sched.id)
        self._changed()

    @callback
    def delete_schedule(self, key: str) -> None:
        """Delete a schedule (not the active one)."""
        sched = self.find_schedule(key)
        if sched.id == self.state.active_schedule:
            raise HomeAssistantError("The active schedule cannot be deleted")
        if any(p.schedule == sched.id for p in self.state.periods):
            raise HomeAssistantError("The schedule is used by a planned period")
        del self.state.schedules[sched.id]
        self._changed()

    def _parse_week(self, raw: Any) -> Week:
        try:
            week = Week.from_dict(raw)
        except ScheduleError as err:
            raise HomeAssistantError(str(err)) from err
        self._check_variables(week)
        return week

    @callback
    def save_week(self, key: str, raw_week: Any) -> None:
        """Replace the weekly plan of a schedule."""
        sched = self.find_schedule(key)
        sched.week = self._parse_week(raw_week)
        self._changed()

    # -------------------------------------------------------------- periods

    def _drop_expired_periods(self, now: datetime) -> bool:
        before = len(self.state.periods)
        self.state.periods = [p for p in self.state.periods if not p.expired(now)]
        return len(self.state.periods) != before

    def _build_period(
        self,
        *,
        period_id: str,
        created: datetime,
        start: datetime,
        end: datetime | None,
        schedule: str | None,
        mode: str | None,
        temperature: float | None,
        summary: str | None,
    ) -> Period:
        """Validate the settings of a period and build it."""
        now = dt_util.utcnow()
        start = dt_util.as_utc(start)
        end = dt_util.as_utc(end) if end else None
        if end is not None and end <= max(start, now):
            raise HomeAssistantError("The end must be in the future and after the start")
        if mode is not None and mode not in MODES:
            raise HomeAssistantError(f"Unknown mode {mode!r}")
        sched_id = self.find_schedule(schedule).id if schedule is not None else None
        if temperature is not None:
            temperature = self._temp(temperature)
            if mode is None:
                mode = MODE_HEAT
        if sched_id is None and mode is None:
            raise HomeAssistantError("A period needs a schedule, a mode or a temperature")
        if mode == MODE_HEAT and temperature is None:
            temperature = self.target().temperature or self.state.manual_temperature
        if mode != MODE_HEAT:
            temperature = None
        if sched_id is not None and mode in (MODE_HEAT, MODE_OFF):
            raise HomeAssistantError("A schedule can only be combined with mode 'auto'")
        return Period(
            id=period_id,
            start=start,
            end=end,
            created=created,
            schedule=sched_id,
            mode=mode,
            temperature=temperature,
            summary=summary.strip() if summary and summary.strip() else None,
        )

    def _periods_changed(self) -> None:
        now = dt_util.utcnow()
        self._drop_expired_periods(now)
        self.hub.save()
        self._on_timer(now)  # re-evaluate (a period may start or end right now)

    @callback
    def add_period(
        self,
        *,
        start: datetime | None = None,
        end: datetime | None = None,
        schedule: str | None = None,
        mode: str | None = None,
        temperature: float | None = None,
        summary: str | None = None,
    ) -> Period:
        """Plan a period that activates a schedule and/or mode."""
        now = dt_util.utcnow()
        period = self._build_period(
            period_id=uuid.uuid4().hex[:12],
            created=now,
            start=start or now,
            end=end,
            schedule=schedule,
            mode=mode,
            temperature=temperature,
            summary=summary,
        )
        self.state.periods.append(period)
        self._periods_changed()
        return period

    def find_period(self, period_id: str) -> Period:
        """Return a period by id."""
        for period in self.state.periods:
            if period.id == period_id:
                return period
        raise HomeAssistantError(f"{self.name}: unknown period {period_id!r}")

    @callback
    def update_period(
        self,
        period_id: str,
        *,
        start: datetime | None = None,
        end: datetime | None = None,
        open_end: bool = False,
        schedule: str | None = None,
        mode: str | None = None,
        temperature: float | None = None,
        summary: str | None = None,
    ) -> Period:
        """Change a period in place (id and priority are kept).

        Only the given fields change. Choosing a schedule clears the mode and vice
        versa unless both are given; ``open_end`` removes the end.
        """
        old = self.find_period(period_id)
        if temperature is not None and mode is None and schedule is None:
            mode = MODE_HEAT  # a temperature alone means manual mode
        new_schedule = (
            schedule if schedule is not None else (old.schedule if mode is None else None)
        )
        new_mode = mode if mode is not None else (old.mode if schedule is None else None)
        if temperature is None and new_mode == MODE_HEAT and old.mode == MODE_HEAT:
            temperature = old.temperature
        period = self._build_period(
            period_id=old.id,
            created=old.created,
            start=start or old.start,
            end=None if open_end else (end or old.end),
            schedule=new_schedule,
            mode=new_mode,
            temperature=temperature,
            summary=old.summary if summary is None else summary,
        )
        self.state.periods[self.state.periods.index(old)] = period
        self._periods_changed()
        return period

    @callback
    def cancel_period(self, period_id: str | None = None) -> int:
        """Cancel one period or, without id, all periods. Returns the number removed."""
        before = len(self.state.periods)
        if period_id is None:
            self.state.periods = []
        else:
            if not any(p.id == period_id for p in self.state.periods):
                raise HomeAssistantError(f"{self.name}: unknown period {period_id!r}")
            self.state.periods = [p for p in self.state.periods if p.id != period_id]
        self.hub.save()
        self._on_timer(dt_util.utcnow())
        return before - len(self.state.periods)

    def period_summary(self, period: Period) -> str:
        """Human readable description of a period."""
        if period.summary:
            return period.summary
        parts: list[str] = []
        if period.schedule and period.schedule in self.state.schedules:
            parts.append(self.state.schedules[period.schedule].name)
        if period.mode == MODE_HEAT:
            parts.append(f"{text(self.hass, 'manual')} {period.temperature} °C")
        elif period.mode == MODE_OFF:
            parts.append(text(self.hass, "off"))
        elif period.mode == MODE_AUTO and not parts:
            parts.append(text(self.hass, "auto"))
        return " · ".join(parts) or text(self.hass, "period")

    def period_dict(self, period: Period) -> dict[str, Any]:
        """Period for the API."""
        return {**period.to_dict(), "title": self.period_summary(period)}

    # ---------------------------------------------------------------- export

    def as_dict(self, *, with_weeks: bool = True) -> dict[str, Any]:
        """Return a representation for the websocket API and services."""
        nxt = self.next_change()
        target = self.target()
        low, high = self.limits()
        area, floor = self.area_and_floor()
        return {
            "area": area,
            "floor": floor,
            "entry_id": self.entry_id,
            "name": self.name,
            "climate_entity_id": self.climate_entity_id,
            "trvs": self.trvs,
            "mode": self.mode,
            "base_mode": self.state.mode,
            "manual_temperature": self.effective().manual_temperature,
            "base_manual_temperature": self.state.manual_temperature,
            "frost_temperature": self.frost_temperature,
            "target_temperature": target.temperature,
            "target_source": target.source,
            "current_temperature": self.current_temperature,
            "hvac_action": self.hvac_action,
            "min_temp": low,
            "max_temp": high,
            "active_schedule": self.active_schedule.id,
            "base_schedule": self.state.active_schedule,
            "period": self.period_dict(p) if (p := self.active_period) else None,
            "periods": [
                self.period_dict(p) for p in sorted(self.state.periods, key=lambda p: p.start)
            ],
            "hand_until": (
                self.state.hand_until.isoformat()
                if self.hand_active and self.state.hand_until
                else None
            ),
            "override_active": self.override_active,
            "next_change": nxt[0].isoformat() if nxt else None,
            "next_temperature": nxt[1] if nxt else None,
            "schedules": [
                {"id": s.id, "name": s.name, **({"week": s.week.to_dict()} if with_weeks else {})}
                for s in self.state.schedules.values()
            ],
        }
