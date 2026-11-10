"""Fixtures."""

from __future__ import annotations

from collections.abc import Generator
from typing import Any

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.setup import async_setup_component
import pytest

from custom_components.bestthermostat import room as room_module

TRV_ATTRS: dict[str, Any] = {
    "temperature": 17.0,
    "current_temperature": 19.0,
    "min_temp": 5.0,
    "max_temp": 30.0,
    "target_temp_step": 0.5,
    "hvac_action": "idle",
    "hvac_modes": ["heat", "off"],
}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> Generator[None]:
    """Enable custom integrations."""
    yield


@pytest.fixture(autouse=True)
def no_settle(monkeypatch: pytest.MonkeyPatch) -> None:
    """Do not treat changes right after our writes as stale in tests."""
    monkeypatch.setattr(room_module, "SETTLE_SECONDS", 0.0)


@pytest.fixture
async def trvs(hass: HomeAssistant) -> list[ServiceCall]:
    """Two fake TRVs and a fake climate.set_temperature that records calls."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    assert await async_setup_component(hass, "climate", {})
    await hass.async_block_till_done()
    calls: list[ServiceCall] = []

    async def set_temperature(call: ServiceCall) -> None:
        calls.append(call)
        entity_id = call.data["entity_id"]
        state = hass.states.get(entity_id)
        assert state is not None
        attrs = dict(state.attributes)
        attrs["temperature"] = call.data["temperature"]
        hass.states.async_set(entity_id, state.state, attrs, context=call.context)

    hass.services.async_register("climate", "set_temperature", set_temperature)
    for entity_id in ("climate.trv1", "climate.trv2"):
        hass.states.async_set(entity_id, "heat", TRV_ATTRS)
    return calls
