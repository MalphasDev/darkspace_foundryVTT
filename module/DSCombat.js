export default class DSCombat extends Combat {
    
    

    _sortCombatants(a, b) {
        const aeA = parseInt(a.initiative) || 0;
        const aeB = parseInt(b.initiative) || 0;

        var isCombatStarted = a.parent.getFlag('darkspace', 'isCombatStarted') ? 1 : -1; //holt sich vom parent (=combat) die info ob er begonnen hat, wird in startCombat gesetzt.
        
        return (
            (aeA - aeB)*isCombatStarted
            );
    }

    

    async startCombat() {
        await this.setupTurns();

        //Muss unbeding aufgerufen werden bevor die ini gerollt wird
        this.setFlag('darkspace', 'isCombatStarted', true);
        
        //console.log(this);
        //console.log(this.combatants.values());
        /*
        console.log(Array.from(this.combatants.values()));                        <--   Erstellt ein Array aus einer MAP des Combatant
        console.log(Array.from(this.combatants.values()).map( (c) => {return {    <--   Holt die Einträge "combantantID" und "initiative" aus der Map und erstellt daraus eine Array
            initiative: c.data.initiative,                                              https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Map
            combatendId: c.data._id                                                     https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        }} ));

        */
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

        return this.update({round: 1, turn: 0});
    }
    
    preSortetCombatants() {
        return Array.from(this.data.combatants.values()).sort( 
            (a,b) => {
                return b.data.initiative - a.data.initiative
            }
            );
    }

    rollInitiative(ids, options) {
        

        var isCombatStarted = this.getFlag('darkspace', 'isCombatStarted') ? true : false;

        if (isCombatStarted) {
            let preSortetCombatants = this.preSortetCombatants().filter(
                (c) => {
                    return c.data.initiative != undefined;
                }
            );
            console.log(preSortetCombatants[0].data);
            ids.forEach( (id) => {
                this.updateCombatant({
                    _id: id,
                    initiative: preSortetCombatants[0].data.initiative + 1
                });
            })
        
            
        } else {
            ids.forEach( (id) => {
                this.updateCombatant({
                    _id: id,
                    initiative: new Roll("2d10",{}).evaluate().total
                });
            })
        }
        

        

        return this;
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
}