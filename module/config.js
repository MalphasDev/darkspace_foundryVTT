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
