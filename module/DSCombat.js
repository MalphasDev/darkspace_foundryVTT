export default class DSCombat extends Combat {
    
    

    _sortCombatants(a, b) {
        let aeA = parseInt(a.initiative) || 99999;
        let aeB = parseInt(b.initiative) || 99999;

        var isCombatStarted = a.parent.getFlag('darkspace', 'isCombatStarted') ? 1 : -1; //holt sich vom parent (=combat) die info ob er begonnen hat, wird in startCombat gesetzt.
        
        return ( (aeA - aeB)*isCombatStarted );
    }

    async startCombat() {
        await this.setupTurns();
        this.setFlag('darkspace', 'isCombatStarted', true); //Muss unbeding aufgerufen werden bevor die ini gerollt wird
        this.rollFirstInitiative();

        return this.update({round: 1, turn: 0});
    }
    
    rollFirstInitiative () {

        
        this.rollInitiative( Array.from(this.data.combatants.values()).filter( (c) => {
            return c.data.initiative === undefined;
        }).map( (c) => { return c.data._id } ), {} ) // Map wird benutzt, um aus dem gefilterten Array die _id mit RETURN auszugeben

        let preSortetCombatants = this.preSortetCombatants();
        
        let startAE = 1; // Setzt erstes "Feld des Initiativ-Boards" 
        preSortetCombatants.forEach( (c) => {
            this.updateCombatant({
                _id: c.data._id,
                initiative: startAE++
            });
        })
    }

    preSortetCombatants() {
        return Array.from(this.data.combatants.values()).sort( 
            (a,b) => {
                return b.data.initiative - a.data.initiative
            }
            );
    }

    rollInitiative(ids, options) {

        var actorData = this.data.combatants;
        let preSortetCombatants = this.preSortetCombatants().filter( (c) => { return c.data.initiative != undefined; } );
        console.log(preSortetCombatants)
        var isCombatStarted = this.getFlag('darkspace', 'isCombatStarted') ? true : false;
        
        if (isCombatStarted) {
            
            ids.forEach( (id) => { this.updateCombatant({
                _id: id,
                initiative: preSortetCombatants[0].data.initiative + 1
            });
        })
        } else {
            // console.log(ids);
            // 
            // console.log(actorByCombatantId.data.initiative)
            // console.log(actorByCombatantId.data.initiative + "d10kh2")
            
            ids.forEach( (id) => { 
                console.log(id)
                
                var currentCombatant = Array.from(actorData.filter( (d) => {return d.data._id == id} ))[0];
                var actorByCombatantId = currentCombatant._actor.data;
                console.log(currentCombatant)
                var initRoll = new Roll(actorByCombatantId.data.initiative + "d10kh2",{}).evaluate()
                this.updateCombatant({
                    _id: id,
                    initiative: initRoll.total
                });
                console.log(initRoll)

                let chatdata =  {
                    user: game.user.id,
                    speaker: {actor: currentCombatant.data.actorId},
                    roll: initRoll,
                    flavor: "würfelt Initiative"
                }
                console.log(chatdata)
                console.log(typeof chatdata)
                initRoll.toMessage(chatdata, {})
            })
        }


        return this;
    }
    
    async increaseAE(id, value) {
        const Combatant = this.combatant;
        var ae = this.combatant.initiative + value || 0; // Aktuelle AE + AE-Kosten
        
        // In-Combat Tie Breaker //
        var iniList = this.turns.map( (c) => {return c.data.initiative;}) // Stellt Array mit Initiative zusammen
        while (ae === iniList[iniList.indexOf(ae)]) {   // Testet ob ein Element aus dem Array gleich der neuen Initiative ist
            ae++                                        
        }

        return Combatant.update ({
            _id: id,
            initiative: ae
        })
    }

    _waitCombat(id) {
        const Combatant = this.combatant;
        //console.log(this.combatant)
        //debugger;
        return Combatant.update ({
            _id: id,
            initiative: null
        })
    }

    eliminateDefeated () {
        //console.log("++++ eliminateDefeated ++++");
        var combatantlist_length = document.querySelectorAll(".combatant",".defeated").length;
        var combatantlist = document.querySelectorAll(".combatant",".defeated");
        //console.log(combatantlist);

        //console.log("+++ Starte Schleife +++")
        for(var i = 0; i < combatantlist_length; i++) {
            deafeatedCombatant = combatantlist[i].dataset.combatantId;
        }
    }
}