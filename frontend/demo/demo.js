// Stand-alone preview of the cards with fake data (no Home Assistant needed).
// Usage: npm run demo  ->  http://localhost:4173/frontend/demo/
// URL parameters: ?view=room|overview|tiles  &lang=de  &dark=1
import "/custom_components/bestthermostat/frontend/bestthermostat-card.js";

const params = new URLSearchParams(location.search);
const lang = params.get("lang") || "en";
const view = params.get("view") || "all";
if (params.get("dark")) document.documentElement.classList.add("dark");

// --- minimal stand-ins for Home Assistant's own elements -------------------
class HaCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `<style>
      :host { display:block; background:var(--ha-card-background, var(--card-background-color));
        border-radius:var(--ha-card-border-radius,16px); color:var(--primary-text-color);
        border:var(--ha-card-border-width,1px) solid var(--divider-color);
        box-shadow:var(--ha-card-box-shadow,none); position:relative; }
    </style><slot></slot>`;
  }
}
class HaIcon extends HTMLElement {
  static observedAttributes = ["icon"];
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  attributeChangedCallback() {
    const name = (this.getAttribute("icon") || "").replace("mdi:", "");
    this.shadowRoot.innerHTML = `<link rel="stylesheet"
        href="/frontend/node_modules/@mdi/font/css/materialdesignicons.min.css" />
      <style>:host{display:inline-flex;align-items:center;justify-content:center;
        width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}
        i{font-size:var(--mdc-icon-size,24px);line-height:1}i::before{display:block}</style>
      <i class="mdi mdi-${name}"></i>`;
  }
}
customElements.define("ha-card", HaCard);
customElements.define("ha-icon", HaIcon);

// --- fake data --------------------------------------------------------------
const day = (wake, sleep, extra = []) =>
  [
    { start: "00:00", variable: "eco" },
    { start: wake, variable: "comfort" },
    ...extra,
    { start: sleep, variable: "eco" },
  ].sort((a, b) => a.start.localeCompare(b.start));
const week = (wake, sleep, extra) => ({
  mon: day(wake, sleep, extra),
  tue: day(wake, sleep, extra),
  wed: day(wake, sleep, extra),
  thu: day(wake, sleep, extra),
  fri: day(wake, sleep, extra),
  sat: day("08:00", "23:00"),
  sun: day("08:00", "23:00"),
});
const iso = (hours) => new Date(Date.now() + hours * 3600_000).toISOString();
const todayAt = (hour) => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d.toISOString();
};
const floors = {
  ground: { id: "ground", name: lang === "de" ? "Erdgeschoss" : "Ground floor", level: 0, icon: null },
  upper: { id: "upper", name: lang === "de" ? "Obergeschoss" : "Upper floor", level: 1, icon: null },
};
const guestArea = { id: "guest_area", name: lang === "de" ? "Gästebereich" : "Guest area", icon: "mdi:home-account", color: null };
let n = 0;
function room(name, icon, floor, o = {}) {
  n += 1;
  const schedules = o.schedules || [{ id: "g_standard", name: "", week: {}, global: true }];
  return {
    entry_id: `room${n}`,
    name,
    climate_entity_id: `climate.room${n}`,
    trvs: [`climate.trv${n}`],
    mode: "auto",
    base_mode: "auto",
    manual_temperature: 21,
    base_manual_temperature: 21,
    frost_temperature: 5,
    hand_change: "until_next_slot",
    target_temperature: 21,
    target_source: "schedule",
    target_variable: lang === "de" ? "Komfort" : "Comfort",
    current_temperature: 20.6,
    hvac_action: "idle",
    min_temp: 5,
    max_temp: 30,
    active_schedule: schedules[0].id,
    base_schedule: schedules[0].id,
    area: { id: `area${n}`, name, icon },
    floor: floors[floor],
    batteries: [{ entity_id: `climate.trv${n}`, device_id: `dev${n}`, name: `${name} TRV`, level: 80, low: false }],
    period: null,
    periods: [],
    hand_until: null,
    override_active: false,
    next_change: todayAt(22),
    next_temperature: 17,
    schedules,
    labels: [],
    ...o,
  };
}
const de = lang === "de";
const globals = [
  { id: "g_standard", name: de ? "Standard" : "Default", week: week("06:00", "22:00"), rooms: null },
  { id: "g_guest", name: de ? "Besuch" : "Guests", week: week("07:00", "23:00"), rooms: ["room6"] },
];
const G = { global: true };
const bath = { id: "bad", name: de ? "Bad" : "Bathroom", week: week("05:30", "22:30", [{ start: "08:00", variable: "eco" }, { start: "18:00", variable: "comfort" }]) };
const office = {
  id: "standard",
  name: de ? "Arbeit" : "Work",
  week: week("07:00", "18:00", [{ start: "12:00", temperature: 20 }, { start: "13:00", variable: "comfort" }]),
};
const snapshot = {
  version: undefined, // filled from the card so no update banner is shown
  variables: [
    { id: "comfort", name: de ? "Komfort" : "Comfort", value: 21 },
    { id: "eco", name: de ? "Absenk" : "Eco", value: 17 },
  ],
  override: { active: false, temperature: 16, variable: null, include_manual: false, include_off: false, value: 16 },
  rooms: [
    room(de ? "Wohnzimmer" : "Living room", "mdi:sofa", "ground", {
      hvac_action: "heating",
      current_temperature: 20.2,
      batteries: [
        { entity_id: "climate.trv1", device_id: "dev1", name: "TRV left", level: 86, low: false },
        { entity_id: "climate.trv1b", device_id: "dev1b", name: "TRV right", level: 62, low: false },
      ],
    }),
    room(de ? "Küche" : "Kitchen", "mdi:silverware-fork-knife", "ground", { current_temperature: 21.1 }),
    room(de ? "Büro" : "Office", "mdi:desk", "ground", {
      schedules: [office, { id: "g_standard", ...G }],
      hvac_action: "heating",
      current_temperature: 19.4,
      next_change: todayAt(18),
    }),
    room(de ? "Schlafzimmer" : "Bedroom", "mdi:bed", "upper", {
      target_temperature: 18,
      current_temperature: 18.3,
      mode: "heat",
      base_mode: "heat",
      manual_temperature: 18,
      base_manual_temperature: 18,
      target_source: "manual",
      target_variable: null,
    }),
    room(de ? "Bad" : "Bathroom", "mdi:shower", "upper", {
      schedules: [bath, { id: "g_standard", ...G }],
      labels: [guestArea],
      target_temperature: 23,
      current_temperature: 22.1,
      target_source: "hand",
      target_variable: null,
      hand_until: todayAt(22),
      hvac_action: "heating",
      batteries: [{ entity_id: "climate.trv5", device_id: "dev5", name: "TRV", level: 14, low: true }],
    }),
    room(de ? "Gästezimmer" : "Guest room", "mdi:bed-outline", "upper", {
      mode: "off",
      base_mode: "off",
      target_temperature: 5,
      current_temperature: 15.8,
      target_source: "off",
      target_variable: null,
      labels: [guestArea],
      periods: [
        {
          id: "p1", start: iso(30), end: iso(80), created: iso(-1), schedule: "g_guest", mode: null,
          temperature: null, summary: null, group: "p1", title: globals[1].name,
        },
      ],
    }),
  ],
};

snapshot.rooms[1].periods = [{ ...snapshot.rooms[5].periods[0] }];
snapshot.rooms[1].labels = [guestArea];

/** Rebuild what the backend derives from the global schedules. */
function syncGlobals() {
  for (const r of snapshot.rooms) {
    const used = new Set([r.active_schedule, ...r.periods.map((p) => p.schedule)]);
    const own = r.schedules.filter((s) => !s.global);
    const shared = globals
      .filter((g) => g.rooms === null || g.rooms.includes(r.entry_id) || used.has(g.id))
      .map((g) => ({
        id: g.id, name: g.name, week: g.week, global: true,
        ...(g.rooms === null || g.rooms.includes(r.entry_id) ? {} : { hidden: true }),
      }));
    r.schedules = [...own, ...shared];
  }
  snapshot.global_schedules = globals.map((g) => ({
    ...g,
    active: snapshot.rooms.filter((r) => r.active_schedule === g.id).map((r) => r.entry_id),
    periods: snapshot.rooms.filter((r) => r.periods.some((p) => p.schedule === g.id)).map((r) => r.entry_id),
  }));
}
for (const r of snapshot.rooms) {
  if (!r.schedules.some((s) => s.id === r.active_schedule)) r.active_schedule = r.base_schedule = r.schedules[0].id;
}
syncGlobals();

let failures = Number(params.get("fail") || 0);

// --- fake hass ----------------------------------------------------------------
const listeners = new Set();
const push = () => listeners.forEach((cb) => cb(structuredClone(snapshot)));
const hass = {
  language: lang,
  locale: { language: lang },
  states: Object.fromEntries(
    snapshot.rooms.map((r) => [r.climate_entity_id, { entity_id: r.climate_entity_id, state: r.mode, attributes: { room_id: r.entry_id } }]),
  ),
  connection: {
    async subscribeMessage(cb) {
      // ?fail=N: the first N subscriptions fail (integration not loaded yet)
      if (failures > 0) {
        failures -= 1;
        throw new Error("Unknown command.");
      }
      listeners.add(cb);
      cb(structuredClone(snapshot));
      return () => listeners.delete(cb);
    },
  },
  // Just enough behaviour to click around; the real logic lives in the backend.
  async callWS(msg) {
    const r = snapshot.rooms.find((x) => x.entry_id === msg.entry_id);
    const type = msg.type.replace("bestthermostat/", "");
    if (type === "room/temperature") Object.assign(r, { target_temperature: msg.temperature, target_source: r.mode === "heat" ? "manual" : "hand", target_variable: null, hand_until: iso(3) });
    if (type === "room/hand_change") r.hand_change = msg.hand_change;
    if (type === "schedule/rename" && r) r.schedules.find((s) => s.id === msg.schedule_id).name = msg.name;
    if (type === "schedule/delete" && r) r.schedules = r.schedules.filter((s) => s.id !== msg.schedule_id);
    if (type === "room/mode") Object.assign(r, { mode: msg.mode, base_mode: msg.mode, target_source: { auto: "schedule", heat: "manual", off: "off" }[msg.mode] });
    if (type === "schedule/activate") Object.assign(r, { active_schedule: msg.schedule_id, base_schedule: msg.schedule_id });
    const g = globals.find((x) => x.id === msg.schedule_id);
    if (type === "schedule/save" && !g) r.schedules.find((s) => s.id === msg.schedule_id).week = msg.week;
    if (type === "global_schedule/save" || (type === "schedule/save" && g)) g.week = msg.week;
    if (type === "global_schedule/rename") g.name = msg.name;
    if (type === "global_schedule/rooms") g.rooms = msg.rooms;
    if (type === "global_schedule/assign")
      for (const id of msg.entry_ids) {
        const x = snapshot.rooms.find((y) => y.entry_id === id);
        Object.assign(x, { active_schedule: g.id, base_schedule: g.id });
        if (g.rooms && !g.rooms.includes(id)) g.rooms.push(id);
      }
    if (type === "global_schedule/create") {
      const from = globals.find((x) => x.id === msg.copy_from) ?? globals[0];
      const created = { id: `g_${Date.now()}`, name: msg.name, week: structuredClone(from.week), rooms: msg.rooms ?? null };
      globals.push(created);
      syncGlobals();
      push();
      return created;
    }
    if (type === "global_schedule/delete") {
      globals.splice(globals.indexOf(g), 1);
      const off = snapshot.rooms.filter((x) => x.active_schedule === g.id);
      for (const x of off) {
        x.schedules = x.schedules.filter((s) => s.id !== g.id);
        Object.assign(x, { mode: "off", base_mode: "off", target_source: "off", active_schedule: x.schedules[0]?.id, base_schedule: x.schedules[0]?.id });
      }
      syncGlobals();
      push();
      return { switched_off: off.map((x) => x.name), periods_removed: 0 };
    }
    if (type === "schedule/make_global") {
      const local = r.schedules.find((s) => s.id === msg.schedule_id);
      const created = { id: `g_${Date.now()}`, name: local.name, week: local.week, rooms: msg.all_rooms ? null : [r.entry_id, ...msg.merge.map((m) => m.entry_id)] };
      globals.push(created);
      for (const { entry_id, schedule_id } of [{ entry_id: r.entry_id, schedule_id: local.id }, ...msg.merge]) {
        const x = snapshot.rooms.find((y) => y.entry_id === entry_id);
        x.schedules = x.schedules.filter((s) => s.id !== schedule_id);
        if (x.active_schedule === schedule_id) Object.assign(x, { active_schedule: created.id, base_schedule: created.id });
      }
      syncGlobals();
      push();
      return created;
    }
    if (type === "period/add_group") {
      const id = `p${Date.now()}`;
      for (const entry of msg.entry_ids) {
        const x = snapshot.rooms.find((y) => y.entry_id === entry);
        const sched = globals.find((y) => y.id === msg.schedule_id);
        x.periods.push({ id, group: id, start: msg.start ? new Date(msg.start).toISOString() : iso(0), end: msg.end ? new Date(msg.end).toISOString() : null, created: iso(0), schedule: msg.schedule_id ?? null, mode: msg.mode ?? null, temperature: msg.temperature ?? null, summary: msg.summary ?? null, title: msg.summary || sched?.name || msg.mode });
      }
    }
    if (type === "period/cancel_group") for (const x of snapshot.rooms) x.periods = x.periods.filter((p) => p.group !== msg.group);
    if (type === "period/cancel") r.periods = r.periods.filter((p) => p.id !== msg.period_id);
    syncGlobals();
    if (type === "schedule/create") {
      const from = r.schedules.find((s) => s.id === msg.copy_from) ?? r.schedules[0];
      const created = { id: `s${Date.now()}`, name: msg.name, week: structuredClone(from.week) };
      r.schedules.push(created);
      push();
      return created;
    }
    if (type === "override/set") {
      Object.assign(snapshot.override, msg, msg.temperature ? { value: msg.temperature } : {});
      snapshot.rooms.forEach((x) => (x.override_active = snapshot.override.active && x.mode === "auto"));
    }
    if (type === "variable/update") Object.assign(snapshot.variables.find((v) => v.id === msg.variable_id), msg);
    push();
    return { ok: true };
  },
};

// --- stage ----------------------------------------------------------------------
const stage = document.getElementById("stage");
function add(type, config) {
  const el = document.createElement(type);
  el.setConfig({ type: `custom:${type}`, ...config });
  el.hass = hass;
  stage.appendChild(el);
  return el;
}
// Same version as the backend would report, so no "new version" banner is shown.
snapshot.version = (await (await fetch("/custom_components/bestthermostat/manifest.json")).json()).version;

if (view === "room" || view === "all") {
  stage.classList.add("two");
  add("bestthermostat-card", { entity: "climate.room3" });
  if (view === "all") add("bestthermostat-card", { entity: "climate.room5" });
}
if (view === "overview" || view === "all") add("bestthermostat-overview-card", { title: de ? "Heizung" : "Heating" });
if (view === "tiles") add("bestthermostat-overview-card", { title: de ? "Heizung" : "Heating", layout: "tiles" });
window.demo = { hass, snapshot, push };
