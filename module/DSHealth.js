import {getStat} from "./DSMechanics.js";
import {darkspace as config} from "./config.js"

export function getHealth(primary, size) {
  return Array.from([0, 1, 2, 3, 4], (x) => (x * 5) + primary + size?? 5);
}

export function getMonitor(label,primary,insize,armor) {
  let basesize = insize?? 5;
  let monitor;
 
  Object.keys(label).forEach((element, index) => {
    monitor = {
      ...monitor,
      [element]: {
        name: game.i18n.translations.darkspace[element],
        fontsymbol: label[element].symbol,
        hitBase: getHealth(primary, basesize)[index],
        hit: getHealth(
          primary + armor,
          basesize
        )[index],
        hitHeal: getHealth(
          primary,
          basesize
        )[index],
      },
    };
  });

  return monitor
}