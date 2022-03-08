export const darkspace = {};
import * as DSCharakter from "./sheets/DSCharacter.js";
console.log(CONFIG);
console.log(darkspace);
console.log();
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
darkspace.test = "Test";

darkspace.attr = [
  "Aufmerksamkeit",
  "Ausstrahlung",
  "Geschick",
  "Konstitution",
  "Intelligenz",
  "Intuition",
  "Anomalie",
  "Konzentration",
  "Kybernese",
  "Netzwerk",
  "Ressourcen",
];
darkspace.skills = [
  "Fahrzeuge",
  "Fokus",
  "Menschenkenntnis",
  "Wahrnehmen",
  "Charisma",
  "Einschüchtern",
  "Überzeugen",
  "Verhandeln",
  "Heimlichkeit",
  "Motorik",
  "Kampftechnik",
  "Schusswaffen",
  "Athletik",
  "Fitness",
  "Nahkampfwaffen",
  "Unterstützungswaffen",
  "Bildung",
  "Logik",
  "Medizin",
  "Raumfahrt",
  "Cortex",
  "Kreativität",
  "Kultur",
  "Polytronik",
  "Glück",
  "Willenskraft",
  "Synthese",
  "Kontakte",
  "Finanzen",
];
darkspace.skillList = darkspace.skills.sort();

const conditionList = [
  "Außer Gefecht",
  "Tod",
  "Verkrüppelt",
  "Verwundet",
  "Angeschlagen",
].sort();

const convertArrayToObject = (array) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [Object.keys(obj).length]: { value: item, active: false },
    };
  }, initialValue);
};

darkspace.conditions = convertArrayToObject(conditionList);
