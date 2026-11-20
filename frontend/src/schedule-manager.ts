import { LitElement, css, html, nothing } from "lit";
import type { GlobalScheduleData, HomeAssistant, RoomData, ScheduleData, Snapshot, WeekData } from "./api";
import { DAYS, ws } from "./api";
import "./room-picker";
import { dialogFrame, shared } from "./styles";
import "./week-editor";
import type { BtWeekEditor } from "./week-editor";
import { DAY_MIN, define, resolveSlot, segments, strings, tempColor, todayKey, weekEqual } from "./utils";

/** ``entry_id`` "" = global schedule. */
type Page =
  | { kind: "list" }
  | { kind: "rooms"; mode: "visibility" | "assign"; id: string; sel: Set<string> }
  | { kind: "name"; mode: "new" | "rename"; entry_id: string; id?: string; value: string }
  | { kind: "make_global"; entry_id: string; id: string; sel: Set<string>; all: boolean };

/**
 * Pseudo room for the weekly editor in global mode: its schedules are the global
 * schedules; an empty ``entry_id`` tells the editor that there is no room.
 */
export function globalRoom(snap: Snapshot, name: string, selected: string): RoomData {
  return {
    entry_id: "",
    name,
    climate_entity_id: null,
    trvs: [],
    mode: "auto",
    manual_temperature: 20,
    frost_temperature: 5,
    target_temperature: null,
    target_source: "schedule",
    target_variable: null,
    current_temperature: null,
    hvac_action: null,
    min_temp: snap.limits?.min ?? 4,
    max_temp: snap.limits?.max ?? 35,
    active_schedule: selected,
    base_schedule: selected,
    base_mode: "auto",
    base_manual_temperature: 20,
    area: null,
    floor: null,
    period: null,
    periods: [],
    hand_until: null,
    override_active: false,
    next_change: null,
    next_temperature: null,
    schedules: (snap.global_schedules ?? []).map((g) => ({ id: g.id, name: g.name, week: g.week, global: true })),
  };
}

/**
 * Manage all schedules: global ones (edit, offer in rooms, assign, rename, delete) and
 * the own schedules of every room (edit, make global, rename, delete).
 */
export class BtScheduleManager extends LitElement {
  static properties = {
    hass: { attribute: false },
    snap: { attribute: false },
    _page: { state: true },
    _error: { state: true },
    _info: { state: true },
    _busy: { state: true },
    _editing: { state: true },
  };

  hass?: HomeAssistant;
  snap?: Snapshot;
  _page: Page = { kind: "list" };
  _error?: string;
  _info?: string;
  _busy = false;
  /** Schedule open in the weekly editor (``entry_id`` "" = global). */
  _editing?: { entry_id: string; id: string };
  private _editor?: BtWeekEditor;

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
    this._editor?.remove();
    this._editor = undefined;
  }

  private _onKey = (ev: KeyboardEvent) => {
    if (ev.key === "Escape" && !this._editor) this._back();
  };

  private _back() {
    if (this._page.kind !== "list") {
      this._page = { kind: "list" };
      this._error = undefined;
    } else this.dispatchEvent(new CustomEvent("close"));
  }

  protected updated() {
    // The weekly editor lives in document.body like everywhere else.
    if (this._editing && this.snap && this.hass) {
      const { entry_id, id } = this._editing;
      const room = entry_id
        ? this.snap.rooms.find((r) => r.entry_id === entry_id)
        : globalRoom(this.snap, this._t.global_schedules, id);
      if (!room) {
        this._editing = undefined;
        return;
      }
      if (!this._editor) {
        this._editor = document.createElement("bt-week-editor") as BtWeekEditor;
        this._editor.addEventListener("close", () => (this._editing = undefined));
        document.body.appendChild(this._editor);
      }
      this._editor.hass = this.hass;
      this._editor.snap = this.snap;
      this._editor.initial = id;
      this._editor.room = room;
    } else if (this._editor) {
      this._editor.remove();
      this._editor = undefined;
    }
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

  private _roomName(id: string): string {
    return this.snap?.rooms.find((r) => r.entry_id === id)?.name ?? "?";
  }

  private _names(ids: string[]): string {
    return ids.map((id) => this._roomName(id)).join(", ");
  }

  private async _delete(g: GlobalScheduleData) {
    const t = this._t;
    let text = g.active.length
      ? t.confirm_delete_global_used.replace("{name}", g.name).replace("{rooms}", this._names(g.active))
      : t.confirm_delete_global.replace("{name}", g.name);
    if (g.periods.length) text += `\n${t.confirm_delete_global_periods}`;
    if (!confirm(text)) return;
    const res = await this._call<{ switched_off: string[] }>("global_schedule/delete", { schedule_id: g.id });
    if (res) this._info = res.switched_off.length ? `${t.deleted_switched_off} ${res.switched_off.join(", ")}` : undefined;
  }

  private async _submitName() {
    const page = this._page;
    if (page.kind !== "name" || !page.value.trim()) return;
    const name = page.value.trim();
    if (page.mode === "rename") {
      const ok = page.entry_id
        ? await this._call("schedule/rename", { entry_id: page.entry_id, schedule_id: page.id, name })
        : await this._call("global_schedule/rename", { schedule_id: page.id, name });
      if (ok) this._page = { kind: "list" };
      return;
    }
    const res = await this._call<{ id: string }>("global_schedule/create", { name });
    if (res) {
      this._page = { kind: "list" };
      this._editing = { entry_id: "", id: res.id };
    }
  }

  private async _deleteOwn(room: RoomData, s: ScheduleData) {
    if (!confirm(`${room.name}: ${s.name}\n${this._t.confirm_delete}`)) return;
    await this._call("schedule/delete", { entry_id: room.entry_id, schedule_id: s.id });
  }

  /** Other rooms with an own schedule whose plan equals ``week``. */
  private _identical(entryId: string, week: WeekData): { room: RoomData; id: string; name: string }[] {
    const result: { room: RoomData; id: string; name: string }[] = [];
    for (const r of this.snap?.rooms ?? []) {
      if (r.entry_id === entryId) continue;
      const same = r.schedules.find((s) => !s.global && weekEqual(s.week, week));
      if (same) result.push({ room: r, id: same.id, name: same.name });
    }
    return result;
  }

  private _startMakeGlobal(room: RoomData, s: ScheduleData) {
    const sel = new Set(this._identical(room.entry_id, s.week).map((x) => x.room.entry_id));
    this._error = undefined;
    this._page = { kind: "make_global", entry_id: room.entry_id, id: s.id, sel, all: false };
  }

  private async _makeGlobal() {
    const page = this._page;
    if (page.kind !== "make_global") return;
    const room = this.snap?.rooms.find((r) => r.entry_id === page.entry_id);
    const s = room?.schedules.find((x) => x.id === page.id);
    if (!room || !s) return;
    const merge = this._identical(room.entry_id, s.week)
      .filter((x) => page.sel.has(x.room.entry_id))
      .map((x) => ({ entry_id: x.room.entry_id, schedule_id: x.id }));
    const res = await this._call("schedule/make_global", {
      entry_id: room.entry_id,
      schedule_id: s.id,
      merge,
      all_rooms: page.all,
    });
    if (res) this._page = { kind: "list" };
  }

  /** Name of the schedule a page is about (for the header). */
  private _pageName(page: Page): string {
    if (page.kind === "list" || !("id" in page) || !page.id) return "";
    const entry = "entry_id" in page ? page.entry_id : "";
    if (entry) {
      const room = this.snap?.rooms.find((r) => r.entry_id === entry);
      const s = room?.schedules.find((x) => x.id === page.id);
      return room && s ? `${room.name} · ${s.name}` : "";
    }
    return this.snap?.global_schedules?.find((g) => g.id === page.id)?.name ?? "";
  }

  private async _applyRooms() {
    const page = this._page;
    if (page.kind !== "rooms" || !this.snap) return;
    let ok: unknown;
    if (page.mode === "visibility") {
      const all = this.snap.rooms.every((r) => page.sel.has(r.entry_id));
      // All rooms selected: also offer it in rooms added later.
      ok = await this._call("global_schedule/rooms", { schedule_id: page.id, rooms: all ? null : [...page.sel] });
    } else {
      ok = await this._call("global_schedule/assign", { schedule_id: page.id, entry_ids: [...page.sel] });
    }
    if (ok) this._page = { kind: "list" };
  }

  protected render() {
    if (!this.snap) return nothing;
    const t = this._t;
    const page = this._page;
    const title =
      page.kind === "rooms"
        ? page.mode === "visibility"
          ? t.visibility
          : t.assign
        : page.kind === "name"
          ? page.mode === "new"
            ? t.global_new
            : t.rename
          : page.kind === "make_global"
            ? t.make_global_action
            : t.global_schedules;
    const sub = this._pageName(page);
    return html`
      <div class="backdrop" @click=${() => this.dispatchEvent(new CustomEvent("close"))}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          ${page.kind !== "list"
            ? html`<button class="round small" aria-label=${t.close} @click=${() => this._back()}>
                <ha-icon icon="mdi:chevron-left"></ha-icon>
              </button>`
            : nothing}
          <div class="h-title">
            <div class="h-name">${title}</div>
            ${sub ? html`<div class="muted h-sub">${sub}</div>` : nothing}
          </div>
          <button class="round small" aria-label=${t.close} @click=${() => this.dispatchEvent(new CustomEvent("close"))}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <div class="content">
          ${page.kind === "list"
            ? this._renderList()
            : page.kind === "rooms"
              ? this._renderRooms(page)
              : page.kind === "make_global"
                ? this._renderMakeGlobal(page)
                : this._renderName(page)}
          ${this._info && page.kind === "list" ? html`<div class="info">${this._info}</div>` : nothing}
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        </div>
        <footer>${this._renderFooter()}</footer>
      </div>
    `;
  }

  private _renderFooter() {
    const t = this._t;
    const page = this._page;
    if (page.kind === "list") {
      return html`<button class="text-btn" @click=${() => (this._page = { kind: "name", mode: "new", entry_id: "", value: "" })}>
          <ha-icon icon="mdi:plus"></ha-icon>${t.global_new}
        </button>
        <span class="spacer"></span>
        <button class="text-btn" @click=${() => this.dispatchEvent(new CustomEvent("close"))}>${t.close}</button>`;
    }
    if (page.kind === "make_global") {
      return html`<span class="spacer"></span>
        <button class="text-btn" @click=${() => this._back()}>${t.cancel}</button>
        <button class="primary-btn" ?disabled=${this._busy} @click=${this._makeGlobal}>${t.make_global_action}</button>`;
    }
    if (page.kind === "rooms") {
      const disabled = this._busy || (page.mode === "assign" && !page.sel.size);
      return html`<span class="spacer"></span>
        <button class="text-btn" @click=${() => this._back()}>${t.cancel}</button>
        <button class="primary-btn" ?disabled=${disabled} @click=${this._applyRooms}>
          ${page.mode === "assign" ? t.assign_action : t.save}
        </button>`;
    }
    return html`<span class="spacer"></span>
      <button class="text-btn" @click=${() => this._back()}>${t.cancel}</button>
      <button class="primary-btn" ?disabled=${this._busy || !page.value.trim()} @click=${this._submitName}>${t.ok}</button>`;
  }

  private _renderList() {
    const t = this._t;
    const list = this.snap!.global_schedules ?? [];
    const allRooms = this.snap!.rooms.map((r) => r.entry_id);
    const rooms = this.snap!.rooms.filter((r) => r.schedules.some((s) => !s.global));
    return html`
      <div class="section-title"><ha-icon icon="mdi:earth"></ha-icon>${t.global_section}</div>
      <div class="muted small">${list.length ? t.global_hint : t.global_none}</div>
      ${list.map((g) => {
        const offered =
          g.rooms === null
            ? t.global_all_rooms
            : g.rooms.length === 0
              ? t.global_no_rooms
              : g.rooms.length <= 3
                ? this._names(g.rooms)
                : t.global_n_rooms.replace("{n}", String(g.rooms.length));
        return html`<div class="item">
          <div class="item-head">
            <ha-icon icon="mdi:earth"></ha-icon>
            <span class="item-name">${g.name}</span>
            <button class="icon-btn" aria-label=${t.edit_week} title=${t.edit_week}
              @click=${() => (this._editing = { entry_id: "", id: g.id })}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>
            </button>
          </div>
          ${this._renderPreview(g)}
          <div class="facts small">
            <div><span class="muted">${t.global_active_in}:</span>
              ${g.active.length ? this._names(g.active) : html`<span class="muted">${t.global_active_none}</span>`}</div>
            <div><span class="muted">${t.global_offered}:</span> ${offered}</div>
            ${g.periods.length
              ? html`<div><span class="muted">${t.global_periods_in}:</span> ${this._names(g.periods)}</div>`
              : nothing}
          </div>
          <div class="actions">
            <button class="chip" @click=${() =>
              (this._page = { kind: "rooms", mode: "assign", id: g.id, sel: new Set(g.active) })}>
              <ha-icon icon="mdi:home-import-outline"></ha-icon>${t.assign}
            </button>
            <button class="chip" @click=${() =>
              (this._page = {
                kind: "rooms",
                mode: "visibility",
                id: g.id,
                sel: new Set(g.rooms ?? allRooms),
              })}>
              <ha-icon icon="mdi:eye-outline"></ha-icon>${t.visibility}
            </button>
            <button class="chip" @click=${() =>
              (this._page = { kind: "name", mode: "rename", entry_id: "", id: g.id, value: g.name })}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${t.rename}
            </button>
            <button class="chip danger" ?disabled=${this._busy} @click=${() => this._delete(g)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
            </button>
          </div>
        </div>`;
      })}
      ${rooms.length
        ? html`<div class="section-title"><ha-icon icon="mdi:home-outline"></ha-icon>${t.own_section}</div>
            <div class="muted small">${t.own_hint}</div>
            ${rooms.map((r) => this._renderRoomSchedules(r))}`
        : nothing}
    `;
  }

  private _renderRoomSchedules(room: RoomData) {
    const t = this._t;
    const own = room.schedules.filter((s) => !s.global);
    return html`<div class="item">
      <div class="item-head">
        <span class="item-name">${room.name}</span>
        ${room.floor ? html`<span class="muted small">${room.floor.name}</span>` : nothing}
      </div>
      ${own.map((s) => {
        const active = s.id === room.base_schedule;
        return html`<div class="own">
          <div class="own-head">
            <span class="own-name">${s.name}</span>
            ${active ? html`<span class="badge">${t.active}</span>` : nothing}
            <span class="spacer"></span>
            <button class="icon-btn" aria-label=${t.edit_week} title=${t.edit_week}
              @click=${() => (this._editing = { entry_id: room.entry_id, id: s.id })}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>
            </button>
          </div>
          ${this._renderPreview(s)}
          <div class="actions">
            <button class="chip" @click=${() => this._startMakeGlobal(room, s)}>
              <ha-icon icon="mdi:earth"></ha-icon>${t.make_global}
            </button>
            <button class="chip" @click=${() =>
              (this._page = { kind: "name", mode: "rename", entry_id: room.entry_id, id: s.id, value: s.name })}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${t.rename}
            </button>
            <button class="chip danger" ?disabled=${this._busy || active} title=${active ? t.not_deletable_active : ""}
              @click=${() => this._deleteOwn(room, s)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
            </button>
          </div>
        </div>`;
      })}
    </div>`;
  }

  private _renderMakeGlobal(page: Extract<Page, { kind: "make_global" }>) {
    const t = this._t;
    const room = this.snap!.rooms.find((r) => r.entry_id === page.entry_id);
    const s = room?.schedules.find((x) => x.id === page.id);
    if (!room || !s) return nothing;
    const candidates = this._identical(room.entry_id, s.week);
    const toggle = (id: string) => {
      const sel = new Set(page.sel);
      if (sel.has(id)) sel.delete(id);
      else sel.add(id);
      this._page = { ...page, sel };
    };
    return html`
      <div class="muted small">${t.make_global_hint.replace("{name}", s.name)}</div>
      <div class="picks">
        ${candidates.length
          ? candidates.map((c) => {
              const on = page.sel.has(c.room.entry_id);
              return html`<button class="pick" role="checkbox" aria-checked=${on} @click=${() => toggle(c.room.entry_id)}>
                <ha-icon icon=${on ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}></ha-icon>
                <span class="grow">${c.room.name}</span>
                <span class="muted small">${c.name}</span>
              </button>`;
            })
          : html`<div class="muted small">${t.make_global_none}</div>`}
      </div>
      <button class="pick" role="checkbox" aria-checked=${page.all} @click=${() => (this._page = { ...page, all: !page.all })}>
        <ha-icon icon=${page.all ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}></ha-icon>
        <span class="grow">${t.make_global_all}</span>
      </button>
    `;
  }

  /** Small preview of today's plan. */
  private _renderPreview(g: { week: WeekData }) {
    const vars = this.snap!.variables;
    const day = g.week[todayKey(this.hass)] ?? g.week[DAYS[0]];
    return html`<div class="preview">
      ${segments(day).map(
        (s) => html`<i style="left:${(s.start / DAY_MIN) * 100}%;width:${((s.end - s.start) / DAY_MIN) * 100}%;
          background:${tempColor(resolveSlot(s.slot, vars))}"></i>`,
      )}
    </div>`;
  }

  private _renderRooms(page: Extract<Page, { kind: "rooms" }>) {
    const t = this._t;
    const g = this.snap!.global_schedules?.find((x) => x.id === page.id);
    const notes: Record<string, string> = {};
    for (const id of g?.active ?? []) notes[id] = t.active;
    return html`
      <div class="muted small">${page.mode === "visibility" ? t.visibility_hint : t.assign_hint}</div>
      <bt-room-picker .hass=${this.hass} .rooms=${this.snap!.rooms} .selected=${page.sel} .notes=${notes}
        @change=${(e: CustomEvent<Set<string>>) => (this._page = { ...page, sel: e.detail })}></bt-room-picker>
    `;
  }

  private _renderName(page: Extract<Page, { kind: "name" }>) {
    const t = this._t;
    return html`<input type="text" .value=${page.value} placeholder=${t.name} aria-label=${t.name}
      @input=${(e: Event) => (this._page = { ...page, value: (e.target as HTMLInputElement).value })}
      @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._submitName()} />`;
  }

  static styles = [
    shared,
    dialogFrame,
    css`
      .small {
        font-size: 13px;
      }
      .spacer {
        flex: 1;
      }
      .round.small {
        width: 36px;
        height: 36px;
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
      .icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
      .icon-btn:hover {
        background: var(--bt-surface);
      }
      .item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid var(--divider-color);
      }
      .item-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .item-head > ha-icon {
        color: var(--bt-accent);
        --mdc-icon-size: 20px;
      }
      .item-name {
        flex: 1;
        font-weight: 600;
      }
      .preview {
        position: relative;
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
        background: var(--bt-surface);
      }
      .preview i {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      .facts {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .actions .chip {
        min-height: 32px;
        padding: 0 10px;
        font-size: 13px;
      }
      .chip.danger {
        color: var(--error-color, #db4437);
      }
      .info {
        font-size: 13px;
        color: var(--bt-accent);
      }
      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 4px;
        font-size: 13px;
        font-weight: 600;
        color: var(--bt-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .section-title ha-icon {
        --mdc-icon-size: 16px;
      }
      .own {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding-top: 8px;
        border-top: 1px solid var(--divider-color);
      }
      .own-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .own-name {
        font-weight: 500;
      }
      .badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--success-color, #43a047) 18%, transparent);
        color: var(--success-color, #43a047);
      }
      .picks {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .pick {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        padding: 0 8px;
        border-radius: 10px;
        text-align: left;
      }
      .pick:hover {
        background: var(--bt-surface);
      }
      .pick[aria-checked="true"] ha-icon {
        color: var(--bt-accent);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
    `,
  ];
}

define("bt-schedule-manager", BtScheduleManager);
