import type { State as BattleState } from "../battle/state.js";
import { assertFiniteNumber } from "../common/assert.js";
import * as entries from "../common/collection/entries.js";
import * as contribution from "../common/contribution.js";

export interface Modifier {
    readonly addition: number;
    readonly multiplier: number;
    readonly finalAddition: number;
    readonly finalScaler: number;
}

export interface Range {
    readonly min: number | null;
    readonly max: number | null;
}

export interface Definition extends Range {
    readonly default: number;
}

export type Input<H> =
    readonly Modifier[] | ((battle: BattleState, self: H) => readonly Modifier[]);

export interface State<I = readonly Modifier[]> extends Range {
    readonly contributions: readonly contribution.Contribution<I>[];
}

export function create(input: Partial<Modifier> = {}): Modifier {
    const { addition = 0, multiplier = 0, finalAddition = 0, finalScaler = 1 } = input;

    return { addition, multiplier, finalAddition, finalScaler };
}

export function apply(base: number, modifiers: Iterable<Modifier>): number {
    let addition = 0;
    let multiplier = 0;
    let finalAddition = 0;
    let finalScaler = 1;

    for (const modifier of modifiers) {
        addition += modifier.addition;
        multiplier += modifier.multiplier;
        finalAddition += modifier.finalAddition;
        finalScaler *= modifier.finalScaler;
    }

    return ((base + addition) * Math.max(0, 1 + multiplier) + finalAddition) * finalScaler;
}

function validateRange(range: Range): void {
    if (range.min !== null) {
        assertFiniteNumber(range.min, "attribute minimum");
    }
    if (range.max !== null) {
        assertFiniteNumber(range.max, "attribute maximum");
    }
}

export function initialize<I = readonly Modifier[]>(definition: Definition): State<I> {
    assertFiniteNumber(definition.default, "attribute default");
    validateRange(definition);

    return { contributions: [], min: definition.min, max: definition.max };
}

export function resolve(definition: Definition, state: State): number;
export function resolve<H>(
    definition: Definition,
    state: State<Input<H>>,
    battle: BattleState,
    self: H,
): number;
export function resolve<H>(
    definition: Definition,
    state: State<Input<H>>,
    battle?: BattleState,
    self?: H,
): number {
    const modifiers = contribution
        .resolve(state.contributions)
        .flatMap((input) => (typeof input === "function" ? input(battle!, self!) : input));
    const value = apply(clamp(definition.default, definition), modifiers);

    return clamp(value, state);
}

function clamp(value: number, range: Range): number {
    return Math.min(range.max ?? Infinity, Math.max(range.min ?? -Infinity, value));
}

export function setContribution<I>(
    state: State<I>,
    entry: contribution.Contribution<NoInfer<I>>,
): State<I> {
    const contributions = entries.set(state.contributions, entry);

    return contributions === state.contributions ? state : { ...state, contributions };
}

export function removeContribution<I>(state: State<I>, id: string): State<I> {
    const contributions = entries.remove(state.contributions, id);

    return contributions === state.contributions ? state : { ...state, contributions };
}

export function setRange<I>(definition: Definition, state: State<I>, range: Range): State<I> {
    validateRange(range);

    if (range.min === null && range.max === null) {
        return state;
    }

    const min = range.min ?? definition.min;
    const max = range.max ?? definition.max;

    return min === state.min && max === state.max ? state : { ...state, min, max };
}

export function clearRange<I>(definition: Definition, state: State<I>): State<I> {
    return state.min === definition.min && state.max === definition.max
        ? state
        : { ...state, min: definition.min, max: definition.max };
}
