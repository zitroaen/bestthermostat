import { BestThermostatCard } from "./card";
import "./config-editor";
import { BestThermostatOverviewCard } from "./overview-card";

const VERSION = "0.1.4";

if (!customElements.get("bestthermostat-card")) {
  customElements.define("bestthermostat-card", BestThermostatCard);
}
if (!customElements.get("bestthermostat-overview-card")) {
  customElements.define("bestthermostat-overview-card", BestThermostatOverviewCard);
}

const w = window as unknown as { customCards?: unknown[] };
w.customCards = w.customCards || [];
const cards: { type: string; [key: string]: unknown }[] = [
  {
    type: "bestthermostat-card",
    name: "Best Thermostat",
    description: "Raumthermostat mit Zeitplänen und Wocheneditor",
    preview: true,
    documentationURL: "https://github.com/zitroaen/bestthermostat",
  },
  {
    type: "bestthermostat-overview-card",
    name: "Best Thermostat Übersicht",
    description: "Alle Räume, globaler Override und Variablen",
    preview: true,
  },
];
for (const card of cards) {
  if (!w.customCards.some((c: any) => c?.type === card.type)) w.customCards.push(card);
}

console.info(`%c BEST-THERMOSTAT %c ${VERSION} `, "background:#ff8100;color:#fff", "");
