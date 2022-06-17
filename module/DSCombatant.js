export default class DSCombatant extends Combatant {
  async _onCreate(data, options, userID) {
    await super._onCreate(data, options, userID);
    this.setFlag("darkspace", "target", false);
  }

  async _onUpdate(data, options, userID) {
    await super._onUpdate(data, options, userID);
    if (this.data.defeated) {
      this.data.update({
        initiative: null,
      });
    }

    console.log(this.name);
    console.log(this.data.initiative);
  }
}
