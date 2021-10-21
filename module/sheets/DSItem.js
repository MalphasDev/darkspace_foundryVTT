import * as DSMechanics from "../DSMechanics.js";
export default class DSItem extends Item {
    
    
    prepareData() {
        super.prepareData();
    
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};

        const data = itemData.data;
        
        
        // Struktur und Schutz //
        data.baseStructure = data.mk + data.size;
        data.structure = data.baseStructure < 1 ? 1 : data.baseStructure;
        data.protection = Math.floor(data.mk / 2);

        // Senorreichweite //
        data.sensorRange = Math.pow(data.mk + data.size, 2)

        // Unterhalt //
        data.keep = Math.max(data.mk,data.size,0);
        

        // Waffen //
        data.mkdmg = Math.ceil(data.mk*1,5);
        data.sizedmg = Math.ceil(data.size/2);
        if (data.dmgBonus === undefined) {data.dmgBonus = 0}
        data.dmg = Math.max(data.mkdmg + data.sizedmg + data.dmgBonus,1);
        
        if (data.ranged === true) {
            data.sizeRange = Math.max(data.size, -3)+4;
            data.autoRangeBase = Math.pow(data.sizeRange + data.rangeBonus, 2) * 10;
            data.autoRangeShort = data.autoRangeBase / 10
            data.autoRangeExtr = data.autoRangeBase * 2
            data.autoRangeMax = data.autoRangeBase * 10
            data.range = data.autoRangeShort+"-"+data.autoRangeBase+"/"+data.autoRangeExtr+"/"+data.autoRangeMax;
        } else {
            data.range = "Nahkampf"
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
        if (this.type === "Waffe") {
            switch (data.size) {
                case -3: data.sizeKat = data.sizeKat + "/Pistole";
                break;
                case -2: data.sizeKat = data.sizeKat + "/Karabiner";
                break;
                case -1: data.sizeKat = data.sizeKat + "/Gewehr";
                break;
                case 0: data.sizeKat = data.sizeKat + "/Unterstützung";
                break;
                case 1: data.sizeKat = data.sizeKat + "/Kanone";
                break;
                case 2: data.sizeKat = data.sizeKat + "/Geschütz";
                break;
                case 3: data.sizeKat = data.sizeKat + "/Geschütz";
                break;
                case 4: data.sizeKat = data.sizeKat + "/Geschütz";
                break;
            }
        }

        
    }



}