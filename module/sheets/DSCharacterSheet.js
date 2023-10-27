import { darkspace } from "../config.js";
import * as DSMechanics from "../DSMechanics.js";
import {
  getProps,
  getHandicaps,
  getTechProps,
  getTechhandicaps,
  getCombatProps,
  getCombatHandicaps,
  edit as propEdit,
} from "../DSprops.js";

export class DSCharacterSheet extends ActorSheet {
  get template() {
    return `systems/darkspace/templates/sheets/actors/${this.object.type}-sheet.html`;
  }
  chatTemplate = {
    Skill: "systems/darkspace/templates/dice/chatSkill.html",
    Custom: "systems/darkspace/templates/dice/chatCustom.html",
    Item: "systems/darkspace/templates/dice/chatItem.html",
    Waffe: "systems/darkspace/templates/dice/chatWeapon.html",
    Artifizierung: "systems/darkspace/templates/dice/chatCybernetics.html",
  };

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template:
        "systems/darkspace/templates/sheets/actors/Character-sheet.html",
      classes: ["darkspace", "sheet", "Charakter"],
      width: 900,
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
    console.log("Starte getData()");
    let weapons = {};
    let armor = {};
    let utilities = {};
    let cybernetics = {};
    let drone = {};
    let terminals = {};

    actorData.items.forEach((item, i) => {
      switch (item.type) {
        case "Schusswaffe":
        case "Nahkampfwaffe":
          weapons = { ...weapons, [Object.entries(weapons).length]: item };
          break;
        case "Terminals":
          terminals = {
            ...terminals,
            [Object.entries(terminals).length]: item,
          };
          break;
        case "Panzerung":
          armor = { ...armor, [Object.entries(armor).length]: item };
          break;
        case "Werkzeug":
        case "Medkit":
        case "Gegenstand":
          utilities = {
            ...utilities,
            [Object.entries(utilities).length]: item,
          };
          break;
        case "Artifizierung":
          cybernetics = {
            ...cybernetics,
            [Object.entries(cybernetics).length]: item,
          };
          break;
        case "Drohne":
          drone = { ...drone, [Object.entries(drone).length]: item };
          break;

        default:
          break;
      }
    });

    context.items = {
      weapons: weapons,
      armor: armor,
      utilities: utilities,
      cybernetics: cybernetics,
      drone: drone,
      terminals: terminals,
    };

    context.system = actorData.system;
    context.flags = actorData.flags;
    context.config = darkspace;
    context.debugModeOn = game.settings.get("darkspace", "debugmode");

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
      ".rollCustom",
      ".rollItem",
      ".inlineItemEdit",
      ".addProp",
      ".addPropTemplate",
      ".deleteProp",
      ".propEdit",
      ".showtodialog",
      ".spendbot",
      ".counter",
      ".renderapp",
      ".decdicepool",
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
    let handler = (ev) => this._onDragStart(ev);
    // Find all items on the character sheet.
    html.find("li.item").each((i, li) => {
      // Ignore for the header row.
      if (li.classList.contains("item-header")) return;
      // Add draggable dicepool and dragstart listener.
      li.setAttribute("draggable", true);
      li.addEventListener("dragstart", handler, false);
    });
  }

  objValueFromString(context, string) {

    var path = string;
    var pathArray = path.split(".");
    var value = context;

    for (var i = 0; i < pathArray.length; i++) {
      if (value[pathArray[i]] !== undefined) {
        value = value[pathArray[i]];
      } else {
        value = null;
        break;
      }
    }
    return value;
  }

  createInputData(event, option) {
    event.preventDefault();
    !option ? (option = {}) : option;
    const element = option.rightClick ? event.target : event.currentTarget;
    const system = this.object.system;
    const dataset = element.dataset;

    let dicepoolVal 
    if (this.object.type != "Nebencharakter") {
      dicepoolVal = DSMechanics.getStat(dataset.skill, system.stats).dicepoolName
    } else {
      dicepoolVal = system.comptence
    }



    const inputData = {
      eventData: element,
      actorId: this.actor.id,
      rollname: dataset.rollname,
      rollData: {
        dicepoolVal: dicepoolVal,
        skillName: dataset.skill,
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
  async _rollCustom(event, option) {
    event.preventDefault();

    !option ? (option = {}) : option;
    const element = option.rightClick ? event.target : event.currentTarget;
    const system = this.object.system;
    const dataset = element.dataset;

    let dicepool
    let bonus

    if (isNaN(parseInt(dataset.dicepool))) {
      dicepool = this.objValueFromString(this.object,dataset.dicepool)
    } else {
      dicepool= parseInt(dataset.dicepool)
    }
    if (isNaN(parseInt(dataset.dicepool))) {
      bonus = this.objValueFromString(this.object,dataset.bonus)
    } else {
      bonus= parseInt(dataset.bonus)
    }

    const inputData = {
      type: "Custom",
      eventData: element,
      actorId: this.actor.id,
      rollname: dataset.rollname,
      rollData: {
        dicepool: dicepool,
        skill: bonus,
        rollname: dataset.rollname,
      },
      removehighest: element.className.includes("disadv"),
      modroll: option.rightClick,
      object: this.object,
    };
    

    DSMechanics.modRolls(inputData);
  }

  async _rollItem(event, option) {
    event.preventDefault();
    !option ? (option = {}) : option;
    const element = option.rightClick ? event.target : event.currentTarget;
    const dataset = element.dataset;

    const system = this.object.system;
    const item = this.actor.items.filter((item) => {
      return item.id === dataset.itemId;
    })[0];

    let usedSkill;

    if (dataset.ua === "true") {
      usedSkill = "Präzision";
    } else {
      usedSkill = item.system.useWith;
    }

    const stat = DSMechanics.getStat(usedSkill, system.stats);

    const preCreatedInput = this.createInputData(event, option);
    const inputData = {
      ...preCreatedInput,
      rollData: {
        dicepool: stat.dicepoolName,
        skill: stat.skillName,
      },
      modroll: option.rightClick,
      item: item,
      type: item ? item.type : "Nahkampfwaffe",
      system: system,
    };
    DSMechanics.modRolls(inputData);
  }

  // ----------------------- //
  // -------- ITEMS -------- //
  // ----------------------- //

  _itemEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemid = element.dataset.itemId;
    const item = this.object.items.filter((item) => {
      return item.id === itemid;
    })[0];

    item.sheet.render(true);
  }
  _itemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemid = element.dataset.itemId;
    const item = this.object.items.filter((item) => {
      return item.id === itemid;
    })[0];
    Dialog.confirm({
      title: "Gegenstand entfernen",
      content: "Möchtest du " + item.name + " wirklich löschen?",
      yes: () => {
        ui.notifications.info("Gegenstand gelöscht");
        return this.actor.deleteEmbeddedDocuments("Item", [itemid]);
      },
      no: () => {},
      defaultYes: true,
    });
  }

  async _modRess(event) {
    const ress = event.currentTarget.dataset.ress;
    const targetClass = event.currentTarget.className;
    const dicepoolKey = "system.ressources." + ress;

    let ressMod = targetClass.includes("decRess")
      ? -1
      : targetClass.includes("incRess")
      ? 1
      : 0;

    this.actor.update({
      id: this.actor.id,
      [dicepoolKey]: this.actor.system.ressources[ress] + ressMod,
    });
  }

  async _itemQuickEdit(event) {
    const id = $(event.currentTarget).parents(".item").dicepool("data-itemid");
    const target = $(event.currentTarget).dicepool("data-target");
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

  _inlineItemEdit(event) {
    const element = event.currentTarget;
    const itemList = this.object.items;
    const itemid = element.dataset.itemId;
    const itemstat = element.dataset.itemstat;

    const item = itemList.filter((i) => {
      return i._id === itemid;
    })[0];

    item.update({
      _id: itemid,
      [itemstat]: element.checked,
    });
  }
  async _addProp(event, template) {
    const system = this.object.system;

    // Aktuelle Liste der Eigenschaften
    const props = system.props;
    // Neue Slotbezeichnung
    const slot = "slot" + Object.keys(props).length;

    let newProp;

    // Checken, ob ein Eigenschaften-Template vorliegt.
    if (template) {
      if (template.handicap === "true") {
        template.handicap = true;
      }

      newProp = {
        ...props,
        [slot]: template,
      };
    } else {
      newProp = {
        ...props,
        [slot]: {
          prop: "Neue Eigenschaft",
          skill: "Automation",
          desc: "Regeln",
          handicap: false,
        },
      };
    }

    await this.object.update({
      id: this.actor.id,
      "system.props": newProp,
    });
  }
  async _addPropTemplate(event) {
    const propData = {
      templates: getProps().concat(getHandicaps()),
      config: darkspace,
    };
    switch (this.actor.type) {
      case "Charakter":
        propData.skillListType = "skillList";
        break;
      case "Nebencharakter":
        propData.skillListType = "skillListNpc";
        break;
      case "Maschine":
        propData.skillListType = "skillListVehicle";
        propData.templatesTech = getTechProps().concat(getTechhandicaps());
        propData.itemProp = true;
        break;
      case "KI":
        propData.skillListType = "skillListAi";
        break;

      default:
        break;
    }
    propData.propEditTemplate = await renderTemplate(
      "systems/darkspace/templates/dice/addPropTemplate.html",
      propData
    );

    new Dialog({
      title: "Eigenschaft aus Datenbank hinzufügen",
      content: propData.propEditTemplate,
      buttons: {
        save: {
          icon: '<i class="fas fa-save"></i>',
          label: "Speichern",
          callback: (html) => {
            let fullList = propData.templates;
            if (this.actor.type === "Maschine") {
              fullList = propData.templates.concat(propData.templatesTech);
            }
            const prop = fullList.filter((p) => {
              return p.prop === html.find("[name='propTemplate']")[0].value;
            })[0];
            const skill =
              typeof html.find("[name='propTemplateSkill']")[0] !== "undefined"
                ? html.find("[name='propTemplateSkill']")[0].value
                : undefined;

            const template = {
              ...prop,
              skill: skill,
            };
            this._addProp(event, template);
          },
        },

        abort: {
          icon: '<i class="fas fa-times"></i>',
          label: "Abbrechen",
          callback: () => {},
        },
      },
      default: "save",
    }).render(true);
  }
  async _propEdit(event) {
    const propData = propEdit(event, this);
    propData.charakterProp = true;

    propData.propEditTemplate = await renderTemplate(
      "systems/darkspace/templates/dice/dialogEditProp.html",
      propData
    );

    new Dialog({
      title: "Eigenschaft editieren",
      content: propData.propEditTemplate,
      buttons: {
        save: {
          icon: '<i class="fas fa-save"></i>',
          label: "Speichern",
          callback: (html) => {
            const propAdresse = "system.props." + propData.slot;

            const handicapAdresse = propAdresse + ".handicap";
            const descAdresse = propAdresse + ".desc";
            const propNameAdresse = propAdresse + ".prop";
            const propSkillAdresse = propAdresse + ".skill";

            const newHandicapStatus = html.find(".handicapCheck")[0].checked;
            const newDesc = html.find(".propRules")[0].value;
            const propName = html.find(".propName")[0].value;
            const skill = html.find(".skill")[0].value;

            this.object.update({
              id: this.object.id,
              [descAdresse]: newDesc.toString(),
              [handicapAdresse]: newHandicapStatus,
              [propNameAdresse]: propName,
              [propSkillAdresse]: skill,
            });
          },
        },

        abort: {
          icon: '<i class="fas fa-times"></i>',
          label: "Abbrechen",
          callback: () => {},
        },
      },
      default: "save",
    }).render(true);
  }

  async _deleteProp(event) {
    const element = event.currentTarget;
    const system = this.object.system;
    const dataset = element.dataset;
    const slotIdent = "slot" + dataset.index;

    delete system.props[slotIdent];

    let newProp = {};

    Object.values(system.props).forEach((slot, i) => {
      newProp = {
        ...newProp,
        ["slot" + i]: slot,
      };
    });

    Dialog.confirm({
      title: "Eigenschaft entfernen",
      content: "Möchtest du diese Eigenschaft wirklich löschen?",
      yes: async () => {
        ui.notifications.info("Gegenstand gelöscht");
        await this.object.update({
          id: this.object.id,
          "system.props": "",
        });
        await this.object.update({
          id: this.object.id,
          "system.props": newProp,
        });
      },
      no: () => {},
      defaultYes: true,
    });
  }
  async _showtodialog(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Erwarte "title" und "content" im dataset
    const cyberwarePropsDataset = Array.from(
      element.getElementsByClassName("cyberprops")
    ).map((p) => {
      return p.dataset;
    });

    const messageData = { ...dataset, cyberwareProp: {} };

    cyberwarePropsDataset.forEach((cyberProp) => {
      messageData.cyberwareProp[cyberProp.title] = cyberProp.content;
    });

    const showContent = await renderTemplate(
      "systems/darkspace/templates/dice/showContent.html",
      messageData
    );

    new Dialog({
      title: "Regeln für ",
      content: showContent,
      buttons: {
        save: {
          icon: '<i class="fa-regular fa-comment"></i>',
          label: "Chat",
          callback: () => {
            return ChatMessage.create({ content: showContent });
          },
        },
        abort: {
          icon: '<i class="fas fa-times"></i>',
          label: "Schließen",
          callback: () => {},
        },
      },
      default: "abort",
    }).render(true);
  }
  async _spendbot(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = this.actor;
    const item = actor.items.get(dataset.itemId);

    if (dataset.regen == "true") {
      if (item.system.ress.bots.value < item.system.ress.bots.max) {
        await item.update({
          "system.ress.bots.value": item.system.ress.bots.value + 1,
        });
        return;
      } else {
        ui.notifications.warn("Maximale Bots.");
        return;
      }
    }

    if (item.system.ress.bots.value > 0) {
      await item.update({
        "system.ress.bots.value": item.system.ress.bots.value - 1,
      });
    } else {
      ui.notifications.warn("Keine Bots verfügbar.");
    }
  }
  async _counter(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = this.actor;
    const address = dataset.address;
    const addressVal = this.objValueFromString(actor, address);
    let newVal;

    switch (dataset.set) {
      case "zero":
        newVal = 0;
        break;
      case "minus":
        if (addressVal === 0) {break}
        newVal = addressVal - 1;
        break;
      case "plus":
        newVal = addressVal + 1;
        break;
      case "full":
        if(addressVal === parseInt(dataset.index)) {newVal = parseInt(dataset.index) - 1; break}
        newVal = parseInt(dataset.index);
        break;
      case "part":
        newVal = addressVal - parseInt(dataset.index);
        break;
      case "false":
        newVal = addressVal + parseInt(dataset.index);
        break;

      default:
        break;
    }

    actor.update({
      [address]: newVal,
    });
  }
  async _renderapp(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const itemId = dataset.itemId;
    const actorid = dataset.actorid;

    const document = await game.actors.get(actorid);
    const sheet = document.sheet;
    if (sheet._minimized) return sheet.maximize();
    else return sheet.render(true);
  }
  _decdicepool(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = this.actor;
    const dicepool = actor.system.stats;
    const currentAttrModAdress = "system.stats." + dataset.dicepool + ".dicepoolmaxmod";
    const currentAttrMod = dicepool[dataset.dicepool].dicepoolmaxmod;

    new Dialog({
      title: "Entstellungen",
      buttons: {
        disfigurement: {
          icon: '<i class="fa-solid fa-user-injured"></i>',
          callback: () => {
            actor.update({
              [currentAttrModAdress]: currentAttrMod - 1,
            });
          },
        },
        regain: {
          icon: '<i class="fa-solid fa-notes-medical"></i>',
          callback: () => {
            actor.update({
              [currentAttrModAdress]: currentAttrMod + 1,
            });
          },
        },
        abort: {
          icon: '<i class="fas fa-times"></i>',
          callback: () => {},
        },
      },
      default: "abort",
    }).render(true);
  }

  _onDropItem(event, data) {

    // Diese Funktion weiter ausbauen, damit Fertigkeiten automatisch erkannt und zugeteilt werden.
    // Problem: Fertigkeit wird zwar richtig erkannt, aber muss noch in die Item-Instanz kopiert werden.

    super._onDropItem(event, data);
    const itemId = data.uuid.split(".")[1]
    const useWith = game.items.get(itemId).system.useWith
    
    const actor = this.actor;
    const stats = actor.system.stats;

    const statMap = Object.entries(stats);

    const items = actor.items
    const itemList = items.map((itemlist) => {return itemlist})


    // for (let index = 0; index < statMap.length; index++) {
    //   const skill = Object.entries(statMap[index][1].skill)
    //   for (let index = 0; index < skill.length; index++) {
    //     const skillname = skill[index][0];
    //     useWith.forEach(element => {
    //       if (element === skillname) {
    //         // Hier muss irgendwie in Item Instanz geschrieben werden.
    //         primaryUseWith = element;
    //         return
    //       }
    //     });
    //   }

      // game.items.get(itemId).update({
      //   "system.useWith": primaryUseWith
      // })
      
      // console.log(skill.hasOwnProperty(useWith));
    //}

    



  }
}
