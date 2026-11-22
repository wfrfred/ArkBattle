import { assertFiniteNumber, assertNonnegativeNumber } from "../../../common/assert.js";
import type { Result, State as BattleState } from "../../state.js";
import { advance, canPay, changeDp, type State } from "./dp.js";

export function advanceBattle(battle: BattleState, tick: number): BattleState {
    return replace(battle, advance(battle.deployment.dp, tick));
}

export function modify(battle: BattleState, amount: number): BattleState {
    assertFiniteNumber(amount, "deployment point modification");

    return replace(battle, changeDp(battle.deployment.dp, amount, battle.tick));
}

export function recover(battle: BattleState, amount: number): BattleState {
    assertNonnegativeNumber(amount, "deployment point recovery");

    return replace(battle, changeDp(battle.deployment.dp, amount, battle.tick));
}

export function pay(battle: BattleState, amount: number): Result<boolean> {
    assertNonnegativeNumber(amount, "deployment point payment");
    const current = advance(battle.deployment.dp, battle.tick);
    if (!canPay(current, amount)) {
        return { state: battle, value: false };
    }

    return { state: replace(battle, changeDp(current, -amount, battle.tick)), value: true };
}

export function setMinimum(battle: BattleState, minimum: number): BattleState {
    assertFiniteNumber(minimum, "deployment point minimum");

    if (minimum > battle.deployment.dp.max) {
        throw new RangeError("deployment point minimum exceeds the limit");
    }

    const current = advance(battle.deployment.dp, battle.tick);
    const next = minimum === current.min ? current : { ...current, min: minimum };

    return replace(battle, changeDp(next, 0, battle.tick));
}

function replace(battle: BattleState, dp: State): BattleState {
    return dp === battle.deployment.dp
        ? battle
        : { ...battle, deployment: { ...battle.deployment, dp } };
}
