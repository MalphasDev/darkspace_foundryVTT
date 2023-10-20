import { DSCombatTracker } from "./DSCombatTracker.js";
/**
 * It takes an inputData object, rolls dice, and returns a chat message.
 * @param inputData - {
 * @returns An object with the following properties:
 */
export async function rollDice(inputData) {
  const actor = game.actors.get(inputData.actorId);
  
  let attrModLocal = parseInt(inputData.attrModLocal);
  let fertModLocal = parseInt(inputData.fertModLocal);
  let rollData = inputData.rollData;
  let removehighest = inputData.removehighest;
  let rollformular;
  const system = actor?.system;
  let baseDicepool = actor?.system.effectiveCompetence
  if (baseDicepool === undefined) {baseDicepool=0}

  

  console.log(inputData);

  // ------------------------------------- //
  // Custom Roll und globale Modifikatoren //
  // ------------------------------------- //

  attrModLocal++ ? attrModLocal-- : (attrModLocal = 0);
  fertModLocal++ ? fertModLocal-- : (fertModLocal = 0);

  let attr;
  let skill;

  if (inputData.type === "Custom") {
    attr = inputData.attr + baseDicepool;
    skill = inputData.skill;
  } else if (actor.type === "Nebencharakter") {
    attr = actor?.system.effectiveCompetence
    skill = actor?.system.stats.baseDicepool.skill.Kompetenzbonus
  } else {
    attr = system.stats[rollData.attribute].attribut + baseDicepool;
    skill = system.stats[rollData.attribute].skill[rollData.skill];
  }

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
  const total_CD =
    (sortedResult[2] === undefined ? 0 : sortedResult[2]) +
    (sortedResult[3] === undefined ? 0 : sortedResult[3]) +
    skill;

  // --------------------- //
  // Krit und Patzer Logik //
  // --------------------- //

  let resultMessage = "";
  let disadvMessage = "";

  if (sortedResult[2] >= 9) {
    resultMessage = { crit: true };
  }
  if (rollResult.total <= 5) {
    resultMessage = { fumble: true };
  }
  if (removehighest) {
    disadvMessage = { disadv: true };
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
    attr: attr,
    skillValue: skill,
    attrModLocal: attrModLocal,
    fertModLocal: fertModLocal,
    evalDiceA: evalDiceA,
    evalDiceB: evalDiceB,
    evalDiceC: evalDiceC,
    evalDiceD: evalDiceD,
    unEvalDice: unEvalDice,
  };

  if (
    inputData.object != undefined &&
    Object.keys(inputData.object).length != 0
  ) {
    var merits = [];
    var meritList = Object.entries(system.props)
      .filter((hc) => {
        return hc[1].handicap === false;
      })
      .filter((skill) => {
        return skill[1].skill === rollData.skill;
      });
    meritList.forEach((merit) => {
      merits.push(merit[1]);
    });
    var handicaps = [];
    var handicapList = Object.entries(system.props)
      .filter((hc) => {
        return hc[1].handicap === true;
      })
      .filter((skill) => {
        return skill[1].skill === rollData.skill;
      });

    handicapList.forEach((handicap) => {
      handicaps.push(handicap[1]);
    });

    // Artfizierungen zusammenstellen
    var cyberwareProps = {};
    var cybernetics = inputData.object.items
      .filter((i) => {
        return i.type === "Artifizierung";
      })
      .filter((k) => {
        let cyberwareProps = [];
        Object.entries(k.system.props).forEach((cyberware) => {
          cyberwareProps.push(cyberware[1].skill);
        });
        return cyberwareProps.includes(rollData.skill);
      });
    cybernetics.forEach((cyberware) => {
      Object.entries(cyberware.system.props).forEach((cyberslot) => {
        if (cyberslot[1].skill === rollData.skill) {
          cyberwareProps = {
            ...cyberwareProps,
            ["slot" + Object.keys(cyberwareProps).length]: {
              name: cyberware.name,
              skill: cyberslot[1].skill,
              prop: cyberslot[1].prop,
              action: cyberslot[1].action,
              desc: cyberslot[1].desc,
            },
          };
        }
      });
    });
  }

  let cardData = {
    ...rollData,
    ...diceResult,
    ...resultMessage,
    ...disadvMessage,
    merits: merits,
    handicaps: handicaps,
    cybernetics: cyberwareProps,
    rollname: inputData.rollname,
    actorData: inputData.actorData,
    total_AB: total_AB,
    total_BC: total_BC,
    total_AC: total_AC,
    total_CD: total_CD,
  };

  if (inputData.actorData != undefined) {
    cardData = {
      ...cardData,
      actor: inputData.actorData,
    };
  }
  if (inputData.actorData === undefined) {
    cardData = {
      ...cardData,
      // Actorname
    };
  }

  if (inputData.item != undefined) {
    cardData = {
      ...rollData,
      total_AB: total_AB,
      total_BC: total_BC,
      total_AC: total_AC,
      total_CD: total_CD,
      ...diceResult,
      ...resultMessage,
      ...disadvMessage,
      ...inputData.item,
    };
  }
  let outputData = {
    messageData: messageData,
    cardData: cardData,
    actorId: inputData.actorId,
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
          icon: `<i class="fa-solid fa-check"></i>`,
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
          icon: `<i class="fa-solid fa-exclamation-triangle"></i>`,
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
  const combatTracker = new DSCombatTracker();

  let outputData = this.rollDice(inputData);
  let actorId;
  let messageData = {};
  let cardData = {};

  await outputData.then((a) => {
    messageData = a.messageData;
    cardData = a.cardData;
    actorId = a.actorId;
  });
  
  if (actorId === "" || actorId === undefined)
    actorId = messageData.speaker.actor;
  const currentActor = game.actors.get(actorId);
  const stats = currentActor?.system.stats;
  
  let diceB = cardData.evalDiceB ? cardData.evalDiceB : 0
  let diceC = cardData.evalDiceC ? cardData.evalDiceC : 0
  let diceD = cardData.evalDiceD ? cardData.evalDiceD : 0
  let skill = cardData.skillValue

  const basedmg = cardData.system?.dmg
  const bonusdmg = diceB + diceC;

  if (inputData.item != undefined) {
    cardData = {
      ...cardData,
      currentActor,
      basedmg: basedmg,
      bonusdmg: bonusdmg,
      dmg: basedmg + bonusdmg,
    };
  }
  if (inputData.eventData?.dataset.ua) {
    cardData = {
      ...cardData,
      currentActor,
      basedmg: stats[inputData.rollData.attribute].attribut,
      bonusdmg: bonusdmg,
      dmg: stats[inputData.rollData.attribute].attribut + bonusdmg,

      img: "systems/darkspace/icons/itemDefault/itemIcon_Nahkampfwaffe.svg",
      name: "Waffenloser Angriff",
      type: "Waffenlos",
    };
  }
  const targetTokens = canvas.tokens.placeables
    .filter((token) => token.isTargeted)
    .map((target) => target.actor);

  if (targetTokens.length > 0) {
    const targetData = targetTokens.map((token) => {
      return token;
    });
    cardData = {
      ...cardData,
      targetData: targetData,
    };
  }

  combatTracker.itemAe(
    inputData.actorId,
    cardData.system ? cardData.system.aeCost : 0
  );

  let chatTempPath = {
    Skill: "systems/darkspace/templates/dice/chatSkill.html",
    Custom: "systems/darkspace/templates/dice/chatCustom.html",
    Schusswaffe: "systems/darkspace/templates/dice/chatWeapon.html",
    Nahkampfwaffe: "systems/darkspace/templates/dice/chatWeapon.html",
    Artifizierung: "systems/darkspace/templates/dice/chatCybernetics.html",
    Item: "systems/darkspace/templates/dice/chatItem.html",
    Werkzeug: "systems/darkspace/templates/dice/chatItem.html",
    Terminals: "systems/darkspace/templates/dice/chatWeapon.html",
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
        attrmax: value.attrmax,
      };
    }
  });

  return stat;
}
