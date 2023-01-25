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
    // Senorreichweite //
    data.sensorRange = Math.pow(data.mk, 2) * 10;

    // Unterhalt //
    data.keep = Math.max(data.mk, data.size, 0);

    // Waffen //

    const rangeArray = [
      Math.pow(data.size, 2),
      Math.pow(data.size, 2) * 5,
      Math.pow(data.size, 2) * 10,
    ];

    data.range = rangeArray[0] + "-" + rangeArray[1] + "/" + rangeArray[2];

    data.aeCost = data.size * 2;

    data.dmg = data.size * 2 + data.mk;
    // Eigenschaften anzeigen
    let propList = data.properties;

    if (propList === undefined || propList === "") {
    } else {
      data.propArray = data.properties.split(",");
    }

    //Alles außer Eigenschaft und Besonderheiten
    if (itemData.type != "Eigenschaft" && itemData.type != "Besonderheiten") {
      // Ressourcen
      data.botsTotal = data.mk * data.size;
      data.botsRemaining = data.botsTotal - data.ress.bots;
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
