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
      desc: "Durch eine Aktivierung wird der Schwierigkeitsgrad auf 18 gesetzt, falls er vorher höher war. Jede weitere Aktivierung senkt den Schwierigkeitsgrad um 2. Bei Gruppenproben gilt der modifizierte Schwierigkeitsgrad.", 
      handicap: false,
    },
    {
      prop: "Bollwerk",
      desc: "Verteidigungen, Aufrappeln oder Schutzproben mit der verbundenen Fertigkeit haben durch eine Aktivierung automatisch einen Erfolg. Konkurrierende Proben gegen die verbundene Fertigkeit bzw. die verbundene Aktion verlieren bei einer Aktivierung den höchsten Würfel aus ihrer Probe.",
      handicap: false,
    },
    {
      prop: "Detailarbeit",
      desc: "Pro Aktivierung wird die benötigte Zeitstufe der Aktion auf das Ergebnis addiert. Der Charakter kann sich für eine Aktion (auch wenn es sich nicht um eine langfristige Probe handelt) beliebig viel Zeit lassen.",
      handicap: false,
    },
    {
      prop: "Effizient",
      desc: "Pro Aktivierung wird die benötigte Zeitstufe für Proben mit der verbundenen Fertigkeit um 1 reduziert.",
      handicap: false,
    },
    {
      prop: "Forcieren",
      desc: "Die Aktion wird bei einer Aktivierung automatisch als Erfolg gewertet. Die Probe muss trotzdem abgelegt werden. Bei einem Misserfolg oder Patzer bleibt der Erfolg zwar bestehen, aber die Effekte eines Misserfolgs bzw. eines Patzers kommen trotzdem zur Anwendung.",
      handicap: false,
    },
    {
      prop: "Reflexartig",
      desc: "Durch eine Aktivierung können Aktionen der verbundenen Fertigkeit als Verteidigungen eingesetzt werden. Die AE-Kosten sinken dadurch (wie bei allen Verteidigungen) auf 1 AE.",
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
      desc: "Konkurrierende Proben gegen diese Fertigkeiten addieren +2 auf ihr Ergebnis. Verteidigungen mit der verbundenen Fertigkeit werden vom Gegner ignoriert, wenn dieser ein Ergebnis von 16 oder höher hat. Durch eine Aktivierung werden diese Effekte ignoriert.",
      handicap: "true",
    },
    {
      prop: "Gelähmt",
      desc: "Ohne Aktivierung kosten alle Aktionen und Automatismen mit der verbundenen Fertigkeit 1 AE mehr.",
      handicap: "true",
    },
    {
      prop: "Geschwächt",
      desc: "Eine Probe mit dieser Fertigkeit erzielt nur einen kritischen Erfolg, wenn der dritte Würfel eine “10” zeigt.",
      handicap: "true",
    },
    {
      prop: "Omen",
      desc: "Der Charakter patzt bereits bei einem Ergebnis von 10 und darunter. Er kann eine Aktivierung durchführen, um diesen Effekt zu ignorieren.",
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
      desc: "Die drei höchsten Würfel einer Probe mit der verbundenen Handlung werden um je 1 pro Aktivierung erhöht. Dadurch kann die Regel der 10 ausgelöst werden.",
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
      desc: "Der Gegenstand schützt pro Größe einen Zustand (beginnend beim niedrigsten) auf einem festgelegten Zustandsmonitor (Körper, Technik, Cortex). Falls der Gegenstand nicht fest verbaut ist, kann er jeden anderen Gegenstand oder Charakter schützen, zu dem er physischen Kontakt hat. Wird ein geschützter Zustand ermittelt, senkt der Gegenstand den Schaden um seine (Modulklasse + Größe) x Aktivierungen.",
      handicap: false,
    },
    {
      prop: "Hochtechnologie",
      desc: "Die Modulklasse des Gegenstands gilt als um 1 pro Aktivierung höher, als sie eigentlich ist. Dies wirkt sich insbesondere auf Aktionen, Proben und Zeitstufen, aber nicht auf die Anzahl der verfügbaren Bots oder verwendbare Eigenschaften aus.",
      handicap: false,
    },
    {
      prop: "Kontrollknoten",
      desc: "Jede Eigenschaft wird auf alle angeschlossenen Geräte und Geräte im gleichen Netzwerk angewendet. Ein Gerät mit der Kontrollknoten-Eigenschaft kann eine Anweisung an alle Geräte im Netzwerk senden. Wird das Gerät von einem Cortex-Zustand betroffen, wird dieser Zustand auf alle  Geräte im gleichen Netzwerk angewandt. Durch eine Aktivierung werden mit dem verbundenen Automatismus “Backup-Bots” bis zu 3 Bots im Netzwerk regeneriert.",
      handicap: false,
    },
    {
      prop: "Regenerativ",
      desc: "Wenn diese Eigenschaft vergeben wird, wird eine Zustandsart (Körper, Technik, Cortex) festgelegt. Durch eine Aktivierung darf dieser Gegenstand eine Synthese-Probe (Schwelle) für die Aktion “Regeneration” ablegen. Ein Zustand, dessen Schwelle erreicht wurde, wird entfernt.",
      handicap: false,
    },
    {
      prop: "Threading",
      desc: "Die AE-Kosten der verbundenen Handlung sinken pro Aktivierung um 1. Werden die AE-Kosten auf 0 gesenkt, zählt die Handlung nicht gegen das Limit einer Handlungsphase.",
      handicap: false,
    },
    {
      prop: "Unkompliziert",
      desc: "Der Gegenstand darf nicht Ziel einer Cortex-Handlung sein und selbst keine Cortex-Handlungen ausführen. Der Gegenstand hat eine Elektronik oder Stromversorgung. Durch eine Aktivierung erhält eine Probe mit der verbundenen Handlung des Gegenstands einen zusätzlichen Würfel.",
      handicap: false,
    },
    {
      prop: "Vektorschub",
      desc: "Der Gegenstand kann sich durch den Automatismus “Vektorschub” eine Weile (ZS 1, 15min) in der Luft halten und mit seiner Bewegung fliegen. Pro Aktivierung erhöht sich die Zeitstufe, in der der Gegenstand fliegen kann, um 1",
      handicap: false,
    },
    {
      prop: "Synchronisiert",
      desc: "Durch eine Aktivierung wird die verbundene Aktion auf einem weiteren Gerät im gleichen Netzwerk durchgeführt.",
      handicap: false,
    },
  ];
  return props;
}
export function getTechhandicaps() {
  const props = [
    {
      prop: "Harter Impuls",
      desc: "Nach jeder Aktion mit dem Gegenstand muss der Charakter einen Automatismus oder eine Aktivierung durchführen, um ihn zu stabilisieren.",
      handicap: "true",
    },
    {
      prop: "Fehleranfällig",
      desc: "Ein Misserfolg wird wie ein Patzer behandelt, wenn keine Aktivierung durchgeführt wird.",
      handicap: "true",
    },
    {
      prop: "Gefährlich",
      desc: "Der Gegenstand fügt dem Anwender bei einem Misserfolg [Größe]W Schaden zu. Der Schaden kann durch eine Aktivierung verhindert werden.",
      handicap: "true",
    },
    {
      prop: "Unhandlich",
      desc: "Jede Aktion mit dem Gegenstand kostet 1 AE extra, wenn keine Aktivierung durchgeführt wird.",
      handicap: "true",
    },
    {
      prop: "Verbrauchsmaterial",
      desc: "Der Gegenstand verringert seine Größe um 1, wenn er erfolgreich angewendet wird. Durch kritische Erfolge oder eine Aktivierung wird dieses Handicap für eine Probe ignoriert.",
      handicap: "true",
    },
    {
      prop: "Zerbrechlich",
      desc: "Jeder Zustand, den der Gegenstand erleidet, muss mit einer Reparatur-Aktion entfernt werden. Durch eine Aktivierung können Zustände durch die normalen Regeln entfernt werden.",
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
      desc: "Nach einem Treffer darf der Charakter eine Aktivierung ausführen. Bis der Charakter Schaden nimmt oder eine andere Verteidigung durchführt, darf er einen Angriff gegen das Ziel durchführen, sobald dessen Handlungsphase beginnt. Sobald er seinen Dauerangriff einstellen möchte, wird er ans Ende der Initiativ-Reihenfolge gesetzt (siehe auch Warten). Ziele außerhalb von Deckung dürfen nicht “Warten”.",
      handicap: false,
    },
    {
      prop: "Einschlag",
      desc: "Erleidet das Ziel einen Zustand, verliert es bei einer Aktivierung zusätzlich 2 AE.",
      handicap: false,
    },
    {
      prop: "Lädieren",
      desc: "Erleidet das Ziel einen Zustand, kann es sich davon nicht erholen, bis es durch eine Behandeln-Aktion versorgt wird.",
      handicap: false,
    },
    {
      prop: "Leise",
      desc: "Der Durchschlag er Waffe wird für den Vergleich gegen den Sicherheitswert ignoriert.",
      handicap: false,
    },
    {
      prop: "Reichweitenvorteil",
      desc: "Durch eine Aktivierung verdoppeln Fernkampfangriffe und Terminals ihre Reichweiten. Nahkampfangriffe erhöhen die Größe für den Vergleich der Waffengröße um ihre Modulklasse.",
      handicap: false,
    },
    {
      prop: "Schock",
      desc: "Das Ziel verliert bei einer misslungen Schutzprobe 2 + Aktivierungen AE.",
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
      desc: 'Vor einem Angriff muss ein Automatismus zum Laden der Waffe durchgeführt werden. Ein Patzer blockiert die Waffe, welche mit der Aktion "Ladehemmung beseitigen”, die eine Schusswaffen-Probe (16) erfordert oder eine Aktivierung, behoben werden muss.',
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
