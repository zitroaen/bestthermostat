# Best Thermostat

Raumweise Heizungssteuerung für Home Assistant mit umschaltbaren Wochen-Zeitplänen,
globalen Temperatur-Variablen und einem globalen Override. Läuft komplett lokal und
steuert vorhandene Heizkörperthermostate (TRVs) über deren `climate`-Entitäten
(ZHA, Zigbee2MQTT, …). Eine eigene Lovelace-Karte mit Wocheneditor wird mitgeliefert.

Ersetzt Scheduler-Komponente, Climate Group, Template-Sensoren und eigene Automationen
durch eine Integration.

## Funktionen

- **Räume** mit 1..n Thermostaten. Jeder Raum ist ein Gerät mit eigenem Raumthermostat.
- **Mehrere Zeitpläne pro Raum** (z. B. „Arbeit“ und „Gast“), umschaltbar per
  `select`-Entität. Damit funktioniert das auch per Szene, Automation oder Sprache.
- **Slots** im 15-Minuten-Raster mit fester Temperatur oder einer **Variable**.
- **Globale Variablen** wie „Komfort“ und „Absenk“ als `number`-Entitäten. Eine Änderung
  wird sofort an alle betroffenen Räume weitergegeben.
- **Globaler Override**, z. B. wenn niemand zu Hause ist: pausiert die Zeitpläne. Nach dem
  Ausschalten ist alles wieder wie vorher.
- **Modi** über `hvac_mode`: `auto` folgt dem Zeitplan, `heat` heißt Manuell (feste
  Temperatur), `off` heißt Frostschutz.
- **Änderungen direkt am Thermostat** werden je Raum konfigurierbar behandelt (Manuell /
  bis zum nächsten Slot / ignorieren) und auf die anderen Thermostate im Raum übertragen.
- Robust gegen Neustarts, Sommer- und Winterzeit, nicht erreichbare Thermostate und
  unterschiedliche Geräte-Grenzen. Schreibvorgänge werden zeitversetzt gesendet, um das
  Zigbee-Netz zu schonen.

## Installation

1. HACS → Integrationen → ⋮ → *Benutzerdefinierte Repositories* →
   `https://github.com/zitroaen/bestthermostat`, Kategorie *Integration*.
2. „Best Thermostat“ installieren und Home Assistant neu starten.
3. *Einstellungen → Geräte & Dienste → Integration hinzufügen → Best Thermostat*,
   dann einen Raum anlegen. Der Eintrag „Best Thermostat“ für die globalen Einstellungen
   wird automatisch erzeugt.

Die Karte wird automatisch als Dashboard-Ressource eingetragen
(*Einstellungen → Dashboards → Ressourcen*). Eine manuelle Ressource ist **nicht** nötig.
Eine bereits von Hand angelegte Ressource für die Karte wird übernommen und bei Updates
automatisch auf die neue Version gesetzt. Bei Ressourcen im YAML-Modus wird die Karte
stattdessen als zusätzliches Frontend-Modul geladen. Die Integration lädt nur, wenn
mindestens ein Raum angelegt ist.
Das Integrations-Icon wird ab Home Assistant 2026.3 aus `brand/` angezeigt.

> **Wichtig:** Deaktiviere interne Zeitpläne, Fenster-offen-Logik und Ähnliches direkt an
> den Thermostaten. Sonst ändern sie die Solltemperatur selbstständig und es kommt zu
> Konflikten. Im Log erscheint dazu eine Warnung, wenn ein Raum auf „Ignorieren“ steht.

## Entitäten

| Entität | Beispiel | Zweck |
|---|---|---|
| `climate` | `climate.arbeitszimmer` | Raumthermostat. Ist-Temperatur = Mittelwert, heizt, wenn ein TRV heizt |
| `select` | `select.arbeitszimmer_zeitplan` | Aktiver Zeitplan |
| `sensor` | `sensor.arbeitszimmer_nachster_wechsel` | Nächster Slot-Wechsel (Attribut `next_temperature`) |
| `binary_sensor` | `binary_sensor.arbeitszimmer_zeitplan_pausiert` | Zeitplan wirkt gerade nicht (Attribut `reason`) |
| `number` | `number.best_thermostat_komfort` | Globale Variable (je Variable eine) |
| `number` | `number.best_thermostat_override_temperatur` | Temperatur des globalen Overrides |
| `switch` | `switch.best_thermostat_globaler_override` | Globaler Override an/aus |
| `switch` | `switch.best_thermostat_override_auch_fur_manuell_aus` | Override auch für Räume im Modus Manuell/Aus |

Die Entity-IDs hängen von der Sprache ab, in der der Raum angelegt wurde.

## Einstellungen

**Raum** (beim Anlegen und später über *Konfigurieren*):

- Thermostate des Raums
- Frostschutztemperatur für den Modus Aus (Standard 5 °C)
- Verhalten bei Änderungen von Hand im Auto-Modus:
  - *Raum auf Manuell schalten*
  - *Bis zum nächsten Slot halten* (Standard)
  - *Ignorieren und Plan wiederherstellen*: Gilt für Änderungen am Thermostat. Am
    Raumthermostat wirkt diese Einstellung wie „bis zum nächsten Slot“.
- Änderungen auf die anderen Thermostate übertragen (an/aus)
- Thermostate verstecken (an/aus): blendet die einzelnen TRV-Entitäten in Dashboards und
  bei Sprachassistenten aus, das Raumthermostat ersetzt sie. Von dir selbst versteckte
  Entitäten bleiben unberührt. Beim Ausschalten der Option, beim Entfernen eines TRVs aus
  dem Raum oder beim Löschen des Raums werden sie wieder eingeblendet.

**Global** (Eintrag „Best Thermostat“ → *Konfigurieren*): Variablen hinzufügen,
bearbeiten und löschen. Eine Variable, die noch in einem Zeitplan verwendet wird, lässt
sich nicht löschen. Variablen lassen sich auch in der Karte verwalten.

## Priorität der Solltemperatur

1. Globaler Override (wenn aktiv und der Raum betroffen ist)
2. Modus Aus → Frostschutz
3. Modus Manuell → manuelle Temperatur
4. Änderung von Hand „bis zum nächsten Slot“
5. Slot des aktiven Zeitplans (Variable aufgelöst)

Der Override verändert keine Raumzustände. Er liegt nur darüber. Deshalb ist nach dem
Ausschalten automatisch alles wie vorher, auch über Neustarts hinweg.

## Karten

```yaml
type: custom:bestthermostat-card
entity: climate.arbeitszimmer
compact: false        # true für kleine Wanddisplays (z. B. Shelly Wall Display)
show_modes: true
show_schedules: true
show_timeline: true
show_editor: true
```

```yaml
type: custom:bestthermostat-overview-card
title: Heizung
show_override: true
show_variables: true
```

In der Übersichtskarte öffnet ein Tipp auf eine Variable einen Regler (− / +). Unter jedem
Raum gibt es Bubbles für Auto / Manuell / Aus und, bei mehreren Zeitplänen, für den
aktiven Zeitplan.

Beide Karten haben einen visuellen Editor. Der Wocheneditor öffnet sich über
„Wochenplan bearbeiten“:

- Abschnitt antippen, um ihn zu bearbeiten (Temperatur, Variable, teilen, löschen)
- Grenzen ziehen, um sie zu verschieben (15-Minuten-Raster)
- Einen Tag auf andere Tage kopieren
- Zeitpläne anlegen, umbenennen, duplizieren und löschen (nicht den aktiven)
- Änderungen werden erst mit **Speichern** übernommen

## Services

| Service | Zweck |
|---|---|
| `bestthermostat.set_active_schedule` | Zeitplan aktivieren (`entity_id`, `schedule`: Name oder ID) |
| `bestthermostat.set_mode` | `auto` / `heat` / `off`, optional `temperature` |
| `bestthermostat.get_schedule` | Liefert Zustand und Wochenpläne als Response |
| `bestthermostat.set_schedule` | Wochenplan als JSON setzen (legt den Zeitplan bei Bedarf an) |
| `bestthermostat.set_variable` | Variable ändern (`variable`: ID oder Name, `value`, `name`) |
| `bestthermostat.set_global_override` | `active`, `temperature`, `variable`, `all_modes` |

Format eines Wochenplans:

```json
{
  "mon": [
    {"start": "00:00", "variable": "eco"},
    {"start": "06:00", "variable": "comfort"},
    {"start": "22:00", "temperature": 17.5}
  ],
  "tue": [...], "wed": [...], "thu": [...], "fri": [...], "sat": [...], "sun": [...]
}
```

Jeder Tag braucht einen Slot ab `00:00`. Ein Slot gilt bis zum Start des nächsten Slots,
über Mitternacht hinweg. Erlaubt sind Zeiten im 15-Minuten-Raster und Temperaturen in
0,5-°C-Schritten.

## Entwicklung

```bash
pip install -r requirements_test.txt
ruff check . && mypy custom_components/bestthermostat && pytest

cd frontend && npm ci && npm run build   # baut custom_components/bestthermostat/frontend/bestthermostat-card.js
```

Die gebaute Karte wird mit eingecheckt, damit die Installation über HACS ohne
Build-Schritt funktioniert. Ein Release entsteht durch einen Tag `vX.Y.Z`, der zur
`version` in `manifest.json` passen muss.

## Lizenz

MIT
