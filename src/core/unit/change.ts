import type { State as BattleState } from "../battle/state.js";
import type { Ref } from "../common/ref.js";
import type { Unit } from "./unit.js";

const Brand = Symbol("Unit.Change");

export interface Change {
    readonly [Brand]: true;
}

export type Transformation<U extends Unit> = (unit: U) => U;

export type Settlement<U extends Unit> = (battle: BattleState, previous: U) => BattleState;

export function createChange<U extends Unit>(
    ref: Ref<U>,
    transform: Transformation<NoInfer<U>>,
    settle?: Settlement<NoInfer<U>>,
): Change {
    const change = { [Brand]: true as const, ref, transform, settle };

    return change;
}

export function combine(changes: readonly Change[]): Change;
export function combine<U extends Unit>(
    reference: Ref<U>,
    expand: (self: NoInfer<U>) => readonly Change[],
): Change;
export function combine<U extends Unit>(
    source: readonly Change[] | Ref<U>,
    expand?: (self: NoInfer<U>) => readonly Change[],
): Change {
    const change =
        expand === undefined
            ? { [Brand]: true as const, changes: source }
            : { [Brand]: true as const, ref: source, expand };

    return change;
}
