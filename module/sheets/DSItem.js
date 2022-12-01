import * as config from "../config.js";
export default class DSItem extends Item {
  prepareData() {
    super.prepareData();

    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const configData = config.darkspace;
    const data = itemData.data;

    data.attrList = configData.attr;

    // Struktur und Schutz //
    data.structure = parseInt(data.size);
    data.protection = Math.round(parseInt(data.mk) / 2);
    // Senorreichweite //
    data.sensorRange = Math.pow(data.mk, 2) * 10;

    // Unterhalt //
    data.keep = Math.max(data.mk, data.size, 0);

    // Waffen //
    data.sizeRange = data.size;

    data.autoRangeShort = Math.pow(data.sizeRange, 2) + data.mk;
    data.autoRangeBase = data.autoRangeShort * 5;
    data.autoRangeExtr = data.autoRangeBase * 10;
    data.autoRangeMax = data.autoRangeBase * 20;

    data.range =
      data.autoRangeShort +
      "-" +
      data.autoRangeBase +
      "/" +
      data.autoRangeExtr +
      "/" +
      data.autoRangeMax;

    data.aeCost = data.size * 2;

    if (data.ranged === true) {
      data.attackWith = "Schusswaffen";
      data.dmg = 10 + data.size * 2;
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
      data.dmg = 10 + data.size + " + Kon.";

      itemData.type === "Waffe"
        ? actorData === undefined
          ? (data.dmg = 10 + data.size + " + Kon.")
          : (data.dmg =
              10 +
              data.size +
              actorData.data.charattribut.Konstitution.attribut)
        : null;
    }
    // Eigenschaften anzeigen
    let propList = data.properties;

    if (propList === undefined || propList === "") {
    } else {
      data.propArray = data.properties.split(",");
    }

    //Alles außer Eigenschaft und Besonderheiten
    if (itemData.type != "Eigenschaft" && itemData.type != "Besonderheiten") {
      // Ressourcen
      data.botsRemaining = data.mk - data.ress.bots;
    }

    switch (data.size) {
      case 0:
        data.sizeKat = "Winzig";
        break;
      case 1:
        data.sizeKat = "Klein";
        break;
      case 2:
        data.sizeKat = "Handlich";
        break;
      case 3:
        data.sizeKat = "Mittelgroß";
        break;
      case 4:
        data.sizeKat = "Groß";
        break;
      case 5:
        data.sizeKat = "Personengroß";
        break;
      case 6:
        data.sizeKat = "Sperrig";
        break;
      case 7:
        data.sizeKat = "Sehr groß";
        break;
      case 8:
        data.sizeKat = "Riesig";
        break;
      case 9:
        data.sizeKat = "Enorm";
        break;
      case 10:
        data.sizeKat = "Immens";
        break;
      case 11:
        data.sizeKat = "Gewaltig";
        break;
      case 12:
        data.sizeKat = "Gigantisch";
        break;
      case 13:
        data.sizeKat = "Kolossal";
        break;
      case 14:
        data.sizeKat = "Titanisch";
        break;
    }
    if (this.type === "Waffe") {
      switch (data.size) {
        case 2:
          data.sizeKat = data.sizeKat + "/Pistole";
          break;
        case 3:
          data.sizeKat = data.sizeKat + "/Karabiner";
          break;
        case 4:
          data.sizeKat = data.sizeKat + "/Gewehr";
          break;
        case 5:
          data.sizeKat = data.sizeKat + "/Unterstützung";
          break;
        case 6:
          data.sizeKat = data.sizeKat + "/Kanone";
          break;
        case 7:
          data.sizeKat = data.sizeKat + "/Geschütz";
          break;
        case 8:
          data.sizeKat = data.sizeKat + "/Geschütz";
          break;
        case 9:
          data.sizeKat = data.sizeKat + "/Geschütz";
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
