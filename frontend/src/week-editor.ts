import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { HomeAssistant, RoomData, SlotData, Snapshot, WeekData } from "./api";
import { DAYS, ws } from "./api";
import { shared } from "./styles";
import {
  DAY_MIN,
  GRID,
  cloneWeek,
  fmtTemp,
  resolveSlot,
  segments,
  slotLabel,
  snap,
  strings,
  tempColor,
  toHHMM,
  toMin,
  weekEqual,
} from "./utils";

interface Sel {
  day: number;
  idx: number;
}

type NameAction = "new" | "rename" | "duplicate";

export class BtWeekEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    snap: { attribute: false },
    room: { attribute: false },
    _sid: { state: true },
    _draft: { state: true },
    _sel: { state: true },
    _copy: { state: true },
    _vars: { state: true },
    _error: { state: true },
    _nameAction: { state: true },
    _busy: { state: true },
  };

  hass?: HomeAssistant;
  snap?: Snapshot;
  room?: RoomData;
  _sid?: string;
  _draft?: WeekData;
  _sel?: Sel;
  _copy?: Set<number>;
  _vars = false;
  _error?: string;
  _nameAction?: NameAction;
  _busy = false;
  private _drag?: { day: number; idx: number; bar: HTMLElement };
  private _newVarName = "";
  private _newVarValue = 20;
  private _nameValue = "";

  private get _t() {
    return strings(this.hass);
  }

  private get _server(): WeekData | undefined {
    return this.room?.schedules.find((s) => s.id === this._sid)?.week;
  }

  private get _dirty(): boolean {
    return !!this._draft && !!this._server && !weekEqual(this._draft, this._server);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._onKey);
    document.documentElement.style.overflow = "hidden";
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKey);
    document.documentElement.style.overflow = "";
  }

  private _onKey = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") this._close();
  };

  protected willUpdate(changed: PropertyValues) {
    if (!this.room) return;
    if (!this._sid) this._sid = this.room.active_schedule;
    if ((changed.has("room") || !this._draft) && this._server && (!this._draft || !this._dirtyAgainst(changed))) {
      this._draft = cloneWeek(this._server);
    }
  }

  /** Keep local edits when the server pushes unrelated updates. */
  private _dirtyAgainst(changed: PropertyValues): boolean {
    const old = changed.get("room") as RoomData | undefined;
    const prev = old?.schedules.find((s) => s.id === this._sid)?.week;
    return !!prev && !!this._draft && !weekEqual(this._draft, prev);
  }

  private _close() {
    if (this._dirty && !confirm(this._t.unsaved)) return;
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async _call<T = unknown>(type: string, data: Record<string, unknown>): Promise<T | undefined> {
    if (!this.hass) return undefined;
    this._busy = true;
    this._error = undefined;
    try {
      return await ws<T>(this.hass, type, data);
    } catch (err: any) {
      this._error = err?.message ?? String(err);
      return undefined;
    } finally {
      this._busy = false;
    }
  }

  // ------------------------------------------------------------ schedules

  private _selectSchedule(id: string) {
    if (id === this._sid) return;
    if (this._dirty && !confirm(this._t.unsaved)) return;
    this._sid = id;
    this._draft = this._server ? cloneWeek(this._server) : undefined;
    this._sel = undefined;
    this._copy = undefined;
  }

  private _startName(action: NameAction) {
    const current = this.room?.schedules.find((s) => s.id === this._sid)?.name ?? "";
    this._nameAction = action;
    this._nameValue = action === "rename" ? current : action === "duplicate" ? `${current} 2` : "";
  }

  private async _submitName() {
    const name = this._nameValue.trim();
    if (!name || !this.room || !this._nameAction) return;
    const entry_id = this.room.entry_id;
    if (this._nameAction === "rename") {
      await this._call("schedule/rename", { entry_id, schedule_id: this._sid, name });
    } else {
      const res = await this._call<{ id: string }>("schedule/create", {
        entry_id,
        name,
        copy_from: this._sid,
      });
      if (res) {
        this._sid = res.id;
        this._draft = undefined;
      }
    }
    if (!this._error) this._nameAction = undefined;
  }

  private async _delete() {
    if (!this.room || !confirm(this._t.confirm_delete)) return;
    const ok = await this._call("schedule/delete", {
      entry_id: this.room.entry_id,
      schedule_id: this._sid,
    });
    if (ok) {
      this._sid = this.room.active_schedule;
      this._draft = undefined;
    }
  }

  private _activate() {
    if (!this.room) return;
    this._call("schedule/activate", { entry_id: this.room.entry_id, schedule_id: this._sid });
  }

  private async _save() {
    if (!this.room || !this._draft) return;
    const ok = await this._call("schedule/save", {
      entry_id: this.room.entry_id,
      schedule_id: this._sid,
      week: this._draft,
    });
    if (ok) this._sel = undefined;
  }

  private _discard() {
    if (this._server) this._draft = cloneWeek(this._server);
    this._sel = undefined;
    this._copy = undefined;
  }

  // --------------------------------------------------------------- edits

  private _mutate(fn: (week: WeekData) => void) {
    if (!this._draft) return;
    const week = cloneWeek(this._draft);
    fn(week);
    this._draft = week;
  }

  private _slot(sel: Sel): SlotData | undefined {
    return this._draft?.[DAYS[sel.day]]?.[sel.idx];
  }

  private _setTemp(delta: number) {
    const sel = this._sel;
    if (!sel) return;
    const vars = this.snap?.variables ?? [];
    this._mutate((w) => {
      const slot = w[DAYS[sel.day]][sel.idx];
      const base = resolveSlot(slot, vars) ?? 20;
      const temperature = Math.min(30, Math.max(5, Math.round((base + delta) * 2) / 2));
      w[DAYS[sel.day]][sel.idx] = { start: slot.start, temperature };
    });
  }

  private _setVariable(id: string | undefined) {
    const sel = this._sel;
    if (!sel) return;
    const vars = this.snap?.variables ?? [];
    this._mutate((w) => {
      const slot = w[DAYS[sel.day]][sel.idx];
      w[DAYS[sel.day]][sel.idx] =
        id === undefined
          ? { start: slot.start, temperature: resolveSlot(slot, vars) ?? 20 }
          : { start: slot.start, variable: id };
    });
  }

  private _split() {
    const sel = this._sel;
    if (!sel || !this._draft) return;
    const seg = segments(this._draft[DAYS[sel.day]])[sel.idx];
    const mid = snap((seg.start + seg.end) / 2);
    if (mid <= seg.start || mid >= seg.end) return;
    this._mutate((w) => {
      const day = w[DAYS[sel.day]];
      day.splice(sel.idx + 1, 0, { ...day[sel.idx], start: toHHMM(mid) });
    });
    this._sel = { day: sel.day, idx: sel.idx + 1 };
  }

  private _remove() {
    const sel = this._sel;
    if (!sel || !this._draft) return;
    const len = this._draft[DAYS[sel.day]].length;
    if (len < 2) return;
    this._mutate((w) => {
      const day = w[DAYS[sel.day]];
      if (sel.idx === 0) {
        day.splice(1, 1, { ...day[1], start: "00:00" });
        day.splice(0, 1);
      } else {
        day.splice(sel.idx, 1);
      }
    });
    this._sel = { day: sel.day, idx: Math.max(0, sel.idx - 1) };
  }

  private _toggleCopy(day: number) {
    const next = new Set(this._copy);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    this._copy = next;
  }

  private _applyCopy() {
    const sel = this._sel;
    if (!sel || !this._copy) return;
    const targets = [...this._copy].filter((d) => d !== sel.day);
    this._mutate((w) => {
      for (const d of targets) w[DAYS[d]] = JSON.parse(JSON.stringify(w[DAYS[sel.day]]));
    });
    this._copy = undefined;
  }

  // ---------------------------------------------------------------- drag

  private _dragStart(ev: PointerEvent, day: number, idx: number) {
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget as HTMLElement;
    handle.setPointerCapture(ev.pointerId);
    this._drag = { day, idx, bar: handle.parentElement as HTMLElement };
  }

  private _dragMove(ev: PointerEvent) {
    const drag = this._drag;
    if (!drag || !this._draft) return;
    const rect = drag.bar.getBoundingClientRect();
    const raw = ((ev.clientX - rect.left) / rect.width) * DAY_MIN;
    const day = this._draft[DAYS[drag.day]];
    const low = toMin(day[drag.idx - 1].start) + GRID;
    const high = (drag.idx + 1 < day.length ? toMin(day[drag.idx + 1].start) : DAY_MIN) - GRID;
    const value = toHHMM(Math.min(high, Math.max(low, snap(raw))));
    if (value === day[drag.idx].start) return;
    this._mutate((w) => {
      w[DAYS[drag.day]][drag.idx] = { ...w[DAYS[drag.day]][drag.idx], start: value };
    });
  }

  private _dragEnd() {
    this._drag = undefined;
  }

  // ----------------------------------------------------------- variables

  private _varStep(id: string, value: number, delta: number) {
    const next = Math.min(30, Math.max(5, Math.round((value + delta) * 2) / 2));
    this._call("variable/update", { variable_id: id, value: next });
  }

  private async _addVar() {
    const name = this._newVarName.trim();
    if (!name) return;
    const res = await this._call("variable/create", { name, value: this._newVarValue });
    if (res) {
      this._newVarName = "";
      this.requestUpdate();
    }
  }

  private _deleteVar(id: string) {
    this._call("variable/delete", { variable_id: id });
  }

  // -------------------------------------------------------------- render

  protected render() {
    if (!this.room || !this._draft) return nothing;
    const t = this._t;
    const room = this.room;
    const current = room.schedules.find((s) => s.id === this._sid);
    return html`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <button class="round small" @click=${this._close} aria-label=${t.close}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <div class="h-title">
            <div class="h-name">${room.name}</div>
            <div class="muted h-sub">${t.schedules}</div>
          </div>
          <button class="chip" aria-pressed=${this._vars} @click=${() => (this._vars = !this._vars)}>
            <ha-icon icon="mdi:variable"></ha-icon>${t.variables}
          </button>
        </header>

        <div class="content">
          <div class="chips scroll">
            ${room.schedules.map(
              (s) => html`<button class="chip" aria-pressed=${s.id === this._sid}
                @click=${() => this._selectSchedule(s.id)}>
                ${s.id === room.active_schedule ? html`<ha-icon icon="mdi:check-circle"></ha-icon>` : nothing}
                ${s.name}
              </button>`,
            )}
            <button class="chip" @click=${() => this._startName("new")} aria-label=${t.new_schedule}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          <div class="chips actions">
            ${current?.id !== room.active_schedule
              ? html`<button class="text-btn" @click=${this._activate}>${t.activate}</button>`
              : html`<span class="badge">${t.active}</span>`}
            <button class="text-btn" @click=${() => this._startName("rename")}>${t.rename}</button>
            <button class="text-btn" @click=${() => this._startName("duplicate")}>${t.duplicate}</button>
            <button class="text-btn" ?disabled=${current?.id === room.active_schedule}
              @click=${this._delete}>${t.delete}</button>
          </div>

          ${this._nameAction ? this._renderNameInput() : nothing}
          ${this._vars ? this._renderVariables() : nothing}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0, 3, 6, 9, 12, 15, 18, 21, 24].map(
                (h) => html`<span style="left:${(h / 24) * 100}%">${h}</span>`,
              )}</div>
            </div>
            ${DAYS.map((key, d) => this._renderDay(key, d))}
          </div>
          <div class="muted hint">${t.tap_hint}</div>
          ${this._sel ? this._renderSlotPanel(this._sel) : nothing}
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        </div>

        <footer>
          <button class="text-btn close-btn" @click=${this._close}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>${t.close}
          </button>
          <span class="spacer"></span>
          <button class="text-btn" ?disabled=${!this._dirty || this._busy} @click=${this._discard}>
            ${t.discard}
          </button>
          <button class="primary-btn" ?disabled=${!this._dirty || this._busy} @click=${this._save}>
            ${t.save}
          </button>
        </footer>
      </div>
    `;
  }

  private _renderNameInput() {
    const t = this._t;
    const label =
      this._nameAction === "rename" ? t.rename : this._nameAction === "duplicate" ? t.duplicate : t.new_schedule;
    return html`<div class="panel name-panel">
      <input type="text" .value=${this._nameValue} placeholder=${label} aria-label=${label}
        @input=${(e: Event) => (this._nameValue = (e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._submitName()} />
      <button class="text-btn" @click=${() => (this._nameAction = undefined)}>${t.close}</button>
      <button class="primary-btn" @click=${this._submitName}>${label}</button>
    </div>`;
  }

  private _renderVariables() {
    const t = this._t;
    const vars = this.snap?.variables ?? [];
    return html`<div class="panel vars">
      <div class="muted small-text">${t.variables_note}</div>
      ${vars.map(
        (v) => html`<div class="var-row">
          <span class="swatch" style="background:${tempColor(v.value)}"></span>
          <span class="var-name">${v.name}</span>
          <button class="round small" @click=${() => this._varStep(v.id, v.value, -0.5)}>−</button>
          <span class="var-val">${fmtTemp(v.value)}</span>
          <button class="round small" @click=${() => this._varStep(v.id, v.value, 0.5)}>+</button>
          <button class="round small" @click=${() => this._deleteVar(v.id)} aria-label=${t.delete}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>`,
      )}
      <div class="var-row">
        <input type="text" placeholder=${t.name} .value=${this._newVarName}
          @input=${(e: Event) => (this._newVarName = (e.target as HTMLInputElement).value)} />
        <input type="number" class="num" min="5" max="30" step="0.5" .value=${String(this._newVarValue)}
          @input=${(e: Event) => (this._newVarValue = Number((e.target as HTMLInputElement).value))} />
        <button class="primary-btn" @click=${this._addVar}>${t.add_variable}</button>
      </div>
    </div>`;
  }

  private _renderDay(key: string, d: number) {
    const vars = this.snap?.variables ?? [];
    const segs = segments(this._draft![key]);
    const copying = this._copy !== undefined;
    return html`<div class="day ${this._sel?.day === d ? "active" : ""}">
      <span class="day-label">${this._t.days[d]}</span>
      <div class="bar" @pointermove=${this._dragMove} @pointerup=${this._dragEnd}
        @pointercancel=${this._dragEnd}>
        ${segs.map((s, i) => {
          const temp = resolveSlot(s.slot, vars);
          const w = ((s.end - s.start) / DAY_MIN) * 100;
          const selected = this._sel?.day === d && this._sel.idx === i;
          return html`<button class="seg ${selected ? "selected" : ""} ${s.slot.variable ? "var" : ""}"
            style="left:${(s.start / DAY_MIN) * 100}%;width:${w}%;background:${tempColor(temp)}"
            title="${toHHMM(s.start)}–${toHHMM(s.end % DAY_MIN)} · ${slotLabel(s.slot, vars)}"
            @click=${() => {
              this._sel = { day: d, idx: i };
              if (!copying) this._copy = undefined;
            }}>
            ${w > 7 ? html`<span>${s.slot.variable ? slotLabel(s.slot, vars) : fmtTemp(temp, false)}</span>` : nothing}
          </button>`;
        })}
        ${segs.slice(1).map(
          (s, i) => html`<div class="handle" style="left:${(s.start / DAY_MIN) * 100}%"
            @pointerdown=${(e: PointerEvent) => this._dragStart(e, d, i + 1)}><span></span></div>`,
        )}
      </div>
    </div>`;
  }

  private _renderSlotPanel(sel: Sel) {
    const t = this._t;
    const vars = this.snap?.variables ?? [];
    const slot = this._slot(sel);
    if (!slot) return nothing;
    const seg = segments(this._draft![DAYS[sel.day]])[sel.idx];
    const temp = resolveSlot(slot, vars);
    const dayLen = this._draft![DAYS[sel.day]].length;
    return html`<div class="panel">
      <div class="panel-head">
        <span class="swatch" style="background:${tempColor(temp)}"></span>
        <strong>${t.days[sel.day]} ${toHHMM(seg.start)}–${toHHMM(seg.end === DAY_MIN ? 0 : seg.end)}</strong>
        <span class="spacer"></span>
        <button class="round small" @click=${() => (this._sel = undefined)} aria-label=${t.close}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="temp-row">
        <button class="round" @click=${() => this._setTemp(-0.5)}>−</button>
        <span class="temp-val">${fmtTemp(temp)}</span>
        <button class="round" @click=${() => this._setTemp(0.5)}>+</button>
      </div>
      <div class="chips">
        <button class="chip" aria-pressed=${slot.variable === undefined}
          @click=${() => this._setVariable(undefined)}>${t.fixed}</button>
        ${vars.map(
          (v) => html`<button class="chip" aria-pressed=${slot.variable === v.id}
            @click=${() => this._setVariable(v.id)}>${v.name} · ${fmtTemp(v.value)}</button>`,
        )}
      </div>
      <div class="chips actions">
        <button class="text-btn" ?disabled=${seg.end - seg.start < 2 * GRID} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${t.split}
        </button>
        <button class="text-btn" ?disabled=${dayLen < 2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
        </button>
        <button class="text-btn" @click=${() => (this._copy = this._copy ? undefined : new Set())}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t.copy_day}
        </button>
      </div>
      ${this._copy
        ? html`<div class="chips">
            ${t.days.map(
              (label, d) => html`<button class="chip" ?disabled=${d === sel.day}
                aria-pressed=${this._copy!.has(d)} @click=${() => this._toggleCopy(d)}>${label}</button>`,
            )}
            <button class="chip" @click=${() => (this._copy = new Set([0, 1, 2, 3, 4]))}>${t.workdays}</button>
            <button class="chip" @click=${() => (this._copy = new Set([0, 1, 2, 3, 4, 5, 6]))}>${t.all_days}</button>
            <button class="primary-btn" ?disabled=${![...this._copy].some((d) => d !== sel.day)}
              @click=${this._applyCopy}>${t.copy}</button>
          </div>`
        : nothing}
    </div>`;
  }

  static styles = [
    shared,
    css`
      :host {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-text-color);
      }
      .backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
      }
      .dialog {
        position: relative;
        display: flex;
        flex-direction: column;
        width: min(900px, 100vw);
        height: min(820px, 100dvh);
        background: var(--card-background-color, var(--primary-background-color));
        border-radius: var(--bt-radius);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }
      @media (max-width: 600px) {
        .dialog {
          width: 100vw;
          height: 100dvh;
          border-radius: 0;
        }
      }
      header,
      footer {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
      }
      header {
        border-bottom: 1px solid var(--divider-color);
        padding-top: max(12px, env(safe-area-inset-top));
      }
      header,
      footer,
      .content {
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
      }
      footer {
        justify-content: flex-end;
        border-top: 1px solid var(--divider-color);
        padding-bottom: max(12px, env(safe-area-inset-bottom));
      }
      .h-title {
        flex: 1;
        min-width: 0;
      }
      .h-name {
        font-weight: 600;
        font-size: 17px;
      }
      .h-sub {
        font-size: 13px;
      }
      .content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .content > * {
        flex-shrink: 0;
      }
      .round.small {
        width: 36px;
        height: 36px;
        font-size: 20px;
      }
      .round ha-icon,
      .chip ha-icon,
      .text-btn ha-icon {
        --mdc-icon-size: 18px;
      }
      .text-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .actions {
        gap: 0;
        margin: -8px -8px 0;
        align-items: center;
      }
      .badge {
        padding: 0 14px;
        font-size: 13px;
        color: var(--bt-muted);
      }
      .week {
        display: flex;
        flex-direction: column;
        gap: 8px;
        user-select: none;
        -webkit-user-select: none;
      }
      .ruler,
      .day {
        display: grid;
        grid-template-columns: 34px 1fr;
        gap: 8px;
        align-items: center;
      }
      .ruler > div {
        position: relative;
        height: 14px;
        font-size: 11px;
      }
      .ruler > div span {
        position: absolute;
        transform: translateX(-50%);
      }
      .ruler > div span:first-child {
        transform: none;
      }
      .ruler > div span:last-child {
        transform: translateX(-100%);
      }
      .day-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--bt-muted);
      }
      .day.active .day-label {
        color: var(--bt-accent);
      }
      .bar {
        position: relative;
        height: 44px;
        border-radius: 10px;
        background: var(--bt-surface);
        touch-action: pan-y;
      }
      .seg {
        position: absolute;
        top: 0;
        bottom: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 12px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.72);
        border-right: 1px solid var(--card-background-color, #fff);
        box-sizing: border-box;
      }
      .seg:first-of-type {
        border-radius: 10px 0 0 10px;
      }
      .seg:last-of-type {
        border-radius: 0 10px 10px 0;
        border-right: none;
      }
      .seg span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 4px;
      }
      .seg.var span {
        font-style: italic;
      }
      .seg.selected {
        box-shadow: inset 0 0 0 3px var(--primary-text-color);
        z-index: 1;
      }
      .handle {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 28px;
        margin-left: -14px;
        z-index: 2;
        cursor: ew-resize;
        touch-action: none;
        display: flex;
        justify-content: center;
      }
      .handle span {
        width: 4px;
        height: 100%;
        border-radius: 2px;
        background: var(--primary-text-color);
        opacity: 0.55;
      }
      .handle:hover span,
      .handle:active span {
        opacity: 1;
      }
      .hint,
      .small-text {
        font-size: 12px;
      }
      .panel {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 14px;
        border-radius: var(--bt-radius);
        background: var(--bt-surface);
      }
      .panel .chip {
        background: var(--card-background-color, #fff);
      }
      .panel .chip[aria-pressed="true"] {
        background: var(--bt-accent);
      }
      .panel .round {
        background: var(--card-background-color, #fff);
      }
      .panel-head {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .spacer {
        flex: 1;
      }
      .swatch {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        flex: none;
      }
      .temp-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
      }
      .temp-val {
        font-size: 28px;
        min-width: 110px;
        text-align: center;
      }
      .name-panel {
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }
      .name-panel input {
        flex: 1;
        min-width: 160px;
      }
      .var-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .var-name {
        flex: 1;
        min-width: 80px;
        font-weight: 500;
      }
      .var-val {
        min-width: 64px;
        text-align: center;
      }
      .var-row input[type="text"] {
        flex: 1;
        min-width: 120px;
      }
      .var-row input.num {
        width: 90px;
      }
    `,
  ];
}

customElements.define("bt-week-editor", BtWeekEditor);
