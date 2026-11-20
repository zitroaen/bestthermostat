import { LitElement, css, html, nothing } from "lit";
import type { HomeAssistant, PeriodData, RoomData, ScheduleData, Snapshot } from "./api";
import { ws } from "./api";
import "./room-picker";
import { dialogFrame, shared } from "./styles";
import { fmtTemp, strings, define } from "./utils";

type What = { kind: "schedule"; id: string } | { kind: "mode"; mode: "auto" | "heat" | "off" };

/** `YYYY-MM-DDTHH:MM` in local time, as used by <input type="datetime-local">. */
function localInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function roundedHour(offsetHours: number): Date {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + offsetHours);
  return d;
}

export class BtPeriodDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    room: { attribute: false },
    period: { attribute: false },
    snap: { attribute: false },
    _what: { state: true },
    _rooms: { state: true },
    _scope: { state: true },
    _temp: { state: true },
    _startNow: { state: true },
    _start: { state: true },
    _openEnd: { state: true },
    _end: { state: true },
    _title: { state: true },
    _error: { state: true },
    _busy: { state: true },
  };

  hass?: HomeAssistant;
  /** The room; without a room the period is planned for several rooms (``_rooms``). */
  room?: RoomData;
  period?: PeriodData;
  snap?: Snapshot;
  /** Group mode: selected rooms (entry ids). */
  _rooms: Set<string> = new Set();
  /** Editing a period planned for several rooms: change all of them or only this room. */
  _scope: "group" | "room" = "group";
  private _initialized = false;
  _what?: What;
  _temp = 21;
  _startNow = false;
  _start = localInput(roundedHour(1));
  _openEnd = false;
  _end = localInput(roundedHour(25));
  _title = "";
  _error?: string;
  _busy = false;

  private get _t() {
    return strings(this.hass);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._onKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKey);
  }

  private _onKey = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") this._close();
  };

  private get _group(): boolean {
    return !this.room;
  }

  /** Rooms that share the edited period (planned together). */
  private get _groupRooms(): RoomData[] {
    const group = this.period?.group;
    if (!group || !this.snap) return [];
    return this.snap.rooms.filter((r) => r.periods.some((p) => p.group === group));
  }

  /** Schedules to choose from: the room's (not hidden) or, for several rooms, the global ones. */
  private get _schedules(): ScheduleData[] {
    if (this._group || (this.period?.group && this._scope === "group" && this._groupRooms.length > 1)) {
      return (this.snap?.global_schedules ?? []).map((g) => ({ id: g.id, name: g.name, week: g.week, global: true }));
    }
    return (this.room?.schedules ?? []).filter((s) => !s.hidden || s.id === this.period?.schedule);
  }

  protected willUpdate() {
    if (!this._initialized && this._group && this.snap) {
      this._initialized = true;
      const first = this.snap.global_schedules?.[0];
      this._what = first ? { kind: "schedule", id: first.id } : { kind: "mode", mode: "off" };
      this._temp = 21;
    }
    if (!this._initialized && this.room && this.period) {
      this._initialized = true;
      const p = this.period;
      if (p.schedule) this._what = { kind: "schedule", id: p.schedule };
      else this._what = { kind: "mode", mode: (p.mode ?? "off") as "auto" | "heat" | "off" };
      if (p.temperature != null) this._temp = p.temperature;
      this._startNow = false;
      this._start = localInput(new Date(p.start));
      this._openEnd = !p.end;
      if (p.end) this._end = localInput(new Date(p.end));
      this._title = p.summary ?? "";
    }
    if (!this._what && this.room) {
      const other = this.room.schedules.find((s) => s.id !== this.room!.base_schedule && !s.hidden);
      this._what = other ? { kind: "schedule", id: other.id } : { kind: "mode", mode: "off" };
      this._temp = Math.round((this.room.target_temperature ?? 21) * 2) / 2;
    }
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private get _valid(): string | undefined {
    const t = this._t;
    if (this._group && !this._rooms.size) return t.need_rooms;
    const start = this._startNow ? new Date() : new Date(this._start);
    if (!this._startNow && Number.isNaN(start.getTime())) return t.period_invalid;
    if (!this._openEnd) {
      const end = new Date(this._end);
      if (Number.isNaN(end.getTime()) || end <= start || end <= new Date()) return t.period_invalid;
    }
    return undefined;
  }

  private async _save() {
    if (!this.hass || !this._what) return;
    if (!this.room && !this._group) return;
    const groupEdit = !!this.period?.group && this._scope === "group" && this._groupRooms.length > 1;
    const data: Record<string, unknown> = this.room
      ? groupEdit
        ? { group: this.period!.group }
        : { entry_id: this.room.entry_id }
      : { entry_ids: [...this._rooms] };
    if (this._what.kind === "schedule") data.schedule_id = this._what.id;
    else {
      data.mode = this._what.mode;
      if (this._what.mode === "heat") data.temperature = this._temp;
    }
    const editing = !!this.period;
    if (!this._startNow) data.start = this._start;
    else if (editing) data.start = localInput(new Date());
    if (!this._openEnd) data.end = this._end;
    else if (editing) data.open_end = true;
    if (editing) {
      if (!groupEdit) data.period_id = this.period!.id;
      data.summary = this._title.trim();
    } else if (this._title.trim()) data.summary = this._title.trim();
    const type = editing
      ? groupEdit
        ? "period/update_group"
        : "period/update"
      : this._group
        ? "period/add_group"
        : "period/add";
    this._busy = true;
    this._error = undefined;
    try {
      await ws(this.hass, type, data);
      this._close();
    } catch (err: any) {
      this._error = err?.message ?? String(err);
    } finally {
      this._busy = false;
    }
  }

  private async _delete() {
    if (!this.hass || !this.room || !this.period) return;
    this._busy = true;
    try {
      if (this.period.group && this._scope === "group" && this._groupRooms.length > 1) {
        await ws(this.hass, "period/cancel_group", { group: this.period.group });
      } else {
        await ws(this.hass, "period/cancel", {
          entry_id: this.room.entry_id,
          period_id: this.period.id,
        });
      }
      this._close();
    } catch (err: any) {
      this._error = err?.message ?? String(err);
    } finally {
      this._busy = false;
    }
  }

  private _isWhat(w: What): boolean {
    const cur = this._what;
    if (!cur || cur.kind !== w.kind) return false;
    return cur.kind === "schedule" ? cur.id === (w as any).id : cur.mode === (w as any).mode;
  }

  protected render() {
    if (!this.room && !(this._group && this.snap)) return nothing;
    const t = this._t;
    const room = this.room;
    const invalid = this._valid;
    const groupRooms = this._groupRooms;
    const minT = room?.min_temp ?? this.snap?.limits?.min ?? 4;
    const maxT = room?.max_temp ?? this.snap?.limits?.max ?? 35;
    const modes: ["auto" | "heat" | "off", string][] = [
      ["heat", t.heat],
      ["off", t.off],
    ];
    return html`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <div class="h-title">
            <div class="h-name">${this.period ? t.period_edit : t.period_plan}</div>
            <div class="muted h-sub">${room ? room.name : t.select_rooms}</div>
          </div>
          <button class="round small" @click=${this._close} aria-label=${t.close}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <div class="content">
          ${this._group
            ? html`<section>
                <div class="label">${t.select_rooms}</div>
                <bt-room-picker .hass=${this.hass} .rooms=${this.snap!.rooms} .selected=${this._rooms}
                  @change=${(e: CustomEvent<Set<string>>) => (this._rooms = e.detail)}></bt-room-picker>
              </section>`
            : nothing}
          ${groupRooms.length > 1
            ? html`<section>
                <div class="label">${t.group_scope}</div>
                <div class="chips">
                  <button class="chip" aria-pressed=${this._scope === "group"} @click=${() => (this._scope = "group")}>
                    <ha-icon icon="mdi:home-group"></ha-icon>${t.group_all.replace("{n}", String(groupRooms.length))}
                  </button>
                  <button class="chip" aria-pressed=${this._scope === "room"} @click=${() => (this._scope = "room")}>
                    <ha-icon icon="mdi:home-outline"></ha-icon>${t.group_here}
                  </button>
                </div>
                <div class="muted small">${t.group_rooms}: ${groupRooms.map((r) => r.name).join(", ")}</div>
              </section>`
            : nothing}
          <section>
            <div class="label">${t.period_what}</div>
            <div class="chips">
              ${this._schedules.map(
                (s) => html`<button class="chip" aria-pressed=${this._isWhat({ kind: "schedule", id: s.id })}
                  @click=${() => (this._what = { kind: "schedule", id: s.id })}>
                  <ha-icon icon=${s.global ? "mdi:earth" : "mdi:calendar-clock"}></ha-icon>${s.name}
                </button>`,
              )}
              ${modes.map(
                ([mode, label]) => html`<button class="chip" aria-pressed=${this._isWhat({ kind: "mode", mode })}
                  @click=${() => (this._what = { kind: "mode", mode })}>
                  <ha-icon icon=${mode === "off" ? "mdi:snowflake" : "mdi:hand-back-right"}></ha-icon>${label}
                </button>`,
              )}
            </div>
            ${this._what?.kind === "mode" && this._what.mode === "heat"
              ? html`<div class="temp-row">
                  <button class="round" @click=${() => (this._temp = Math.max(minT, this._temp - 0.5))}>−</button>
                  <span class="temp-val">${fmtTemp(this._temp)}</span>
                  <button class="round" @click=${() => (this._temp = Math.min(maxT, this._temp + 0.5))}>+</button>
                </div>`
              : nothing}
          </section>

          <section>
            <div class="label">${t.period_start}</div>
            <div class="chips">
              <button class="chip" aria-pressed=${this._startNow} @click=${() => (this._startNow = true)}>
                ${t.period_now}
              </button>
              <button class="chip" aria-pressed=${!this._startNow} @click=${() => (this._startNow = false)}>
                ${t.period_at}
              </button>
            </div>
            ${this._startNow
              ? nothing
              : html`<input type="datetime-local" step="900" .value=${this._start}
                  @input=${(e: Event) => (this._start = (e.target as HTMLInputElement).value)} />`}
          </section>

          <section>
            <div class="label">${t.period_end_label}</div>
            <div class="chips">
              <button class="chip" aria-pressed=${this._openEnd} @click=${() => (this._openEnd = true)}>
                ${t.period_open}
              </button>
              <button class="chip" aria-pressed=${!this._openEnd} @click=${() => (this._openEnd = false)}>
                ${t.period_at}
              </button>
            </div>
            ${this._openEnd
              ? nothing
              : html`<input type="datetime-local" step="900" .value=${this._end}
                  @input=${(e: Event) => (this._end = (e.target as HTMLInputElement).value)} />`}
          </section>

          <section>
            <div class="label">${t.period_title} <span class="muted">(${t.optional})</span></div>
            <input type="text" .value=${this._title} placeholder=${t.period_title_hint}
              @input=${(e: Event) => (this._title = (e.target as HTMLInputElement).value)} />
          </section>
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          ${invalid && !this._error ? html`<div class="muted small">${invalid}</div>` : nothing}
        </div>
        <footer>
          ${this.period
            ? html`<button class="text-btn danger" ?disabled=${this._busy} @click=${this._delete}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>${this.period && room?.period?.id === this.period.id ? t.period_end : t.period_delete}
              </button>`
            : nothing}
          <span class="spacer"></span>
          <button class="text-btn" @click=${this._close}>${t.close}</button>
          <button class="primary-btn" ?disabled=${!!invalid || this._busy} @click=${this._save}>
            ${this.period ? t.save : t.period_plan}
          </button>
        </footer>
      </div>
    `;
  }

  static styles = [
    shared,
    dialogFrame,
    css`
      .chip ha-icon,
      .round ha-icon {
        --mdc-icon-size: 18px;
      }
      .round.small {
        width: 36px;
        height: 36px;
      }
      .temp-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
      }
      .temp-val {
        font-size: 26px;
        min-width: 110px;
        text-align: center;
      }
      input[type="datetime-local"] {
        font: inherit;
        color: var(--primary-text-color);
        background: var(--bt-surface);
        border: 1px solid transparent;
        border-radius: 10px;
        padding: 10px;
        color-scheme: light dark;
      }
      .small {
        font-size: 13px;
      }
      .spacer {
        flex: 1;
      }
      .danger {
        color: var(--error-color, #db4437);
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .danger ha-icon {
        --mdc-icon-size: 18px;
      }
    `,
  ];
}

define("bt-period-dialog", BtPeriodDialog);
