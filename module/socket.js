export default class DSSocketHandler {
  static async updateInitRoll(data) {
    if (game.user.isGM) {
      const actor = data.message.speaker.actor;
      const combatant = game.combat.data.combatants.find(
        (c) => c.actor.id === actor
      );
      const update = {
        id: combatant.id,
        initiative: data.update.content,
      };
      console.log("updateInitRoll update-Objekt");
      console.log(update);
      await combatant.update(update);
    }
  }
}
