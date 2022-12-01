import * as DSCombatant from "./DSCombatant.js";
import { darkspace } from "./config.js";
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
    html.find(".hitTracker").click(this._hitTracker.bind(this));
  }

  _sendAE(options) {
    const combat = this.viewed;
    var currentTargetId = combat.targetCombatant;
    if (combat.targetCombatant === undefined) {
      currentTargetId = this.getCurrentTargetId();
    }

    combat.sendAE = 0;

    combat.setInitiative(currentTargetId, combat.newIni);

    // if (game.user.isGM) {
    //   currentCombatant.update({
    //     id: currentTargetId,
    //     initiative: newIni,
    //   });
    // } else {
    //   game.socket.emit("system.darkspace", {
    //     operation: "updateInitRoll",
    //     id: currentTargetId,
    //     initiative: newIni,
    //   });
    // }

    // combat.nextRound();

    // for (var i = 0; Array.from(combat.data.combatants).length > i; i++) {
    //   combat.data.combatants
    //     .map((j) => {
    //       return j;
    //     })
    //     [i].setFlag("darkspace", "target", false);
    // }

    // Es wird bei jedem Combat-Update ein Test gemacht, ob turn = 0. Wenn nein, wird der turn auf 0 gesetzt = erster Charakter
  }

  getCurrentTargetId(event) {
    return Array.from(
      this.viewed.turns.map((c) => {
        return c.id;
      })
    )[0];
  }

  async _increaseAE(event, options) {
    //event.preventDefault();
    const combat = this.viewed;

    if (combat.sendAE >= 0) {
    } else {
      combat.sendAE = 0;
    }

    var aeCost;

    if (options) {
      combat.sendAE = options.aeCost;
      combat.targetCombatant = options.hitTarget;
      this._getNewField();
      this._sendAE();
    } else {
      combat.targetCombatant = this.getCurrentTargetId();
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
        } else {
          combat.sendAE += parseInt(aeCost);
        }
      }

      if (game.settings.get("darkspace", "ae_input") === "ae_slider") {
        combat.sendAE = parseInt(event.currentTarget.value);
      }
    }
    this._getNewField();

    // combat.turns.forEach((combatant) => {
    //   if (combatant.getFlag("darkspace", "target") === undefined) {
    //     combatant.setFlag("darkspace", "target", false);
    //   }
    //   combatant.setFlag(
    //     "darkspace",
    //     "target",
    //     combatant.initiative <= parseInt(newField)
    //   ); // target Flagge wird auf true gesetzt
    // });

    this.render();
  }

  _getNewField() {
    const combat = this.viewed;

    var currentTargetId = combat.targetCombatant;
    if (combat.targetCombatant === undefined) {
      currentTargetId = this.getCurrentTargetId();
    }

    const currentCombatantIni = combat.data.combatants.filter((r) => {
      return r.id === currentTargetId;
    })[0].data.initiative;

    // Hier werden die nächsten 100 freien Felder ermittelt, die der Charakter auf dem Ini-Board erreichen kann
    var nextAe = [];
    for (let index = 0; index < 100; index++) {
      nextAe.push(currentCombatantIni + index);
    }
    var iniList = combat.turns.map((c) => {
      return c.initiative;
    });

    // Die eigene Position finden

    // Hier wird das Feld um alle besetzten Felder reduziert.

    combat.legalFields = nextAe.filter((x) => !iniList.includes(x));

    // combat.legalFields = iniList
    //   .filter((x) => !nextAe.includes(x))
    //   .concat(nextAe.filter((x) => !iniList.includes(x)));

    // Hier wird das neue Feld anhand der ausgegeben AE als Index ermittelt.

    if (combat.newIni === undefined) {
      combat.newIni = combat.legalFields[0];
    } else {
      combat.newIni = combat.legalFields[combat.sendAE - 1];
    }
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
  _hitTracker(event) {
    const combat = this.viewed;
    var currentTargetId = this.getCurrentTargetId();

    let hitTarget = event.currentTarget.dataset.combatantId;
    let hitTargetIni = combat.data.combatants.filter((i) => {
      return hitTarget === i.data._id;
    })[0].data.initiative;

    this._increaseAE(event, { aeCost: 1, hitTarget: hitTarget });

    // combat.setInitiative(hitTarget, hitTargetIni + 1);
  }
}
