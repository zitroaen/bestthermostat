import { LitElement, css, html, nothing } from "lit";
import type { GlobalScheduleData, HomeAssistant, RoomData, Snapshot } from "./api";
import { DAYS, ws } from "./api";
import "./room-picker";
import { dialogFrame, shared } from "./styles";
import "./week-editor";
import type { BtWeekEditor } from "./week-editor";
import { DAY_MIN, define, resolveSlot, segments, strings, tempColor, todayKey } from "./utils";

type Page =
  | { kind: "list" }
  | { kind: "rooms"; mode: "visibility" | "assign"; id: string; sel: Set<string> }
  | { kind: "name"; mode: "new" | "rename"; id?: string; value: string };

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

/** Manage global schedules: edit, offer in rooms, assign to rooms, rename, delete. */
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
  /** Id of the global schedule open in the weekly editor. */
  _editing?: string;
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
      if (!this._editor) {
        this._editor = document.createElement("bt-week-editor") as BtWeekEditor;
        this._editor.addEventListener("close", () => (this._editing = undefined));
        document.body.appendChild(this._editor);
      }
      this._editor.hass = this.hass;
      this._editor.snap = this.snap;
      this._editor.room = globalRoom(this.snap, this._t.global_schedules, this._editing);
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
    if (page.mode === "rename") {
      const ok = await this._call("global_schedule/rename", { schedule_id: page.id, name: page.value.trim() });
      if (ok) this._page = { kind: "list" };
      return;
    }
    const res = await this._call<{ id: string }>("global_schedule/create", { name: page.value.trim() });
    if (res) {
      this._page = { kind: "list" };
      this._editing = res.id;
    }
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
          : t.global_schedules;
    const sub = page.kind === "list" ? "" : this.snap.global_schedules?.find((g) => g.id === (page as any).id)?.name ?? "";
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
          ${page.kind === "list" ? this._renderList() : page.kind === "rooms" ? this._renderRooms(page) : this._renderName(page)}
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
      return html`<button class="text-btn" @click=${() => (this._page = { kind: "name", mode: "new", value: "" })}>
          <ha-icon icon="mdi:plus"></ha-icon>${t.global_new}
        </button>
        <span class="spacer"></span>
        <button class="text-btn" @click=${() => this.dispatchEvent(new CustomEvent("close"))}>${t.close}</button>`;
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
    return html`
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
              @click=${() => (this._editing = g.id)}>
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
            <button class="chip" @click=${() => (this._page = { kind: "name", mode: "rename", id: g.id, value: g.name })}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${t.rename}
            </button>
            <button class="chip danger" ?disabled=${this._busy} @click=${() => this._delete(g)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
            </button>
          </div>
        </div>`;
      })}
    `;
  }

  /** Small preview of today's plan. */
  private _renderPreview(g: GlobalScheduleData) {
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
    `,
  ];
}

define("bt-schedule-manager", BtScheduleManager);
