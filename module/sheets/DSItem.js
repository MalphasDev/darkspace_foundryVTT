export default class DSItem extends Item {
    chatTemplate = {
        "Talent": "systems/darkspace/templates/partials/chatMessages/talents.html"
    }
    
    
    prepareData() {
        super.prepareData();
    
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};

        const data = itemData.data;
        
        

        data.baseStructure = data.mk + data.size;
        data.structure = data.baseStructure <2 ? 2 : data.baseStructure;
        data.protection = Math.floor(data.mk / 2);

        data.sensorRange = (data.mk + data.size) * (data.mk + data.size)

        data.keep = Math.max(data.mk,data.size,1);
        

        
        if (this.type === "Waffe") {
            data.mkdmg = Math.ceil(data.mk/1);
            data.sizedmg = Math.ceil(data.size/2);
            data.dmg = Math.max(data.damage + data.mkdmg + data.sizedmg,1);
        }
        
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
        "Waffe": "systems/darkspace/templates/dice/chatWeapon.html"
    }
    
    async roll(event, rollformular, fullActorData) {
        const messageTemplate = "systems/darkspace/templates/dice/attackRoll.html"
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
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            
            flavor: resultMessage,
        };
        let cardData = {
            ...this.data,
            ...rollResult,
            owner: this.actor.id
        }

        console.log(rollResult.terms[0].results)
        let dices = [];
        for (var i = 0; i < rollResult.terms[0].results.length; i++) {
            dices.push(rollResult.terms[0].results[i].result)
        }
        debugger
        
        messageData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
        console.log(cardData)
        return ChatMessage.create(messageData);
        //rollResult.toMessage(messageData);
    }



}