import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { FloorData, HomeAssistant, RoomData, Snapshot } from "./api";
import { subscribe, ws } from "./api";
import {
  commonNextChange,
  followsSchedule,
  lowestBattery,
  roomIcon,
  roomStatus,
  upcomingPeriods,
} from "./room-view";
import { shared } from "./styles";
import { startSwipe } from "./swipe";
import { CARD_VERSION } from "./version";
import {
  fmtTemp,
  fmtTime,
  hassRelevant,
  strings,
  tempColor,
  updateBanner,
  tempGradient,
  limitsOf,
  clampTemp,
} from "./utils";

/** Options applied to every room (same as the room card's options). */
export interface RoomOptions {
  show_modes?: boolean;
  show_schedules?: boolean;
  show_timeline?: boolean;
  show_periods?: boolean;
  show_priorities?: boolean;
  show_editor?: boolean;
  show_battery?: boolean;
  compact?: boolean;
}

interface OverviewConfig {
  type: string;
  title?: string;
  layout?: "list" | "tiles";
  show_summary?: boolean;
  show_override?: boolean;
  show_variables?: boolean;
  show_periods?: boolean;
  group_by_floor?: boolean;
  exclude_rooms?: string[];
  room?: RoomOptions;
}

const COLLAPSED_KEY = "bestthermostat.collapsedFloors";

const ROOM_DEFAULTS: RoomOptions = {
  show_modes: true,
  show_schedules: true,
  show_timeline: true,
  show_periods: true,
  show_priorities: true,
  show_editor: true,
  show_battery: true,
  compact: false,
};

interface Group {
  floor: FloorData | null;
  rooms: RoomData[];
}

export class BestThermostatOverviewCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _snap: { state: true },
    _error: { state: true },
    _open: { state: true },
    _ovOpen: { state: true },
    _varsOpen: { state: true },
    _unreachable: { state: true },
  };

  hass?: HomeAssistant;
  _config?: OverviewConfig;
  _snap?: Snapshot;
  _error?: string;
  _open?: string;
  _ovOpen = false;
  _varsOpen = false;
  _unreachable = false;
  private _unsub?: () => void;

  static getConfigElement() {
    return document.createElement("bestthermostat-overview-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config: OverviewConfig) {
    this._config = {
      layout: "list",
      show_summary: true,
      show_override: true,
      show_variables: true,
      show_periods: true,
      group_by_floor: true,
      ...config,
      room: {
        ...ROOM_DEFAULTS,
        // older configs had show_periods on the top level
        ...(config.show_periods === false ? { show_periods: false } : {}),
        ...(config.room ?? {}),
      },
    };
    this._cardConfigs.clear();
  }

  private _cardConfigs = new Map<string, Record<string, unknown>>();

  /** Stable config object per room for the embedded room card. */
  private _cardConfig(room: RoomData, header: boolean): Record<string, unknown> {
    const key = `${room.entry_id}:${header}`;
    let cfg = this._cardConfigs.get(key);
    if (!cfg) {
      cfg = {
        type: "custom:bestthermostat-card",
        entity: room.climate_entity_id ?? room.entry_id,
        embedded: true,
        show_header: header,
        show_floor: !this._config!.group_by_floor,
        ...this._config!.room,
      };
      this._cardConfigs.set(key, cfg);
    }
    return cfg;
  }

  getCardSize() {
    return 2 + (this._snap?.rooms.length ?? 2);
  }

  private _subscribe() {
    this._unsub = subscribe(
      this.hass!,
      (s) => (this._snap = s),
      (unreachable) => (this._unreachable = unreachable),
    );
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hass) this._subscribe();
  }

  /** Home Assistant assigns a new ``hass`` on every state change; only a few parts matter. */
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size === 1 && changed.has("hass")) {
      if (!this._unsub && this.hass && this.isConnected) this._subscribe();
      return hassRelevant(changed.get("hass") as HomeAssistant | undefined, this.hass);
    }
    return true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this._unsub && this.isConnected) this._subscribe();
  }

  private async _call(type: string, data: Record<string, unknown>) {
    try {
      this._error = undefined;
      await ws(this.hass!, type, data);
    } catch (err: any) {
      this._error = err?.message ?? String(err);
    }
  }

  private _collapsed = this._loadCollapsed();
  /** Values shown immediately while −/+ is pressed; sent after a short pause. */
  private _pending = new Map<string, number>();
  private _timers = new Map<string, number>();

  private _stepPending(key: string, value: number, send: (value: number) => Promise<void>) {
    const { min, max } = limitsOf(this._snap);
    const next = clampTemp(value, min, max);
    this._pending.set(key, next);
    this.requestUpdate();
    window.clearTimeout(this._timers.get(key));
    this._timers.set(
      key,
      window.setTimeout(async () => {
        await send(next);
        this._pending.delete(key);
        this.requestUpdate();
      }, 600),
    );
  }

  // ---------------------------------------------------------------- swipe

  _swipe?: { key: string; moved: boolean };
  private _swipeConsumed = false;

  /** Horizontal swipe on a temperature (0.5 °C per step), sent on release. */
  private _swipeStart(
    ev: PointerEvent | TouchEvent,
    key: string,
    start: number,
    min: number,
    max: number,
    commit: (v: number) => Promise<void>,
  ) {
    const from = this._pending.get(key) ?? start;
    startSwipe(ev, {
      onStep: (steps) => {
        this._swipe = { key, moved: true };
        const value = Math.min(max, Math.max(min, Math.round((from + steps * 0.5) * 2) / 2));
        if (value !== this._pending.get(key)) {
          this._pending.set(key, value);
          window.clearTimeout(this._timers.get(key));
          navigator.vibrate?.(5);
        }
        this.requestUpdate();
      },
      onEnd: async (moved) => {
        this._swipe = undefined;
        if (!moved) return;
        // Swallow only the click that directly follows this swipe.
        this._swipeConsumed = true;
        window.setTimeout(() => (this._swipeConsumed = false), 0);
        const value = this._pending.get(key);
        this.requestUpdate();
        if (value === undefined) return;
        await commit(value);
        this._pending.delete(key);
        this.requestUpdate();
      },
    });
  }

  private _swipeRoom(ev: PointerEvent | TouchEvent, room: RoomData) {
    this._swipeStart(ev, `room:${room.entry_id}`, room.target_temperature ?? 20, room.min_temp, room.max_temp, (v) =>
      this._call("room/temperature", { entry_id: room.entry_id, temperature: v }),
    );
  }

  private _swipeOverride(ev: PointerEvent | TouchEvent, shown: number | null) {
    const { min, max } = limitsOf(this._snap);
    this._swipeStart(ev, "override", shown ?? 16, min, max, (v) => this._call("override/set", { temperature: v }));
  }

  /** True once after a swipe, so the click that follows does not toggle anything. */
  private _consumeSwipe(): boolean {
    const consumed = this._swipeConsumed;
    this._swipeConsumed = false;
    return consumed;
  }

  private _varStep(id: string, value: number, delta: number) {
    const key = `var:${id}`;
    this._stepPending(key, (this._pending.get(key) ?? value) + delta, (v) =>
      this._call("variable/update", { variable_id: id, value: v }),
    );
  }

  private _loadCollapsed(): Set<string> {
    try {
      return new Set(JSON.parse(localStorage.getItem(COLLAPSED_KEY) || "[]"));
    } catch {
      return new Set();
    }
  }

  private _toggleFloor(key: string) {
    const next = new Set(this._collapsed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._collapsed = next;
    try {
      localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...next]));
    } catch {
      // storage not available – collapsing still works for this session
    }
    this.requestUpdate();
  }

  private _floorIconNo(level: number | null | undefined): string {
    if (level == null) return "0";
    if (level < 0) return "negative-1";
    return level > 3 ? "3" : String(level);
  }

  private _heatingCount(rooms: RoomData[]): number {
    return rooms.filter((r) => r.hvac_action === "heating").length;
  }

  private _renderTile(room: RoomData) {
    return html`<div class="tile">
      <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(room, true)}></bestthermostat-card>
    </div>`;
  }

  private _groups(rooms: RoomData[]): Group[] {
    if (!this._config?.group_by_floor || !rooms.some((r) => r.floor)) {
      return [{ floor: null, rooms }];
    }
    const map = new Map<string, Group>();
    for (const room of rooms) {
      const key = room.floor?.id ?? "";
      if (!map.has(key)) map.set(key, { floor: room.floor, rooms: [] });
      map.get(key)!.rooms.push(room);
    }
    return [...map.values()].sort((a, b) => {
      if (!a.floor) return 1;
      if (!b.floor) return -1;
      const la = a.floor.level ?? 999;
      const lb = b.floor.level ?? 999;
      return la !== lb ? la - lb : a.floor.name.localeCompare(b.floor.name);
    });
  }

  private _renderUpdate() {
    const b = updateBanner(this._snap?.version, CARD_VERSION, strings(this.hass));
    return b
      ? html`<div class="update"><span>${b.text}</span>
          <button class="text-btn" @click=${() => location.reload()}>${b.action}</button></div>`
      : nothing;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const t = strings(this.hass);
    const snap = this._snap;
    if (!snap)
      return html`<ha-card><div class="pad">${this._unreachable ? t.unreachable : t.loading}</div></ha-card>`;
    const heating = snap.rooms.filter((r) => r.hvac_action === "heating").length;
    const temps = snap.rooms.map((r) => r.current_temperature).filter((v): v is number => v != null);
    const avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    const excluded = new Set(this._config.exclude_rooms ?? []);
    const rooms = snap.rooms.filter(
      (r) => !excluded.has(r.climate_entity_id ?? "") && !excluded.has(r.entry_id),
    );
    const groups = this._groups(rooms);
    const grouped = groups.length > 1 || groups[0]?.floor;
    const tiles = this._config.layout === "tiles";
    const title = this._config.title ?? t.rooms;
    return html`<ha-card>
      <div class="pad col">
        ${this._renderUpdate()}
        ${title || this._config.show_summary
          ? html`<div>
              ${title ? html`<div class="title">${title}</div>` : nothing}
              ${this._config.show_summary
                ? html`<div class="muted summary">
                    ${heating} ${t.of} ${snap.rooms.length} ${t.rooms_word} ${t.heating_summary}${avg != null
                      ? html` · Ø ${fmtTemp(avg)}`
                      : nothing}
                  </div>`
                : nothing}
            </div>`
          : nothing}
        <div class="top">
          ${this._config.show_override ? this._renderOverride() : nothing}
          ${this._config.show_variables && snap.variables.length ? this._renderVariables() : nothing}
        </div>
        <div class="rooms">
          ${groups.map(
            (g) => {
              const key = g.floor?.id ?? "_other";
              const collapsed = grouped && this._collapsed.has(key);
              const common = grouped ? commonNextChange(g.rooms) : undefined;
              return html`${grouped
                  ? html`<button class="floor" aria-expanded=${!collapsed} @click=${() => this._toggleFloor(key)}>
                      <ha-icon icon=${g.floor?.icon || "mdi:home-floor-" + this._floorIconNo(g.floor?.level)}></ha-icon>
                      <span>${g.floor?.name ?? t.other_floor}</span>
                      ${this._heatingCount(g.rooms)
                        ? html`<span class="floor-heat">· ${this._heatingCount(g.rooms)} ${t.heating_summary}</span>`
                        : nothing}
                      <span class="floor-next">${common
                        ? `${t.until} ${fmtTime(common.time, this.hass!)}, ${t.then} ${fmtTemp(common.temp, false)}°`
                        : ""}</span>
                      <ha-icon class="floor-chev" icon=${collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
                    </button>`
                  : nothing}
                ${collapsed
                  ? nothing
                  : html`<div class="grid ${tiles ? "tiles" : ""}">
                      ${g.rooms.map((room) =>
                        tiles ? this._renderTile(room) : this._renderRoom(room, !!common && followsSchedule(room)),
                      )}
                    </div>`}`;
            },
          )}
        </div>
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      </div>
    </ha-card>`;
  }

  private _renderOverride() {
    const t = strings(this.hass);
    const ov = this._snap!.override;
    const open = this._ovOpen;
    const shown = this._pending.get("override") ?? ov.value;
    const step = (d: number) =>
      this._stepPending("override", (shown ?? 16) + d, (value) =>
        this._call("override/set", { temperature: value }),
      );
    return html`<div class="box ${ov.active ? "on" : ""}">
      <div class="box-head">
        <span class="box-label">
          <ha-icon icon="mdi:home-export-outline"></ha-icon>
          <span>${t.override}</span>
        </span>
        <button class="value-btn swipeable ${open ? "open" : ""} ${this._swipe?.key === "override" && this._swipe.moved ? "swiping" : ""}"
          title=${t.swipe_hint}
          @pointerdown=${(e: PointerEvent) => this._swipeOverride(e, shown)}
          @touchstart=${(e: TouchEvent) => this._swipeOverride(e, shown)}
          @click=${() => {
            if (this._consumeSwipe()) return;
            this._ovOpen = !this._ovOpen;
          }}
          aria-expanded=${open}>
          ${fmtTemp(shown)}
          <ha-icon icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </button>
        <button class="switch ${ov.active ? "on" : ""}" role="switch" aria-checked=${ov.active}
          aria-label=${t.override} @click=${() => this._call("override/set", { active: !ov.active })}>
          <span></span>
        </button>
      </div>
      ${open
        ? html`<div class="box-body">
            ${this._renderOverrideSlider(shown, step)}
            <div class="also">
              <span class="muted">${t.override_also}</span>
              ${(
                [
                  ["include_manual", ov.include_manual, t.heat],
                  ["include_off", ov.include_off, t.off],
                ] as [string, boolean, string][]
              ).map(
                ([key, on, label]) => html`<button class="mini ${on ? "on" : ""}"
                  @click=${() => this._call("override/set", { [key]: !on })}>${label}</button>`,
              )}
            </div>
          </div>`
        : nothing}
    </div>`;
  }

  private _renderOverrideSlider(shown: number | null, step: (d: number) => void) {
    const t = strings(this.hass);
    const ov = this._snap!.override;
    const vars = [...this._snap!.variables].sort((a, b) => a.value - b.value);
    const value = shown ?? 16;
    const { min: MIN, max: MAX } = limitsOf(this._snap);
    const scale: number[] = [];
    for (let s = Math.ceil(MIN / 5) * 5; s <= MAX; s += 5) scale.push(s);
    const pos = (v: number) => ((Math.min(MAX, Math.max(MIN, v)) - MIN) / (MAX - MIN)) * 100;
    return html`<div class="ov-slider" style="--thumb:${tempColor(value)}">
      <div class="ov-value">
        <button class="round small" aria-label="-0.5" @click=${() => step(-0.5)}>−</button>
        <span class="big-val swipeable ${this._swipe?.key === "override" && this._swipe.moved ? "swiping" : ""}"
          title=${t.swipe_hint}
          @pointerdown=${(e: PointerEvent) => this._swipeOverride(e, shown)}
          @touchstart=${(e: TouchEvent) => this._swipeOverride(e, shown)}>
          ${fmtTemp(value, false)}<small>°C</small>
        </span>
        <button class="round small" aria-label="+0.5" @click=${() => step(0.5)}>+</button>
      </div>
      <div class="track">
        <input type="range" min=${MIN} max=${MAX} step="0.5" .value=${String(value)}
          aria-label=${t.override}
          style="background:${tempGradient(MIN, MAX)}"
          @input=${(e: Event) => {
            this._pending.set("override", Number((e.target as HTMLInputElement).value));
            window.clearTimeout(this._timers.get("override"));
            this.requestUpdate();
          }}
          @change=${async (e: Event) => {
            const v = Number((e.target as HTMLInputElement).value);
            await this._call("override/set", { temperature: v });
            this._pending.delete("override");
            this.requestUpdate();
          }} />
        ${vars.map((v) => html`<i class="tick" style="left:${pos(v.value)}%" title=${v.name}></i>`)}
      </div>
      <div class="scale muted">${scale.map((s) => html`<span style="left:${pos(s)}%">${s}°</span>`)}</div>
      ${vars.length
        ? html`<div class="quick">
            ${vars.map(
              (v) => html`<button class="mini q ${ov.variable === v.id ? "on" : ""}"
                @click=${() => this._call("override/set", { variable: v.id })}>
                <span class="dot" style="background:${tempColor(v.value)}"></span>${v.name}
                <b>${fmtTemp(v.value, false)}°</b>
              </button>`,
            )}
          </div>`
        : nothing}
    </div>`;
  }

  private _renderVariables() {
    const t = strings(this.hass);
    const vars = this._snap!.variables;
    return html`<div>
      <button class="vars-line" @click=${() => (this._varsOpen = !this._varsOpen)}>
        <span class="vars-text">
          ${vars.map(
            (v, i) => html`${i ? html`<span class="sep">·</span>` : nothing}<span>${v.name}
                <b>${fmtTemp(v.value, false)}°</b></span>`,
          )}
        </span>
        <ha-icon icon=${this._varsOpen ? "mdi:chevron-up" : "mdi:chevron-right"}></ha-icon>
      </button>
      ${this._varsOpen
        ? html`<div class="var-list">
            ${vars.map(
              (v) => html`<div class="var-row">
                <span class="dot" style="background:${tempColor(v.value)}"></span>
                <span class="grow">${v.name}</span>
                <button class="round small" @click=${() =>
                  this._varStep(v.id, v.value, -0.5)}>−</button>
                <span class="val">${fmtTemp(this._pending.get(`var:${v.id}`) ?? v.value)}</span>
                <button class="round small" @click=${() => this._varStep(v.id, v.value, 0.5)}>+</button>
              </div>`,
            )}
            <div class="muted hint">${t.variables_note}</div>
          </div>`
        : nothing}
    </div>`;
  }

  private _renderRoom(room: RoomData, omitNext = false) {
    const t = strings(this.hass);
    const h = this.hass!;
    const heating = room.hvac_action === "heating";
    const open = this._open === room.entry_id;
    const next = this._config?.room?.show_periods ? upcomingPeriods(room)[0] : undefined;
    return html`<div class="room-block ${open ? "open" : ""}">
      <button class="room" @click=${() => {
        if (this._consumeSwipe()) return;
        this._open = open ? undefined : room.entry_id;
      }}>
        <span class="icon ${heating ? "heating" : ""} ${room.mode === "off" ? "off" : ""}">
          <ha-icon icon=${roomIcon(room)}></ha-icon>
        </span>
        <span class="grow left">
          <span class="name">${room.name}${this._config?.room?.show_battery && lowestBattery(room)?.low
            ? html`<ha-icon class="bat-low" icon="mdi:battery-alert-variant-outline"
                title=${t.battery_low}></ha-icon>`
            : nothing}</span>
          <span class="muted sub">${roomStatus(room, t, h, omitNext)}</span>
          ${next
            ? html`<span class="muted sub planned">
                <ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${next.title} · ${t.period_from}
                ${fmtTime(next.start, h)}
              </span>`
            : nothing}
        </span>
        <span class="temps swipeable ${this._swipe?.key === `room:${room.entry_id}` && this._swipe.moved ? "swiping" : ""}"
          title=${t.swipe_hint}
          @pointerdown=${(e: PointerEvent) => this._swipeRoom(e, room)}
          @touchstart=${(e: TouchEvent) => this._swipeRoom(e, room)}>
          <span class="cur">${fmtTemp(room.current_temperature, false)}°</span>
          ${this._pending.has(`room:${room.entry_id}`)
            ? html`<span class="tgt live">→ ${fmtTemp(this._pending.get(`room:${room.entry_id}`), false)}°</span>`
            : room.current_temperature == null ||
                room.target_temperature == null ||
                Math.abs(room.current_temperature - room.target_temperature) >= 0.5
              ? html`<span class="muted tgt">→ ${fmtTemp(room.target_temperature, false)}°</span>`
              : nothing}
        </span>
      </button>
      ${open
        ? html`<div class="detail">
            <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(room, false)}></bestthermostat-card>
          </div>`
        : nothing}
    </div>`;
  }

  static styles = [
    shared,
    css`
      .update {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 6px 6px 12px;
        border-radius: 12px;
        font-size: 13px;
        background: color-mix(in srgb, var(--bt-accent) 14%, transparent);
      }
      .update span {
        flex: 1;
      }
      .pad {
        padding: 16px;
        container-type: inline-size;
      }
      .top {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      @container (min-width: 620px) {
        .top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
        }
        .top .vars-line {
          min-height: 48px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          align-items: start;
          gap: 8px;
        }
        .grid .room-block,
        .grid .room-block + .room-block {
          border: none;
          border-radius: 14px;
          background: var(--bt-surface);
        }
        .grid .room {
          padding: 10px 12px;
        }
        .grid .icon {
          background: var(--card-background-color, #fff);
        }
        .grid .controls {
          margin: 0 10px 10px;
          background: var(--card-background-color, #fff);
        }
        .grid .controls .seg {
          background: var(--bt-surface);
        }
        .grid .controls .seg button[aria-selected="true"] {
          background: var(--card-background-color, #fff);
        }
        .grid .controls .seg.accent button[aria-selected="true"] {
          background: var(--bt-accent);
        }
        .grid .controls .round.small {
          background: var(--bt-surface);
        }
        .floor {
          margin-top: 16px;
        }
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      .summary {
        font-size: 13px;
        margin-top: 2px;
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .box {
        border-radius: 14px;
        background: var(--bt-surface);
        padding: 4px 6px 4px 12px;
      }
      .box.on {
        background: color-mix(in srgb, var(--bt-accent) 14%, transparent);
      }
      .box-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
      }
      .box-label {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        text-align: left;
        font-size: 14px;
      }
      .value-btn {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        min-height: 30px;
        padding: 0 6px 0 10px;
        border-radius: 15px;
        background: var(--card-background-color, #fff);
        font-size: 14px;
        font-weight: 500;
      }
      .value-btn ha-icon {
        --mdc-icon-size: 18px;
        color: var(--bt-muted);
      }
      .box-label ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-muted);
      }
      .box-body {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 4px 6px 10px 0;
      }
      .ov-slider {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 12px 12px 10px;
        border-radius: 14px;
        background: var(--card-background-color, #fff);
      }
      .ov-value {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ov-value .round.small {
        background: var(--bt-surface);
      }
      .big-val {
        font-size: 30px;
        font-weight: 400;
        letter-spacing: -0.01em;
        font-variant-numeric: tabular-nums;
        padding: 0 10px;
      }
      .big-val small {
        font-size: 14px;
        color: var(--bt-muted);
        margin-left: 2px;
      }
      .track {
        position: relative;
        padding: 10px 0 4px;
      }
      .track input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        display: block;
        width: 100%;
        height: 10px;
        margin: 0;
        border-radius: 5px;
        outline: none;
        cursor: pointer;
      }
      .track input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #fff;
        border: 5px solid var(--thumb);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
        cursor: grab;
        position: relative;
        z-index: 2;
      }
      .track input[type="range"]:active::-webkit-slider-thumb {
        cursor: grabbing;
        transform: scale(1.08);
      }
      .track input[type="range"]::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        border: 5px solid var(--thumb);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
        cursor: grab;
      }
      .track input[type="range"]::-moz-range-track {
        background: transparent;
      }
      .track input[type="range"]:focus-visible::-webkit-slider-thumb {
        outline: 2px solid var(--bt-accent);
        outline-offset: 2px;
      }
      .tick {
        position: absolute;
        top: 12px;
        width: 2px;
        height: 6px;
        margin-left: -1px;
        border-radius: 1px;
        background: rgba(255, 255, 255, 0.9);
        pointer-events: none;
      }
      .scale {
        position: relative;
        height: 14px;
        font-size: 11px;
        margin: 0 10px; /* the slider thumb never reaches the very edges */
      }
      .scale span {
        position: absolute;
        transform: translateX(-50%);
      }
      .quick {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding-top: 4px;
      }
      .mini.q {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: var(--bt-surface);
        color: var(--primary-text-color);
      }
      .mini.q b {
        font-weight: 600;
      }
      .mini.q.on {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .switch {
        width: 40px;
        height: 24px;
        border-radius: 12px;
        background: var(--disabled-color, #bdbdbd);
        position: relative;
        flex: none;
        margin-right: 4px;
        transition: background 0.15s;
      }
      .switch span {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        transition: left 0.15s;
      }
      .switch.on {
        background: var(--bt-accent);
      }
      .switch.on span {
        left: 19px;
      }
      .stepper {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .stepper.wide {
        justify-content: space-between;
      }
      .round.small {
        width: 34px;
        height: 34px;
        font-size: 20px;
        background: var(--card-background-color, #fff);
      }
      .val {
        min-width: 64px;
        text-align: center;
        font-size: 15px;
      }
      .also {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
      }
      .mini {
        min-height: 28px;
        padding: 0 10px;
        border-radius: 14px;
        font-size: 13px;
        background: var(--card-background-color, #fff);
        color: var(--bt-muted);
      }
      .mini.on {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .vars-line {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        text-align: left;
        font-size: 13px;
        color: var(--bt-muted);
        padding: 0 4px;
      }
      .vars-line ha-icon {
        --mdc-icon-size: 18px;
      }
      .vars-text {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 2px 6px;
      }
      .vars-text b {
        color: var(--primary-text-color);
        font-weight: 500;
      }
      .var-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .var-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex: none;
      }
      .hint {
        font-size: 12px;
      }
      .rooms {
        display: flex;
        flex-direction: column;
      }
      .floor {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--bt-muted);
        margin: 12px 4px 2px;
        width: calc(100% - 8px);
        padding: 4px 0;
        text-align: left;
      }
      .floor ha-icon {
        --mdc-icon-size: 16px;
      }
      .swipeable {
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
        cursor: ew-resize;
        border-radius: 10px;
        transition: background 0.15s;
      }
      .temps.swipeable {
        padding: 2px 6px;
        margin: -2px -6px;
      }
      .swiping {
        background: var(--bt-surface);
      }
      .swiping .tgt,
      .tgt.live,
      .val.swiping,
      .value-btn.swiping {
        color: var(--bt-accent);
      }
      .val.swipeable {
        padding: 4px 0;
      }
      .floor-next {
        margin-left: auto;
        text-transform: none;
        letter-spacing: 0;
        font-weight: 500;
        white-space: nowrap;
      }
      .floor-chev {
        --mdc-icon-size: 18px;
        margin-left: 2px;
      }
      .icon.off {
        opacity: 0.55;
      }
      .floor-heat {
        color: var(--bt-heat);
        text-transform: none;
        letter-spacing: 0;
        font-weight: 500;
      }
      .detail {
        margin: 0 0 12px;
        padding: 12px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
      }
      .grid.tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        align-items: start;
        gap: 10px;
      }
      .tile {
        padding: 14px;
        border-radius: 18px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color, #fff);
      }
      .floor:first-child {
        margin-top: 0;
      }
      .room-block + .room-block {
        border-top: 1px solid var(--divider-color);
      }
      .floor + .room-block {
        border-top: none;
      }
      .room {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 4px;
        width: 100%;
        text-align: left;
      }
      .icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bt-surface);
        color: var(--bt-muted);
        flex: none;
      }
      .icon ha-icon {
        --mdc-icon-size: 20px;
      }
      .icon.heating {
        background: color-mix(in srgb, var(--bt-heat) 18%, transparent);
        color: var(--bt-heat);
      }
      .left,
      .temps {
        display: flex;
        flex-direction: column;
      }
      .temps {
        align-items: flex-end;
      }
      .name {
        font-weight: 500;
      }
      .sub {
        font-size: 12.5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bat-low {
        --mdc-icon-size: 16px;
        color: var(--error-color, #db4437);
        margin-left: 4px;
        vertical-align: -2px;
      }
      .planned {
        display: inline-flex;
        align-items: center;
        gap: 3px;
      }
      .planned ha-icon {
        --mdc-icon-size: 13px;
      }
      .cur {
        font-size: 18px;
        font-weight: 500;
      }
      .tgt {
        font-size: 12px;
      }
      .controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 0 0 10px 48px;
        padding: 10px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .seg {
        display: flex;
        gap: 2px;
        padding: 3px;
        border-radius: 11px;
        background: var(--card-background-color, #fff);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .seg button {
        flex: 1 0 auto;
        min-height: 32px;
        padding: 0 10px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .seg button[aria-selected="true"] {
        background: var(--bt-surface);
        color: var(--primary-text-color);
      }
      .seg.accent button[aria-selected="true"] {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .details {
        align-self: flex-end;
        min-height: 30px;
        font-size: 13px;
      }
    `,
  ];
}
