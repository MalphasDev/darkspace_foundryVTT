import {darkspace} from './module/config.js';
import DSItemSheet from './module/sheets/DSItemSheet.js';
import DSCharacterSheet from './module/sheets/DSCharacterSheet.js';

async function preloadHandlebarsTemplates () {
    const templatePaths = [
        "systems/darkspace/templates/partials/character-sheet-header.html",
        "systems/darkspace/templates/partials/character-sheet-stat-block.html",
    ];
    console.log("Rufe loadTemplates auf.");
    return loadTemplates(templatePaths);
    console.log("Funktion loadTemplates geladen.");
    console.log("Geladene Elemente:" + templatePaths)
};

console.log("Hook-Function");
Hooks.once("init", function() {
    console.log("DS | Initialisierung System");

    CONFIG.darkspace = darkspace;

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


