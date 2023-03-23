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
      desc: "Der Charakter verringert negative Würfelpool-Modifikatoren für Proben mit der verbundenen Fertigkeit für 1 AE oder KoP pro WPM.",
      handicap: false,
    },
    {
      prop: "Bollwerk",
      desc: "Konkurrierende Proben gegen die verbundene Fertigkeiten verringern ihr Ergebnis um 1 pro AE bzw ZS oder KoP um 1. Das Ergebnis einer Verteidigungen oder Schutzprobe mit der verbundenen Fertigkeit kann um 1 pro AE oder KoP erhöht werden.",
      handicap: false,
    },
    {
      prop: "Detailarbeit",
      desc: "Der Charakter kann eine Probe mit der verbundenen Fertigkeit zu einer langfristigen Probe machen und dafür +2 auf seine Probe erhalten. Für je +1 auf die Zeitstufe einer langfristigen Probe wird das Ergebnis der Probe um +1 erhöht (maximal insgesamt +5).",
      handicap: false,
    },
    {
      prop: "Forcieren",
      desc: "Der Charakter fügt einer Probe mit der verbundenen Fertigkeit +1W für je 2 AE oder KoP hinzu. Er kann maximal die Stufe der verbundenen Fertigkeit als zusätzliche Würfel hinzufügen. Er kann der Probe so lange Würfel hinzufügen, wie die Spielleitung nicht das Ergebnis der Probe beschrieben hat.",
      handicap: false,
    },
    {
      prop: "Reflexartig",
      desc: "Der Charakter kann für 1 KoP mit der verbundenen Fertigkeit auch dann Verteidigungen durchführen, wenn der Angreifer ihn nicht in der Initiative überholt.",
      handicap: false,
    },
    {
      prop: "Routiniert",
      desc: "Die AE-Kosten sinken um 1 AE pro KoP bis zu einem Minimum von 2 AE. Bei langfristigen Aktionen wird die Zeitstufe um 1 für je 2 KoP gesenkt. Sinkt sie dadurch auf 0, wird aus der langfristigen Probe eine normale Fertigkeitsprobe.",
      handicap: false,
    },
    {
      prop: "Schadensbegrenzung",
      desc: "Der Charakter ignoriert für 2 AE oder KoP einen Patzer.",
      handicap: false,
    },
    {
      prop: "Versiert",
      desc: "Verzichtet der Charakter auf 1W für die Probe, erhöht er das Ergebnis der Probe um +2.",
      handicap: false,
    },
    {
      prop: "Verstärkt",
      desc: "Übersteigt das Ergebnis den Schwierigkeitsgrad um 5 oder mehr, kann der Charakter 1 AE oder KoP ausgeben, um die Probe als kritischen Erfolg zu werten.",
      handicap: false,
    },
  ];
  return props;
}
export function getHandicaps() {
  const props = [
    {
      prop: "Berechenbar",
      desc: "Konkurrierende Proben gegen diese Fertigkeiten addieren +2 auf ihr Ergebnis. Verteidigungen mit der verbundenen Fertigkeit werden vom Gegner ignoriert, wenn dieser ein Ergebnis von 18 oder höher hat. Setzt der Charakter 1 KP oder AE ein, wird dieser Effekt ignoriert.",
      handicap: "true",
    },
    {
      prop: "Gelähmt",
      desc: "Alle Aktionen und Automatismen mit der verbundenen Fertigkeit kosten 2 AE mehr.",
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
      desc: "Langfristige Aktionen erhöhen ihre Zeitstufe um 1.",
      handicap: "ture",
    },
  ];
  return props;
}
export function getTechProps() {
  const props = [
    {
      prop: "Angepasst",
      desc: "Die drei höchsten Würfel einer Probe mit dem Gegenstand werden um je 1 pro Aktivierung erhöht.",
      handicap: false,
    },
    {
      prop: "Erhöhte Reichweite",
      desc: "Dadurch kann die Regel der 10 ausgelöst werden.",
      handicap: false,
    },
    {
      prop: "Faltsystem",
      desc: "Verbundene Aktionen haben eine Reichweite von MK² x 5 Metern. Die Reichweite wird durch eine Aktivierung verdoppelt.",
      handicap: false,
    },
    {
      prop: "Gepanzert",
      desc: "Der Charakter benutzt einen Automatismus, wodurch der Gegenstand seine Größe um 1 senkt. Auf dieselbe Art und Weise kann der Gegenstand auch wieder entfaltet werden.",
      handicap: false,
    },
    {
      prop: "Hochtechnologie",
      desc: "Der Gegenstand ist nicht verwendbar, solange er zusammengefaltet ist.",
      handicap: false,
    },
    {
      prop: "Kontrollknoten",
      desc: "Der Gegenstand schützt pro Größe einen Zustand (beginnend beim niedrigsten) auf einem festgelegten Zustandsmonitor (Körper, Technik, Cortex). Falls der Gegenstand nicht fest verbaut ist, kann er jeden anderen Gegenstand oder Charakter schützen, zu dem er physischen Kontakt hat.",
      handicap: false,
    },
    {
      prop: "Regenerativ",
      desc: "Wird ein geschützter Zustand ermittelt, senkt der Gegenstand den Schaden um seine Modulklasse + Größe plus Aktivierungen.",
      handicap: false,
    },
    {
      prop: "Synchronisiert",
      desc: "Die Modulklasse des Gegenstands gilt als um 1 pro Aktivierung höher, als sie eigentlich ist. Dies wirkt sich insbesondere auf Modulklassen-Proben und Zeitstufen, aber nicht auf die Anzahl der verfügbaren Bots aus.",
      handicap: false,
    },
  ];
  return props;
}
export function getTechhandicaps() {
  const props = [
    {
      prop: "Harter Impuls",
      desc: "Nach jeder Aktion mit dem Gegenstand muss der Charakter einen Automatismus durchführen, um ihn zu stabilisieren.",
      handicap: "true",
    },
    {
      prop: "Fehleranfällig",
      desc: "Ein Misserfolg wird wie ein Patzer behandelt.",
      handicap: "true",
    },
    {
      prop: "Unhandlich",
      desc: "Jede Aktion mit dem Gegenstand kostet 2 AE extra.",
      handicap: "true",
    },
    {
      prop: "Verbrauchsmaterial",
      desc: "Der Gegenstand verringert seine Größe um 1, wenn er erfolgreich angewendet wird. Durch kritische Erfolge wird dieses Handicap ignoriert.",
      handicap: "true",
    },
    {
      prop: "Zerbrechlich",
      desc: "Jeder Zustand, den der Gegenstand erleidet, muss mit einer Reparatur-Aktion entfernt werden.",
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
      desc: "Nach einem Treffer darf der Charakter einen Automatismus ausführen, um das Ziel mit dem Ergebnis -1 des ursprünglichen Angriffes erneut zu treffen.",
      handicap: false,
    },
    {
      prop: "Einschlag",
      desc: "Nach jedem weiteren Automatismus verringert sich das Ergebnis um 1.",
      handicap: false,
    },
    {
      prop: "Lädieren",
      desc: "Führt der Charakter eine andere Aktion oder Automatismus durch, oder wird die Schusslinie unterbrochen bzw. der Nahkampf aufgelöst, kann er diesen Automatismus nicht mehr einsetzen, solange er nicht einen neuen Dauerangriff durchführt.",
      handicap: false,
    },
    {
      prop: "Reichweitenvorteil",
      desc: "Erleidet das Ziel einen Zustand, verliert es bei einer Aktivierung zusätzlich 4 AE.",
      handicap: false,
    },
    {
      prop: "Schock",
      desc: "Erleidet das Ziel einen Zustand, kann es sich davon nicht erholen, bis es durch eine Aktion behandelt wird, die eine Medizin-Probe (16) erfordert.",
      handicap: false,
    },
  ];
  return props;
}
export function getCombatHandicaps() {
  const props = [
    {
      prop: "Lademechanismus",
      desc: 'Vor einem Angriff muss ein Automatismus zum Laden der Waffe durchgeführt werden. Ein Patzer blockiert die Waffe, welche mit der Standardaktion "Ladehemmung beseitigen”, die eine Schusswaffen-Probe (16) erfordert oder eine Aktivierung, behoben werden muss.',
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
