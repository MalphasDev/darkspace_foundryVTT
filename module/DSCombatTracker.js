export default class DSCombatTracker extends CombatTracker {
  get template() {
    return "systems/darkspace/templates/sidebar/combat-tracker.html";
  }
  getData(html) {
    var data = super.getData(html);
    const combat = this.viewed;

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

    return data;
  }
  get turns() {}
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
    const currentCombatantId = combatantList.filter((r) => {
      return r[1];
    })[0][0];
    const currentCombatantIni = combatantList.filter((r) => {
      return r[1];
    })[0][1];

    if (combat.sendAE >= 0) {
    } else {
      combat.sendAE = 0;
    }

    var aeCost;

    if (game.settings.get("darkspace", "ae_input") == "ae_button") {
      if (event.currentTarget.className.includes("aeCostCustom")) {
        aeCost = parseInt(document.getElementById("customAE").value);
      } else {
        aeCost = parseInt(event.currentTarget.dataset.aecost);
      }

      if (aeCost === 0) {
        combat.sendAE = 0;
      } else {
        combat.sendAE += parseInt(aeCost);
      }
    }

    if (game.settings.get("darkspace", "ae_input") == "ae_slider") {
      combat.sendAE = parseInt(event.currentTarget.value);
    }

    // TODO: ++++ FEATURE: Combatants denen eine Reflexaktion zusteht erkennen ++++

    // var newIni = currentCombatantIni + combat.sendAE;

    // for (var i = 0; combatantList.length > i; i++) {
    //   console.log(parseInt(combatantList[i][1]) < parseInt(newIni));
    //   if (parseInt(combatantList[i][1]) < parseInt(newIni)) {
    //     combat.data.combatants
    //       .get(combatantList[i][0])
    //       .setFlag("darkspace", "target", true);
    //   }
    // }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
