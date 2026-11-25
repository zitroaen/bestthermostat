"""Fixed temperature calibration (offset) per TRV.

The offset is written to the calibration entity of the TRV's device, e.g.
``number.office_local_temperature_calibration`` (Zigbee2MQTT) or
``number.office_local_temperature_offset`` (ZHA). It is written at start and again
whenever the device reports another value (e.g. after a battery change).

A TRV without such an entity is compensated by the room instead (``compensated``):
it gets ``room target - offset`` as set-point and its reading counts as
``reading + offset``.
"""

from __future__ import annotations

from collections.abc import Callable
import logging
import time

from homeassistant.const import ATTR_ENTITY_ID, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_state_change_event

_LOGGER = logging.getLogger(__name__)

NUMBER_DOMAIN = "number"
SERVICE_SET_VALUE = "set_value"
# Words in the entity id, original name or translation key of a calibration entity.
KEYWORDS = ("calibration", "temperature_offset", "temperature offset")
# A value reported this soon after our write is not answered with another write
# (the device may round or report the old value first); prevents write loops.
REWRITE_PAUSE = 60.0


def find_calibration_entity(hass: HomeAssistant, trv: str) -> str | None:
    """Return the calibration number entity on the device of ``trv``, if any."""
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get(trv)
    if entry is None or entry.device_id is None:
        return None
    found = []
    for e in er.async_entries_for_device(ent_reg, entry.device_id):
        if e.domain != NUMBER_DOMAIN or e.disabled:
            continue
        text = " ".join(s.lower() for s in (e.entity_id, e.original_name, e.translation_key) if s)
        if any(k in text for k in KEYWORDS):
            found.append(e.entity_id)
    return sorted(found)[0] if found else None


def _float(value: object) -> float | None:
    try:
        return None if value is None else float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None


class Calibrator:
    """Keeps the configured offsets on the TRVs of one room."""

    def __init__(self, hass: HomeAssistant, room_name: str, offsets: dict[str, float]) -> None:
        """Initialize with ``{trv entity id: offset in K}``."""
        self.hass = hass
        self.room_name = room_name
        self.offsets = offsets
        self.entities: dict[str, str] = {}  # calibration entity -> TRV
        self.compensated: dict[str, float] = {}  # TRV without calibration entity -> offset
        self._written: dict[str, float] = {}  # calibration entity -> monotonic time
        self._unsub: Callable[[], None] | None = None

    @callback
    def async_start(self) -> None:
        """Find the calibration entities, write the offsets and watch for resets."""
        self.async_stop()
        self.entities = {}
        self.compensated = {}
        for trv, offset in self.offsets.items():
            if (entity_id := find_calibration_entity(self.hass, trv)) is None:
                if offset:
                    _LOGGER.info(
                        "%s: %s has no calibration entity; its offset %s K is compensated "
                        "through the set-point",
                        self.room_name,
                        trv,
                        offset,
                    )
                    self.compensated[trv] = offset
                continue
            self.entities[entity_id] = trv
        if not self.entities:
            return
        self._unsub = async_track_state_change_event(self.hass, list(self.entities), self._on_event)
        for entity_id in self.entities:
            self._check(entity_id, force=True)

    @callback
    def async_stop(self) -> None:
        """Stop watching."""
        if self._unsub:
            self._unsub()
            self._unsub = None

    def wanted(self, entity_id: str) -> float | None:
        """Offset for a calibration entity, clamped and rounded to what it accepts."""
        trv = self.entities.get(entity_id)
        state = self.hass.states.get(entity_id)
        if trv is None or state is None:
            return None
        value = self.offsets[trv]
        low = _float(state.attributes.get("min"))
        high = _float(state.attributes.get("max"))
        step = _float(state.attributes.get("step")) or 0.1
        if low is not None:
            value = max(value, low)
        if high is not None:
            value = min(value, high)
        return round(round(value / step) * step, 2)

    @callback
    def _on_event(self, event: Event[EventStateChangedData]) -> None:
        self._check(event.data["entity_id"])

    @callback
    def _check(self, entity_id: str, *, force: bool = False) -> None:
        state = self.hass.states.get(entity_id)
        if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return  # written when the device reports a value again
        current = _float(state.state)
        want = self.wanted(entity_id)
        if want is None:
            return
        step = _float(state.attributes.get("step")) or 0.1
        if current is not None and abs(current - want) < step / 2:
            return
        last = self._written.get(entity_id)
        if not force and last is not None and time.monotonic() - last < REWRITE_PAUSE:
            return
        self._written[entity_id] = time.monotonic()
        _LOGGER.info(
            "%s: setting calibration of %s from %s to %s",
            self.room_name,
            self.entities[entity_id],
            current,
            want,
        )
        self.hass.async_create_task(self._write(entity_id, want), f"calibrate {entity_id}")

    async def _write(self, entity_id: str, value: float) -> None:
        try:
            await self.hass.services.async_call(
                NUMBER_DOMAIN,
                SERVICE_SET_VALUE,
                {ATTR_ENTITY_ID: entity_id, "value": value},
                blocking=True,
            )
        except Exception as err:  # noqa: BLE001 - a failing device must not break the room
            _LOGGER.warning("%s: could not set %s to %s: %s", self.room_name, entity_id, value, err)
