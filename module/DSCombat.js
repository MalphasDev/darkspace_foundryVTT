export default class DSCombat extends Combat {
    
    _sortCombatants(a, b) {
        /*
        console.log(a);
        console.log(a._actor.name);
        console.log("Würfel: "+ a._actor.data.data.customroll.dice+"W10");
        console.log("Bonus: "+ a._actor.data.data.customroll.bonus);
        */
        const aeA = parseInt(a.initiative) || 0;
        const aeB = parseInt(b.initiative) || 0;

        var sort = -1;
        console.log(sort);
        
        return ((aeA - aeB)*sort);
    }

    async startCombat() {
        console.log("+++ startCombat +++")
        await this.setupTurns();

        await this.rollAll();

        
        
        console.log("++++++++++");
        var combatantlist_length = document.querySelectorAll(".combatant",".active").length;
        var combatantlist = document.querySelectorAll(".combatant",".active")
        var activeCombatant;
        /*
        console.log(token);
        debugger;

        
        console.log("+++++ combatant +++++");
        console.log(actor);
        console.log("++++++++++");
        */
        for(var i = 0; i < combatantlist_length; i++) {
            //console.log(combatantlist[i].dataset.combatantId);
            //console.log(combatantlist[i].className.includes("active"));
            if(combatantlist[i].className.includes("active")) {
                activeCombatant = combatantlist[i].dataset.combatantId;
            }
        }
        
        console.log(combatantlist);
        console.log(activeCombatant);
        var r = new Roll("2d10",{});
        r.evaluate();
        console.log(r);
        console.log(r.terms);
        console.log(r.result);
        console.log(r.total);
        
        return this.updateCombatant ({
            _id: activeCombatant,
            initiative: r.total
            
        });
        
        


        
    }
    /*
    rollInitiative(ids, options) {
        console.log(ids);
        console.log(options);

        var ini = 1;
        return Promise.Combat()
    }
    */
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
}