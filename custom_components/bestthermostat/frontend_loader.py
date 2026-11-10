"""Serve the Lovelace card and make sure dashboards load it."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import CARD_FILENAME, FRONTEND_URL_BASE, VERSION

_LOGGER = logging.getLogger(__name__)

CARD_URL = f"{FRONTEND_URL_BASE}/{CARD_FILENAME}"


async def async_register_card(hass: HomeAssistant) -> None:
    """Serve the card and register it as a dashboard resource.

    In storage mode (the default) the card is added to the Lovelace resources,
    exactly like adding it by hand. An existing entry for the card (e.g. one the
    user added manually) is reused and its version updated. For YAML resource
    mode the card is loaded as an extra frontend module instead.
    """
    path = Path(__file__).parent / "frontend" / CARD_FILENAME
    if not path.exists():
        _LOGGER.warning("Card file %s is missing, the card will not be available", path)
        return
    if "http" not in hass.config.components:
        return
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(path), cache_headers=False)]
    )
    url = f"{CARD_URL}?v={VERSION}"
    try:
        if await _async_register_resource(hass, url):
            return
    except Exception:
        _LOGGER.exception("Could not register the card as dashboard resource")
    if "frontend" in hass.config.components:
        from homeassistant.components.frontend import add_extra_js_url

        add_extra_js_url(hass, url)
        _LOGGER.debug("Card loaded as extra module (YAML resource mode)")


def _resources(hass: HomeAssistant) -> Any:
    lovelace = hass.data.get("lovelace")
    if lovelace is None:
        return None
    if isinstance(lovelace, dict):
        return lovelace.get("resources")
    return getattr(lovelace, "resources", None)


async def _async_register_resource(hass: HomeAssistant, url: str) -> bool:
    """Add or update the Lovelace resource. Return False if not possible."""
    resources = _resources(hass)
    if resources is None or not hasattr(resources, "async_create_item"):
        return False  # YAML resource mode or lovelace not loaded
    if not getattr(resources, "loaded", True):
        await resources.async_load()
        resources.loaded = True
    for item in resources.async_items():
        if str(item.get("url", "")).split("?")[0] == CARD_URL:
            if item.get("url") != url or item.get("type") != "module":
                await resources.async_update_item(item["id"], {"res_type": "module", "url": url})
                _LOGGER.info("Updated dashboard resource for the card to %s", url)
            return True
    await resources.async_create_item({"res_type": "module", "url": url})
    _LOGGER.info("Registered dashboard resource %s", url)
    return True
