"""Per-room controller: computes the target and keeps all TRVs in sync."""

from __future__ import annotations

from collections import Counter
from collections.abc import Callable, Mapping
from datetime import datetime
import logging
from typing import Any
import uuid

from homeassistant.components.climate import (
    ATTR_CURRENT_TEMPERATURE,
    ATTR_HVAC_ACTION,
    ATTR_HVAC_MODE,
    ATTR_MAX_TEMP,
    ATTR_MIN_TEMP,
    ATTR_TARGET_TEMP_STEP,
    ATTR_TEMPERATURE,
    DOMAIN as CLIMATE_DOMAIN,
    SERVICE_SET_HVAC_MODE,
    HVACAction,
    HVACMode,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import (
    Context,
    Event,
    EventStateChangedData,
    HomeAssistant,
    State,
    callback,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
    floor_registry as fr,
    label_registry as lr,
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
    HAND_CHANGE_OPTIONS,
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
    GLOBAL_ID_PREFIX,
    MODE_AUTO,
    MODE_HEAT,
    MODE_OFF,
    MODES,
    SOURCE_OVERRIDE,
    Effective,
    GlobalOverride,
    Period,
    RoomState,
    Schedule,
    ScheduleError,
    Target,
    TrvDeviation,
    clamp,
    compute_target,
    default_week,
    next_change,
    resolve,
    slot_at,
    validate_temperature,
)

_LOGGER = logging.getLogger(__name__)

TOLERANCE = 0.05
BATTERY_LOW = 20


def _available(state: State | None) -> bool:
    return state is not None and state.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN)


# TRV attributes the room uses; changes of anything else are ignored.
RELEVANT_ATTRIBUTES = (
    ATTR_TEMPERATURE,
    ATTR_CURRENT_TEMPERATURE,
    ATTR_HVAC_ACTION,
    ATTR_MIN_TEMP,
    ATTR_MAX_TEMP,
    ATTR_TARGET_TEMP_STEP,
    "friendly_name",
)


def _relevant(state: State | None) -> tuple[Any, ...] | None:
    if state is None:
        return None
    return (state.state, *(state.attributes.get(a) for a in RELEVANT_ATTRIBUTES))


def _float(value: Any) -> float | None:
    try:
        return None if value is None else float(value)
    except (TypeError, ValueError):
        return None


def state_from_dict(
    raw: dict[str, Any] | None,
    default_schedule_name: str = "Default",
    shared: Mapping[str, Schedule] | None = None,
) -> RoomState:
    """Restore a room state, falling back to defaults for anything broken.

    ``shared`` are the global schedules; the active schedule may be one of them. A
    room without any local schedule only gets a default one when its active schedule
    is not a global schedule either.
    """
    shared = shared if shared is not None else {}
    schedules: dict[str, Schedule] = {}
    for item in (raw or {}).get("schedules", []):
        try:
            sched = Schedule.from_dict(item)
        except (ScheduleError, KeyError, TypeError) as err:
            _LOGGER.error("Dropping invalid stored schedule %s: %s", item.get("name"), err)
            continue
        schedules[sched.id] = sched
    raw = raw or {}
    active = raw.get("active_schedule")
    if not schedules and active not in shared:
        schedules[DEFAULT_SCHEDULE_ID] = Schedule(
            DEFAULT_SCHEDULE_ID, default_schedule_name, default_week()
        )
    if not isinstance(active, str) or (active not in schedules and active not in shared):
        active = next(iter(schedules))
    mode = raw.get("mode", MODE_AUTO)
    if mode not in MODES:
        mode = MODE_AUTO
    hand_until = dt_util.parse_datetime(raw["hand_until"]) if raw.get("hand_until") else None
    deviations: dict[str, TrvDeviation] = {}
    for entity_id, item in (raw.get("trv_deviations") or {}).items():
        try:
            until = dt_util.parse_datetime(item["until"]) if item.get("until") else None
            deviations[entity_id] = TrvDeviation(float(item["temperature"]), until)
        except (KeyError, TypeError, ValueError) as err:
            _LOGGER.error("Dropping invalid stored deviation of %s: %s", entity_id, err)
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
        trv_deviations=deviations,
        shared=shared,
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
        "trv_deviations": {
            entity_id: {
                "temperature": d.temperature,
                "until": d.until.isoformat() if d.until else None,
            }
            for entity_id, d in state.trv_deviations.items()
        },
    }


class RoomController:
    """Drives the TRVs of one room."""

    def __init__(self, hass: HomeAssistant, hub: Hub, entry: ConfigEntry) -> None:
        """Initialize."""
        self.hass = hass
        self.hub = hub
        self.entry = entry
        # Options this controller runs with; an update to exactly these needs no reload.
        self.options = dict(entry.options)
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
            hub.rooms_data.get(entry.entry_id), text(hass, "default_schedule"), hub.schedules
        )
        if (sched := hub.schedules.get(self.state.active_schedule)) is not None:
            hub.ensure_visible(sched, self.entry_id)
        if self.sync_trvs:
            self.state.trv_deviations.clear()
        else:  # drop deviations of thermostats that were removed from the room
            for entity_id in set(self.state.trv_deviations) - set(self.trvs):
                del self.state.trv_deviations[entity_id]
        self._unsubs: list[Callable[[], None]] = []
        self._timer: Callable[[], None] | None = None
        self._settle: dict[str, Callable[[], None]] = {}
        self.climate_entity_id: str | None = None
        self._battery_unsub: Callable[[], None] | None = None
        self._battery_ids: set[str] = set()
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

    def _trv_device_id(self, trv: str) -> str | None:
        entry = er.async_get(self.hass).async_get(trv)
        return entry.device_id if entry else None

    def _battery_entities(self) -> dict[str, list[str]]:
        """Battery entities (sensor %, binary_sensor low) on each TRV's device."""
        ent_reg = er.async_get(self.hass)
        result: dict[str, list[str]] = {}
        for trv in self.trvs:
            entry = ent_reg.async_get(trv)
            if entry is None or entry.device_id is None:
                continue
            found = [
                e.entity_id
                for e in er.async_entries_for_device(ent_reg, entry.device_id)
                if e.domain in ("sensor", "binary_sensor")
                and (e.device_class or e.original_device_class) == "battery"
                and not e.disabled
            ]
            if found:
                result[trv] = sorted(found, key=lambda e: not e.startswith("sensor."))
        return result

    def batteries(self) -> list[dict[str, Any]]:
        """Battery state of every TRV that reports one."""
        result = []
        for trv, entities in self._battery_entities().items():
            level: float | None = None
            low: bool | None = None
            for entity_id in entities:
                state = self.hass.states.get(entity_id)
                if not _available(state):
                    continue
                assert state is not None
                if entity_id.startswith("sensor."):
                    level = _float(state.state) if level is None else level
                else:
                    low = state.state == "on"
            if level is not None and low is None:
                low = level <= BATTERY_LOW
            device_id = self._trv_device_id(trv)
            device = dr.async_get(self.hass).async_get(device_id) if device_id else None
            trv_state = self.hass.states.get(trv)
            name = (
                (device.name_by_user or device.name)
                if device and (device.name_by_user or device.name)
                else (trv_state.name if trv_state else trv)
            )
            result.append(
                {
                    "entity_id": trv,
                    "device_id": device_id,
                    "name": name,
                    "level": level,
                    "low": low,
                }
            )
        return result

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
        return {"id": area.id, "name": area.name, "icon": area.icon}, floor

    @callback
    def async_start(self) -> None:
        """Start listening and apply the current target."""
        now = dt_util.utcnow()
        if self.state.hand_until and not self.state.hand_active(now):
            self._clear_hand()
        self._drop_expired_periods(now)
        self._drop_expired_deviations(now)
        period = self.state.active_period(now)
        self._last_period_id = period.id if period else None
        self._unsubs.append(
            async_track_state_change_event(self.hass, self.trvs, self._on_trv_event)
        )
        self._track_batteries()
        self._unsubs.append(
            self.hass.bus.async_listen(
                er.EVENT_ENTITY_REGISTRY_UPDATED, self._on_entity_registry_updated
            )
        )
        self.apply()
        self._schedule_timer()

    def _track_batteries(self) -> None:
        """(Re)subscribe to the battery entities of the TRV devices."""
        if self._battery_unsub:
            self._battery_unsub()
            self._battery_unsub = None
        self._battery_ids = {e for ids in self._battery_entities().values() for e in ids}
        if self._battery_ids:
            self._battery_unsub = async_track_state_change_event(
                self.hass, list(self._battery_ids), self._on_battery_event
            )

    @callback
    def _on_entity_registry_updated(self, event: Event[er.EventEntityRegistryUpdatedData]) -> None:
        """A battery entity of a TRV device may have appeared, changed or gone."""
        entity_id = event.data["entity_id"]
        if entity_id in self._battery_ids or entity_id in self.trvs:
            relevant = True
        else:
            entry = er.async_get(self.hass).async_get(entity_id)
            devices = {self._trv_device_id(t) for t in self.trvs} - {None}
            relevant = entry is not None and entry.device_id in devices
        if relevant:
            self._track_batteries()
            self.notify()

    @callback
    def _on_battery_event(self, _event: Event[EventStateChangedData]) -> None:
        # Must be a callback: a plain function would run in a worker thread.
        self.notify()

    @callback
    def async_stop(self) -> None:
        """Stop all listeners."""
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        if self._battery_unsub:
            self._battery_unsub()
            self._battery_unsub = None
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
        self.notify_entities()
        self.hub.notify(self.entry_id)

    @callback
    def notify_entities(self) -> None:
        """Inform only this room's entities (the card is informed separately)."""
        async_dispatcher_send(self.hass, f"{SIGNAL_UPDATE}_{self.entry_id}")

    def _changed(self) -> None:
        self.hub.save()
        self.apply()
        self._schedule_timer()
        self.notify()

    # --------------------------------------------------------- computations

    def target(self, now: datetime | None = None, *, ignore_override: bool = False) -> Target:
        """Return the effective target."""
        return compute_target(
            self.state,
            frost_temperature=self.frost_temperature,
            override=GlobalOverride() if ignore_override else self.hub.override,
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
        return self.state.lookup(self.effective().schedule_id)

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

    def target_variable(self, source: str) -> str | None:
        """Name of the variable that defines the current target, if any."""
        variable_id: str | None = None
        if source == "override":
            variable_id = self.hub.override.variable
        elif source == "schedule":
            slot = slot_at(
                self.active_schedule.week,
                dt_util.now().astimezone(dt_util.get_default_time_zone()),
            )
            variable_id = slot.variable
        if variable_id is None:
            return None
        var = self.hub.variables.get(variable_id)
        return var.name if var else variable_id

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
        _LOGGER.debug(
            "%s: apply target %s °C (source %s, mode %s)",
            self.name,
            target.temperature,
            target.source,
            self.state.mode,
        )
        for entity_id in self.trvs:
            state = self.hass.states.get(entity_id)
            if not _available(state):
                continue
            assert state is not None
            want = self._want(state, target)
            current = _float(state.attributes.get(ATTR_TEMPERATURE))
            if (
                current is None
                or abs(current - want) > TOLERANCE
                or self.hub.sender.is_pending(entity_id)
            ):
                self.hub.sender.send(entity_id, want)

    def deviation(self, entity_id: str) -> TrvDeviation | None:
        """Active unsynced hand change of a thermostat (only with sync off)."""
        deviation = self.state.trv_deviations.get(entity_id)
        if deviation is None or not deviation.active(dt_util.utcnow()):
            return None
        return deviation

    def _want(self, state: State, target: Target) -> float:
        """Set-point a thermostat should have (its own deviation, unless overridden)."""
        assert target.temperature is not None
        deviation = self.deviation(state.entity_id)
        if deviation is not None and target.source != SOURCE_OVERRIDE:
            return self._for_trv(state, deviation.temperature)
        return self._for_trv(state, target.temperature)

    def deviations_list(self) -> list[dict[str, Any]]:
        """Active unsynced thermostat changes for the API."""
        result = []
        for entity_id in self.trvs:
            if (deviation := self.deviation(entity_id)) is None:
                continue
            state = self.hass.states.get(entity_id)
            result.append(
                {
                    "entity_id": entity_id,
                    "name": state.name if state else entity_id,
                    "temperature": deviation.temperature,
                    "until": deviation.until.isoformat() if deviation.until else None,
                }
            )
        return result

    def _drop_expired_deviations(self, now: datetime) -> bool:
        expired = [e for e, d in self.state.trv_deviations.items() if not d.active(now)]
        for entity_id in expired:
            del self.state.trv_deviations[entity_id]
        return bool(expired)

    def _clear_deviations(self) -> None:
        self.state.trv_deviations.clear()

    # ------------------------------------------------------------ listeners

    @callback
    def _on_trv_event(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        new = event.data["new_state"]
        old = event.data["old_state"]
        if _relevant(old) == _relevant(new):
            return  # e.g. only link quality or "last seen" changed
        self.notify()
        if not _available(new):
            return
        assert new is not None
        if not _available(old):
            # Startup or reconnect: make sure the TRV has the right set-point.
            self.apply()
            return
        assert old is not None
        if new.state == HVACMode.AUTO and old.state != HVACMode.AUTO:
            self._on_trv_auto(entity_id, old.state)
            return
        new_t = _float(new.attributes.get(ATTR_TEMPERATURE))
        old_t = _float(old.attributes.get(ATTR_TEMPERATURE))
        if new_t is None or new_t == old_t:
            return
        if self.hub.sender.is_own(entity_id, new.context, new_t):
            _LOGGER.debug("%s: %s %s -> %s °C (own write)", self.name, entity_id, old_t, new_t)
            return
        target = self.target().temperature
        _LOGGER.debug(
            "%s: %s reported %s -> %s °C (target %s, preset %s, context %s/%s)",
            self.name,
            entity_id,
            old_t,
            new_t,
            target,
            new.attributes.get("preset_mode"),
            new.context.id,
            new.context.parent_id,
        )
        if target is not None and abs(new_t - self._want(new, self.target())) <= TOLERANCE:
            return
        if self.hub.sender.recently_sent(entity_id, SETTLE_SECONDS):
            # Probably a stale report right after our write - re-check later.
            _LOGGER.debug(
                "%s: %s deviates right after our write, re-check later", self.name, entity_id
            )
            self._recheck_later(entity_id)
            return
        self._handle_hand_change(entity_id, new_t)

    def _on_trv_auto(self, entity_id: str, previous_mode: str) -> None:
        """A thermostat was switched to auto: the room follows its schedule again.

        On most TRVs "auto" runs the device's own weekly schedule, which would fight
        with ours, so the thermostat is switched back to its previous mode.
        """
        _LOGGER.info(
            "%s: %s switched to auto, room follows its schedule again", self.name, entity_id
        )
        if self.state.mode != MODE_AUTO or self.active_period or self.hand_active:
            self.set_mode(MODE_AUTO)  # also ends a running period and a hand change
        self._clear_deviations()
        self.hub.save()
        context = Context()
        target = self.target()
        if (state := self.hass.states.get(entity_id)) and target.temperature is not None:
            self.hub.sender.note_write(entity_id, self._want(state, target), context)
        self.hass.async_create_task(
            self.hass.services.async_call(
                CLIMATE_DOMAIN,
                SERVICE_SET_HVAC_MODE,
                {ATTR_ENTITY_ID: entity_id, ATTR_HVAC_MODE: previous_mode},
                context=context,
            ),
            f"{DOMAIN} restore hvac mode of {entity_id}",
        )
        self.apply()
        self.notify()

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
        if not self.sync_trvs:
            self._deviate(entity_id, temperature)
            return
        self._set_temperature(temperature)
        self._changed()

    def _deviate(self, entity_id: str, temperature: float) -> None:
        """Sync off: keep the change on this thermostat only; the room target stays."""
        state = self.state
        now = dt_util.utcnow()
        tz = dt_util.get_default_time_zone()
        period = state.active_period(now)
        eff = state.effective(now)
        until: datetime | None = None
        if eff.mode == MODE_AUTO:
            if period is None and self.hand_change == HAND_MANUAL:
                # The room switches to manual mode; the other thermostats keep their value.
                current = self.target(now).temperature
                state.mode = MODE_HEAT
                if current is not None:
                    state.manual_temperature = current
                self._clear_hand()
            else:
                result = next_change(state.lookup(eff.schedule_id).week, now, tz)
                candidates = [
                    t for t in (result[0] if result else None, period and period.end) if t
                ]
                until = min(candidates) if candidates else None
        elif period is not None:
            until = period.end
        target = self.target(now).temperature
        if target is not None and abs(temperature - target) <= TOLERANCE:
            state.trv_deviations.pop(entity_id, None)  # back to the room target
        else:
            state.trv_deviations[entity_id] = TrvDeviation(temperature, until)
        self._changed()
        self.notify()

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
        candidates.extend(
            d.until for d in self.state.trv_deviations.values() if d.until and d.until > now
        )
        for period in self.state.periods:
            candidates.extend(t for t in (period.start, period.end) if t is not None and t > now)
        if candidates:
            self._timer = async_track_point_in_time(self.hass, self._on_timer, min(candidates))

    @callback
    def _on_timer(self, _now: datetime) -> None:
        # The handle has fired; forget it so _schedule_timer does not cancel it.
        self._timer = None
        _LOGGER.debug("%s: timer fired", self.name)
        self._reevaluate()

    @callback
    def _reevaluate(self) -> None:
        """Re-check periods/hand change, apply the target and reschedule the timer."""
        now = dt_util.utcnow()
        changed = self._drop_expired_periods(now)
        period = self.state.active_period(now)
        if (period.id if period else None) != self._last_period_id:
            # A period started or ended: a hand change from before no longer applies.
            self._last_period_id = period.id if period else None
            self._clear_hand()
            self._clear_deviations()
            changed = True
            _LOGGER.info("%s: period %s", self.name, f"{period.id} started" if period else "ended")
        if self.state.hand_until and not self.state.hand_active(now):
            self._clear_hand()
            changed = True
        if self._drop_expired_deviations(now):
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

    def _set_temperature(self, temperature: float) -> None:
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
                state.lookup(eff.schedule_id).week, now, dt_util.get_default_time_zone()
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
        self._set_temperature(temperature)
        self._clear_deviations()  # an explicit room temperature applies to every thermostat
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
        # The room's own target: the global override must not leak into manual mode.
        current = self.target(ignore_override=True).temperature
        current_mode = self.mode
        self._end_active_period()
        if mode == MODE_HEAT:
            if temperature is not None:
                self.state.manual_temperature = self._temp(temperature)
            elif current_mode != MODE_HEAT and current:
                self.state.manual_temperature = current
        self.state.mode = mode
        self._clear_hand()
        self._clear_deviations()
        self._changed()

    @callback
    def set_hand_change(self, value: str) -> None:
        """Choose how changes made on a thermostat are handled (stored, no reload)."""
        if value not in HAND_CHANGE_OPTIONS:
            raise HomeAssistantError(f"Unknown hand change behaviour {value!r}")
        if value == self.hand_change:
            return
        self.hand_change = value
        self.options = {**self.entry.options, CONF_HAND_CHANGE: value}
        self.hass.config_entries.async_update_entry(self.entry, options=self.options)
        self.notify()

    # ------------------------------------------------------------ schedules

    def is_global(self, schedule_id: str) -> bool:
        """Return True if the id refers to a global schedule."""
        return schedule_id not in self.state.schedules and schedule_id in self.hub.schedules

    def available_schedules(self) -> list[Schedule]:
        """Schedules offered in this room: its own plus the visible global ones."""
        return [
            *self.state.schedules.values(),
            *(g for g in self.hub.schedules.values() if g.visible_to(self.entry_id)),
        ]

    def find_schedule(self, key: str) -> Schedule:
        """Find a schedule by id or name (own schedules first, then global ones)."""
        if key in self.state.schedules:
            return self.state.schedules[key]
        if key in self.hub.schedules:
            return self.hub.schedules[key]
        folded = key.casefold()
        for sched in self.available_schedules():
            if sched.name.casefold() == folded:
                return sched
        for sched in self.hub.schedules.values():  # periods may use any global schedule
            if sched.name.casefold() == folded:
                return sched
        raise HomeAssistantError(f"{self.name}: unknown schedule {key!r}")

    @callback
    def set_active_schedule(self, key: str) -> None:
        """Activate a schedule (ends a running period)."""
        sched = self.find_schedule(key)
        if (shared := self.hub.schedules.get(sched.id)) is not None:
            self.hub.make_visible(shared, self.entry_id)  # active implies available
        self._end_active_period()
        self.state.active_schedule = sched.id
        self._clear_hand()
        self._clear_deviations()
        self._changed()

    def local_name_conflict(self, name: str, ignore: str | None = None) -> bool:
        """Return True if one of the room's own schedules has this name."""
        folded = name.casefold()
        return any(
            s.id != ignore and s.name.casefold() == folded for s in self.state.schedules.values()
        )

    def _check_name(self, name: str, ignore: str | None = None) -> str:
        name = name.strip()
        if not name:
            raise HomeAssistantError("Schedule name must not be empty")
        folded = name.casefold()
        if any(s.id != ignore and s.name.casefold() == folded for s in self.available_schedules()):
            raise HomeAssistantError(f"Schedule {name!r} already exists")
        return name

    @callback
    def create_schedule(
        self, name: str, *, copy_from: str | None = None, week: dict[str, Any] | None = None
    ) -> Schedule:
        """Create a schedule of this room (optionally copying a local or global one)."""
        name = self._check_name(name)
        if week is not None:
            parsed = self.hub.parse_week(week)
        elif copy_from is not None:
            parsed = self.find_schedule(copy_from).week
        else:
            parsed = self.state.schedule.week
        sid = slugify(name) or "plan"
        if sid.startswith(GLOBAL_ID_PREFIX):
            sid = f"plan_{sid}"
        if sid in self.state.schedules:
            sid = f"{sid}_{uuid.uuid4().hex[:6]}"
        sched = Schedule(sid, name, parsed)
        self.state.schedules[sid] = sched
        self._changed()
        return sched

    @callback
    def rename_schedule(self, key: str, name: str) -> None:
        """Rename a schedule (a global one is renamed everywhere)."""
        sched = self.find_schedule(key)
        if self.is_global(sched.id):
            self.hub.rename_global(sched.id, name)
            return
        sched.name = self._check_name(name, ignore=sched.id)
        self._changed()

    @callback
    def delete_schedule(self, key: str) -> None:
        """Delete an own schedule (not the active one); global ones via the hub."""
        sched = self.find_schedule(key)
        if self.is_global(sched.id):
            self.hub.delete_global(sched.id)
            return
        if sched.id == self.state.active_schedule:
            raise HomeAssistantError("The active schedule cannot be deleted")
        if any(p.schedule == sched.id for p in self.state.periods):
            raise HomeAssistantError("The schedule is used by a planned period")
        del self.state.schedules[sched.id]
        self._changed()

    @callback
    def save_week(self, key: str, raw_week: Any) -> None:
        """Replace the weekly plan of a schedule (a global one changes for every room)."""
        sched = self.find_schedule(key)
        if self.is_global(sched.id):
            self.hub.save_global_week(sched.id, raw_week)
            return
        sched.week = self.hub.parse_week(raw_week)
        self._changed()

    def uses_schedule(self, schedule_id: str) -> bool:
        """Return True if the room's active schedule or one of its periods uses it."""
        return self.state.active_schedule == schedule_id or any(
            p.schedule == schedule_id for p in self.state.periods
        )

    def replace_schedule(self, local_id: str, global_id: str) -> None:
        """Replace an own schedule by a global one with the same plan (merge)."""
        if self.state.active_schedule == local_id:
            self.state.active_schedule = global_id
        for period in self.state.periods:
            if period.schedule == local_id:
                period.schedule = global_id
        self.state.schedules.pop(local_id, None)

    def drop_global(self, global_id: str) -> tuple[bool, int]:
        """A global schedule was deleted: remove its periods; if active, switch off.

        Returns (switched off, number of removed periods). The room keeps a valid
        active schedule: another available one or, if there is none, a local copy of
        the deleted schedule.
        """
        before = len(self.state.periods)
        self.state.periods = [p for p in self.state.periods if p.schedule != global_id]
        removed = before - len(self.state.periods)
        switched_off = False
        if self.state.active_schedule == global_id:
            deleted = self.hub.schedules[global_id]
            others = [s for s in self.available_schedules() if s.id != global_id]
            if others:
                self.state.active_schedule = others[0].id
            else:
                copy = Schedule(slugify(deleted.name) or "plan", deleted.name, deleted.week)
                if copy.id.startswith(GLOBAL_ID_PREFIX):
                    copy.id = f"plan_{copy.id}"
                self.state.schedules[copy.id] = copy
                self.state.active_schedule = copy.id
            self.state.mode = MODE_OFF
            self._clear_hand()
            self._clear_deviations()
            switched_off = True
        return switched_off, removed

    @callback
    def refresh(self) -> None:
        """Re-evaluate after a change outside the room (e.g. a global schedule)."""
        self._reevaluate()

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
        group: str | None = None,
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
            group=group,
        )

    def _periods_changed(self) -> None:
        now = dt_util.utcnow()
        self._drop_expired_periods(now)
        self.hub.save()
        self._reevaluate()  # a period may start or end right now

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
        group: str | None = None,
        validate_only: bool = False,
    ) -> Period:
        """Plan a period that activates a schedule and/or mode.

        Periods planned together for several rooms share ``group`` as their id.
        ``validate_only`` builds the period without adding it.
        """
        now = dt_util.utcnow()
        if group is not None and any(p.id == group for p in self.state.periods):
            raise HomeAssistantError(f"{self.name}: period {group!r} already exists")
        period = self._build_period(
            period_id=group or uuid.uuid4().hex[:12],
            created=now,
            start=start or now,
            end=end,
            schedule=schedule,
            mode=mode,
            temperature=temperature,
            summary=summary,
            group=group,
        )
        if validate_only:
            return period
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
        validate_only: bool = False,
    ) -> Period:
        """Change a period in place (id and priority are kept).

        Only the given fields change. Choosing a schedule clears the mode and vice
        versa unless both are given; ``open_end`` removes the end. ``validate_only``
        builds the changed period without storing it.
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
            group=old.group,
        )
        if validate_only:
            return period
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
        self._reevaluate()
        return before - len(self.state.periods)

    def period_summary(self, period: Period) -> str:
        """Human readable description of a period."""
        if period.summary:
            return period.summary
        parts: list[str] = []
        if period.schedule and self.state.has_schedule(period.schedule):
            parts.append(self.state.lookup(period.schedule).name)
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
            "batteries": self.batteries(),
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
            "hand_change": self.hand_change,
            "target_temperature": target.temperature,
            "target_source": target.source,
            "target_variable": self.target_variable(target.source),
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
            "trv_deviations": self.deviations_list(),
            "next_change": nxt[0].isoformat() if nxt else None,
            "next_temperature": nxt[1] if nxt else None,
            "schedules": self.schedules_list(with_weeks=with_weeks),
            "labels": self.labels(),
        }

    def schedules_list(self, *, with_weeks: bool = True) -> list[dict[str, Any]]:
        """Own and visible global schedules, plus global ones in use but not offered."""
        used = {self.state.active_schedule} | {p.schedule for p in self.state.periods if p.schedule}
        result = []
        for sched in self.state.schedules.values():
            result.append(self._schedule_dict(sched, with_weeks, is_global=False, hidden=False))
        for shared in self.hub.schedules.values():
            visible = shared.visible_to(self.entry_id)
            if visible or shared.id in used:
                result.append(
                    self._schedule_dict(shared, with_weeks, is_global=True, hidden=not visible)
                )
        return result

    @staticmethod
    def _schedule_dict(
        sched: Schedule, with_weeks: bool, *, is_global: bool, hidden: bool
    ) -> dict[str, Any]:
        data: dict[str, Any] = {"id": sched.id, "name": sched.name}
        if with_weeks:
            data["week"] = sched.week.to_dict()
        if is_global:
            data["global"] = True
        if hidden:
            data["hidden"] = True
        return data

    def labels(self) -> list[dict[str, Any]]:
        """Home Assistant labels of the room device (used to select groups of rooms)."""
        device = dr.async_get(self.hass).async_get_device(identifiers={(DOMAIN, self.entry_id)})
        if device is None or not device.labels:
            return []
        registry = lr.async_get(self.hass)
        result = []
        for label_id in sorted(device.labels):
            if (label := registry.async_get_label(label_id)) is not None:
                result.append(
                    {
                        "id": label.label_id,
                        "name": label.name,
                        "icon": label.icon,
                        "color": label.color,
                    }
                )
        return result
