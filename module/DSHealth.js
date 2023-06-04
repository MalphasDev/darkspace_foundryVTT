import {getStat} from "./DSMechanics.js";
import {darkspace as config} from "./config.js"

export function getHealth(primary, size) {
  const armorMultiplier = [0, 1, 2, 3, 4];
  const realSize = size === undefined ? 5 : size

  return Array.from(armorMultiplier, (x) => x * 5 + 2*realSize + primary);
}

export function getMonitor(label,primary,insize,condName,armor) {
  let basesize = insize === undefined ? 5 : insize
  let monitor
  Object.keys(label).forEach((element, index) => {
    monitor = {
      ...monitor,
      [element]: {
        name: condName[element],
        fontsymbol: label[element].symbol,
        hitBase: getHealth(primary, basesize)[index],
        hit: getHealth(
          primary + armor,
          basesize
        )[index],
        hitHeal: getHealth(
          primary - armor,
          basesize
        )[index],
      },
    };
  });
  return monitor
}