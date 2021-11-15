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
    if (combat.sendAE >= 0) {
    } else {
      combat.sendAE = 0;
    }
    var currentTargetId = this.getCurrentTargetId();

    var aeCost;

    //combat.sendAE = parseInt(event.currentTarget.dataset.aeCost);
    //combat.update({sendAE: combat.sendAE})
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
    this.render();
  }

  async _preWaitCombat(event) {
    const combat = this.viewed;
    var currentTargetId = this.getCurrentTargetId();
    var options = {};
    combat._waitCombat(currentTargetId, options, event);
  }
}
