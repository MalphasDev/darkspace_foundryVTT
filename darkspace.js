import { darkspace } from "./module/config.js";
import DSItemSheet from "./module/sheets/DSItemSheet.js";
import DSItem from "./module/sheets/DSItem.js";
import DSCharacter from "./module/sheets/DSCharacter.js";
import DSCharacterSheet from "./module/sheets/DSCharacterSheet.js";
import DSCombat from "./module/DSCombat.js";
import DSCombatant from "./module/DSCombatant.js";
import DSCombatTracker from "./module/DSCombatTracker.js";
import DSNebencharakter from "./module/sheets/DSNebencharakter.js";
import * as DSMechanics from "./module/DSMechanics.js";
import DSChatlog from "./module/DSChatlog.js";

async function preloadHandlebarsTemplates() {
  // const dsFolders = [
  //   "/systems/darkspace/templates/createNewItem",
  //   "/systems/darkspace/templates/dice",
  //   "/systems/darkspace/templates/dice/dialog-sub-partials",
  //   "/systems/darkspace/templates/dice/dice-sub-partials",
  //   "/systems/darkspace/templates/partials",
  //   "/systems/darkspace/templates/partials/chatMessages",
  //   "/systems/darkspace/templates/partials/sub-partials",
  //   "/systems/darkspace/templates/sheets",
  //   "/systems/darkspace/templates/sheets/actors",
  //   "/systems/darkspace/templates/sheets/items",
  //   "/systems/darkspace/templates/sidebar",
  // ];

  const templatePaths = [
    //Charakter-Partials
    "systems/darkspace/templates/partials/character-sheet-header.html",
    "systems/darkspace/templates/partials/character-sheet-items.html",
    "systems/darkspace/templates/partials/character-sheet-combat.html",
    "systems/darkspace/templates/partials/character-sheet-props.html",
    "systems/darkspace/templates/partials/character-sheet-downtime.html",

    //Sub-Partials
    //Stats
    "systems/darkspace/templates/partials/sub-partials/stat-block.html",
    "systems/darkspace/templates/partials/sub-partials/stat-health.html",

    //Combat
    "systems/darkspace/templates/partials/sub-partials/combat-armor.html",
    "systems/darkspace/templates/partials/sub-partials/combat-weapons.html",

    //Items
    "systems/darkspace/templates/partials/sub-partials/items-header.html",
    "systems/darkspace/templates/partials/sub-partials/items-weapons.html",
    "systems/darkspace/templates/partials/sub-partials/items-editDeleteEquip.html",

    //NPCs
    "systems/darkspace/templates/sheets/actors/Nebencharakter-sheet.html",
    "systems/darkspace/templates/sheets/actors/DrohneFahrzeug-sheet.html",

    //Items
    "systems/darkspace/templates/partials/MKSize.html",
    "systems/darkspace/templates/dice/dice-sub-partials/dice-msg.html",

    //Misc
    "systems/darkspace/templates/partials/sub-partials/misc-notes.html",
    "systems/darkspace/templates/partials/sub-partials/misc-downtime.html",

    //Sub-Sub-Partials
    "systems/darkspace/templates/partials/sub-partials/sub-stat-collapsible.html",

    //Dialog
    "systems/darkspace/templates/dice/dialog-sub-partials/dialogMKSize.html",
    "systems/darkspace/templates/dice/dialog-sub-partials/dialogName.html",
    "systems/darkspace/templates/dice/dialog-sub-partials/dialogDescMod.html",
    "systems/darkspace/templates/dice/dialog-sub-partials/dialogWeapon.html",
    "systems/darkspace/templates/dice/dialog-sub-partials/dialogSkillDropdown.html",

    //Chat
    "systems/darkspace/templates/dice/chatWeapon.html",
    "systems/darkspace/templates/dice/chatBase.html",
    "systems/darkspace/templates/dice/dice-sub-partials/dice-msg.html",

    //Foundry UI-Overwrite
    "systems/darkspace/templates/sidebar/combat-tracker.html",
    "systems/darkspace/templates/sidebar/customAE.html",
    "systems/darkspace/templates/sidebar/chat-log.html",
  ];
  return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
  /* Setting the default classes for the different types of objects in the game. */
  CONFIG.Combat.documentClass = DSCombat;
  CONFIG.Combatant.documentClass = DSCombatant;
  CONFIG.ui.combat = DSCombatTracker;
  CONFIG.darkspace = darkspace;
  CONFIG.Actor.documentClass = DSCharacter;
  CONFIG.Item.documentClass = DSItem;
  CONFIG.ui.chat = DSChatlog;

  const iconFolder = "systems/darkspace/icons/";

  /* Defining the status effects that can be applied to tokens. */
  CONFIG.statusEffects = [
    {
      icon: iconFolder + "dizzy-solid.svg",
      id: "struck",
      label: "Angeschlagen",
    },
    {
      icon: iconFolder + "times-circle-solid.svg",
      id: "ko",
      label: "Außer Gefecht",
    },
    {
      icon: iconFolder + "band-aid-solid.svg",
      id: "wounded",
      label: "Verwundet",
    },
    {
      icon: iconFolder + "user-injured-solid.svg",
      id: "crippled",
      label: "Verkrüppelt",
    },
    { icon: iconFolder + "skull-solid.svg", id: "dead", label: "Tod" },
  ];

  /* A way to make the functions available to the game. */
  game.darkspace = {
    DSCharacter,
    DSItem,
    rollItemMacro,
  };

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("darkspace", DSItemSheet, { makeDefault: true });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("darkspace", DSCharacterSheet, { makeDefault: true });
  Actors.registerSheet("darkspace", DSNebencharakter, { makeDefault: true });

  preloadHandlebarsTemplates();

  game.settings.register("darkspace", "ae_input", {
    name: "Eingabemethode für Aktionseinheiten",
    hint: "Wähle, ob du einen Slider oder Buttons für die Eingabe der AE-Kosten benutzen möchtest. Dieses Fenster muss neu geladen werden, damit die Änderung wirksam",
    scope: "client",
    config: true,
    type: String,
    choices: {
      ae_button: "Buttons",
      ae_slider: "Slider",
    },
    default: "ae_button",
    onChange: (value) => {},
  });

  Handlebars.registerHelper("disabled", function (condition) {
    let d = "";
    if (condition != null || undefined) {
      d = "disabled";
    } else {
      d = "enabled";
    }
    return d;
  });
  Handlebars.registerHelper("times", function (n, content) {
    let result = "";
    for (var i = 0; i < n; ++i) {
      let htmlString = content.fn(n);
      let dataIndexString = "data-index=" + (i + 1) + ">";
      htmlString = htmlString.replace(">", dataIndexString);
      result += htmlString;
    }
    return result;
  });

  Handlebars.registerHelper("ifGE", function (arg1, arg2, options) {
    return arg1 >= arg2 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
    switch (operator) {
      case "==":
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case "===":
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case "!=":
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case "!==":
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case "<":
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case "<=":
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case ">":
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case ">=":
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case "&&":
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case "||":
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
  Handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
      return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
  });
});

Hooks.once("ready", async function () {
  Hooks.on("hotbarDrop", (bar, data, slot) => createDSMacro(data, slot));
});
/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createDSMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data))
    return ui.notifications.warn(
      "You can only create macro buttons for owned Items"
    );
  const item = data.data;

  // Create the macro command
  const command = `game.darkspace.rollItemMacro("${item.name}");`;
  let macro = await Macro.create({
    name: item.name,
    type: "script",
    img: item.img,
    command: command,
    flags: { "darkspace.itemMacro": true },
  });
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  /* Checking if the speaker has a token and if not, it is checking if the speaker has an actor. If the
  speaker has an actor, it is checking if the actor has an item with the name of the itemName. If
  the actor has an item with the name of the itemName, it is returning a warning that the actor does
  not have an item with the name of the itemName. */
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find((i) => i.name === itemName) : null;
  if (!item)
    return ui.notifications.warn(
      `Your controlled Actor does not have an item named ${itemName}`
    );

  const activeItem = actor.items.filter((f) => {
    return f.id === item.id;
  })[0];

  const dbAttr = actor.data.data.charattribut;
  const stat = DSMechanics.getStat(item.data.data.useWith, dbAttr);

  const inputData = {
    actorData: actor,
    actorId: actor.id,
    item: item,
    dynattr: stat.attr,
    dynskill: stat.fert,
    modroll: false,
    object: {},
    type: item.type,
  };
  // Trigger the item roll
  DSMechanics.modRolls(inputData, {});
}

//Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html)); //Wird gebraucht um in eine interaktive Nachricht in der Sidebar zu erzeugen
