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

export class DSItemSheet extends ItemSheet {
  get template() {
    if (this.object.type === "Drohne") {
      // Hier sollte vielleicht irgendwann eine clevere Lösung her?
      return `systems/darkspace/templates/sheets/items/drone-sheet.html`;
    }

    return `systems/darkspace/templates/sheets/items/${
      this.object.system.weapon ? "weapon" : "item"
    }-sheet.html`;
  }
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["darkspace", "sheet", "item"],
      width: 640,
      height: 570,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
    });
  }

  getData() {
    const system = super.getData();
    system.config = darkspace;
    system.system = this.item.system;

    return system;
  }

  activateListeners(html) {
    /* html.find(cssSelector).event(this._someCallBack.bind(this)); <---- Template */

    super.activateListeners(html);
    html.find(".incRess, .decRess").click(this._onModRess.bind(this));

    const classIdent = [
      ".ressPoints",
      ".addProp",
      ".deleteProp",
      ".propEdit",
      ".addPropTemplate",
      ".showtodialog",
      ".renderApp",
    ];

    classIdent.forEach((ident) => {
      eval(
        `html.find("${ident}").click(this.${
          "_" + ident.substring(1)
        }.bind(this))`
      );
    });
  }

  _ressPoints(event) {
    const element = event.currentTarget;
    const system = this.object.system;

    const currentIndex = parseInt(element.dataset.index);
    const currentActive = parseInt(element.dataset.active);
    const ressAttr = element.dataset.thisattr;
    const ressAttrData = system.ress[ressAttr];
    const ValueAdress = "system.ress." + ressAttr;

    if (currentActive === 1) {
      this.object.update({
        id: this.object.id,
        [ValueAdress]: currentIndex,
      });
    } else {
      this.object.update({
        id: this.object.id,
        [ValueAdress]: ressAttrData + currentIndex,
      });
    }
  }
  async _onModRess(event) {
    let ressAttr = event.currentTarget.dataset.attr;
    const ValueAdress = "system.ress." + ressAttr;

    const arr = ("object.system.ress." + ressAttr).split(".");
    let stat = this;
    while (arr.length) {
      stat = stat[arr.shift()];
    }

    let ressMod = 0;
    if (event.currentTarget.className.includes("decRess")) {
      ressMod = -1;
    }
    if (event.currentTarget.className.includes("incRess")) {
      ressMod = 1;
    }
    const adressArray = ressAttr.split(".");

    if (typeof stat === "number") {
      this.object.update({
        id: this.object.id,
        [ValueAdress]:
          stat + ressMod < 0
            ? 0
            : stat + ressMod > this.object.system.ress[adressArray[0]].max
            ? this.object.system.ress[adressArray[0]].max
            : stat + ressMod,
      });
    }
  }
  async _addProp(event, template) {
    const system = this.object.system;

    const nextKey = Object.keys(system.props).length;

    if (nextKey + 1 > system.mk) {
      ui.notifications.warn(
        "Die Anzahl der Eigenschaften darf nicht höher sein, als die Modulklasse (MK)"
      );
      return;
    }

    let propTemplate = template;
    if (!template) {
      propTemplate = {
        prop: "Neue Eigenschaft",
        skill: "Automation",
        desc: "Regeln",
        action: "Neue Aktion",
        handicap: false,
      };
    }

    const slot = "slot" + nextKey;

    const newActions = {
      ...system.props,
      [slot]: propTemplate,
    };

    await this.object.update({
      id: this.object.id,
      "system.props": newActions,
    });
  }
  async _addPropTemplate(event) {
    const propData = {
      templates: getProps().concat(getHandicaps()),
      templatesTech: getTechProps().concat(getTechhandicaps()),
      templatesCombat: getCombatProps().concat(getCombatHandicaps()),
      config: darkspace,
      itemProp: true,
      combatProp:
        this.object.type === "Schusswaffe" ||
        this.object.type === "Nahkampfwaffe",
    };

    if (!!this.actor) {
      switch (this.actor.type) {
        case "Charakter":
          propData.skillListType = "skillList";
          break;
        case "Nebencharakter":
          propData.skillListType = "skillListNpc";
          break;
        case "DrohneFahrzeug":
          propData.skillListType = "skillListVehicle";
          break;
        case "KI":
          propData.skillListType = "skillListAi";
          break;

        default:
          break;
      }
    } else {
      propData.skillListType = false;
    }

    propData.propEditTemplate = await renderTemplate(
      "systems/darkspace/templates/dice/addPropTemplate.html",
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
            const prop =
              propData.templates[html.find("[name='propTemplate']")[0].value];
            const skill = html.find("[name='propTemplateSkill']")[0].value;
            const action = html.find("[name='propAction']")[0].value;
            const template = {
              ...prop,
              skill: skill,
              action: action,
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
    propData.charakterProp = false;
    if (this.actor != null) {
      propData.ownertype = this.actor.type;
    }
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
            const actionNameAdresse = propAdresse + ".action";
            const propSkillAdresse = propAdresse + ".skill";

            const newHandicapStatus = html.find(".handicapCheck")[0].checked;
            const newDesc = html.find(".propRules")[0].value;
            const propName = html.find(".propName")[0].value;
            const skill = html.find(".skill")[0].value;
            const actionName = html.find(".actionName")[0].value;

            this.object.update({
              id: this.object.id,
              [descAdresse]: newDesc.toString(),
              [handicapAdresse]: newHandicapStatus,
              [propNameAdresse]: propName,
              [actionNameAdresse]: actionName,
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

    let newActions = {};

    Object.values(system.props).forEach((slot, i) => {
      newActions = {
        ...newActions,
        ["slot" + i]: slot,
      };
    });

    await this.object.update({
      id: this.object.id,
      "system.props": "",
    });
    await this.object.update({
      id: this.object.id,
      "system.props": newActions,
    });
  }
  async _showtodialog(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Erwarte "title" und "content" im dataset

    const showContent = await renderTemplate(
      "systems/darkspace/templates/dice/showContent.html",
      dataset
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
  async _renderApp(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actorId = dataset.actorid;

    const document = await game.actors.get(actorId);
    const sheet = document.sheet;
    this.close();
    if (sheet._minimized) return sheet.maximize();
    else return sheet.render(true);
  }
}
