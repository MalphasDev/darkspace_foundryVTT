export default class DSCombatTracker extends CombatTracker {

    get template() {
        return "systems/darkspace/templates/sidebar/combat-tracker.html";
    }
    getData(html) {
        var data = super.getData(html);
        const combat = this.viewed;
        console.log("+++++++ getData ++++++++");

        //combat.eliminateDefeated();

        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);

        html.find(".aeCost").click(this._increaseAE.bind(this));
        html.find(".aeCost").click(this._increaseAE.bind(this));
    }

    async _increaseAE(event) {
        console.log("+++ _increaseAE +++")

        const combat = this.viewed;

        console.log("++++++++++")
        var combatantlist_length = document.querySelectorAll(".combatant",".active").length;
        var combatantlist = document.querySelectorAll(".combatant",".active")
        var activeCombatant;
        console.log(combatantlist);
        
        console.log("+++ Starte Schleife +++")
        for(var i = 0; i < combatantlist_length; i++) {
            //console.log(combatantlist[i].dataset.combatantId);
            //console.log(combatantlist[i].className.includes("active"));
            if(combatantlist[i].className.includes("active")) {
                activeCombatant = combatantlist[i].dataset.combatantId;
            }
        }
        var aeCost;
        console.log(document.getElementById("customAE"))
        if(event.currentTarget.className.includes("aeCostCustom")) {
            aeCost = parseInt(document.getElementById("customAE").value);
        } else {
            aeCost = parseInt(event.currentTarget.dataset.aecost);
        }

        console.log("++++++++++")
        console.log("Aktiver Combatant: " + activeCombatant);
        console.log("++++++++++")
        console.log("AE-Erhöhung: " + aeCost);
        combat.increaseAE(activeCombatant, aeCost);
    }
    
}