import { LitElement, css, html, nothing } from "lit";
import type { HomeAssistant, LabelData, RoomData } from "./api";
import { shared } from "./styles";
import { define, strings } from "./utils";

/**
 * Pick rooms: label chips (Home Assistant labels of the room devices) select or
 * deselect all rooms with that label, followed by one checkbox row per room.
 * Fires ``change`` with the new selection (a Set of entry ids) in ``detail``.
 */
export class BtRoomPicker extends LitElement {
  static properties = {
    hass: { attribute: false },
    rooms: { attribute: false },
    selected: { attribute: false },
    notes: { attribute: false },
  };

  hass?: HomeAssistant;
  rooms: RoomData[] = [];
  selected: Set<string> = new Set();
  /** Optional muted text per room (entry id), e.g. "active". */
  notes?: Record<string, string>;

  private _emit(next: Set<string>) {
    this.dispatchEvent(new CustomEvent("change", { detail: next }));
  }

  private _toggle(id: string) {
    const next = new Set(this.selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._emit(next);
  }

  private _labels(): LabelData[] {
    const map = new Map<string, LabelData>();
    for (const room of this.rooms) for (const l of room.labels ?? []) map.set(l.id, l);
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  /** All rooms with the label selected → deselect them, otherwise select them. */
  private _toggleLabel(label: LabelData) {
    const ids = this.rooms.filter((r) => r.labels?.some((l) => l.id === label.id)).map((r) => r.entry_id);
    const next = new Set(this.selected);
    const all = ids.every((id) => next.has(id));
    for (const id of ids) {
      if (all) next.delete(id);
      else next.add(id);
    }
    this._emit(next);
  }

  protected render() {
    const t = strings(this.hass);
    const labels = this._labels();
    const allSelected = this.rooms.length > 0 && this.rooms.every((r) => this.selected.has(r.entry_id));
    return html`
      <div class="chips">
        <button class="chip" aria-pressed=${allSelected}
          @click=${() => this._emit(allSelected ? new Set() : new Set(this.rooms.map((r) => r.entry_id)))}>
          <ha-icon icon="mdi:home-outline"></ha-icon>${t.all_rooms}
        </button>
        ${labels.map((l) => {
          const ids = this.rooms.filter((r) => r.labels?.some((x) => x.id === l.id));
          const on = ids.length > 0 && ids.every((r) => this.selected.has(r.entry_id));
          return html`<button class="chip" aria-pressed=${on} @click=${() => this._toggleLabel(l)}>
            <ha-icon icon=${l.icon || "mdi:label-outline"}></ha-icon>${l.name}
          </button>`;
        })}
      </div>
      <div class="list">
        ${this.rooms.map((r) => {
          const on = this.selected.has(r.entry_id);
          const note = this.notes?.[r.entry_id];
          return html`<button class="pick ${on ? "on" : ""}" role="checkbox" aria-checked=${on}
            @click=${() => this._toggle(r.entry_id)}>
            <ha-icon icon=${on ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}></ha-icon>
            <span class="grow">${r.name}${r.floor ? html` <span class="muted">· ${r.floor.name}</span>` : nothing}</span>
            ${note ? html`<span class="muted note">${note}</span>` : nothing}
          </button>`;
        })}
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .chip ha-icon {
        --mdc-icon-size: 18px;
      }
      .list {
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
      .pick.on ha-icon {
        color: var(--bt-accent);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .note {
        font-size: 13px;
      }
    `,
  ];
}

define("bt-room-picker", BtRoomPicker);
