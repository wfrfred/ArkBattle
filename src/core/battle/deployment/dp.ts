import { assertFiniteNumber, assertNonnegativeNumber } from "../../common/assert.js";
import type { Result, State as BattleState } from "../state.js";
import type { State } from "./deployment.js";

export function advance(state: State, tick: number): State {
    const interval = state.definition.dpRecoveryTicks;
    if (
        interval === null ||
        state.dp >= state.definition.maxDp ||
        tick === state.lastDpRecoveryTick
    ) {
        return state;
    }

    const elapsed = (tick - state.lastDpRecoveryTick) * (state.dp < 0 ? 0.5 : 1);
    const progress = state.dpRecoveryProgress + elapsed;
    const count = Math.floor(progress / interval);
    const dp = Math.min(state.definition.maxDp, state.dp + count);

    return {
        ...state,
        dp,
        dpRecoveryProgress: dp === state.definition.maxDp ? 0 : progress - count * interval,
        lastDpRecoveryTick: tick,
    };
}

export function changeDp(state: State, amount: number, tick: number): State {
    state = advance(state, tick);
    const dp = Math.max(state.minDp, Math.min(state.definition.maxDp, state.dp + amount));
    if (dp === state.dp) {
        return state;
    }

    return {
        ...state,
        dp,
        dpRecoveryProgress: dp === state.definition.maxDp ? 0 : state.dpRecoveryProgress,
        lastDpRecoveryTick: tick,
    };
}

export function modify(battle: BattleState, amount: number): BattleState {
    assertFiniteNumber(amount, "deployment point modification");

    return replace(battle, changeDp(battle.deployment, amount, battle.tick));
}

export function recover(battle: BattleState, amount: number): BattleState {
    assertNonnegativeNumber(amount, "deployment point recovery");

    return replace(battle, changeDp(battle.deployment, amount, battle.tick));
}

export function pay(battle: BattleState, amount: number): Result<boolean> {
    assertNonnegativeNumber(amount, "deployment point payment");
    const current = advance(battle.deployment, battle.tick);
    if (current.dp - amount < current.minDp) {
        return { state: battle, value: false };
    }

    return { state: replace(battle, changeDp(current, -amount, battle.tick)), value: true };
}

export function setMinimum(battle: BattleState, minimum: number): BattleState {
    assertFiniteNumber(minimum, "deployment point minimum");

    if (minimum > battle.deployment.definition.maxDp) {
        throw new RangeError("deployment point minimum exceeds the limit");
    }

    const current = advance(battle.deployment, battle.tick);
    const next = minimum === current.minDp ? current : { ...current, minDp: minimum };

    return replace(battle, changeDp(next, 0, battle.tick));
}

function replace(battle: BattleState, deployment: State): BattleState {
    return deployment === battle.deployment ? battle : { ...battle, deployment };
}
