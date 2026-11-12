// Types and a shared subscription to the Best Thermostat websocket API.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  /** ``time_zone`` is "local" (browser) or "server" (Home Assistant's zone). */
  locale?: { language: string; time_zone?: string };
  config?: { time_zone?: string };
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

export interface BatteryData {
  entity_id: string;
  device_id: string | null;
  name: string;
  level: number | null;
  low: boolean | null;
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
  target_variable: string | null;
  current_temperature: number | null;
  hvac_action: string | null;
  min_temp: number;
  max_temp: number;
  active_schedule: string;
  base_schedule: string;
  base_mode: "auto" | "heat" | "off";
  base_manual_temperature: number;
  area: { id: string; name: string; icon?: string | null } | null;
  floor: FloorData | null;
  batteries?: BatteryData[];
  period: PeriodData | null;
  periods: PeriodData[];
  hand_until: string | null;
  override_active: boolean;
  /** Thermostats changed by hand that are not synced (room option "sync" off). */
  trv_deviations?: { entity_id: string; name: string; temperature: number; until: string | null }[];
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

export interface Limits {
  min: number;
  max: number;
  step: number;
}

export interface Snapshot {
  version: string;
  /** Allowed range for configured temperatures (slots, variables, override). */
  limits?: Limits;
  rooms: RoomData[];
  variables: VariableData[];
  override: OverrideData;
}

export const DOMAIN = "bestthermostat";
export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

type Listener = (snap: Snapshot) => void;
/** Called with true while the integration cannot be reached, false once it can. */
type StatusListener = (unreachable: boolean) => void;

let current: Snapshot | undefined;
let unsub: Promise<() => void> | undefined;
let subscribedConnection: unknown;
let lastHass: HomeAssistant | undefined;
let unreachable = false;
let retryTimer: number | undefined;
let retryCount = 0;
const listeners = new Set<Listener>();
const statusListeners = new Set<StatusListener>();
const RETRY_DELAYS = [2, 5, 10, 30]; // seconds, the last one repeats

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Keep the objects of the previous snapshot where nothing changed, so cards can
 * skip rendering rooms (and whole cards) whose data is identical.
 */
function share(prev: Snapshot | undefined, next: Snapshot): Snapshot {
  if (!prev) return next;
  const old = new Map(prev.rooms.map((r) => [r.entry_id, r]));
  return {
    ...next,
    rooms: next.rooms.map((r) => {
      const o = old.get(r.entry_id);
      return o && same(o, r) ? o : r;
    }),
    variables: same(prev.variables, next.variables) ? prev.variables : next.variables,
    override: same(prev.override, next.override) ? prev.override : next.override,
  };
}

function setUnreachable(value: boolean) {
  if (unreachable === value) return;
  unreachable = value;
  statusListeners.forEach((l) => l(value));
}

function scheduleRetry() {
  if (retryTimer !== undefined || listeners.size === 0) return;
  const delay = RETRY_DELAYS[Math.min(retryCount, RETRY_DELAYS.length - 1)];
  retryCount += 1;
  retryTimer = window.setTimeout(() => {
    retryTimer = undefined;
    if (listeners.size && lastHass) connect(lastHass);
  }, delay * 1000);
}

function connect(hass: HomeAssistant) {
  subscribedConnection = hass.connection;
  const promise = hass.connection
    .subscribeMessage<Snapshot>(
      (snap) => {
        retryCount = 0;
        setUnreachable(false);
        current = share(current, snap);
        const shared = current;
        listeners.forEach((l) => l(shared));
      },
      { type: `${DOMAIN}/subscribe` },
    )
    .catch((err) => {
      // e.g. Home Assistant is still starting and the integration is not loaded yet
      console.warn("Best Thermostat: subscription failed, retrying", err);
      if (unsub === promise) unsub = undefined;
      setUnreachable(true);
      scheduleRetry();
      return () => undefined;
    });
  unsub = promise;
}

/** Subscribe to state updates; one websocket subscription is shared by all cards. */
export function subscribe(
  hass: HomeAssistant,
  listener: Listener,
  status?: StatusListener,
): () => void {
  listeners.add(listener);
  if (status) {
    statusListeners.add(status);
    if (unreachable) status(true);
  }
  lastHass = hass;
  if (current) listener(current);
  if ((!unsub && retryTimer === undefined) || subscribedConnection !== hass.connection) {
    window.clearTimeout(retryTimer);
    retryTimer = undefined;
    connect(hass);
  }
  return () => {
    listeners.delete(listener);
    if (status) statusListeners.delete(status);
    if (listeners.size === 0) {
      window.clearTimeout(retryTimer);
      retryTimer = undefined;
      retryCount = 0;
      if (unsub) {
        const u = unsub;
        unsub = undefined;
        u.then((f) => f());
      }
      current = undefined;
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
