export default class DSCombat extends Combat {
    _sortCombatants(a, b) {
        const aeA = parseInt(a.initiative) || 0;
        const aeB = parseInt(b.initiative) || 0;
        return (aeA - aeB);
    }

    async startCombat() {
        console.log("+++ startCombat +++")
        await this.setupTurns();
        await this.setFlag("darkspace", "ae-kosten", []);

        await this.rollAll();
        return super.nextRound();
    }
    


    async increaseAE(id, value) {
        
        var ae = this.combatant.initiative + value; // Aktuelle AE + AE-Kosten

        return this.updateCombatant ({
            _id: id,
            initiative: ae
        })
    }

    eliminateDefeated () {
        console.log("++++ eliminateDefeated ++++");
        var combatantlist_length = document.querySelectorAll(".combatant",".defeated").length;
        var combatantlist = document.querySelectorAll(".combatant",".defeated");
        console.log(combatantlist);

        console.log("+++ Starte Schleife +++")
        for(var i = 0; i < combatantlist_length; i++) {
            deafeatedCombatant = combatantlist[i].dataset.combatantId;
        }
    }
    /*
    async rollInitiative(ids, { formula = null, updateTurn = true, messageOptions = {} } = {}) {
        console.log("+++ rollInitiative +++");

        //options = { formula: formula, updateTurn: updateTurn, messageOptions: messageOptions };
        await super.rollInitiative(ids, { formula: formula, updateTurn: updateTurn, messageOptions: messageOptions });
        //console.log(this.rollInitiative());
        return this.nextRound();
        


    }
    */
}