
export default class DSCharakcterSheet extends ActorSheet {
    get template() {
        return `systems/darkspace/templates/sheets/actors/${this.actor.data.type}-sheet.html`;
    }
    chatTemplate = {
        "Skill": "systems/darkspace/templates/dice/chatSkill.html",
        "Custom": "systems/darkspace/templates/dice/chatCustom.html",
        "Item": "systems/darkspace/templates/dice/chatItem.html"
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/darkspace/templates/sheets/actors/Character-sheet.html",
            classes: ["darkspace", "sheet", "Charakter"],
            width: 800,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats"}],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }


    getData() {
        let data = super.getData();

        //data.config = CONFIG.darkspace;

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
        html.find(".itemToChat").click(this._itemToChat.bind(this));
        html.find(".roleSkill").click(this._onRollSkill.bind(this));
        html.find(".roleable").click(this._onRollItem.bind(this));
        html.find(".roll-btn").click(this._onCustomRoll.bind(this));
        html.find(".incRess, .decRess").click(this._onModRess.bind(this));
        html.find(".decWounds, .incWounds, .decBruises, .incBruises").click(this._onModHealth.bind(this));
        //html.find(".decRess").click(this._onModRess.bind(this));
        //html.find(".checkcounter").click(this._onChangeCounter.bind(this));


        // Add draggable for Macro creation
        html.find(".item").each((i, a) => {
        a.setAttribute("draggable", true);
        a.addEventListener("dragstart", ev => {
          let dragData = ev.currentTarget.dataset;
          ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
          console.log(ev.currentTarget)
          console.log( JSON.stringify(dragData))
        }, false);
      });


        this.afterHTMLLoad()
    }

    async _onRollSkill (event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        var attrMod = this.object.data.data.customroll.dice;
        var fertMod = this.object.data.data.customroll.bonus
        
        var rollformular;                           // Formular-Variable anlegen

        var dynattr = 0;
        var dynskill = 0;

        console.log(dataset.attr)
        console.log(dataset.skill)
        
        var roleData = {attribute: dataset.attr, skill: dataset.skill};
        
        if (this.actor.type == "DrohneFahrzeug") {
            dynattr = this.object.data.data[dataset.attr]
            dynskill = this.object.data.data[dataset.skill];
            
            roleData = {attribute: "", skill: "Modulklasse"}
        } else {
            dynattr = this.object.data.data.charattribut[dataset.attr].attribut;
            dynskill = this.object.data.data.charattribut[dataset.attr].skill[dataset.skill];
        }
        

        if (this.actor.type == "Nebencharakter") {
            dynattr += parseInt(this.object.data.data.Bedrohungsstufe);
            dynskill += Math.ceil(parseInt(this.object.data.data.Bedrohungsstufe)/2);
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
        let fullDice = dices.sort( (a,b) => (b - a) )
        let evalDice = [fullDice[0], fullDice[1]]
        let kritDice = [fullDice[2]]
        let unEvalDice = fullDice.splice(3,100)
        
        let diceResult = {
            evalDice: evalDice,
            kritDice: kritDice,
            unEvalDice: unEvalDice
        }
        
        let cardData = {
            ...this.data,
            ...roleData,
            ...rollResult,
            ...diceResult,
            ...resultMessage,
            owner: this.actor.id
        }
        messageData.content = await renderTemplate(this.chatTemplate["Skill"], cardData); // this.chatTemplate[this.type] --> "this.type" bezieht sich auf die Auswahl von Templates
        AudioHelper.play({src: CONFIG.sounds.dice});
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
        // ------------------------ //
        // Daten für Kybernesewürfe //
        // ------------------------ //

        if (dataset.rolltype == "cybernetic") {
            dynattr = this.actor.data.data.charattribut.Kybernese.attribut;
            dynskill = parseInt(dataset.skill);
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
        let fullDice = dices.sort( (a,b) => (b - a) )
        let evalDice = [fullDice[0], fullDice[1]]
        let kritDice = [fullDice[2]]
        let unEvalDice = fullDice.splice(3,100)
        
        let diceResult = {
            evalDice: evalDice,
            kritDice: kritDice,
            unEvalDice: unEvalDice
        }
        
        let cardData = {
            ...this.data,
            ...rollResult,
            ...diceResult,
            ...resultMessage,
            owner: this.actor.id
        }
        messageData.content = await renderTemplate(this.chatTemplate["Custom"], cardData); // this.chatTemplate[this.type] --> "this.type" bezieht sich auf die Auswahl von Templates
        AudioHelper.play({src: CONFIG.sounds.dice});
        return ChatMessage.create(messageData);
    }


    _onCreateItem(event) {
        event.preventDefault()
        const element = event.currentTarget;

        let itemData = {
            name: "Neuer Gegenstand",
            type: element.dataset.type
        }

        return this.actor.createOwnedItem(itemData);
    }
    _onItemEdit(event) {
        event.preventDefault();
        const element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        item.sheet.render(true);
    }
    _onItemDelete(event) {
        event.preventDefault();
        const element = event.currentTarget;
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
    async _itemToChat(event) {
        const element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let itemList = this.object.data.items;
        let itemClicked = itemList.filter( (i) => {return i.data._id == itemId } )

        let itemType = String(itemClicked.map( (i) => {return i.data.type}))
        let itemDefaultData = {
            "itemName": itemClicked.map( (i) => {return i.data.name}),
            "itemType": itemType,
            "itemImg": itemClicked.map( (i) => {return i.data.img}),
            "itemDesc": itemClicked.map( (i) => {return i.data.data.description})
        }
        let itemChatData = itemDefaultData;
        if (itemType === "Besonderheiten") {
            itemChatData = {
                ...itemDefaultData,
                "type": itemClicked.map( (i) => {return i.data.data.type})
            }
        }
        if (itemType === "Talent") {
            itemChatData = {
                ...itemDefaultData,
                "attribut": itemClicked.map( (i) => {return i.data.data.attribut}),
                "skill": itemClicked.map( (i) => {return i.data.data.skill}),
                "requirement": itemClicked.map( (i) => {return i.data.data.requirement})
            }
        }
        if (itemType === "Gegenstand" || "Artifizierung") {
            itemChatData = {
                ...itemDefaultData,
                "itemModules": itemClicked.map( (i) => {return i.data.data.modules}),
                "itemMk": itemClicked.map( (i) => {return i.data.data.mk}),
                "itemSize": itemClicked.map( (i) => {return i.data.data.size}),
            }
        }
        if (itemType === "Unterbringung" ) {
            itemChatData = {
                ...itemDefaultData,
                "comfort": itemClicked.map( (i) => {return i.data.data.comfort}),
                "ressourcen": itemClicked.map( (i) => {return i.data.data.ressourcen}),
                "crime": itemClicked.map( (i) => {return i.data.data.crime}),
                "polution": itemClicked.map( (i) => {return i.data.data.polution}),
            }
        }
        let messageData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        };
        let cardData = {
            ...this.data,
            ...itemChatData,
            owner: this.actor.id
        }
        messageData.content = await renderTemplate(this.chatTemplate["Item"], cardData); // this.chatTemplate[this.type] --> "this.type" bezieht sich auf die Auswahl von Templates
        return ChatMessage.create(messageData);
    }

    async _onModRess(event) {
        let ressAttr = event.currentTarget.dataset.attr
        let attrKey = "data.charattribut." + ressAttr + ".ress.value"
        let ressMod = 0;
        if (event.currentTarget.className.includes("decRess")) {ressMod = -1}
        if (event.currentTarget.className.includes("incRess")) {ressMod = 1}
        let newInc = this.actor.data.data.charattribut[ressAttr].ress.value + ressMod

        this.actor.update({
            "id": this.actor.id,
            [attrKey]: newInc
        })
        
    }
    async _onModHealth(event) {
        let currHealth = {"bruises": this.actor.data.data.bruises.value, "wounds": this.actor.data.data.wounds.value};
        let modBruises;
        let modWounds;

        if (event.currentTarget.className.includes("decBruises")) { modBruises = -1; modWounds = 0 }
        if (event.currentTarget.className.includes("incBruises")) { modBruises = 1; modWounds = 0 }
        if (event.currentTarget.className.includes("decWounds")) { modBruises = 0; modWounds = -1 }
        if (event.currentTarget.className.includes("incWounds")) { modBruises = 0; modWounds = 1 }
        
        this.actor.update({
            "id": this.actor.id,
            "data.bruises.value": currHealth.bruises + modBruises,
            "data.wounds.value": currHealth.wounds + modWounds
        })

        
    }
    afterHTMLLoad() {
        // Kybernese aus der normalen Attributsliste entfernen,
        // um es in der rechten Sitebar darzustellen.

        if(String(this.actor.type) === "Charakter") {
            let attrList = document.getElementById("statFeld")
            attrList.removeChild(attrList.lastElementChild);
        }
    }
}
