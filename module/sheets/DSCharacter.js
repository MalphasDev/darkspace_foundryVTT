//import { darkspace } from "../config";
import { getStat } from "../DSMechanics.js";
import { getHealth, getMonitor } from "../DSHealth.js";

export class DSCharacter extends Actor {
  getStat(fert) {
    // Kann rausgenommen werden, wenn alle Spiele einmal aktiv waren.
    if (this.type === "DrohneFahrzeug") {
      this.update({
        type: "Maschine",
      });
    }

    let dbAttr;

    if (this.system.stats === undefined || this.system.stats === null) {
      dbAttr = {};
    } else {
      dbAttr = this.system.stats;
    }
    return getStat(fert, dbAttr);
  }

  getObjLocation() {
    const actorData = this;
    const system = this.system;
    const attr = system.stats;
    const ress = system.ressources;
    const config = CONFIG.darkspace;

    return { actorData, system, attr, ress, config };
  }

  charakterData(actorData, system, attr, ress, config) {
    const primaryHit = this.getStat("Fitness").attr; // Konsti
    const condName = game.i18n.translations.darkspace;
    const label = config.bodyConditionLabel;
    system.bodymon = getMonitor(
      label,
      primaryHit,
      system.size,
      condName,
      system.armorBonus
    );

    system.upkeepTotal = 0;
    for (let [k, v] of Object.entries(system.upkeep)) {
      system.upkeepTotal = v + system.upkeepTotal;
    }
    system.wealth = system.stats.Ressourcen.attribut * 2;
    this.expCounter();
    system.competence = Math.floor(
      Math.sqrt(
        (system.totalAttrXp + system.totalSkillXp + system.totalPropXp) / 100
      )
    );

    return { actorData, system, attr, ress, config };
  }
  npcData(actorData, system, attr, ress, config) {
    const primaryHit = this.getStat("Fitness").attr; // Konsti
    const condName = game.i18n.translations.darkspace;
    const label = config.bodyConditionLabel;
    system.bodymon = getMonitor(
      label,
      primaryHit,
      system.size,
      condName,
      system.armorBonus
    );

    return { actorData, system, attr, ress, config };
  }
  droneData(actorData, system, attr, ress, config) {
    system.structure = system.mk + system.size;
    system.firewall = 10 + system.structure;

    const props = actorData.items.filter((f) => {
      return f.type === "Eigenschaft";
    });

    // ++++++++++++++++++++++++++++++++++
    // ++++ Zustandsmonitor Maschine ++++
    // ++++++++++++++++++++++++++++++++++

    config.attrVehicle.forEach((attribute) => {
      system.stats[attribute].attrmax = system.structure - props.length;
    });

    const condName = game.i18n.translations.darkspace;
    const label = config.techConditionLabel;

    system.bodymon = getMonitor(
      label,
      system.size,
      system.size,
      condName,
      system.armorBonus
    );

    return { actorData, system, attr, ress, config };
  }

  aiData(actorData, system, attr, ress, config) {
    system.firewall = 10 + 2 * system.mk;
    const props = actorData.items.filter((f) => {
      return f.type === "Eigenschaft";
    });

    config.attrAi.forEach((attribute) => {
      system.stats[attribute].attrmax = system.mk * 2 - props.length;
    });

    // if (prostetics != undefined) {
    //   system.stats[prostetics.system.useAttr].attrmax =
    //     prostetics.system.attrMaxBonus;
    // }

    return { actorData, system, attr, ress, config };
  }

  // +++++++++++++++++++++++++++++++++++++++++++++
  // +++++++++++ Allgemeine Actor Data +++++++++++
  // +++++++++++++++++++++++++++++++++++++++++++++

  prepareData() {
    super.prepareData();
    const items = this.items;
    const { actorData, system, attr, ress, config } = this.getObjLocation();

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.

    items.gunList = actorData.items.filter((f) => {
      return f.type === "Schusswaffe";
    });
    items.meleeList = actorData.items.filter((f) => {
      return f.type === "Nahkampfwaffe";
    });
    items.weapon = actorData.items.filter((f) => {
      return f.type === "Waffe";
    });
    items.eigenschaft = actorData.items.filter((f) => {
      return f.type === "Eigenschaft";
    });
    items.armorList = actorData.items.filter((i) => {
      return i.type === "Panzerung";
    });
    items.artList = actorData.items.filter((i) => {
      return i.type === "Artifizierung";
    });
    items.terminalList = actorData.items.filter((i) => {
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
    itemSizeArray.forEach((size, i) => {
      switch (size) {
        case 1:
          itemSizeArray[i] = 0.0625;
          break;
        case 2:
          itemSizeArray[i] = 0.125;
          break;
        case 3:
          itemSizeArray[i] = 0.25;
          break;
        case 4:
          itemSizeArray[i] = 0.5;
          break;
        case 5:
          itemSizeArray[i] = 1;
          break;
        default:
          break;
      }
    });
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

    let currentAttrList;
    switch (this.type) {
      case "Charakter":
        this.charakterData(actorData, system, attr, ress, config);
        currentAttrList = config.attrList;
        break;
      case "Nebencharakter":
        this.npcData(actorData, system, attr, ress, config);
        currentAttrList = config.attrNpc;
        break;
      case "Maschine":
        this.droneData(actorData, system, attr, ress, config);
        currentAttrList = config.attrVehicle;
        break;
      case "KI":
        this.aiData(actorData, system, attr, ress, config);
        currentAttrList = config.attrAi;
        break;
      default:
        break;
    }

    // +++++++++++++++++++++++++
    // ++++ Attribut Maxima ++++
    // +++++++++++++++++++++++++

    if (currentAttrList != undefined) {
      currentAttrList.forEach((attribut) => {
        if (attr[attribut].attrmaxmod === undefined) {
          attr[attribut].attrmaxmod = 0;
        }

        const prostetics = items.artList.filter((a) => {
          return a.system.prosthetic === true;
        })[0];

        if (prostetics != undefined && prostetics.system.useAttr === attribut) {
          attr[attribut].attrmax =
            attr[attribut].attrmaxmod + prostetics.system.attrMaxBonus;
        } else {
          attr[attribut].attrmax = 5 + attr[attribut].attrmaxmod;
        }
      });
    }

    // ++++++++++++++++++++++++
    // ++++ Cortex-Monitor ++++
    // ++++++++++++++++++++++++

    system.armorCortex = "Synthese";
    system.firewall = 10 + this.getStat("Synthese").attr + this.getStat("Synthese").fert

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

    isNaN(system.cortexArmorBonus)
      ? (system.cortexArmorBonus = 0)
      : system.cortexArmorBonus;

    const primaryHit = this.getStat(system.armorCortex).attr;
    const condName = game.i18n.translations.darkspace;
    const label = config.cortexConditionLabel;
    system.cortexmon = getMonitor(
      label,
      primaryHit,
      system.size,
      condName,
      system.cortexArmorBonus
    );


    // ++++++++++++++++++++++++++++++
    // ++++ Verbotene Handlungen ++++
    // ++++++++++++++++++++++++++++++

    if (this.type != "KI") {
      system.forbiddenActions = Object.entries(system.bodyConditions)
        .filter(([condition, isActive]) => isActive)
        .flatMap(([condition, isActive]) => system.bodymon[condition].forbidden)
        .reduce(
          (unique, item) =>
            unique.includes(item) ? unique : [...unique, item],
          []
        );
    }

    // ++++ Prüfen, ob Fertigkeit vorhanden ++++

    items.forEach((item) => {
      // console.log(useWith,getStat(useWith,system.stats).fertName);
      if (
        item.system.useWith !=
        getStat(item.system.useWith, system.stats).fertName
      ) {
        item.update({
          "system.useWith": "Logik",
        });
        ui.notifications.warn(
          `Fertigkeit ${item.system.useWith} im ${this.name} nicht gefunden. Ersetzt durch: Logik`
        );
      }
    });

    this.expCounter();
  }

  expCounter() {
    const { actorData, system, attr, ress, config } = this.getObjLocation();

    let attrList = [];
    let skillList = [];
    system.totalAttrXp = 0;
    system.totalSkillXp = 0;
    system.totalPropXp = 0;

    switch (actorData.type) {
      case "Charakter":
        attrList = config.attrList;
        skillList = config.skillList;
        system.startEp = game.settings.get("darkspace", "startxp");
        break;
      case "Nebencharakter":
        attrList = config.attrNpc;
        skillList = config.skillListNpc;
        system.startEp = Math.pow(system.competence, 2) * 50 + 300;
        break;
      case "Maschine":
        attrList = config.attrVehicle;
        skillList = config.skillListVehicle;
        system.startEp = (system.mk + system.size) * 100;
        break;
      case "KI":
        attrList = config.attrAi;
        skillList = config.skillListAi;
        system.startEp = game.settings.get("darkspace", "startxpai");
        break;
    }

    attrList.forEach((attrIdent) => {
      let attributName = attr;
      let attrWert = attributName[attrIdent].attribut;
      let attrEp =
        ((attrWert * (attrWert + 1) * (2 * attrWert + 1)) / 6) * 5 - 5;
      system.totalAttrXp += attrEp;

      let skillSet = attributName[attrIdent].skill;

      skillList.forEach((skillIdent) => {
        if (skillSet[skillIdent] !== undefined) {
          let skillWert = skillSet[skillIdent];
          let skillEp =
            ((skillWert * (skillWert + 1) * (2 * skillWert + 1)) / 6) * 4;
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
