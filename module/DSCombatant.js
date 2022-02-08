export default class DSCombatant extends Combatant {
  async _preCreate(data, options, userID) {
    await super._preCreate(data, options, userID);
    //console.log("++++++++++++++++++++++++++PRE++++++++++++++++++++++++++");
    this.data.update({
      flags: {
        darkspace: {
          target: false,
          test: false,
          // Any additional flags you want here too
        },
      },
    });
  }
  async _onCreate(data, options, userID) {
    await super._onCreate(data, options, userID);
    //console.log("++++++++++++++++++++++++++ON++++++++++++++++++++++++++");
  }
  async _preUpdate(data, options, userID) {
    await super._preUpdate(data, options, userID);
  }
  async _onUpdate(data, options, userID) {
    await super._onCreate(data, options, userID);
    console.log(
      this.data.document.name + ": " + this.data.flags.darkspace.target
    );
  }
}
