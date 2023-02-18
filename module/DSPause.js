export class DSPause extends Pause {
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "pause";
    options.template = "systems/darkspace/templates/hud/pause.html";
    options.popOut = false;
    return options;
  }

  /** @override */
  getData(options = {}) {
    return { paused: game.paused };
  }
}
