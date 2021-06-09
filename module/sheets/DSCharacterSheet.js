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



        //Talent-Sortierung - Eventuell unbrauchbar?
        let inventarspace = data.items.length; //Inventargröße ermitteln
        
        if (inventarspace > 0) { //IF Statement. Wird dies aufgerufen, wenn keine Items vorhanden sind, gibt Foundry einen Fehler aus
        for (var i = 0; i < inventarspace; i++) { //Schleife durch Inventar
            if (data.items[i].data.attribut != undefined) { //Ausfiltern aller Nicht-Talente
                const talentByName = data.items[i].name; //Talentname speichern
                const talentByAttr = data.items[i].data.attribut; //Unter Talente > attribut (template.json) abgelegter Wert schreiben
                console.log(data.items[i].name); //Debug Consolen-Ausgabe
                
                data.Talentarray = {talentByName, talentByAttr};

                console.log(data.Talentarray); //Debug Consolen-Ausgabe
                console.log(data.Talentlist);
            }
        };
        }
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

        const currentIndex = dataset.index;
        console.log(currentIndex);

        const newIndex = dataset.index;
        console.log(newIndex);

        var counter = element.getAttribute("data-index");
        console.log(counter)
        counter.classList.add("active");

        

        
    }
   
}
