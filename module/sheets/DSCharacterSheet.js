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
      ".ressPoints",
      ".ressReset",
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
      console.log("Start Class Ident");
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
    const actorData = this.object.data.data;
    const dataset = element.dataset;

    console.log(dataset.context);

    console.log(this[dataset.context]);

    const inputData = {
      eventData: element,
      actorId: this.actor.id,
      dynattr: DSMechanics.getStat(dataset.skill, actorData.charattribut).attr,
      dynskill: DSMechanics.getStat(dataset.skill, actorData.charattribut).fert,
      actorData: actorData,
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
    const actorData = this.object.data;
    const item = this.actor.items.filter((item) => {
      return item.id === dataset.itemid;
    })[0];

    const stat = DSMechanics.getStat(
      item.data.data.useWith,
      actorData.data.charattribut
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
