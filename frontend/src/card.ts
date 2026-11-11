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
  updateBanner,
} from "./utils";
import {
  batteryIcon,
  lowestBattery,
  priorities,
  roomIcon,
  roomStatus,
  upcomingPeriods,
} from "./room-view";
import { startSwipe } from "./swipe";
import { CARD_VERSION } from "./version";
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
  show_battery?: boolean;
  /** Used inside the overview card: no card frame, optional header. */
  embedded?: boolean;
  show_header?: boolean;
  show_floor?: boolean;
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
    _section: { state: true },
    _batOpen: { state: true },
    _swipe: { state: true },
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
  _section?: "schedule" | "periods" | "prio" | "battery";
  _batOpen = false;
  _swipe?: { moved: boolean };
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
      show_priorities: true,
      show_battery: true,
      show_header: true,
      ...config,
    };
  }

  /** Property alternative to setConfig (used when embedded by the overview card). */
  set config(config: CardConfig) {
    this.setConfig(config);
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

  private _clampTemp(room: RoomData, value: number): number {
    return Math.min(room.max_temp, Math.max(room.min_temp, Math.round(value * 2) / 2));
  }

  /** Horizontal swipe on the target temperature (0.5 °C per step), sent on release. */
  private _swipeStart(ev: PointerEvent | TouchEvent, room: RoomData) {
    const start = this._pending ?? room.target_temperature ?? 20;
    startSwipe(ev, {
      onStep: (steps) => {
        if (!this._swipe) this._swipe = { moved: true };
        const value = this._clampTemp(room, start + steps * 0.5);
        if (value !== this._pending) {
          this._pending = value;
          window.clearTimeout(this._debounce);
          navigator.vibrate?.(5);
        }
      },
      onEnd: (moved) => {
        this._swipe = undefined;
        if (!moved) return;
        if (this._pending !== undefined && this._pending !== room.target_temperature) {
          this._step(room, 0);
        } else {
          this._pending = undefined;
        }
      },
    });
  }

  private _step(room: RoomData, delta: number) {
    const base = this._pending ?? room.target_temperature ?? 20;
    const value = this._clampTemp(room, base + delta);
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

  private _openPeriod(period: PeriodData) {
    this._editPeriod = period;
    this._planning = true;
  }

  private _toggle(section: "schedule" | "periods" | "prio" | "battery") {
    this._section = this._section === section ? undefined : section;
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
    if (!this._snap) return html`<ha-card><div class="msg">${t.loading}</div></ha-card>`;
    const room = this._room;
    if (!room) return html`<ha-card><div class="msg">${t.not_found}</div></ha-card>`;
    const c = this._config;
    const heating = room.hvac_action === "heating";
    const target = this._pending ?? room.target_temperature;
    const name = c.name || room.name;
    const sub = [
      c.show_floor === false ? "" : room.floor?.name,
      roomStatus(room, t, this.hass),
      heating ? t.heating : "",
    ]
      .filter(Boolean)
      .join(" · ");

    return html`
      <ha-card class="${c.compact ? "compact" : ""} ${c.embedded ? "embedded" : ""}">
        ${c.embedded ? nothing : this._renderUpdate()}
        ${c.show_header === false ? nothing : html`<div class="head">
          <button class="icon ${heating ? "heating" : ""} ${room.mode === "off" ? "off" : ""}"
            @click=${() => this._moreInfo(room)}
            aria-label=${name}>
            <ha-icon icon=${roomIcon(room)}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${name}</div>
            <div class="sub muted">${sub}</div>
          </div>
          ${c.show_battery ? this._batteryChip(room) : nothing}
          ${c.show_editor && !(c.show_timeline && !c.compact) ? this._pencil() : nothing}
        </div>`}
        ${c.show_header === false && c.show_battery && lowestBattery(room)
          ? html`<div class="bat-line">${this._batteryChip(room)}</div>`
          : nothing}
        ${this._batOpen && c.show_battery ? this._batteryPanel(room) : nothing}

        <div class="hero">
          <div class="current">
            <span class="big">${fmtTemp(room.current_temperature, false)}</span><span class="unit">°C</span>
          </div>
          <div class="ctl">
            <button class="round" @click=${() => this._step(room, -0.5)} aria-label="-0.5">−</button>
            <div class="target ${this._swipe?.moved ? "swiping" : ""}" title=${t.swipe_hint}
              @pointerdown=${(e: PointerEvent) => this._swipeStart(e, room)}
              @touchstart=${(e: TouchEvent) => this._swipeStart(e, room)}>
              <div class="tv" style="--c:${tempColor(target ?? undefined)}">${fmtTemp(target, false)}°</div>
              <div class="muted src">${[
                room.target_variable,
                t[`src_${room.target_source}` as keyof typeof t] as string,
              ]
                .filter(Boolean)
                .join(" · ")}</div>
            </div>
            <button class="round" @click=${() => this._step(room, 0.5)} aria-label="+0.5">+</button>
          </div>
        </div>

        ${c.show_modes ? this._renderModes(room) : nothing}
        ${c.show_timeline && !c.compact ? this._renderTimeline(room) : nothing}
        ${c.show_schedules && room.schedules.length > 1 ? this._renderScheduleChoice(room) : nothing}
        ${c.compact ? nothing : this._renderList(room)}
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      </ha-card>
    `;
  }

  /** Small battery indicator with the level(s); tap to expand. */
  private _batteryChip(room: RoomData) {
    const list = room.batteries ?? [];
    const lowest = lowestBattery(room);
    if (!lowest) return nothing;
    const levels = list.filter((b) => b.level != null).map((b) => Math.round(b.level as number));
    const text = levels.length
      ? levels.length <= 3
        ? `${levels.join(" · ")} %`
        : `${Math.min(...levels)} %`
      : "";
    const t = strings(this.hass);
    return html`<button class="bat-chip ${lowest.low ? "low" : ""}" aria-expanded=${this._batOpen}
      title=${t.battery} @click=${() => (this._batOpen = !this._batOpen)}>
      <ha-icon icon=${batteryIcon(lowest.level, lowest.low)}></ha-icon>${text}
    </button>`;
  }

  private _batteryPanel(room: RoomData) {
    const t = strings(this.hass);
    return html`<div class="bat-panel">
      ${(room.batteries ?? []).map(
        (b) => html`<button class="bat ${b.low ? "low" : ""}" ?disabled=${!b.device_id}
          @click=${() => b.device_id && this._navigate(`/config/devices/device/${b.device_id}`)}>
          <ha-icon icon=${batteryIcon(b.level, b.low)}></ha-icon>
          <span class="grow">${b.name}</span>
          <span class="bat-val">${b.level != null ? `${Math.round(b.level)} %` : b.low ? t.battery_low : t.battery_ok}</span>
          ${b.device_id ? html`<ha-icon class="go" icon="mdi:chevron-right"></ha-icon>` : nothing}
        </button>`,
      )}
    </div>`;
  }

  private _navigate(path: string) {
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  /** Small pencil that opens the weekly editor. */
  private _pencil() {
    const t = strings(this.hass);
    return html`<button class="pencil" title=${t.edit} aria-label=${t.edit}
      @click=${() => (this._editing = true)}>
      <ha-icon icon="mdi:pencil"></ha-icon>
    </button>`;
  }

  private _renderModes(room: RoomData) {
    const t = strings(this.hass);
    const modes: [string, string][] = [
      ["auto", t.auto],
      ["heat", t.heat],
      ["off", t.off],
    ];
    return html`<div class="seg accent" role="tablist">
      ${modes.map(
        ([mode, label]) => html`<button role="tab" aria-selected=${room.mode === mode}
          @click=${() => this._mode(room, mode)}>${label}</button>`,
      )}
    </div>`;
  }

  private _renderScheduleChoice(room: RoomData) {
    return html`<div class="seg" role="tablist">
      ${room.schedules.map(
        (s) => html`<button role="tab" aria-selected=${s.id === room.active_schedule}
          @click=${() => this._schedule(room, s.id)}>${s.name}</button>`,
      )}
    </div>`;
  }

  private _renderTimeline(room: RoomData) {
    const t = strings(this.hass);
    const sched = room.schedules.find((s) => s.id === room.active_schedule);
    if (!sched) return nothing;
    const vars = this._snap!.variables;
    const day = sched.week?.[todayKey()] ?? sched.week?.[DAYS[0]];
    if (!day?.length) return nothing;
    const segs = segments(day);
    const now = nowMinutes();
    const paused = room.mode !== "auto" || room.override_active;
    return html`<div class="timeline ${paused ? "paused" : ""}">
      <div class="cap muted">
        <span>${t.today} · ${sched.name}${paused ? ` · ${t.schedule_paused}` : ""}</span>
        ${this._config!.show_editor ? this._pencil() : nothing}
      </div>
      <div class="bar">
        ${segs.map((s) => {
          const temp = resolveSlot(s.slot, vars);
          return html`<div class="seg-t"
            title="${slotLabel(s.slot, vars)}"
            style="left:${(s.start / DAY_MIN) * 100}%;width:${((s.end - s.start) / DAY_MIN) * 100}%;background:${tempColor(temp)}"></div>`;
        })}
        <div class="now" style="left:${(now / DAY_MIN) * 100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`;
  }

  private _row(icon: string, label: string, value: unknown, section?: "schedule" | "periods" | "prio" | "battery", onClick?: () => void) {
    const open = section !== undefined && this._section === section;
    const clickable = section !== undefined || onClick !== undefined;
    return html`<button class="row ${open ? "open" : ""}" ?disabled=${!clickable}
      @click=${() => (section ? this._toggle(section) : onClick?.())}>
      <ha-icon icon=${icon}></ha-icon>
      <span class="row-label">${label}</span>
      <span class="row-value">${value}</span>
      ${clickable ? html`<ha-icon class="chev" icon=${open ? "mdi:chevron-up" : "mdi:chevron-right"}></ha-icon>` : nothing}
    </button>`;
  }

  private _renderList(room: RoomData) {
    const c = this._config!;
    const t = strings(this.hass);
    const h = this.hass!;
    const upcoming = upcomingPeriods(room);
    const periodValue = room.period
      ? room.period.title
      : upcoming.length
        ? `${upcoming.length} ${t.period_planned_n}`
        : t.prio_none;
    const prio = priorities(room, this._snap!, t, h);
    const winner = prio.layers.find((l) => l.n === prio.winner)!;
    return html`<div class="list">
      ${c.show_periods
        ? html`${this._row("mdi:calendar-star", t.period_plural, periodValue, "periods")}
          ${this._section === "periods" ? html`<div class="detail">${this._renderPeriods(room)}</div>` : nothing}`
        : nothing}
      ${c.show_priorities
        ? html`${this._row("mdi:layers-triple-outline", t.prio_short, winner.name, "prio")}
          ${this._section === "prio" ? html`<div class="detail">${this._renderPriorities(prio)}</div>` : nothing}`
        : nothing}
    </div>`;
  }

  private _renderPriorities(prio: ReturnType<typeof priorities>) {
    return html`<div class="prio">
      ${prio.layers.map(
        (l) => html`<div class="prio-row ${l.n === prio.winner ? "win" : l.n < prio.winner ? "idle" : "below"}">
          <span class="prio-n">${l.n}</span>
          <span class="prio-name">${l.name}</span>
          <span class="prio-val">${l.value}</span>
        </div>`,
      )}
    </div>`;
  }

  private _renderPeriods(room: RoomData) {
    const t = strings(this.hass);
    const h = this.hass!;
    const active = room.period;
    const upcoming = upcomingPeriods(room);
    const shown = this._allPeriods ? upcoming : upcoming.slice(0, 3);
    const range = (p: PeriodData) =>
      `${fmtTime(p.start, h)} – ${p.end ? fmtTime(p.end, h) : t.period_open}`;
    const item = (p: PeriodData, isActive: boolean) => html`<div class="period ${isActive ? "active" : ""}">
      <button class="period-text" @click=${() => this._openPeriod(p)}>
        <span class="period-title">${p.title}</span>
        <span class="muted period-when">${isActive
          ? p.end ? `${t.period_until} ${fmtTime(p.end, h)}` : t.period_open
          : range(p)}</span>
      </button>
      <button class="text-btn small" @click=${() =>
        this._call("period/cancel", { entry_id: room.entry_id, period_id: p.id })}>
        ${isActive ? t.period_end : t.period_delete}
      </button>
    </div>`;
    return html`<div class="periods">
      ${active ? item(active, true) : nothing}
      ${shown.map((p) => item(p, false))}
      ${upcoming.length > 3
        ? html`<button class="text-btn small" @click=${() => (this._allPeriods = !this._allPeriods)}>
            ${this._allPeriods ? t.period_less : `+${upcoming.length - shown.length} ${t.period_more}`}
          </button>`
        : nothing}
      <button class="text-btn plan" @click=${() => {
        this._editPeriod = undefined;
        this._planning = true;
      }}>
        <ha-icon icon="mdi:calendar-plus"></ha-icon> ${t.period_plan}
      </button>
    </div>`;
  }

  static styles = [
    shared,
    css`
      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden;
        height: 100%;
        box-sizing: border-box;
      }
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
      .msg {
        padding: 8px;
      }
      ha-card.embedded {
        --ha-card-background: transparent;
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0;
        background: transparent;
        box-shadow: none;
        border: none;
        padding: 0;
        height: auto;
        overflow: visible;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bt-surface);
        color: var(--bt-muted);
        flex: none;
      }
      .icon.off {
        opacity: 0.55;
      }
      .icon.heating {
        background: color-mix(in srgb, var(--bt-heat) 18%, transparent);
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
      .hero {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
      }
      .big {
        font-size: 52px;
        font-weight: 300;
        line-height: 1;
        letter-spacing: -0.02em;
      }
      .unit {
        font-size: 16px;
        color: var(--bt-muted);
        margin-left: 2px;
      }
      .ctl {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .ctl .round {
        width: 40px;
        height: 40px;
        font-size: 20px;
      }
      .target {
        text-align: center;
        min-width: 72px;
        padding: 4px 6px;
        border-radius: 12px;
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
        cursor: ew-resize;
        transition: background 0.15s;
      }
      .target.swiping {
        background: var(--bt-surface);
      }
      .target.swiping .tv {
        color: var(--bt-accent);
      }
      .tv {
        font-size: 24px;
        font-weight: 500;
        line-height: 1.1;
      }
      .tv::after {
        content: "";
        display: block;
        width: 22px;
        height: 3px;
        border-radius: 2px;
        margin: 3px auto 0;
        background: var(--c);
      }
      .src {
        font-size: 11px;
      }
      .seg {
        display: flex;
        gap: 2px;
        padding: 3px;
        border-radius: 12px;
        background: var(--bt-surface);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .seg button {
        flex: 1 0 auto;
        min-height: 34px;
        padding: 0 12px;
        border-radius: 9px;
        font-size: 14px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .seg button[aria-selected="true"] {
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
      }
      .seg.accent button[aria-selected="true"] {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
        box-shadow: none;
      }
      .timeline .cap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 6px;
        min-height: 28px;
      }
      .pencil {
        width: 32px;
        height: 32px;
        margin: -4px -6px -4px 0;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--bt-muted);
        flex: none;
      }
      .pencil:hover {
        background: var(--bt-surface);
        color: var(--primary-text-color);
      }
      .pencil ha-icon {
        --mdc-icon-size: 18px;
      }
      .timeline .cap {
        margin-bottom: 2px;
      }
      .timeline .bar {
        position: relative;
        height: 6px;
        border-radius: 3px;
        overflow: hidden;
        background: var(--bt-surface);
      }
      .timeline.paused .bar {
        opacity: 0.45;
      }
      .seg-t {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      .now {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        margin-left: -1px;
        background: var(--primary-text-color);
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 10.5px;
        margin-top: 4px;
      }
      .list {
        display: flex;
        flex-direction: column;
        margin: -4px -4px -8px;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 46px;
        padding: 0 4px;
        border-top: 1px solid var(--divider-color);
        text-align: left;
        width: 100%;
        font-size: 14px;
      }
      .row:disabled {
        cursor: default;
        opacity: 1;
      }
      .row > ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-muted);
      }
      .row-label {
        flex: 1;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .row-value {
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }
      .row .chev {
        --mdc-icon-size: 18px;
        margin-left: -6px;
      }
      .row.open .row-label {
        color: var(--primary-text-color);
      }
      .detail {
        padding: 2px 4px 12px 36px;
      }
      .low {
        color: var(--error-color, #db4437);
        font-weight: 500;
      }
      .bat-chip {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        min-height: 28px;
        padding: 0 8px 0 4px;
        border-radius: 14px;
        font-size: 12.5px;
        font-variant-numeric: tabular-nums;
        color: var(--bt-muted);
        flex: none;
        white-space: nowrap;
      }
      .bat-chip:hover,
      .bat-chip[aria-expanded="true"] {
        background: var(--bt-surface);
      }
      .bat-chip ha-icon {
        --mdc-icon-size: 18px;
      }
      .bat-chip.low {
        color: var(--error-color, #db4437);
        font-weight: 500;
      }
      .bat-line {
        display: flex;
        justify-content: flex-end;
        margin-bottom: -10px;
      }
      .bat-panel {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 6px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .bat {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 38px;
        padding: 0 6px 0 8px;
        border-radius: 10px;
        font-size: 14px;
        text-align: left;
        width: 100%;
      }
      .bat:hover:not(:disabled) {
        background: var(--card-background-color, #fff);
      }
      .bat:disabled {
        opacity: 1;
        cursor: default;
      }
      .bat-val {
        font-variant-numeric: tabular-nums;
      }
      .bat .go {
        --mdc-icon-size: 18px;
        color: var(--bt-muted);
      }
      .bat ha-icon {
        --mdc-icon-size: 18px;
        color: var(--bt-muted);
      }
      .bat.low,
      .bat.low ha-icon {
        color: var(--error-color, #db4437);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .prio {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .prio-row {
        display: grid;
        grid-template-columns: 20px auto 1fr;
        align-items: center;
        gap: 8px;
        padding: 5px 8px;
        border-radius: 9px;
        font-size: 13px;
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
        background: var(--bt-surface);
      }
      .prio-name {
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
        background: var(--bt-surface);
      }
      .prio-row.win .prio-n {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .prio-row.win .prio-name,
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
        gap: 2px;
        align-items: stretch;
      }
      .period {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 4px 4px 10px;
        border-radius: 10px;
      }
      .period.active {
        background: color-mix(in srgb, var(--bt-accent) 12%, transparent);
      }
      .period-text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        padding: 4px 0;
      }
      .period-title {
        font-size: 14px;
        font-weight: 500;
      }
      .period-when {
        font-size: 12px;
      }
      .text-btn.small {
        min-height: 32px;
        font-size: 13px;
        padding: 0 10px;
        align-self: flex-start;
      }
      .period .text-btn.small {
        align-self: center;
      }
      .plan {
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding-left: 6px;
      }
      .plan ha-icon {
        --mdc-icon-size: 18px;
      }
      /* Compact: small square wall displays */
      ha-card.compact {
        padding: 12px;
        gap: 12px;
        justify-content: space-between;
      }
      ha-card.compact .big {
        font-size: 44px;
      }
      ha-card.compact .ctl .round {
        width: 52px;
        height: 52px;
        font-size: 26px;
      }
      ha-card.compact .tv {
        font-size: 28px;
      }
      ha-card.compact .seg button {
        min-height: 44px;
      }
    `,
  ];
}
