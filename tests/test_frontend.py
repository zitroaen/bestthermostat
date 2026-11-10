"""The card is registered as a Lovelace resource automatically."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.bestthermostat.const import DOMAIN, VERSION
from custom_components.bestthermostat.frontend_loader import CARD_URL


def _resources(hass: HomeAssistant):  # type: ignore[no-untyped-def]
    return hass.data["lovelace"].resources


async def test_resource_created(hass: HomeAssistant) -> None:
    """A new installation gets the resource."""
    assert await async_setup_component(hass, "lovelace", {})
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()
    items = _resources(hass).async_items()
    assert [i["url"] for i in items] == [f"{CARD_URL}?v={VERSION}"]
    assert items[0]["type"] == "module"


async def test_manual_resource_is_reused(hass: HomeAssistant) -> None:
    """A resource added by hand is updated instead of duplicated."""
    assert await async_setup_component(hass, "lovelace", {})
    resources = _resources(hass)
    await resources.async_load()
    resources.loaded = True
    await resources.async_create_item({"res_type": "module", "url": CARD_URL})
    await resources.async_create_item({"res_type": "module", "url": "/local/other.js"})
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()
    urls = sorted(i["url"] for i in resources.async_items())
    assert urls == sorted(["/local/other.js", f"{CARD_URL}?v={VERSION}"])


async def test_card_is_served(hass: HomeAssistant, hass_client) -> None:  # type: ignore[no-untyped-def]
    """The JS file is reachable."""
    assert await async_setup_component(hass, "lovelace", {})
    assert await async_setup_component(hass, DOMAIN, {})
    client = await hass_client()
    resp = await client.get(CARD_URL)
    assert resp.status == 200
    assert "bestthermostat-card" in await resp.text()
