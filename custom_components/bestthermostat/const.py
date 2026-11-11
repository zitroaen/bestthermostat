"""Constants for Best Thermostat."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "bestthermostat"
NAME: Final = "Best Thermostat"
VERSION: Final = "0.7.2"

CONF_ENTRY_TYPE: Final = "entry_type"
ENTRY_TYPE_GLOBAL: Final = "global"
ENTRY_TYPE_ROOM: Final = "room"
GLOBAL_UNIQUE_ID: Final = "global"

CONF_TRVS: Final = "trvs"
CONF_FROST_TEMPERATURE: Final = "frost_temperature"
CONF_HAND_CHANGE: Final = "hand_change"
CONF_SYNC_TRVS: Final = "sync_trvs"
CONF_HIDE_TRVS: Final = "hide_trvs"
CONF_SIMPLE_MODES: Final = "simple_modes"

HAND_MANUAL: Final = "manual"
HAND_UNTIL_NEXT_SLOT: Final = "until_next_slot"
HAND_IGNORE: Final = "ignore"
HAND_CHANGE_OPTIONS: Final = [HAND_MANUAL, HAND_UNTIL_NEXT_SLOT, HAND_IGNORE]

DEFAULT_FROST_TEMPERATURE: Final = 5.0
DEFAULT_HAND_CHANGE: Final = HAND_UNTIL_NEXT_SLOT
DEFAULT_SYNC_TRVS: Final = True
DEFAULT_HIDE_TRVS: Final = False
DEFAULT_SCHEDULE_ID: Final = "standard"
DEFAULT_VARIABLES: Final = {
    # id: (i18n key of the name, value)
    "comfort": ("var_comfort", 21.0),
    "eco": ("var_eco", 17.0),
}

STORAGE_KEY: Final = DOMAIN
STORAGE_VERSION: Final = 1

SIGNAL_UPDATE: Final = f"{DOMAIN}_update"
"""Dispatcher signal; argument is the room entry_id or None for global changes."""

FRONTEND_URL_BASE: Final = f"/{DOMAIN}_static"
CARD_FILENAME: Final = "bestthermostat-card.js"

SEND_DELAY: Final = 0.75
SEND_RETRIES: Final = 3
SEND_RETRY_DELAY: Final = 10.0
OWN_WRITE_WINDOW: Final = 120.0
SETTLE_SECONDS: Final = 15.0
