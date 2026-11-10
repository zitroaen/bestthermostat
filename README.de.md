# Best Thermostat

*[English version](README.md)*

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
| `calendar` | `calendar.arbeitszimmer_zeitraume` | Geplante Zeiträume (anlegen, ändern, löschen) |
| `sensor` | `sensor.arbeitszimmer_nachster_wechsel` | Nächster Slot-Wechsel (Attribut `next_temperature`) |
| `binary_sensor` | `binary_sensor.arbeitszimmer_zeitplan_pausiert` | Zeitplan wirkt gerade nicht (Attribut `reason`) |
| `number` | `number.best_thermostat_komfort` | Globale Variable (je Variable eine) |
| `number` | `number.best_thermostat_override_temperatur` | Temperatur des globalen Overrides |
| `switch` | `switch.best_thermostat_globaler_override` | Globaler Override an/aus |
| `switch` | `switch.best_thermostat_override_auch_fur_manuell` | Override gilt auch für Räume im Modus Manuell |
| `switch` | `switch.best_thermostat_override_auch_fur_aus` | Override gilt auch für Räume im Modus Aus (Frostschutz) |

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

| Priorität | Ebene |
|---|---|
| 1 | Globaler Override (Räume im Modus Auto immer, Räume in Manuell bzw. Aus nur, wenn der jeweilige Schalter an ist) |
| 2 | Änderung von Hand „bis zum nächsten Slot“ (endet spätestens mit dem nächsten Slot bzw. dem Zeitraum) |
| 3 | Zeitraum (bei Überschneidung gilt der **zuletzt angelegte**) |
| 4 | Raum: Aus → Frostschutz, Manuell → manuelle Temperatur, Auto → Slot des aktiven Zeitplans |

Override und Zeiträume verändern keine Raumzustände, sie liegen nur darüber (wie beim
BACnet-Prioritäts-Array). Deshalb ist nach ihrem Ende automatisch alles wie vorher, auch
über Neustarts hinweg. Die Raumkarte kann diese Ebenen anzeigen und markiert die, die
gerade bestimmt (Kartenoption `show_priorities`).

## Zeiträume (z. B. Gästemodus)

Ein **Zeitraum** aktiviert für eine bestimmte Zeit einen Zeitplan und/oder einen Modus,
z. B. „Arbeitszimmer: Zeitplan *Gast* von Fr 14:00 bis So 18:00“ oder „Bad: Aus, bis auf
Weiteres“. Danach läuft der Raum **genau wie vorher** weiter. Es wird nichts gemerkt und
zurückgeschrieben: Der Zeitraum ist eine eigene Ebene über dem Raum (wie beim
BACnet-Prioritäts-Array), beim Ende greift wieder die Ebene darunter.

- **Start** optional (Standard: jetzt), **Ende** optional (Standard: bis auf Weiteres),
  alternativ eine **Dauer**.
- Zeiträume werden gespeichert und laufen über Neustarts weiter.
- **Änderungen von Hand** während eines Zeitraums werden nach der Raum-Einstellung behandelt
  und enden spätestens mit dem Zeitraum. Im Modus Manuell/Aus eines Zeitraums passt eine
  Temperaturänderung die Temperatur des Zeitraums an.
- Wählst du am Raum **ausdrücklich einen Modus oder Zeitplan** (Karte, Raumthermostat,
  Select), endet der laufende Zeitraum.
- Ein Zeitplan, der von einem geplanten Zeitraum verwendet wird, lässt sich nicht löschen.

**In der Karte:** „Zeitraum planen“ in der Raumkarte öffnet einen Dialog: Zeitplan, Manuell
(mit Temperatur) oder Aus wählen, Beginn (jetzt oder Datum/Uhrzeit), Ende (bis auf
Weiteres oder Datum/Uhrzeit) und optional einen Titel. Aktive und geplante Zeiträume
werden aufgelistet; ein Tipp darauf öffnet sie zum Bearbeiten (alle Einstellungen, oder
beenden/löschen). „+N weitere“ klappt die vollständige Liste auf.

**Kalender:** Jeder Raum hat eine Entität `calendar.<raum>_zeitraume`. Dort siehst du alle
Zeiträume und kannst sie anlegen, ändern und löschen. Der Titel bestimmt, was passiert:
ein Zeitplan-Name („Gast“), „Aus“, „Auto“ oder eine Temperatur („Manuell 22“).

**Services** (auch für Agenten wie Hermes über einen MCP-Server):

```yaml
# Gästemodus jetzt bis auf Weiteres
action: bestthermostat.add_period
data:
  entity_id: climate.arbeitszimmer
  schedule: Gast
response_variable: result   # result.periods[0].id zum späteren Beenden

# Gästemodus von Freitag 14:00 bis Sonntag 18:00
action: bestthermostat.add_period
data:
  entity_id: climate.arbeitszimmer
  schedule: Gast
  start: "2026-11-13 14:00:00"
  end: "2026-11-15 18:00:00"

# Bad für 3 Stunden auf 23 °C
action: bestthermostat.add_period
data:
  entity_id: climate.bad
  temperature: 23
  duration: {hours: 3}

# Zeitraum beenden (ohne period_id: alle Zeiträume des Raums)
action: bestthermostat.cancel_period
data:
  entity_id: climate.arbeitszimmer
  period_id: 1a2b3c4d5e6f
```

`bestthermostat.get_schedule` liefert pro Raum auch `period` (aktiv) und `periods` (alle
geplanten).

## Karten

```yaml
type: custom:bestthermostat-card
entity: climate.arbeitszimmer
compact: false        # true für kleine Wanddisplays (z. B. Shelly Wall Display)
show_modes: true
show_schedules: true
show_timeline: true
show_editor: true
show_periods: true    # aktive/geplante Zeiträume und Button „Zeitraum planen“
show_priorities: false  # Prioritäten-Ebenen anzeigen und markieren, welche gerade bestimmt
```

```yaml
type: custom:bestthermostat-overview-card
title: Heizung
show_override: true
show_variables: true
show_periods: true    # nächsten geplanten Zeitraum je Raum anzeigen
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
| `bestthermostat.add_period` | Zeitraum planen: `schedule` und/oder `mode`/`temperature`, optional `start`, `end` oder `duration`, `summary`. Liefert die ID |
| `bestthermostat.update_period` | Zeitraum ändern (`period_id`; nur angegebene Felder ändern sich, `open_end` entfernt das Ende). ID und Priorität bleiben |
| `bestthermostat.cancel_period` | Zeitraum beenden/löschen (`period_id`, ohne ID: alle des Raums) |
| `bestthermostat.set_global_override` | `active`, `temperature`, `variable`, `include_manual`, `include_off` (`all_modes` setzt beide) |

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
