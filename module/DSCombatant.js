export default class DSCombatant extends Combatant {
  async _preCreate(data, options, userID) {
    await super._preCreate(data, options, userID);
  }
  async _onCreate(data, options, userID) {
    await super._onCreate(data, options, userID);
    this.setFlag("darkspace", "target", false);
  }
  async _preUpdate(data, options, userID) {
    await super._preUpdate(data, options, userID);
  }
  async _onUpdate(data, options, userID) {
    await super._onCreate(data, options, userID);
    if (this.data.defeated) {
      this.data.update({
        initiative: null,
      });
    }
  }
}
