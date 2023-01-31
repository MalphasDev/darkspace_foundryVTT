/**
 * It takes an inputData object, rolls dice, and returns a chat message.
 * @param rollDiceData - {
 * @returns An object with the following properties:
 */
export async function rollDice(rollDiceData) {
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

  attrModLocal++ ? attrModLocal-- : (attrModLocal = 0);
  fertModLocal++ ? fertModLocal-- : (fertModLocal = 0);

  var attr = dynattr + attrModLocal;
  var skill = dynskill + fertModLocal;

  rollformular = attr + "d10x";

  var rollResult = new Roll(rollformular);
  await rollResult.evaluate({ async: true });

  const sortedResult = rollResult.terms[0].results
    .map((c) => {
      return c.result;
    })
    .sort((a, b) => b - a);

  const total_AB =
    sortedResult[0] +
    (sortedResult[1] === undefined ? 0 : sortedResult[1]) +
    skill;
  const total_BC =
    (sortedResult[1] === undefined ? 0 : sortedResult[1]) +
    (sortedResult[2] === undefined ? 0 : sortedResult[2]) +
    skill;
  const total_AC =
    sortedResult[0] +
    (sortedResult[2] === undefined ? 0 : sortedResult[2]) +
    skill;

  // --------------------- //
  // Krit und Patzer Logik //
  // --------------------- //

  let resultMessage = "";
  let disadvMessage = "";

  if (sortedResult[2] >= 9) {
    resultMessage = { msg: "KRITISCHER ERFOLG" };
  }
  if (rollResult.total <= 5) {
    resultMessage = { msg: "PATZER" };
  }
  if (removehighest) {
    disadvMessage = { disadv: "Erschwert" };
  }

  let messageData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
  };

  let dices = [];
  rollResult.terms[0].results.forEach((rollResult) => {
    dices.push(rollResult.result);
  });

  // ------------------------------ //
  // Zusammenstellen der Chat-Daten //
  // ------------------------------ //

  let evalDiceA = sortedResult[0];
  let evalDiceB = sortedResult[1];
  let evalDiceC = sortedResult[2];
  let evalDiceD = sortedResult[3];
  let unEvalDice = sortedResult.splice(4, 100);

  let diceResult = {
    attr: dynattr,
    skillValue: dynskill,
    attrModLocal: attrModLocal,
    fertModLocal: fertModLocal,
    evalDiceA: evalDiceA,
    evalDiceB: evalDiceB,
    evalDiceC: evalDiceC,
    evalDiceD: evalDiceD,
    unEvalDice: unEvalDice,
  };

  if (
    rollDiceData.object != undefined &&
    Object.keys(rollDiceData.object).length != 0
  ) {
    var merits = rollDiceData.object.data.items
      .filter((i) => {
        return i.type === "Eigenschaft";
      })
      .filter((j) => {
        return j.data.data.handicap === false;
      })
      .filter((k) => {
        return k.data.data.useWith === roleData.skill;
      });
    var handicaps = rollDiceData.object.data.items
      .filter((i) => {
        return i.type === "Eigenschaft";
      })
      .filter((j) => {
        return j.data.data.handicap === true;
      })
      .filter((k) => {
        return k.data.data.useWith === roleData.skill;
      });
    var cybernetics = rollDiceData.object.data.items
      .filter((i) => {
        return i.type === "Artifizierung";
      })
      .filter((k) => {
        return k.data.data.useWith === roleData.skill;
      });
  }

  let cardData = {
    ...roleData,
    ...diceResult,
    ...resultMessage,
    ...disadvMessage,
    merits: merits,
    handicaps: handicaps,
    cybernetics: cybernetics,
    total_AB: total_AB,
    total_BC: total_BC,
    total_AC: total_AC,
  };

  if (rollDiceData.item != undefined) {
    item = rollDiceData.item.data;
    cardData = {
      ...roleData,
      total_AB: total_AB,
      total_BC: total_BC,
      total_AC: total_AC,
      ...diceResult,
      ...resultMessage,
      ...disadvMessage,
      ...item,
    };
  }

  let outputData = {
    messageData: messageData,
    cardData: cardData,
  };

  return outputData;
}

export async function modRolls(inputData) {
  let attrModLocal;
  let fertModLocal;

  const dialogModRolls = await renderTemplate(
    "systems/darkspace/templates/dice/dialogModRolls.html"
  );

  if (inputData.modroll === true) {
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

            this._resolveDice(inputData);
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

            this._resolveDice(inputData);
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

    this._resolveDice(inputData);
  }
}

/**
 * It takes an inputData object, rolls dice, and returns a chat message.
 * @param inputData - {
 * @returns an object with the following properties:
 */
export async function _resolveDice(inputData) {
  let outputData = this.rollDice(inputData);
  let actor = {};
  let messageData = {};
  let cardData = {};
  await outputData.then((a) => {
    messageData = a.messageData;
    cardData = a.cardData;
    actor = a.actor;
  });
  if (inputData.item === undefined) {
    cardData = { ...cardData, actor };
  } else {
    cardData = {
      ...cardData,
      actor,
      dmg: cardData.data.dmg + cardData.total_BC,
    };
  }
  console.log("resolveDice", inputData.type);

  let chatTempPath = {
    Skill: "systems/darkspace/templates/dice/chatSkill.html",
    Custom: "systems/darkspace/templates/dice/chatCustom.html",
    Unarmed: "systems/darkspace/templates/dice/chatUnarmed.html",
    Waffe: "systems/darkspace/templates/dice/chatWeapon.html",
    Panzerung: "systems/darkspace/templates/dice/chatArmor.html",
    Artifizierung: "systems/darkspace/templates/dice/chatCybernetics.html",
    Unterbringung: "systems/darkspace/templates/dice/chatHousing.html",
    Item: "systems/darkspace/templates/dice/chatItem.html",
    Werkzeug: "systems/darkspace/templates/dice/chatItem.html",
    Terminals: "systems/darkspace/templates/dice/chatItem.html",
    Medkit: "systems/darkspace/templates/dice/chatItem.html",
    Gegenstand: "systems/darkspace/templates/dice/chatItem.html",
  };
  messageData.content = await renderTemplate(
    chatTempPath[inputData.type],
    cardData
  );

  AudioHelper.play({ src: CONFIG.sounds.dice });
  return ChatMessage.create(messageData);
}
export function getStat(fert, dbAttr) {
  const attrMap = new Map(Object.entries(dbAttr));
  let stat = [];
  attrMap.forEach((value, key) => {
    if (value.skill[fert] != undefined) {
      stat = {
        attr: dbAttr[key].attribut,
        fert: value.skill[fert],
        attrName: key,
        fertName: fert,
      };
    }
  });

  return stat;
}
