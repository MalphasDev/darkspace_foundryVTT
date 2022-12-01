export default class DSCustomDice extends ChatLog {
  get template() {
    return "systems/darkspace/templates/sidebar/chat-log.html";
  }
  getData() {
    super.getData();
  }
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".customRoll").click(this.customRoll.bind(this));
  }

  async customRoll(event) {
    const diceBtn = event.currentTarget;
    const dicePoolInput = document.getElementsByClassName("customDicePool");
    const diceBonusInput = document.getElementsByClassName("customDiceBonus");
    const dicePool = parseInt(dicePoolInput[0].value);
    const diceBonus = parseInt(diceBonusInput[0].value);

    let rollformular = "";
    let removehighest = false;

    if (diceBtn.dataset.disadv === "false") {
      rollformular = dicePool + "d10x10kh2+" + diceBonus;
    } else if (diceBtn.dataset.disadv === "true") {
      rollformular = dicePool + "d10x10kh3dh1+" + diceBonus;
      removehighest = true;
    }
    var rollResult = new Roll(rollformular);
    await rollResult.evaluate({ async: true });

    let fullDice = rollResult.terms[0].results
      .map((c) => {
        return c.result;
      })
      .sort((a, b) => b - a);

    const evalDiceA = fullDice[0];
    const evalDiceB = fullDice[1];
    const evalDiceC = fullDice[2];
    const evalDiceD = fullDice[3];

    const unEvalDice = fullDice.splice(4, 100);

    let resultMessage = "";
    let disadvMessage = "";
    if (fullDice[2] >= 9) {
      resultMessage = { msg: "KRITISCHER ERFOLG" };
    }
    if (rollResult.total <= 9) {
      resultMessage = { msg: "PATZER" };
    }
    if (removehighest) {
      disadvMessage = { disadv: "Erschwert" };
    }
    let messageData = {};
    let cardData = {
      attr: dicePool,
      skillValue: diceBonus,
      evalDiceA: evalDiceA,
      evalDiceB: evalDiceB,
      evalDiceC: evalDiceC,
      evalDiceD: evalDiceD,
      unEvalDice: unEvalDice,
      ...rollResult,
      ...resultMessage,
      ...disadvMessage,
    };
    messageData.content = await renderTemplate(
      "systems/darkspace/templates/dice/chatCustom.html",
      cardData
    );
    AudioHelper.play({ src: CONFIG.sounds.dice });
    return ChatMessage.create(messageData);
  }
}
