//import { darkspace } from "../config";
import * as DSMechanics from "../DSMechanics.js";

export default class DSCharacter extends Actor {
  getStat(fert) {
    let dbAttr;
    if (
      this.data.data.charattribut === undefined ||
      this.data.data.charattribut === null
    ) {
      dbAttr = {};
    } else {
      dbAttr = this.data.data.charattribut;
    }
    return DSMechanics.getStat(fert, dbAttr);
  }

  prepareData() {
    super.prepareData();
    const actorData = this.data;
    const data = actorData.data;
    const attr = this.data.data.charattribut;
    const config = CONFIG.darkspace;

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

    // Zustand

    if (this.type != "DrohneFahrzeug") {
      var weaponList = actorData.items.filter((f) => {
        return f.type === "Waffe";
      });
      var armorList = actorData.items.filter((i) => {
        return i.data.type === "Panzerung";
      });
      var artList = actorData.items.filter((i) => {
        return i.data.type === "Artifizierung";
      });
      var artList = actorData.items.filter((i) => {
        return i.data.type === "Artifizierung";
      });

      // Panzerung

      let armorId;
      if (this.type === "Charakter") {
        armorId = "Fitness";
      }
      if (this.type === "Nebencharakter") {
        armorId = "Kraft";
      }

      const armorSize = [
        armorList
          .map((e) => {
            return e.data.data.size;
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
            return e.data.data.mk;
          })
          .sort((a, b) => {
            return b - a;
          })[0],
        0,
      ].sort((a, b) => {
        return b - a;
      })[0];

      let armorMultiplier = [1, 2, 4, 6, 8];

      data.hitArray = [
        this.getStat(armorId).attr * armorMultiplier[0] +
          this.getStat(armorId).fert +
          armorSize +
          armorMk,
        this.getStat(armorId).attr * armorMultiplier[1] +
          this.getStat(armorId).fert +
          armorSize +
          armorMk,
        this.getStat(armorId).attr * armorMultiplier[2] +
          this.getStat(armorId).fert +
          armorSize +
          armorMk,
        this.getStat(armorId).attr * armorMultiplier[3] +
          this.getStat(armorId).fert +
          armorSize +
          armorMk,
        this.getStat(armorId).attr * armorMultiplier[4] +
          this.getStat(armorId).fert +
          armorSize +
          armorMk,
      ];

      // Waffenloser Kampf
      data.unarmedName = "Waffenloser Kampf";
    }
    //
    if (this.type === "Charakter" || this.type === "KI") {
      if (this.type === "Charakter") {
        data.unarmedDmg =
          10 +
          Math.max(this.getStat("Fitness").attr, this.getStat("Motorik").attr);
      }

      // Unterhalt und Wohlstand
      let ownedItems = actorData.items.filter((i) => {
        return (
          i.type != "Eigenschaft" &&
          i.type != "Besonderheiten" &&
          i.type != "Unterbringung"
        );
      });
      let itemSizes = Array.from(
        ownedItems.map((k) => {
          return k.data.data.size;
        })
      ).sort((a, b) => a - b);
      let itemMk = Array.from(
        ownedItems.map((k) => {
          return k.data.data.mk;
        })
      ).sort((a, b) => a - b);

      data.keepOfItems =
        itemSizes.length == 0
          ? 0
          : Math.max(...itemSizes) + itemMk.length == 0
          ? 0
          : Math.max(...itemMk);
      data.wealth = this.getStat("Finanzen").attr * 2;
      data.needKeep = data.wealth - data.keepOfItems < 0 ? true : false;
    } else if (this.type === "KI") {
      data.initiative =
        this.getStat("Fokus").attr + "d10x10kh2+" + this.getStat("Fokus").fert;

      config.attrAi.forEach((attrIdent) => {
        let attributName = attr;
        let attrWert = attributName[attrIdent].attribut;
        let attrEp =
          ((attrWert * (attrWert + 1) * (2 * attrWert + 1)) / 6) * 5 - 5;
        attrEpTotal += attrEp;

        let skillSet = attributName[attrIdent].skill;

        config.skillListAi.forEach((skillIdent) => {
          if (skillSet[skillIdent] !== undefined) {
            let skillWert = skillSet[skillIdent];
            let skillEp =
              ((skillWert * (skillWert + 1) * (2 * skillWert + 1)) / 6) * 4;
            skillEpTotal += skillEp;
          }
        });
      });
    }

    // Erholung

    // Waffenloser Durchschlag

    // Erfahrung

    if (this.type === "Nebencharakter") {
      data.initiative =
        this.getStat("Angriff").attr +
        "d10x10kh2+" +
        this.getStat("Angriff").fert;
    }

    if (this.type === "DrohneFahrzeug") {
      data.initiative =
        this.getStat("Bots").attr + "d10x10kh2+" + this.getStat("Bots").fert;

      // Waffenloser Durchschlag
      data.unarmedHide = true;

      let armorMultiplier = [1, 2, 4, 6, 8];
      data.vehicleArmor = [
        (data.size + data.mk) * armorMultiplier[0],
        (data.size + data.mk) * armorMultiplier[1],
        (data.size + data.mk) * armorMultiplier[2],
        (data.size + data.mk) * armorMultiplier[3],
        (data.size + data.mk) * armorMultiplier[4],
      ];

      // Passagiere und Fracht

      let passengerNumber = Math.pow(5, Math.max(0, data.size - 5) - 1);
      data.passenger = data.size > 0 ? passengerNumber + " Personen / " : "";
      data.cargo = "GM " + (data.size - 1);
      data.passengerCargo = data.passenger + data.cargo;
      data.crewNumber = "Fertigkeitsstufe " + Math.min(data.mk, data.size);
    }
    this.expCounter();
  }

  async _preCreate() {
    // Player character configuration
    const actorData = this.data;
    if (this.type === "Charakter") {
      actorData.token.update({ vision: true, actorLink: true, disposition: 1 });
    }
    actorData.token.update({ dimSight: 5 });
  }
  vehicleSkills(value) {
    const actorData = this.data;
    const data = actorData.data;
    let a = value[0];
    let b = value[1];
    let newValue = data.mk * a * ((data.size / 10) * b);
    return newValue;
  }

  expCounter() {
    const actorData = this.data;
    const data = actorData.data;
    const attr = actorData.data.charattribut;
    const config = CONFIG.darkspace;

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
      return i.data.type === "Artifizierung";
    });
    data.totalAttrXp = attrEpTotal;
    data.totalSkillXp = skillEpTotal;
    data.totalPropXp = (propertyList.length + artList.length) * 100;
    data.totalXp = attrEpTotal + skillEpTotal + data.totalPropXp;
  }
}
