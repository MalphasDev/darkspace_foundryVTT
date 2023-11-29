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

    const rangeMultplier = [1,20,50]

    const itemTypeObj = {
      Schusswaffe: {
        aeCost: Math.ceil(system.size/2),
        range:
          Math.pow(system.size, 2) * rangeMultplier[0] +
          "-" +
          Math.pow(system.size, 2) * rangeMultplier[1] +
          "/" +
          Math.pow(system.size, 2) * rangeMultplier[2],
      },
      Nahkampfwaffe: {
        aeCost: Math.ceil(system.size/2),
        range: "Nahkampf"
      },
      Panzerung: {
        aeCost: Math.ceil(system.size/2),
      },
      Werkzeug: {
        aeCost: Math.ceil(system.mk/2),
      },
      Terminals: {
        aeCost: "MK/2 des Ziels",
        range: Math.pow(system.mk * 2, 2) * 10,
      },
      Medkit: {
        aeCost: Math.ceil(system.mk/2),
      },
      Artifizierung: {
        aeCost: Math.ceil(system.mk/2),
      },
      Gegenstand: {
        aeCost: "MK oder Größe",
      },
    };

    const itemType = itemTypeObj[this.type];
    system.aeCost = itemType.aeCost;
    system.range = itemType.range;
    system.dmg = system.size * 2 + system.mk;
    system.structure = parseInt(system.size) + parseInt(system.mk);

    // Zustände

    const primaryCortex = system.mk;
    const condName = game.i18n.translations.darkspace;
    const cortexLabel = config.label.cortex;
    system.cortexmon = getMonitor(cortexLabel, primaryCortex, system.size, 0);

    const techLabel = config.label.tech;

    system.bodymon = getMonitor(techLabel, system.size, system.size, 0);

    system.firewall = 10 + system.mk + system.size;

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
