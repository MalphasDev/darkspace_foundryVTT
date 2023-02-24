import * as DSMechanics from "../DSMechanics.js";
export class DSItemSheet extends ItemSheet {
  get template() {
    return `systems/darkspace/templates/sheets/items/${this.object.type}-sheet.html`;
  }
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["darkspace", "sheet", "item"],
      width: 320,
      height: 480,
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
    system.config = CONFIG.darkspace;
    system.system = this.item.system;

    return system;
  }

  activateListeners(html) {
    /* html.find(cssSelector).event(this._someCallBack.bind(this)); <---- Template */

    super.activateListeners(html);
    html.find(".incRess, .decRess").click(this._onModRess.bind(this));

    const classIdent = [".ressPoints", ".addProp", ".deleteProp"];

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

    if (typeof stat === "number") {
      this.object.update({
        id: this.object.id,
        [ValueAdress]: stat + ressMod,
      });
    }
  }
  async _addProp() {
    const system = this.object.system;

    const nextKey = Object.keys(system.useWith).length;

    const slot = "slot" + nextKey;

    const newActions = {
      ...system.useWith,
      [slot]: {
        prop: "Neue Eigenschaft",
        skill: "Automatismus",
        action: "Neue Aktion",
      },
    };

    await this.object.update({
      id: this.object.id,
      "system.useWith": newActions,
    });
  }
  async _deleteProp(event) {
    const element = event.currentTarget;
    const system = this.object.system;
    const dataset = element.dataset;
    console.log(dataset.index, system.useWith);
    const slotIdent = "slot" + dataset.index;

    delete system.useWith[slotIdent];

    let newActions = {};

    Object.values(system.useWith).forEach((slot, i) => {
      newActions = {
        ...newActions,
        ["slot" + i]: slot,
      };
    });

    await this.object.update({
      id: this.object.id,
      "system.useWith": "",
    });
    await this.object.update({
      id: this.object.id,
      "system.useWith": newActions,
    });
  }
}
