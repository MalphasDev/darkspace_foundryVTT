import * as DSMechanics from "./DSMechanics.js";
import * as DSCombatant from "./DSCombatant.js";
export default class DSCombat extends Combat {
  _sortCombatants(a, b) {
    let aeA = parseInt(a.initiative) || 99999;
    let aeB = parseInt(b.initiative) || 99999;

    // Combatants ohne Initiative nach hinten sortieren.
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
    const ids = Array.from(this.data.combatants.values())
      .filter((c) => {
        return c.data.initiative === undefined;
      })
      .map((c) => {
        return c.data._id;
      });

    if (ids.length === 0) {
      this.setupTurns().forEach((combatant, index, combatantList) => {
        this.setInitiative(combatant.id, index + 1);
      });
      this.sendAE = 0;
      await this.setFlag("darkspace", "isCombatStarted", true);
      await this.setupTurns();

      return this.update(
        { turn: 0, round: 1 },
        { diff: false },
        { started: true }
      );
    } else {
      this.rollAll();
      ui.notifications.warn("Offene Initiativen wurden automatisch gewürfelt.");
    }
  }

  async rollInitiative(ids) {
    const actorData = this.data.combatants;
    const Combatant = this.combatant;

    let preSortetCombatants = this.setupTurns().filter((c) => {
      return c.data.initiative != undefined;
    });
    var isCombatStarted = this.getFlag("darkspace", "isCombatStarted")
      ? true
      : false;

    if (isCombatStarted) {
      if (preSortetCombatants.length != 0) {
        ids.forEach((id) => {
          this.setInitiative(
            id,
            preSortetCombatants[preSortetCombatants.length - 1].data
              .initiative + 1
          );
        });
      } else {
        ids.forEach((id) => {
          this.setInitiative(id, 1);
        });
      }
    } else {
      ids.forEach(async (id, index) => {
        var currentCombatant = Array.from(
          actorData.filter((d) => {
            return d.data._id == id;
          })
        )[0];

        let iniId;
        if (currentCombatant.actor.data.type === "Charakter") {
          iniId = "Fokus";
        }
        if (currentCombatant.actor.data.type === "Nebencharakter") {
          iniId = "Intellekt";
        }
        if (currentCombatant.actor.data.type === "DrohneFahrzeug") {
          iniId = "Cortex";
        }
        if (currentCombatant.actor.data.type === "KI") {
          iniId = "Fokus";
        }

        let inputData = {
          eventData: {},
          actorId: currentCombatant.id,
          actorData: actorData,
          removehighest: false,
          object: {},
          dynattr: DSMechanics.getStat(
            iniId,
            currentCombatant.actor.data.data.charattribut
          ).attr,
          dynskill: DSMechanics.getStat(
            iniId,
            currentCombatant.actor.data.data.charattribut
          ).fert,
          roleData: { attribute: "Aufmerksamkeit", skill: "Fokus" },
        };

        let outputData = await DSMechanics.rollDice(inputData).then(
          (result) => {
            return result;
          }
        );

        this.setInitiative(id, outputData.cardData.total_AB);

        // Chatausgabe

        // let cardData = outputData.cardData;
        // let messageData = outputData.messageData;
        // messageData.content = await renderTemplate(
        //   "systems/darkspace/templates/dice/chatInitiative.html",
        //   cardData
        // );
        AudioHelper.play({ src: CONFIG.sounds.dice });
        // return ChatMessage.create(messageData);
      });
    }

    return this;
  }

  _waitCombat(id) {
    this.setInitiative(id, null);
  }
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);

    this.setupTurns(); // Damit die Reiehnfolge beim Start bei GM und Spielern gleich bleibt

    // Es wird bei jedem Combat-Update ein Test gemacht, ob turn = 0. Wenn nein, wird der turn auf 0 gesetzt = erster Charakter
    if (this.turn !== 0) return this.update({ turn: 0 }, { diff: false });
  }
}
