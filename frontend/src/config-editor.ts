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
  layout: { de: "Darstellung", en: "Layout" },
  show_summary: { de: "Zusammenfassung anzeigen", en: "Show summary" },
  room: { de: "Räume (gilt für alle)", en: "Rooms (applies to all)" },
  exclude_rooms: { de: "Räume ausblenden", en: "Hide rooms" },
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

const ROOM_OPTIONS = [
  { name: "show_modes", selector: { boolean: {} } },
  { name: "show_schedules", selector: { boolean: {} } },
  { name: "show_timeline", selector: { boolean: {} } },
  { name: "show_periods", selector: { boolean: {} } },
  { name: "show_priorities", selector: { boolean: {} } },
  { name: "show_editor", selector: { boolean: {} } },
  { name: "compact", selector: { boolean: {} } },
];

function overviewSchema(de: boolean) {
  return [
    { name: "title", selector: { text: {} } },
    {
      name: "layout",
      selector: {
        select: {
          mode: "box",
          options: [
            { value: "list", label: de ? "Liste (Raum zum Aufklappen)" : "List (tap to expand)" },
            { value: "tiles", label: de ? "Kacheln (alle Räume offen)" : "Tiles (all rooms open)" },
          ],
        },
      },
    },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "show_summary", selector: { boolean: {} } },
        { name: "show_override", selector: { boolean: {} } },
        { name: "show_variables", selector: { boolean: {} } },
        { name: "group_by_floor", selector: { boolean: {} } },
      ],
    },
    {
      type: "expandable",
      name: "room",
      title: de ? "Räume (gilt für alle)" : "Rooms (applies to all)",
      schema: [{ type: "grid", name: "", schema: ROOM_OPTIONS }],
    },
    {
      name: "exclude_rooms",
      selector: {
        entity: { multiple: true, filter: { domain: "climate", integration: "bestthermostat" } },
      },
    },
  ];
}

abstract class BaseEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };
  hass?: HomeAssistant;
  _config?: Record<string, unknown>;
  protected abstract get schema(): unknown[];
  protected abstract defaults: Record<string, unknown>;

  setConfig(config: CardConfig) {
    const defaults = this.defaults as Record<string, any>;
    const cfg = config as Record<string, any>;
    this._config = {
      ...defaults,
      ...cfg,
      ...(defaults.room ? { room: { ...defaults.room, ...(cfg.room ?? {}) } } : {}),
    };
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
  protected get schema(): unknown[] {
    return ROOM_SCHEMA;
  }
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
  protected get schema(): unknown[] {
    const lang = this.hass?.locale?.language || this.hass?.language || "en";
    return overviewSchema(lang.startsWith("de"));
  }

  protected defaults = {
    layout: "list",
    show_summary: true,
    show_override: true,
    show_variables: true,
    group_by_floor: true,
    room: {
      show_modes: true,
      show_schedules: true,
      show_timeline: true,
      show_periods: true,
      show_priorities: true,
      show_editor: true,
      compact: false,
    },
  };
}

customElements.define("bestthermostat-card-editor", BestThermostatCardEditor);
customElements.define("bestthermostat-overview-card-editor", BestThermostatOverviewEditor);
