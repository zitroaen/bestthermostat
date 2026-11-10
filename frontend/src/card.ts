import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { HomeAssistant, RoomData, Snapshot, PeriodData } from "./api";
import { DAYS, findRoom, subscribe, ws } from "./api";
import { shared } from "./styles";
import {
  DAY_MIN,
  fmtTemp,
  fmtTime,
  nowMinutes,
  resolveSlot,
  segments,
  slotLabel,
  strings,
  tempColor,
  todayKey,
} from "./utils";
import "./week-editor";
import "./period-dialog";
import type { BtPeriodDialog } from "./period-dialog";
import type { BtWeekEditor } from "./week-editor";

export interface CardConfig {
  type: string;
  entity?: string;
  name?: string;
  compact?: boolean;
  show_modes?: boolean;
  show_schedules?: boolean;
  show_timeline?: boolean;
  show_editor?: boolean;
  show_periods?: boolean;
  show_priorities?: boolean;
}

export class BestThermostatCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _snap: { state: true },
    _pending: { state: true },
    _editing: { state: true },
    _planning: { state: true },
    _editPeriod: { state: true },
    _allPeriods: { state: true },
    _error: { state: true },
  };

  hass?: HomeAssistant;
  _config?: CardConfig;
  _snap?: Snapshot;
  _pending?: number;
  _editing = false;
  _planning = false;
  _editPeriod?: PeriodData;
  _allPeriods = false;
  private _planner?: BtPeriodDialog;
  _error?: string;
  private _unsub?: () => void;
  private _debounce?: number;
  private _tick?: number;
  private _editor?: BtWeekEditor;

  static getConfigElement() {
    return document.createElement("bestthermostat-card-editor");
  }

  static getStubConfig(hass: HomeAssistant) {
    const entity = Object.values(hass.states).find(
      (s) => s.entity_id.startsWith("climate.") && s.attributes.room_id,
    );
    return { entity: entity?.entity_id ?? "" };
  }

  setConfig(config: CardConfig) {
    this._config = {
      show_modes: true,
      show_schedules: true,
      show_timeline: true,
      show_editor: true,
      show_periods: true,
      show_priorities: false,
      ...config,
    };
  }

  getCardSize() {
    return this._config?.compact ? 3 : 6;
  }

  getGridOptions() {
    return this._config?.compact
      ? { columns: 6, rows: 4, min_columns: 4, min_rows: 3 }
      : { columns: 12, min_columns: 6 };
  }

  connectedCallback() {
    super.connectedCallback();
    this._tick = window.setInterval(() => this.requestUpdate(), 60_000);
    if (this.hass) this._subscribe();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
    window.clearInterval(this._tick);
    this._editor?.remove();
    this._editor = undefined;
    this._editing = false;
    this._planner?.remove();
    this._planner = undefined;
    this._planning = false;
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this._unsub && this.isConnected) this._subscribe();
  }

  protected updated() {
    // The editor lives in document.body so it is not clipped by dashboard layouts.
    const room = this._room;
    if (this._editing && room && this.hass) {
      if (!this._editor) {
        this._editor = document.createElement("bt-week-editor") as BtWeekEditor;
        this._editor.addEventListener("close", () => (this._editing = false));
        document.body.appendChild(this._editor);
      }
      this._editor.hass = this.hass;
      this._editor.snap = this._snap;
      this._editor.room = room;
    } else if (this._editor) {
      this._editor.remove();
      this._editor = undefined;
    }
    if (this._planning && room && this.hass) {
      if (!this._planner) {
        this._planner = document.createElement("bt-period-dialog") as BtPeriodDialog;
        this._planner.addEventListener("close", () => {
          this._planning = false;
          this._editPeriod = undefined;
        });
        document.body.appendChild(this._planner);
      }
      this._planner.hass = this.hass;
      this._planner.room = room;
      this._planner.period = this._editPeriod;
    } else if (this._planner) {
      this._planner.remove();
      this._planner = undefined;
    }
  }

  private _subscribe() {
    if (!this.hass) return;
    this._unsub = subscribe(this.hass, (snap) => (this._snap = snap));
  }

  private get _room(): RoomData | undefined {
    return findRoom(this._snap, this._config?.entity);
  }

  private async _call(type: string, data: Record<string, unknown>) {
    if (!this.hass) return;
    try {
      this._error = undefined;
      await ws(this.hass, type, data);
    } catch (err: any) {
      this._error = err?.message ?? String(err);
    }
  }

  private _step(room: RoomData, delta: number) {
    const base = this._pending ?? room.target_temperature ?? 20;
    const value = Math.min(room.max_temp, Math.max(room.min_temp, Math.round((base + delta) * 2) / 2));
    this._pending = value;
    window.clearTimeout(this._debounce);
    this._debounce = window.setTimeout(async () => {
      await this._call("room/temperature", { entry_id: room.entry_id, temperature: value });
      this._pending = undefined;
    }, 700);
  }

  private _mode(room: RoomData, mode: string) {
    this._call("room/mode", { entry_id: room.entry_id, mode });
  }

  private _schedule(room: RoomData, id: string) {
    this._call("schedule/activate", { entry_id: room.entry_id, schedule_id: id });
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

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const t = strings(this.hass);
    if (!this._snap) return html`<ha-card><div class="msg">${t.loading}</div></ha-card>`;
    const room = this._room;
    if (!room) return html`<ha-card><div class="msg">${t.not_found}</div></ha-card>`;
    const c = this._config;
    const heating = room.hvac_action === "heating";
    const target = this._pending ?? room.target_temperature;
    const name = c.name || room.name;
    const status = this._status(room);

    return html`
      <ha-card class=${c.compact ? "compact" : ""}>
        <div class="head">
          <button class="icon ${heating ? "heating" : ""}" @click=${() => this._moreInfo(room)}
            aria-label=${name}>
            <ha-icon icon=${room.mode === "off" ? "mdi:radiator-off" : "mdi:radiator"}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${name}</div>
            <div class="sub muted">${status}</div>
          </div>
          <div class="current">
            <span class="big">${fmtTemp(room.current_temperature, false)}</span><span class="unit">°C</span>
          </div>
        </div>

        <div class="target">
          <button class="round" @click=${() => this._step(room, -0.5)} aria-label="-0.5">−</button>
          <div class="target-val" style="--c:${tempColor(target ?? undefined)}">
            <span class="tv">${fmtTemp(target, false)}</span><span class="unit">°C</span>
            <div class="src muted">${t[`src_${room.target_source}` as keyof typeof t] as string}</div>
          </div>
          <button class="round" @click=${() => this._step(room, 0.5)} aria-label="+0.5">+</button>
        </div>

        ${c.show_modes ? this._renderModes(room) : nothing}
        ${this._renderPeriods(room)}
        ${c.show_priorities ? this._renderPriorities(room) : nothing}
        ${this._renderScheduleSection(room)}
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        ${c.show_editor && !c.compact
          ? html`<div class="footer">
              <button class="text-btn" @click=${() => (this._editing = true)}>
                <ha-icon icon="mdi:calendar-edit"></ha-icon> ${t.edit}
              </button>
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  private _status(room: RoomData): string {
    const t = strings(this.hass);
    const sched = room.schedules.find((s) => s.id === room.active_schedule)?.name ?? "";
    const parts: string[] = [];
    if (room.override_active) parts.push(t.src_override);
    else if (room.period && room.mode !== "auto") parts.push(room.period.title);
    else if (room.mode === "auto") {
      parts.push(sched);
      if (room.hand_until) parts.push(`${t.until} ${fmtTime(room.hand_until, this.hass!)}`);
      else if (room.next_change)
        parts.push(`${fmtTime(room.next_change, this.hass!)} → ${fmtTemp(room.next_temperature)}`);
    } else parts.push(room.mode === "off" ? t.src_off : t.src_manual);
    if (this._snap?.override.active && !room.override_active) parts.push(t.override_not_applied);
    if (room.hvac_action === "heating") parts.push(t.heating);
    return parts.filter(Boolean).join(" · ");
  }

  private _renderPriorities(room: RoomData) {
    const t = strings(this.hass);
    const h = this.hass!;
    const ov = this._snap!.override;
    const schedName = (id: string) => room.schedules.find((s) => s.id === id)?.name ?? id;
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
          : `${t.auto} · ${schedName(room.base_schedule)}`;
    const layers: { n: number; icon: string; name: string; value: string }[] = [
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
            ? `${fmtTemp(room.target_temperature)} · ${t.until} ${fmtTime(room.hand_until, h)}`
            : t.prio_none,
      },
      {
        n: 3,
        icon: "mdi:calendar-star",
        name: t.period,
        value: room.period
          ? `${room.period.title} · ${room.period.end ? `${t.period_until} ${fmtTime(room.period.end, h)}` : t.period_open}`
          : t.prio_none,
      },
      { n: 4, icon: "mdi:radiator", name: t.prio_room, value: base },
    ];
    return html`<div class="prio">
      <div class="sched-head">
        <ha-icon icon="mdi:layers-triple-outline"></ha-icon><span>${t.prio_title}</span>
      </div>
      ${layers.map(
        (l) => html`<div class="prio-row ${l.n === winner ? "win" : l.n < winner ? "idle" : "below"}">
          <span class="prio-n">${l.n}</span>
          <ha-icon icon=${l.icon}></ha-icon>
          <span class="prio-name">${l.name}</span>
          <span class="prio-val">${l.value}</span>
        </div>`,
      )}
    </div>`;
  }

  private _openPeriod(period: PeriodData) {
    this._editPeriod = period;
    this._planning = true;
  }

  private _renderPeriods(room: RoomData) {
    const c = this._config!;
    if (!c.show_periods) return nothing;
    const t = strings(this.hass);
    const now = Date.now();
    const active = room.period;
    const upcoming = (room.periods ?? [])
      .filter((p) => new Date(p.start).getTime() > now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const shown = c.compact ? [] : this._allPeriods ? upcoming : upcoming.slice(0, 3);
    if (!active && !shown.length && c.compact) return nothing;
    const range = (p: { start: string; end: string | null }) =>
      `${fmtTime(p.start, this.hass!)} – ${p.end ? fmtTime(p.end, this.hass!) : t.period_open}`;
    return html`<div class="periods">
      ${active
        ? html`<div class="period active">
            <ha-icon icon="mdi:calendar-star"></ha-icon>
            <div class="period-text" role="button" tabindex="0"
              @click=${() => this._openPeriod(active)}>
              <div class="period-title">${active.title}</div>
              <div class="muted period-when">
                ${active.end ? `${t.period_until} ${fmtTime(active.end, this.hass!)}` : t.period_open}
              </div>
            </div>
            <button class="chip" @click=${() =>
              this._call("period/cancel", { entry_id: room.entry_id, period_id: active.id })}>
              ${t.period_end}
            </button>
          </div>`
        : nothing}
      ${shown.map(
        (p) => html`<div class="period">
          <ha-icon icon="mdi:calendar-clock-outline"></ha-icon>
          <div class="period-text" role="button" tabindex="0" @click=${() => this._openPeriod(p)}>
            <div class="period-title">${p.title}</div>
            <div class="muted period-when">${range(p)}</div>
          </div>
          <button class="round small" aria-label=${t.period_delete} @click=${() =>
            this._call("period/cancel", { entry_id: room.entry_id, period_id: p.id })}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>`,
      )}
      ${!c.compact && upcoming.length > 3
        ? html`<button class="muted more" @click=${() => (this._allPeriods = !this._allPeriods)}>
            ${this._allPeriods ? t.period_less : `+${upcoming.length - shown.length} ${t.period_more}`}
          </button>`
        : nothing}
      ${c.compact
        ? nothing
        : html`<button class="text-btn plan" @click=${() => (this._planning = true)}>
            <ha-icon icon="mdi:calendar-plus"></ha-icon> ${t.period_plan}
          </button>`}
    </div>`;
  }

  private _renderModes(room: RoomData) {
    const t = strings(this.hass);
    const modes: [string, string, string][] = [
      ["auto", t.auto, "mdi:calendar-clock"],
      ["heat", t.heat, "mdi:hand-back-right"],
      ["off", t.off, "mdi:snowflake"],
    ];
    return html`<div class="chips scroll row">
      ${modes.map(
        ([mode, label, icon]) => html`<button class="chip" aria-pressed=${room.mode === mode}
          @click=${() => this._mode(room, mode)}>
          <ha-icon icon=${icon}></ha-icon>${label}
        </button>`,
      )}
    </div>`;
  }

  private _renderScheduleSection(room: RoomData) {
    const c = this._config!;
    const showChoice = c.show_schedules && room.schedules.length > 1;
    const showTimeline = c.show_timeline && !c.compact;
    if (!showChoice && !showTimeline) return nothing;
    const t = strings(this.hass);
    const paused = room.mode !== "auto" || room.override_active;
    return html`<div class="sched-box ${paused ? "paused" : ""}">
      <div class="sched-head">
        <ha-icon icon="mdi:calendar-clock"></ha-icon>
        <span>${t.schedule}</span>
        ${paused ? html`<span class="muted sched-note">${t.schedule_paused}</span>` : nothing}
      </div>
      ${showChoice
        ? html`<div class="segmented" role="tablist">
            ${room.schedules.map(
              (s) => html`<button role="tab" aria-selected=${s.id === room.active_schedule}
                @click=${() => this._schedule(room, s.id)}>${s.name}</button>`,
            )}
          </div>`
        : nothing}
      ${showTimeline ? this._renderTimeline(room) : nothing}
    </div>`;
  }

  private _renderTimeline(room: RoomData) {
    const sched = room.schedules.find((s) => s.id === room.active_schedule);
    if (!sched) return nothing;
    const vars = this._snap!.variables;
    const segs = segments(sched.week[todayKey()] ?? sched.week[DAYS[0]]);
    const now = nowMinutes();
    return html`<div class="timeline">
      <div class="bar">
        ${segs.map((s) => {
          const temp = resolveSlot(s.slot, vars);
          const w = ((s.end - s.start) / DAY_MIN) * 100;
          return html`<div class="seg" title="${slotLabel(s.slot, vars)}"
            style="left:${(s.start / DAY_MIN) * 100}%;width:${w}%;background:${tempColor(temp)}">
            ${w > 9 ? html`<span>${fmtTemp(temp, false)}</span>` : nothing}
          </div>`;
        })}
        <div class="now" style="left:${(now / DAY_MIN) * 100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`;
  }

  static styles = [
    shared,
    css`
      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: var(--bt-gap);
        overflow: hidden;
        height: 100%;
        box-sizing: border-box;
      }
      .msg {
        padding: 8px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .icon {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bt-surface);
        color: var(--bt-muted);
        flex: none;
      }
      .icon.heating {
        background: color-mix(in srgb, var(--bt-heat) 20%, transparent);
        color: var(--bt-heat);
      }
      .title {
        flex: 1;
        min-width: 0;
      }
      .name {
        font-weight: 600;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sub {
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .current .big {
        font-size: 22px;
        font-weight: 500;
      }
      .unit {
        font-size: 13px;
        color: var(--bt-muted);
        margin-left: 2px;
      }
      .target {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 4px 0;
      }
      .target-val {
        text-align: center;
        flex: 1;
      }
      .tv {
        font-size: 44px;
        font-weight: 400;
        line-height: 1.1;
        color: var(--primary-text-color);
      }
      .target-val .unit {
        font-size: 18px;
      }
      .target-val::after {
        content: "";
        display: block;
        width: 40px;
        height: 4px;
        border-radius: 2px;
        margin: 6px auto 0;
        background: var(--c);
      }
      .src {
        font-size: 12px;
      }
      .row ha-icon {
        --mdc-icon-size: 18px;
      }
      .prio {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .prio .sched-head {
        margin-bottom: 4px;
      }
      .prio-row {
        display: grid;
        grid-template-columns: 20px 20px auto 1fr;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 10px;
        font-size: 13px;
      }
      .prio-row ha-icon {
        --mdc-icon-size: 18px;
        color: var(--bt-muted);
      }
      .prio-n {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      }
      .prio-name {
        font-weight: 500;
        white-space: nowrap;
      }
      .prio-val {
        text-align: right;
        color: var(--bt-muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .prio-row.win {
        background: var(--card-background-color, #fff);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      }
      .prio-row.win .prio-n {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .prio-row.win ha-icon {
        color: var(--bt-accent);
      }
      .prio-row.win .prio-val {
        color: var(--primary-text-color);
        font-weight: 500;
      }
      .prio-row.below {
        opacity: 0.5;
      }
      .periods {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .periods .plan {
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin: -4px -8px;
      }
      .periods .plan ha-icon {
        --mdc-icon-size: 18px;
      }
      .more {
        font-size: 12px;
        padding: 2px 12px;
        align-self: flex-start;
      }
      .round.small {
        width: 32px;
        height: 32px;
        background: var(--card-background-color, #fff);
      }
      .round.small ha-icon {
        --mdc-icon-size: 18px;
      }
      .period {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 8px 8px 12px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .period.active {
        background: color-mix(in srgb, var(--bt-accent) 16%, transparent);
      }
      .period ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-accent);
      }
      .period-text {
        flex: 1;
        min-width: 0;
        cursor: pointer;
      }
      .period-text:hover .period-title {
        text-decoration: underline;
      }
      .period-title {
        font-weight: 500;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .period-when {
        font-size: 12px;
      }
      .period .chip {
        background: var(--card-background-color, #fff);
        min-height: 32px;
      }
      .sched-box {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .sched-head {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: var(--bt-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .sched-head ha-icon {
        --mdc-icon-size: 16px;
      }
      .sched-note {
        margin-left: auto;
        font-weight: 400;
        text-transform: none;
        letter-spacing: 0;
      }
      .sched-box.paused .timeline {
        opacity: 0.55;
      }
      .segmented {
        display: flex;
        gap: 4px;
        padding: 3px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .segmented button {
        flex: 1 0 auto;
        min-height: 34px;
        padding: 0 12px;
        border-radius: 9px;
        font-size: 14px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .segmented button[aria-selected="true"] {
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
      }
      .sched-box .timeline .bar {
        background: var(--card-background-color, #fff);
      }
      .timeline .bar {
        position: relative;
        height: 28px;
        border-radius: 10px;
        overflow: hidden;
        background: var(--bt-surface);
      }
      .seg {
        position: absolute;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.7);
        border-right: 1px solid var(--bt-surface);
        box-sizing: border-box;
      }
      .now {
        position: absolute;
        top: -2px;
        bottom: -2px;
        width: 3px;
        margin-left: -1px;
        background: var(--primary-text-color);
        border-radius: 2px;
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        margin-top: 4px;
      }
      .footer {
        display: flex;
        justify-content: flex-end;
        margin: -4px -8px -8px;
      }
      .footer ha-icon {
        --mdc-icon-size: 18px;
        margin-right: 4px;
      }
      /* Compact: optimised for small square wall displays */
      ha-card.compact {
        padding: 12px;
        gap: 10px;
        justify-content: space-between;
      }
      ha-card.compact .tv {
        font-size: 52px;
      }
      ha-card.compact .round {
        width: 64px;
        height: 64px;
        font-size: 32px;
      }
      ha-card.compact .chip {
        min-height: 44px;
        flex: 1;
        justify-content: center;
      }
      ha-card.compact .segmented button {
        min-height: 42px;
      }
      ha-card.compact .sched-head {
        display: none;
      }
    `,
  ];
}
