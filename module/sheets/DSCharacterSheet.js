import * as DSMechanics from "../DSMechanics.js";

export default class DSCharakcterSheet extends ActorSheet {
  get template() {
    return `systems/darkspace/templates/sheets/actors/${this.actor.data.type}-sheet.html`;
  }
  chatTemplate = {
    Skill: "systems/darkspace/templates/dice/chatSkill.html",
    Custom: "systems/darkspace/templates/dice/chatCustom.html",
    Item: "systems/darkspace/templates/dice/chatItem.html",
    Unarmed: "systems/darkspace/templates/dice/chatUnarmed.html",
    Waffe: "systems/darkspace/templates/dice/chatWeapon.html",
    Panzerung: "systems/darkspace/templates/dice/chatArmor.html",
    Artifizierung: "systems/darkspace/templates/dice/chatCybernetics.html",
  };
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template:
        "systems/darkspace/templates/sheets/actors/Character-sheet.html",
      classes: ["darkspace", "sheet", "Charakter"],
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  getData() {
    let charData = super.getData();

    // Zusammenstellen aller Gegenstände für die EACH Schleifen auf dem Charakterbogen.

    let itemType = Array.from(
      charData.items.map((i) => {
        return i.type;
      })
    );

    itemType.forEach((itemType) => {
      charData[itemType] = charData.items.filter((item) => {
        return item.type == itemType;
      });
    });

    const data = { ...charData, ...CONFIG.darkspace };

    return data;
  }

  activateListeners(html) {
    /* html.find(cssSelector).event(this._someCallBack.bind(this)); <---- Template */

    super.activateListeners(html);

    html.find(".incRess, .decRess").click(this._modRess.bind(this));
    html.find(".item-quick-edit").change(this._itemQuickEdit.bind(this));

    // Find and Bind

    const classIdent = [
      ".itemEdit",
      ".itemDelete",
      ".rollSkill",
      ".rollItem",
      ".customRoll",
      ".changeProp",
      ".unarmedCombat",
      ".directRoll",
      ".ressPoints",
      ".ressReset",
    ];

    classIdent.forEach((ident) => {
      eval(
        `html.find("${ident}").click(this.${
          "_" + ident.substring(1)
        }.bind(this))`
      );
    });
    if (this.actor.owner) {
      let handler = (ev) => this._onDragStart(ev);
      // Find all items on the character sheet.
      html.find("li.item").each((i, li) => {
        // Ignore for the header row.
        if (li.classList.contains("item-header")) return;
        // Add draggable attribute and dragstart listener.
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  createInputData(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const actorData = this.object.data.data;
    let inputData = {
      eventData: element,
      actorId: this.actor.id,
      actorData: actorData,
      removehighest: element.className.includes("disadv"),
      object: this.object,
    };

    return inputData;
  }

  async _rollSkill(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actorData = this.object.data.data;

    var roleData = {
      attribute: DSMechanics.getStat(dataset.skill, actorData.charattribut)
        .attrName,
      skill: DSMechanics.getStat(dataset.skill, actorData.charattribut)
        .fertName,
      rollname: false,
    };

    if (dataset.rollname) {
      roleData = { ...roleData, rollname: dataset.rollname };
    }

    // if (this.actor.type === "DrohneFahrzeug") {
    //   dynattr = actorData[dataset.attr];
    //   dynskill = actorData[dataset.skill];

    //   roleData = { attribute: "", skill: "Modulklasse" };
    // } else {
    //   if (dataset.rolltype != "cybernetic") {
    //     dynattr = actorData.charattribut[dataset.attr].attribut;
    //     dynskill = actorData.charattribut[dataset.attr].skill[dataset.skill];
    //   } else {
    //     dynattr = actorData.miscData.Kybernese.attribut;
    //     dynskill = actorData.miscData.Kybernese.bonus;
    //     roleData = { attribute: "Kybernese", skill: "Artfizierung" };
    //   }
    // }

    // ------------------------- //
    // Bau des Übergabe-Objektes //
    // ------------------------- //

    let preCreatedInput = this.createInputData(event);
    var inputData = {
      ...preCreatedInput,
      dynattr: DSMechanics.getStat(dataset.skill, actorData.charattribut).attr,
      dynskill: DSMechanics.getStat(dataset.skill, actorData.charattribut).fert,
      roleData: roleData,
      object: this.object,
      type: "Skill",
    };
    DSMechanics.modRolls(inputData);
  }

  async _customRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const actorData = this.object.data.data;
    const dataset = element.dataset;

    let dynattr = actorData.customroll.dice;
    let dynskill = actorData.customroll.bonus;
    let roleData = { attribute: "", skill: "" };

    let preCreatedInput = this.createInputData(event);
    let inputData = {
      ...preCreatedInput,
      dynattr: dynattr,
      dynskill: dynskill,
      roleData: roleData,
      type: "Custom",
    };

    DSMechanics._resolveDice(inputData, event);
  }

  async _unarmedCombat(event) {
    event.preventDefault();
    const actorData = this.object.data.data;

    if (this.object.data.type === "Charakter") {
      var dynattr = actorData.charattribut.Geschick.attribut;
      var dynskill = actorData.charattribut.Geschick.skill.Kampftechnik;
      var roleData = { attribute: "Geschick", skill: "Kampftechnik" };
    }
    if (this.object.data.type === "Nebencharakter") {
      var dynattr = actorData.charattribut.Kampf.attribut;
      var dynskill = actorData.charattribut.Kampf.skill.Angriff;
      var roleData = { attribute: "Nahkampf", skill: "Kampftechnik" };
    }

    let preCreatedInput = this.createInputData(event);
    let inputData = {
      ...preCreatedInput,
      dynattr: dynattr,
      dynskill: dynskill,
      roleData: roleData,
      type: "Unarmed",
    };

    DSMechanics.modRolls(inputData);
  }
  async _directRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    let dynattr = parseInt(dataset.dice);
    let dynskill = parseInt(dataset.bonus);
    var roleData = { attribute: dataset.attr, skill: dataset.rollname };

    let preCreatedInput = this.createInputData(event);
    let inputData = {
      ...preCreatedInput,
      dynattr: dynattr,
      dynskill: dynskill,
      roleData: roleData,
      type: "Custom",
    };

    DSMechanics.modRolls(inputData);
  }

  // ----------------------- //
  // -------- ITEMS -------- //
  // ----------------------- //

  async _rollItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    const actorData = this.object.data;

    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.filter((item) => {
      return item.id === itemId;
    })[0];
    const activeItem = actorData.items.filter((f) => {
      return f.id === dataset.itemid;
    })[0];
    var skillident = activeItem.data.data.useWith; // Holt den benötigten Skill aus dem Waffenbutton
    var attrident = ""; // Legt Identifikator für Attribut an

    var roleData = { attribute: attrident, skill: skillident };
    const stat = DSMechanics.getStat(skillident, actorData.data.charattribut);

    let preCreatedInput = this.createInputData(event);

    let inputData = {
      ...preCreatedInput,
      dynattr: stat.attr,
      dynskill: stat.fert,
      roleData: roleData,
      modroll: element.dataset.modroll,
      item: item,
      type: item.type,
    };

    DSMechanics.modRolls(inputData);
  }

  _itemEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;

    let item = this.actor.items.get(itemId);

    item.sheet.render(true);
  }
  _itemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let itemInfo = this.object.data.items.filter((item) => {
      return item.id == itemId;
    })[0];

    Dialog.confirm({
      title: "Gegenstand entfernen",
      content: "Möchtest du " + itemInfo.name + " wirklich löschen?",
      yes: () => {
        ui.notifications.info("Gegenstand gelöscht");
        return this.actor.deleteEmbeddedDocuments("Item", [
          itemId,
        ]); /* <-- Wird in Foundry VTT 9.x ersetzt */
      },
      no: () => {},
      defaultYes: true,
    });
  }

  async _modRess(event) {
    let ressAttr = event.currentTarget.dataset.attr;
    let attrKey = "data.charattribut." + ressAttr + ".ress.value";
    let ressMod = 0;
    if (event.currentTarget.className.includes("decRess")) {
      ressMod = -1;
    }
    if (event.currentTarget.className.includes("incRess")) {
      ressMod = 1;
    }
    let newInc =
      this.actor.data.data.charattribut[ressAttr].ress.value + ressMod;

    this.actor.update({
      id: this.actor.id,
      [attrKey]: newInc,
    });
  }
  async _changeProp(event) {
    const actordata = this.actor.data.data;
    const element = event.currentTarget;

    const parentAttr = element.dataset.parentattr;

    // i.type === "Artifizierung"

    //const ressMod = await renderTemplate("systems/darkspace/templates/dice/dialogRessMod.html");

    // Testet welcher Property-Button gedrückt wurde //

    if (element.dataset.fieldtype === "editAttr") {
      const parentSkill = Object.keys(actordata.charattribut[parentAttr].skill);
      var parentProp = {};
      parentSkill.forEach((skill) => {
        parentProp = {
          ...parentProp,
          [skill]: this.actor.data.items.filter(
            (i) => i.data.data.skill === skill
          ),
        };
      });
      const editAttr = await renderTemplate(
        "systems/darkspace/templates/dice/dialogPropAttr.html",
        parentProp
      );
      new Dialog(
        {
          title: "Eigenschaften",
          content: editAttr,

          buttons: {
            button1: {
              label: "OK",
              callback: (html) => {
                Array.from(html.find("[type=checkbox]")).forEach((checkbox) => {
                  if (checkbox.checked == true) {
                    this.actor.deleteEmbeddedDocuments("Item", [
                      checkbox.dataset.itemId,
                    ]);
                  }
                });
              },
              icon: `<i class="fas fa-check"></i>`,
            },
          },
          close: () => {
            this.actor.update({
              id: this.actor.id,
            });
          },
        }
        //{ width: 80 }
      ).render(true);
    }
  }

  async _itemQuickEdit(event) {
    const id = $(event.currentTarget).parents(".item").attr("data-item-id");
    const target = $(event.currentTarget).attr("data-target");
    const item = duplicate(this.actor.getEmbeddedDocument("Item", id));
    let targetValue;

    if (event.target.type === "checkbox") {
      targetValue = event.target.checked;
    } else {
      targetValue = event.target.value;
    }

    setProperty(item, target, targetValue);
    this.actor.updateEmbeddedDocuments("Item", [item]);
  }

  _ressPoints(event) {
    const actorData = this.object.data.data;
    const element = event.currentTarget;

    let currentIndex = parseInt(element.dataset.index);
    let currentActive = parseInt(element.dataset.active);
    let currentAttr = element.dataset.thisattr;
    let currentAttrData = actorData.charattribut[currentAttr];
    let ValueAdress = "data.charattribut." + currentAttr + ".ress.value";

    if (currentActive === 1) {
      this.actor.update({
        id: this.actor.id,
        [ValueAdress]: currentIndex,
      });
    } else {
      this.actor.update({
        id: this.actor.id,
        [ValueAdress]: currentAttrData.ress.value + currentIndex,
      });
    }
  }
  _ressReset(event) {
    const actorData = this.object.data.data;
    const element = event.currentTarget;

    let currentAttr = element.dataset.thisattr;
    let currentAttrData = actorData.charattribut[currentAttr];
    let ValueAdress = "data.charattribut." + currentAttr + ".ress.value";

    this.actor.update({
      [ValueAdress]: currentAttrData.attribut,
    });
  }
}
