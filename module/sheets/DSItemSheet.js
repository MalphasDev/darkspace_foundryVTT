
export default class DSItemSheet extends ItemSheet {
    get template() {
        return `systems/darkspace/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.darkspace;

        return data;
    }

}