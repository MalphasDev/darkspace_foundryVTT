//import { darkspace } from "../config";

export default class DSCharacter extends Actor {
  prepareData() {
    super.prepareData();

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

      let SchutzArray = Array.from(
        allArmorEquipped.map((a) => {
          return a.data.data.protection;
        })
      );
      SchutzArray.push(0);

      StrukturArray.length == 0
        ? (data.Struktur = 0)
        : (data.Struktur = Math.max(...StrukturArray));

      data.Schutz = Math.max(...SchutzArray);

      // Eigenschaften von Panzerung
      data.armorProps = armorListEquipped.map((p) => {
        return p.data.data.propArray;
      })[0];

      // Waffenloser Kampf
      data.unarmedName = "Waffenloser Kampf";
    }
    let attrEpTotal = 0;
    let skillEpTotal = 0;
    if (this.type === "Charakter" || this.type === "KI") {
      if (this.type === "Charakter") {
        data.initiative = Math.ceil(
          (data.charattribut.Aufmerksamkeit.attribut +
            data.charattribut.Geschick.attribut +
            data.charattribut.Intuition.attribut) /
            3
        );

        data.unarmedDmg =
          2 +
          Math.floor(
            (data.charattribut.Konstitution.attribut +
              data.charattribut.Geschick.attribut) /
              3
          );
        data.weaponDmgBonus = Math.floor(
          (data.charattribut.Konstitution.attribut +
            data.charattribut.Geschick.attribut) /
            4
        );

        config.attr.forEach((attrIdent) => {
          let attributName = data.charattribut;
          let attrWert = attributName[attrIdent].attribut;
          let attrEp =
            ((attrWert * (attrWert + 1) * (2 * attrWert + 1)) / 6) * 5 - 5;
          attrEpTotal += attrEp;

          let skillSet = attributName[attrIdent].skill;

          config.skillList.forEach((skillIdent) => {
            if (skillSet[skillIdent] !== undefined) {
              let skillWert = skillSet[skillIdent];
              let skillEp =
                ((skillWert * (skillWert + 1) * (2 * skillWert + 1)) / 6) * 4;
              skillEpTotal += skillEp;
            }
          });
        });
      }
    } else if (this.type === "KI") {
      data.initiative = Math.ceil(
        (data.charattribut.Aufmerksamkeit.attribut +
          data.charattribut.Konzentration.attribut +
          data.charattribut.Intuition.attribut) /
          3
      );

      config.attrAi.forEach((attrIdent) => {
        let attributName = data.charattribut;
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
    data.finalinitiative = data.initiative + data.initMod;
    data.totalAttrXp = attrEpTotal;
    data.totalSkillXp = skillEpTotal;
    data.totalPropXp = propertyList.length * 100;
    data.totalXp = attrEpTotal + skillEpTotal + data.totalPropXp;

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

    data.keepOfItems =
      itemSizes.length == 0
        ? 0
        : Math.max(...itemSizes) + itemMk.length == 0
        ? 0
        : Math.max(...itemMk);
    data.wealth = data.charattribut.Ressourcen.attribut * 2;
    data.needKeep = data.wealth - data.keepOfItems < 0 ? true : false;

    // Erholung

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

    // Erfahrung

    if (this.type === "Nebencharakter") {
      let combatAttr = Math.max(data.Kompetenz + data.Kampfkraft, 1);
      let combatSkill = Math.floor(
        Math.max(data.Kompetenz + data.Kampfkraft, 1) / 2
      );

      let techAttr = Math.max(data.Kompetenz + data.Tech, 1);
      let techSkill = Math.floor(Math.max(data.Kompetenz + data.Tech, 1) / 2);

      let normalAttr = data.Kompetenz;
      let normalSkill = Math.floor(data.Kompetenz / 2);

      data.charattribut = {
        Kampf: {
          attribut: combatAttr,
          skill: { Angriff: combatSkill, Abwehr: normalSkill },
        },
        Körper: {
          attribut: normalAttr,
          skill: { Kraft: combatSkill, Ausdruck: normalSkill },
        },
        Intelligenz: {
          attribut: techAttr,
          skill: { Cortex: techSkill, Intellekt: normalSkill },
        },
      };

      data.initiative = Math.max(data.Kompetenz + data.Kampfkraft, 1);
      data.unarmedDmg = 2 + Math.floor(combatAttr / 3);
      data.weaponDmgBonus = Math.floor(combatAttr / 4);
    }

    if (this.type === "DrohneFahrzeug") {
      data.structure = Math.max(data.mk + data.size, 1);

      data.bruisesName = "Beschädigungen";
      data.woundsName = "Verletzungen";

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
      data.crewNumber = Math.floor(absSize / 2) + data.mk;
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
