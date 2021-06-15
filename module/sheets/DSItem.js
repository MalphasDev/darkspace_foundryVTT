export default class DSItem extends Item {
    chatTemplate = {
        "Talent": "systems/darkspace/templates/partials/chatMessages/talents.html"
    }

    prepareData() {
        super.prepareData();
    
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};
        const data = itemData.data;
        
        if (this.type == "Panzerung") {
            data.armor = data.mk;
            data.protection = Math.floor(data.mk / 2);
        }
        //const TextEditor = 
        console.log(this.data.data.description)
        data.renderedDesc = TextEditor.previewHTML(this.data.data.description,500);
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
        // console.log(chatData.content);
        // console.log(this.type);
        // console.log(this.chatTemplate);
        // console.log(this.chatTemplate[this.type]);

        return ChatMessage.create(chatData);
    }


}