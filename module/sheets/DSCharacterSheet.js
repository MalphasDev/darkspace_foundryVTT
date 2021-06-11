export default class DSCharakcterSheet extends ActorSheet {
    
    
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/darkspace/templates/sheets/Character-sheet.html",
            classes: ["darkspace", "sheet", "Charakter"],
            width: 800,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats"}]
        });
    }
    

    getData() {
        let data = super.getData();
        
        data.config = CONFIG.darkspace;

        data.Waffe = data.items.filter(function (item) {return item.type == "Waffe"});
        data.Artifizierung = data.items.filter(function (item) {return item.type == "Artifizierung"});
        data.Panzerung = data.items.filter(function (item) {return item.type == "Panzerung"});
        data.Talent = data.items.filter(function (item) {return item.type == "Talent"});
        data.Module = data.items.filter(function (item) {return item.type == "Module"});
        data.Unterbringung = data.items.filter(function (item) {return item.type == "Unterbringung"});
        data.Gegenstand = data.items.filter(function (item) {return item.type == "Gegenstand"});
        data.Besonderheiten = data.items.filter(function (item) {return item.type == 'Besonderheiten'});


        
        return data;
    }
    
    

    activateListeners(html) {
        /* html.find(cssSelector).event(this._someCallBack.bind(this)); <---- Template */

        super.activateListeners(html);
        html.find(".item-edit").click(this._onItemEdit.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".roleable").click(this._onRollItem.bind(this));
        html.find(".roll-btn").click(this._onCustomRoll.bind(this));
        //html.find(".checkcounter").click(this._onChangeCounter.bind(this));
    }
    
    _onRollItem(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;


        if (dataset.rolltype) {
            var dynattr;
            var dynskill;
            
            if (dataset.rolltype == "skill") {
                dynattr = this.object.data.data.charattribut[dataset.attr].attribut;
                dynskill = this.object.data.data.charattribut[dataset.attr].skill[dataset.skill];
            }

            if (dataset.rolltype == "combat") {
                
                var skillident = dataset.skill;
                if (["Kampftechnik", "Schusswaffen"].includes(skillident)) {var attrident = "Geschick";}
                if (["Nahkampfwaffen", "Unterstützungswaffen"].includes(skillident)) {var attrident = "Konstitution";}
                dynattr = this.object.data.data.charattribut[attrident].attribut;
                dynskill = this.object.data.data.charattribut[attrident].skill[skillident];
            }

            
            var rollformular;
            if (this.object.data.data.customroll.removehighest != true) {
                rollformular = dynattr + "d10x10kh2+" + dynskill;
                
            } else {
                rollformular = dynattr + "d10x10kh3dh1+" + dynskill;
            }

            let roll = new Roll(rollformular, this.actor.data.data);
            let label = dataset.label ? `${dataset.label}` : '';

            const myDialogOptions = {
                width: 200,
                height: 400,
                top: 500,
                left: 500
            };
            
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label
              });    
            /*
            const myDialog = new Dialog({
                title: "My Dialog Title",
              content: `My dialog content`,
              buttons: {
                button1: {
                    label: "Normale Probe",
                    callback: () => {
                        roll.roll().toMessage({
                            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                            flavor: label
                          });    
                    },
                    icon: `<i class="fas fa-check"></i>`
                  },
                  button2: {
                    label: "Modifizierte Probe",
                    callback: () => {
                        

                        roll.roll().toMessage({
                            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                            flavor: label
                        });

                    },
                    icon: `<i class="fas fa-check"></i>`
                  },
                  button3: {
                    label: "Button #2",
                    callback: () => {
                        new Dialog({
                            title: "My Dialog Title",
                            content: "My dialog content",
                            buttons: {}
                          }, myDialogOptions).render(true);},
                    icon: `<i class="fas fa-times"></i>`
                  },
                  
              }
            }).render(true);
            */

            
        }
    }
    _onCustomRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        var dice = this.object.data.data.customroll.dice;
        var bonus = this.object.data.data.customroll.bonus;

        if (this.object.data.data.customroll.removehighest != true) {
            var rollformular = dice + "d10x10kh2+" + bonus;
            
        } else {
            var rollformular = dice + "d10x10kh3dh1+" + bonus;
        }

        var roll = new Roll(rollformular, this.actor.data.data);

        roll.roll().toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        });
    }
    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.getOwnedItem(itemId);
        item.sheet.render(true);
    }
    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        return this.actor.deleteOwnedItem(itemId); /* <-- Wird in Foundry VTT 9.x ersetzt */
    }
    
}
