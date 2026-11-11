import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { FloorData, HomeAssistant, RoomData, Snapshot } from "./api";
import { subscribe, ws } from "./api";
import { roomIcon, roomStatus, upcomingPeriods } from "./room-view";
import { shared } from "./styles";
import { fmtTemp, fmtTime, strings, tempColor } from "./utils";

interface OverviewConfig {
  type: string;
  title?: string;
  show_override?: boolean;
  show_variables?: boolean;
  show_periods?: boolean;
  group_by_floor?: boolean;
}

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
  };

  hass?: HomeAssistant;
  _config?: OverviewConfig;
  _snap?: Snapshot;
  _error?: string;
  _open?: string;
  _ovOpen = false;
  _varsOpen = false;
  private _unsub?: () => void;

  static getConfigElement() {
    return document.createElement("bestthermostat-overview-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config: OverviewConfig) {
    this._config = {
      show_override: true,
      show_variables: true,
      show_periods: true,
      group_by_floor: true,
      ...config,
    };
  }

  getCardSize() {
    return 2 + (this._snap?.rooms.length ?? 2);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hass) this._unsub = subscribe(this.hass, (s) => (this._snap = s));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this._unsub && this.isConnected) {
      this._unsub = subscribe(this.hass, (s) => (this._snap = s));
    }
  }

  private async _call(type: string, data: Record<string, unknown>) {
    try {
      this._error = undefined;
      await ws(this.hass!, type, data);
    } catch (err: any) {
      this._error = err?.message ?? String(err);
    }
  }

  private _moreInfo(room: RoomData) {
    if (!room.climate_entity_id) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: room.climate_entity_id },
        bubbles: true,
        composed: true,
      }),
    );
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

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const t = strings(this.hass);
    const snap = this._snap;
    if (!snap) return html`<ha-card><div class="pad">${t.loading}</div></ha-card>`;
    const heating = snap.rooms.filter((r) => r.hvac_action === "heating").length;
    const temps = snap.rooms.map((r) => r.current_temperature).filter((v): v is number => v != null);
    const avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    const groups = this._groups(snap.rooms);
    const grouped = groups.length > 1 || groups[0]?.floor;
    return html`<ha-card>
      <div class="pad col">
        <div>
          <div class="title">${this._config.title ?? t.rooms}</div>
          <div class="muted summary">
            ${heating} ${t.of} ${snap.rooms.length} ${t.rooms_word} ${t.heating_summary}${avg != null
              ? html` · Ø ${fmtTemp(avg)}`
              : nothing}
          </div>
        </div>
        ${this._config.show_override ? this._renderOverride() : nothing}
        ${this._config.show_variables && snap.variables.length ? this._renderVariables() : nothing}
        <div class="rooms">
          ${groups.map(
            (g) => html`${grouped
                ? html`<div class="floor">${g.floor?.name ?? t.other_floor}</div>`
                : nothing}
              ${g.rooms.map((room) => this._renderRoom(room))}`,
          )}
        </div>
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      </div>
    </ha-card>`;
  }

  private _renderOverride() {
    const t = strings(this.hass);
    const ov = this._snap!.override;
    const open = ov.active || this._ovOpen;
    const step = (d: number) =>
      this._call("override/set", { temperature: Math.min(30, Math.max(5, (ov.value ?? 16) + d)) });
    return html`<div class="box ${ov.active ? "on" : ""}">
      <div class="box-head">
        <button class="box-label" @click=${() => (this._ovOpen = !this._ovOpen)}>
          <ha-icon icon="mdi:home-export-outline"></ha-icon>
          <span>${t.override}</span>
          ${ov.active ? html`<span class="muted">· ${fmtTemp(ov.value)}</span>` : nothing}
        </button>
        <button class="switch ${ov.active ? "on" : ""}" role="switch" aria-checked=${ov.active}
          aria-label=${t.override} @click=${() => this._call("override/set", { active: !ov.active })}>
          <span></span>
        </button>
      </div>
      ${open
        ? html`<div class="box-body">
            <div class="stepper">
              <button class="round small" @click=${() => step(-0.5)}>−</button>
              <span class="val">${fmtTemp(ov.value)}</span>
              <button class="round small" @click=${() => step(0.5)}>+</button>
            </div>
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
                  this._call("variable/update", { variable_id: v.id, value: Math.max(5, v.value - 0.5) })}>−</button>
                <span class="val">${fmtTemp(v.value)}</span>
                <button class="round small" @click=${() =>
                  this._call("variable/update", { variable_id: v.id, value: Math.min(30, v.value + 0.5) })}>+</button>
              </div>`,
            )}
            <div class="muted hint">${t.variables_note}</div>
          </div>`
        : nothing}
    </div>`;
  }

  private _renderRoom(room: RoomData) {
    const t = strings(this.hass);
    const h = this.hass!;
    const heating = room.hvac_action === "heating";
    const open = this._open === room.entry_id;
    const next = this._config?.show_periods ? upcomingPeriods(room)[0] : undefined;
    return html`<div class="room-block ${open ? "open" : ""}">
      <button class="room" @click=${() => (this._open = open ? undefined : room.entry_id)}>
        <span class="icon ${heating ? "heating" : ""}"><ha-icon icon=${roomIcon(room)}></ha-icon></span>
        <span class="grow left">
          <span class="name">${room.name}</span>
          <span class="muted sub">${roomStatus(room, t, h)}</span>
          ${next
            ? html`<span class="muted sub planned">
                <ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${next.title} · ${t.period_from}
                ${fmtTime(next.start, h)}
              </span>`
            : nothing}
        </span>
        <span class="temps">
          <span class="cur">${fmtTemp(room.current_temperature, false)}°</span>
          <span class="muted tgt">→ ${fmtTemp(room.target_temperature, false)}°</span>
        </span>
      </button>
      ${open ? this._renderControls(room) : nothing}
    </div>`;
  }

  private _renderControls(room: RoomData) {
    const t = strings(this.hass);
    const modes: [string, string][] = [
      ["auto", t.auto],
      ["heat", t.heat],
      ["off", t.off],
    ];
    const target = room.target_temperature ?? 20;
    const set = (d: number) =>
      this._call("room/temperature", {
        entry_id: room.entry_id,
        temperature: Math.min(room.max_temp, Math.max(room.min_temp, target + d)),
      });
    return html`<div class="controls">
      <div class="seg accent">
        ${modes.map(
          ([mode, label]) => html`<button aria-selected=${room.mode === mode}
            @click=${() => this._call("room/mode", { entry_id: room.entry_id, mode })}>${label}</button>`,
        )}
      </div>
      ${room.schedules.length > 1
        ? html`<div class="seg">
            ${room.schedules.map(
              (s) => html`<button aria-selected=${s.id === room.active_schedule}
                @click=${() =>
                  this._call("schedule/activate", { entry_id: room.entry_id, schedule_id: s.id })}>
                ${s.name}
              </button>`,
            )}
          </div>`
        : nothing}
      <div class="stepper wide">
        <button class="round small" @click=${() => set(-0.5)}>−</button>
        <span class="val">${fmtTemp(room.target_temperature)}</span>
        <button class="round small" @click=${() => set(0.5)}>+</button>
      </div>
      <button class="text-btn details" @click=${() => this._moreInfo(room)}>
        ${t.open_details}
      </button>
    </div>`;
  }

  static styles = [
    shared,
    css`
      .pad {
        padding: 16px;
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
      .box-label ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-muted);
      }
      .box-body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 4px 0 8px;
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
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--bt-muted);
        margin: 12px 4px 2px;
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
