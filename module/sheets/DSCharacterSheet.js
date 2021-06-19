
export default class DSCharakcterSheet extends ActorSheet {
    get template() {
        return `systems/darkspace/templates/sheets/actors/${this.actor.data.type}-sheet.html`;
    }
    chatTemplate = {
        "Skill": "systems/darkspace/templates/dice/chatSkill.html",
        "Custom": "systems/darkspace/templates/dice/chatCustom.html"
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
        html.find(".roleSkill").click(this._onRollSkill.bind(this));
        html.find(".roleable").click(this._onRollItem.bind(this));
        html.find(".roll-btn").click(this._onCustomRoll.bind(this));
        //html.find(".checkcounter").click(this._onChangeCounter.bind(this));
    }

    async _onRollSkill (event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        var attrMod = this.object.data.data.customroll.dice;
        var fertMod = this.object.data.data.customroll.bonus
        
        var rollformular;                           // Formular-Variable anlegen

        var dynattr = this.object.data.data.charattribut[dataset.attr].attribut;
        var dynskill = this.object.data.data.charattribut[dataset.attr].skill[dataset.skill];

        var roleData = {attribute: dataset.attr, skill: dataset.attr};
        // ------------------------------------- //
        // Custom Roll und globale Modifikatoren //
        // ------------------------------------- //
        
            
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

        console.log(rollformular)

        var rollResult = new Roll(rollformular, this.actor.data.data).roll();
        
        // --------------------- //
        // Krit und Patzer Logik //
        // --------------------- //
        let krit = rollResult.terms[0].results.map( (c) => { return c.result; }).sort((a,b) => b - a);
        let resultMessage = "";
        if (krit[2] >= 9) { resultMessage = {msg: "KRITISCHER ERFOLG"}; }
        if (rollResult.total <= 9) { resultMessage = {msg: "PATZER"} }


        let messageData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        };
        
        let dices = [];
        for (var i = 0; i < rollResult.terms[0].results.length; i++) {
            dices.push(rollResult.terms[0].results[i].result)
        }
        let diceResult = {sortetDice: dices.sort( (a,b) => (b - a) )}
        
        let cardData = {
            ...this.data,
            ...roleData,
            ...rollResult,
            ...diceResult,
            ...resultMessage,
            owner: this.actor.id
        }
        messageData.content = await renderTemplate(this.chatTemplate["Skill"], cardData); // this.chatTemplate[this.type] --> "this.type" bezieht sich auf die Auswahl von Templates
        console.log("++++++++> cardData:")
        console.log(cardData)
        return ChatMessage.create(messageData);
        
    }

    async _onRollItem(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        var dynattr = 0;
        var dynskill = 0;

        // Daten für Custom Roll und globale Modifikatoren sammeln //
        var attrMod = parseInt(this.object.data.data.customroll.dice);
        var fertMod = parseInt(this.object.data.data.customroll.bonus);
        

        var fullActorData = this.actor.data.data    // Actor Data zusammenstellen. Wird durch zusätzliche Objekte ergänzt
        var rollformular;                           // Formular-Variable anlegen
        
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.getOwnedItem(itemId);


        // -------------------------------- //
        // Charakterdaten für Angriffswürfe //
        // -------------------------------- //

        if (dataset.rolltype == "combat") {
            var skillident = dataset.skill; // Holt den benötigten Skill aus dem Waffenbutton
            var attrident = "";             // Legt Identifikator für Attribut an
            
            // SKILLIDENTS FÜR CHARAKTERE
            if (this.object.data.type === "Charakter") {
                if (["Kampftechnik", "Schusswaffen"].includes(skillident)) {attrident = "Geschick";}
                if (["Nahkampfwaffen", "Unterstützungswaffen"].includes(skillident)) {attrident = "Konstitution";}
            }
            // SKILLIDENTS FÜR NEBENCHARAKTERE
            if (this.object.data.type === "Nebencharakter") {
                if (["Schusswaffen", "Unterstützungswaffen"].includes(skillident)) {attrident = "Fernkampf";}
                if (["Kampftechnik", "Nahkampfwaffen"].includes(skillident)) {attrident = "Nahkampf";}
            }

            console.log(attrident)
            console.log(skillident)
            dynattr = this.object.data.data.charattribut[attrident].attribut;
            dynskill = this.object.data.data.charattribut[attrident].skill[skillident];
        }

        // --------------------- //
        // Daten für Schutzwürfe //
        // --------------------- //

        if (dataset.rolltype == "protection") {
            dynattr = parseInt(dataset.structure);
            dynskill = parseInt(dataset.protection);
        }

        // ------------------------------------- //
        // Custom Roll und globale Modifikatoren //
        // ------------------------------------- //
        
            
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
        
        // --------------------------------------------- //
        // Übergabe an die Roll-Logic in der Item-Klasse //
        // --------------------------------------------- //

        item.roll(event, rollformular, fullActorData);
    }


    async _onCustomRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        var dynattr = this.object.data.data.customroll.dice;
        var dynskill = this.object.data.data.customroll.bonus;
        
        var rollformular;                           // Formular-Variable anlegen

            
        if (this.object.data.data.customroll.removehighest != true) {
            rollformular = dynattr + "d10x10kh2+" + dynskill;

        } else {
            rollformular = dynattr + "d10x10kh3dh1+" + dynskill;
        }


        var rollResult = new Roll(rollformular, this.actor.data.data).roll();
        
        // --------------------- //
        // Krit und Patzer Logik //
        // --------------------- //
        let krit = rollResult.terms[0].results.map( (c) => { return c.result; }).sort((a,b) => b - a);
        let resultMessage = "";
        if (krit[2] >= 9) { resultMessage = {msg: "KRITISCHER ERFOLG"}; }
        if (rollResult.total <= 9) { resultMessage = {msg: "PATZER"} }


        let messageData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        };
        
        let dices = [];
        for (var i = 0; i < rollResult.terms[0].results.length; i++) {
            dices.push(rollResult.terms[0].results[i].result)
        }
        let diceResult = {sortetDice: dices.sort( (a,b) => (b - a) )}
        
        let cardData = {
            ...this.data,
            ...rollResult,
            ...diceResult,
            ...resultMessage,
            owner: this.actor.id
        }
        messageData.content = await renderTemplate(this.chatTemplate["Custom"], cardData); // this.chatTemplate[this.type] --> "this.type" bezieht sich auf die Auswahl von Templates
        console.log("++++++++> cardData:")
        console.log(cardData)
        return ChatMessage.create(messageData);
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
