# Best Thermostat – guide for coding agents

Home Assistant custom integration (HACS), domain `bestthermostat`, plus two Lovelace cards
shipped in the same repository. Room-based weekly heating schedules for radiator
thermostats (TRVs) that Home Assistant exposes as `climate` entities.

Read these before changing behaviour:

- `docs/architecture.md` – code layout, data model, target computation, websocket API,
  frontend structure
- `docs/decisions.md` – product decisions that were made on purpose (do not "fix" them)
- `docs/reference.md` – user-facing behaviour, entities, services, card options
- Open GitHub issues – known bugs and planned work

## Commands

```bash
# Backend (Python 3.13, Home Assistant test harness)
pip install -r requirements_test.txt
ruff check . && ruff format --check custom_components
mypy custom_components/bestthermostat
pytest -q --timeout 60          # always pass a timeout, see "Pitfalls"

# Frontend (TypeScript + Lit, bundled with esbuild)
cd frontend
npm ci
npm run build        # type-checks, then writes ../custom_components/bestthermostat/frontend/bestthermostat-card.js
npm run demo         # http://localhost:4173/frontend/demo/ – cards with fake data, no HA needed
npm run screenshots  # regenerates docs/images/*.png from the demo (needs Playwright + Chromium)
```

CI (`.github/workflows`): `tests.yml` runs ruff, mypy, pytest and checks that the built
card is committed; `validate.yml` runs hassfest and the HACS action; `release.yml`
publishes a release for a tag `vX.Y.Z` that matches the manifest version.

## Rules of this repository

1. **The built card is committed.** After any change in `frontend/src` run
   `npm run build` and commit `custom_components/bestthermostat/frontend/bestthermostat-card.js`.
   CI fails otherwise. HACS installs without a build step.
2. **Version bump with every user-visible change:** `python scripts/bump_version.py X.Y.Z`
   updates manifest, `const.py`, `frontend/src/version.ts`, `package.json`,
   `package-lock.json` and `pyproject.toml` and rebuilds the card. A test checks that all
   of them agree.
3. **`schedule.py` stays pure Python** (no Home Assistant imports). All schedule, period,
   override and target logic lives there and is unit-tested in `tests/test_schedule.py`.
4. **English is the primary language, German is maintained too.** Texts live in three
   places: `translations/en.json` (reference; `strings.json` must be identical) and
   `translations/de.json`; `i18n.py` for texts generated at runtime; `frontend/src/utils.ts`
   (`STRINGS`) for the cards. hassfest rejects `{...}` in translations unless it is a real
   placeholder.
5. **Callbacks must be marked.** Functions passed to `async_track_*`, the dispatcher or the
   event bus need `@callback` (a plain function or lambda runs in a worker thread and
   breaks `async_dispatcher_send`).
6. **Everything local.** No cloud calls, no new Python requirements without a very good
   reason.
7. **No personal data in the repository**: no real room names, entity ids, device models
   of a specific installation, hostnames or people. Use generic examples (Office,
   Bathroom, `climate.office`).
8. Code, comments, commit messages and docs are written in English.
9. Add or adapt tests for backend changes. For UI changes check the result in the demo
   (`npm run demo`) and regenerate the screenshots when the look changed noticeably.

## Workflow

- Work on a feature branch, open a pull request against `main`, squash-merge.
- After a squash merge the branch has diverged from `main`; restart it from `main` or
  merge `origin/main` with `-s ours` before continuing (force pushes may be blocked).
- User-facing behaviour changes go into `docs/reference.md` **and** `docs/reference.de.md`.
  The READMEs are a short introduction only; keep details out of them.
- A decision that changes how the product behaves belongs in `docs/decisions.md`.

## Pitfalls that already cost time

- **Tests and frozen time:** with `freezer`, loops that wait for real time hang. Advance
  with `freezer.tick()` / `async_fire_time_changed` and `await hass.async_block_till_done()`.
  Always run pytest with `--timeout`.
- **Own writes vs. hand changes** (`sender.py`, `room._on_trv_event`): a TRV report counts
  as ours if the context matches or the value equals what we sent within
  `OWN_WRITE_WINDOW`. Zigbee bridges echo our write with a *new* context, so the value
  comparison matters. Tests set `SETTLE_SECONDS` to 0 (see `tests/conftest.py`).
- **Frontend is optional in tests:** `frontend`/`lovelace` are `after_dependencies`, and
  `frontend_loader.py` must keep working when they are not loaded.
- **Card loading:** the card is registered as a Lovelace *resource* with a URL
  `?v=<version>-<hash>`; duplicates are removed. Custom elements are registered through
  the guarded `define()` helper because the file can be loaded twice.
- **Type-only imports are erased** by the bundler. A module that registers a custom
  element needs a side-effect import (`import "./week-editor"`).
- **Dialogs live in `document.body`** (weekly editor, period dialog) so dashboard layouts
  cannot clip them; they are removed in `disconnectedCallback`.
- **Touch gestures** use touch events with `passive: false` (`swipe.ts`); pointer events
  alone do not work reliably in iOS Safari / the companion app.
- **Performance:** the websocket subscription sends whole snapshots, coalesced by
  `SNAPSHOT_DELAY` and cached until the next `SIGNAL_UPDATE` - anything shown in the
  cards must trigger a notify when it changes, or the cards show stale data. Global
  changes call `Hub.apply_all()`, which notifies the cards once, not once per room.
  `Week.to_dict()` is cached: never mutate its result.
- **Timers:** one `async_track_point_in_time` per room (`RoomController._schedule_timer`).
  Never drop the handle without cancelling it.
