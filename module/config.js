export const darkspace = {};
darkspace.attackTypes = {
  none: "",
  Schusswaffen: "Schusswaffen",
  Nahkampfwaffen: "Nahkampfwaffen",
  Kampftechnik: "Kampftechnik",
  Unterstützungswaffen: "Unterstützungswaffen",
};

darkspace.iniSend = 0;
darkspace.dice = "systems/darkspace/icons/d10.svg";
darkspace.diceEdit = "systems/darkspace/icons/d10edit.svg";

darkspace.bodyConditions = {
  struck: {
    name: "Angeschlagen",
    fontsymbol: "fas fa-dizzy",
  },
  ko: {
    name: "Außer Gefecht",
    fontsymbol: "fas fa-times-circle",
  },
  wounded: {
    name: "Verwundet",
    fontsymbol: "fas fa-band-aid",
  },
  crippled: {
    name: "Verkrüppelt",
    fontsymbol: "fas fa-user-injured",
  },
  dead: {
    name: "Tod",
    fontsymbol: "fas fa-skull",
  },
};
darkspace.techConditions = {
  scratched: {
    name: "Angekratzt",
    fontsymbol: "fas fa-exclamation-triangle",
  },
  unstable: {
    name: "Instabil",
    fontsymbol: "fas fa-times-circle",
  },
  offline: {
    name: "Ausgeschaltet",
    fontsymbol: "fas fa-battery-quarter",
  },
  defect: {
    name: "Defekt",
    fontsymbol: "fas fa-car-crash",
  },
  destroyed: {
    name: "Zerstört",
    fontsymbol: "fas fa-ban",
  },
};
darkspace.cortexConditions = {
  manipulated: {
    name: "Manipuliert",
    fontsymbol: "fas fa-exclamation-triangle",
  },
  hacked: {
    name: "Gehackt",
    fontsymbol: "fas fa-bug",
  },
  offline: {
    name: "Ausgeschaltet",
    fontsymbol: "fas fa-battery-quarter",
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
