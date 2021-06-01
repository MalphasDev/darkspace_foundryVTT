export default class DSItemSheet extends ItemSheet {
    get template() {
        return `systems/darkspace/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.darkspace;

        return data;
    }
    /*
    activateListeners(html) {
        html.find(".item-create").click(this._onModuleCreate.bind(this));
        super.activateListeners(html);
    }
    _onModuleCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        
        let itemData = {
            name: "Modul",
            type: element.dataset.type
        }

        return this.actor.createOwnedItems(itemData);
    }
    */

}