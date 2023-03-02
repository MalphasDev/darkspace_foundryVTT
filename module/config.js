import * as props from "./DSprops.js";

export const darkspace = {};
console.log(darkspace);
darkspace.upkeep = {
  supplies: "darkspace.supplies",
  shelter: "darkspace.shelter",
  entertaiment: "darkspace.entertaiment",
  misc: "darkspace.misc",
};
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
  struck: {
    name: "Angeschlagen",
    fontsymbol: "fa-solid fa-dizzy",
  },
  ko: {
    name: "Außer Gefecht",
    fontsymbol: "fa-solid fa-times-circle",
  },
  wounded: {
    name: "Verwundet",
    fontsymbol: "fa-solid fa-band-aid",
  },
  crippled: {
    name: "Verkrüppelt",
    fontsymbol: "fa-solid fa-user-injured",
  },
  dead: {
    name: "Tod",
    fontsymbol: "fa-solid fa-skull",
  },
};
darkspace.techConditionLabel = {
  scratched: {
    name: "Angekratzt",
    fontsymbol: "fa-solid fa-exclamation-triangle",
  },
  unstable: {
    name: "Instabil",
    fontsymbol: "fa-solid fa-times-circle",
  },
  offline: {
    name: "Ausgeschaltet",
    fontsymbol: "fa-solid fa-battery-quarter",
  },
  defect: {
    name: "Defekt",
    fontsymbol: "fa-solid fa-car-crash",
  },
  destroyed: {
    name: "Zerstört",
    fontsymbol: "fa-solid fa-ban",
  },
};
darkspace.cortexConditionLabel = {
  overflow: {
    name: "Überlauf",
    fontsymbol: "fa-solid fa-stream",
  },
  crash: {
    name: "Crash",
    fontsymbol: "fa-solid fa-bug",
  },
  dos: {
    name: "DoS",
    fontsymbol: "fa-solid fa-terminal",
  },
  offline: {
    name: "Abschaltung",
    fontsymbol: "fa-solid fa-power-off",
  },
  rooted: {
    name: "Gerootet",
    fontsymbol: "fa-solid fa-network-wired",
  },
};

// Stellt Liste mit Attributen und Fertigkeiten zusammen
const tempTree = fetch("systems/darkspace/template.json")
  .then((response) => response.json())
  .then((tempData) => {
    return tempData;
  });

const accessTempTree = () => {
  tempTree.then((a) => {
    let attrList = Object.keys(a.Actor.Charakter.charattribut);
    let skillList = [];
    darkspace.attrList = attrList;

    attrList.forEach((attr) => {
      skillList = skillList.concat(
        Object.keys(a.Actor.Charakter.charattribut[attr].skill)
      );
    });
    darkspace.skillList = skillList.sort();
  });

  tempTree.then((a) => {
    let attrListNpc = Object.keys(a.Actor.Nebencharakter.charattribut);
    let skillListNpc = [];
    darkspace.attrNpc = attrListNpc;

    attrListNpc.forEach((attr) => {
      skillListNpc = skillListNpc.concat(
        Object.keys(a.Actor.Nebencharakter.charattribut[attr].skill)
      );
    });
    darkspace.skillListNpc = skillListNpc.sort();
  });

  tempTree.then((a) => {
    let attrListAi = Object.keys(a.Actor.KI.charattribut);
    let skillListAi = [];
    darkspace.attrAi = attrListAi;

    attrListAi.forEach((attr) => {
      skillListAi = skillListAi.concat(
        Object.keys(a.Actor.KI.charattribut[attr].skill)
      );
    });
    darkspace.skillListAi = skillListAi.sort();
  });

  tempTree.then((a) => {
    let attrListVehicle = Object.keys(a.Actor.DrohneFahrzeug.charattribut);
    let skillListVehicle = [];
    darkspace.attrVehicle = attrListVehicle;
    attrListVehicle.forEach((attr) => {
      skillListVehicle = skillListVehicle.concat(
        Object.keys(a.Actor.DrohneFahrzeug.charattribut[attr].skill)
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
