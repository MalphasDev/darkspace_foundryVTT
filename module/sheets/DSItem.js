import { getStat } from "../DSMechanics.js";
import { getHealth, getMonitor } from "../DSHealth.js";

export class DSItem extends Item {
  getObjLocation() {
    const itemData = this;
    const system = this.system;
    const config = CONFIG.darkspace;

    return { itemData, system, config };
  }

  prepareData() {
    super.prepareData();

    const { itemData, system, config } = this.getObjLocation();

    const itemTypeObj = {
      Schusswaffe: {
        aeCost: system.size,
        range:
          Math.pow(system.size, 2) +
          "-" +
          Math.pow(system.size, 2) * 5 +
          "/" +
          Math.pow(system.size, 2) * 10,
      },
      Nahkampfwaffe: {
        aeCost: system.size,
      },
      Panzerung: {
        aeCost: system.size,
      },
      Werkzeug: {
        aeCost: system.mk,
      },
      Terminals: {
        aeCost: "MK des Ziels",
        range: Math.pow(system.mk * 2, 2) * 10,
      },
      Medkit: {
        aeCost: system.mk,
      },
      Artifizierung: {
        aeCost: system.mk,
      },
      Gegenstand: {
        aeCost: "MK oder Größe",
      },
    };

    const actorType = itemTypeObj[this.type];
    system.aeCost = actorType.aeCost;
    system.range = actorType.range;
    system.dmg = system.size * 2 + system.mk;
    system.structure = parseInt(system.size) + parseInt(system.mk);

    // Zustände

    const primaryCortex = system.mk;
    const condName = game.i18n.translations.darkspace;
    const cortexLabel = config.label.cortex;
    system.cortexmon = getMonitor(cortexLabel, primaryCortex, system.size, 0);

    const techLabel = config.label.tech;

    system.bodymon = getMonitor(techLabel, system.size, system.size, 0);

    system.firewall = system.mk * 2 + 10;

    system.countCortexConditions = Object.values(
      system.cortexConditions
    ).reduce((count, currentValue) => {
      if (currentValue === true) {
        return count + 1;
      } else {
        return count;
      }
    }, 0);
    system.buffer = system.mk + system.size + 5 * system.countCortexConditions;

    system.hitArrayCortex = getHealth(system.mk, system.size);
    system.hitArray = getHealth(system.size, system.size);

    if (this.type != "Drohne") {
      const itemRess = system.ress;
      itemRess.bots = {
        value: system.ress.bots.value,
        max: system.mk - Object.entries(system.props).length,
        remain:
          system.mk -
          Object.entries(system.props).length -
          system.ress.bots.value,
      };
    }
    const unsortedSkillList = []
      .concat(
        config.statLists.Charakter.skillList,
        config.statLists.Cyborg.skillList,
        config.statLists.KI.skillList,
        config.statLists.Maschine.skillList
      )
      .sort();
    system.allSkills = new Set(unsortedSkillList);

    system.droneList = game.actors.filter((drone) => {
      return drone.type === "Maschine";
    })
    system.droneData = game.actors.get(system.droneId)
  }

  async _preCreate(createData, options, user) {
    await super._preCreate(createData, options, user);

    let itemType = createData.type;

    // add token default settings
    const updateData = {};
    updateData["img"] =
      "systems/darkspace/icons/itemDefault/itemIcon_" + itemType + ".svg";
    await this.updateSource(updateData);
  }
}
