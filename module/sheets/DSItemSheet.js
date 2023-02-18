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
    const itemData = super.getData();
    itemData.config = CONFIG.darkspace;
    itemData.system = this.item.system;

    return itemData;
  }

  activateListeners(html) {
    /* html.find(cssSelector).event(this._someCallBack.bind(this)); <---- Template */

    super.activateListeners(html);
    html.find(".ressPoints").click(this._ressPoints.bind(this));
    html.find(".incRess, .decRess").click(this._onModRess.bind(this));
  }

  _ressPoints(event) {
    const element = event.currentTarget;
    const itemData = this.object.system;

    const currentIndex = parseInt(element.dataset.index);
    const currentActive = parseInt(element.dataset.active);
    const ressAttr = element.dataset.thisattr;
    const ressAttrData = itemData.ress[ressAttr];
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
    const ressAttr = event.currentTarget.dataset.attr;
    const ValueAdress = "system.ress." + ressAttr;
    let ressMod = 0;
    if (event.currentTarget.className.includes("decRess")) {
      ressMod = -1;
    }
    if (event.currentTarget.className.includes("incRess")) {
      ressMod = 1;
    }
    const newInc = this.object.system.ress[ressAttr] + ressMod;

    this.object.update({
      id: this.object.id,
      [ValueAdress]: newInc,
    });
  }
}
