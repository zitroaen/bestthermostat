"""Rough performance figures (20 rooms). Prints numbers; asserts generous limits."""

from __future__ import annotations

import json
import time

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity
import pytest

from custom_components.bestthermostat.const import DOMAIN, SIGNAL_UPDATE
from custom_components.bestthermostat.hub import get_hub
from custom_components.bestthermostat.websocket import _build_snapshot

from .conftest import TRV_ATTRS
from .test_integration import MONDAY_7, settle

ROOMS = 20


@pytest.fixture
async def many_rooms(
    hass: HomeAssistant, trvs: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    """20 rooms with two TRVs and three schedules each."""
    freezer.move_to(MONDAY_7)
    for i in range(ROOMS):
        for n in (1, 2):
            hass.states.async_set(f"climate.r{i}_{n}", "heat", TRV_ATTRS)
        result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
        if DOMAIN in hass.data:
            get_hub(hass).sender.delay = 0
        await hass.config_entries.flow.async_configure(
            result["flow_id"],
            {
                "name": f"Room {i}",
                "trvs": [f"climate.r{i}_1", f"climate.r{i}_2"],
                "frost_temperature": 5.0,
                "hand_change": "until_next_slot",
                "sync_trvs": True,
                "hide_trvs": False,
            },
        )
        get_hub(hass).sender.delay = 0
    await settle(hass)
    for controller in get_hub(hass).controllers.values():
        controller.create_schedule("Guest")
        controller.create_schedule("Holiday")
    await settle(hass)


def _cpu() -> float:
    # freezegun freezes time.perf_counter; CPU time of the thread is not patched.
    return time.thread_time()


async def test_snapshot_cost(hass: HomeAssistant, many_rooms: None) -> None:
    """Time and size of one full snapshot."""
    start = _cpu()
    for _ in range(20):
        snap = _build_snapshot(hass)
    per_snapshot = (_cpu() - start) / 20
    size = len(json.dumps(snap, default=str))
    print(f"\nsnapshot: {per_snapshot * 1000:.2f} ms, {size / 1024:.1f} KiB for {ROOMS} rooms")
    assert per_snapshot < 0.5


async def test_attribute_only_update(
    hass: HomeAssistant, many_rooms: None, monkeypatch: pytest.MonkeyPatch
) -> None:
    """An attribute-only TRV update (e.g. link quality) should cause no work."""
    await hass.async_block_till_done()
    writes = 0
    original = Entity.async_write_ha_state

    def counting(self: Entity) -> None:
        nonlocal writes
        if self.platform and self.platform.platform_name == DOMAIN:
            writes += 1
        original(self)

    monkeypatch.setattr(Entity, "async_write_ha_state", counting)
    signals = 0

    def count_signal(_entry_id: object = None) -> None:
        nonlocal signals
        signals += 1

    async_dispatcher_connect(hass, SIGNAL_UPDATE, count_signal)
    current = dict(hass.states.get("climate.r0_1").attributes)  # type: ignore[union-attr]
    hass.states.async_set("climate.r0_1", "heat", {**current, "linkquality": 87})
    await hass.async_block_till_done()
    print(f"\nattribute-only update: {writes} entity writes, {signals} card updates")
    assert writes == 0
    assert signals == 0

    # A relevant change (current temperature) still updates the room.
    hass.states.async_set(
        "climate.r0_1", "heat", {**current, "linkquality": 87, "current_temperature": 19.5}
    )
    await hass.async_block_till_done()
    assert writes > 0
    assert signals == 1
