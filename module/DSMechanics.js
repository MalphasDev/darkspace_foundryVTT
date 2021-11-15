export function rollDice(rollDiceData) {
  const actorData = rollDiceData.actorData;
  const actorId = rollDiceData.actorId;
  const element = rollDiceData.eventData;
  let dynattr = parseInt(rollDiceData.dynattr);
  let dynskill = parseInt(rollDiceData.dynskill);
  let attrModLocal = parseInt(rollDiceData.attrModLocal);
  let fertModLocal = parseInt(rollDiceData.fertModLocal);
  let roleData = rollDiceData.roleData;
  let removehighest = rollDiceData.removehighest;
  let item;

  let rollformular;

  // ------------------------------------- //
  // Custom Roll und globale Modifikatoren //
  // ------------------------------------- //

  attrModLocal === undefined ? (attrModLocal = 0) : attrModLocal;
  fertModLocal === undefined ? (fertModLocal = 0) : fertModLocal;

  dynattr += attrModLocal;
  dynskill += fertModLocal;
  if (removehighest != true) {
    rollformular = dynattr + "d10x10kh2+" + dynskill;
  } else {
    rollformular = dynattr + "d10x10kh3dh1+" + dynskill;
  }
  var rollResult = new Roll(rollformular, actorData).roll();

  // --------------------- //
  // Krit und Patzer Logik //
  // --------------------- //

  let krit = rollResult.terms[0].results
    .map((c) => {
      return c.result;
    })
    .sort((a, b) => b - a);
  let resultMessage = "";
  let disadvMessage = "";
  if (krit[2] >= 9) {
    resultMessage = { msg: "KRITISCHER ERFOLG" };
  }
  if (rollResult.total <= 9) {
    resultMessage = { msg: "PATZER" };
  }
  if (removehighest) {
    disadvMessage = { disadv: "Erschwert" };
  }

  let messageData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
  };

  let dices = [];
  for (var i = 0; i < rollResult.terms[0].results.length; i++) {
    dices.push(rollResult.terms[0].results[i].result);
  }
  let fullDice = dices.sort((a, b) => b - a);
  let evalDice = [fullDice[0], fullDice[1]];
  let kritDice = [fullDice[2]];
  let unEvalDice = fullDice.splice(3, 100);

  let diceResult = {
    evalDice: evalDice,
    kritDice: kritDice,
    unEvalDice: unEvalDice,
  };
  let cardData = {
    ...this.data,
    ...roleData,
    ...rollResult,
    ...diceResult,
    ...resultMessage,
    ...disadvMessage,
    owner: actorId,
  };

  if (rollDiceData.item != undefined) {
    item = rollDiceData.item.data;
    cardData = {
      ...this.data,
      ...roleData,
      ...rollResult,
      ...diceResult,
      ...resultMessage,
      ...disadvMessage,
      owner: actorId,
      ...item,
    };
  }

  let outputData = {
    messageData: messageData,
    cardData: cardData,
  };

  return outputData;
}

export async function modRolls(inputData, event) {
  event.preventDefault();
  const element = event.currentTarget;

  let attrModLocal;
  let fertModLocal;

  const dialogModRolls = await renderTemplate(
    "systems/darkspace/templates/dice/dialogModRolls.html"
  );
  if (element.dataset.modroll === "true") {
    new Dialog({
      title: "Modifizierte Probe",
      content: dialogModRolls,
      buttons: {
        button1: {
          label: "Normal",
          callback: (html) => {
            attrModLocal = parseInt(html.find("[name=attrmod]")[0].value);
            fertModLocal = parseInt(html.find("[name=fertmod]")[0].value);
            let ifRemoveHighest = false;

            inputData = {
              ...inputData,
              attrModLocal: attrModLocal,
              fertModLocal: fertModLocal,
              removehighest: ifRemoveHighest,
            };

            this._resolveDice(inputData, event);
          },
          icon: `<i class="fas fa-check"></i>`,
        },
        button2: {
          label: "Erschwert",
          callback: (html) => {
            attrModLocal = parseInt(html.find("[name=attrmod]")[0].value);
            fertModLocal = parseInt(html.find("[name=fertmod]")[0].value);
            let ifRemoveHighest = true;

            inputData = {
              ...inputData,
              attrModLocal: attrModLocal,
              fertModLocal: fertModLocal,
              removehighest: ifRemoveHighest,
            };

            this._resolveDice(inputData, event);
          },
          icon: `<i class="fas fa-exclamation-triangle"></i>`,
        },
      },
      close: () => {},
    }).render(true);
  } else {
    inputData = {
      ...inputData,
      attrModLocal: 0,
      fertModLocal: 0,
    };
    this._resolveDice(inputData, event);
  }
}

export async function _resolveDice(inputData, event) {
  let outputData = this.rollDice(inputData);
  let messageData = outputData.messageData;
  let cardData = outputData.cardData;
  let currentRollClass = event.currentTarget.className;
  let currentRoll;

  currentRollClass.includes("roleSkill") ? (currentRoll = "Skill") : "";
  currentRollClass.includes("roll-btn") ? (currentRoll = "Custom") : "";
  currentRollClass.includes("unarmedCombat") ? (currentRoll = "Unarmed") : "";
  currentRollClass.includes("rollItem")
    ? (currentRoll = inputData.item.data.type)
    : "";
  currentRollClass.includes("protection") ? (currentRoll = "Skill") : "";

  if (currentRoll === undefined) {
    currentRoll = "Skill";
  }

  let chatTempPath = {
    Skill: "systems/darkspace/templates/dice/chatSkill.html",
    Custom: "systems/darkspace/templates/dice/chatCustom.html",
    Item: "systems/darkspace/templates/dice/chatItem.html",
    Unarmed: "systems/darkspace/templates/dice/chatUnarmed.html",
    Waffe: "systems/darkspace/templates/dice/chatWeapon.html",
    Panzerung: "systems/darkspace/templates/dice/chatArmor.html",
    Artifizierung: "systems/darkspace/templates/dice/chatCybernetics.html",
    Unterbringung: "systems/darkspace/templates/dice/chatHousing.html",
  };

  messageData.content = await renderTemplate(
    chatTempPath[currentRoll],
    cardData
  );

  AudioHelper.play({ src: CONFIG.sounds.dice });
  return ChatMessage.create(messageData);
}
