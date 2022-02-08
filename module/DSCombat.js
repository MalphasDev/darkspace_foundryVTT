import * as DSMechanics from "./DSMechanics.js";
export default class DSCombat extends Combat {
  _sortCombatants(a, b) {
    let aeA = parseInt(a.initiative) || 99999;
    let aeB = parseInt(b.initiative) || 99999;

    var isCombatStarted = a.parent.getFlag("darkspace", "isCombatStarted")
      ? 1
      : -1; //holt sich vom parent (=combat) die info ob er begonnen hat, wird in startCombat gesetzt.

    return (aeA - aeB) * isCombatStarted;
  }

  async startCombat() {
    await this.setupTurns();
    this.setFlag("darkspace", "isCombatStarted", true); //Muss unbeding aufgerufen werden bevor die ini gerollt wird
    this.rollFirstInitiative();
    this.sendAE = 0;
    return this.update({ round: 1, turn: 0 });
  }
  rollFirstInitiative() {
    this.rollInitiative(
      Array.from(this.data.combatants.values())
        .filter((c) => {
          return c.data.initiative === undefined;
        })
        .map((c) => {
          return c.data._id;
        }),
      {}
    ); // Map wird benutzt, um aus dem gefilterten Array die _id mit RETURN auszugeben

    let preSortetCombatants = this.preSortetCombatants();

    let startAE = 1; // Setzt erstes "Feld des Initiativ-Boards"
    preSortetCombatants.forEach((c) => {
      this.updateCombatant({
        _id: c.data._id,
        initiative: startAE++,
      });
    });
  }

  preSortetCombatants() {
    return Array.from(this.data.combatants.values()).sort((a, b) => {
      return b.data.initiative - a.data.initiative;
    });
  }

  rollInitiative(ids, options) {
    const actorData = this.data.combatants;
    let preSortetCombatants = this.preSortetCombatants().filter((c) => {
      return c.data.initiative != undefined;
    });

    var isCombatStarted = this.getFlag("darkspace", "isCombatStarted")
      ? true
      : false;

    if (isCombatStarted) {
      if (preSortetCombatants.length != 0) {
        ids.forEach((id) => {
          this.updateCombatant({
            _id: id,
            initiative: preSortetCombatants[0].data.initiative + 1,
          });
        });
      } else {
        ids.forEach((id) => {
          this.updateCombatant({
            _id: id,
            initiative: 1,
          });
        });
      }
    } else {
      ids.forEach((id) => {
        var currentCombatant = Array.from(
          actorData.filter((d) => {
            return d.data._id == id;
          })
        )[0];
        var actorByCombatantId = currentCombatant._actor.data;

        let dynattr = actorByCombatantId.data.initiative;
        let dynskill = 0;
        let roleData = { attribute: "Initiative", skill: "Initiative" };

        let inputData = {
          eventData: {},
          actorId: currentCombatant.id,
          actorData: actorData,
          removehighest: false,
          object: {},
          dynattr: dynattr,
          dynskill: dynskill,
          roleData: roleData,
        };

        let outputData = DSMechanics.rollDice(inputData);
        let messageData = outputData.messageData;
        let cardData = outputData.cardData;
        let currentRollClass = event.currentTarget.className;
        let currentRoll;
        console.log(outputData.cardData._total);

        this.updateCombatant({
          _id: id,
          initiative: outputData.cardData._total,
        });
        // TODO: Template für Ini Wurf bauen
        // let chatTempPath = {
        //   Custom: "systems/darkspace/templates/dice/chatCustom.html",
        // };
        // messageData.content = renderTemplate(chatTempPath.Custom, cardData);
        AudioHelper.play({ src: CONFIG.sounds.dice });
        return ChatMessage.create(messageData);
      });
    }

    return this;
  }

  async increaseAE(id, value) {
    const Combatant = this.combatant;
    var ae = this.combatant.initiative + value || 0; // Aktuelle AE + AE-Kosten

    // In-Combat Tie Breaker //
    var iniList = this.turns.map((c) => {
      return c.data.initiative;
    }); // Stellt Array mit Initiative zusammen
    while (ae === iniList[iniList.indexOf(ae)]) {
      // Testet ob ein Element aus dem Array gleich der neuen Initiative ist
      ae++;
    }
    this.sendAE = 0;
    return Combatant.update({
      _id: id,
      initiative: ae,
    });
  }

  _waitCombat(id) {
    const Combatant = this.combatant;
    //debugger;
    return Combatant.update({
      _id: id,
      initiative: null,
    });
  }

  eliminateDefeated() {
    var combatantlist_length = document.querySelectorAll(
      ".combatant",
      ".defeated"
    ).length;
    var combatantlist = document.querySelectorAll(".combatant", ".defeated");

    for (var i = 0; i < combatantlist_length; i++) {
      deafeatedCombatant = combatantlist[i].dataset.combatantId;
    }
  }
}
