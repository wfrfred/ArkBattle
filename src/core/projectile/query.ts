import type { Ref } from "../common/ref.js";
import type { Query } from "../common/query.js";
import type { State as BattleState } from "../battle/state.js";
import type { Eliminatable, Projectile } from "./projectile.js";

export function ref<P extends Projectile<object, any>>(self: P): Ref<P> {
    return { id: self.id, get: getProjectile } as Ref<P>;
}

export function all(battle: BattleState): Query<Projectile> {
    return battle.battlefield.projectiles.values() as Query<Projectile>;
}

function getProjectile(this: object, battle: BattleState): Projectile | undefined {
    const { id } = this as Ref<Projectile>;

    return battle.battlefield.projectiles.get(id);
}

export function hasEliminatable<P extends Projectile<object, any>>(
    self: P,
): self is P & Eliminatable {
    return "eliminatable" in self.definition && self.definition.eliminatable === true;
}
