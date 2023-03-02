//import { darkspace } from "../config";
import * as DSMechanics from "../DSMechanics.js";
import * as DSHealth from "../DSHealth.js";

export class DSCharacter extends Actor {
  getStat(fert) {
    let dbAttr;

    if (
      this.system.charattribut === undefined ||
      this.system.charattribut === null
    ) {
      dbAttr = {};
    } else {
      dbAttr = this.system.charattribut;
    }
    return DSMechanics.getStat(fert, dbAttr);
  }

  getObjLocation() {
    const actorData = this;
    const system = this.system;
    const attr = system.charattribut;
    const config = CONFIG.darkspace;

    return { actorData, system, attr, config };
  }

  charakterData(actorData, system, attr, config) {
    system.armorId = "Fitness";

    system.upkeepTotal = 0;
    for (let [k, v] of Object.entries(system.upkeep)) {
      system.upkeepTotal = v + system.upkeepTotal;
    }
    system.wealth = system.charattribut.Ressourcen.attribut * 2;
    this.expCounter();
    system.competence = Math.floor(
      Math.sqrt(
        (system.totalAttrXp + system.totalSkillXp + system.totalPropXp) / 100
      )
    );

    return { actorData, system, attr, config };
  }
  npcData(actorData, system, attr, config) {
    system.armorId = "Kraft";
    system.initiative =
      this.getStat("Beweglichkeit").attr +
      "d10x10kh2+" +
      this.getStat("Beweglichkeit").fert;
    return { actorData, system, attr, config };
  }
  droneData(actorData, system, attr, config) {
    system.initiative =
      this.getStat("Analyse").attr +
      "d10x10kh2+" +
      this.getStat("Analyse").fert;

    // Passagiere und Fracht

    return { actorData, system, attr, config };
  }

  aiData(actorData, system, attr, config) {
    system.initiative =
      this.getStat("Fokus").attr + "d10x10kh2+" + this.getStat("Fokus").fert;

    return { actorData, system, attr, config };
  }

  prepareData() {
    super.prepareData();
    const items = this.items;
    const { actorData, system, attr, config } = this.getObjLocation();

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.

    // //Eigenschaften
    var propertyList = actorData.items.filter((e) => {
      return e.type === "Eigenschaft";
    });

    // Ressourcen
    let attributNames = Object.keys(attr);
    for (var i = 0; attributNames.length > i; i++) {
      if (attr[attributNames[i]].ress != undefined) {
        attr[attributNames[i]].ress.remaining =
          attr[attributNames[i]].ress.max - attr[attributNames[i]].ress.value;
      }
    }

    items.gunList = actorData.items.filter((f) => {
      return f.type === "Schusswaffe";
    });
    items.meleeList = actorData.items.filter((f) => {
      return f.type === "Nahkampfwaffe";
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

    const sortedArmorStructureList = items.armorList
      .filter((a) => {
        return a.system.equipped === true;
      })
      .map((s) => {
        return s.system.structure;
      })
      .sort((a, b) => b - a);
    const sortedCortexArmorList = items.terminalList
      .filter((a) => {
        return a.system.equipped === true;
      })
      .map((s) => {
        return s.system.mk;
      })
      .sort((a, b) => b - a);

    system.armorBonus = sortedArmorStructureList[0];
    isNaN(system.armorBonus) ? (system.armorBonus = 0) : system.armorBonus;

    system.cortexArmorBonus =
      sortedCortexArmorList[0] + sortedCortexArmorList.length - 1;
    isNaN(system.cortexArmorBonus)
      ? (system.cortexArmorBonus = 0)
      : system.cortexArmorBonus;

    this.type === "Charakter"
      ? this.charakterData(actorData, system, attr, config)
      : null;
    this.type === "Nebencharakter"
      ? this.npcData(actorData, system, attr, config)
      : null;
    this.type === "DrohneFahrzeug"
      ? this.droneData(actorData, system, attr, config)
      : null;
    this.type === "KI" ? this.aiData(actorData, system, attr, config) : null;

    system.armorCortex = "Synthese";

    // +++++++++++++++++++
    // ++++ Conitions ++++
    // +++++++++++++++++++

    system.bodyConditionLabel = config.bodyConditionLabel;
    system.techConditionLabel = config.techConditionLabel;
    system.cortexConditionLabel = config.cortexConditionLabel;

    const armorAttr = this.getStat(system.armorId).attr; // Konsti
    const armorSkill = system.armorBonus + this.getStat(system.armorId).fert; // Fitness + Rüstung
    const cortexAttr = this.getStat(system.armorCortex).attr; // Kybernese
    const cortexSkill =
      system.cortexArmorBonus + this.getStat(system.armorCortex).fert; // Synthese

    system.hitArray = DSHealth.getHealth(armorAttr, armorSkill);
    system.hitArrayCortex = DSHealth.getHealth(cortexAttr, cortexSkill);
    system.hitArrayTech = DSHealth.getHealth(system.size, system.mk);

    this.expCounter();
  }

  expCounter() {
    const { actorData, system, attr, config } = this.getObjLocation();

    let attrList = [];
    let skillList = [];
    system.totalAttrXp = 0;
    system.totalSkillXp = 0;
    system.totalPropXp = 0;

    if (actorData.type === "Charakter") {
      attrList = config.attrList;
      skillList = config.skillList;
      system.startEp = game.settings.get("darkspace", "startxp");
    } else if (actorData.type === "Nebencharakter") {
      attrList = config.attrNpc;
      skillList = config.skillListNpc;
      system.startEp = Math.pow(system.competence, 2) * 100;
    } else if (actorData.type === "DrohneFahrzeug") {
      attrList = config.attrVehicle;
      skillList = config.skillListVehicle;
      system.startEp = (system.mk + system.size) * 100;
    } else if (actorData.type === "KI") {
      attrList = config.attrAi;
      skillList = config.skillListAi;
      system.startEp = game.settings.get("darkspace", "startxpai");
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

    system.totalPropXp = Object.entries(system.props).length * 100;
    system.totalXp =
      system.totalAttrXp +
      system.totalSkillXp +
      system.totalPropXp -
      system.startEp;
    system.xpAvailable = system.xp.max - system.totalXp;
  }
}
