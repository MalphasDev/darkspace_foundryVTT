import { DSCombatTracker } from "./DSCombatTracker.js";
/**
 * It takes an inputData object, rolls dice, and returns a chat message.
 * @param inputData - {
 * @returns An object with the following properties:
 */
export async function rollDice(inputData) {
  const actor = game.actors.get(inputData.actorId);
  const system = actor?.system;

  let dicepoolModLocal = parseInt(inputData.dicepoolModLocal);
  let skillModLocal = parseInt(inputData.skillModLocal);

  const rollData = inputData.rollData;
  const removehighest = inputData.removehighest;
  const competence = actor?.system.effectiveCompetence ?? 0;
  const skillData = this.getStat(
    inputData.rollData.skillName,
    actor
  );

  // ------------------------------------- //
  // Custom Roll und globale Modifikatoren //
  // ------------------------------------- //
  dicepoolModLocal++ ? dicepoolModLocal-- : (dicepoolModLocal = 0);
  skillModLocal++ ? skillModLocal-- : (skillModLocal = 0);

  if (inputData.type === "Custom") {
    rollData.dicepool = rollData.dicepoolVal + dicepoolModLocal;
    rollData.skillValue = rollData.skillValue + skillModLocal;
  } else if (actor.type === "Nebencharakter") {
    rollData.dicepool = competence + dicepoolModLocal;
    rollData.skillValue = competence + skillModLocal;
  } else {
    const aptitude = this.getStat(
      rollData.skillName,
      actor
    ).dicepool;
    rollData.dicepool = competence + aptitude + dicepoolModLocal;
    rollData.skillValue = skillData.skillValue + skillModLocal;
  }

  const rollResult = new Roll(rollData.dicepool + "d10x");

  await rollResult.evaluate({ async: true });

  rollResult.terms[0].results.sort((a, b) => b.result - a.result);
  const rollTerms = rollResult.terms[0];
  const diceData = rollTerms.results;
  const diceResults = rollTerms.values;
  const dicepoolUsed = rollTerms.number;

  rollResult.resultPair = "prime";
  rollResult.effectPair = "secondary";

  if (removehighest) {
    rollResult.resultPair = "secondary";
    rollResult.effectPair = "tertiary";
    rollResult.disadv = true;
  }

  // ++++ Paare bilden ++++ //
  rollResult.partResults = {
    prime: diceResults[0] + (diceResults[1] ?? 0),
    secondary: (diceResults[1] ?? 0) + (diceResults[2] ?? 0),
    tertiary: (diceResults[2] ?? 0) + (diceResults[3] ?? 0),
  };

  // ++++ Zu beachtende Würfel, wichtig fürs CSS ++++ //

  switch (rollResult.resultPair) {
    case "prime":
      for (let index = 0; index < Math.min(diceData.length, 2); index++) {
        diceData[index].evaluated = true;
      }
      break;
    case "secondary":
      for (let index = 1; index < Math.min(diceData.length, 3); index++) {
        diceData[index].evaluated = true;
      }
      break;

    default:
      break;
  }
  rollResult.finalResults = {
    prime: rollResult.partResults.prime + rollData.skillValue,
    secondary: rollResult.partResults.secondary + rollData.skillValue,
    tertiary: rollResult.partResults.tertiary + rollData.skillValue,
  };

  // ------------------------------ //
  // Zusammenstellen der Chat-Daten //
  // ------------------------------ //

  if (!skillData.skillValue) {
    skillData.skillValue = 0;
  }

  rollResult.data = {
    message: {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    },
    dicepoolModLocal: dicepoolModLocal,
    skillModLocal: skillModLocal,
    rollname: inputData.rollname,
    actor: actor,
    effectOff: inputData.effectOff,
    item: inputData.item,
    crit: diceResults[2] >= 9,
    fumble: rollResult.partResults[rollResult.resultPair] <= 5,
    skillName: skillData.skillName,
    skill: skillData.skillValue,
  };

  if (
    inputData.object != undefined &&
    Object.keys(inputData.object).length != 0
  ) {
    rollResult.data = {
      ...rollResult.data,
      props: {
        mertis: Object.entries(system.props)
          .filter((hc) => {
            return hc[1].handicap === false;
          })
          .filter((prop) => {
            return prop[1].skill === skillData.value;
          }),
        handicaps: Object.entries(system.props)
          .filter((hc) => {
            return hc[1].handicap === true;
          })
          .filter((prop) => {
            return prop[1].skill === skillData.value;
          }),
      },
      cybernetics: inputData.object.items.filter((i) => {
        return i.type === "Artifizierung";
      }),
    };
  }

  return rollResult;
}

export async function modRolls(inputData) {
  let dicepoolModLocal;
  let skillModLocal;

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
            dicepoolModLocal = parseInt(
              html.find("[name=dicepoolmod]")[0].value
            );
            skillModLocal = parseInt(html.find("[name=skillmod]")[0].value);
            let ifRemoveHighest = false;

            inputData = {
              ...inputData,
              dicepoolModLocal: dicepoolModLocal,
              skillModLocal: skillModLocal,
              removehighest: ifRemoveHighest,
            };

            this._resolveDice(inputData);
          },
          icon: `<i class="fa-solid fa-check"></i>`,
        },
        button2: {
          label: "Erschwert",
          callback: (html) => {
            dicepoolModLocal = parseInt(
              html.find("[name=dicepoolmod]")[0].value
            );
            skillModLocal = parseInt(html.find("[name=skillmod]")[0].value);
            let ifRemoveHighest = true;

            inputData = {
              ...inputData,
              dicepoolModLocal: dicepoolModLocal,
              skillModLocal: skillModLocal,
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
      dicepoolModLocal: 0,
      skillModLocal: 0,
    };
    this._resolveDice(inputData);
  }
}

export async function _resolveDice(inputData) {

  const actor = game.actors.get(inputData.actorId);
  const rollResult = await this.rollDice(inputData).then((resultedRoll) => {
    return resultedRoll;
  });
  if (inputData.item != undefined) {
    const item = rollResult.data.item
    rollResult.itemData = {
      basedmg: item.system.dmg,
      bonusdmg: rollResult.finalResults[rollResult.effectPair],
      dmg:
      item.system.dmg +
        rollResult.finalResults[rollResult.effectPair],
      img: item.img,
      name: item.name,
      type: item.type,
      aeCost: item.system.size,
      system: item.system,
    };
  }
  
  if (inputData.eventData?.dataset.ua) {
    rollResult.itemData = {
      basedmg: inputData.rollData.dicepool + this.getStat(rollResult.data.skillName,actor).dicepool,
      bonusdmg: rollResult.finalResults[rollResult.effectPair],
      dmg:
      inputData.rollData.dicepool + this.getStat(rollResult.data.skillName,actor).dicepool +
        rollResult.finalResults[rollResult.effectPair],
      img: "systems/darkspace/icons/itemDefault/itemIcon_Nahkampfwaffe.svg",
      name: "Waffenloser Angriff",
      type: "Waffenlos",
      aeCost: 2,
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

  // Ist verbuggt, keine Ahnung warum. Nachdem itemAe aufgerufen wurde, wird der Tracker nicht mehr ordentlich aktuallisiert.

  // const combatTracker = new DSCombatTracker();
  // combatTracker.itemAe(
  //   inputData.actorId,
  //   cardData.system ? cardData.system.aeCost : 0
  // );

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

  const messageData = {};
  messageData.content = await renderTemplate(
    chatTempPath[inputData.type],
    rollResult
  );
  AudioHelper.play({ src: CONFIG.sounds.dice });
  return ChatMessage.create(messageData);
}

export function getStat(skillName, actorData) {
  const actor = actorData

    let result = null;
    if (actor.type === "Nebencharakter") {
      result = {
        dicepool: actor.system.baseDicepool,
        skillValue: actor.system.baseDicepool,
        aptitude: "Kompetenz",
        skillName: "Fähigkeit",
      };
    } else {
      Object.entries(actor.system.stats).some(([aptitude, aptSet]) => { 
        // aptitude entspricht Key
        // aptSet entspricht Value
        if (aptSet.skill.hasOwnProperty(skillName)) {
            result = {
                aptitude: aptitude,
                dicepool: actor.system.stats[aptitude].dicepool,
                skillValue: aptSet.skill[skillName],
                skillName: skillName,
            };
            return true; // Beende die Schleife, wenn der Skill gefunden wurde
        }
    });
    }
    if (result === null) {
      result = {
        aptitude: "",
        dicepool: 0,
        skillValue: 0,
        skillName: skillName,
    };
    }

    return result
  }

