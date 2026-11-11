import { BestThermostatCard } from "./card";
import "./config-editor";
import { BestThermostatOverviewCard } from "./overview-card";

const VERSION = "0.4.1";

if (!customElements.get("bestthermostat-card")) {
  customElements.define("bestthermostat-card", BestThermostatCard);
}
if (!customElements.get("bestthermostat-overview-card")) {
  customElements.define("bestthermostat-overview-card", BestThermostatOverviewCard);
}

const w = window as unknown as { customCards?: unknown[] };
w.customCards = w.customCards || [];
const de = (document.documentElement.lang || navigator.language || "").startsWith("de");
const cards: { type: string; [key: string]: unknown }[] = [
  {
    type: "bestthermostat-card",
    name: "Best Thermostat",
    description: de
      ? "Raumthermostat mit Zeitplänen und Wocheneditor"
      : "Room thermostat with schedules and weekly editor",
    preview: true,
    documentationURL: "https://github.com/zitroaen/bestthermostat",
  },
  {
    type: "bestthermostat-overview-card",
    name: de ? "Best Thermostat Übersicht" : "Best Thermostat Overview",
    description: de
      ? "Alle Räume, globaler Override und Variablen"
      : "All rooms, global override and variables",
    preview: true,
  },
];
for (const card of cards) {
  if (!w.customCards.some((c: any) => c?.type === card.type)) w.customCards.push(card);
}

console.info(`%c BEST-THERMOSTAT %c ${VERSION} `, "background:#ff8100;color:#fff", "");
