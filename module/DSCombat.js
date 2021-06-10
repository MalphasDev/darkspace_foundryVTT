export default class DSCombat extends Combat {

    rollInitiative(ids, options) {
        super.rollInitiative(ids, options);
        console.log("+++ Combat-Klasse // rollInitiative-Methode +++");


        
        // var initA = this.current.tokenId;
        // var initB = this.tokenId.tokenId;

        // console.log(initA - initB);
    }
    
    
    
}