export const darkspace = {};
import * as DSCharakter from "./sheets/DSCharacter.js";

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
