import * as DSCombat from "./DSCombat.js"
export class DSCombatTracker extends CombatTracker {
  get template() {
    return "systems/darkspace/templates/sidebar/combat-tracker.html";
  }
  async getData(options) {
    const context = await super.getData(options);
    const combat = this.viewed;

    context.turns.forEach((turn) => {
      turn.flags = context.combat.combatants.get(turn.id)?.flags;
    });

    if (combat != null) {
      if (combat.sendAE == undefined) {
        combat.sendAE = 0;
      }
      if (combat.turns.length !== 0) {
        // Letzten Actor finden
        let fristActorIni = combat.turns[0].initiative;
        let lastActorIni = combat.turns[combat.turns.length - 1].initiative;

        // Alle freien Felder zwischen den Charakteren finden
        const range = (start, stop, step) =>
          Array.from(
            { length: (stop - start) / step + 1 },
            (_, i) => start + i * step
          );
        combat.inbetween = range(fristActorIni, lastActorIni, 1).filter(
          (x) =>
            !combat.turns
              .map((c) => {
                return c.initiative;
              })
              .includes(x)
        );
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

  _sendAE() {
    const combat = this.viewed;
    var currentTargetId = combat.targetCombatant;
    if (combat.targetCombatant === undefined) {
      currentTargetId = this.getCurrentTargetId();
    }

    combat.sendAE = 0;

    console.log("combat.setInitiative",currentTargetId,combat.newIni);
    combat.setInitiative(currentTargetId, combat.newIni);

    // Es wird bei jedem Combat-Update ein Test gemacht, ob turn = 0. Wenn nein, wird der turn auf 0 gesetzt = erster Charakter
  }

  getCurrentTargetId() {
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
    this._getNewField();
    this.render();
  }

  _getNewField() {
    const combat = this.viewed;

    var currentTargetId = combat.targetCombatant;
    if (combat.targetCombatant === undefined) {
      currentTargetId = this.getCurrentTargetId();
    }

    const currentCombatantIni = combat.combatants.filter((r) => {
      return r.id === currentTargetId;
    })[0].initiative;

    // Hier werden die nächsten 100 freien Felder ermittelt, die der Charakter auf dem Ini-Board erreichen kann
    let nextAe = [];
    for (let index = 0; index < 100; index++) {
      nextAe.push(currentCombatantIni + index);
    }
    let iniList = combat.turns.map((c) => {
      return c.initiative;
    });

    // Die eigene Position finden

    // Hier wird das Feld um alle besetzten Felder reduziert.
    combat.legalFields = nextAe.filter((x) => !iniList.includes(x));

    // Hier wird das neue Feld anhand der ausgegeben AE als Index ermittelt.
    combat.newIni = combat.legalFields[combat.sendAE - 1];
  }

  async _preWaitCombat(event) {
    const combat = this.viewed;
    var currentTargetId = this.getCurrentTargetId();
    var options = {};
    combat._waitCombat(currentTargetId, options, event);
  }
  combatantList() {
    const combat = this.viewed;

    let combatantList = combat.combatants
      .map((i) => {
        return [i.id, i.initiative];
      })
      .sort((a, b) => {
        return a[1] - b[1];
      });
    return combatantList;
  }
  _hitTracker(event) {
    const combatantId = event.currentTarget.closest('.combatant').dataset.combatantId;
    this._increaseAE(event, { aeCost: document.getElementById(combatantId+"_ae").value, hitTarget: combatantId });
  }


  async itemAe(actorId, aeCost) {
    const combat = this.viewed;
    if (combat != null) {
      const rollingActor = this.viewed.turns.filter(
        (actor) => actor.actorId === actorId
      )[0];

      if (rollingActor.id === combat.current.combatantId) {
        // this._increaseAE({}, { aeCost: aeCost, hitTarget: rollingActor.id });
        combat.sendAE += parseInt(aeCost);
        combat.targetCombatant = rollingActor.id;
        console.log(combat.sendAE,combat.newIni);
        this._getNewField();
        this.render(true);
      }
    }
  }
}
