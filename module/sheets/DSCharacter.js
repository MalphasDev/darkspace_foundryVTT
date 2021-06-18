//import { darkspace } from "../config";

export default class DSCharacter extends Actor {
    prepareData() {
        super.prepareData();
    
        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;

        
    
        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.

        if (this.type != 'Drohne/Fahrzeug') {
            data.maxBruises = 5 + data.bruises.max;
            data.maxWounds = 5 + data.wounds.max;

            
        }

        if (this.type == 'Charakter') {
            data.initiative =  Math.ceil((data.charattribut.Aufmerksamkeit.attribut + data.charattribut.Geschick.attribut + data.charattribut.Intuition.attribut)/3);
            data.finalinitiative = data.initiative + data.initMod; 
            

            let ownedItems = this.data.items.filter( (i) => {return (i.type != "Talent") && (i.type != "Besonderheiten")} )
            
            data.keepOfItems = Math.max(...Array.from(ownedItems.map( (k) => {return k.data.data.keep} )))
            let itemSizes = Array.from(ownedItems.map( (k) => {return k.data.data.size})).sort( (a,b) => (a-b))
            

            let itemModSizes = [];
            let keepAdd = 0;
            for (var i = 0; i < itemSizes.length; i++) {
                keepAdd = 1/(Math.max(itemSizes[i]*-1,1))
                if (keepAdd == Infinity) { keepAdd = 0}
            }
            data.keepOfItems += keepAdd
            data.keepOfItems = Math.floor(data.keepOfItems)

            data.wealth = Math.pow(data.charattribut.Ressourcen.attribut,2)
        };

        if (this.type == 'Nebencharakter') {
            data.halfBs = Math.ceil( (data.Bedrohungsstufe)/2 );

            data.initiative =  data.Bedrohungsstufe;
            data.finalinitiative = data.initiative + data.initMod; 
        };

        if (this.type == 'Drohne/Fahrzeug') {
            
        };
    

        
        
    }
}