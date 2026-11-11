// Types and a shared subscription to the Best Thermostat websocket API.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  locale?: { language: string };
  connection: {
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>): Promise<() => void>;
  };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export interface SlotData {
  start: string;
  temperature?: number;
  variable?: string;
}

export type WeekData = Record<string, SlotData[]>;

export interface ScheduleData {
  id: string;
  name: string;
  week: WeekData;
}

export interface PeriodData {
  id: string;
  start: string;
  end: string | null;
  created: string;
  schedule: string | null;
  mode: "auto" | "heat" | "off" | null;
  temperature: number | null;
  summary: string | null;
  title: string;
}

export interface FloorData {
  id: string;
  name: string;
  level: number | null;
  icon: string | null;
}

export interface RoomData {
  entry_id: string;
  name: string;
  climate_entity_id: string | null;
  trvs: string[];
  mode: "auto" | "heat" | "off";
  manual_temperature: number;
  frost_temperature: number;
  target_temperature: number | null;
  target_source: "override" | "off" | "manual" | "hand" | "schedule";
  current_temperature: number | null;
  hvac_action: string | null;
  min_temp: number;
  max_temp: number;
  active_schedule: string;
  base_schedule: string;
  base_mode: "auto" | "heat" | "off";
  base_manual_temperature: number;
  area: { id: string; name: string } | null;
  floor: FloorData | null;
  period: PeriodData | null;
  periods: PeriodData[];
  hand_until: string | null;
  override_active: boolean;
  next_change: string | null;
  next_temperature: number | null;
  schedules: ScheduleData[];
}

export interface VariableData {
  id: string;
  name: string;
  value: number;
}

export interface OverrideData {
  active: boolean;
  temperature: number;
  variable: string | null;
  include_manual: boolean;
  include_off: boolean;
  value: number | null;
}

export interface Snapshot {
  version: string;
  rooms: RoomData[];
  variables: VariableData[];
  override: OverrideData;
}

export const DOMAIN = "bestthermostat";
export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

type Listener = (snap: Snapshot) => void;

let current: Snapshot | undefined;
let unsub: Promise<() => void> | undefined;
let subscribedConnection: unknown;
const listeners = new Set<Listener>();

/** Subscribe to state updates; one websocket subscription is shared by all cards. */
export function subscribe(hass: HomeAssistant, listener: Listener): () => void {
  listeners.add(listener);
  if (current) listener(current);
  if (!unsub || subscribedConnection !== hass.connection) {
    subscribedConnection = hass.connection;
    unsub = hass.connection
      .subscribeMessage<Snapshot>(
        (snap) => {
          current = snap;
          listeners.forEach((l) => l(snap));
        },
        { type: `${DOMAIN}/subscribe` },
      )
      .catch((err) => {
        console.error("Best Thermostat: subscription failed", err);
        unsub = undefined;
        return () => undefined;
      });
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && unsub) {
      const u = unsub;
      unsub = undefined;
      current = undefined;
      u.then((f) => f());
    }
  };
}

export function ws<T = unknown>(
  hass: HomeAssistant,
  type: string,
  data: Record<string, unknown> = {},
): Promise<T> {
  return hass.callWS<T>({ type: `${DOMAIN}/${type}`, ...data });
}

export function findRoom(snap: Snapshot | undefined, entity?: string): RoomData | undefined {
  if (!snap || !entity) return undefined;
  return snap.rooms.find((r) => r.climate_entity_id === entity || r.entry_id === entity);
}
