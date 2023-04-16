import {getStat} from "./DSMechanics.js";

export function getHealth(primary, secondary) {
  const armorMultiplier = [1, 2, 4, 6, 8];
  return Array.from(armorMultiplier, (x) => x * primary + secondary);
}

