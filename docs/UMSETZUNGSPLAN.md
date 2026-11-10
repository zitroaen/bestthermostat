# Best Thermostat – Umsetzungsplan

Domain `bestthermostat` · Lizenz MIT · HA ≥ 2025.1 · codeowners `@zitroaen`

## 1. Festgelegte Entscheidungen

| Thema | Entscheidung |
|---|---|
| Raum-Modi | `hvac_mode`: `auto` = Zeitplan, `heat` = Manuell (feste Temp.), `off` = Frostschutz (nur Temperatur, TRV bleibt an) |
| Override / Boost / Offset | Kein Raum-Override, kein Boost, kein Offset in v1 |
| Zeitpläne | Mehrere pro Raum, aktiver per `select` (szenenfähig) |
| Slot-Wert | Fester Wert (0,5 °C) **oder** Verweis auf globale Variable |
| Globale Variablen | Vom Nutzer definiert (z. B. Komfort, Absenk), je eine `number`; Änderung wird sofort nachgezogen; Löschen blockiert, solange verwendet |
| Globaler Override | `switch` + `number` (Temperatur oder Variable), nur an/aus; pausiert Zeitpläne; Snapshot der Raumzustände, exakte Wiederherstellung beim Beenden |
| Override-Reichweite | `switch` „gilt auch für Manuell/Aus“ |
| Handänderung im Auto-Modus | Pro Raum im Options Flow: `manual` (→ Modus Manuell) / `until_next_slot` / `ignore`; TRV-Sync abschaltbar |
| Eigene Schreibvorgänge | Context-ID **plus** Vergleich mit zuletzt gesendetem Soll im Zeitfenster |
| Karte | Im selben Repo, ausgeliefert unter `custom_components/bestthermostat/frontend/`, automatisch registriert |

## 2. Architektur

```
custom_components/bestthermostat/
  __init__.py          Setup, Entry-Typen (global / room), WS + Frontend registrieren
  manifest.json, strings.json, translations/{de,en}.json, services.yaml
  const.py
  config_flow.py       Global-Entry (automatisch), Raum-Entry, Options Flows
  schedule.py          REINE Python-Logik (kein HA-Import): aktiver Slot, nächster Wechsel, DST, Validierung
  models.py            Dataclasses Room/Schedule/Slot/Variable/GlobalState, (De-)Serialisierung
  storage.py           Store-Wrapper (Version + Migration)
  hub.py               Globaler Zustand: Variablen, Override, Snapshot, Events
  room.py              RoomController: Ziel berechnen, Timer, TRV-Listener, Sync, Retry
  sender.py            Globale Schreib-Queue (0,5–1 s versetzt, Retry begrenzt)
  climate.py select.py sensor.py binary_sensor.py number.py switch.py
  services.py          set_active_schedule, set_mode, get_schedule, set_schedule, set_variable, set_global_override
  websocket.py         API der Karte + Subscribe
  frontend/            gebaute bestthermostat-card.js
frontend/              TypeScript/Lit-Quellen (Rollup)
tests/                 pytest + pytest-homeassistant-custom-component
hacs.json, LICENSE, README.md, .github/workflows/{validate,tests,release}.yml
```

**Zwei Entry-Typen:** ein globaler Entry „Einstellungen“ (Singleton, beim ersten Raum automatisch angelegt) und ein Entry pro Raum. Hub in `hass.data[DOMAIN]`, Räume in `entry.runtime_data`.

**Storage** (`Store`): `variables`, `global_override {active, value, include_manual_off, snapshot}`, `rooms[entry_id] {schedules, active_schedule, mode, manual_temp}`. Konfiguration (TRVs, Frostschutz, Handänderungs-Verhalten, Sync) in `entry.options`.

**Zielberechnung pro Raum** (eine deterministische Funktion):
1. Globaler Override aktiv und Raum betroffen → Override-Wert
2. `off` → Frostschutz
3. `heat` → manuelle Temperatur
4. `auto` → Slot des aktiven Zeitplans (bei `until_next_slot` ggf. temporärer Hand-Wert)
5. Variable auflösen → auf Raum-Min/Max (Schnittmenge der TRVs) und Schrittweite begrenzen

Jede Zustandsänderung (Timer, Variable, Override, Modus, Zeitplan, TRV wieder verfügbar) → Ziel neu berechnen → an abweichende TRVs senden.

## 3. Entitäten

**Pro Raum (Gerät)**
- `climate.<raum>`: Mittelwert der verfügbaren TRVs, `hvac_action` heating wenn ≥1 heizt, Modi auto/heat/off
- `select.<raum>_zeitplan`: aktiver Zeitplan
- `sensor.<raum>_naechster_wechsel`: Timestamp, Attribut nächste Temperatur
- `binary_sensor.<raum>_pausiert`: Zeitplan wirkt gerade nicht (Manuell/Aus/Override)

**Global (Gerät „Best Thermostat“)**
- `number.<variable>` je Variable
- `switch.global_override` und `number.global_override_temperatur`
- `switch.global_override_alle_modi`

Der Raum-Switch „Zeitplan“ entfällt; das deckt `hvac_mode` ab.

## 4. Meilensteine

**M0 – Gerüst.** manifest, hacs.json, LICENSE, README, CI (hassfest, HACS-Action, ruff, mypy, pytest); leere Integration lädt.

**M1 – Zeitplanlogik als reines Modul.** Validierung (Slot ab 00:00, 15-min-Raster, 0,5 °C), aktiver Slot, nächster Wechsel über Mitternacht, DST (übersprungene Stunde → nächster gültiger Zeitpunkt, doppelte Stunde einmal), Variablenauflösung. Umfangreiche Unit-Tests.

**M2 – Raum-Backend.** Config Flow (Name, TRVs per Entity-Selector), Options Flow, Default-Zeitplan „Standard“ (Komfort/Absenk), Store, RoomController mit `async_track_point_in_time`, Sende-Queue, `climate` + `select` + `sensor`. Sofort setzen bei Start, Zeitplanwechsel, Wechsel auf auto.
*Abnahme: Raum mit 2 TRVs, Zeitplanwechsel, Neustart mitten im Slot.*

**M3 – Globale Variablen und Override.** Globaler Entry, number/switch-Entitäten, Nachziehen bei Änderung, Snapshot und persistente Wiederherstellung, Löschschutz für Variablen.

**M4 – Robustheit.** TRV-Listener: eigene Writes erkennen, Handänderung nach Raum-Einstellung, Sync auf andere TRVs, Nachsenden nach Reconnect, `unavailable` ignorieren, begrenzter Retry, Warnung bei selbstständigen TRV-Änderungen, `binary_sensor`.
*Abnahme: Handänderung am TRV, unavailable-TRV.*

**M5 – Services und WebSocket-API.** Services inkl. `get_schedule` mit Response und `set_schedule` mit JSON-Validierung. WS: Räume/Zeitpläne/Variablen listen; Zeitplan anlegen/umbenennen/duplizieren/löschen (aktiven nicht); Plan speichern; Subscribe auf Änderungen.

**M6 – Karte: Raumansicht.** Lit + TS, eine JS-Datei, automatische Registrierung. Ist/Soll, Heizstatus, Zeitplan-Chips, ±0,5, Modus, Zeitleiste heute, Kompaktmodus (4"-Display), visueller Karteneditor, Theme-Variablen hell/dunkel.

**M7 – Karte: Wocheneditor und Verwaltung.** 7 Balken × 24 h, Grenzen ziehen (15 min), Tap teilen/löschen/Temperatur oder Variable, Tag kopieren, Speichern/Verwerfen, Zeitplan- und Variablenverwaltung, smartphonetauglich.

**M8 – Release.** Optionale Übersichtskarte, Doku (TRV-interne Zeitpläne deaktivieren), Release-Workflow mit gebauter Karte, Tag `v0.1.0`, Test der Installation als HACS Custom Repository.

## 5. Akzeptanzkriterien v1

- [ ] Raum mit zwei TRVs per UI; beide erhalten zum Slot-Start dieselbe Temperatur
- [ ] Zwei Zeitpläne; Wechsel per select (auch per Szene) wirkt sofort
- [ ] Wochenplan in der Karte vollständig editierbar inkl. Tag kopieren; übersteht Neustart
- [ ] Handänderung am TRV verhält sich wie im Raum eingestellt und wird aufs zweite TRV übertragen
- [ ] Neustart mitten im Slot → korrektes Soll innerhalb 60 s
- [ ] Änderung einer Variable zieht alle betroffenen Räume sofort nach
- [ ] Globaler Override pausiert die betroffenen Räume; danach ist alles wie vorher, auch über einen Neustart hinweg
- [ ] unavailable-TRV blockiert nicht und wird nach Rückkehr nachsynchronisiert
- [ ] Karte kompakt auf 4"-Display, Editor auf Smartphone bedienbar
- [ ] HACS-Installation ohne manuelle Ressourcen-Konfiguration

## 6. Nicht in v1

Kesselsteuerung, PID/Ventilsteuerung, Fenster-offen, Anwesenheit, Boost, TRV-Offset, Urlaub mit Datum, Kalender-Anbindung.

## 7. Risiken

- Eigene Writes bei Z2M erkennen (Context geht verloren) → Wertvergleich + Zeitfenster, früh mit echten TRVs testen
- TRVs mit eigener Logik (Fenster, interner Plan) → Doku, Warnung, Modus `ignore`
- Automatische Lovelace-Ressource im YAML-Dashboard-Modus → Fallback `add_extra_js_url` und Hinweis in der Doku
