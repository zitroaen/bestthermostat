// Shared presentation helpers for the room and overview cards.
import type { HomeAssistant, RoomData, Snapshot } from "./api";
import { fmtTemp, fmtTime, type Strings } from "./utils";

export function scheduleName(room: RoomData, id: string): string {
  return room.schedules.find((s) => s.id === id)?.name ?? id;
}

/** Icon of the room: the icon of its Home Assistant area, else a state icon. */
export function roomIcon(room: RoomData): string {
  if (room.area?.icon) return room.area.icon;
  if (room.override_active) return "mdi:home-export-outline";
  if (room.period) return "mdi:calendar-star";
  if (room.mode === "off") return "mdi:radiator-off";
  if (room.mode === "heat" || room.target_source === "hand") return "mdi:hand-back-right";
  return "mdi:radiator";
}

/** True if the room simply follows its schedule (no override, period, hand change). */
export function followsSchedule(room: RoomData): boolean {
  return room.target_source === "schedule" && !room.period && !room.override_active;
}

/**
 * Next change shared by all rooms that simply follow their schedule (at least two),
 * e.g. to show it once in a floor header.
 */
export function commonNextChange(rooms: RoomData[]): { time: string; temp: number | null } | undefined {
  const following = rooms.filter((r) => followsSchedule(r) && r.next_change);
  if (following.length < 2) return undefined;
  const first = following[0];
  const same = following.every(
    (r) => r.next_change === first.next_change && r.next_temperature === first.next_temperature,
  );
  return same ? { time: first.next_change!, temp: first.next_temperature } : undefined;
}

/** One short status line: what controls the room and until when. */
export function roomStatus(
  room: RoomData,
  t: Strings,
  hass: HomeAssistant,
  omitNextChange = false,
): string {
  if (room.override_active) return t.src_override;
  if (room.target_source === "hand" && room.hand_until)
    return `${t.src_hand} · ${t.until} ${fmtTime(room.hand_until, hass)}`;
  if (room.period) {
    const until = room.period.end ? `${t.period_until} ${fmtTime(room.period.end, hass)}` : t.period_open;
    return `${room.period.title} · ${until}`;
  }
  if (room.mode === "off") return t.src_off;
  if (room.mode === "heat") return t.src_manual;
  const sched = scheduleName(room, room.active_schedule);
  if (room.next_change && !omitNextChange)
    return `${sched} · ${fmtTime(room.next_change, hass)} → ${fmtTemp(room.next_temperature)}`;
  return sched;
}

export interface Layer {
  n: number;
  icon: string;
  name: string;
  value: string;
}

/** The priority layers of a room and the number of the one in control. */
export function priorities(
  room: RoomData,
  snap: Snapshot,
  t: Strings,
  hass: HomeAssistant,
): { layers: Layer[]; winner: number } {
  const ov = snap.override;
  const winner = room.override_active
    ? 1
    : room.target_source === "hand"
      ? 2
      : room.period
        ? 3
        : 4;
  const base =
    room.base_mode === "off"
      ? `${t.src_off} · ${fmtTemp(room.frost_temperature)}`
      : room.base_mode === "heat"
        ? `${t.heat} · ${fmtTemp(room.base_manual_temperature)}`
        : `${t.auto} · ${scheduleName(room, room.base_schedule)}`;
  const layers: Layer[] = [
    {
      n: 1,
      icon: "mdi:home-export-outline",
      name: t.override,
      value: !ov.active
        ? t.prio_inactive
        : room.override_active
          ? fmtTemp(ov.value)
          : `${fmtTemp(ov.value)} · ${t.override_not_applied}`,
    },
    {
      n: 2,
      icon: "mdi:hand-back-right",
      name: t.prio_hand,
      value:
        room.target_source === "hand" && room.hand_until
          ? `${fmtTemp(room.target_temperature)} · ${t.until} ${fmtTime(room.hand_until, hass)}`
          : t.prio_none,
    },
    {
      n: 3,
      icon: "mdi:calendar-star",
      name: t.period,
      value: room.period
        ? `${room.period.title} · ${room.period.end ? `${t.period_until} ${fmtTime(room.period.end, hass)}` : t.period_open}`
        : t.prio_none,
    },
    { n: 4, icon: "mdi:radiator", name: t.prio_room, value: base },
  ];
  return { layers, winner };
}

export function upcomingPeriods(room: RoomData) {
  const now = Date.now();
  return (room.periods ?? [])
    .filter((p) => new Date(p.start).getTime() > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

/** Lowest battery of a room (or undefined if none is reported). */
export function lowestBattery(room: RoomData) {
  const list = room.batteries ?? [];
  if (!list.length) return undefined;
  const withLevel = list.filter((b) => b.level != null);
  const low = list.some((b) => b.low);
  const level = withLevel.length ? Math.min(...withLevel.map((b) => b.level as number)) : null;
  return { level, low };
}

export function batteryIcon(level: number | null, low: boolean | null): string {
  if (level == null) return low ? "mdi:battery-alert-variant-outline" : "mdi:battery";
  if (level <= 10) return "mdi:battery-alert-variant-outline";
  if (level >= 95) return "mdi:battery";
  return `mdi:battery-${Math.max(10, Math.floor(level / 10) * 10)}`;
}
