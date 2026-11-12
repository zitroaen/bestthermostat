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
frontend/demo/         stand-alone preview with fake data + screenshot script
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

A TRV switching to `auto` (from another available state) is handled separately
(`RoomController._on_trv_auto`): room → auto, the TRV's previous hvac mode is restored
and that write is registered with the sender (`note_write`) so reports right after it
are re-checked instead of becoming hand changes. The sender remembers the contexts of
the last writes per TRV, so a late echo of an earlier write is still recognised.

## Translations

Config flow, entities and services: `translations/*.json` (`en.json` is the reference,
`strings.json` is identical). Runtime texts: `i18n.py`. Cards: `frontend/src/utils.ts`.

## Notifications

- `Hub.notify(entry_id | None)` sends the dispatcher signal `SIGNAL_UPDATE`. Websocket
  subscribers react to every signal; entities of a room react to the room-specific signal
  `SIGNAL_UPDATE_<entry_id>` and to global updates (`None`).
- TRV state events only notify when something the room uses changed
  (`room.RELEVANT_ATTRIBUTES`); link quality, last seen etc. are ignored.
- `RoomController.notify()` = room entities + cards. `notify_entities()` = entities only
  (used by `Hub.apply_all()`, which then informs the cards once).

## WebSocket API (used by the cards)

All commands are `bestthermostat/<name>` (see `websocket.py`):

| Command | Purpose |
|---|---|
| `subscribe` | Full snapshot now and after every change (coalesced, `SNAPSHOT_DELAY`). The snapshot is built once per change and shared by all subscribers; any `SIGNAL_UPDATE` invalidates it |
| `state` | One snapshot |
| `room/mode`, `room/temperature` | Mode / temperature of a room |
| `schedule/create`, `rename`, `delete`, `save`, `activate`, `copy_to_rooms` | Schedules |
| `variable/create`, `update`, `delete` | Global variables |
| `override/set` | Global override |
| `period/add`, `update`, `cancel` | Periods |

A snapshot is `{version, rooms[], variables[], override}`; a room is
`RoomController.as_dict()` (typed in `frontend/src/api.ts` as `RoomData`). Errors are
`HomeAssistantError`s and reach the card as the message text.

## Frontend

```
frontend/src/
  index.ts          registers the two cards and the card picker entries
  api.ts            types, one shared websocket subscription for all cards, ws() helper
  utils.ts          time/temperature helpers, colour scale, STRINGS (en/de), define()
  room-view.ts      presentation helpers shared by both cards (status line, priorities, battery)
  styles.ts         shared CSS
  swipe.ts          horizontal swipe gesture (touch + pointer)
  card.ts           <bestthermostat-card> room card (also embedded by the overview)
  overview-card.ts  <bestthermostat-overview-card>
  week-editor.ts    <bt-week-editor> full-screen weekly editor (appended to document.body)
  period-dialog.ts  <bt-period-dialog> plan/edit a period (appended to document.body)
  config-editor.ts  visual editors of both cards (ha-form schemas)
  version.ts        CARD_VERSION, must equal the manifest version
```

The cards hold no business logic: they render the snapshot and send commands. `api.ts`
keeps the objects of the previous snapshot where nothing changed (rooms, variables,
override), so a card whose room did not change skips rendering (`shouldUpdate`); new
`hass` objects are ignored unless language or connection changed. A failed subscription
(integration not loaded yet) is retried with backoff and the cards say so. One shared
minute timer (`onMinute`) refreshes time-dependent parts. Lit re-assigns object
bindings on every render, so setters such as the room card's `config` ignore the same
object. Values the
user is changing are kept as "pending" locally and sent debounced. The cards use only
Home Assistant theme variables, `ha-card`, `ha-icon` and (in the editors) `ha-form`.

## Tests

`tests/test_performance.py` prints the cost of a snapshot (20 rooms) and checks that an
attribute-only TRV update causes no work. Run with `-s` to see the numbers.

- `tests/test_schedule.py` – pure logic (slots, DST, periods, target priority)
- `tests/test_integration.py` – running Home Assistant with two fake TRVs
  (`tests/conftest.py` records `climate.set_temperature` calls)
- `tests/test_periods.py` – periods, calendar, services
- `tests/test_frontend.py` – card registration and version consistency

There are no automated frontend tests; use `npm run demo`.

## Known limitations

- Temperatures are assumed to be °C (documented in the reference).
- The cards use Home Assistant's time zone (`hass.config.time_zone`) for "today" and
  the now marker; times are displayed in the zone of the user profile.
