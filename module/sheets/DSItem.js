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
            data.dmg = data.damage + data.mk;
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

        //data.renderedDesc = TextEditor.previewHTML(this.data.data.description,500);
    }
    
    async roll() {
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker()
        }
        let cardData = {
            ...this.data,
            owner: this.actor.id
        }

        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData)
        chatData.roll = true;
        return ChatMessage.create(chatData);
    }


}