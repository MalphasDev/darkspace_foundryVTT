//import { darkspace } from "../config";
import * as DSMechanics from "../DSMechanics.js";

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

    var gunList = actorData.items.filter((f) => {
      return f.type === "Schusswaffe";
    });
    var meleeList = actorData.items.filter((f) => {
      return f.type === "Nahkampfwaffe";
    });
    var armorList = actorData.items.filter((i) => {
      return i.type === "Panzerung";
    });
    var artList = actorData.items.filter((i) => {
      return i.type === "Artifizierung";
    });

    const armorSize = [
      armorList
        .map((e) => {
          return e.system.size;
        })
        .sort((a, b) => {
          return b - a;
        })[0],
      0,
    ].sort((a, b) => {
      return b - a;
    })[0];
    const armorMk = [
      armorList
        .map((e) => {
          return e.system.mk;
        })
        .sort((a, b) => {
          return b - a;
        })[0],
      0,
    ].sort((a, b) => {
      return b - a;
    })[0];

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

    system.bodyConditionLabel = {
      struck: {
        name: "Angeschlagen",
        fontsymbol: "fas fa-dizzy",
      },
      ko: {
        name: "Außer Gefecht",
        fontsymbol: "fas fa-times-circle",
      },
      wounded: {
        name: "Verwundet",
        fontsymbol: "fas fa-band-aid",
      },
      crippled: {
        name: "Verkrüppelt",
        fontsymbol: "fas fa-user-injured",
      },
      dead: {
        name: "Tod",
        fontsymbol: "fas fa-skull",
      },
    };
    system.techConditionLabel = {
      scratched: {
        name: "Angekratzt",
        fontsymbol: "fas fa-exclamation-triangle",
      },
      unstable: {
        name: "Instabil",
        fontsymbol: "fas fa-times-circle",
      },
      offline: {
        name: "Ausgeschaltet",
        fontsymbol: "fas fa-battery-quarter",
      },
      defect: {
        name: "Defekt",
        fontsymbol: "fas fa-car-crash",
      },
      destroyed: {
        name: "Zerstört",
        fontsymbol: "fas fa-ban",
      },
    };
    system.cortexConditionLabel = {
      overflow: {
        name: "Überlauf",
        fontsymbol: "fas fa-stream",
      },
      crash: {
        name: "Crash",
        fontsymbol: "fas fa-bug",
      },
      dos: {
        name: "DoS",
        fontsymbol: "fas fa-terminal",
      },
      offline: {
        name: "Abschaltung",
        fontsymbol: "fas fa-power-off",
      },
      rooted: {
        name: "Gerootet",
        fontsymbol: "fas fa-network-wired",
      },
    };

    const armorMultiplier = [1, 2, 4, 6, 8];

    system.hitArray = [
      this.getStat(system.armorId).attr * armorMultiplier[0] +
        this.getStat(system.armorId).fert +
        armorSize +
        armorMk,
      this.getStat(system.armorId).attr * armorMultiplier[1] +
        this.getStat(system.armorId).fert +
        armorSize +
        armorMk,
      this.getStat(system.armorId).attr * armorMultiplier[2] +
        this.getStat(system.armorId).fert +
        armorSize +
        armorMk,
      this.getStat(system.armorId).attr * armorMultiplier[3] +
        this.getStat(system.armorId).fert +
        armorSize +
        armorMk,
      this.getStat(system.armorId).attr * armorMultiplier[4] +
        this.getStat(system.armorId).fert +
        armorSize +
        armorMk,
    ];
    system.hitArrayCortex = [
      this.getStat(system.armorCortex).attr * armorMultiplier[0] +
        this.getStat(system.armorCortex).fert * 2,
      this.getStat(system.armorCortex).attr * armorMultiplier[1] +
        this.getStat(system.armorCortex).fert * 2,
      this.getStat(system.armorCortex).attr * armorMultiplier[2] +
        this.getStat(system.armorCortex).fert * 2,
      this.getStat(system.armorCortex).attr * armorMultiplier[3] +
        this.getStat(system.armorCortex).fert * 2,
      this.getStat(system.armorCortex).attr * armorMultiplier[4] +
        this.getStat(system.armorCortex).fert * 2,
    ];
    system.hitArrayTech = [
      system.size * armorMultiplier[0] + system.mk,
      system.size * armorMultiplier[1] + system.mk,
      system.size * armorMultiplier[2] + system.mk,
      system.size * armorMultiplier[3] + system.mk,
      system.size * armorMultiplier[4] + system.mk,
    ];

    this.expCounter();
  }

  expCounter() {
    const { actorData, system, attr, config } = this.getObjLocation();

    let attrEpTotal = 0;
    let skillEpTotal = 0;
    let attrList = [];
    let skillList = [];

    if (actorData.type === "Charakter") {
      attrList = config.attrList;
      skillList = config.skillList;
    } else if (actorData.type === "Nebencharakter") {
      attrList = config.attrNpc;
      skillList = config.skillListNpc;
    } else if (actorData.type === "DrohneFahrzeug") {
      attrList = config.attrVehicle;
      skillList = config.skillListVehicle;
    } else if (actorData.type === "KI") {
      attrList = config.attrAi;
      skillList = config.skillListAi;
    }

    attrList.forEach((attrIdent) => {
      let attributName = attr;
      let attrWert = attributName[attrIdent].attribut;
      let attrEp =
        ((attrWert * (attrWert + 1) * (2 * attrWert + 1)) / 6) * 5 - 5;
      attrEpTotal += attrEp;

      let skillSet = attributName[attrIdent].skill;

      skillList.forEach((skillIdent) => {
        if (skillSet[skillIdent] !== undefined) {
          let skillWert = skillSet[skillIdent];
          let skillEp =
            ((skillWert * (skillWert + 1) * (2 * skillWert + 1)) / 6) * 4;
          skillEpTotal += skillEp;
        }
      });
    });

    var propertyList = actorData.items.filter((e) => {
      return e.type === "Eigenschaft";
    });
    var artList = actorData.items.filter((i) => {
      return i.type === "Artifizierung";
    });
    system.totalAttrXp = attrEpTotal;
    system.totalSkillXp = skillEpTotal;
    system.totalPropXp = (propertyList.length + artList.length) * 100;
    system.totalXp = attrEpTotal + skillEpTotal + system.totalPropXp;
  }
}
