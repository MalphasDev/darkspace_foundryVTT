export default class DSCombatTracker extends CombatTracker {
  get template() {
    return "systems/darkspace/templates/sidebar/combat-tracker.html";
  }
  async getData(options) {
    const context = await super.getData(options);
    const combat = this.viewed;

    context.turns.forEach((turn) => {
      turn.flags = context.combat.combatants.get(turn.id)?.data.flags;
    });

    if (combat != null) {
      if (combat.sendAE == undefined) {
        combat.sendAE = 0;
      }
      if (game.settings.get("darkspace", "ae_input") == "ae_button") {
        combat.uiButton = true;
        combat.uiSlider = false;
      }
      if (game.settings.get("darkspace", "ae_input") == "ae_slider") {
        combat.uiButton = false;
        combat.uiSlider = true;
      }
    }

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".aeCost").change(this._increaseAE.bind(this));
    html.find(".aeCost").click(this._increaseAE.bind(this));
    html.find(".wait").click(this._preWaitCombat.bind(this));
    html.find(".sendAE").click(this._sendAE.bind(this));
  }

  _sendAE() {
    const combat = this.viewed;
    var currentTargetId = this.getCurrentTargetId();
    var aeCost = combat.sendAE;

    combat.increaseAE(currentTargetId, aeCost);
    for (var i = 0; Array.from(combat.data.combatants).length > i; i++) {
      combat.data.combatants
        .map((j) => {
          return j;
        })
        [i].setFlag("darkspace", "target", false);
    }
  }

  getCurrentTargetId(event) {
    return Array.from(
      this.viewed.turns.map((c) => {
        return c.id;
      })
    )[0];
  }

  async _increaseAE(event) {
    //event.preventDefault();
    const combat = this.viewed;
    var combatantList = this.combatantList();

    const currentCombatantIni = combatantList.filter((r) => {
      return r[1];
    })[0][1];

    if (combat.sendAE >= 0) {
    } else {
      combat.sendAE = 0;
    }

    var aeCost;

    if (game.settings.get("darkspace", "ae_input") === "ae_button") {
      if (event.currentTarget.className.includes("aeCostCustom")) {
        aeCost = parseInt(document.getElementById("customAE").value);
      } else {
        aeCost = parseInt(event.currentTarget.dataset.aecost);
      }

      // Zurücksetzen oder nicht zurücksetzen. Das wird hier gefragt!
      if (aeCost === 0) {
        // Wenn aeCost === 0 bzw. +0 Ae übergeben wird entspricht einem Reset
        combat.sendAE = 0;
        // for (var i = 0; Array.from(combat.data.combatants).length > i; i++) {
        //   combat.data.combatants
        //     .map((j) => {
        //       return j;
        //     })
        //     [i].setFlag("darkspace", "target", false);
        // }
      } else {
        combat.sendAE += parseInt(aeCost);
      }
    }

    if (game.settings.get("darkspace", "ae_input") === "ae_slider") {
      combat.sendAE = parseInt(event.currentTarget.value);
    }

    var newIni = currentCombatantIni + combat.sendAE;

    // for (var i = 0; combatantList.length > i; i++) {
    //   if (parseInt(combatantList[i][1]) < parseInt(newIni)) {
    //     combat.data.combatants
    //       .get(combatantList[i][0])
    //       .setFlag("darkspace", "target", true);
    //   }
    // }
    //console.log(combat.turns);
    combat.turns.forEach((combatant) => {
      //let targetState = combatant.initiative <= parseInt(newIni);
      combatant.data.flags.darkspace.target =
        combatant.initiative <= parseInt(newIni);
      //combatant.setFlag("darkspace", "target", targetState);

      // console.log(combatant.initiative + " <= " + newIni);
      // console.log(targetState);
      // console.log(combatant.getFlag("darkspace", "target"));
      // console.log(combatant.data.flags.darkspace.target);
    });

    this.render();
  }

  async _preWaitCombat(event) {
    const combat = this.viewed;
    var currentTargetId = this.getCurrentTargetId();
    var options = {};
    combat._waitCombat(currentTargetId, options, event);
  }
  combatantList() {
    const combat = this.viewed;
    let combatantList = combat.data.combatants
      .map((i) => {
        return [i.id, i.data.initiative];
      })
      .sort((a, b) => {
        return a[1] - b[1];
      });
    return combatantList;
  }
}
