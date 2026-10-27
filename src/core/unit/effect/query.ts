import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import * as units from "../query.js";
import type { View } from "./effect.js";

export function get<E extends View>(battle: BattleState, ref: Ref<E>): E | undefined {
    return units.get(battle, ref.host)?.effects.get(ref);
}
