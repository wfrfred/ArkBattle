import type { Ref } from "../common/ref.js";
import type { Query } from "../common/query.js";
import type { State as BattleState } from "../battle/state.js";
import type { View } from "./projectile.js";

export function ref<P extends View>(self: P): Ref<P> {
    return { id: self.id } as Ref<P>;
}

export function all(battle: BattleState): Query<View> {
    return battle.battlefield.projectiles.values();
}

export function get<P extends View>(battle: BattleState, reference: Ref<P>): P | undefined {
    return battle.battlefield.projectiles.get(reference);
}
