"""Global, rate limited write queue for TRV set-points."""

from __future__ import annotations

import asyncio
from collections import deque
import logging
import time

from homeassistant.components.climate import (
    ATTR_TEMPERATURE,
    DOMAIN as CLIMATE_DOMAIN,
    SERVICE_SET_TEMPERATURE,
)
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import Context, HomeAssistant, callback

from .const import OWN_WRITE_WINDOW, SEND_DELAY, SEND_RETRIES, SEND_RETRY_DELAY

_LOGGER = logging.getLogger(__name__)


class Sender:
    """Send set-points one after another to avoid flooding the Zigbee network."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize."""
        self.hass = hass
        self.delay = SEND_DELAY
        self.retry_delay = SEND_RETRY_DELAY
        self._pending: dict[str, float] = {}
        self._order: deque[str] = deque()
        self._latest: dict[str, float] = {}
        self._attempts: dict[str, int] = {}
        self._last: dict[str, tuple[float, float, str]] = {}
        # Contexts of recent writes per entity: echoes of an earlier write can arrive
        # after a newer write was sent.
        self._contexts: dict[str, deque[tuple[float, str]]] = {}
        self._task: asyncio.Task[None] | None = None
        self._retry_handles: dict[str, asyncio.TimerHandle] = {}

    @callback
    def send(self, entity_id: str, temperature: float, *, _retry: bool = False) -> None:
        """Queue a set-point. A newer value for the same entity replaces an older one."""
        if not _retry:
            self._attempts.pop(entity_id, None)
            if handle := self._retry_handles.pop(entity_id, None):
                handle.cancel()
        self._latest[entity_id] = temperature
        if entity_id not in self._pending:
            self._order.append(entity_id)
        self._pending[entity_id] = temperature
        if self._task is None or self._task.done():
            self._task = self.hass.async_create_background_task(
                self._run(), "bestthermostat sender"
            )

    def is_pending(self, entity_id: str) -> bool:
        """Return True if a write for the entity is queued."""
        return entity_id in self._pending or entity_id in self._retry_handles

    def is_own(self, entity_id: str, context: Context | None, temperature: float) -> bool:
        """Return True if a state change was most likely caused by our own write."""
        last = self._last.get(entity_id)
        if last is None:
            return False
        sent_temp, sent_at, _context_id = last
        if context is not None:
            now = time.monotonic()
            for at, context_id in self._contexts.get(entity_id, ()):
                if now - at < OWN_WRITE_WINDOW and context_id in (context.id, context.parent_id):
                    return True
        return (
            abs(float(temperature) - sent_temp) < 0.05
            and time.monotonic() - sent_at < OWN_WRITE_WINDOW
        )

    def note_write(self, entity_id: str, temperature: float, context: Context) -> None:
        """Remember a write done elsewhere (e.g. a mode change) as our own.

        Reports right after it are then re-checked instead of being taken as hand changes.
        """
        self._remember(entity_id, temperature, context)

    def _remember(self, entity_id: str, temperature: float, context: Context) -> None:
        now = time.monotonic()
        self._last[entity_id] = (temperature, now, context.id)
        self._contexts.setdefault(entity_id, deque(maxlen=8)).append((now, context.id))

    def recently_sent(self, entity_id: str, seconds: float) -> bool:
        """Return True if we wrote to the entity within the last ``seconds``."""
        last = self._last.get(entity_id)
        return last is not None and time.monotonic() - last[1] < seconds

    async def _run(self) -> None:
        first = True
        while self._order:
            if not first and self.delay:
                await asyncio.sleep(self.delay)
            first = False
            entity_id = self._order.popleft()
            temperature = self._pending.pop(entity_id)
            context = Context()
            self._remember(entity_id, temperature, context)
            _LOGGER.debug("Sending %s °C to %s (context %s)", temperature, entity_id, context.id)
            try:
                await self.hass.services.async_call(
                    CLIMATE_DOMAIN,
                    SERVICE_SET_TEMPERATURE,
                    {ATTR_ENTITY_ID: entity_id, ATTR_TEMPERATURE: temperature},
                    blocking=True,
                    context=context,
                )
            except Exception as err:  # noqa: BLE001 - any failure must not block other TRVs
                self._handle_failure(entity_id, temperature, err)
            else:
                self._attempts.pop(entity_id, None)

    def _handle_failure(self, entity_id: str, temperature: float, err: Exception) -> None:
        attempts = self._attempts.get(entity_id, 0) + 1
        self._attempts[entity_id] = attempts
        if attempts > SEND_RETRIES:
            _LOGGER.error(
                "Giving up setting %s to %s °C after %s attempts: %s",
                entity_id,
                temperature,
                attempts,
                err,
            )
            self._attempts.pop(entity_id, None)
            return
        _LOGGER.warning(
            "Setting %s to %s °C failed (attempt %s): %s", entity_id, temperature, attempts, err
        )

        @callback
        def _retry() -> None:
            self._retry_handles.pop(entity_id, None)
            if self._latest.get(entity_id) == temperature and entity_id not in self._pending:
                self.send(entity_id, temperature, _retry=True)

        self._retry_handles[entity_id] = self.hass.loop.call_later(
            self.retry_delay * attempts, _retry
        )

    @callback
    def async_shutdown(self) -> None:
        """Cancel pending work."""
        for handle in self._retry_handles.values():
            handle.cancel()
        self._retry_handles.clear()
        self._pending.clear()
        self._order.clear()
        if self._task and not self._task.done():
            self._task.cancel()
