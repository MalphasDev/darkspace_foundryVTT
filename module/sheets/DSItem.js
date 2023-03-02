import * as DSHealth from "../DSHealth.js";

export class DSItem extends Item {
  getObjLocation() {
    const itemData = this;
    const system = this.system;
    const config = CONFIG.darkspace;

    return { itemData, system, config };
  }

  weaponData() {
    const { itemData, system, config } = this.getObjLocation();
    system.dmg = system.size * 2 + system.mk;
    system.aeCost = system.size * 2;
  }
  gunData() {
    const { itemData, system, config } = this.getObjLocation();
    const rangeArray = [
      Math.pow(system.size, 2),
      Math.pow(system.size, 2) * 5,
      Math.pow(system.size, 2) * 10,
    ];
    system.range = rangeArray[0] + "-" + rangeArray[1] + "/" + rangeArray[2];
  }
  // closeCombatWeaponData() {}
  // armorData() {}
  // toolData() {}
  terminalData() {
    const { itemData, system, config } = this.getObjLocation();
    system.dmg = system.size + system.mk * 2;
    // Senorreichweite //
    system.range = Math.pow(system.size + system.mk, 2) * 10;
    system.aeCost = system.mk * 2;
  }
  // medkitData() {}
  artData() {
    const { itemData, system, config } = this.getObjLocation();
    system.attrMaxBonus = system.mk + 5;
  }
  // propData() {}

  prepareData() {
    super.prepareData();

    const { itemData, system, config } = this.getObjLocation();

    // Struktur und Schutz //
    system.structure = parseInt(system.size) + parseInt(system.mk);

    // Zustände
    system.techConditionLabel = config.techConditionLabel;
    system.cortexConditionLabel = config.cortexConditionLabel;

    system.hitArrayCortex = DSHealth.getHealth(system.mk * 2, 0);
    system.hitArrayTech = DSHealth.getHealth(system.size, system.mk);

    const itemRess = system.ress;
    itemRess.bots = {
      value: system.ress.bots.value,
      max: system.mk * system.size - Object.entries(system.props).length,
      remain: system.mk * system.size - system.ress.bots.value,
    };

    // Waffen //

    if (this.type === "Schusswaffe" || this.type === "Nahkampfwaffe") {
      this.weaponData();
    }
    if (this.type === "Schusswaffe") {
      this.gunData();
    }
    if (this.type === "Terminals") {
      this.terminalData();
    }

    if (this.type === "Artifizierung") {
      this.artData();
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
