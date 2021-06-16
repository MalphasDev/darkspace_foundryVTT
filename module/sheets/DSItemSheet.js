
export default class DSItemSheet extends ItemSheet {
    get template() {
        return `systems/darkspace/templates/sheets/items/${this.item.data.type}-sheet.html`;
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["darkspace", "sheet", "item"],
          width: 520,
          height: 480,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
      }

    getData() {
        const data = super.getData();
        data.config = CONFIG.darkspace;

        return data;
    }

}