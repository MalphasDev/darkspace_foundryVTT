export default class DSCharakcterSheet extends ActorSheet {
    
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/darkspace/templates/sheets/Character-sheet.html",
            classes: ["darkspace", "sheet", "Charakter"]
        });
    }
    getData() {
        const data = super.getData();
        data.config = CONFIG.darkspace;
        data.Talent = data.items.filter(function (item) {
            return item.type == "Talent"
        });

        //Talent-Sortierung
        data.talentByAttr = {};
        data.talentByAttr = data.items;
        
        // Prepare items.
            if (this.actor.data.type == 'character') {
            this._prepareCharacterItems(data);
        }
    
        return data;

        console.log("Talent Filtering");
        return data;
    }
    prepareData() { /**Überschreiben der prepareData Methode */
        super.prepareData(); /*Beibehalten der bisherigen prepareDate Methode */
        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;
    }
    

    activateListeners(html) {
        super.activateListeners(html);
  
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;
  
        // Add Inventory Item
        html.find('.item-create').click(this._onItemCreate.bind(this));
  
        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });
  
        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });
  }

}
