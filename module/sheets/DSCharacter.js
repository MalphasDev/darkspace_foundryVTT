//import { darkspace } from "../config";

export default class DSCharacter extends Actor {
  prepareData() {
    super.prepareData();

    const event = new Event("click");

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.

    if (this.type != "DrohneFahrzeug") {
      var weaponList = this.data.items.filter((f) => {
        return f.type === "Waffe";
      });
      var armorList = this.data.items.filter((i) => {
        return i.data.type === "Panzerung";
      });
      var quarterList = this.data.items.filter((i) => {
        return i.data.type === "Unterbringung";
      });
      var artList = this.data.items.filter((i) => {
        return i.data.type === "Artifizierung";
      });

      data.conditions = [];

      data.bruisesName = "Betäubungen";
      data.woundsName = "Verletzungen";

      if (data.bruises.value === data.bruises.max) {
        data.conditions.push("Leichtes Ziel");
      }
      if (data.wounds.value >= data.wounds.max) {
        data.conditions.push("Außer Gefecht");
      }
      if (parseInt(data.wounds.value) >= 10) {
        data.conditions.push("Tod");
      }

      // Panzerung

      let armorListEquipped = armorList.filter((e) => {
        return e.data.data.equipped === true;
      });
      let StrukturArray = Array.from(
        armorListEquipped.map((a) => {
          return a.data.data.structure;
        })
      );
      StrukturArray.push(0);

      let SchutzArray = Array.from(
        armorList.map((a) => {
          return a.data.data.protection;
        })
      );
      SchutzArray.push(0);

      let addedArmors = Math.min(Math.max(StrukturArray.length - 2, 0), 2);

      data.Struktur = Math.max(...StrukturArray);
      data.Schutz = Math.max(...SchutzArray) + addedArmors;
    }

    if (this.type === "Charakter") {
      data.charattribut.Ressourcen.ress.max = 10; // Nach Aktualisierung entfernen

      data.bruises.value < 0 ? (data.bruises.value = 0) : data.bruises.value;
      data.wounds.value < 0 ? (data.wounds.value = 0) : data.wounds.value;

      data.bruises.value > data.bruises.max
        ? (data.bruises.value = data.bruises.max)
        : data.bruises.value;
      data.wounds.value > 10 ? (data.wounds.value = 10) : data.wounds.value;

      data.bruises.max =
        5 +
        data.bruises.bonus +
        Math.floor(data.charattribut.Konzentration.attribut / 6);
      data.wounds.max =
        5 +
        data.wounds.bonus +
        Math.floor(data.charattribut.Konstitution.attribut / 6);

      data.bruises.remaining = Math.max(
        data.bruises.max - data.bruises.value,
        0
      );
      data.wounds.remaining = Math.max(data.wounds.max - data.wounds.value, 0);

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
      let ownedItems = this.data.items.filter((i) => {
        return (
          i.type != "Talent" &&
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

      let trauma = data.charattribut.Konzentration.ress.value;
      if (trauma <= 3) {
        data.comfortCr = 16;
      }
      if (trauma > 3 && trauma < 7) {
        data.comfortCr = 18;
      }
      if (trauma >= 7) {
        data.comfortCr = 20;
      }

      // Kybernese
      data.miscData.Kybernese.mk = this.data.items
        .filter((i) => {
          return i.type === "Artifizierung";
        })
        .map((j) => {
          return j.data.data.mk;
        });
      data.miscData.Kybernese.bonus = Math.min(
        ...data.miscData.Kybernese.mk,
        0
      );

      // Waffenloser Schaden
      data.unarmedName = "Waffenloser Kampf";
      data.unarmedDmg =
        2 + Math.floor(data.charattribut.Konstitution.attribut / 6);
      data.unarmedDmgType = "B";
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

      // Waffenloser Schaden
      data.unarmedDmg =
        2 + Math.floor(data.charattribut.Körperlich.attribut / 6);
      data.unarmedDmgType = "B";

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

      // Waffenloser Schaden
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
    if (this.type === "Charakter") {
      this.data.token.update({ vision: true, actorLink: true, disposition: 1 });
    }
  }
}
