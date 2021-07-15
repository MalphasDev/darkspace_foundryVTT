export default class DSItem extends Item {
    
    
    prepareData() {
        super.prepareData();
    
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};

        const data = itemData.data;
        
        

        data.baseStructure = data.mk + data.size;
        data.structure = data.baseStructure <2 ? 2 : data.baseStructure;
        data.protection = Math.floor(data.mk / 2);

        data.sensorRange = (data.mk + data.size) * (data.mk + data.size)

        data.keep = Math.max(data.mk,data.size,0);
        

        
        data.mkdmg = Math.ceil(data.mk/1);
        data.sizedmg = Math.ceil(data.size/2);
        data.dmg = Math.max(data.damage + data.mkdmg + data.sizedmg,1);
        
        
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
        let krit = rollResult.terms[0].results.map( (c) => { return c.result; }).sort((a,b) => b - a);
        
        let resultMessage = "";
        
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