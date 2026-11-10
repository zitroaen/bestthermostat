"""Texts created by the backend (default names, calendar titles).

Entity, config flow and service texts live in translations/*.json. The few
strings below are stored or generated at runtime, so they follow the Home
Assistant language. English is the fallback.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

TEXTS: dict[str, dict[str, str]] = {
    "en": {
        "default_schedule": "Default",
        "var_comfort": "Comfort",
        "var_eco": "Eco",
        "manual": "Manual",
        "off": "Off",
        "auto": "Auto",
        "period": "Period",
        "until_cancelled": "Until cancelled",
        "model_room": "Room",
        "model_settings": "Settings",
    },
    "de": {
        "default_schedule": "Standard",
        "var_comfort": "Komfort",
        "var_eco": "Absenk",
        "manual": "Manuell",
        "off": "Aus",
        "auto": "Auto",
        "period": "Zeitraum",
        "until_cancelled": "Bis auf Weiteres",
        "model_room": "Raum",
        "model_settings": "Einstellungen",
    },
}


def text(hass: HomeAssistant | None, key: str) -> str:
    """Return a text in the language of Home Assistant (English fallback)."""
    lang = ((hass.config.language if hass else None) or "en").split("-")[0].lower()
    return TEXTS.get(lang, TEXTS["en"]).get(key, TEXTS["en"][key])
