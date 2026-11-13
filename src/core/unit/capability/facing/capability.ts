import type { State as BattleState, Result } from "../../../battle/state.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Rule as BaseRule } from "../../../rule.js";
import type { Unit } from "../../unit.js";
import { createRegistrationOperations } from "../../registration.js";

export type Direction = "LEFT" | "RIGHT";

export interface RuleContext {
    readonly self: Unit & Facing;
    readonly direction: Direction;
}

export type Rule = BaseRule<RuleContext>;

interface Rules {
    readonly rules: readonly Rule[];
}

export interface Definition extends Rules {}

export interface Initial {
    readonly direction: Direction;
}

export interface State extends Rules {
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
            facing: { direction: initial.direction, rules: unit.definition.facing.rules },
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

export const { set: setRule, remove: removeRule } = createRegistrationOperations<
    Unit & Facing,
    "facing",
    keyof Rules
>("facing", "rules");
