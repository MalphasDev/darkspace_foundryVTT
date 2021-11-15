import DSCharakcterSheet from "./DSCharacterSheet.js";
/**
 * @noInheritDoc
 */
export default class DSNebencharakter extends DSCharakcterSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template:
        "systems/darkspace/templates/sheets/actors/Nebencharakter-sheet.html",
      classes: ["darkspace", "sheet", "Nebencharakter"],
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
