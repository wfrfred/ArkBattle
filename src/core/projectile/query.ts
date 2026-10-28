import type { Ref } from "../common/ref.js";
import type { Query } from "../common/query.js";
import type { State as BattleState } from "../battle/state.js";
import type { Projectile } from "./projectile.js";

export function ref<P extends Projectile<any>>(self: P): Ref<P> {
    return { id: self.id } as Ref<P>;
}

export function all(battle: BattleState): Query<Projectile> {
    return battle.battlefield.projectiles.values();
}

export function get<P extends Projectile<any>>(
    battle: BattleState,
    reference: Ref<P>,
): P | undefined {
    return battle.battlefield.projectiles.get(reference);
}
