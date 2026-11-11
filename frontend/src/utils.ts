import type { HomeAssistant, SlotData, VariableData, WeekData } from "./api";
import { DAYS } from "./api";

export const GRID = 15;
export const DAY_MIN = 24 * 60;

export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function snap(min: number): number {
  return Math.round(min / GRID) * GRID;
}

export function resolveSlot(slot: SlotData, vars: VariableData[]): number | undefined {
  if (slot.variable !== undefined) return vars.find((v) => v.id === slot.variable)?.value;
  return slot.temperature;
}

export function slotLabel(slot: SlotData, vars: VariableData[]): string {
  if (slot.variable !== undefined) {
    const v = vars.find((x) => x.id === slot.variable);
    return v ? v.name : slot.variable;
  }
  return fmtTemp(slot.temperature);
}

export function fmtTemp(t: number | null | undefined, unit = true): string {
  if (t === null || t === undefined || Number.isNaN(t)) return "–";
  const s = (Math.round(t * 2) / 2).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return unit ? `${s} °C` : s;
}

const STOPS: [number, [number, number, number]][] = [
  [12, [90, 140, 220]],
  [16, [120, 180, 235]],
  [18, [150, 210, 200]],
  [19.5, [250, 215, 110]],
  [21, [255, 175, 85]],
  [23, [250, 125, 70]],
  [26, [225, 75, 60]],
];

/** Colour scale from cold (blue) over warm (amber) to hot (red). */
export function tempColor(t: number | undefined): string {
  if (t === undefined) return "var(--disabled-color, #9e9e9e)";
  if (t <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(",")})`;
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    if (t <= t1) {
      const [t0, c0] = STOPS[i - 1];
      const r = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * r)).join(",")})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(",")})`;
}

export function cloneWeek(week: WeekData): WeekData {
  return JSON.parse(JSON.stringify(week));
}

export function weekEqual(a: WeekData, b: WeekData): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function segments(day: SlotData[]): { start: number; end: number; slot: SlotData }[] {
  return day.map((slot, i) => ({
    start: toMin(slot.start),
    end: i + 1 < day.length ? toMin(day[i + 1].start) : DAY_MIN,
    slot,
  }));
}

export function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export function todayKey(): string {
  return DAYS[(new Date().getDay() + 6) % 7];
}

export function fmtTime(iso: string | null, hass: HomeAssistant): string {
  if (!iso) return "";
  const d = new Date(iso);
  const lang = hass.locale?.language || hass.language;
  const now = new Date();
  const time = d.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return time;
  return `${d.toLocaleDateString(lang, { weekday: "short" })} ${time}`;
}

const STRINGS = {
  de: {
    auto: "Auto",
    heat: "Manuell",
    off: "Aus",
    schedule: "Zeitplan",
    schedules: "Zeitpläne",
    edit: "Wochenplan bearbeiten",
    schedule_paused: "pausiert",
    period: "Zeitraum",
    period_until: "bis",
    period_open: "bis auf Weiteres",
    period_planned: "Geplant",
    period_from: "ab",
    period_end: "Beenden",
    period_delete: "Löschen",
    period_plan: "Zeitraum planen",
    period_edit: "Zeitraum bearbeiten",
    period_less: "weniger anzeigen",
    period_what: "Was soll gelten?",
    period_start: "Beginn",
    period_end_label: "Ende",
    period_now: "Jetzt",
    period_at: "Zeitpunkt",
    period_title: "Titel",
    period_title_hint: "z. B. Besuch von Oma",
    period_invalid: "Bitte gültigen Beginn und ein Ende in der Zukunft nach dem Beginn wählen.",
    period_more: "weitere geplant",
    optional: "optional",
    prio_title: "Prioritäten",
    prio_short: "Priorität",
    week_plan: "Wochenplan",
    copy_to_rooms: "In andere Räume kopieren",
    copy_rooms_hint: "„{name}“ wird in die gewählten Räume kopiert. Gibt es dort schon einen gleichnamigen Zeitplan, wird er ersetzt.",
    will_replace: "wird ersetzt",
    will_create: "wird neu angelegt",
    all_rooms: "Alle Räume",
    copied_to: "Kopiert nach:",
    copy_unsaved: "Es wird der gespeicherte Stand kopiert, nicht deine ungespeicherten Änderungen. Fortfahren?",
    battery: "Batterie",
    battery_low: "schwach",
    battery_ok: "OK",
    more: "Mehr",
    not_active: "Dieser Zeitplan ist gerade nicht aktiv.",
    unsaved_short: "Ungespeicherte Änderungen",
    manage_variables: "Variablen verwalten",
    delete_schedule: "Zeitplan löschen",
    edit_short: "Bearbeiten",
    from: "Von",
    to: "Bis",
    days_long: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    weekend: "Wochenende",
    copy_day_short: "Tag kopieren",
    add: "Hinzufügen",
    cancel: "Abbrechen",
    ok: "OK",
    swipe_hint: "Zum Ändern waagerecht wischen",
    today: "Heute",
    period_plural: "Zeiträume",
    period_planned_n: "geplant",
    heating_summary: "heizen",
    of: "von",
    rooms_word: "Räumen",
    other_floor: "Weitere",
    open_details: "Details",
    prio_hand: "Änderung von Hand",
    prio_room: "Raum",
    prio_inactive: "aus",
    prio_none: "keine",
    until: "bis",
    next: "Nächster Wechsel",
    src_override: "Globaler Override",
    src_off: "Frostschutz",
    src_manual: "Manuell",
    src_hand: "Geändert",
    src_schedule: "Zeitplan",
    heating: "Heizt",
    idle: "Bereit",
    save: "Speichern",
    discard: "Verwerfen",
    close: "Schließen",
    new_schedule: "Neuer Zeitplan",
    rename: "Umbenennen",
    duplicate: "Duplizieren",
    delete: "Löschen",
    activate: "Aktivieren",
    active: "Aktiv",
    split: "Teilen",
    copy_day: "Tag kopieren auf …",
    copy: "Kopieren",
    workdays: "Mo–Fr",
    all_days: "Alle",
    fixed: "Fest",
    variables: "Variablen",
    add_variable: "Variable hinzufügen",
    name: "Name",
    value: "Wert",
    unsaved: "Ungespeicherte Änderungen verwerfen?",
    confirm_delete: "Zeitplan wirklich löschen?",
    tap_hint: "Abschnitt antippen zum Bearbeiten, Grenzen ziehen zum Verschieben.",
    days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    not_found: "Raum nicht gefunden. Bitte in der Kartenkonfiguration einen Best-Thermostat-Raum wählen.",
    loading: "Lade …",
    override: "Globaler Override",
    override_also: "Gilt auch für",
    override_not_applied: "Override gilt hier nicht",
    rooms: "Räume",
    variables_note: "Variablen gelten für alle Räume und werden sofort gespeichert.",
  },
  en: {
    auto: "Auto",
    heat: "Manual",
    off: "Off",
    schedule: "Schedule",
    schedules: "Schedules",
    edit: "Edit weekly plan",
    schedule_paused: "paused",
    period: "Period",
    period_until: "until",
    period_open: "until cancelled",
    period_planned: "Planned",
    period_from: "from",
    period_end: "End",
    period_delete: "Delete",
    period_plan: "Plan period",
    period_edit: "Edit period",
    period_less: "show less",
    period_what: "What should apply?",
    period_start: "Start",
    period_end_label: "End",
    period_now: "Now",
    period_at: "At",
    period_title: "Title",
    period_title_hint: "e.g. Grandma visiting",
    period_invalid: "Please choose a valid start and an end in the future after the start.",
    period_more: "more planned",
    optional: "optional",
    prio_title: "Priorities",
    prio_short: "Priority",
    week_plan: "Weekly plan",
    copy_to_rooms: "Copy to other rooms",
    copy_rooms_hint: "\"{name}\" is copied to the selected rooms. An existing schedule with the same name is replaced.",
    will_replace: "will be replaced",
    will_create: "will be created",
    all_rooms: "All rooms",
    copied_to: "Copied to:",
    copy_unsaved: "The saved version is copied, not your unsaved changes. Continue?",
    battery: "Battery",
    battery_low: "low",
    battery_ok: "OK",
    more: "More",
    not_active: "This schedule is currently not active.",
    unsaved_short: "Unsaved changes",
    manage_variables: "Manage variables",
    delete_schedule: "Delete schedule",
    edit_short: "Edit",
    from: "From",
    to: "To",
    days_long: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    weekend: "Weekend",
    copy_day_short: "Copy day",
    add: "Add",
    cancel: "Cancel",
    ok: "OK",
    swipe_hint: "Swipe horizontally to change",
    today: "Today",
    period_plural: "Periods",
    period_planned_n: "planned",
    heating_summary: "heating",
    of: "of",
    rooms_word: "rooms",
    other_floor: "Other",
    open_details: "Details",
    prio_hand: "Hand change",
    prio_room: "Room",
    prio_inactive: "off",
    prio_none: "none",
    until: "until",
    next: "Next change",
    src_override: "Global override",
    src_off: "Frost protection",
    src_manual: "Manual",
    src_hand: "Changed",
    src_schedule: "Schedule",
    heating: "Heating",
    idle: "Idle",
    save: "Save",
    discard: "Discard",
    close: "Close",
    new_schedule: "New schedule",
    rename: "Rename",
    duplicate: "Duplicate",
    delete: "Delete",
    activate: "Activate",
    active: "Active",
    split: "Split",
    copy_day: "Copy day to …",
    copy: "Copy",
    workdays: "Mon–Fri",
    all_days: "All",
    fixed: "Fixed",
    variables: "Variables",
    add_variable: "Add variable",
    name: "Name",
    value: "Value",
    unsaved: "Discard unsaved changes?",
    confirm_delete: "Really delete this schedule?",
    tap_hint: "Tap a block to edit it, drag the borders to move them.",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    not_found: "Room not found. Please select a Best Thermostat room in the card configuration.",
    loading: "Loading …",
    override: "Global override",
    override_also: "Also applies to",
    override_not_applied: "override not applied here",
    rooms: "Rooms",
    variables_note: "Variables apply to all rooms and are saved immediately.",
  },
};

export type Strings = typeof STRINGS.de;

export function strings(hass?: HomeAssistant): Strings {
  const lang = (hass?.locale?.language || hass?.language || "en").slice(0, 2);
  return lang === "de" ? STRINGS.de : STRINGS.en;
}

/** Register a custom element only once (the card file may be loaded twice). */
export function define(name: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(name)) customElements.define(name, ctor);
}
