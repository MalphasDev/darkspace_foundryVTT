export default class DSCombatant extends Combatant {

    sortRelative() {
        super.sortRelative();
        console.log("+++ sortRelative +++");
        
        console.log(this);
    }

}