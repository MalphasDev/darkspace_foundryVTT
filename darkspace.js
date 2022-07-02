import { darkspace } from "./module/config.js";
import DSItemSheet from "./module/sheets/DSItemSheet.js";
import DSItem from "./module/sheets/DSItem.js";
import DSCharacter from "./module/sheets/DSCharacter.js";
import DSCharacterSheet from "./module/sheets/DSCharacterSheet.js";
import DSCombat from "./module/DSCombat.js";
import DSCombatant from "./module/DSCombatant.js";
import DSCombatTracker from "./module/DSCombatTracker.js";
import DSNebencharakter from "./module/sheets/DSNebencharakter.js";
import DSSocketHandler from "./module/socket.js";

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    //Charakter-Partials
    "systems/darkspace/templates/partials/character-sheet-header.html",
    "systems/darkspace/templates/partials/character-sheet-items.html",
    "systems/darkspace/templates/partials/character-sheet-combat.html",
    "systems/darkspace/templates/partials/character-sheet-downtime.html",
    "systems/darkspace/templates/partials/sub-partials/rollcustomdice.html",

    //Sub-Partials
    //Stats
    "systems/darkspace/templates/partials/sub-partials/stat-artificals.html",
    "systems/darkspace/templates/partials/sub-partials/stat-block.html",
    "systems/darkspace/templates/partials/sub-partials/stat-property.html",
    "systems/darkspace/templates/partials/sub-partials/stat-health.html",

    //Combat
    "systems/darkspace/templates/partials/sub-partials/combat-armor.html",
    "systems/darkspace/templates/partials/sub-partials/combat-weapons.html",
    "systems/darkspace/templates/partials/sub-partials/combat-initiative.html",
    "systems/darkspace/templates/partials/sub-partials/combat-fastCombat.html",
    "systems/darkspace/templates/partials/sub-partials/combat-protection.html",

    //Items
    "systems/darkspace/templates/partials/sub-partials/items-header.html",
    "systems/darkspace/templates/partials/sub-partials/items-item.html",
    "systems/darkspace/templates/partials/sub-partials/items-quarter.html",
    "systems/darkspace/templates/partials/sub-partials/items-medkits.html",
    "systems/darkspace/templates/partials/sub-partials/items-tools.html",
    "systems/darkspace/templates/partials/sub-partials/items-terminals.html",
    "systems/darkspace/templates/partials/sub-partials/items-weapons.html",

    //NPCs
    "systems/darkspace/templates/sheets/actors/Nebencharakter-sheet.html",
    "systems/darkspace/templates/sheets/actors/DrohneFahrzeug-sheet.html",

    //Items
    "systems/darkspace/templates/partials/MKSize.html",
    "systems/darkspace/templates/dice/dice-sub-partials/dice-msg.html",

    //Misc
    "systems/darkspace/templates/partials/sub-partials/misc-notes.html",
    "systems/darkspace/templates/partials/sub-partials/misc-properties.html",
    "systems/darkspace/templates/partials/sub-partials/misc-downtime.html",

    //Sub-Sub-Partials
    "systems/darkspace/templates/partials/sub-partials/sub-stat-collapsible.html",

    //Dialog
    "systems/darkspace/templates/dice/dialog-sub-partials/dialogMkSize.html",
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
  ];
  return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
  console.log("DS | Initialisierung System");

  CONFIG.Combat.documentClass = DSCombat;
  CONFIG.Combatant.documentClass = DSCombatant;
  CONFIG.ui.combat = DSCombatTracker;
  CONFIG.darkspace = darkspace;
  CONFIG.Actor.documentClass = DSCharacter;
  CONFIG.Item.documentClass = DSItem;

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
  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper("ifGE", function (arg1, arg2, options) {
    return arg1 >= arg2 ? options.fn(this) : options.inverse(this);
  });

  game.socket.on("system.darkspace", (data) => {
    if (data.operation === "updateInitRoll") {
      DSSocketHandler.updateInitRoll(data);
    }
  });
});
//Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html)); //Wird gebraucht um in eine interaktive Nachricht in der Sidebar zu erzeugen
