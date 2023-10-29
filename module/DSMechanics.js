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
  let removehighest = inputData.removehighest;
  const competence = actor?.system.effectiveCompetence ?? 0;
  const skillData = this.getStat(inputData.rollData.skillName, inputData.actorId)

  // ------------------------------------- //
  // Custom Roll und globale Modifikatoren //
  // ------------------------------------- //

  dicepoolModLocal++ ? dicepoolModLocal-- : (dicepoolModLocal = 0);
  skillModLocal++ ? skillModLocal-- : (skillModLocal = 0);


  if (inputData.type === "Custom") {
    rollData.dicepool = inputData.rollData.dicepoolVal + dicepoolModLocal;
    rollData.skill = inputData.rollData.skill + skillModLocal;
  } else if (actor.type === "Nebencharakter") {
    rollData.dicepool = competence + dicepoolModLocal;
    rollData.skill = competence + skillModLocal;
  } else {
    const aptitude = this.getStat(inputData.rollData.skillName, inputData.actorId).dicepool
    rollData.dicepool = (competence + aptitude + dicepoolModLocal);
    rollData.skill = skillData.skill + skillModLocal;
  }

  const rollResult = new Roll(rollData.dicepool + "d10x");

  await rollResult.evaluate({ async: true });


  rollResult.terms[0].results.sort(
    (a, b) => b.result - a.result
  );
  const rollTerms = rollResult.terms[0]
  const diceData = rollTerms.results
  const diceResults = rollTerms.values
  const dicepoolUsed = rollTerms.number

  rollResult.resultPair = "prime"
  rollResult.effectPair = "secondary"

  
  if (removehighest) {
    rollResult.resultPair = "secondary"
    rollResult.effectPair = "tertiary"
    rollResult.disadv = true ;
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
      for (let index = 0; index < Math.min(diceData.length,2); index++) {
        diceData[index].evaluated = true
      }
      break;
    case "secondary":
      for (let index = 1; index < Math.min(diceData.length,3); index++) {
        diceData[index].evaluated = true
      }
      break;
  
    default:
      break;
  }



  rollResult.finalResults = {
    prime: rollResult.partResults.prime + rollData.skill,
    secondary: rollResult.partResults.secondary + rollData.skill,
    tertiary: rollResult.partResults.tertiary + rollData.skill,
  }


  // ------------------------------ //
  // Zusammenstellen der Chat-Daten //
  // ------------------------------ //

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
  crit: diceResults[2] >=9,
  fumble: rollResult.partResults[rollResult.resultPair] <= 5,
  skillName: skillData.skillName
  };

  if (
    inputData.object != undefined &&
    Object.keys(inputData.object).length != 0
  ) {
    
    rollResult.data = {
      ...rollResult.data,
      props: {
        mertis: Object.entries(system.props).filter((hc) => {
          return hc[1].handicap === false;
        }).filter((prop) => {
          return prop[1].skill === skillData.skillName}),
        handicaps: Object.entries(system.props).filter((hc) => {
          return hc[1].handicap === true;
        }).filter((prop) => {return prop[1].skill === skillData.skillName}),
      },
      cybernetics: inputData.object.items
      .filter((i) => {
        return i.type === "Artifizierung";
      })
    }

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

/**
 * It takes an inputData object, rolls dice, and returns a chat message.
 * @param inputData - {
 * @returns an object with the following properties:
 */
export async function _resolveDice(inputData) {

  
  const rollResult = await this.rollDice(inputData).then((resultedRoll) => {
    return resultedRoll
  });
  
  const stats = rollResult.actor?.system.stats;


  if (inputData.item != undefined) {
    rollResult.combatData = {
      basedmg: rollResult.item.system.dmg,
      bonusdmg: rollResult.finalResults[rollResult.effectPair],
      dmg: rollResult.item.system.dmg + rollResult.finalResults[rollResult.effectPair],
      img: rollResult.item.img,
      name: rollResult.item.name,
      type: rollResult.item.type,
    }
  }
  if (inputData.eventData?.dataset.ua) {

    rollResult.combatData = {
      basedmg: stats[inputData.rollData.dicepool].dicepool,
      bonusdmg: rollResult.finalResults[rollResult.effectPair],
      dmg: stats[inputData.rollData.dicepool].dicepool + rollResult.finalResults[rollResult.effectPair],
      img: "systems/darkspace/icons/itemDefault/itemIcon_Nahkampfwaffe.svg",
      name: "Waffenloser Angriff",
      type: "Waffenlos",
    }

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

  const messageData = {}
  messageData.content = await renderTemplate(
    chatTempPath[inputData.type],
    rollResult
  );
  AudioHelper.play({ src: CONFIG.sounds.dice });
  return ChatMessage.create(messageData);
}

export function getStat(skill, actorId) {
  let stat = [];

  const actor = game.actors.get(actorId);
  const dbAttr = actor.system.stats;
  if (actor.type === "Nebencharakter") {
    stat = {
      dicepool: actor.system.baseDicepool,
      skill: actor.system.baseDicepool,
      dicepoolName: "baseDicepool",
      skillName: "baseDicepoolSkill",
      dicepoolmax: 5,
    };
  } else {
    const dicepoolMap = new Map(Object.entries(dbAttr));

    dicepoolMap.forEach((value, key) => {
      if (value.skill[skill] != undefined) {
        stat = {
          dicepool: dbAttr[key].dicepool,
          skill: value.skill[skill],
          dicepoolName: key,
          skillName: skill,
          dicepoolmax: value.dicepoolmax,
        };
      }
    });
  }
  return stat;
}
