import { darkspace } from "./config.js";
import { DSItemSheet } from "./sheets/DSItemSheet.js";
import { DSItem } from "./sheets/DSItem.js";
import { DSCharacter } from "./sheets/DSCharacter.js";
import { DSCharacterSheet } from "./sheets/DSCharacterSheet.js";
import { DSCombat } from "./DSCombat.js";
import { DSCombatTracker } from "./DSCombatTracker.js";
import { DSChatlog } from "./DSChatlog.js";
import { DSPause } from "./DSPause.js";
import { DSHotbar } from "./DSHotbar.js";
import * as DSMechanics from "./DSMechanics.js";

async function preloadHandlebarsTemplates() {
  const baseAddress = "systems/darkspace/templates/";
  const partialAddress = baseAddress + "partials/";
  const sheetsAddress = baseAddress + "sheets/";
  const diceAddress = baseAddress + "dice/";
  const sidebarAddress = baseAddress + "sidebar/";

  const templatePaths = [
    //Charakter-Partials
    partialAddress + "character-sheet-header.html",
    partialAddress + "character-sheet-items.html",
    partialAddress + "character-sheet-props.html",
    partialAddress + "character-sheet-stats.html",

    partialAddress + "techCortexHealth.html",
    partialAddress + "skillOptions.html",
    //Buttons
    partialAddress + "actors/actionBtn.html",
    partialAddress + "actors/protectionBtn.html",

    //NPCs
    sheetsAddress + "actors/Nebencharakter-sheet.html",
    sheetsAddress + "actors/DrohneFahrzeug-sheet.html",

    //Sub-Partials für Actors
    partialAddress + "actors/health.html",
    partialAddress + "actors/combat-armor.html",
    partialAddress + "actors/combat-weapons.html",
    partialAddress + "actors/inventar_proplist.html",
    partialAddress + "actors/inventar_inlinebots.html",

    //Items
    partialAddress + "items/header.html",
    partialAddress + "items/weapons.html",
    partialAddress + "items/editDeleteEquip.html",
    partialAddress + "items/MkSize.html",
    partialAddress + "items/MkSize_display.html",
    partialAddress + "items/itemProp.html",
    partialAddress + "items/bots.html",
    partialAddress + "items/inlineHealth.html",
    partialAddress + "items/itemcore.html",

    //Misc
    diceAddress + "dice-msg.html",
    partialAddress + "notes.html",

    //Dialog
    diceAddress + "dialogMkSize.html",
    diceAddress + "dialogWeapon.html",

    //Chat
    diceAddress + "chatWeapon.html",
    diceAddress + "chatBase.html",
    diceAddress + "dice-msg.html",

    //Foundry UI-Overwrite
    sidebarAddress + "combat-tracker.html",
    sidebarAddress + "customAE.html",
    sidebarAddress + "chat-log.html",

  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
  // Add custom constants for configuration.
  CONFIG.darkspace = darkspace;
  /* A way to make the functions available to the game. */
  game.darkspace = {
    DSCharacter,
    DSItem,
    rollItemMacro,
  };
  // Setting the default classes for the different types of objects in the game.
  CONFIG.Combat.documentClass = DSCombat;
  CONFIG.Actor.documentClass = DSCharacter;
  CONFIG.Item.documentClass = DSItem;

  // UI overwrites
  CONFIG.ui.combat = DSCombatTracker;
  CONFIG.ui.chat = DSChatlog;
  CONFIG.ui.pause = DSPause;
  CONFIG.ui.hotbar = DSHotbar;

  const iconFolder = "systems/darkspace/icons/";

  /* Defining the status effects that can be applied to tokens. */

  // CONFIG.statusEffects = [
  //   {
  //     icon: iconFolder + "dizzy-solid.svg",
  //     id: "struck",
  //     label: "Angeschlagen",
  //   },
  //   {
  //     icon: iconFolder + "times-circle-solid.svg",
  //     id: "ko",
  //     label: "Außer Gefecht",
  //   },
  //   {
  //     icon: iconFolder + "band-aid-solid.svg",
  //     id: "wounded",
  //     label: "Verwundet",
  //   },
  //   {
  //     icon: iconFolder + "user-injured-solid.svg",
  //     id: "crippled",
  //     label: "Verkrüppelt",
  //   },
  //   { icon: iconFolder + "skull-solid.svg", id: "dead", label: "Tod" },
  // ];

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("darkspace", DSItemSheet, { makeDefault: true });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("darkspace", DSCharacterSheet, { makeDefault: true });

  game.settings.register("darkspace", "debugmode", {
    name: "Debug Optionen aktivieren",
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register("darkspace", "startxp", {
    name: "Start-Erfahrung für Charaktere",
    config: true,
    type: Number,
    default: 2000,
  });
  game.settings.register("darkspace", "startxpai", {
    name: "Start-Erfahrung für KI-Charaktere",
    config: true,
    type: Number,
    default: 2000,
  });

  preloadHandlebarsTemplates();
});

Hooks.once("ready", function () {
  const isGM = game.users.current.isGM;
  const gameVersion = game.version;
  console.log("Dark Space Version " + gameVersion + " loaded.");
  console.log(game);
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
  console.log("createDSMacro",data,slot);
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }

  const item = await Item.fromDropData(data);
  
  // Create the macro command
  const command = `game.darkspace.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "darkspace.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  console.log(marco,slot);
  return true;

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

  const activeItem = actor.items.get(item.id);

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

  console.log(itemName,inputData);
  // Trigger the item roll
  DSMechanics.modRolls(inputData, {});
}

//Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html)); //Wird gebraucht um in eine interaktive Nachricht in der Sidebar zu erzeugen
