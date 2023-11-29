import { getStat } from "../DSMechanics.js";
import { getHealth, getMonitor } from "../DSHealth.js";

export class DSCharacter extends Actor {
  getStat(skillName) {

    let result = null;
    if (this.type === "Nebencharakter") {
      result = {
        dicepool: this.system.baseDicepool,
        skillValue: this.system.baseDicepool,
        aptitude: "Kompetenz",
        skillName: "Fähigkeit",
      };
    } else {
      Object.entries(this.system.stats).some(([aptitude, aptSet]) => { 
        // aptitude entspricht Key
        // aptSet entspricht Value
        if (aptSet.skill.hasOwnProperty(skillName)) {
            result = {
                aptitude: aptitude,
                dicepool: this.system.stats[aptitude].dicepool,
                skillValue: aptSet.skill[skillName],
                skillName: skillName,
            };
            return true; // Beende die Schleife, wenn der Skill gefunden wurde
        }
    });
    }
    if (result === null) {
      result = {
        aptitude: "",
        dicepool: 0,
        skillValue: 0,
        skillName: skillName,
    };
    }
    return result
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
    console.log(this.system.stats);

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

    const sortedArmorStructureList = this.itemTypes.Panzerung
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
          this.getStat("Synthese").dicepool * 2 + system.baseDicepool,
        cortexThreshold: [
          system.baseDicepool,
          this.getStat("Synthese").dicepool,
        ],
        bodymon: getMonitor(config.label.body, this.getStat("Fitness").dicepool, system.size, system.armorBonus),
        startXp: game.settings.get("darkspace", "startxp"),
        unarmedDmg: {
          [this.getStat("Kraft").aptitude]: system.baseDicepool + this.getStat("Kraft").dicepool,
          [this.getStat("Präzision").aptitude]: system.baseDicepool + this.getStat("Präzision").dicepool,
        },
        targetValue: 10 + system.baseDicepool * 2,
        mobile: true,
      },
      Cyborg: {
        effectiveCompetence: Math.min(
          system.baseDicepool,
          system.stress.max - system.stress.value
        ),
        baseBuffer:
          this.getStat("Synthese").dicepool * 2 + system.baseDicepool,
        cortexThreshold: [
          system.baseDicepool,
          this.getStat("Synthese").dicepool,
        ],
        bodymon: getMonitor(
          config.label.tech,
          system.size,
          system.size,
          system.armorBonus
        ),
        startXp: game.settings.get("darkspace", "startxp"),
        unarmedDmg: {
          [this.getStat("Kraft").aptitude]: system.baseDicepool + this.getStat("Kraft").dicepool,
          [this.getStat("Präzision").aptitude]: system.baseDicepool + this.getStat("Präzision").dicepool,
        },
        targetValue: 15 + this.getStat("Fokus").dicepool + this.getStat("Geschwindigkeit").dicepool - system.size, 
        mobile: true,
      },
      Nebencharakter: {
        effectiveCompetence: system.baseDicepool,
        baseBuffer: system.baseDicepool * 3,
        cortexThreshold: [system.baseDicepool, system.baseDicepool],
        bodymon: getMonitor(
          config.label.body,
          system.baseDicepool,
          system.size,
          system.armorBonus
        ),
        unarmedDmg: {
          "baseDicepool": system.baseDicepool * 2,
        },
        targetValue: 10 + system.baseDicepool * 2,
        mobile: true,
      },
      Maschine: {
        effectiveCompetence: system.baseDicepool,
        baseBuffer: system.mk * 2 + system.size,
        cortexThreshold: [system.size, system.mk],
        bodymon: getMonitor(
          config.label.tech,
          system.size,
          system.size,
          system.armorBonus
        ),
        startXp: (system.mk + system.size) * 100,
        unarmedDmg: {
          [this.getStat("Kraft").aptitude]: system.baseDicepool + this.getStat("Kraft").dicepool,
          [this.getStat("Präzision").aptitude]: system.baseDicepool + this.getStat("Präzision").dicepool,
        },
        targetValue: 15 + this.getStat("Fokus").dicepool + this.getStat("Geschwindigkeit").dicepool - system.size, 
        mobile: true,
      },
      KI: {
        effectiveCompetence: Math.min(
          system.baseDicepool,
          system.stress.max - system.stress.value
        ),
        baseBuffer: system.mk * 3,
        cortexThreshold: [system.size, system.mk],
      },
      startXp: game.settings.get("darkspace", "startxpai"),
      mobile: false,
    };


    const actorType = actorTypeObj[this.type];
    system.effectiveCompetence = actorType.effectiveCompetence;
    system.baseBuffer = actorType.baseBuffer;
    const currentAttrList = config.statLists[this.type]?.dicepoolList;
    const cortexThreshold = actorType.cortexThreshold;
    system.bodymon = actorType.bodymon
    system.startXp = actorType.startXp
    system.unarmedDmg = actorType.unarmedDmg
    system.targetValue = actorType.targetValue
    actorType.mobile ? system.speed = Math.max(this.getStat("Geschwindigkeit").dicepool * this.getStat("Geschwindigkeit").skillValue * parseInt(system.mk??1),5) : null

    if(this.type != "Nebencharakter" && this.type != "Maschine") {
      system.wealth = (system.baseDicepool + system.stats.Ressourcen.dicepool) * 2

      system.upkeepTotal = 0;
      for (let [k, v] of Object.entries(system.upkeep)) {
        system.upkeepTotal = v + system.upkeepTotal;
      }
    }


    system.firewall = 10 + this.itemTypes.Terminals.map((item) => {return item.system.mk}).concat(system.baseBuffer).sort((a,b) => b - a)[0];
    system.buffer = system.baseBuffer + 5 * system.countCortexConditions;

    // ++++++++++++++++++++++++++++
    // ++++++++ Initiative ++++++++
    // ++++++++++++++++++++++++++++

    system.initiative = system.effectiveCompetence;

    // ++++++++++++++++++++++++
    // ++++ Cortex-Monitor ++++
    // ++++++++++++++++++++++++

    system.armorCortex = "Synthese";

    const sortedCortexArmorList = this.itemTypes.Artifizierung
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
        this.getStat(item.system.useWith).skillName
      ) {
        // item.update({
        //   "system.useWith": "Logik",
        // });
        ui.notifications.warn(
          `Fertigkeit ${item.system.useWith} im ${this.name} nicht gefunden. Ersetzt durch: Logik`
        );
      }
    });

    // ++++ EP für alle Spielbaren Actor-Varianten berrechnen ++++ //

    if (system.playable) {
      this.expCounter()
    }
    
  }

  expCounter() {
    const { system, dicepool, config } = this.getObjLocation();
    const statLists = config.statLists[this.type]

    const dicepoolList = statLists.dicepoolList;
    const skillList = statLists.skillList;
    system.totalAttrXp = 0;
    system.totalSkillXp = 0;
    system.totalPropXp = 0;

    /* EP-Multiplikatoren für Testzwecke */

    const compMod = 50;
    const dicepoolMod = 20;
    const skillMod = 5;

    dicepoolList.forEach((dicepoolIdent) => {
      let aptitude = dicepool;
      let dicepoolWert = aptitude[dicepoolIdent].dicepool;
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

      let skillSet = aptitude[dicepoolIdent].skill;

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
      system.startXp;

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
