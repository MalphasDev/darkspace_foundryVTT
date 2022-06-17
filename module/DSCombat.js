import * as DSMechanics from "./DSMechanics.js";
import * as DSCombatant from "./DSCombatant.js";
export default class DSCombat extends Combat {
  _sortCombatants(a, b) {
    let aeA = parseInt(a.initiative) || 99999;
    let aeB = parseInt(b.initiative) || 99999;
    if (parseInt(a.initiative) === null) {
      aeA = 99999;
    }
    if (parseInt(b.initiative) === null) {
      aeB = 99999;
    }
    var isCombatStarted = a.parent.getFlag("darkspace", "isCombatStarted")
      ? 1
      : -1; //holt sich vom parent (=combat) die info ob er begonnen hat, wird in startCombat gesetzt.

    return (aeA - aeB) * isCombatStarted;
  }

  async startCombat() {
    console.log("STARTE KAMPF");
    //await this.setupTurns();
    // Offene Inititaiven Würfeln

    const ids = Array.from(this.data.combatants.values())
      .filter((c) => {
        return c.data.initiative === undefined;
      })
      .map((c) => {
        return c.data._id;
      });

    console.log("Laut setupTurns() vorhandende Combatants:");
    console.log(this.setupTurns());
    console.log("Zu übergebende IDs: " + ids);
    this.rollInitiative(ids);

    await this.setFlag("darkspace", "isCombatStarted", true);

    console.log("Starte Zählschleife für Start-AE");
    this.setupTurns().forEach((combatant, index, combatantList) => {
      this.setInitiative(combatant.id, index + 1);
    });

    this.sendAE = 0;

    return this.update({ turn: 0, round: 1 }, { diff: false });
  }

  async rollInitiative(ids, options) {
    console.log("Rolle Inititaive!");
    console.log("Erhaltene IDs: " + ids);
    const actorData = this.data.combatants;
    const Combatant = this.combatant;

    let preSortetCombatants = this.setupTurns().filter((c) => {
      return c.data.initiative != undefined;
    });
    var isCombatStarted = this.getFlag("darkspace", "isCombatStarted")
      ? true
      : false;

    console.log("Läuft der Kampf schon? " + isCombatStarted);
    if (isCombatStarted) {
      console.log("Kampf läuft.");
      if (preSortetCombatants.length != 0) {
        ids.forEach((id) => {
          this.setInitiative(
            id,
            preSortetCombatants[preSortetCombatants.length - 1].data
              .initiative + 1
          );
          console.log("Fall A1");
        });
      } else {
        ids.forEach((id) => {
          this.setInitiative(id, 1);
          console.log("Fall A2");
        });
      }
    } else {
      console.log("Kampf läuft nocht nicht.");
      console.log("id-Liste: " + ids);
      ids.forEach(async (id, index) => {
        console.log("Schleifendurchlauf #" + index);
        var currentCombatant = Array.from(
          actorData.filter((d) => {
            return d.data._id == id;
          })
        )[0];

        var actorByCombatantId = currentCombatant.actor.data;
        console.log("inputData fürs würfeln zusammenstellen");
        let inputData = {
          eventData: {},
          actorId: currentCombatant.id,
          actorData: actorData,
          removehighest: false,
          object: {},
          dynattr: actorByCombatantId.data.initiative,
          dynskill: 0,
          roleData: { attribute: "Initiative", skill: "Initiative" },
        };

        let outputData = await DSMechanics.rollDice(inputData).then(
          (result) => {
            return result;
          }
        );

        this.setInitiative(id, outputData.cardData._total);

        console.log(
          "Inititaive fertig gewürfelt: " + outputData.cardData._total
        );
        console.log("Fall B");

        // Chatausgabe

        // let cardData = outputData.cardData;
        // let messageData = outputData.messageData;
        // messageData.content = await renderTemplate(
        //   "systems/darkspace/templates/dice/chatInitiative.html",
        //   cardData
        // );
        // AudioHelper.play({ src: CONFIG.sounds.dice });
        // return ChatMessage.create(messageData);
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

    await Combatant.update({
      id: id,
      initiative: ae,
    });
    return this.update({ turn: 0 }, { diff: false });
  }

  _waitCombat(id) {
    const Combatant = this.combatant;
    return Combatant.update({
      id: id,
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
