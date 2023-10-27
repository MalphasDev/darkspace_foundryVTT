import { getStat } from "../DSMechanics.js";
import { getHealth, getMonitor } from "../DSHealth.js";

export class DSCharacter extends Actor {
  getStat(skill) {
    // Kann rausgenommen werden, wenn alle Spiele einmal aktiv waren.

    let dbAttr;

    if (this.system.stats === undefined || this.system.stats === null) {
      dbAttr = {};
    } else {
      dbAttr = this.system.stats;
    }
    return getStat(skill, dbAttr);
  }

  getObjLocation() {
    const system = this.system;
    const dicepool = system.stats;
    const config = CONFIG.darkspace;

    return { system, dicepool, config };
  }

  // +++++++++++++++++++++++++++++++++++++++++++++
  // +++++++++++ Allgemeine Actor Data +++++++++++
  // +++++++++++++++++++++++++++++++++++++++++++++

  prepareData() {
    super.prepareData();
    const items = this.items;
    const { system, dicepool, config } = this.getObjLocation();
    console.log(this.name + " (" + this.type + ") geladen.");

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.

    items.gunList = this.items.filter((f) => {
      return f.type === "Schusswaffe";
    });
    items.meleeList = this.items.filter((f) => {
      return f.type === "Nahkampfwaffe";
    });
    items.weapon = this.items.filter((f) => {
      return f.type === "Waffe";
    });
    items.eigenschaft = this.items.filter((f) => {
      return f.type === "Eigenschaft";
    });
    items.armorList = this.items.filter((i) => {
      return i.type === "Panzerung";
    });
    items.artList = this.items.filter((i) => {
      return i.type === "Artifizierung";
    });
    items.terminalList = this.items.filter((i) => {
      return i.type === "Terminals";
    });

    let itemSizeArray = items.map((item) => {
      return item.system.size;
    });
    let correctSize = [];
    itemSizeArray.forEach((i) => {
      if (i === undefined) {
      } else {
        correctSize.push(i);
      }
    });
    itemSizeArray = correctSize.sort((a, b) => {
      return a - b;
    });
    const sizeMap = new Map([
      [1, 0.0625],
      [2, 0.125],
      [3, 0.25],
      [4, 0.5],
      [5, 1],
    ]);
    itemSizeArray = itemSizeArray.map((size) => sizeMap.get(size) || size);

    if (itemSizeArray.length > 0) {
      system.carriage = Math.ceil(
        itemSizeArray.reduce((a, b) => {
          return a + b;
        }) * 100,
        2
      );
    }

    const sortedArmorStructureList = items.armorList
      .filter((a) => {
        return a.system.equipped === true;
      })
      .map((s) => {
        return s.system.structure;
      })
      .sort((a, b) => b - a);

    system.armorBonus = sortedArmorStructureList[0];
    isNaN(system.armorBonus) ? (system.armorBonus = 0) : system.armorBonus;

    // +++++++++++++
    // ++++ PAN ++++
    // +++++++++++++

    let highestMk = this.items
      .map((item) => {
        return item.system.mk;
      })
      .sort((a, b) => b - a)[0];
    if (highestMk === undefined) {
      highestMk = 0;
    }
    system.pan = highestMk;

    // Buffer?

    system.countCortexConditions = Object.values(
      system.cortexConditions
    ).reduce((count, currentValue) => {
      if (currentValue === true) {
        return count + 1;
      } else {
        return count;
      }
    }, 0);

    // ++++++++++++++++++++++++++++++++++++++++
    // ++++ Fallunterscheidung Actor Types ++++
    // ++++++++++++++++++++++++++++++++++++++++
    
    const actorTypeObj = {
      Charakter: {
        effectiveCompetence: Math.min(
          system.baseDicepool,
          system.stress.max - system.stress.value
        ),
        baseBuffer:
          this.getStat("Synthese").dicepool + this.getStat("Synthese").skill,
        cortexThreshold: [
          this.getStat("Synthese").skill,
          this.getStat("Synthese").dicepool,
        ],
        bodymon: getMonitor(config.label.body, this.getStat("Fitness").dicepool, system.size, system.armorBonus),

      },
      Cyborg: {
        effectiveCompetence: Math.min(
          system.baseDicepool,
          system.stress.max - system.stress.value
        ),
        baseBuffer:
          this.getStat("Synthese").dicepool + this.getStat("Synthese").skill,
        cortexThreshold: [
          this.getStat("Synthese").skill,
          this.getStat("Synthese").dicepool,
        ],
        bodymon: getMonitor(
          config.label.tech,
          system.size,
          system.size,
          system.armorBonus
        ),
      },
      Nebencharakter: {
        effectiveCompetence: system.baseDicepool,
        baseBuffer: system.baseDicepool * 2,
        cortexThreshold: [system.baseDicepool, system.baseDicepool],
        bodymon: getMonitor(
          config.label.body,
          system.baseDicepool,
          system.size,
          system.armorBonus
        )
      },


      Maschine: {
        effectiveCompetence: system.baseDicepool,
        baseBuffer: system.mk + system.size,
        cortexThreshold: [system.size, system.mk],
        bodymon: getMonitor(
          config.label.tech,
          system.size,
          system.size,
          system.armorBonus
        )
      },

      KI: {
        effectiveCompetence: Math.min(
          system.baseDicepool,
          system.stress.max - system.stress.value
        ),
        baseBuffer: system.mk * 2,
        cortexThreshold: [system.size, system.mk],
      },
    };

    const actorType = actorTypeObj[this.type];

    system.effectiveCompetence = actorType.effectiveCompetence;
    system.baseBuffer = actorType.baseBuffer;
    const currentAttrList = config.statLists[this.type]?.dicepoolList;
    const cortexThreshold = actorType.cortexThreshold;
    system.bodymon = actorType.bodymon

    if(this.type != "Nebencharakter" && this.type != "Maschine") {
      system.wealth = (system.baseDicepool + system.stats.Ressourcen.dicepool) * 2

      system.upkeepTotal = 0;
      for (let [k, v] of Object.entries(system.upkeep)) {
        system.upkeepTotal = v + system.upkeepTotal;
      }
    }

console.log(system);

    system.firewall = 10 + system.baseBuffer;
    system.buffer = system.baseBuffer + 5 * system.countCortexConditions;

    // +++++++++++++++++++++++++
    // ++++ Attribut Maxima ++++
    // +++++++++++++++++++++++++

    if (currentAttrList != undefined) {
      currentAttrList.forEach((element) => {
        if (dicepool[element].dicepoolmaxmod === undefined) {
          dicepool[element].dicepoolmaxmod = 0;
        }

        const prostetics = items.artList.filter((a) => {
          return a.system.prosthetic === true;
        })[0];

        if (prostetics != undefined && prostetics.system.useAttr === dicepool) {
          dicepool[element].dicepoolmax =
            dicepool[element].dicepoolmaxmod + prostetics.system.dicepoolMaxBonus;
        } else {
          dicepool[element].dicepoolmax = 5 + dicepool[element].dicepoolmaxmod;
        }
      });
    }

    // ++++++++++++++++++++++++++++
    // ++++++++ Initiative ++++++++
    // ++++++++++++++++++++++++++++

    system.initiative = system.effectiveCompetence;

    // ++++++++++++++++++++++++
    // ++++ Cortex-Monitor ++++
    // ++++++++++++++++++++++++

    system.armorCortex = "Synthese";

    const sortedCortexArmorList = items.terminalList
      .filter((a) => {
        return a.system.equipped === true;
      })
      .map((s) => {
        return s.system.structure;
      })
      .sort((a, b) => b - a);

    system.cortexArmorBonus =
      sortedCortexArmorList[0] + sortedCortexArmorList.length - 1;

    if (sortedCortexArmorList.length > 0) {
    }

    isNaN(system.cortexArmorBonus)
      ? (system.cortexArmorBonus = 0)
      : system.cortexArmorBonus;

    system.cortexmon = getMonitor(
      config.label.cortex,
      cortexThreshold[1],
      cortexThreshold[0],
      system.cortexArmorBonus + system.pan
    );

    // ++++++++++++++++++++++++++++++
    // ++++ Inventar Korrigieren ++++
    // ++++++++++++++++++++++++++++++

    // ++++ Prüfen, ob Fertigkeit vorhanden wenn Items angelegt werden ++++
    items.forEach((item) => {
      // Nebencharaktere haben keine Fertigkeiten, sondern würfeln alles mit Kompetenz
      if (this.type === "Nebencharakter") {
        item.update({
          "system.useWith": null,
        });
        return;
      }

      // Cyborgs haben keine Körperkontrolle und verwenden stattdessen Manövrieren
      if (this.type === "Cyborg") {
        if (item.type === "Schusswaffe") {
          item.system.useWith = "Manövrieren";
        }
        if (item.type === "Panzerung") {
          item.system.useWith = "Kraft";
        }
      }

      // Falls nichts gefunden wird, wird Logik als useWith eingesetzt.
      // Sollte man eventuell auch nochmal überdenken. Fenster mit Fertigkeit auswählen evtl?
      if (
        item.system.useWith !=
        getStat(item.system.useWith, system.stats).skillName
      ) {
        item.update({
          "system.useWith": "Logik",
        });
        ui.notifications.warn(
          `Fertigkeit ${item.system.useWith} im ${this.name} nicht gefunden. Ersetzt durch: Logik`
        );
      }
    });
  }

  expCounter() {
    const { system, dicepool, config } = this.getObjLocation();

    let dicepoolList = config.statLists[this.type].dicepoolList;
    let skillList = config.statLists[this.type].skillList;
    system.totalAttrXp = 0;
    system.totalSkillXp = 0;
    system.totalPropXp = 0;

    switch (this.type) {
      case "Charakter":
        system.startEp = game.settings.get("darkspace", "startxp");
        break;
      case "Cyborg":
        system.startEp = game.settings.get("darkspace", "startxp");
        break;
      case "Nebencharakter":
        break;
      case "Maschine":
        system.startEp = (system.mk + system.size) * 100;
        break;
      case "KI":
        system.startEp = game.settings.get("darkspace", "startxpai");
        break;
    }

    /* EP-Multiplikatoren für Testzwecke */

    const compMod = 50;
    const dicepoolMod = 20;
    const skillMod = 5;

    dicepoolList.forEach((dicepoolIdent) => {
      let dicepoolName = dicepool;
      let dicepoolWert = dicepoolName[dicepoolIdent].dicepool;
      let dicepoolEp =
        ((dicepoolWert * (dicepoolWert + 1) * (2 * dicepoolWert + 1)) / 6) * dicepoolMod;
      system.totalAttrXp += dicepoolEp;
      system.compXp =
        ((system.baseDicepool *
          (system.baseDicepool + 1) *
          (2 * system.baseDicepool + 1)) /
          6) *
          compMod -
        5 * compMod;

      let skillSet = dicepoolName[dicepoolIdent].skill;

      skillList.forEach((skillIdent) => {
        if (skillSet[skillIdent] !== undefined) {
          let skillWert = skillSet[skillIdent];
          let skillEp =
            ((skillWert * (skillWert + 1) * (2 * skillWert + 1)) / 6) *
            skillMod;
          system.totalSkillXp += skillEp;
        }
      });
    });

    if (system.xp === undefined) {
      system.xp = { value: 0, max: 0 };
    }

    const count = Object.values(system.props).reduce(
      (acc, curr) => (curr.handicap ? acc + 1 : acc),
      0
    );

    system.totalPropXp =
      (Object.entries(system.props).length - count * 2) * 100;

    system.totalXp =
      system.totalAttrXp +
      system.totalSkillXp +
      system.compXp +
      system.totalPropXp -
      system.startEp;

    system.xpAvailable = system.xp.max - system.totalXp;
  }
  async _preCreate(createData, options, user) {
    await super._preCreate(createData, options, user);

    let actorType = createData.type;

    const updateData = {};
    updateData["img"] =
      "systems/darkspace/icons/actorDefault/actorIcon_" + actorType + ".svg";
    await this.updateSource(updateData);
  }
}
