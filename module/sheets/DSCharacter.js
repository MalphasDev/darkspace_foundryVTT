//import { darkspace } from "../config";

export default class DSCharacter extends Actor {
  prepareData() {
    super.prepareData();

    const event = new Event("click");

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;
    const config = CONFIG.darkspace;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.

    // //Eigenschaften
    var propertyList = actorData.items.filter((e) => {
      return e.type === "Eigenschaft";
    });

    // Zustand
    data.conditionList = Object.entries(config.conditions).map((i) => {
      return i;
    });

    var activeConditions = [];
    data.conditionList.forEach((conditions) => {
      activeConditions.push(conditions[1].active);
      conditions[1].active = false;
    });
    data.conditions.forEach((conditions) => {
      data.conditionList[conditions][1].active = true;
    });

    data.activeConditions = activeConditions;
    data.activeConditionList = data.conditionList
      .filter((a) => {
        return a[1].active;
      })
      .map((b) => {
        return b[1].value;
      });

    if (this.type != "DrohneFahrzeug") {
      var weaponList = actorData.items.filter((f) => {
        return f.type === "Waffe";
      });
      var armorList = actorData.items.filter((i) => {
        return i.data.type === "Panzerung";
      });
      var quarterList = actorData.items.filter((i) => {
        return i.data.type === "Unterbringung";
      });
      var artList = actorData.items.filter((i) => {
        return i.data.type === "Artifizierung";
      });

      // Panzerung

      let armorListEquipped = armorList.filter((e) => {
        return e.data.data.equipped === true;
      });
      let cyberarmorListEquipped = artList.filter((a) => {
        return a.data.data.armor === true;
      });
      let allArmorEquipped = [].concat(
        armorListEquipped,
        cyberarmorListEquipped
      );
      let StrukturArray = Array.from(
        allArmorEquipped.map((a) => {
          return a.data.data.structure;
        })
      );
      StrukturArray.push(0);

      let SchutzArray = Array.from(
        allArmorEquipped.map((a) => {
          return a.data.data.mk;
        })
      );
      SchutzArray.push(0);

      data.Struktur = Math.max(...StrukturArray);
      data.Schutz = Math.max(...SchutzArray);

      // Eigenschaften von Panzerung
      data.armorProps = armorListEquipped.map((p) => {
        return p.data.data.propArray;
      })[0];

      // Waffenloser Kampf
      data.unarmedName = "Waffenloser Kampf";
    }

    if (this.type === "Charakter") {
      data.initiative = Math.ceil(
        (data.charattribut.Aufmerksamkeit.attribut +
          data.charattribut.Geschick.attribut +
          data.charattribut.Intuition.attribut) /
          3
      );
      data.finalinitiative = data.initiative + data.initMod;

      // Unterbringung
      let quarterListEquipped = quarterList.filter((e) => {
        return e.data.data.equipped === true;
      });

      // Ressourcen
      let attributNames = Object.keys(data.charattribut);
      for (var i = 0; attributNames.length > i; i++) {
        if (data.charattribut[attributNames[i]].ress != undefined) {
          data.charattribut[attributNames[i]].ress.remaining =
            data.charattribut[attributNames[i]].ress.max -
            data.charattribut[attributNames[i]].ress.value;
        }
      }

      // Unterhalt und Wohlstand
      let ownedItems = actorData.items.filter((i) => {
        return (
          i.type != "Eigenschaft" &&
          i.type != "Besonderheiten" &&
          i.type != "Unterbringung"
        );
      });
      ownedItems = ownedItems.concat(quarterListEquipped);

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

      data.keepOfItems = Math.max(...itemSizes) + Math.max(...itemMk);
      data.wealth = data.charattribut.Ressourcen.attribut * 2;
      data.needKeep = data.wealth - data.keepOfItems < 0 ? true : false;

      // Erholung

      let geistespunkte = data.charattribut.Konzentration.ress.value;
      if (geistespunkte <= 3) {
        data.comfortCr = 20;
      }
      if (geistespunkte > 3 && geistespunkte < 7) {
        data.comfortCr = 18;
      }
      if (geistespunkte >= 7) {
        data.comfortCr = 16;
      }

      // // Kybernese
      // data.miscData.Kybernese.mk = actorData.items
      //   .filter((i) => {
      //     return i.type === "Artifizierung";
      //   })
      //   .map((j) => {
      //     return j.data.data.mk;
      //   });
      // data.miscData.Kybernese.bonus = Math.min(
      //   ...data.miscData.Kybernese.mk,
      //   0
      // );

      // Waffenloser Durchschlag

      data.unarmedDmg =
        2 + Math.floor(data.charattribut.Konstitution.attribut / 6);
    }

    if (this.type === "Nebencharakter") {
      data.bruises.max =
        5 +
        data.bruises.bonus +
        Math.floor(data.charattribut.Geistig.attribut / 6);
      data.wounds.max =
        5 +
        data.wounds.bonus +
        Math.floor(data.charattribut.Körperlich.attribut / 6);

      // Waffenloser Durchschlag
      data.unarmedDmg =
        2 + Math.floor(data.charattribut.Körperlich.attribut / 6);

      data.initiative = data.Bedrohungsstufe;

      for (var prop in data.charattribut) {
        let prioBonus;
        if (data.charattribut[prop].prio) {
          prioBonus = 1;
        } else {
          if (data.charattribut[prop].dePrio) {
            prioBonus = -1;
          } else {
            prioBonus = 0;
          }
        }

        data.charattribut[prop].attribut = data.Bedrohungsstufe + prioBonus;

        if (data.charattribut[prop].dePrio) {
          for (var skill in data.charattribut[prop].skill) {
            data.charattribut[prop].skill[skill] = 0;
          }
        } else {
          for (var skill in data.charattribut[prop].skill) {
            data.charattribut[prop].skill[skill] =
              Math.ceil(data.Bedrohungsstufe / 2) + prioBonus;
          }
        }
      }
    }

    if (this.type === "DrohneFahrzeug") {
      data.structure = Math.max(data.mk + data.size, 1);

      data.bruisesName = "Beschädigungen";
      data.woundsName = "Verletzungen";

      data.damageFailure = data.structure + data.damages.max;
      data.damageDestruction = data.damageFailure * 2;

      data.halbmk = Math.ceil(data.mk / 2);
      data.noMk = 0;

      data.initiative = data.mk;
      data.finalinitiative = data.initiative + data.initMod;
      data.initBonus = Math.ceil(data.mk / 2);

      // Panzerung
      data.Struktur = data.structure;
      data.Schutz = Math.ceil(data.mk / 2);

      // Waffenloser Durchschlag
      data.unarmedHide = true;

      // Handling
      data.handling = data.mk - data.size;
      if (data.handling < -1) {
        data.handlingDesc = "Schwach";
      }
      if (data.handling >= -1 && data.handling <= 1) {
        data.handlingDesc = "Normal";
      }
      if (data.handling > 1) {
        data.handlingDesc = "Gut";
      }

      // Passagiere und Fracht
      let absSize = Math.max(data.size, 0);
      let sizeLength = Math.pow(10, absSize) / 100;
      let passengerNumber =
        Math.ceil(Math.pow(2, absSize) / sizeLength) * sizeLength * absSize;
      data.passenger = data.size > 0 ? passengerNumber + " Personen / " : "";
      data.cargo = data.size - 1;
      data.crewNumber = Math.min(absSize, data.mk);
    }
  }
  async _preCreate() {
    // Player character configuration
    const actorData = this.data;
    if (this.type === "Charakter") {
      actorData.token.update({ vision: true, actorLink: true, disposition: 1 });
    }
    actorData.token.update({ dimSight: 5 });
  }
}
