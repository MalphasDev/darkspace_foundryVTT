import {darkspace} from './module/config.js';
import DSItemSheet from './module/sheets/DSItemSheet.js';
import DSItem from './module/sheets/DSItem.js';
import DSCharacter from './module/sheets/DSCharacter.js';
import DSCharacterSheet from './module/sheets/DSCharacterSheet.js';
import DSCombat from './module/DSCombat.js';
import DSCombatTracker from './module/DSCombatTracker.js';
import DSCombatant from './module/DSCombatant.js';

async function preloadHandlebarsTemplates () {
    const templatePaths = [
        "systems/darkspace/templates/partials/character-sheet-header.html",
        "systems/darkspace/templates/partials/character-sheet-stat-block.html",
        "systems/darkspace/templates/partials/MKSize.html",
        "systems/darkspace/templates/partials/character-sheet-items.html",
        "systems/darkspace/templates/partials/character-sheet-combat.html"
    ];
    console.log("Rufe loadTemplates auf.");
    console.log("Funktion loadTemplates geladen.");
    console.log("Geladene Elemente:" + templatePaths)
    return loadTemplates(templatePaths);
};

console.log("Hook-Function");
Hooks.once("init", function() {
    console.log("DS | Initialisierung System");

    CONFIG.darkspace = darkspace;
    CONFIG.Actor.entityClass = DSCharacter;
    CONFIG.Item.entityClass = DSItem;
    CONFIG.Combat.entityClass = DSCombat;
    CONFIG.ui.combat = DSCombatTracker;
    CONFIG.Combatant.entityClass = DSCombatant;

    console.log("ItemSteet");
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("darkspace", DSItemSheet, {makeDefault: true});
    console.log("ItemSteet done");

    console.log("ActorsSheet");
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("darkspace", DSCharacterSheet, {makeDefault: true});
    console.log("ActorsSheet done");

    preloadHandlebarsTemplates();
});


