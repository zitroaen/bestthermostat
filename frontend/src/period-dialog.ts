import { LitElement, css, html, nothing } from "lit";
import type { HomeAssistant, PeriodData, RoomData } from "./api";
import { ws } from "./api";
import { shared } from "./styles";
import { fmtTemp, strings } from "./utils";

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
    _what: { state: true },
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
  room?: RoomData;
  period?: PeriodData;
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

  protected willUpdate() {
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
      const other = this.room.schedules.find((s) => s.id !== this.room!.base_schedule);
      this._what = other ? { kind: "schedule", id: other.id } : { kind: "mode", mode: "off" };
      this._temp = Math.round((this.room.target_temperature ?? 21) * 2) / 2;
    }
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private get _valid(): string | undefined {
    const t = this._t;
    const start = this._startNow ? new Date() : new Date(this._start);
    if (!this._startNow && Number.isNaN(start.getTime())) return t.period_invalid;
    if (!this._openEnd) {
      const end = new Date(this._end);
      if (Number.isNaN(end.getTime()) || end <= start || end <= new Date()) return t.period_invalid;
    }
    return undefined;
  }

  private async _save() {
    if (!this.hass || !this.room || !this._what) return;
    const data: Record<string, unknown> = { entry_id: this.room.entry_id };
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
      data.period_id = this.period!.id;
      data.summary = this._title.trim();
    } else if (this._title.trim()) data.summary = this._title.trim();
    this._busy = true;
    this._error = undefined;
    try {
      await ws(this.hass, editing ? "period/update" : "period/add", data);
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
      await ws(this.hass, "period/cancel", {
        entry_id: this.room.entry_id,
        period_id: this.period.id,
      });
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
    if (!this.room) return nothing;
    const t = this._t;
    const room = this.room;
    const invalid = this._valid;
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
            <div class="muted h-sub">${room.name}</div>
          </div>
          <button class="round small" @click=${this._close} aria-label=${t.close}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <div class="content">
          <section>
            <div class="label">${t.period_what}</div>
            <div class="chips">
              ${room.schedules.map(
                (s) => html`<button class="chip" aria-pressed=${this._isWhat({ kind: "schedule", id: s.id })}
                  @click=${() => (this._what = { kind: "schedule", id: s.id })}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${s.name}
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
                  <button class="round" @click=${() => (this._temp = Math.max(5, this._temp - 0.5))}>−</button>
                  <span class="temp-val">${fmtTemp(this._temp)}</span>
                  <button class="round" @click=${() => (this._temp = Math.min(30, this._temp + 0.5))}>+</button>
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
                <ha-icon icon="mdi:delete-outline"></ha-icon>${this.period && this.room?.period?.id === this.period.id ? t.period_end : t.period_delete}
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
        width: min(520px, 100vw);
        max-height: min(760px, 100dvh);
        background: var(--card-background-color, var(--primary-background-color));
        border-radius: var(--bt-radius);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }
      @media (max-width: 600px) {
        .dialog {
          width: 100vw;
          height: 100dvh;
          max-height: none;
          border-radius: 0;
        }
      }
      header,
      footer {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
      }
      header {
        border-bottom: 1px solid var(--divider-color);
        padding-top: max(12px, env(safe-area-inset-top));
      }
      footer {
        justify-content: flex-end;
        border-top: 1px solid var(--divider-color);
        padding-bottom: max(12px, env(safe-area-inset-bottom));
      }
      .h-title {
        flex: 1;
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
        gap: 18px;
      }
      section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .label {
        font-size: 13px;
        font-weight: 600;
        color: var(--bt-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .label .muted {
        text-transform: none;
        font-weight: 400;
      }
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

customElements.define("bt-period-dialog", BtPeriodDialog);
