export default class DSCombatant extends Combatant {
  async rollInitiative() {
    console.log("rollInitiative");
  }
  async _preCreate(data, options, userID) {
    await super._preCreate(data, options, userID);
    console.log("preCreate");
  }
  async _onCreate(data, options, userID) {
    await super._onCreate(data, options, userID);
    this.setFlag("darkspace", "target", false);

    const combatantId = this.id;
    const combatantData = this.data;

    console.log("onCreate");
    console.log(combatantId);
    console.log(combatantData);
    console.log(this.actor);
    console.log(this.combat);
    console.log(this._getInitiativeFormula());
  }
  async _preUpdate(data, options, userID) {
    await super._preUpdate(data, options, userID);
    console.log("preUpdate");
  }
  async _onUpdate(data, options, userID) {
    console.log("onUpdate");
    await super._onCreate(data, options, userID);
    if (this.data.defeated) {
      this.data.update({
        initiative: null,
      });
    }
  }
}
