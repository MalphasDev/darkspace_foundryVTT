export const darkspace = {};
import * as DSCharakter from "./sheets/DSCharacter.js";
console.log(darkspace);
darkspace.attackTypes = {
  none: "",
  Schusswaffen: "Schusswaffen",
  Nahkampfwaffen: "Nahkampfwaffen",
  Kampftechnik: "Kampftechnik",
  Unterstützungswaffen: "Unterstützungswaffen",
};
darkspace.dmgtype = {
  B: "B",
  Be: "B(e)",
  V: "V",
  Ve: "V(e)",
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

darkspace.conditions = {
  con0: {
    value: "Außer Gefecht",
    active: false,
  },
  con1: {
    value: "Blutung",
    active: false,
  },
  con2: {
    value: "Bewusstlos",
    active: false,
  },
  con3: {
    value: "Tod",
    active: false,
  },
  con4: {
    value: "Niederhalten",
    active: false,
  },
  con5: {
    value: "Verkrüppelt",
    active: false,
  },
  con6: {
    value: "Verwundet",
    active: false,
  },
};
