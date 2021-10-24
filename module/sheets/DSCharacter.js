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

            let weaponList = this.data.items.filter( (f) => {return f.type === "Waffe"})
            let armorList = this.data.items.filter( (i) => {return (i.data.type === "Panzerung")})

            data.conditions = []

            if (data.bruises.value === data.bruises.max) {
                data.conditions.push("Leichtes Ziel")
            }
            if (data.wounds.value >= data.wounds.max) {
                data.conditions.push("Außer Gefecht")
            }
            if (parseInt(data.wounds.value) >= 10) {
                data.conditions.push("Tod")
            }
            
            let armorListEquipped = armorList.filter((e) => {return e.data.data.equipped === true})
            let StrukturArray = Array.from(armorListEquipped.map( (a) => {return (a.data.data.structure)} ))
            StrukturArray.push(0);

            let SchutzArray = Array.from(armorList.map( (a) => {return (a.data.data.protection)} ))
            SchutzArray.push(0);
            
            let addedArmors = Math.min(Math.max(StrukturArray.length-2,0),2)

            data.Struktur = Math.max(...StrukturArray);
            data.Schutz = Math.max(...SchutzArray) + addedArmors;

            
            
            
        }

        if (this.type == 'Charakter') {


            data.bruises.value < 0 ? data.bruises.value = 0 : data.bruises.value;
            data.wounds.value < 0 ? data.wounds.value = 0 : data.wounds.value;
            
            data.bruises.value > data.bruises.max ? data.bruises.value = data.bruises.max : data.bruises.value;
            data.wounds.value > 10  ? data.wounds.value = 10 : data.wounds.value;

            data.bruises.max = 5 + data.bruises.bonus + Math.floor(data.charattribut.Konzentration.attribut/6);
            data.wounds.max = 5 + data.wounds.bonus + Math.floor(data.charattribut.Konstitution.attribut/6);
            
            data.bruises.remaining = Math.max(data.bruises.max - data.bruises.value,0)
            data.wounds.remaining = Math.max(data.wounds.max - data.wounds.value,0)


            data.initiative =  Math.ceil((data.charattribut.Aufmerksamkeit.attribut + data.charattribut.Geschick.attribut + data.charattribut.Intuition.attribut)/3);
            data.finalinitiative = data.initiative + data.initMod; 
            
            // Unterhalt und Wohlstand
            let ownedItems = this.data.items.filter( (i) => {return (i.type != "Talent") && (i.type != "Besonderheiten")} )
            let itemSizes = Array.from(ownedItems.map( (k) => {return k.data.data.size})).sort( (a,b) => (a-b))
            let itemMk = Array.from(ownedItems.map( (k) => {return k.data.data.mk})).sort( (a,b) => (a-b))
            
            data.keepOfItems = Math.max(...itemSizes) + Math.max(...itemMk);
            data.wealth = data.charattribut.Ressourcen.attribut*2;

            data.miscData.Kybernese.mk = this.data.items.filter( (i) => {return (i.type === "Artifizierung")}).map( (j) => {return j.data.data.mk});
            data.miscData.Kybernese.bonus = Math.min(...data.miscData.Kybernese.mk);

            // Waffenloser Schaden
            data.unarmedDmg = 2 + Math.floor(data.charattribut.Konstitution.attribut/6);
            data.unarmedDmgType = "B"

            
            
        };

        if (this.type == 'Nebencharakter') {

            data.bruises.max = 5 + data.bruises.bonus + Math.floor(data.charattribut.Geistig.attribut/6);
            data.wounds.max = 5 + data.wounds.bonus + Math.floor(data.charattribut.Körperlich.attribut/6);

            // Waffenloser Schaden
            data.unarmedDmg = 2 + Math.floor(data.charattribut.Körperlich.attribut/6);
            data.unarmedDmgType = "B"

            data.initiative =  data.Bedrohungsstufe;

            for (var prop in data.charattribut) {
                let prioBonus
                if (data.charattribut[prop].prio) { prioBonus = 1 } else {
                    if (data.charattribut[prop].dePrio) { prioBonus = -1 } else {
                        prioBonus = 0
                    }
                }
                

                data.charattribut[prop].attribut = data.Bedrohungsstufe + prioBonus
                
                if (data.charattribut[prop].dePrio) {
                    for (var skill in data.charattribut[prop].skill) {
                        data.charattribut[prop].skill[skill] = 0
                    }
                } else {
                    for (var skill in data.charattribut[prop].skill) {
                        data.charattribut[prop].skill[skill] = Math.ceil(data.Bedrohungsstufe/2) + prioBonus
                    }
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