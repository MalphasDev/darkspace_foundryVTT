import * as props from "./DSprops.js";

export const darkspace = {};

darkspace.props = {
  props: props.getProps(),
  handicaps: props.getHandicaps(),
  techprops: props.getTechProps(),
  techHandicaps: props.getTechhandicaps(),
  combatProps: props.getCombatProps(),
  combatHandicaps: props.getCombatHandicaps(),
};
// Zustände erfassen

darkspace.label = {
  body: {
    struck: { symbol: "fa-solid fa-dizzy" },
    wounded: {
      symbol: "fa-solid fa-band-aid",
    },
    ko: { symbol: "fa-solid fa-times-circle" },
    crippled: {
      symbol: "fa-solid fa-user-injured",
    },
    dead: {
      symbol: "fa-solid fa-skull",
    },
  },
  tech: {
    scratched: { symbol: "fa-solid fa-exclamation-triangle" },
    unstable: { symbol: "fa-solid fa-times-circle" },
    offline: { symbol: "fa-solid fa-battery-quarter" },
    defect: {
      symbol: "fa-solid fa-car-crash",
    },
    destroyed: {
      symbol: "fa-solid fa-ban",
    },
  },
  cortex: {
    ram: { symbol: "fa-solid fa-memory" },
    cpu: { symbol: "fa-solid fa-microchip" },
    interface: { symbol: "fa-solid fa-address-card" },
    logindata: { symbol: "fa-solid fa-terminal" },
    rights: { symbol: "fa-solid fa-list-check" },
  },
};

// Stellt Liste mit Attributen und Fertigkeiten zusammen
const tempTree = fetch("systems/darkspace/template.json")
  .then((response) => response.json())
  .then((tempData) => {
    return tempData;
  });

const statLists = async (actorType) => {
  const a = await tempTree;

  let dicepoolList = Object.keys(a.Actor[actorType].stats);
  let skillList = [];

  dicepoolList.forEach((dicepool) => {
    skillList = skillList.concat(
      Object.keys(a.Actor[actorType].stats[dicepool].skill)
    );
  });
  darkspace.statLists = {
    ...darkspace.statLists,
    [actorType]: { dicepoolList, skillList },
  };
};

const accessTempTree = () => {
  const actorTypes = ["Charakter", "Cyborg", "KI", "Maschine"];
  actorTypes.forEach((actorType) => {
    statLists(actorType);
  });
};

accessTempTree();

// Hilfsfunktion die ein Array in ein Objekt mit einem Wert und einem Boolean-Zustand umbaut.
const convertArrayToObject = (array) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [Object.keys(obj).length]: { value: item, active: false },
    };
  }, initialValue);
};
