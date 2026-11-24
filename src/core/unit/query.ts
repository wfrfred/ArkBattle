import type { State as BattleState } from "../battle/state.js";
import type { Unit } from "./unit.js";
import type { Ref } from "../common/ref.js";
import { create, type Query } from "../common/query.js";

export function ref<U extends Unit>(unit: U): Ref<U> {
    return { id: unit.id, get: getUnit } as Ref<U>;
}

export function all(battle: BattleState): Query<Unit> {
    return create(() => battle.battlefield.units.values());
}

function getUnit(this: object, battle: BattleState): Unit | undefined {
    const { id } = this as Ref<Unit>;

    return battle.battlefield.units.get(id);
}
