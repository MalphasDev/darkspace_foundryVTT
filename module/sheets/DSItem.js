import * as config from "../config.js";
import DSCharacter from "./DSCharacter.js";
export default class DSItem extends Item {
  prepareData() {
    super.prepareData();

    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const configData = config.darkspace;
    const data = itemData.data;

    data.attrList = configData.attr;

    // Struktur und Schutz //
    data.structure =
      parseInt(data.mk) + parseInt(data.size) < 1
        ? 1
        : parseInt(data.mk) + parseInt(data.size);
    data.protection = Math.floor(data.structure / 2);
    // Senorreichweite //
    data.sensorRange = Math.pow(data.mk, 2) * 10;

    // Unterhalt //
    data.keep = Math.max(data.mk, data.size, 0);

    // Waffen //

    data.sizeRange = Math.max(data.size, -3) + 4;
    data.autoRangeBase = Math.pow(data.sizeRange, 2) * 10;
    data.autoRangeShort = data.autoRangeBase / 10;
    data.autoRangeExtr = data.autoRangeBase * 2;
    data.autoRangeMax = data.autoRangeBase * 10;

    let aeCostArray = [4, 6, 8, 10];

    data.aeCost = aeCostArray[data.size + 3];
    if (data.size < -3) {
      data.aeCost = 4;
    }
    if (data.size > 0) {
      data.aeCost = 10;
    }

    if (data.ranged === true) {
      data.attackWith = "Schusswaffen";
      data.dmg = data.mk + Math.floor((data.size + 5) / 2);
      data.range =
        data.autoRangeShort +
        "-" +
        data.autoRangeBase +
        "/" +
        data.autoRangeExtr +
        "/" +
        data.autoRangeMax;
    } else {
      data.range = "Nahkampf";
      if (actorData !== {} && actorData !== undefined) {
        if (actorData.type === "Charakter") {
          data.attackWith = "Nahkampfwaffen";
        }
        if (actorData.type === "Nebencharakter") {
          data.attackWith = "Kampftechnik";
        }
      } else {
      }
      data.dmg = Math.floor(data.mk / 2) + (data.size + 5);
      // actorData.data.charattribut.Konstitution.attribut
    }
    // Eigenschaften anzeigen
    let propList = data.properties;

    if (propList === undefined || propList === "") {
    } else {
      data.propArray = data.properties.split(",");
    }

    //Alles au??er Eigenschaft und Besonderheiten
    if (itemData.type != "Eigenschaft" && itemData.type != "Besonderheiten") {
      // Ressourcen
      data.botsRemaining = data.mk - data.ress.bots;
    }

    switch (data.size) {
      case -5:
        data.sizeKat = "Winzig";
        break;
      case -4:
        data.sizeKat = "Klein";
        break;
      case -3:
        data.sizeKat = "Handlich";
        break;
      case -2:
        data.sizeKat = "Mittelgro??";
        break;
      case -1:
        data.sizeKat = "Gro??";
        break;
      case 0:
        data.sizeKat = "Personengro??";
        break;
      case 1:
        data.sizeKat = "Sperrig";
        break;
      case 2:
        data.sizeKat = "Sehr gro??";
        break;
      case 3:
        data.sizeKat = "Riesig";
        break;
      case 4:
        data.sizeKat = "Enorm";
        break;
      case 5:
        data.sizeKat = "Immens";
        break;
      case 6:
        data.sizeKat = "Gewaltig";
        break;
      case 7:
        data.sizeKat = "Gigantisch";
        break;
      case 8:
        data.sizeKat = "Kolossal";
        break;
      case 9:
        data.sizeKat = "Titanisch";
        break;
    }
    if (this.type === "Waffe") {
      switch (data.size) {
        case -3:
          data.sizeKat = data.sizeKat + "/Pistole";
          break;
        case -2:
          data.sizeKat = data.sizeKat + "/Karabiner";
          break;
        case -1:
          data.sizeKat = data.sizeKat + "/Gewehr";
          break;
        case 0:
          data.sizeKat = data.sizeKat + "/Unterst??tzung";
          break;
        case 1:
          data.sizeKat = data.sizeKat + "/Kanone";
          break;
        case 2:
          data.sizeKat = data.sizeKat + "/Gesch??tz";
          break;
        case 3:
          data.sizeKat = data.sizeKat + "/Gesch??tz";
          break;
        case 4:
          data.sizeKat = data.sizeKat + "/Gesch??tz";
          break;
      }
    }
  }

  async _preCreate(createData, options, user) {
    await super._preCreate(createData, options, user);

    let itemType = createData.type;

    // add token default settings
    const updateData = {};
    updateData["img"] =
      "systems/darkspace/icons/itemDefault/itemIcon_" + itemType + ".svg";
    await this.data.update(updateData);
  }
}
