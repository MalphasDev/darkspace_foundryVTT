export default class DSCharakcterSheet extends ActorSheet {
    
    
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/darkspace/templates/sheets/Character-sheet.html",
            classes: ["darkspace", "sheet", "Charakter"],
            width: 800,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats"}]
        });
    }
    

    getData() {
        let data = super.getData();
        
        data.config = CONFIG.darkspace;

        //Betäubungen abrufen

        console.log("++++++++++ Betäubung abrufen ++++++++++");
        
        data.data.data.bruises.value = 3;
        console.log("Aktuelle Betaubungen:" + data.data.data.bruises.value);

        data.Waffe = data.items.filter(function (item) {return item.type == "Waffe"});
        data.Artifizierung = data.items.filter(function (item) {return item.type == "Artifizierung"});
        data.Panzerung = data.items.filter(function (item) {return item.type == "Panzerung"});
        data.Talent = data.items.filter(function (item) {return item.type == "Talent"});
        data.Module = data.items.filter(function (item) {return item.type == "Module"});
        data.Unterbringung = data.items.filter(function (item) {return item.type == "Unterbringung"});
        data.Gegenstand = data.items.filter(function (item) {return item.type == "Gegenstand"});

        return data;
    }
    
    

    activateListeners(html) {
        /* html.find(cssSelector).event(this._someCallBack.bind(this)); <---- Template */

        super.activateListeners(html);
        html.find(".item-edit").click(this._onItemEdit.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".roleable").click(this._onRollItem.bind(this));
        html.find(".checkcounter").click(this._onChangeCounter.bind(this));

        var slider = document.getElementById("bruises_slider");
        var output = document.getElementById("bruises_value");

        
        /*
        slider.oninput = function() {
            output.innerHTML = this.value;

            var outputval = output.innerHTML; /**Holt sich den Inhalt des HTML Elements */
        /*    outputval = parseInt(outputval, 10); /**Konvertiert den Inhalt in einen Int */
                
        /*    if (outputval == 5) { /**!!!!!!!   5 durch das bruises-max ersetzem!!!!!!!! */
        /*        console.log("if statement Erfolgreich"); /**Abfrage für spätere Zustände abhängig von Zustand */
                
        /*    }
          }
        */

        
    
        
    

    }
    _onRollItem(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        console.log(dataset.rolltype);

        if (dataset.rolltype) {
            var dynattr;
            var dynskill;
            
            if (dataset.rolltype == "skill") {
                dynattr = this.object.data.data.charattribut[dataset.attr].attribut;
                dynskill = this.object.data.data.charattribut[dataset.attr].skill[dataset.skill];
            }

            if (dataset.rolltype == "combat") {
                
                var skillident = dataset.skill;
                if (["Kampftechnik", "Schusswaffen"].includes(skillident)) {var attrident = "Geschick";}
                if (["Nahkampfwaffen", "Unterstützungswaffen"].includes(skillident)) {var attrident = "Konstitution";}
                /*console.log(data.actor.data.data.charattribut[attrident].skill[skillident]);*/
                console.log(this.object.data.data.charattribut[attrident].skill[skillident]);
                dynattr = this.object.data.data.charattribut[attrident].attribut;
                dynskill = this.object.data.data.charattribut[attrident].skill[skillident];
            }

            if (dataset.rolltype == "custom") {

            }

            console.log(dynattr + "d10kh2+" + dynskill);
            let rollformular = dynattr + "d10kh2+" + dynskill;
            let roll = new Roll(rollformular, this.actor.data.data);
            let label = dataset.label ? `${dataset.label}` : '';

            const myDialogOptions = {
                width: 200,
                height: 400,
                top: 500,
                left: 500
              };

            const myDialog = new Dialog({
                title: "My Dialog Title",
              content: `My dialog content`,
              buttons: {
                button1: {
                    label: "Normale Probe",
                    callback: () => {
                        roll.roll().toMessage({
                            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                            flavor: label
                          });    
                    },
                    icon: `<i class="fas fa-check"></i>`
                  },
                  button2: {
                    label: "Button #2",
                    callback: () => {
                        new Dialog({
                            title: "My Dialog Title",
                            content: "My dialog content",
                            buttons: {}
                          }, myDialogOptions).render(true);},
                    icon: `<i class="fas fa-times"></i>`
                  },
                  
              }
            }).render(true);

            
        }
    }
    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.getOwnedItem(itemId);
        item.sheet.render(true);
    }
    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        return this.actor.deleteOwnedItem(itemId); /* <-- Wird in Foundry VTT 9.x ersetzt */
    }
    _onChangeCounter(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        var current_bruises = event.currentTarget.dataset.index;
        var shown_bruises;

        current_bruises = parseInt(current_bruises, 10);
        for (var i = 0; i != current_bruises; i++) { /**Erzeugt die Variable, die dann in die JSON gepackt wird */
            shown_bruises = i + 1;
        }
        this.object.data.data.bruises.value = shown_bruises; // Schreibt die Variable in die JSON

        console.log("-----------------------------");
        console.log(this.object.data.data.bruises.value + " Betäubungen davor");
        console.log(shown_bruises + " Betäubungen");

        var changeBoxesArray = [];  // Index der auszufüllenden Boxen
        var changeBoxes = 0;        // Zur Bestimmung der Schleifendurchläufe der leerenden Boxen
        var maxBruises = this.object.data.data.bruises.max; // Maximal mögliche Betäubungen

        var cleanBoxesArray = [];

        for (var i = 0; i < shown_bruises ;i++) {           // Füllt alle DOM-Elemente mit der "active"-Klasse, die links vom gewälten Kästchen sind.
            changeBoxesArray.push(i+1);
            changeBoxes = changeBoxesArray.length;
            document.querySelectorAll("span[data-index]")[i].className += " active"; 
        }
        for (var i = changeBoxes; i < maxBruises; i++) {    // Entfernen aller nicht mehr notwendigen Boxen
            cleanBoxesArray.push(i+1);
            document.querySelectorAll("span[data-index]")[i].className = "checkcounter";
        }
        /*
        console.log("Ausgefüllte Boxen: "+changeBoxesArray)
        console.log("Geänderte Boxen: "+emptyBoxesArray);
        console.log("Max. Betäubungen: "+maxBruises);
        
        console.log("-----------------------------");
        console.log(document.querySelectorAll("span[data-index]")[changeBoxes-1].className)
        console.log("Geleerte Boxen: "+cleanBoxesArray);
        */
    }
   
}
