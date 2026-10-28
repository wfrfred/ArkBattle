import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import * as units from "../query.js";
import type { Unit } from "../unit.js";
import type { Effect } from "./effect.js";

export function get<E extends Effect<any, any>>(battle: BattleState, ref: Ref<E>): E | undefined {
    return units.get<Unit>(battle, ref.host)?.effects.get(ref);
}
