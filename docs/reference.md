# Reference

*[Deutsch](reference.de.md) · [Back to the README](../README.md)*

Everything in detail: entities, settings, priorities, periods, card options and services.

## Entities

| Entity | Example | Purpose |
|---|---|---|
| `climate` | `climate.office` | Room thermostat. Current temperature = average, heating if one TRV heats |
| `select` | `select.office_schedule` | Active schedule |
| `calendar` | `calendar.office_periods` | Planned periods (create, change, delete) |
| `sensor` | `sensor.office_next_change` | Next slot change (attribute `next_temperature`) |
| `binary_sensor` | `binary_sensor.office_schedule_paused` | The schedule is currently not in control (attribute `reason`) |
| `number` | `number.best_thermostat_comfort` | Global variable (one per variable) |
| `number` | `number.best_thermostat_override_temperature` | Temperature of the global override |
| `switch` | `switch.best_thermostat_global_override` | Global override on/off |
| `switch` | `switch.best_thermostat_override_also_for_manual` | The override also applies to rooms in manual mode |
| `switch` | `switch.best_thermostat_override_also_for_off` | The override also applies to rooms in off mode (frost protection) |

Entity IDs depend on the language Home Assistant used when the room was created.
Default names (schedule "Default", variables "Comfort"/"Eco") are also created in the
language of Home Assistant.

## Settings

**Room** (when creating it and later via *Configure*):

- Thermostats of the room
- Frost protection temperature for off mode (default 5 °C)
- Behaviour on manual changes in auto mode:
  - *Switch room to manual mode*
  - *Keep until the next slot* (default)
  - *Ignore and restore schedule*: applies to changes on a thermostat. On the room
    thermostat this setting acts like "until the next slot".
- Sync changes on one thermostat to the others (on/off)
- Hide the thermostats (on/off): hides the individual TRV entities from dashboards and
  voice assistants; the room thermostat replaces them. Entities you hid yourself are left
  untouched. They are shown again when the option is turned off, a TRV is removed from the
  room or the room is deleted.

**Global** (entry "Best Thermostat" → *Configure*): add, edit and delete variables. A
variable that is still used in a schedule cannot be deleted. Variables can also be
managed in the card.

## Battery levels

The integration finds the battery entities of the thermostats automatically (a battery
sensor in % or a "battery low" binary sensor on the same device). The room card shows a
small battery indicator with the level(s) in the top right corner (red below 20 %); tap it
to see every thermostat – each entry links to the device in Home Assistant. The overview
marks rooms with a weak battery. Option `show_battery`.

## Apple Home, Google Home (Matter / HomeKit)

Matter and HomeKit only know the thermostat modes off, heat, cool and auto (= heat/cool).
The room thermostat's `auto` (schedule) is therefore not shown there, and choosing
"Heat" would switch the room to manual mode.

Enable **"Apple Home / Matter compatible modes"** (entry "Best Thermostat" →
*Configure* → *Settings*). Room thermostats then only offer **Heat** and **Off**:

- **Heat** = follow the schedule (a room in manual mode is shown as Heat)
- **Off** = frost protection
- **Changing the temperature** is handled like a hand change (room setting, e.g. until
  the next slot)
- Manual mode stays fully available in the cards

No extra entities are created. The global override switch can be exposed as well.

## Priority of the set-point

| Priority | Layer |
|---|---|
| 1 | Global override (rooms in auto always; rooms in manual/off only if the respective switch is on) |
| 2 | Hand change "until next slot" (ends with the next slot or the period at the latest) |
| 3 | Period (on overlap the **most recently created** one wins) |
| 4 | Room: off → frost protection, manual → manual temperature, auto → slot of the active schedule |

The room card can show these layers and which one is in control (card option
`show_priorities`).

The override and periods never modify the room's own state, they are layers on top of it
(like a BACnet priority array). That is why everything is exactly as before once they end,
even across restarts.

## Periods (e.g. guest mode)

A **period** activates a schedule and/or mode for a while, e.g. "Office: schedule *Guest*
from Fri 14:00 to Sun 18:00" or "Bathroom: off, until cancelled". Afterwards the room
continues **exactly as before**.

- **Start** optional (default: now), **end** optional (default: until cancelled), or a
  **duration** instead of an end.
- Periods are stored and keep running across restarts.
- **Hand changes** during a period follow the room setting and end with the period at the
  latest. If a period sets manual/off, a temperature change adjusts the period's
  temperature.
- **Explicitly choosing a mode or schedule** on the room (card, room thermostat, select)
  ends the running period.
- A schedule used by a planned period cannot be deleted.

**In the card:** "Plan period" in the room card opens a dialog: choose a schedule, manual
(with temperature) or off, a start (now or a date/time), an end (until cancelled or a
date/time) and an optional title. Active and planned periods are listed; tap one to edit
it (all settings, or end/delete it). "+N more" expands the full list.

**Calendar:** every room has a `calendar.<room>_periods` entity. It shows all periods and
lets you create, change and delete them. The event title defines what happens: a schedule
name ("Guest"), "Off", "Auto" or a temperature ("Manual 22"). German titles ("Aus",
"Manuell 22") work as well. Recurring events are not supported.

**Services** (also for AI agents, e.g. through an MCP server):

```yaml
# Guest mode now, until cancelled
action: bestthermostat.add_period
data:
  entity_id: climate.office
  schedule: Guest
response_variable: result   # result.periods[0].id to end it later

# Guest mode from Friday 14:00 to Sunday 18:00
action: bestthermostat.add_period
data:
  entity_id: climate.office
  schedule: Guest
  start: "2026-11-13 14:00:00"
  end: "2026-11-15 18:00:00"

# Bathroom at 23 °C for 3 hours
action: bestthermostat.add_period
data:
  entity_id: climate.bathroom
  temperature: 23
  duration: {hours: 3}

# End a period (without period_id: all periods of the room)
action: bestthermostat.cancel_period
data:
  entity_id: climate.office
  period_id: 1a2b3c4d5e6f
```

`bestthermostat.get_schedule` also returns `period` (active) and `periods` (all planned)
for each room.

## Cards

```yaml
type: custom:bestthermostat-card
entity: climate.office
compact: false        # true for small wall displays (e.g. Shelly Wall Display)
show_modes: true
show_schedules: true
show_timeline: true
show_editor: true
show_periods: true    # list active/planned periods and the "Plan period" button
show_priorities: true   # row showing which priority layer is in control (expandable)
show_battery: true      # battery indicator top right (found automatically, < 20 % in red)
```

```yaml
type: custom:bestthermostat-overview-card
title: Heating
layout: tiles          # list (tap a room to expand) or tiles (all rooms open)
show_summary: true
show_override: true
show_variables: true
group_by_floor: true
exclude_rooms: [climate.basement]
room:                  # applies to all rooms – same options as the room card
  show_modes: true
  show_schedules: true
  show_timeline: true
  show_periods: true
  show_priorities: true
  show_battery: true
  show_editor: true
  compact: false
```

**Room card:** icon, name and status at the top; current temperature large with the
target next to it (−/+ or **swipe horizontally** on the target; below it the variable and
source in effect, e.g. "Comfort · Schedule"); mode and schedule selectors; a thin
timeline for today with a small pencil that opens the weekly editor; below that calm rows
– periods, priority – that expand when tapped.

**Overview card:** a summary ("2 of 5 rooms heating · Ø 19.4 °C"), the global override
as a single switch (tap the temperature to open a slider with a temperature-coloured
track, −/+ and quick picks for your variables), the variables as one line (tap to
edit) and all rooms – collected automatically. Everything the room card can show is
available for the rooms of the overview; the `room` options apply to all rooms.
`layout: list` shows calm rows and expands a room on tap, `layout: tiles` shows every
room as a tile in as many columns as fit – ideal as the main view.

**Floors:** rooms are grouped by the floors configured in Home Assistant, ordered by the
floor level. Tap a floor header to collapse it (remembered per device). If several rooms
of a floor share the next change, it is shown once in the floor header. Swipe horizontally on a
room's temperature (or on the override temperature) to change it. Rooms use the
icon of their Home Assistant area; the target is only shown when it differs from the
current temperature by 0.5° or more. The area of the Best Thermostat room device is used; if it has none, the
area of its thermostats. New room devices get that area suggested automatically. Rooms
without a floor are listed under "Other".

Both cards have a visual editor. The weekly editor opens via the pencil next to the
timeline (or in the header when the timeline is hidden):

- Switch between schedules at the top (the one in effect has a green dot, "+" adds one);
  a schedule that is not active can be activated right there
- Tap a block to edit it in a sheet: start/end with −/+ (15-minute grid), fixed
  temperature or a variable, split, copy the day (Mon–Fri / weekend / all), delete
- Drag the borders to move them (the time is shown while dragging)
- The legend explains the colours; "Edit" opens the variables
- ⋮ menu: rename, duplicate, **copy to other rooms** (an existing schedule with the same
  name is replaced, otherwise it is created), manage variables, delete schedule
- Changes are only applied with **Save** – the bar appears as soon as something changed

## Services

| Service | Purpose |
|---|---|
| `bestthermostat.set_active_schedule` | Activate a schedule (`entity_id`, `schedule`: name or ID) |
| `bestthermostat.set_mode` | `auto` / `heat` / `off`, optional `temperature` |
| `bestthermostat.get_schedule` | Returns state and weekly plans as response data |
| `bestthermostat.set_schedule` | Set a weekly plan as JSON (creates the schedule if needed) |
| `bestthermostat.set_variable` | Change a variable (`variable`: ID or name, `value`, `name`) |
| `bestthermostat.add_period` | Plan a period: `schedule` and/or `mode`/`temperature`, optional `start`, `end` or `duration`, `summary`. Returns the ID |
| `bestthermostat.update_period` | Change a period in place (`period_id`; only given fields change, `open_end` removes the end). ID and priority are kept |
| `bestthermostat.cancel_period` | End/delete a period (`period_id`; without ID: all periods of the room) |
| `bestthermostat.set_global_override` | `active`, `temperature`, `variable`, `include_manual`, `include_off` (`all_modes` sets both) |

Weekly plan format:

```json
{
  "mon": [
    {"start": "00:00", "variable": "eco"},
    {"start": "06:00", "variable": "comfort"},
    {"start": "22:00", "temperature": 17.5}
  ],
  "tue": [...], "wed": [...], "thu": [...], "fri": [...], "sat": [...], "sun": [...]
}
```

Every day needs a slot starting at `00:00`. A slot is valid until the next slot starts,
also across midnight. Times must be on the 15-minute grid, temperatures in 0.5 °C steps.

