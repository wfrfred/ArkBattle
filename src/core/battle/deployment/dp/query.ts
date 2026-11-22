import { resolve } from "../../../common/contribution.js";
import { apply } from "../../../common/modifier.js";
import type { State } from "./dp.js";

export function resolveMin(state: State): number {
    return apply(state.definition.min, resolve(state.min));
}

export function resolveMax(state: State): number {
    return apply(state.definition.max, resolve(state.max));
}

export function resolveRecoverySpeed(state: State): number {
    const { recoveryInterval } = state.definition;

    return recoveryInterval === null
        ? 0
        : Math.max(0, apply(1 / recoveryInterval, resolve(state.recoverySpeed)));
}

export function canPay(state: State, amount: number): boolean {
    return state.balance - amount >= resolveMin(state);
}
