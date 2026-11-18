import type * as contribution from "../../../common/contribution.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";
import type { Unit } from "../../unit.js";
import { createRegistrationOperations } from "../../registration.js";

export type Direction = "LEFT" | "RIGHT";

export interface RestrictionContext {
    readonly self: Unit & Facing;
    readonly direction: Direction;
}

export type Restriction = BaseRestriction<RestrictionContext>;

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface Definition extends Restrictions {}

export interface Initial {
    readonly direction: Direction;
}

export interface State extends Restrictions {
    readonly direction: Direction;
}

export interface Facing {
    readonly definition: { readonly facing: Definition };
    readonly facing: State;
}

export function hasFacing<U extends Unit>(unit: U): unit is U & Facing {
    return "facing" in unit && "facing" in unit.definition;
}

export function initialize<U extends Unit & Pick<Facing, "definition">>(
    battle: BattleState,
    unit: U,
    initial: Initial,
): Result<U & Facing> {
    return {
        state: battle,
        value: {
            ...unit,
            facing: {
                direction: initial.direction,
                restrictions: unit.definition.facing.restrictions,
            },
        },
    };
}

export function sign(direction: Direction): -1 | 1 {
    return direction === "LEFT" ? -1 : 1;
}

export function fromVector(vector: WorldPosition): Direction | null {
    if (vector[0] === 0) {
        return null;
    }

    return vector[0] > 0 ? "RIGHT" : "LEFT";
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Facing,
    "facing",
    keyof Restrictions
>("facing", "restrictions");
