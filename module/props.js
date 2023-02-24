export function getProps() {
  const props = [
    {
      name: "Ausgleichen",
      desc: "Der Charakter verringert negative Würfelpool-Modifikatoren für Proben mit der verbundenen Fertigkeit für 1 AE oder KoP pro WPM.",
    },
    {
      name: "Bollwerk",
      desc: "Konkurrierende Proben gegen die verbundene Fertigkeiten verringern ihr Ergebnis um 1 pro AE bzw ZS oder KoP um 1. Das Ergebnis einer Verteidigungen oder Schutzprobe mit der verbundenen Fertigkeit kann um 1 pro AE oder KoP erhöht werden.",
    },
    {
      name: "Detailarbeit",
      desc: "Der Charakter kann eine Probe mit der verbundenen Fertigkeit zu einer langfristigen Probe machen und dafür +2 auf seine Probe erhalten. Für je +1 auf die Zeitstufe einer langfristigen Probe wird das Ergebnis der Probe um +1 erhöht (maximal insgesamt +5).",
    },
    {
      name: "Forcieren",
      desc: "Der Charakter fügt einer Probe mit der verbundenen Fertigkeit +1W für je 2 AE oder KoP hinzu. Er kann maximal die Stufe der verbundenen Fertigkeit als zusätzliche Würfel hinzufügen. Er kann der Probe so lange Würfel hinzufügen, wie die Spielleitung nicht das Ergebnis der Probe beschrieben hat.",
    },
    {
      name: "Reflexartig",
      desc: "Der Charakter kann für 1 KoP mit der verbundenen Fertigkeit auch dann Verteidigungen durchführen, wenn der Angreifer ihn nicht in der Initiative überholt.",
    },
    {
      name: "Routiniert",
      desc: "Die AE-Kosten sinken um 1 AE pro KoP bis zu einem Minimum von 2 AE. Bei langfristigen Aktionen wird die Zeitstufe um 1 für je 2 KoP gesenkt. Sinkt sie dadurch auf 0, wird aus der langfristigen Probe eine normale Fertigkeitsprobe.",
    },
    {
      name: "Schadensbegrenzung",
      desc: "Der Charakter ignoriert für 2 AE oder KoP einen Patzer.",
    },
    {
      name: "Versiert",
      desc: "Verzichtet der Charakter auf 1W für die Probe, erhöht er das Ergebnis der Probe um +2.",
    },
    {
      name: "Verstärkt",
      desc: "Übersteigt das Ergebnis den Schwierigkeitsgrad um 5 oder mehr, kann der Charakter 1 AE oder KoP ausgeben, um die Probe als kritischen Erfolg zu werten.",
    },
  ];
  return props;
}
export function getHandicaps() {
  return ["Berechenbar", "Gelähmt", "Geschwächt", "Omen", "Zögerlich"];
}

export function getTechProps() {
  const techProps = {
    Angepasst: {
      name: "Angepasst",
    },
    "Einfache Wartung": {
      name: "Einfache Wartung",
    },
    Fernsteuerung: {
      name: "Fernsteuerung",
    },
    Kontrollknoten: {
      name: "Kontrollknoten",
    },
    Faltsystem: {
      name: "Faltsystem",
    },
    Gepanzert: {
      name: "Gepanzert",
    },
    Hochtechnologie: {
      name: "Hochtechnologie",
    },
    Unkompliziert: {
      name: "Unkompliziert",
    },
  };
  return techProps;
}
export function getTechhandicaps() {
  return ["Harter Impuls", "Improvisiert", "Unhandlich"];
}
export function getCombatProps() {
  return [
    "Besondere Form",
    "Panzerbrechend",
    "Dauerangriff",
    "Reichweitenvorteil",
    "Schock",
    "Streuung",
  ];
}
export function getCombatHandicaps() {
  return ["Nachlademechanismus"];
}
