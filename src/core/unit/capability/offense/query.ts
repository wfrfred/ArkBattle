import type { State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as attribute from "../../attribute.js";
import type { Offense } from "./capability.js";

export function resolveAttack(battle: BattleState, self: Unit & Offense): number {
    return attribute.resolve(self.definition.offense.attack, self.offense.attack, battle, self);
}
