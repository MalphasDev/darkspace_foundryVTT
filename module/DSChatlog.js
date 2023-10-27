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
      dicepool: dicePool,
      skill: diceBonus,
      dicepoolModLocal: 0,
      skillModLocal: 0,
      eventData: element,

      rollData: {dicepool: "", skill: "" },
      removehighest: element.dataset.disadv === "true",
      type: "Custom",
    };
    DSMechanics._resolveDice(inputData);
  }
}
