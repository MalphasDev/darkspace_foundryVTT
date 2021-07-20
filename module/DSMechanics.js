
export function rollDice(rollDiceData) {

    const actorData = rollDiceData.actorData
    const actorId = rollDiceData.actorId
    let dynattr = rollDiceData.dynattr
    let dynskill = rollDiceData.dynskill
    let attrMod = rollDiceData.attrMod
    let fertMod = rollDiceData.fertMod
    let roleData = rollDiceData.roleData
    let rollglobal = rollDiceData.rollglobal
    let removehighest = rollDiceData.removehighest


    let rollformular

        // ------------------------------------- //
        // Custom Roll und globale Modifikatoren //
        // ------------------------------------- //
        
        if (rollglobal === true) {
            dynattr += attrMod;
            dynskill += fertMod;
            
            if (removehighest != true) {
                rollformular = dynattr + "d10x10kh2+" + dynskill;
                
            } else {
                rollformular = dynattr + "d10x10kh3dh1+" + dynskill;
            }
        } else {
            rollformular = dynattr + "d10x10kh2+" + dynskill;
        }
        var rollResult = new Roll(rollformular, actorData).roll();


    // --------------------- //
    // Krit und Patzer Logik //
    // --------------------- //
    
    let krit = rollResult.terms[0].results.map( (c) => { return c.result; }).sort((a,b) => b - a);
    let resultMessage = "";
    let disadvMessage = "";
    if (krit[2] >= 9) { resultMessage = {msg: "KRITISCHER ERFOLG"}; }
    if (rollResult.total <= 9) { resultMessage = {msg: "PATZER"} }
    if (removehighest) { disadvMessage = {disadv: "Erschwert"} }


    let messageData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    };
        
    let dices = [];
    for (var i = 0; i < rollResult.terms[0].results.length; i++) {
        dices.push(rollResult.terms[0].results[i].result)
    }
    let fullDice = dices.sort( (a,b) => (b - a) )
    let evalDice = [fullDice[0], fullDice[1]]
    let kritDice = [fullDice[2]]
    let unEvalDice = fullDice.splice(3,100)
        
    let diceResult = {
        evalDice: evalDice,
        kritDice: kritDice,
        unEvalDice: unEvalDice
    }
        
    let cardData = {
        ...this.data,
        ...roleData,
        ...rollResult,
        ...diceResult,
        ...resultMessage,
        ...disadvMessage,
        owner: actorId
    }
    let outputData = {
        messageData: messageData,
        cardData: cardData
    }
    return outputData;
}