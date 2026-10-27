import {
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveSafeInteger,
} from "../../common/assert.js";
import type * as card from "./card.js";

export interface Definition {
    readonly initialDp: number;
    readonly maxDp: number;
    readonly dpRecoveryTicks: number | null;
    readonly slotLimit: number | null;
}

export interface Input {
    readonly definition: Definition;
    readonly cards: readonly card.Input[];
}

export interface State {
    readonly definition: Definition;
    readonly cards: readonly card.Card[];
    readonly dp: number;
    readonly nextDpRecoveryAtTick: number | null;
}

const emptyDefinition: Definition = {
    initialDp: 0,
    maxDp: 99,
    dpRecoveryTicks: null,
    slotLimit: null,
};

export function initialize(definition: Definition = emptyDefinition, tick = 0): State {
    assertNonnegativeNumber(definition.initialDp, "initial deployment points");
    assertNonnegativeNumber(definition.maxDp, "deployment point limit");

    if (definition.initialDp > definition.maxDp) {
        throw new RangeError("initial deployment points exceed the limit");
    }
    if (definition.dpRecoveryTicks !== null) {
        assertPositiveSafeInteger(definition.dpRecoveryTicks, "deployment point recovery interval");
    }
    if (definition.slotLimit !== null) {
        assertNonnegativeSafeInteger(definition.slotLimit, "deployment slot limit");
    }

    return {
        definition,
        cards: [],
        dp: definition.initialDp,
        nextDpRecoveryAtTick:
            definition.dpRecoveryTicks !== null && definition.initialDp < definition.maxDp
                ? tick + definition.dpRecoveryTicks
                : null,
    };
}

export function changeDp(state: State, amount: number, tick: number): State {
    const dp = Math.max(0, Math.min(state.definition.maxDp, state.dp + amount));
    const interval = state.definition.dpRecoveryTicks;
    const nextDpRecoveryAtTick =
        dp >= state.definition.maxDp || interval === null
            ? null
            : (state.nextDpRecoveryAtTick ?? tick + interval);

    return dp === state.dp && nextDpRecoveryAtTick === state.nextDpRecoveryAtTick
        ? state
        : { ...state, dp, nextDpRecoveryAtTick };
}
