
export default class DSCharakcterSheet extends ActorSheet {
    get template() {
        return `systems/darkspace/templates/sheets/actors/${this.actor.data.type}-sheet.html`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/darkspace/templates/sheets/actors/Character-sheet.html",
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
        html.find(".createItem").click(this._onCreateItem.bind(this))
        html.find(".item-edit").click(this._onItemEdit.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".rollSkill").click(this._onRollSkill.bind(this));
        html.find(".roleable").click(this._onRollItem.bind(this));
        html.find(".roll-btn").click(this._onCustomRoll.bind(this));
        //html.find(".checkcounter").click(this._onChangeCounter.bind(this));
    }


    async _onRollSkill(event) {

        const element = event.currentTarget;
        const dataset = element.dataset;
        var dynattr;
        var dynskill;
        var attrMod = this.object.data.data.customroll.dice;
        var fertMod = this.object.data.data.customroll.bonus
        var fullActorData = this.actor.data.data // Actor Data zusammenstellen. Wird durch zusätzliche Objekte ergänzt
        dynattr = this.object.data.data.charattribut[dataset.attr].attribut;
        dynskill = this.object.data.data.charattribut[dataset.attr].skill[dataset.skill];
        
        
        if (this.object.data.type === "Nebencharakter") {
            dynattr += this.object.data.data.Bedrohungsstufe
            dynskill += Math.ceil( (this.object.data.data.Bedrohungsstufe)/2 )
        }
        
        

        var rollformular;
        if (this.object.data.data.customroll.global == true) {
            dynattr += attrMod;
            dynskill += fertMod;
            
            if (this.object.data.data.customroll.removehighest != true) {
                rollformular = dynattr + "d10x10kh2+" + dynskill;
                
            } else {
                rollformular = dynattr + "d10x10kh3dh1+" + dynskill;
            }
        } else {
            rollformular = dynattr + "d10x10kh2+" + dynskill;
        }

        let rollResult = new Roll(rollformular, fullActorData).roll();
        let krit = rollResult.terms[0].results.map( (c) => { return c.result; }).sort((a,b) => b - a);
        let resultMessage = "";
        
        
            
        if (krit[2] >= 9) {
            resultMessage = "Ein kririscher Erfolg!";
        }
        if (rollResult.total <= 9) {
            resultMessage = "Ein Patzer."
        }
            
        let messageData = {
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: resultMessage
        };
        rollResult.toMessage(messageData);
    }


    async _onRollItem(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        var dynattr;
        var dynskill;
        var attrMod = this.object.data.data.customroll.dice;
        var fertMod = this.object.data.data.customroll.bonus
        
        var fullActorData = this.actor.data.data // Actor Data zusammenstellen. Wird durch zusätzliche Objekte ergänzt

        
        if (dataset.rolltype) {
            
            const itemId = element.closest(".item").dataset.itemId;
            const item = this.actor.getOwnedItem(itemId);

            if (dataset.rolltype == "combat") {
                var skillident = dataset.skill;
                var attrident = "";
                var weaponData = {weaponDmg: dataset.dmg, weaponRange: dataset.range}
                fullActorData = {fullActorData, weaponData}
                
                // SKILLIDENTS FÜR NEBENCHARAKTERE
                if (this.object.data.type === "Nebencharakter") {
                    if (["Schusswaffen", "Unterstützungswaffen"].includes(skillident)) {attrident = "Fernkampf";}
                    if (["Kampftechnik", "Nahkampfwaffen"].includes(skillident)) {attrident = "Nahkampf";}
                }

                // SKILLIDENTS FÜR CHARAKTERE
                if (this.object.data.type === "Charakter") {
                    if (["Kampftechnik", "Schusswaffen"].includes(skillident)) {attrident = "Geschick";}
                    if (["Nahkampfwaffen", "Unterstützungswaffen"].includes(skillident)) {attrident = "Konstitution";}
                    
                }
                dynattr = this.object.data.data.charattribut[attrident].attribut;
                dynskill = this.object.data.data.charattribut[attrident].skill[skillident];

            }

            if (dataset.rolltype == "protection") {
                dynattr = dataset.structure;
                dynskill = dataset.protection;
            }

            var rollformular;

            
            if (this.object.data.data.customroll.global == true) {
                dynattr += attrMod;
                dynskill += fertMod;

                if (this.object.data.data.customroll.removehighest != true) {
                    rollformular = dynattr + "d10x10kh2+" + dynskill;

                } else {
                    rollformular = dynattr + "d10x10kh3dh1+" + dynskill;
                }
            } else {
                rollformular = dynattr + "d10x10kh2+" + dynskill;
            }
            item.roll(event, rollformular, fullActorData);

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

        roll.roll()

            let krit = roll.terms[0].results.map( (c) => { return c.result; }).sort((a,b) => b - a);
            let resultMessage = "";


            if (krit[2] >= 9) {
                resultMessage = "Ein kririscher Erfolg!";
            }
            if (roll.total <= 9) {
                resultMessage = "Ein Patzer."
            }
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: resultMessage
              });
    }


    _onCreateItem(event) {
        event.preventDefault()
        let element = event.currentTarget;

        let itemData = {
            name: "Neuer Gegenstand",
            type: element.dataset.type
        }

        return this.actor.createOwnedItem(itemData);
    }
    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        item.sheet.render(true);
    }
    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let itemInfo = this.object.data.items.filter( (item) => {return item._id == itemId})[0]
        
          Dialog.confirm({
            title: "Gegenstand entfernen",
            content: "Möchtest du " + itemInfo.name + " wirklich löschen?",
            yes: () => {ui.notifications.info(
                "Gegenstand gelöscht");
                return this.actor.deleteOwnedItem(itemId); /* <-- Wird in Foundry VTT 9.x ersetzt */},
            no: () => {},
            defaultYes: true
          });

        
    }
}
