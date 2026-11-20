import type { Ref } from "../common/ref.js";
import type { Query } from "../common/query.js";
import type { State as BattleState } from "../battle/state.js";
import type { Eliminatable, Projectile, ProjectileFields } from "./projectile.js";

export function ref<P extends ProjectileFields<any, any>>(self: P): Ref<P> {
    return { id: self.id } as Ref<P>;
}

export function all(battle: BattleState): Query<Projectile> {
    return battle.battlefield.projectiles.values();
}

export function get<P extends ProjectileFields<any, any>>(
    battle: BattleState,
    reference: Ref<P>,
): P | undefined {
    return battle.battlefield.projectiles.get(reference);
}

export function hasEliminatable<P extends ProjectileFields<any, any>>(
    self: P,
): self is P & Eliminatable {
    return "eliminatable" in self.definition && self.definition.eliminatable === true;
}
