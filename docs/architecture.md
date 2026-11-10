# Architecture

Domain `bestthermostat` · License MIT · Home Assistant ≥ 2025.1

## Layout

```
custom_components/bestthermostat/
  __init__.py          setup, entry types (global / room), services, websocket, card
  manifest.json, services.yaml, icons.json, strings.json, translations/{en,de}.json
  brand/               integration icon (HA ≥ 2026.3)
  const.py             constants
  i18n.py              runtime texts (default names, calendar titles), English fallback
  config_flow.py       room flow, global entry (created automatically), options flows
  schedule.py          PURE Python logic (no HA imports): slots, weeks, next change, DST,
                       periods, global override, target computation
  hub.py               global state: variables, override, persistence, notifications
  room.py              RoomController: target, timers, TRV listener, sync, periods
  sender.py            global write queue (staggered, limited retries, own-write detection)
  visibility.py        hide/show the TRV entities of a room
  frontend_loader.py   serves the card and registers it as a Lovelace resource
  climate.py select.py sensor.py binary_sensor.py calendar.py   (per room)
  number.py switch.py                                           (global)
  services.py websocket.py
  frontend/bestthermostat-card.js   built card (committed)
frontend/src/          TypeScript/Lit sources of the cards (esbuild)
tests/                 pytest + pytest-homeassistant-custom-component
```

**Entry types:** one global entry ("Best Thermostat", singleton, created automatically
with the first room) and one entry per room. The hub lives in `hass.data[DOMAIN]`, room
controllers in `entry.runtime_data`.

**Storage** (`homeassistant.helpers.storage.Store`): `variables`, `override`
(`active`, `temperature`, `variable`, `include_manual`, `include_off`) and per room
`schedules`, `active_schedule`, `mode`, `manual_temperature`, hand change and `periods`.
Room configuration (TRVs, frost temperature, hand-change behaviour, sync, hide) lives in
`entry.options`.

## Target computation

One deterministic function (`schedule.compute_target`), layered like a BACnet priority
array – higher layers never modify lower ones, so ending them restores the previous
behaviour automatically:

1. Global override, if active and it applies to the effective mode
2. Hand change until the next slot (only while the effective mode is auto; capped at the
   end of a running period)
3. Active period (most recently created wins) → effective mode / schedule / temperature
4. Room: off → frost protection, heat → manual temperature, otherwise the slot of the
   effective schedule (variables resolved)

The result is clamped per TRV to its min/max/step. Every change (timer, variable,
override, mode, schedule, period, TRV becoming available) recomputes the target and sends
it to the TRVs that deviate.

## Timers

A single `async_track_point_in_time` per room, scheduled at the earliest of: next slot
start of the effective schedule, end of a hand change, start/end of any period. Wall-clock
times are local; non-existent times (DST gap) move to the next valid time, ambiguous
times (DST fold) run once.

## Own writes vs. hand changes

A TRV state change is ignored when its context matches our write or the value equals the
value we sent within a time window. Reports shortly after our own write are re-checked
later. Remaining changes are treated as hand changes according to the room setting.

## Translations

Config flow, entities and services: `translations/*.json` (`en.json` is the reference,
`strings.json` is identical). Runtime texts: `i18n.py`. Cards: `frontend/src/utils.ts`.
