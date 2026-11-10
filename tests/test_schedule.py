"""Tests for the pure schedule module (no Home Assistant needed)."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.bestthermostat.schedule import (
    DAYS,
    MODE_AUTO,
    MODE_HEAT,
    MODE_OFF,
    GlobalOverride,
    RoomState,
    Schedule,
    ScheduleError,
    Slot,
    Week,
    clamp,
    compute_target,
    copy_day,
    default_week,
    localize,
    next_change,
    resolve,
    slot_at,
)

BERLIN = ZoneInfo("Europe/Berlin")
VARS = {"comfort": 21.0, "eco": 17.0}


def simple_week() -> Week:
    day = [
        {"start": "00:00", "temperature": 17},
        {"start": "06:00", "temperature": 21},
        {"start": "22:00", "temperature": 17},
    ]
    return Week.from_dict({d: day for d in DAYS})


def local(*args: int) -> datetime:
    return datetime(*args, tzinfo=BERLIN)


# ------------------------------------------------------------------ validation


def test_roundtrip() -> None:
    week = default_week()
    assert Week.from_dict(week.to_dict()) == week


@pytest.mark.parametrize(
    "day",
    [
        [],
        [{"start": "06:00", "temperature": 20}],
        [{"start": "00:00", "temperature": 20}, {"start": "00:00", "temperature": 21}],
        [{"start": "00:07", "temperature": 20}],
        [{"start": "24:00", "temperature": 20}],
        [{"start": "00:00", "temperature": 20.3}],
        [{"start": "00:00", "temperature": 50}],
        [{"start": "00:00"}],
        [{"start": "00:00", "temperature": 20, "variable": "eco"}],
        [{"start": "0:00", "temperature": 20}],
    ],
)
def test_invalid_days(day: list) -> None:
    with pytest.raises(ScheduleError):
        Week.from_dict({d: day for d in DAYS})


def test_missing_and_unknown_days() -> None:
    raw = simple_week().to_dict()
    del raw["sun"]
    with pytest.raises(ScheduleError):
        Week.from_dict(raw)
    raw = simple_week().to_dict()
    raw["xyz"] = raw["mon"]
    with pytest.raises(ScheduleError):
        Week.from_dict(raw)


def test_slots_are_sorted() -> None:
    raw = {
        d: [{"start": "12:00", "temperature": 20}, {"start": "00:00", "temperature": 18}]
        for d in DAYS
    }
    week = Week.from_dict(raw)
    assert [s.start for s in week.days[0]] == [0, 720]


# ------------------------------------------------------------------- lookup


def test_slot_at() -> None:
    week = simple_week()
    assert slot_at(week, local(2026, 11, 9, 5, 59)).temperature == 17
    assert slot_at(week, local(2026, 11, 9, 6, 0)).temperature == 21
    assert slot_at(week, local(2026, 11, 9, 21, 59)).temperature == 21
    assert slot_at(week, local(2026, 11, 9, 23, 0)).temperature == 17


def test_next_change_same_day_and_over_midnight() -> None:
    week = simple_week()
    when, slot = next_change(week, local(2026, 11, 9, 7, 0), BERLIN)  # type: ignore[misc]
    assert when == local(2026, 11, 9, 22, 0)
    assert slot.temperature == 17
    when, slot = next_change(week, local(2026, 11, 9, 22, 0), BERLIN)  # type: ignore[misc]
    assert when == local(2026, 11, 10, 0, 0)


def test_next_change_is_strictly_after_now() -> None:
    week = simple_week()
    when, _ = next_change(week, local(2026, 11, 9, 6, 0), BERLIN)  # type: ignore[misc]
    assert when == local(2026, 11, 9, 22, 0)


def test_different_days() -> None:
    raw = simple_week().to_dict()
    raw["sat"] = [{"start": "00:00", "temperature": 18}, {"start": "09:00", "temperature": 22}]
    week = Week.from_dict(raw)
    # Saturday 2026-11-14
    assert slot_at(week, local(2026, 11, 14, 7, 0)).temperature == 18
    when, _ = next_change(week, local(2026, 11, 14, 1, 0), BERLIN)  # type: ignore[misc]
    assert when == local(2026, 11, 14, 9, 0)


# ---------------------------------------------------------------------- DST


def test_dst_gap_moves_to_next_valid_time() -> None:
    # 2026-03-29: 02:00 -> 03:00 in Berlin
    when = localize(datetime(2026, 3, 29).date(), 2 * 60 + 30, BERLIN)
    assert when.astimezone(UTC) == datetime(2026, 3, 29, 1, 0, tzinfo=UTC)
    assert (when.astimezone(BERLIN).hour, when.astimezone(BERLIN).minute) == (3, 0)


def test_dst_gap_next_change() -> None:
    raw = {
        d: [{"start": "00:00", "temperature": 17}, {"start": "02:30", "temperature": 21}]
        for d in DAYS
    }
    week = Week.from_dict(raw)
    now = datetime(2026, 3, 29, 0, 30, tzinfo=UTC)  # 01:30 CET
    when, slot = next_change(week, now, BERLIN)  # type: ignore[misc]
    assert when == datetime(2026, 3, 29, 1, 0, tzinfo=UTC)
    assert slot.temperature == 21
    # At 03:00 CEST the 02:30 slot is active
    assert slot_at(week, when.astimezone(BERLIN)).temperature == 21


def test_dst_fold_runs_once() -> None:
    # 2026-10-25: 03:00 CEST -> 02:00 CET, 02:30 exists twice
    raw = {
        d: [{"start": "00:00", "temperature": 17}, {"start": "02:30", "temperature": 21}]
        for d in DAYS
    }
    week = Week.from_dict(raw)
    now = datetime(2026, 10, 25, 0, 0, tzinfo=UTC)  # 02:00 CEST
    when, _ = next_change(week, now, BERLIN)  # type: ignore[misc]
    assert when == datetime(2026, 10, 25, 0, 30, tzinfo=UTC)  # first 02:30
    nxt, _ = next_change(week, when, BERLIN)  # type: ignore[misc]
    assert nxt.astimezone(BERLIN).date() == datetime(2026, 10, 26).date()
    assert nxt - when > timedelta(hours=20)


# ---------------------------------------------------------------- variables


def test_resolve_variable() -> None:
    assert resolve(Slot(0, variable="eco"), VARS) == 17.0
    assert resolve(Slot(0, variable="missing"), VARS) is None
    assert resolve(Slot(0, temperature=19.5), VARS) == 19.5
    assert default_week().variables() == {"comfort", "eco"}


def test_clamp() -> None:
    assert clamp(21.3, 5, 30, 0.5) == 21.5
    assert clamp(3, 5, 30, 0.5) == 5
    assert clamp(31, 5, 30, 1) == 30
    assert clamp(20.5, None, None, 1.0) in (20.0, 21.0)


def test_copy_day() -> None:
    raw = simple_week().to_dict()
    raw["mon"] = [{"start": "00:00", "temperature": 19}]
    week = copy_day(Week.from_dict(raw), 0, [1, 2, 3, 4])
    assert week.days[4] == week.days[0]
    assert week.days[5] != week.days[0]


# ------------------------------------------------------------ compute_target


def room(**kwargs: object) -> RoomState:
    sched = Schedule("standard", "Standard", default_week())
    return RoomState(schedules={"standard": sched}, active_schedule="standard", **kwargs)  # type: ignore[arg-type]


def target(state: RoomState, now: datetime, override: GlobalOverride | None = None):
    return compute_target(
        state,
        frost_temperature=5.0,
        override=override or GlobalOverride(),
        variables=VARS,
        now=now,
        tz=BERLIN,
    )


def test_target_modes() -> None:
    now = local(2026, 11, 9, 7, 0)  # Monday, comfort
    assert target(room(), now).temperature == 21.0
    assert target(room(), local(2026, 11, 9, 23, 0)).temperature == 17.0
    assert target(room(mode=MODE_HEAT, manual_temperature=19.0), now).temperature == 19.0
    assert target(room(mode=MODE_OFF), now).temperature == 5.0


def test_target_hand_change() -> None:
    now = local(2026, 11, 9, 7, 0)
    state = room(hand_temperature=23.0, hand_until=local(2026, 11, 9, 22, 0))
    assert target(state, now).temperature == 23.0
    assert target(state, local(2026, 11, 9, 22, 0)).temperature == 17.0


def test_target_override() -> None:
    now = local(2026, 11, 9, 7, 0)
    override = GlobalOverride(active=True, temperature=15.0)
    assert target(room(), now, override).temperature == 15.0
    assert target(room(mode=MODE_HEAT), now, override).temperature == 20.0
    override.include_off = True
    assert target(room(mode=MODE_OFF), now, override).temperature == 15.0
    override.variable = "eco"
    assert target(room(), now, override).temperature == 17.0
    assert target(room(), now, GlobalOverride(active=False)).source == "schedule"
    assert room().mode == MODE_AUTO


def test_override_mode_flags() -> None:
    override = GlobalOverride(active=True, include_manual=True)
    assert override.applies_to(MODE_AUTO)
    assert override.applies_to(MODE_HEAT)
    assert not override.applies_to(MODE_OFF)
    override = GlobalOverride(active=True, include_off=True)
    assert not override.applies_to(MODE_HEAT)
    assert override.applies_to(MODE_OFF)
    assert not GlobalOverride(active=False, include_off=True).applies_to(MODE_OFF)
