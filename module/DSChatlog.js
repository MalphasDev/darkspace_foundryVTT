import * as DSMechanics from "./DSMechanics.js";

export class DSChatlog extends ChatLog {
  get template() {
    return "systems/darkspace/templates/sidebar/chat-log.html";
  }
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".customRoll").click(this.customRoll.bind(this));
  }

  async customRoll(event) {
    event.preventDefault();
    const element = event.currentTarget

    const dicePoolInput = document.getElementsByClassName("customDicePool");
    const diceBonusInput = document.getElementsByClassName("customDiceBonus");
    const dicePool = parseInt(dicePoolInput[0].value);
    const diceBonus = parseInt(diceBonusInput[0].value);
    const inputData = {
      attr: dicePool,
      skill: diceBonus,
      attrModLocal: 0,
      fertModLocal: 0,
      eventData: element,

      rollData: {attribute: "", skill: "" },
      removehighest: element.dataset.disadv === "true",
      type: "Custom",
    };
    DSMechanics._resolveDice(inputData);
  }
}
