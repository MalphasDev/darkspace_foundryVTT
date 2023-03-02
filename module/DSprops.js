import * as darkspace from "./config.js";
export default class Prop {
  constructor(value) {
    //const element = event.currentTarget;
    //const system = this.object.system;
    //const dataset = element.dataset;
    //const slotIdent = "slot" + dataset.index;
    this.value = value;
  }
}
export function edit(event, context) {
  const element = event.currentTarget;
  const system = context.object.system;
  const dataset = element.dataset;
  const slotIdent = "slot" + dataset.index;
  const propAdresse = "system.props." + slotIdent;

  const propData = {
    ...context.object,
    ...system.props[slotIdent],
    prop: system.props[slotIdent].prop,
    action: system.props[slotIdent].action,
    descAdresse: propAdresse + ".desc",
    handicapAdresse: propAdresse + ".handicap",
    slot: slotIdent,
    ownertype: context.object.type,
    config: darkspace.darkspace,
  };

  return propData;
}
export function getProps() {
  // Hier sollen die fertigen Eigenschaften mit Name und Regeln rein, damit sie später per Dropdown(?) auswählen kann.
  const props = [{}];
  return props;
}
export function getHandicaps() {}
export function getTechProps() {}
export function getTechhandicaps() {}
export function getCombatProps() {}
export function getCombatHandicaps() {}
