import { assertFiniteNumber, assertNonnegativeNumber } from "../../../common/assert.js";
import { replaceIn } from "../../../common/object.js";
import type { Result, State as BattleState } from "../../state.js";
import { canPay, resolveMax, resolveMin, resolveRecoverySpeed } from "./query.js";

export function pay(battle: BattleState, amount: number): Result<boolean> {
    assertNonnegativeNumber(amount, "deployment point payment");
    const { dp } = battle.deployment;
    if (!canPay(dp, amount)) {
        return { state: battle, value: false };
    }

    return {
        state: replaceIn(battle, ["deployment", "dp", "balance"], dp.balance - amount),
        value: true,
    };
}

export function modify(battle: BattleState, amount: number): BattleState {
    assertFiniteNumber(amount, "deployment point modification");
    const { dp } = battle.deployment;
    const min = resolveMin(dp);
    const max = Math.max(resolveMax(dp), dp.balance);
    const balance = Math.max(min, Math.min(max, dp.balance + amount));

    return replaceIn(battle, ["deployment", "dp", "balance"], balance);
}

export function advance(battle: BattleState): BattleState {
    const { dp } = battle.deployment;
    const max = resolveMax(dp);
    if (dp.balance >= max) {
        return replaceIn(battle, ["deployment", "dp", "progress"], 0);
    }

    const { recoveryInterval } = dp.definition;
    const speed = resolveRecoverySpeed(dp);
    if (recoveryInterval === null || speed === 0) {
        return battle;
    }

    const baseSpeed = 1 / recoveryInterval;
    const progress = dp.progress + (speed / baseSpeed) * (dp.balance < 0 ? 0.5 : 1);
    const recovered = Math.floor((progress + 1e-8) / recoveryInterval);
    const balance = Math.min(max, dp.balance + recovered);

    return replaceIn(battle, ["deployment", "dp"], {
        ...dp,
        balance,
        progress: balance === max ? 0 : Math.max(0, progress - recovered * recoveryInterval),
    });
}
