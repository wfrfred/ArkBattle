import type { State as BattleState } from "../battle/state.js";
import type { Unit } from "./unit.js";
import { create, type Query } from "../common/query.js";

export { ref } from "../common/ref.js";

export function all(battle: BattleState): Query<Unit> {
    return create(() => battle.battlefield.units.values());
}
