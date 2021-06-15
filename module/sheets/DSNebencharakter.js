import DSCharakcterSheet from './DSCharacterSheet.js';
/**
 * @noInheritDoc
 */
export default class DSNebencharakter extends DSCharakcterSheet {
    
    static get defaultOptions() {
        console.log('+++ NPC +++')
        return mergeObject(super.defaultOptions, {
            template: "systems/darkspace/templates/sheets/Nebencharakter-sheett.html",
            classes: ["darkspace", "sheet", "Nebencharakter"],
            width: 800,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats"}]
        });
    }

    getData() {
        let data = super.getData();
        
        return data;
    }
    get template() {
        
        return 'systems/darkspace/templates/sheets/Nebencharakter-sheet.html';
    }
}