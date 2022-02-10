import * as DSMechanics from "../DSMechanics.js";
export default class DSItemSheet extends ItemSheet {
  get template() {
    return `systems/darkspace/templates/sheets/items/${this.item.data.type}-sheet.html`;
  }
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["darkspace", "sheet", "item"],
      width: 520,
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
    const data = super.getData();
    data.config = CONFIG.darkspace;

    return data;
  }

  activateListeners(html) {
    /* html.find(cssSelector).event(this._someCallBack.bind(this)); <---- Template */

    super.activateListeners(html);
    //html.find(".itemToChat").click(this._itemToChat.bind(this));
    //html.find(".rollItem").click(this._onRollItem.bind(this));
    html.find(".directRoll").click(this._onDirectRoll.bind(this));
    html.find(".ressPoints").click(this._ressPoints.bind(this));
    html.find(".incRess, .decRess").click(this._onModRess.bind(this));
    html.find(".addProp").click(this._addProperty.bind(this));
  }

  createInputData(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemData = this.object.data.data;

    let inputData = {
      eventData: element,
      itemId: this.object._id,
      itemrData: itemData,
      removehighest: element.className.includes("disadv"),
    };
    return inputData;
  }

  async _onDirectRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    let dynattr = parseInt(dataset.dice);
    let dynskill = parseInt(dataset.bonus);

    var roleData = { attribute: "", skill: dataset.rollname };

    let preCreatedInput = this.createInputData(event);
    let inputData = {
      ...preCreatedInput,
      dynattr: dynattr,
      dynskill: dynskill,
      roleData: roleData,
    };

    DSMechanics.modRolls(inputData, event);
  }

  _ressPoints(event) {
    const element = event.currentTarget;
    const itemData = this.object.data.data;

    let currentIndex = parseInt(element.dataset.index);
    let currentActive = parseInt(element.dataset.active);
    let currentAttr = element.dataset.thisattr;
    let currentAttrData = itemData.ress[currentAttr];
    let ValueAdress = "data.ress." + currentAttr;

    if (currentActive === 1) {
      this.object.update({
        id: this.object._id,
        [ValueAdress]: currentIndex,
      });
    } else {
      this.object.update({
        id: this.object._id,
        [ValueAdress]: currentAttrData + currentIndex,
      });
    }
  }
  async _onModRess(event) {
    let ressAttr = event.currentTarget.dataset.attr;
    let attrKey = "data.ress." + ressAttr;
    let ressMod = 0;
    if (event.currentTarget.className.includes("decRess")) {
      ressMod = -1;
    }
    if (event.currentTarget.className.includes("incRess")) {
      ressMod = 1;
    }
    let newInc = this.object.data.data.ress[ressAttr] + ressMod;

    this.object.update({
      id: this.object.id,
      [attrKey]: newInc,
    });
  }
  async _addProperty(event) {
    var content = await renderTemplate(
      "systems/darkspace/templates/createNewItem/dialogAddProp.html",
      this.object.data.data
    );
    new Dialog({
      title: "Eigenschaften hinzufügen",
      content: content,
      buttons: {
        ok: {
          icon: '<i class="fas fa-check"></i>',
          label: "OK",
          callback: (html) => {
            let propList = html.find(".propList")[0].value.replace(/\s/g, "");
            this.object.update({
              "data.properties": propList,
            });
          },
        },
      },
    }).render(true);
  }
}
