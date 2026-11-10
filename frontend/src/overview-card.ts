import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { HomeAssistant, RoomData, Snapshot } from "./api";
import { subscribe, ws } from "./api";
import { shared } from "./styles";
import { fmtTemp, strings, tempColor } from "./utils";

interface OverviewConfig {
  type: string;
  title?: string;
  show_override?: boolean;
  show_variables?: boolean;
}

export class BestThermostatOverviewCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _snap: { state: true },
    _error: { state: true },
  };

  hass?: HomeAssistant;
  _config?: OverviewConfig;
  _snap?: Snapshot;
  _error?: string;
  private _unsub?: () => void;

  static getConfigElement() {
    return document.createElement("bestthermostat-overview-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config: OverviewConfig) {
    this._config = { show_override: true, show_variables: true, ...config };
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

  private _open(room: RoomData) {
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
    const snap = this._snap;
    if (!snap) return html`<ha-card><div class="pad">${t.loading}</div></ha-card>`;
    const ov = snap.override;
    return html`<ha-card>
      <div class="pad col">
        <div class="title">${this._config.title ?? t.rooms}</div>
        ${this._config.show_override
          ? html`<div class="row override ${ov.active ? "on" : ""}">
              <ha-icon icon="mdi:home-export-outline"></ha-icon>
              <span class="grow">${t.override}</span>
              <button class="round small" @click=${() =>
                this._call("override/set", { temperature: Math.max(5, (ov.value ?? 16) - 0.5) })}>−</button>
              <span class="val">${fmtTemp(ov.value)}</span>
              <button class="round small" @click=${() =>
                this._call("override/set", { temperature: Math.min(30, (ov.value ?? 16) + 0.5) })}>+</button>
              <button class="chip" aria-pressed=${ov.active}
                @click=${() => this._call("override/set", { active: !ov.active })}>
                ${ov.active ? t.active : t.off}
              </button>
            </div>
            <div class="chips sub-row">
              <button class="chip small" aria-pressed=${ov.all_modes}
                @click=${() => this._call("override/set", { all_modes: !ov.all_modes })}>
                <ha-icon icon=${ov.all_modes ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}></ha-icon>
                ${t.override_all}
              </button>
            </div>`
          : nothing}
        ${this._config.show_variables && snap.variables.length
          ? html`<div class="chips">
              ${snap.variables.map(
                (v) => html`<span class="chip static">
                  <span class="dot" style="background:${tempColor(v.value)}"></span>
                  ${v.name} ${fmtTemp(v.value)}
                </span>`,
              )}
            </div>`
          : nothing}
        ${snap.rooms.map((room) => this._renderRoom(room))}
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      </div>
    </ha-card>`;
  }

  private _renderRoom(room: RoomData) {
    const t = strings(this.hass);
    const heating = room.hvac_action === "heating";
    const sched = room.schedules.find((s) => s.id === room.active_schedule)?.name;
    const mode = room.override_active
      ? t.src_override
      : room.mode === "auto"
        ? sched
        : room.mode === "off"
          ? t.off
          : t.heat;
    return html`<button class="room" @click=${() => this._open(room)}>
      <span class="icon ${heating ? "heating" : ""}">
        <ha-icon icon=${room.mode === "off" ? "mdi:radiator-off" : "mdi:radiator"}></ha-icon>
      </span>
      <span class="grow left">
        <span class="name">${room.name}</span>
        <span class="muted sub">${mode}</span>
      </span>
      <span class="temps">
        <span>${fmtTemp(room.current_temperature)}</span>
        <span class="muted sub">→ ${fmtTemp(room.target_temperature)}</span>
      </span>
    </button>`;
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
        gap: 10px;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .override {
        padding: 8px 10px;
        border-radius: var(--bt-radius);
        background: var(--bt-surface);
      }
      .override.on {
        background: color-mix(in srgb, var(--bt-accent) 18%, transparent);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .round.small {
        width: 34px;
        height: 34px;
        font-size: 20px;
        background: var(--card-background-color, #fff);
      }
      .val {
        min-width: 58px;
        text-align: center;
      }
      .sub-row {
        margin-top: -4px;
      }
      .chip.small {
        min-height: 30px;
        font-size: 13px;
      }
      .chip.small ha-icon {
        --mdc-icon-size: 18px;
      }
      .chip.static {
        cursor: default;
        min-height: 30px;
        font-size: 13px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .room {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 4px;
        border-radius: 12px;
        text-align: left;
        width: 100%;
      }
      .room:hover {
        background: var(--bt-surface);
      }
      .icon {
        width: 38px;
        height: 38px;
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
        font-size: 12px;
      }
    `,
  ];
}
