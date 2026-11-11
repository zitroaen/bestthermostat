import { LitElement, html, nothing } from "lit";
import type { HomeAssistant } from "./api";
import type { CardConfig } from "./card";

const LABELS: Record<string, { de: string; en: string }> = {
  entity: { de: "Raum", en: "Room" },
  name: { de: "Name (optional)", en: "Name (optional)" },
  compact: { de: "Kompaktmodus (Wanddisplay)", en: "Compact mode (wall display)" },
  show_modes: { de: "Modi anzeigen", en: "Show modes" },
  show_schedules: { de: "Zeitpläne anzeigen", en: "Show schedules" },
  show_timeline: { de: "Zeitleiste heute anzeigen", en: "Show today's timeline" },
  show_editor: { de: "Button für Wocheneditor", en: "Weekly editor button" },
  show_periods: { de: "Zeiträume anzeigen und planen", en: "Show and plan periods" },
  show_priorities: { de: "Prioritäten anzeigen", en: "Show priorities" },
  title: { de: "Titel", en: "Title" },
  show_override: { de: "Globalen Override anzeigen", en: "Show global override" },
  show_variables: { de: "Variablen anzeigen", en: "Show variables" },
  group_by_floor: { de: "Nach Stockwerk gruppieren", en: "Group by floor" },
};

const ROOM_SCHEMA = [
  {
    name: "entity",
    required: true,
    selector: { entity: { filter: { domain: "climate", integration: "bestthermostat" } } },
  },
  { name: "name", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "compact", selector: { boolean: {} } },
      { name: "show_modes", selector: { boolean: {} } },
      { name: "show_schedules", selector: { boolean: {} } },
      { name: "show_timeline", selector: { boolean: {} } },
      { name: "show_editor", selector: { boolean: {} } },
      { name: "show_periods", selector: { boolean: {} } },
      { name: "show_priorities", selector: { boolean: {} } },
    ],
  },
];

const OVERVIEW_SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "show_override", selector: { boolean: {} } },
      { name: "show_variables", selector: { boolean: {} } },
      { name: "show_periods", selector: { boolean: {} } },
      { name: "group_by_floor", selector: { boolean: {} } },
    ],
  },
];

abstract class BaseEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };
  hass?: HomeAssistant;
  _config?: Record<string, unknown>;
  protected abstract schema: unknown[];
  protected abstract defaults: Record<string, unknown>;

  setConfig(config: CardConfig) {
    this._config = { ...this.defaults, ...config };
  }

  private _label = (s: { name: string }) => {
    const lang = (this.hass?.locale?.language || this.hass?.language || "en").startsWith("de")
      ? "de"
      : "en";
    return LABELS[s.name]?.[lang] ?? s.name;
  };

  private _changed(ev: CustomEvent) {
    const config = ev.detail.value;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }),
    );
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`;
  }
}

export class BestThermostatCardEditor extends BaseEditor {
  protected schema = ROOM_SCHEMA;
  protected defaults = {
    compact: false,
    show_modes: true,
    show_schedules: true,
    show_timeline: true,
    show_editor: true,
    show_periods: true,
    show_priorities: true,
  };
}

export class BestThermostatOverviewEditor extends BaseEditor {
  protected schema = OVERVIEW_SCHEMA;
  protected defaults = {
    show_override: true,
    show_variables: true,
    show_periods: true,
    group_by_floor: true,
  };
}

customElements.define("bestthermostat-card-editor", BestThermostatCardEditor);
customElements.define("bestthermostat-overview-card-editor", BestThermostatOverviewEditor);
