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
        }

        if (this.type == 'Charakter') {

            data.initiative =  Math.ceil((data.charattribut.Aufmerksamkeit.attribut + data.charattribut.Geschick.attribut + data.charattribut.Intuition.attribut)/3);
            data.finalinitiative = data.initiative + data.initMod; 

            data.maxBruises = 5 + data.bruises.max;
            data.maxWounds = 5 + data.wounds.max;

            let ownedItems = this.data.items.filter( (i) => {return (i.type != "Talent") && (i.type != "Besonderheiten")} )
            
            data.keepOfItems = Math.max(...Array.from(ownedItems.map( (k) => {return k.data.data.keep} )))
            let itemSizes = Array.from(ownedItems.map( (k) => {return k.data.data.size})).sort( (a,b) => (a-b))
            

            let itemModSizes = [];
            let keepAdd = 0;
            for (var i = 0; i < itemSizes.length; i++) {
                console.log(i)
                itemModSizes.push(1/ (Math.pow(10,(itemSizes[i]*-1)) ))
                console.log(">"+(1/ (Math.pow(10,(itemSizes[i]*-1)) )))
                console.log(">>"+itemModSizes.push(1/ (Math.pow(10,(itemSizes[i]*-1)) )))

                keepAdd += (1/ (Math.pow(10,(itemSizes[i]*-1)) ))
            }
            data.keepOfItems += keepAdd
            data.keepOfItems = Math.floor(data.keepOfItems)
            if (data.keepOfItems == -Infinity) { data.keepOfItems = 0;}
        };

        if (this.type == 'Nebencharakter') {
            data.halfBs = Math.ceil( (data.Bedrohungsstufe)/2 );
            
        };

        if (this.type == 'Drohne/Fahrzeug') {
            
        };
    
    
    
    }
}