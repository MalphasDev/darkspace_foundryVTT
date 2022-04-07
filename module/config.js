export const darkspace = {};
import * as DSCharakter from "./sheets/DSCharacter.js";
console.log(CONFIG);
console.log(darkspace);
darkspace.attackTypes = {
  none: "",
  Schusswaffen: "Schusswaffen",
  Nahkampfwaffen: "Nahkampfwaffen",
  Kampftechnik: "Kampftechnik",
  Unterstützungswaffen: "Unterstützungswaffen",
};
darkspace.bodyPart = {
  Körper: "Körper",
  Kopf: "Kopf",
  Torso: "Torso",
  Arme: "Arme",
  Beine: "Beine",
  Ganzkörper: "Ganzkörper",
};
darkspace.iniSend = 0;

darkspace.dice = "systems/darkspace/icons/d10.svg";
darkspace.diceEdit = "systems/darkspace/icons/d10edit.svg";

const tempTree = fetch("systems/darkspace/template.json")
  .then((response) => response.json())
  .then((tempData) => {
    return tempData;
  });
console.log(
  tempTree.then((a) => {
    return a;
  })
);
const accessTempTree = () => {
  tempTree.then((a) => {
    console.log(a);
    let attrList = Object.keys(a.Actor.Charakter.charattribut);
    let skillList = [];
    darkspace.attr = attrList;

    attrList.forEach((attr) => {
      skillList = skillList.concat(
        Object.keys(a.Actor.Charakter.charattribut[attr].skill)
      );
    });
    darkspace.skillList = skillList.sort();
  });
};
accessTempTree();

const convertArrayToObject = (array) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [Object.keys(obj).length]: { value: item, active: false },
    };
  }, initialValue);
};

darkspace.conditions = convertArrayToObject(
  ["Außer Gefecht", "Tod", "Verkrüppelt", "Verwundet", "Angeschlagen"].sort()
);
