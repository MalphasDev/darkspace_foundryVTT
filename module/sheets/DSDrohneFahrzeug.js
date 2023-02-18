import { DSCharacterSheet } from "./DSCharacterSheet.js";
/**
 * @noInheritDoc
 */
export class DSDrohneFahrzeug extends DSCharacterSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template:
        "systems/darkspace/templates/sheets/actors/DrohneFahrzeug-sheet.html",
      classes: ["darkspace", "sheet", "DrohneFahrzeug"],
      width: 800,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats",
        },
      ],
    });
  }

  getData() {
    let data = super.getData();

    return data;
  }
}
