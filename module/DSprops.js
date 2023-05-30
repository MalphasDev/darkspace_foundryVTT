import * as darkspace from "./config.js";
export default class Prop {
  constructor(value) {
    //const element = event.currentTarget;
    //const system = this.object.system;
    //const dataset = element.dataset;
    //const slotIdent = "slot" + dataset.index;
    this.value = value;
  }
}
export function edit(event, context) {
  const element = event.currentTarget;
  const system = context.object.system;
  const dataset = element.dataset;
  const slotIdent = "slot" + dataset.index;
  const propAdresse = "system.props." + slotIdent;

  const propData = {
    ...context.object,
    ...system.props[slotIdent],
    prop: system.props[slotIdent].prop,
    action: system.props[slotIdent].action,
    descAdresse: propAdresse + ".desc",
    handicapAdresse: propAdresse + ".handicap",
    slot: slotIdent,
    ownertype: context.object.type,
    config: darkspace.darkspace,
  };

  return propData;
}
export function getProps() {
  // Hier sollen die fertigen Eigenschaften mit Name und Regeln rein, damit sie später per Dropdown(?) auswählen kann.
  const props = [
    {
      prop: "Ausgleichen",
      desc: "Durch eine Aktivierung wird der Schwierigkeitsgrad oder die Schwelle auf 18 gesetzt, falls sie vorher höher waren. Negative Würfelpoolmodifikatoren werden ignoriert. Bei Gruppenproben gilt der modifizierte Schwierigkeitsgrad.", 
      handicap: false,
    },
    {
      prop: "Bollwerk",
      desc: "Verteidigungen, Schutzproben mit der verbundenen Fertigkeit und Handlungen zum entfernen von Zuständen haben durch eine Aktivierung automatisch einen Erfolg. Konkurrierende Proben gegen die verbundene Fertigkeit bzw. die verbundene Aktion verlieren bei einer Aktivierung den höchsten Würfel aus ihrer Probe.",
      handicap: false,
    },
    {
      prop: "Detailarbeit",
      desc: "Pro Aktivierung wird die benötigte Zeitstufe x 2 der Aktion auf das Ergebnis addiert.",
      handicap: false,
    },
    {
      prop: "Effizient",
      desc: "Pro Aktivierung wird die benötigte Zeitstufe für Proben mit der verbundenen Fertigkeit um 1 reduziert.",
      handicap: false,
    },
    {
      prop: "Forcieren",
      desc: "Durch eine Aktivierung lösen zusätzlich alle Würfel, die eine 1 oder 2 zeigen, ebenfalls die Regel der 10 (S. 6) aus.",
      handicap: false,
    },
    {
      prop: "Reflexartig",
      desc: "Durch eine Aktivierung können Aktionen der verbundenen Fertigkeit als Verteidigungen (S. 39) eingesetzt werden. Die AE-Kosten sinken dadurch (wie bei allen Verteidigungen) auf 1 AE.",
      handicap: false,
    },
    {
      prop: "Routiniert",
      desc: "Dem Würfelwurf wird bei einer Aktivierung automatisch eine 10 hinzugefügt (die aber nicht die Regel der 10 auslöst).",
      handicap: false,
    },
    {
      prop: "Versiert",
      desc: "Übersteigt das Ergebnis den Schwierigkeitsgrad um 5 oder mehr, kann die Probe durch eine Aktivierung als kritischen Erfolg gewertet werden.",
      handicap: false,
    },
    {
      prop: "Verstärkt",
      desc: "Pro Aktivierung wird dem Ergebnis der Probe der nächst höhere Würfel oder +2 hinzugefügt.",
      handicap: false,
    },
  ];
  return props;
}
export function getHandicaps() {
  const props = [
    {
      prop: "Berechenbar",
      desc: "Konkurrierende Proben gegen die verbundene Fertigkeiten addieren +2 auf ihr Ergebnis. Verteidigungen werden vom Gegner ignoriert, wenn dieser die verbundene Fertigkeit benutzt.",
      handicap: "true",
    },
    {
      prop: "Gelähmt",
      desc: "Alle Handlungen mit der verbundenen Fertigkeit kosten doppelt so viele AE.",
      handicap: "true",
    },
    {
      prop: "Geschwächt",
      desc: "Eine Probe mit dieser Fertigkeit erzielt nur einen kritischen Erfolg, wenn der dritte Würfel eine “10” zeigt.",
      handicap: "true",
    },
    {
      prop: "Omen",
      desc: "Der Charakter patzt bereits bei einem Ergebnis von 10 und darunter.",
      handicap: "true",
    },
    {
      prop: "Zögerlich",
      desc: "Langfristige Aktionen erhöhen ihre Zeitstufe um 1, wenn keine Aktivierung durchgeführt wird.",
      handicap: "ture",
    },
  ];
  return props;
}
export function getTechProps() {
  const props = [
    {
      prop: "Angepasst",
      desc: "Nachdem alle Würfel sortiert wurden, kann auf einen beliebigen Würfel die Modulklasse des Gegenstandes addiert werden. Er verändert dadurch nicht seine Position in der Ordnung und kann dadurch auch einen Wert über 10 annehmen. Für jede weitere Aktivierung kann die Modulklasse auf einen anderen Würfel addiert werden.",
      handicap: false,
    },
    {
      prop: "Erhöhte Reichweite",
      desc: "Verbundene Aktionen haben eine Reichweite von MK² x 5 Metern. Die Reichweite wird durch eine Aktivierung verdoppelt.",
      handicap: false,
    },
    {
      prop: "Faltsystem",
      desc: "Der Charakter benutzt einen Automatismus, wodurch der Gegenstand seine Größe um 1 senkt. Auf dieselbe Art und Weise kann der Gegenstand auch wieder entfaltet werden. Im gefalteten Zustand kann eine verbundene Aktion mit dem Gegenstand nur genutzt werden, wenn eine Aktivierung durchgeführt wird.",
      handicap: false,
    },
    {
      prop: "Gepanzert",
      desc: "Der Gegenstand schützt einen vorher festgelegten Zustandsmonitor (Körper, Technik, Cortex). Falls der Gegenstand nicht fest verbaut ist, kann er jeden anderen Gegenstand oder Charakter schützen, zu dem er physischen Kontakt hat. Erleidet ein gepanzerter Monitor Schaden, senkt der Gegenstand den Schaden um seine (Modulklasse + Größe) x Aktivierungen.",
      handicap: false,
    },
    {
      prop: "Hochtechnologie",
      desc: "Die Modulklasse des Gegenstands gilt als um 1 pro Aktivierung höher, als sie eigentlich ist. Dies wirkt sich insbesondere auf Aktionen, Proben und Zeitstufen, aber nicht auf die Anzahl der verfügbaren Bots oder verwendbare Eigenschaften aus.",
      handicap: false,
    },
    {
      prop: "Kontrollknoten",
      desc: "Alle Handlungen gegen Geräte im Netzwerk werden zum Kontrollknoten umgeleitet. Der Kontrollknoten darf die Eigenschaften aller Geräte im Netzwerk nutzen, als hätte er sie selbst, muss sie aber selbst aktivieren.",
      handicap: false,
    },
    {
      prop: "Regenerativ",
      desc: "Wenn diese Eigenschaft vergeben wird, wird ein Monitor (Körper, Technik, Cortex) festgelegt. Pro Aktivierung heilt der Gegenstand entweder einen eigenen Zustand oder den Zustand auf dem gewählten Monitor von etwas, zu das er physischen Kontakt hat. Die Stufe des Zustandes darf die Modulklasse des Gegenstandes nicht überschreiten.",
      handicap: false,
    },
    {
      prop: "Threading",
      desc: "Die AE-Kosten der verbundenen Handlung sinken pro Aktivierung um 1. Werden die AE-Kosten auf 0 gesenkt, zählt die Handlung nicht gegen das Limit einer Handlungsphase.",
      handicap: false,
    },
    {
      prop: "Unkompliziert",
      desc: "Der Gegenstand darf nicht Ziel einer Cortex-Handlung sein und selbst keine Cortex-Handlungen ausführen. Der Gegenstand hat keine Elektronik oder Stromversorgung. Durch eine Aktivierung erhält eine Probe mit der verbundenen Handlung des Gegenstands einen zusätzlichen Würfel.",
      handicap: false,
    },
    {
      prop: "Vektorschub",
      desc: "Der Gegenstand kann sich durch 15min (ZS 1) in der Luft halten und mit [Leistung ³ x MK x 4]m pro Bewegung fliegen. Pro Aktivierung erhöht sich die Zeitstufe, in der der Gegenstand fliegen kann, um 1.",
      handicap: false,
    },
    {
      prop: "Synchronisiert",
      desc: "Durch eine Aktivierung wird der Effekt der verbundenen Aktion auf einem weiteren Gerät im gleichen Netzwerk durchgeführt.",
      handicap: false,
    },
  ];
  return props;
}
export function getTechhandicaps() {
  const props = [
    {
      prop: "Einseitig",
      desc: "Mit dem Gegenstand kann nur die verbundene Aktion durchgeführt werden.",
      handicap: "true",
    },
    {
      prop: "Fehleranfällig",
      desc: "Der Würfelpool wird durch die Modulklasse des Gegenstandes begrenzt.",
      handicap: "true",
    },
    {
      prop: "Harter Impuls",
      desc: "Nach jeder Handlung mit dem Gegenstand verliert der Charakter 1 AE.",
      handicap: "true",
    },
    {
      prop: "Gefährlich",
      desc: "Der Gegenstand fügt dem Anwender bei einem Misserfolg [MK]W + [Größe] x 10 Schaden zu.",
      handicap: "true",
    },
    {
      prop: "Unhandlich",
      desc: "Der Würfelpool wird durch die Größe des Gegenstandes begrenzt.",
      handicap: "true",
    },
    {
      prop: "Verbrauchsmaterial",
      desc: "Bei der Vergabe dieses Handicaps wird entweder die MK oder Größe des Gegenstandes festgelegt. Der Gegenstand senkt den gewählten Wert um 1, wenn er erfolgreich angewendet wird.",
      handicap: "true",
    },
    {
      prop: "Zerbrechlich",
      desc: "Alle Schwierigkeitsgrade, um Zustände zu entfernen werden auf 20 gehoben. Ein Misserfolg zerstört den Gegenstand.",
      handicap: "ture",
    },
  ];
  return props;
}
export function getCombatProps() {
  const props = [
    {
      prop: "Besondere Form",
      desc: "Angriffe, die keinen Schaden verursachen, erhöhen das Ergebnis der Probe um die MK + Aktivierung der Waffe.",
      handicap: false,
    },
    {
      prop: "Panzerbrechend",
      desc: "Schutzproben können keine kritischen Erfolge erzielen. Ein kritischer Treffer verhindert Schutzproben und erhöht den Schaden um 1 pro Aktivierung.",
      handicap: false,
    },
    {
      prop: "Dauerangriff",
      desc: "Nach einem Treffer darf der Charakter eine Aktivierung ausführen. Bis der Charakter Schaden nimmt oder eine andere Verteidigung durchführt, darf er einen Angriff gegen das Ziel durchführen, sobald dessen Handlungsphase beginnt. Sobald er seinen Dauerangriff einstellen möchte, wird der Charakter ans Ende der Initiativ-Reihenfolge gesetzt. Ziele außerhalb von Deckung dürfen nicht “Warten”.",
      handicap: false,
    },
    {
      prop: "Einschlag",
      desc: "Erleidet das Ziel einen Zustand, erleidet es bei einer Aktivierung zusätzlich +1W Schaden und wird zu Boden geworfen. ",
      handicap: false,
    },
    {
      prop: "Lädieren",
      desc: "Erleidet das Ziel einen Zustand durch die verbundene Aktion, kann eine Aktivierung durchgeführt werden. Alle Schwierigkeitsgrade, um Zustände zu entfernen werden auf 20 gesetzt. ",
      handicap: false,
    },
    {
      prop: "Panzerbrechend",
      desc: "Durch eine Aktivierung können Schutzproben können keine kritischen Erfolge erzielen. Eine zweite Aktivierung verhindert Schutzproben vollständig.",
      handicap: false,
    },
    {
      prop: "Reichweitenvorteil",
      desc: "Die maximale Reichweite wird durch die Modulklasse multipliziert. Durch eine Aktivierung verlieren Waffen ihre ideale Reichweite und haben keine Abzüge bis zu ihrer maximalen Reichweite. Nahkampfangriffe erhöhen die Größe für den Vergleich der Waffengröße um ihre Modulklasse.",
      handicap: false,
    },
    {
      prop: "Schalldämpfer",
      desc: "Die Waffe gilt nicht als Fernkampfwaffe für die Regel „Laut und Tödlich“. Durch eine Aktivierung wird der Sicherheitswert bei einem Angriff ignoriert.",
      handicap: false,
    },
    {
      prop: "Schock",
      desc: "Das Ziel verliert bei einer misslungenen Schutzprobe [2 + Aktivierungen] AE.",
      handicap: false,
    },
    {
      prop: "Streuung",
      desc: "Pro Aktivierung wird 1 zusätzliches Ziel getroffen.",
      handicap: false,
    },
    {
      prop: "Zielsuchend",
      desc: "Wird bei einem Angriff ein kritischer Erfolg erzielt, kann der Schaden um 5 pro Aktivierung erhöht werden.",
      handicap: false,
    },
  ];
  return props;
}
export function getCombatHandicaps() {
  const props = [
    {
      prop: "Lademechanismus",
      desc: 'Vor einem Angriff muss ein Automatismus zum Laden der Waffe durchgeführt werden. Ein Patzer blockiert die Waffe, welche mit der Aktion „Ladehemmung beseitigen”, die eine Schusswaffen-Probe (16) erfordert oder eine Aktivierung, behoben werden muss.',
      handicap: "true",
    },
    {
      prop: "Nicht-Tödlich",
      desc: 'Ein Angriff mit der Waffe kann nur die ermittelten Zustände erzeugen und keine Zustände stapeln.',
      handicap: "true",
    },
    {
      prop: "Verringerte Reichweite",
      desc: "Die Reichweite von Fernkampfwaffen wird halbiert. Bei Nahkampfwaffen gilt die Waffe für den Vergleich der Waffengröße immer kleiner als die des Gegners.",
      handicap: "true",
    },
  ];
  return props;
}
