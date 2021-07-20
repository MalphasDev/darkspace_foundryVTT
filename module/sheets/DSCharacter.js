//import { darkspace } from "../config";

export default class DSCharacter extends Actor {
    prepareData() {
        super.prepareData();
        
        const event = new Event("click")

        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;

        
    
        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.

        if (this.type != 'DrohneFahrzeug') {
            data.bruises.max = 5 + data.bruises.bonus;
            data.wounds.max = 5 + data.wounds.bonus;

            
        }

        if (this.type == 'Charakter') {
            data.initiative =  Math.ceil((data.charattribut.Aufmerksamkeit.attribut + data.charattribut.Geschick.attribut + data.charattribut.Intuition.attribut)/3);
            data.finalinitiative = data.initiative + data.initMod; 
            
            // Unterhalt und Wohlstand
            let ownedItems = this.data.items.filter( (i) => {return (i.type != "Talent") && (i.type != "Besonderheiten")} )
            //console.log(ownedItems)
            //data.keepOfItems = Math.max(...Array.from(ownedItems.map( (k) => {return k.data.data.keep} )))
            let itemSizes = Array.from(ownedItems.map( (k) => {return k.data.data.size})).sort( (a,b) => (a-b))
            let itemMk = Array.from(ownedItems.map( (k) => {return k.data.data.mk})).sort( (a,b) => (a-b))
            
            // console.log("keepOfItems: " + data.keepOfItems)
            // console.log(itemSizes)
            // console.log("Item MK: "+itemMk)
            // console.log("Größtes Item: "+Math.max(...itemSizes))
            // console.log("Max. MK Item: "+Math.max(...itemMk))
            
            // let keepAdd = 0;
            // for (var i = 0; i < itemSizes.length; i++) {
            //     keepAdd = 1/(Math.max(itemSizes[i]*-1,1))
            //     console.log(keepAdd)
            // }
            
            //data.keepOfItems += keepAdd
            //data.keepOfItems = Math.floor(data.keepOfItems)
            
            //console.log("Unterhalt: "+data.keepOfItems)
            
            data.keepOfItems = Math.max(...itemSizes) + Math.max(...itemMk);
            data.wealth = data.charattribut.Ressourcen.attribut*2;
        };

        if (this.type == 'Nebencharakter') {
            data.initiative =  data.Bedrohungsstufe;

            for (var prop in data.charattribut) {
                let prioBonus
                if (data.charattribut[prop].prio) { prioBonus = 1 } else { prioBonus = 0 }

                data.charattribut[prop].attribut = data.Bedrohungsstufe + prioBonus
                
                for (var skill in data.charattribut[prop].skill) {
                    data.charattribut[prop].skill[skill] = Math.ceil(data.Bedrohungsstufe/2) + prioBonus
                }
            }
        };

        if (this.type == 'DrohneFahrzeug') {
            data.structure = Math.max(data.mk + data.size,2);
            data.damageFailure = data.structure + data.damages.max;
            data.damageDestruction = data.damageFailure * 2;

            data.halbmk = Math.ceil(data.mk / 2);
            data.noMk = 0;

            data.initiative =  data.mk;
            data.finalinitiative = data.initiative + data.initMod;
            data.initBonus = Math.ceil(data.mk / 2);
        };
    
        
        
    }
}