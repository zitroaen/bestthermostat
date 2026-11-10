"""Calendar of planned periods (view, create and delete them in the HA calendar)."""

from __future__ import annotations

from datetime import date, datetime, timedelta
import re
from typing import Any

from homeassistant.components.calendar import (
    CalendarEntity,
    CalendarEntityFeature,
    CalendarEvent,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from . import RoomConfigEntry
from .entity import RoomEntity
from .room import RoomController
from .schedule import MODE_AUTO, MODE_HEAT, MODE_OFF, Period

# Periods without end are shown with this length.
OPEN_END = timedelta(days=3650)

OFF_WORDS = {"aus", "off", "frostschutz", "frost"}
AUTO_WORDS = {"auto", "automatik", "zeitplan", "schedule"}
NUMBER = re.compile(r"(\d{1,2}(?:[.,]\d)?)")


async def async_setup_entry(
    hass: HomeAssistant, entry: RoomConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the calendar."""
    async_add_entities([PeriodCalendar(entry.runtime_data)])


def parse_summary(controller: RoomController, summary: str) -> dict[str, Any]:
    """Translate an event title into period settings.

    Accepted: a schedule name ("Gast"), "Aus"/"Off", "Auto", or a temperature
    ("Manuell 22", "22,5 °C"). The title is kept as the period's summary.
    """
    text = summary.strip()
    folded = text.casefold()
    for sched in sorted(
        controller.state.schedules.values(), key=lambda s: len(s.name), reverse=True
    ):
        if sched.name.casefold() in folded:
            return {"schedule": sched.id}
    words = set(re.findall(r"\w+", folded))
    if words & OFF_WORDS:
        return {"mode": MODE_OFF}
    if match := NUMBER.search(folded):
        return {"mode": MODE_HEAT, "temperature": float(match.group(1).replace(",", "."))}
    if words & AUTO_WORDS:
        return {"mode": MODE_AUTO}
    names = ", ".join(s.name for s in controller.state.schedules.values())
    raise HomeAssistantError(
        f"Unknown event title {summary!r}. Use a schedule name ({names}), "
        "'Aus', 'Auto' or a temperature such as 'Manuell 22'"
    )


def _to_datetime(value: date | datetime) -> datetime:
    if isinstance(value, datetime):
        return value
    return dt_util.start_of_local_day(value)


class PeriodCalendar(RoomEntity, CalendarEntity):
    """Periods of a room as calendar events."""

    _attr_translation_key = "periods"
    _attr_supported_features = (
        CalendarEntityFeature.CREATE_EVENT
        | CalendarEntityFeature.DELETE_EVENT
        | CalendarEntityFeature.UPDATE_EVENT
    )

    def __init__(self, controller: RoomController) -> None:
        """Initialize."""
        super().__init__(controller, "periods")

    def _event(self, period: Period) -> CalendarEvent:
        start = dt_util.as_local(period.start)
        end = dt_util.as_local(period.end) if period.end else start + OPEN_END
        return CalendarEvent(
            start=start,
            end=end,
            summary=self.controller.period_summary(period),
            description=None if period.end else "Bis auf Weiteres / until cancelled",
            uid=period.id,
        )

    @property
    def event(self) -> CalendarEvent | None:
        """The active period, otherwise the next planned one."""
        if (active := self.controller.active_period) is not None:
            return self._event(active)
        now = dt_util.utcnow()
        upcoming = sorted(
            (p for p in self.controller.state.periods if p.start > now), key=lambda p: p.start
        )
        return self._event(upcoming[0]) if upcoming else None

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        """Return periods overlapping the requested range."""
        events = []
        for period in sorted(self.controller.state.periods, key=lambda p: p.start):
            event = self._event(period)
            if event.start_datetime_local < end_date and event.end_datetime_local > start_date:
                events.append(event)
        return events

    def _period_kwargs(self, event: dict[str, Any]) -> dict[str, Any]:
        if event.get("rrule"):
            raise HomeAssistantError("Recurring events are not supported")
        summary = str(event.get("summary") or "")
        kwargs = parse_summary(self.controller, summary)
        start = _to_datetime(event["dtstart"])
        end = _to_datetime(event["dtend"]) if event.get("dtend") else None
        return {**kwargs, "start": start, "end": end, "summary": summary}

    async def async_create_event(self, **kwargs: Any) -> None:
        """Create a period from a calendar event."""
        self.controller.add_period(**self._period_kwargs(kwargs))

    async def async_delete_event(
        self,
        uid: str,
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """Delete (cancel) a period."""
        self.controller.cancel_period(uid)

    async def async_update_event(
        self,
        uid: str,
        event: dict[str, Any],
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """Replace a period."""
        kwargs = self._period_kwargs(event)
        self.controller.add_period(**kwargs)
        self.controller.cancel_period(uid)
