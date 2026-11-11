import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { HomeAssistant, RoomData, SlotData, Snapshot, WeekData } from "./api";
import { DAYS, ws } from "./api";
import { shared } from "./styles";
import {
  DAY_MIN,
  nowMinutes,
  todayKey,
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
  define,
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
    _drag: { state: true },
    _menu: { state: true },
    _copyRooms: { state: true },
    _info: { state: true },
  };

  hass?: HomeAssistant;
  snap?: Snapshot;
  room?: RoomData;
  _sid?: string;
  _draft?: WeekData;
  _sel?: Sel;
  _copy?: Set<number>;
  _vars = false;
  _menu = false;
  _copyRooms?: Set<string>;
  _info?: string;
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
    this._sel = undefined;
    this._vars = false;
    this._error = undefined;
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
    try {
      handle.setPointerCapture(ev.pointerId);
    } catch {
      // not supported everywhere – window listeners below still work
    }
    this._drag = { day, idx, bar: handle.parentElement as HTMLElement };
    // Track the pointer on the whole window so the drag never gets lost when
    // the pointer leaves the bar (mouse/trackpad, Safari, Firefox).
    window.addEventListener("pointermove", this._onWindowMove);
    window.addEventListener("pointerup", this._onWindowUp);
    window.addEventListener("pointercancel", this._onWindowUp);
  }

  private _onWindowMove = (ev: PointerEvent) => {
    if (this._drag) {
      ev.preventDefault();
      this._dragMove(ev);
    }
  };

  private _onWindowUp = () => {
    this._dragEnd();
    window.removeEventListener("pointermove", this._onWindowMove);
    window.removeEventListener("pointerup", this._onWindowUp);
    window.removeEventListener("pointercancel", this._onWindowUp);
  };

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

  // ----------------------------------------------------------- slot times

  /** Move the start (or end) of the selected block by ``delta`` minutes. */
  private _shift(which: "start" | "end", delta: number) {
    const sel = this._sel;
    if (!sel || !this._draft) return;
    const day = this._draft[DAYS[sel.day]];
    const idx = which === "start" ? sel.idx : sel.idx + 1;
    if (idx <= 0 || idx >= day.length) return;
    const low = toMin(day[idx - 1].start) + GRID;
    const high = (idx + 1 < day.length ? toMin(day[idx + 1].start) : DAY_MIN) - GRID;
    const value = Math.min(high, Math.max(low, toMin(day[idx].start) + delta));
    if (toHHMM(value) === day[idx].start) return;
    this._mutate((w) => {
      w[DAYS[sel.day]][idx] = { ...w[DAYS[sel.day]][idx], start: toHHMM(value) };
    });
  }

  private _select(day: number, idx: number) {
    this._sel = { day, idx };
    this._copy = undefined;
    this._menu = false;
  }

  // -------------------------------------------------------------- render

  protected render() {
    if (!this.room || !this._draft) return nothing;
    const t = this._t;
    const room = this.room;
    const current = room.schedules.find((s) => s.id === this._sid);
    const inEffect = current?.id === room.active_schedule;
    const sheetOpen = !!this._sel || this._vars || !!this._nameAction || !!this._copyRooms;
    return html`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <button class="icon-btn" @click=${this._close} aria-label=${t.close}>
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <div class="h-title">
            <div class="h-name">${t.week_plan}</div>
            <div class="muted h-sub">${room.name}</div>
          </div>
          <button class="icon-btn" aria-label=${t.more} @click=${() => (this._menu = !this._menu)}>
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
          ${this._menu ? this._renderMenu(room) : nothing}
        </header>

        <div class="content ${sheetOpen ? "sheet-open" : ""} ${this._dirty ? "dirty" : ""}"
          @click=${() => (this._menu = false)}>
          <div class="seg" role="tablist">
            ${room.schedules.map(
              (s) => html`<button role="tab" aria-selected=${s.id === this._sid}
                @click=${() => this._selectSchedule(s.id)}>
                ${s.name}${s.id === room.active_schedule ? html`<i class="active-dot"></i>` : nothing}
              </button>`,
            )}
            <button class="plus" aria-label=${t.new_schedule} @click=${() => this._startName("new")}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          ${current && !inEffect
            ? html`<div class="notice">
                <span>${t.not_active}</span>
                <button class="text-btn" @click=${this._activate}>${t.activate}</button>
              </div>`
            : nothing}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0, 6, 12, 18, 24].map((h) => html`<span style="left:${(h / 24) * 100}%">${h}</span>`)}</div>
            </div>
            ${DAYS.map((key, d) => this._renderDay(key, d))}
          </div>
          ${this._renderLegend()}
          <div class="muted hint">${t.tap_hint}</div>
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        </div>

        ${this._sel ? this._renderSlotSheet(this._sel) : nothing}
        ${this._vars ? this._renderVariablesSheet() : nothing}
        ${this._nameAction ? this._renderNameSheet() : nothing}
        ${this._copyRooms ? this._renderCopyRoomsSheet() : nothing}

        ${this._dirty && !sheetOpen
          ? html`<div class="savebar">
              <span class="grow">${t.unsaved_short}</span>
              <button class="text-btn light" ?disabled=${this._busy} @click=${this._discard}>
                ${t.discard}
              </button>
              <button class="primary-btn" ?disabled=${this._busy} @click=${this._save}>${t.save}</button>
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderMenu(room: RoomData) {
    const t = this._t;
    const canDelete = this._sid !== room.base_schedule && room.schedules.length > 1;
    const item = (icon: string, label: string, fn: () => void, cls = "", disabled = false) =>
      html`<button class="menu-item ${cls}" ?disabled=${disabled} @click=${() => {
        this._menu = false;
        fn();
      }}><ha-icon icon=${icon}></ha-icon>${label}</button>`;
    return html`<div class="menu" role="menu">
      ${item("mdi:pencil-outline", t.rename, () => this._startName("rename"))}
      ${item("mdi:content-copy", t.duplicate, () => this._startName("duplicate"))}
      ${item("mdi:home-export-outline", t.copy_to_rooms, () => {
        this._sel = undefined;
        this._vars = false;
        this._info = undefined;
        this._copyRooms = new Set();
      }, "", (this.snap?.rooms.length ?? 0) < 2)}
      ${item("mdi:thermometer-lines", t.manage_variables, () => {
        this._sel = undefined;
        this._vars = true;
      })}
      <div class="menu-sep"></div>
      ${item("mdi:delete-outline", t.delete_schedule, () => this._delete(), "danger", !canDelete)}
    </div>`;
  }

  private _renderLegend() {
    const t = this._t;
    const vars = this.snap?.variables ?? [];
    const used = new Set<string>();
    for (const day of Object.values(this._draft ?? {}))
      for (const slot of day) if (slot.variable) used.add(slot.variable);
    const shown = vars.filter((v) => used.has(v.id));
    return html`<div class="legend">
      ${(shown.length ? shown : vars).map(
        (v) => html`<span><i class="sw" style="background:${tempColor(v.value)}"></i>${v.name}
          <b>${fmtTemp(v.value, false)}°</b></span>`,
      )}
      <button class="text-btn small" @click=${() => {
        this._sel = undefined;
        this._vars = true;
      }}>${t.edit_short}</button>
    </div>`;
  }

  private _renderDay(key: string, d: number) {
    const vars = this.snap?.variables ?? [];
    const segs = segments(this._draft![key]);
    const today = key === todayKey();
    return html`<div class="day ${this._sel?.day === d ? "active" : ""}">
      <span class="day-label ${today ? "today" : ""}">${this._t.days[d]}</span>
      <div class="bar">
        ${segs.map((s, i) => {
          const temp = resolveSlot(s.slot, vars);
          const w = ((s.end - s.start) / DAY_MIN) * 100;
          const selected = this._sel?.day === d && this._sel.idx === i;
          return html`<button class="seg-b ${selected ? "selected" : ""} ${s.slot.variable ? "var" : ""}"
            style="left:${(s.start / DAY_MIN) * 100}%;width:${w}%;background:${tempColor(temp)}"
            title="${toHHMM(s.start)}–${toHHMM(s.end % DAY_MIN)} · ${slotLabel(s.slot, vars)}"
            @click=${(e: Event) => {
              e.stopPropagation();
              this._select(d, i);
            }}>
            ${w > 8 ? html`<span>${s.slot.variable ? slotLabel(s.slot, vars) : `${fmtTemp(temp, false)}°`}</span>` : nothing}
          </button>`;
        })}
        <div class="hours"></div>
        ${today ? html`<div class="now" style="left:${(nowMinutes() / DAY_MIN) * 100}%"></div>` : nothing}
        ${segs.slice(1).map((s, i) => {
          const dragging = this._drag?.day === d && this._drag.idx === i + 1;
          return html`<div class="handle ${dragging ? "dragging" : ""}"
            style="left:${(s.start / DAY_MIN) * 100}%"
            @pointerdown=${(e: PointerEvent) => this._dragStart(e, d, i + 1)}>
            <span></span><i class="knob"></i>
            ${dragging ? html`<div class="time-tip">${toHHMM(s.start)}</div>` : nothing}
          </div>`;
        })}
      </div>
    </div>`;
  }

  private _sheet(title: string, body: unknown, onClose: () => void) {
    return html`<div class="scrim" @click=${onClose}></div>
      <div class="sheet" role="dialog">
        <div class="grab"></div>
        <div class="sheet-head">
          <span class="sheet-title">${title}</span>
          <button class="icon-btn small" aria-label=${this._t.close} @click=${onClose}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${body}
      </div>`;
  }

  private _renderSlotSheet(sel: Sel) {
    const t = this._t;
    const vars = this.snap?.variables ?? [];
    const slot = this._slot(sel);
    if (!slot) return nothing;
    const day = this._draft![DAYS[sel.day]];
    const seg = segments(day)[sel.idx];
    const temp = resolveSlot(slot, vars);
    const time = (label: string, value: string, which: "start" | "end", enabled: boolean) =>
      html`<div class="time ${enabled ? "" : "fixed"}">
        <div><small>${label}</small><b>${value}</b></div>
        ${enabled
          ? html`<div class="st">
              <button class="round tiny" @click=${() => this._shift(which, -GRID)}>−</button>
              <button class="round tiny" @click=${() => this._shift(which, GRID)}>+</button>
            </div>`
          : nothing}
      </div>`;
    const body = html`
      <div class="times">
        ${time(t.from, toHHMM(seg.start), "start", sel.idx > 0)}
        ${time(t.to, seg.end === DAY_MIN ? "24:00" : toHHMM(seg.end), "end", sel.idx + 1 < day.length)}
      </div>
      <div class="chips">
        <button class="chip" aria-pressed=${slot.variable === undefined}
          @click=${() => this._setVariable(undefined)}>${t.fixed}</button>
        ${vars.map(
          (v) => html`<button class="chip" aria-pressed=${slot.variable === v.id}
            @click=${() => this._setVariable(v.id)}>
            <i class="sw" style="background:${tempColor(v.value)}"></i>${v.name}
          </button>`,
        )}
      </div>
      <div class="temp-row">
        <button class="round" @click=${() => this._setTemp(-0.5)}>−</button>
        <span class="temp-val">${fmtTemp(temp)}</span>
        <button class="round" @click=${() => this._setTemp(0.5)}>+</button>
      </div>
      ${this._copy
        ? html`<div class="copy">
            <div class="muted small-text">${t.copy_day}</div>
            <div class="chips">
              ${t.days.map(
                (label, d) => html`<button class="chip" ?disabled=${d === sel.day}
                  aria-pressed=${this._copy!.has(d)} @click=${() => this._toggleCopy(d)}>${label}</button>`,
              )}
            </div>
            <div class="chips">
              <button class="chip" @click=${() => (this._copy = new Set([0, 1, 2, 3, 4]))}>${t.workdays}</button>
              <button class="chip" @click=${() => (this._copy = new Set([5, 6]))}>${t.weekend}</button>
              <button class="chip" @click=${() => (this._copy = new Set([0, 1, 2, 3, 4, 5, 6]))}>${t.all_days}</button>
              <span class="grow"></span>
              <button class="primary-btn" ?disabled=${![...this._copy].some((d) => d !== sel.day)}
                @click=${this._applyCopy}>${t.copy}</button>
            </div>
          </div>`
        : nothing}
      <div class="acts">
        <button ?disabled=${seg.end - seg.start < 2 * GRID} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${t.split}
        </button>
        <button aria-pressed=${!!this._copy} @click=${() => (this._copy = this._copy ? undefined : new Set())}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t.copy_day_short}
        </button>
        <button ?disabled=${day.length < 2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
        </button>
      </div>`;
    return this._sheet(t.days_long[sel.day], body, () => {
      this._sel = undefined;
      this._copy = undefined;
    });
  }

  private _renderVariablesSheet() {
    const t = this._t;
    const vars = this.snap?.variables ?? [];
    const body = html`
      <div class="var-list">
        ${vars.map(
          (v) => html`<div class="var-row">
            <i class="sw" style="background:${tempColor(v.value)}"></i>
            <span class="grow">${v.name}</span>
            <button class="round tiny" @click=${() => this._varStep(v.id, v.value, -0.5)}>−</button>
            <span class="var-val">${fmtTemp(v.value)}</span>
            <button class="round tiny" @click=${() => this._varStep(v.id, v.value, 0.5)}>+</button>
            <button class="icon-btn small" aria-label=${t.delete} @click=${() => this._deleteVar(v.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>`,
        )}
      </div>
      <div class="var-add">
        <input type="text" placeholder=${t.name} .value=${this._newVarName}
          @input=${(e: Event) => (this._newVarName = (e.target as HTMLInputElement).value)} />
        <input type="number" class="num" min="5" max="30" step="0.5" .value=${String(this._newVarValue)}
          @input=${(e: Event) => (this._newVarValue = Number((e.target as HTMLInputElement).value))} />
        <button class="primary-btn" @click=${this._addVar}>${t.add}</button>
      </div>
      <div class="muted small-text">${t.variables_note}</div>
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}`;
    return this._sheet(t.variables, body, () => (this._vars = false));
  }

  private async _copyToRooms() {
    if (!this.room || !this._copyRooms?.size) return;
    if (this._dirty && !confirm(this._t.copy_unsaved)) return;
    const res = await this._call<{ created: string[]; replaced: string[] }>("schedule/copy_to_rooms", {
      entry_id: this.room.entry_id,
      schedule_id: this._sid,
      targets: [...this._copyRooms],
    });
    if (res) {
      const names = [...(res.created ?? []), ...(res.replaced ?? [])].join(", ");
      this._info = `${this._t.copied_to} ${names}`;
      this._copyRooms = new Set();
    }
  }

  private _renderCopyRoomsSheet() {
    const t = this._t;
    const name = this.room?.schedules.find((s) => s.id === this._sid)?.name ?? "";
    const rooms = (this.snap?.rooms ?? []).filter((r) => r.entry_id !== this.room?.entry_id);
    const toggle = (id: string) => {
      const next = new Set(this._copyRooms);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      this._copyRooms = next;
    };
    const body = html`
      <div class="muted small-text">${t.copy_rooms_hint.replace("{name}", name)}</div>
      <div class="room-list">
        ${rooms.map((r) => {
          const on = this._copyRooms!.has(r.entry_id);
          const exists = r.schedules.some((s) => s.name.toLowerCase() === name.toLowerCase());
          return html`<button class="room-pick ${on ? "on" : ""}" @click=${() => toggle(r.entry_id)}>
            <ha-icon icon=${on ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}></ha-icon>
            <span class="grow">${r.name}${r.floor ? html` <span class="muted">· ${r.floor.name}</span>` : nothing}</span>
            <span class="muted small-text">${exists ? t.will_replace : t.will_create}</span>
          </button>`;
        })}
      </div>
      ${this._info ? html`<div class="info">${this._info}</div>` : nothing}
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      <div class="sheet-actions">
        <button class="text-btn" @click=${() => (this._copyRooms = new Set(rooms.map((r) => r.entry_id)))}>
          ${t.all_rooms}
        </button>
        <span class="grow"></span>
        <button class="primary-btn" ?disabled=${!this._copyRooms!.size || this._busy} @click=${this._copyToRooms}>
          ${t.copy}
        </button>
      </div>`;
    return this._sheet(`${t.copy_to_rooms}: ${name}`, body, () => {
      this._copyRooms = undefined;
      this._info = undefined;
    });
  }

  private _renderNameSheet() {
    const t = this._t;
    const label =
      this._nameAction === "rename" ? t.rename : this._nameAction === "duplicate" ? t.duplicate : t.new_schedule;
    const body = html`
      <input type="text" .value=${this._nameValue} placeholder=${t.name} aria-label=${label}
        @input=${(e: Event) => (this._nameValue = (e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._submitName()} />
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      <div class="sheet-actions">
        <button class="text-btn" @click=${() => (this._nameAction = undefined)}>${t.cancel}</button>
        <button class="primary-btn" ?disabled=${!this._nameValue.trim() || this._busy} @click=${this._submitName}>
          ${t.ok}
        </button>
      </div>`;
    return this._sheet(label, body, () => (this._nameAction = undefined));
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
        width: min(760px, 100vw);
        height: min(860px, 100dvh);
        background: var(--card-background-color, var(--primary-background-color));
        border-radius: 24px;
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
      header {
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 10px 8px 6px;
        padding-top: max(10px, env(safe-area-inset-top));
        padding-left: max(8px, env(safe-area-inset-left));
        padding-right: max(8px, env(safe-area-inset-right));
      }
      .icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .icon-btn:hover {
        background: var(--bt-surface);
      }
      .icon-btn ha-icon {
        --mdc-icon-size: 24px;
      }
      .icon-btn.small {
        width: 32px;
        height: 32px;
      }
      .icon-btn.small ha-icon {
        --mdc-icon-size: 20px;
      }
      .h-title {
        flex: 1;
        min-width: 0;
      }
      .h-name {
        font-weight: 600;
        font-size: 18px;
      }
      .h-sub {
        font-size: 13px;
      }
      .menu {
        position: absolute;
        right: 12px;
        top: calc(100% - 4px);
        z-index: 5;
        min-width: 220px;
        padding: 6px 0;
        border-radius: 14px;
        background: var(--card-background-color, #fff);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
      }
      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        text-align: left;
        font-size: 15px;
      }
      .menu-item:hover {
        background: var(--bt-surface);
      }
      .menu-item ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-muted);
      }
      .menu-item:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .menu-item.danger,
      .menu-item.danger ha-icon {
        color: var(--error-color, #db4437);
      }
      .menu-sep {
        height: 1px;
        margin: 4px 0;
        background: var(--divider-color);
      }
      .content {
        flex: 1;
        overflow-y: auto;
        padding: 8px 16px 24px;
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .content.dirty {
        padding-bottom: 96px;
      }
      .content.sheet-open {
        padding-bottom: 380px;
      }
      .content > * {
        flex-shrink: 0;
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
        min-height: 36px;
        padding: 0 14px;
        border-radius: 9px;
        font-size: 14px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .seg button[aria-selected="true"] {
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
      }
      .seg .plus {
        flex: 0 0 40px;
        padding: 0;
      }
      .seg .plus ha-icon {
        --mdc-icon-size: 20px;
      }
      .active-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--success-color, #3bb273);
        margin-left: 6px;
      }
      .notice {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 4px 4px 4px 12px;
        border-radius: 12px;
        font-size: 13px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 14%, transparent);
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
        grid-template-columns: 30px 1fr;
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
      .day-label.today {
        color: var(--bt-accent);
        font-weight: 700;
      }
      .day.active .day-label {
        color: var(--primary-text-color);
      }
      .bar {
        position: relative;
        height: 38px;
        border-radius: 10px;
        background: var(--bt-surface);
        touch-action: pan-y;
      }
      .seg-b {
        position: absolute;
        top: 0;
        bottom: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 11.5px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.66);
        border-right: 2px solid var(--card-background-color, #fff);
        box-sizing: border-box;
      }
      .seg-b:first-of-type {
        border-radius: 10px 0 0 10px;
      }
      .seg-b:last-of-type {
        border-radius: 0 10px 10px 0;
        border-right: none;
      }
      .seg-b span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 4px;
      }
      .seg-b.selected {
        box-shadow: inset 0 0 0 2.5px var(--primary-text-color);
        border-radius: 8px;
        z-index: 1;
      }
      .hours {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: repeating-linear-gradient(
          to right,
          transparent 0,
          transparent calc(25% - 1px),
          color-mix(in srgb, var(--card-background-color, #fff) 45%, transparent) calc(25% - 1px),
          color-mix(in srgb, var(--card-background-color, #fff) 45%, transparent) 25%
        );
      }
      .now {
        position: absolute;
        top: -3px;
        bottom: -3px;
        width: 2px;
        margin-left: -1px;
        background: var(--primary-text-color);
        pointer-events: none;
        z-index: 2;
      }
      .handle {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 28px;
        margin-left: -14px;
        z-index: 3;
        cursor: ew-resize;
        touch-action: none;
        display: flex;
        justify-content: center;
      }
      .handle span {
        width: 2px;
        height: 100%;
        border-radius: 1px;
        background: var(--primary-text-color);
        opacity: 0.35;
      }
      .handle .knob {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 18px;
        transform: translate(-50%, -50%);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        border: 1.5px solid color-mix(in srgb, var(--primary-text-color) 45%, transparent);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        transition: transform 0.12s;
      }
      .handle:hover span,
      .handle.dragging span {
        opacity: 0.9;
      }
      .handle:hover .knob,
      .handle.dragging .knob {
        border-color: var(--primary-text-color);
        transform: translate(-50%, -50%) scale(1.15);
      }
      .time-tip {
        position: absolute;
        bottom: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        border-radius: 8px;
        background: var(--primary-text-color);
        color: var(--card-background-color, #fff);
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 14px;
        padding-left: 30px;
        font-size: 13px;
        color: var(--bt-muted);
      }
      .legend b {
        color: var(--primary-text-color);
        font-weight: 500;
      }
      .sw {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 3px;
        margin-right: 6px;
        vertical-align: -1px;
        flex: none;
      }
      .text-btn.small {
        min-height: 28px;
        padding: 0 6px;
        font-size: 13px;
      }
      .hint,
      .small-text {
        font-size: 12px;
      }
      .grow {
        flex: 1;
      }
      /* bottom sheet */
      .scrim {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.18);
        z-index: 6;
      }
      .sheet {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 7;
        max-height: 80%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 8px 16px max(18px, env(safe-area-inset-bottom));
        border-radius: 22px 22px 0 0;
        background: var(--card-background-color, #fff);
        box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.18);
        animation: up 0.18s ease-out;
      }
      @keyframes up {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
      }
      .grab {
        width: 36px;
        height: 4px;
        border-radius: 2px;
        margin: 0 auto;
        background: var(--divider-color);
      }
      .sheet-head {
        display: flex;
        align-items: center;
      }
      .sheet-title {
        flex: 1;
        font-size: 17px;
        font-weight: 600;
      }
      .times {
        display: flex;
        gap: 10px;
      }
      .time {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 8px 8px 12px;
        border-radius: 12px;
        background: var(--bt-surface);
      }
      .time small {
        display: block;
        font-size: 11px;
        color: var(--bt-muted);
      }
      .time b {
        font-size: 18px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .time.fixed b {
        color: var(--bt-muted);
      }
      .st {
        display: flex;
        gap: 4px;
      }
      .round.tiny {
        width: 30px;
        height: 30px;
        font-size: 18px;
        background: var(--card-background-color, #fff);
      }
      .chips .chip {
        min-height: 34px;
      }
      .chip .sw {
        margin-right: 0;
      }
      .temp-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
      }
      .temp-val {
        font-size: 26px;
        font-weight: 500;
        min-width: 110px;
        text-align: center;
      }
      .copy {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .copy .chip {
        background: var(--card-background-color, #fff);
      }
      .copy .chip[aria-pressed="true"] {
        background: var(--bt-accent);
      }
      .acts {
        display: flex;
        justify-content: space-around;
        padding-top: 8px;
        border-top: 1px solid var(--divider-color);
      }
      .acts button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 6px 10px;
        border-radius: 10px;
        font-size: 12px;
        color: var(--bt-muted);
      }
      .acts button ha-icon {
        --mdc-icon-size: 22px;
        color: var(--primary-text-color);
      }
      .acts button[aria-pressed="true"] {
        background: var(--bt-surface);
      }
      .acts button:disabled {
        opacity: 0.35;
      }
      .var-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .var-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 4px 6px 10px;
        border-radius: 12px;
        background: var(--bt-surface);
        font-size: 15px;
      }
      .var-val {
        min-width: 64px;
        text-align: center;
      }
      .var-add {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .var-add input[type="text"] {
        flex: 1;
      }
      .var-add input.num {
        width: 80px;
      }
      .room-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .room-pick {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        padding: 0 10px;
        border-radius: 12px;
        background: var(--bt-surface);
        text-align: left;
        width: 100%;
        font-size: 15px;
      }
      .room-pick ha-icon {
        --mdc-icon-size: 22px;
        color: var(--bt-muted);
      }
      .room-pick.on ha-icon {
        color: var(--bt-accent);
      }
      .info {
        font-size: 13px;
        padding: 8px 12px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--success-color, #3bb273) 15%, transparent);
      }
      .sheet-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      /* unsaved changes */
      .savebar {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: max(14px, env(safe-area-inset-bottom));
        z-index: 4;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 8px 8px 16px;
        border-radius: 16px;
        background: #1f2328;
        color: #fff;
        font-size: 14px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        animation: up 0.18s ease-out;
      }
      .text-btn.light {
        color: #c8ccd4;
      }
    `,
  ];
}

define("bt-week-editor", BtWeekEditor);
