import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertPositiveSafeInteger,
} from "../../../common/assert.js";

export interface Definition {
    readonly initialDp: number;
    readonly minDp?: number;
    readonly maxDp: number;
    readonly dpRecoveryTicks: number | null;
}

export interface State {
    readonly value: number;
    readonly min: number;
    readonly max: number;
    readonly recoveryTicks: number | null;
    readonly recoveryProgress: number;
    readonly lastRecoveryTick: number;
}

const emptyDefinition: Definition = {
    initialDp: 0,
    maxDp: 99,
    dpRecoveryTicks: null,
};

export function initialize(definition: Definition = emptyDefinition, tick = 0): State {
    const { initialDp, maxDp, dpRecoveryTicks } = definition;
    const minDp = definition.minDp ?? 0;
    assertFiniteNumber(initialDp, "initial deployment points");
    assertFiniteNumber(minDp, "deployment point minimum");
    assertNonnegativeNumber(maxDp, "deployment point limit");

    if (minDp > maxDp) {
        throw new RangeError("deployment point minimum exceeds the limit");
    }
    if (initialDp < minDp || initialDp > maxDp) {
        throw new RangeError("initial deployment points are outside the account limits");
    }
    if (dpRecoveryTicks !== null) {
        assertPositiveSafeInteger(dpRecoveryTicks, "deployment point recovery interval");
    }

    return {
        value: initialDp,
        min: minDp,
        max: maxDp,
        recoveryTicks: dpRecoveryTicks,
        recoveryProgress: 0,
        lastRecoveryTick: tick,
    };
}

export function advance(state: State, tick: number): State {
    const interval = state.recoveryTicks;
    if (interval === null || state.value >= state.max || tick === state.lastRecoveryTick) {
        return state;
    }

    const elapsed = (tick - state.lastRecoveryTick) * (state.value < 0 ? 0.5 : 1);
    const progress = state.recoveryProgress + elapsed;
    const count = Math.floor(progress / interval);
    const value = Math.min(state.max, state.value + count);

    return {
        ...state,
        value,
        recoveryProgress: value === state.max ? 0 : progress - count * interval,
        lastRecoveryTick: tick,
    };
}

export function changeDp(state: State, amount: number, tick: number): State {
    state = advance(state, tick);
    const value = Math.max(state.min, Math.min(state.max, state.value + amount));
    if (value === state.value) {
        return state;
    }

    return {
        ...state,
        value,
        recoveryProgress: value === state.max ? 0 : state.recoveryProgress,
        lastRecoveryTick: tick,
    };
}

export function canPay(state: State, amount: number): boolean {
    return state.value - amount >= state.min;
}
