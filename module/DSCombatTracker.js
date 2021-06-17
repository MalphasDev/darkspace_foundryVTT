export default class DSCombatTracker extends CombatTracker {

    get template() {
        return "systems/darkspace/templates/sidebar/combat-tracker.html";
    }
    getData(html) {
        var data = super.getData(html);
        const combat = this.viewed;

        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".aeCost").click(this._increaseAE.bind(this));
        html.find(".wait").click(this._preWaitCombat.bind(this));
    }

    getCurrentTargetId(event) {
        console.log(Array.from(this.viewed.turns.map( (c) => {return c._id} ))[0]);
        return Array.from(this.viewed.turns.map( (c) => {return c._id} ))[0];
    }

    async _increaseAE(event) {
        console.log("combatTracker._increaseAE")
        const combat = this.viewed;

        var currentTargetId = this.getCurrentTargetId();

        var aeCost;
        if(event.currentTarget.className.includes("aeCostCustom")) {
            aeCost = parseInt(document.getElementById("customAE").value);
        } else {
            aeCost = parseInt(event.currentTarget.dataset.aecost);
        }

        combat.increaseAE(currentTargetId, aeCost);
    }

    async _preWaitCombat(event) {
        const combat = this.viewed;
        var currentTargetId = this.getCurrentTargetId();
        combat._waitCombat(currentTargetId, options, event);
    }
    
}