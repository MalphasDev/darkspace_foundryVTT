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
    system.range = Math.pow(system.mk * 2, 2) * 10;
    system.aeCost = system.mk * 2;
  }
  // medkitData() {}
  artData() {
    const { itemData, system, config } = this.getObjLocation();
    const attrMax = 5 // Das irgendwann mal anpassen, damit abgefragt werden kann, wie lange man Attribute erhöhen kann.
    system.attrMaxBonus = system.mk + attrMax - Object.entries(system.props).length;
  }
  droneData() {
    const { itemData, system, config } = this.getObjLocation();
    system.droneList = game.actors.filter((drone)=>{
      return drone.type === "DrohneFahrzeug"
    })
    system.droneData = game.actors.get(system.droneId)
  }

  prepareData() {
    super.prepareData();

    const { itemData, system, config } = this.getObjLocation();

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
    if (this.type === "Drohne") {
      this.droneData();
    }

    // Struktur und Schutz //
    system.structure = parseInt(system.size) + parseInt(system.mk);

    // Zustände
    system.techConditionLabel = config.techConditionLabel;
    system.cortexConditionLabel = config.cortexConditionLabel;

    system.hitArrayCortex = DSHealth.getHealth(system.mk, system.size + system.structure);
    system.hitArrayTech = DSHealth.getHealth(system.size, system.mk + system.structure);


    if (this.type != "Drohne") {
      const itemRess = system.ress;
    itemRess.bots = {
      value: system.ress.bots.value,
      max: system.mk - Object.entries(system.props).length,
      remain: system.mk - Object.entries(system.props).length - system.ress.bots.value,
    };
    }
    const unsortedSkillList = [].concat(config.skillList,config.skillListNpc,config.skillListAi,config.skillListVehicle).sort()
    system.allSkills = new Set(unsortedSkillList)

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
