# Design decisions

Decisions that were made deliberately. Change them only when the owner asks for it.

## Scope

- The integration controls existing `climate` entities of TRVs. It does not talk to
  devices directly and has no cloud dependency.
- A **room** is one config entry with 1..n TRVs and appears as one device with a room
  thermostat. Global settings live in a second, automatically created entry.
- Not included on purpose: per-room temperature offsets, boost, open-window detection,
  presence detection, external temperature sensors. The integration only sets set-points.

## Modes

- `auto` follows the active schedule, `heat` is manual (fixed temperature), `off` is
  frost protection with a configurable temperature per room.
- Matter / HomeKit bridges cannot show `auto`. The global option "Apple Home / Matter
  compatible modes" makes the room thermostats offer only heat (= schedule) and off. No
  extra entities are created for this.

## Schedules and variables

- Several schedules per room; exactly one is active. Switching is possible from the card,
  a `select` entity and a service.
- Slots lie on a 15-minute grid, temperatures on a 0.5 °C grid. Every day starts with a
  slot at 00:00; a slot is valid until the next one starts.
- **Variables are global** (shared by all rooms). A variable in use cannot be deleted.
- Schedules can be copied to other rooms; an own schedule with the same name is replaced.

## Global schedules and groups of rooms

- A schedule is either **own** (belongs to one room, never shown elsewhere) or **global**
  (stored once in the hub, referenced by rooms; editing it changes every room using it).
  Global schedules are references, not copies, and there are no per-room offsets: a room
  that needs other temperatures keeps an own schedule (or a *local copy*).
- **Visibility** of a global schedule (all rooms or selected rooms) only affects the
  selection lists, so room cards stay short. Active implies visible: activating one in a
  room adds the room, and a room whose active schedule it is cannot be removed. Periods
  may use any global schedule in any room.
- Names are unique within what a room can select (own + visible global schedules).
- **Deleting a global schedule that is in use is allowed** (unlike deleting a variable in
  use): rooms where it is active switch to **off** (frost protection), periods using it
  are deleted. The owner chose this on purpose; the cards ask for confirmation. A room
  always keeps a valid active schedule (another available one, else a local copy).
- "Make global" merges own schedules of other rooms only if their plan is identical, so
  merging never changes how a room heats.
- **Groups of rooms are Home Assistant labels** (on the Best Thermostat room devices), plus
  areas and floors for services. The integration has no group management of its own.
- **Periods for several rooms** are one period per room sharing the same id (`group`);
  they are created atomically, changed and cancelled together, and can be ended in a
  single room. Explicit changes on a room still end only that room's period.

## Layers (priority)

Higher layers never modify lower ones, so ending a layer restores the previous behaviour
without storing "what was before".

1. **Global override** – one switch for the whole house. It always affects rooms in
   `auto`; rooms in manual and in off mode only if the respective option is on (two
   separate switches).
2. **Hand change** "until next slot" – only while the effective mode is `auto`.
3. **Period** – time-limited schedule and/or mode. On overlap the most recently created
   period wins. Explicitly choosing a mode or schedule on the room ends the running
   period.
4. **Room** – its own mode, schedule and manual temperature.

There is no per-room override; periods cover that need.

## Changes made on a thermostat

Configurable per room: switch to manual, keep until the next slot (default), or ignore
and restore. With "sync" on, the change is written to the other TRVs of the room.
With "sync" off, the change is a per-thermostat deviation (`RoomState.trv_deviations`):
the room target stays, the deviation ends with the next slot (or, in manual/off mode,
with an explicit room change or a period boundary), and the global override still
applies to all thermostats. "Switch to manual" with sync off switches the room to
manual at its current target and keeps only the changed thermostat at the new value.
Switching a thermostat itself to `auto` is read as "follow the schedule": the room
switches to `auto` (ending manual/off, a hand change and a running period) and the
thermostat is put back into its previous hvac mode, because a device in `auto` usually
runs its own internal schedule. This is the only case in which the integration writes
an hvac mode to a thermostat.

A temperature set on the room thermostat itself always behaves like "until next slot"
when the room is in `auto`.

## Cards

- Both cards ship with the integration in one repository and are registered
  automatically.
- The room card shows: area icon top left, name and status, battery chip top right,
  current temperature large, target with −/+ and horizontal swipe, the variable and
  source below the target, mode selector, today's timeline with a small pencil that opens
  the weekly editor, schedule selector (only with more than one schedule), then
  expandable rows for periods and priority.
- The overview card collects all rooms automatically, groups them by Home Assistant floor
  and offers a list layout and a tiles layout (tiles embed the room card). Its `room`
  options apply to all rooms.
- The weekly editor only applies changes on *Save*.
- After an update the cards compare their version with the backend and offer a reload
  instead of requiring a cache clear.

## Languages

English is the reference language; German is fully maintained. Default names created at
setup (schedule "Default", variables "Comfort"/"Eco") follow the language of Home
Assistant at that moment.
