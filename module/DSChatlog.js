import * as DSMechanics from "./DSMechanics.js";

export default class DSChatlog extends ChatLog {
  get template() {
    return "systems/darkspace/templates/sidebar/chat-log.html";
  }
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".customRoll").click(this.customRoll.bind(this));
  }

  async customRoll(event) {
    event.preventDefault();

    const dicePoolInput = document.getElementsByClassName("customDicePool");
    const diceBonusInput = document.getElementsByClassName("customDiceBonus");
    const dicePool = parseInt(dicePoolInput[0].value);
    const diceBonus = parseInt(diceBonusInput[0].value);
    const inputData = {
      dynattr: dicePool,
      dynskill: diceBonus,
      attrModLocal: 0,
      fertModLocal: 0,
      roleData: { attribute: "", skill: "" },
      removehighest: event.currentTarget.dataset.disadv === "true",
      type: "Custom",
    };
    DSMechanics._resolveDice(inputData);
  }
}
