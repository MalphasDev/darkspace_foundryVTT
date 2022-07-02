export default class DSSocketHandler {
  static async updateInitRoll(data) {
    console.log("Socket: updateInitRoll");
    console.log(data);
    console.log(game);
    console.log(game.user.isGM);
    if (game.user.isGM) {
      console.log("User ist GM");
      console.log(actor);
      console.log(combatant);
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
