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
      desc: "Der Charakter ignoriert negative Würfelpool-Modifikatoren und Erschwernisse für Proben mit der verbundenen Fertigkeit für eine Aktion pro Aktivierung.",
      handicap: false,
    },
    {
      prop: "Bollwerk",
      desc: "Verteidigungen, Aufrappeln oder Schutzproben mit der verbundenen Fertigkeit haben durch eine Aktivierung automatisch einen Erfolg. Konkurrierende Proben gegen die verbundene Fertigkeit bzw. die verbundene Aktion verlieren bei einer Aktivierung den höchsten Würfel aus ihrer Probe.",
      handicap: false,
    },
    {
      prop: "Detailarbeit",
      desc: "Durch eine Aktivierung wird die benötigte Zeitstufe der Aktion auf das Ergebnis addiert. Der Charakter kann sich für eine Aktion (auch wenn es sich nicht um eine langfristige Probe handelt) beliebig viel Zeit lassen.",
      handicap: false,
    },
    {
      prop: "Effizient",
      desc: "Durch eine Aktivierung wird die benötigte Zeitstufe für Proben mit der verbundenen Fertigkeit um 1 reduziert.",
      handicap: false,
    },
    {
      prop: "Forcieren",
      desc: "Die Aktion wird bei einer Aktivierung automatisch als Erfolg gewertet. Die Probe muss trotzdem abgelegt werden. Bei einem Misserfolg oder Patzer bleibt der Erfolg zwar bestehen, aber es kommt zu unerwünschten Nebenwirkungen.",
      handicap: false,
    },
    {
      prop: "Reflexartig",
      desc: "Durch eine Aktivierung können Aktionen der verbundenen Fertigkeit als Verteidigungen eingesetzt werden. Die AE-Kosten sinken dadurch (wie bei allen Verteidigungen) auf 1.",
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
      desc: "Pro Aktivierung wird das Ergebnis der Probe um +2 erhöht.",
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
