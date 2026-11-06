import type { State as BattleState } from "../battle/state.js";
import type { Unit } from "./unit.js";

export type Settlement = (battle: BattleState) => BattleState;

export interface Applied<U extends Unit> {
    readonly next: U;
    readonly settlements: readonly Settlement[];
}

export type Change<in C extends Unit> = <U extends C>(self: U) => Applied<U>;

export type Transformation<C extends Unit> = <U extends C>(self: U) => U;

export function createChange<C extends Unit>(
    transform: Transformation<C>,
    settle?: (battle: BattleState, previous: C) => BattleState,
): Change<C> {
    return (self) => {
        const next = transform(self);

        return {
            next,
            settlements:
                next === self || settle === undefined ? [] : [(battle) => settle(battle, self)],
        };
    };
}

export function compose<A extends Unit, B extends Unit>(
    first: Change<A>,
    second: Change<B>,
): Change<A & B> {
    return (self) => {
        const a = first(self);
        const b = second(a.next);

        return { next: b.next, settlements: [...a.settlements, ...b.settlements] };
    };
}

export function optional<C extends Unit>(
    has: <U extends Unit>(self: U) => self is U & C,
    change: Change<C>,
): Change<Unit> {
    return (self) => (has(self) ? change(self) : { next: self, settlements: [] });
}
