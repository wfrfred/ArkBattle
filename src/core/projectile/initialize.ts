import type { State as BattleState, Result } from "../battle/state.js";
import { assertNonnegativeNumber } from "../common/assert.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Side } from "../side.js";
import type { Definition } from "./definition.js";
import type { AdditionalFields, Projectile } from "./projectile.js";
import type { Slowable } from "./slowable.js";

export type Input<S extends object, T extends object = object> = {
    readonly definition: Definition<S, T>;
    readonly position: WorldPosition;
    readonly side: Side;
    readonly state: NoInfer<S>;
    readonly move?: Slowable["move"];
    readonly id?: never;
    readonly lifecycle?: never;
} & NoInfer<AdditionalFields<T>>;

export function initialize<S extends object, T extends object>(
    battle: BattleState,
    input: Input<S, T>,
): Result<Projectile<S, T>> {
    const contributions = input.move?.contributions ?? [];
    if (new Set(contributions.map(({ id }) => id)).size !== contributions.length) {
        throw new TypeError("duplicate projectile movement contribution id");
    }
    for (const { value } of contributions) {
        assertNonnegativeNumber(value, "projectile movement scale");
    }

    const id = battle.execution.nextProjectileId;

    return {
        state: { ...battle, execution: { ...battle.execution, nextProjectileId: id + 1 } },
        value: { ...input, id, lifecycle: "ACTIVE" },
    };
}
