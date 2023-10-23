import * as props from "./DSprops.js";

export const darkspace = {};
console.log(darkspace);

darkspace.props = {
  props: props.getProps(),
  handicaps: props.getHandicaps(),
  techprops: props.getTechProps(),
  techHandicaps: props.getTechhandicaps(),
  combatProps: props.getCombatProps(),
  combatHandicaps: props.getCombatHandicaps(),
};
// Zustände erfassen

darkspace.bodyConditionLabel = {
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
};
darkspace.techConditionLabel = {
  scratched: { symbol: "fa-solid fa-exclamation-triangle"},
  unstable: { symbol: "fa-solid fa-times-circle" },
  offline: { symbol: "fa-solid fa-battery-quarter" },
  defect: {
    symbol: "fa-solid fa-car-crash",
  },
  destroyed: {
    symbol: "fa-solid fa-ban",
  },
};
darkspace.cortexConditionLabel = {
  ram: { symbol: "fa-solid fa-memory" },
  cpu: { symbol: "fa-solid fa-microchip" },
  interface: { symbol: "fa-solid fa-address-card" },
  logindata: { symbol: "fa-solid fa-terminal"},
  rights: {symbol: "fa-solid fa-list-check"},
};

// Stellt Liste mit Attributen und Fertigkeiten zusammen
const tempTree = fetch("systems/darkspace/template.json")
  .then((response) => response.json())
  .then((tempData) => {
    return tempData;
  });

const accessTempTree = () => {
  tempTree.then((a) => {
    let attrList = Object.keys(a.Actor.Charakter.stats);
    let skillList = [];
    darkspace.attrList = attrList;

    attrList.forEach((attr) => {
      skillList = skillList.concat(
        Object.keys(a.Actor.Charakter.stats[attr].skill)
      );
    });
    darkspace.skillList = skillList.sort();
  });
  tempTree.then((a) => {
    let attrListCyborg = Object.keys(a.Actor.Cyborg.stats);
    let skillListCyborg = [];
    darkspace.attrListCyborg = attrListCyborg;

    attrListCyborg.forEach((attr) => {
      skillListCyborg = skillListCyborg.concat(
        Object.keys(a.Actor.Cyborg.stats[attr].skill)
      );
    });
    darkspace.skillListCyborg = skillListCyborg.sort();
  });

  // tempTree.then((a) => {
  //   let attrListNpc = Object.keys(a.Actor.Nebencharakter.stats);
  //   let skillListNpc = [];
  //   darkspace.attrNpc = attrListNpc;

  //   attrListNpc.forEach((attr) => {
  //     skillListNpc = skillListNpc.concat(
  //       Object.keys(a.Actor.Nebencharakter.stats[attr].skill)
  //     );
  //   });
  //   darkspace.skillListNpc = skillListNpc.sort();
  // });

  tempTree.then((a) => {
    let attrListAi = Object.keys(a.Actor.KI.stats);
    let skillListAi = [];
    darkspace.attrAi = attrListAi;

    attrListAi.forEach((attr) => {
      skillListAi = skillListAi.concat(
        Object.keys(a.Actor.KI.stats[attr].skill)
      );
    });
    darkspace.skillListAi = skillListAi.sort();
    
  });

  tempTree.then((a) => {
    let attrListVehicle = Object.keys(a.Actor.Maschine.stats);
    let skillListVehicle = [];
    darkspace.attrVehicle = attrListVehicle;
    attrListVehicle.forEach((attr) => {
      skillListVehicle = skillListVehicle.concat(
        Object.keys(a.Actor.Maschine.stats[attr].skill)
      );
    });
    darkspace.skillListVehicle = skillListVehicle.sort();
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
