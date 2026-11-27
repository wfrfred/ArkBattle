import type { Query } from "../common/query.js";
import type { State as BattleState } from "../battle/state.js";
import type { Eliminatable, Projectile } from "./projectile.js";

export { ref } from "../common/ref.js";

export function all(battle: BattleState): Query<Projectile> {
    return battle.battlefield.projectiles.values();
}

export function hasEliminatable<P extends Projectile>(self: P): self is P & Eliminatable {
    return "eliminatable" in self.definition && self.definition.eliminatable === true;
}
