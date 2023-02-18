export class DSItem extends Item {
  prepareData() {
    super.prepareData();

    const itemData = this;
    const systemData = itemData.system;

    // Struktur und Schutz //
    systemData.structure = parseInt(systemData.size);
    // Senorreichweite //
    systemData.signal = Math.pow(systemData.size + systemData.mk, 2) * 10;

    // Unterhalt //
    systemData.keep = Math.max(systemData.mk, systemData.size, 0);

    // Waffen //

    const rangeArray = [
      Math.pow(systemData.size, 2),
      Math.pow(systemData.size, 2) * 5,
      Math.pow(systemData.size, 2) * 10,
    ];

    systemData.range =
      rangeArray[0] + "-" + rangeArray[1] + "/" + rangeArray[2];

    systemData.aeCost = systemData.size * 2;

    systemData.dmg = systemData.size * 2 + systemData.mk;
    systemData.cortexDmg = systemData.size + systemData.mk * 2;
    // Eigenschaften anzeigen
    let propList = systemData.properties;

    if (propList === undefined || propList === "") {
    } else {
      systemData.propArray = systemData.properties.split(",");
    }

    //Alles außer Eigenschaft und Besonderheiten
    if (itemData.type != "Eigenschaft" && itemData.type != "Besonderheiten") {
      // Ressourcen
      systemData.botsTotal = systemData.mk * systemData.size;
      systemData.botsRemaining = systemData.botsTotal - systemData.ress.bots;
    }
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
