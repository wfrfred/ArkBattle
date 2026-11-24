import type { State as BattleState, Result } from "../battle/state.js";
import { replaceIn } from "../common/object.js";
import { createRef, type Identity } from "../common/ref.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Side } from "../side.js";
import type { Definition } from "./definition.js";
import type { Projectile } from "./projectile.js";

export type Input<S extends object, T extends object = object> = {
    readonly definition: Definition<S, T>;
    readonly position: WorldPosition;
    readonly side: Side;
    readonly state: NoInfer<S>;
} & NoInfer<T>;

export function initialize<S extends object, T extends object, const D extends Definition<S, T>>(
    battle: BattleState,
    input: Input<S, T> & { readonly definition: D },
): Result<Projectile<S, T> & T & { readonly definition: D }> {
    const id = battle.execution.nextProjectileId;

    return {
        state: replaceIn(battle, ["execution", "nextProjectileId"], id + 1),
        value: {
            ...input,
            id,
            ref: createRef<Projectile>({ id }, getProjectile),
            lifecycle: "ACTIVE",
        },
    };
}

function getProjectile(this: object, battle: BattleState): Projectile | undefined {
    const { id } = this as Identity<Projectile>;
    const projectile = battle.battlefield.projectiles.get(id);

    return projectile?.ref === this ? projectile : undefined;
}
