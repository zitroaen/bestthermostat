"""Hide or show the TRVs used by a room."""

from __future__ import annotations

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er


@callback
def async_sync_trv_visibility(hass: HomeAssistant, trvs: list[str], hide: bool) -> None:
    """Hide the TRVs (if requested) or show the ones we hid earlier."""
    if hide:
        async_hide_trvs(hass, trvs)
    else:
        async_unhide_trvs(hass, trvs)


@callback
def async_hide_trvs(hass: HomeAssistant, trvs: list[str]) -> None:
    """Hide TRVs that are visible. Entities hidden by the user stay as they are."""
    registry = er.async_get(hass)
    for entity_id in trvs:
        entry = registry.async_get(entity_id)
        if entry is not None and entry.hidden_by is None:
            registry.async_update_entity(entity_id, hidden_by=er.RegistryEntryHider.INTEGRATION)


@callback
def async_unhide_trvs(hass: HomeAssistant, trvs: list[str]) -> None:
    """Show TRVs again that were hidden by this integration."""
    registry = er.async_get(hass)
    for entity_id in trvs:
        entry = registry.async_get(entity_id)
        if entry is not None and entry.hidden_by is er.RegistryEntryHider.INTEGRATION:
            registry.async_update_entity(entity_id, hidden_by=None)
