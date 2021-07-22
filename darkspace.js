import {darkspace} from './module/config.js';
import DSItemSheet from './module/sheets/DSItemSheet.js';
import DSItem from './module/sheets/DSItem.js';
import DSCharacter from './module/sheets/DSCharacter.js';
import DSCharacterSheet from './module/sheets/DSCharacterSheet.js';
import DSCombat from './module/DSCombat.js';
import DSCombatTracker from './module/DSCombatTracker.js';
import DSCombatant from './module/DSCombatant.js';
import DSNebencharakter from './module/sheets/DSNebencharakter.js';

async function preloadHandlebarsTemplates () {
    const templatePaths = [

        //Charakter-Partials
        "systems/darkspace/templates/partials/character-sheet-header.html",
        "systems/darkspace/templates/partials/character-sheet-stat-block.html",
        "systems/darkspace/templates/partials/character-sheet-items.html",
        "systems/darkspace/templates/partials/character-sheet-combat.html",

        "systems/darkspace/templates/partials/sub-partials/rollcustomdice.html",

        //Sub-Partials
            //Stats
            "systems/darkspace/templates/partials/sub-partials/stat-artificals.html",
            "systems/darkspace/templates/partials/sub-partials/stat-block.html",
            "systems/darkspace/templates/partials/sub-partials/stat-feature.html",
            "systems/darkspace/templates/partials/sub-partials/stat-talent.html",
            "systems/darkspace/templates/partials/sub-partials/stat-health.html",

            //Combat
            "systems/darkspace/templates/partials/sub-partials/combat-armor.html",
            "systems/darkspace/templates/partials/sub-partials/combat-weapons.html",
            "systems/darkspace/templates/partials/sub-partials/combat-initiative.html",

            //Items
            "systems/darkspace/templates/partials/sub-partials/items-header.html",
            "systems/darkspace/templates/partials/sub-partials/items-item.html",
            "systems/darkspace/templates/partials/sub-partials/items-rep.html",
            "systems/darkspace/templates/partials/sub-partials/items-quarter.html",

        //NPCs
        "systems/darkspace/templates/sheets/actors/Nebencharakter-sheet.html",
        "systems/darkspace/templates/sheets/actors/DrohneFahrzeug-sheet.html",

        
        //Items
        "systems/darkspace/templates/partials/MKSize.html",
        "systems/darkspace/templates/dice/dice-sub-partials/dice-msg.html",

        //Misc
        "systems/darkspace/templates/partials/sub-partials/misc-notes.html",
        "systems/darkspace/templates/partials/sub-partials/misc-collapsibleModuls.html",
        "systems/darkspace/templates/partials/sub-partials/misc-properties.html",
        "systems/darkspace/templates/dice/dialogModRolls.html",

        //Dialog
        "systems/darkspace/templates/dice/dialog-sub-partials/dialogMkSize.html",
        "systems/darkspace/templates/dice/dialog-sub-partials/dialogProperties.html",
        "systems/darkspace/templates/dice/dialog-sub-partials/dialogName.html",
        "systems/darkspace/templates/dice/dialog-sub-partials/dialogDescMod.html",
        
        "systems/darkspace/templates/dice/dialog-sub-partials/dialogWeapon.html",
        "systems/darkspace/templates/dice/dialog-sub-partials/dialogArmor.html",
        "systems/darkspace/templates/dice/dialog-sub-partials/dialogHomeProperties.html",
        
        //Chat
        "systems/darkspace/templates/dice/chatWeapon.html",
        "systems/darkspace/templates/dice/dice-sub-partials/dice-msg.html",
        
        //Foundry UI-Overwrite
        "systems/darkspace/templates/sidebar/combat-tracker.html",
        "systems/darkspace/templates/sidebar/customAE.html"
    ];
    return loadTemplates(templatePaths);
};

console.log("Hook-Function");
Hooks.once("init", function() {
    console.log("DS | Initialisierung System");

    CONFIG.Combat.entityClass = DSCombat;
    CONFIG.ui.combat = DSCombatTracker;
    CONFIG.Combatant.entityClass = DSCombatant;
    CONFIG.darkspace = darkspace;
    CONFIG.Actor.entityClass = DSCharacter;
    CONFIG.Item.entityClass = DSItem;
    
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("darkspace", DSItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("darkspace", DSCharacterSheet, {makeDefault: true});
    Actors.registerSheet("darkspace", DSNebencharakter, {makeDefault: true});

    preloadHandlebarsTemplates();
    
    game.settings.register("darkspace", "ae_input", {
        name: "Eingabemethode für Aktionseinheiten",
        hint: "Wähle, ob du einen Slider oder Buttons für die Eingabe der AE-Kosten benutzen möchtest. Dieses Fenster muss neu geladen werden, damit die Änderung wirksam",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "ae_button": "Buttons",
            "ae_slider": "Slider"
        },
        default: "ae_button",
        onChange: value => {
            console.log(value)
        }
    })

    Handlebars.registerHelper("strToHTML", function (str) {

        var dom = document.createElement('div');
        console.log(dom);
        console.log(typeof str);
        console.log(str);
        dom.innerHTML = str;
        console.log(dom);
        return dom;
    
    });
    Handlebars.registerHelper("disabled", function (condition) {
        let d = "";
        if (condition != null || undefined) {d = "disabled"} else {d = "enabled"}
        return d
    })

});
//Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html)); //Wird gebraucht um in eine interaktive Nachricht in der Sidebar zu erzeugen