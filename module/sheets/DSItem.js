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
    data.cortexDmg = data.size + data.mk * 2;
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
