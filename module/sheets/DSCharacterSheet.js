import { darkspace } from "../config.js";
import * as DSMechanics from "../DSMechanics.js";

export class DSCharacterSheet extends ActorSheet {
  get template() {
    return `systems/darkspace/templates/sheets/actors/${this.object.type}-sheet.html`;
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
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    // Zusammenstellen aller Gegenstände für die EACH Schleifen auf dem Charakterbogen.

    let itemType = Array.from(
      context.items.map((i) => {
        return i.type;
      })
    );
    let inventory = {};
    itemType.forEach((itemType) => {
      inventory[itemType] = context.items.filter((item) => {
        return item.type == itemType;
      });
    });
    context.items = inventory;

    context.system = actorData.system;
    context.flags = actorData.flags;

    return context;
  }

  activateListeners(html) {
    /* html.find(cssSelector).event(this._someCallBack.bind(this)); <---- Template */

    super.activateListeners(html);

    html.find(".incRess, .decRess").click(this._modRess.bind(this));

    // Find and Bind

    const classIdent = [
      ".itemEdit",
      ".itemDelete",
      ".rollSkill",
      ".rollItem",
      ".ressPoints",
      ".ressReset",
      ".inlineItemEdit",
    ];
    window.oncontextmenu = (e) => {
      e.preventDefault();
      if (e.target.className.includes("rollSkill")) {
        this._rollSkill(e, { rightClick: true });
      }
      if (e.target.className.includes("rollItem")) {
        this._rollItem(e, { rightClick: true });
      }
    };
    classIdent.forEach((ident) => {
      eval(
        `html.find("${ident}").click(this.${
          "_" + ident.substring(1)
        }.bind(this))`
      );
    });
    /* A drag and drop function. */
    if (this.actor.owner) {
      /**
       * When the user starts dragging, call the _onDragStart function.
       * @param ev - The event object
       */
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

  createInputData(event, option) {
    event.preventDefault();
    !option ? (option = {}) : option;
    const element = option.rightClick ? event.target : event.currentTarget;
    const actorData = this.object.system;
    const dataset = element.dataset;

    const inputData = {
      eventData: element,
      actorId: this.actor.id,
      dynattr: DSMechanics.getStat(dataset.skill, actorData.charattribut).attr,
      dynskill: DSMechanics.getStat(dataset.skill, actorData.charattribut).fert,
      actorData: this.object.system,
      rollname: dataset.rollname,
      roleData: {
        attribute: DSMechanics.getStat(dataset.skill, actorData.charattribut)
          .attrName,
        skill: DSMechanics.getStat(dataset.skill, actorData.charattribut)
          .fertName,
        rollname: false,
      },
      removehighest: element.className.includes("disadv"),
      modroll: option.rightClick,
      object: this.object,
    };

    return inputData;
  }

  async _rollSkill(event, option) {
    event.preventDefault();
    const preCreatedInput = this.createInputData(event, option);

    const inputData = {
      ...preCreatedInput,
      type: "Skill",
    };
    DSMechanics.modRolls(inputData);
  }

  async _rollItem(event, option) {
    event.preventDefault();
    !option ? (option = {}) : option;
    const element = option.rightClick ? event.target : event.currentTarget;
    const dataset = element.dataset;
    const actorData = this.object.system;
    const item = this.actor.items.filter((item) => {
      return item.id === dataset.itemid;
    })[0];

    const stat = DSMechanics.getStat(
      item.system.useWith,
      actorData.charattribut
    );

    const preCreatedInput = this.createInputData(event, option);
    const inputData = {
      ...preCreatedInput,
      dynattr: stat.attr,
      dynskill: stat.fert,
      roleData: { attribute: stat.attrName, skill: stat.fertName },
      modroll: option.rightClick,
      item: item,
      type: item.type,
    };

    DSMechanics.modRolls(inputData);
  }

  // ----------------------- //
  // -------- ITEMS -------- //
  // ----------------------- //

  _itemEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.dataset.itemId;
    const item = this.object.items.filter((item) => {
      return item.id === itemId;
    })[0];

    item.sheet.render(true);
  }
  _itemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.dataset.itemId;
    const item = this.object.items.filter((item) => {
      return item.id === itemId;
    })[0];

    Dialog.confirm({
      title: "Gegenstand entfernen",
      content: "Möchtest du " + item.name + " wirklich löschen?",
      yes: () => {
        ui.notifications.info("Gegenstand gelöscht");
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      },
      no: () => {},
      defaultYes: true,
    });
  }

  async _modRess(event) {
    let ressAttr = event.currentTarget.dataset.attr;
    let attrKey = "system.charattribut." + ressAttr + ".ress.value";
    let ressMod = 0;
    if (event.currentTarget.className.includes("decRess")) {
      ressMod = -1;
    }
    if (event.currentTarget.className.includes("incRess")) {
      ressMod = 1;
    }

    let newInc = this.actor.system.charattribut[ressAttr].ress.value + ressMod;

    this.actor.update({
      id: this.actor.id,
      [attrKey]: newInc,
    });
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
    const actorData = this.object.system;
    const element = event.currentTarget;

    let currentIndex = parseInt(element.dataset.index);
    let currentActive = parseInt(element.dataset.active);
    let currentAttr = element.dataset.thisattr;
    let currentAttrData = actorData.charattribut[currentAttr];
    let ValueAdress = "system.charattribut." + currentAttr + ".ress.value";

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
    const actorData = this.object.system;
    const element = event.currentTarget;

    let currentAttr = element.dataset.thisattr;
    let currentAttrData = actorData.charattribut[currentAttr];
    let ValueAdress = "system.charattribut." + currentAttr + ".ress.value";

    this.actor.update({
      [ValueAdress]: currentAttrData.attribut,
    });
  }
  _inlineItemEdit(event) {
    const element = event.currentTarget;
    const itemList = this.object.items;
    const itemid = element.dataset.itemid;
    const itemstat = element.dataset.itemstat;

    const item = itemList.filter((i) => {
      return i._id === itemid;
    })[0];

    item.update({
      _id: itemid,
      [itemstat]: element.checked,
    });
  }
}
