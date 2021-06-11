export default class DSCharacter extends Actor {
    prepareData() {
        super.prepareData();
    
        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;

        
    
        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.

        if (this.type != 'Drohne/Fahrzeug') {

        }

        if (this.type == 'Charakter') {

            data.reaction = 5 - Math.floor(data.charattribut.Aufmerksamkeit.attribut / 2);
            data.finalreaction = data.reaction; // + Reaktions-Mod vom Charbogen
        };

        if (this.type == 'Nebencharakter') {
            data.reaction = 5 - Math.floor(data.Bedrohungsstufe / 2);
            
        };

        if (this.type == 'Drohne/Fahrzeug') {
            data.reaction = 5 - Math.floor(data.mk / 2);
            
        };
    
    
    
    }
}