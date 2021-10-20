import * as DSMechanics from "../DSMechanics.js";
export default class DSItem extends Item {
    
    
    prepareData() {
        super.prepareData();
    
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};

        const data = itemData.data;
        
        
        // Struktur und Schutz //
        data.baseStructure = data.mk + data.size;
        data.structure = data.baseStructure < 1 ? 1 : data.baseStructure;
        data.protection = Math.floor(data.mk / 2);

        // Senorreichweite //
        data.sensorRange = Math.pow(data.mk + data.size, 2)

        // Unterhalt //
        data.keep = Math.max(data.mk,data.size,0);
        

        // Waffen //
        data.mkdmg = Math.ceil(data.mk*1,5);
        data.sizedmg = Math.ceil(data.size/2);
        data.dmg = Math.max(data.mkdmg + data.sizedmg + data.dmgBonus,1);
        
        data.sizeRange = Math.max(data.size, -3)+4;
        data.autoRangeBase = Math.pow(data.sizeRange + data.rangeBonus, 2) * 10;
        data.autoRangeShort = data.autoRangeBase / 10
        data.autoRangeExtr = data.autoRangeBase * 2
        data.autoRangeMax = data.autoRangeBase * 10
        data.range = data.autoRangeShort+"-"+data.autoRangeBase+"/"+data.autoRangeExtr+"/"+data.autoRangeMax;
        
        if (this.type === "Panzerung") {
            data.armor = data.structure;
        }
        switch (data.size) {
            case -5: data.sizeKat = "Winzig";
            break;
            case -4: data.sizeKat = "Klein";
            break;
            case -3: data.sizeKat = "Handlich";
            break;
            case -2: data.sizeKat = "Mittelgroß";
            break;
            case -1: data.sizeKat = "Groß";
            break;
            case 0: data.sizeKat = "Personengroß";
            break;
            case 1: data.sizeKat = "Sperrig";
            break;
            case 2: data.sizeKat = "Sehr groß";
            break;
            case 3: data.sizeKat = "Riesig";
            break;
            case 4: data.sizeKat = "Enorm";
            break;
            case 5: data.sizeKat = "Immens";
            break;
            case 6: data.sizeKat = "Gewaltig";
            break;
            case 7: data.sizeKat = "Gigantisch";
            break;
            case 8: data.sizeKat = "Kolossal";
            break;
            case 9: data.sizeKat = "Titanisch";
            break;
        }
        if (this.type === "Waffe") {
            switch (data.size) {
                case -3: data.sizeKat = data.sizeKat + "/Pistole";
                break;
                case -2: data.sizeKat = data.sizeKat + "/Karabiner";
                break;
                case -1: data.sizeKat = data.sizeKat + "/Gewehr";
                break;
                case 0: data.sizeKat = data.sizeKat + "/Unterstützung";
                break;
                case 1: data.sizeKat = data.sizeKat + "/Kanone";
                break;
                case 2: data.sizeKat = data.sizeKat + "/Geschütz";
                break;
                case 3: data.sizeKat = data.sizeKat + "/Geschütz";
                break;
                case 4: data.sizeKat = data.sizeKat + "/Geschütz";
                break;
            }
        }

        
    }

    chatTemplate = {
        "Waffe": "systems/darkspace/templates/dice/chatWeapon.html",
        "Panzerung": "systems/darkspace/templates/dice/chatArmor.html",
        "Artifizierung": "systems/darkspace/templates/dice/chatCybernetics.html"
    }
    
    async roll(event, rollformular, fullActorData) {
        let fullItemData = this.data;
        
        let fullData = {fullActorData, fullItemData}
        
        let rollResult = new Roll(rollformular, fullData).roll();
        
        let resultMessage = "";
        let krit = rollResult.terms[0].results.map( (c) => { return c.result; }).sort((a,b) => b - a);
        
        // --------------------- //
        // Krit und Patzer Logik //
        // --------------------- //
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
        
        
        messageData.content = await renderTemplate(this.chatTemplate[this.type], cardData); // this.chatTemplate[this.type] --> "this.type" bezieht sich auf die Auswahl von Templates
        AudioHelper.play({src: CONFIG.sounds.dice});
        return ChatMessage.create(messageData);
        //rollResult.toMessage(messageData);
    }


}