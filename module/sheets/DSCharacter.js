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

            data.initiative =  Math.ceil((data.charattribut.Aufmerksamkeit.attribut + data.charattribut.Geschick.attribut + data.charattribut.Intuition.attribut)/3);
            data.finalinitiative = data.initiative + data.initMod; 
        };

        if (this.type == 'Nebencharakter') {
            data.halfBs = Math.ceil( (data.Bedrohungsstufe)/2 );
            
        };

        if (this.type == 'Drohne/Fahrzeug') {
            
        };
    
    
    
    }
}