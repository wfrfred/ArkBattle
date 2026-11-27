import { assertFiniteNumber } from "../../../../common/assert.js";
import type { Result, State as BattleState } from "../../../state.js";
import { canReceiveHp } from "../../../../unit/capability/vitality/operations.js";
import * as apply from "../apply.js";
import type { Outcome, Request } from "./contract.js";

export function applyAdjustment(battle: BattleState, request: Request): Result<Outcome> {
    assertFiniteNumber(request.delta, "HP adjustment delta");

    if (request.delta === 0 || !canReceiveHp(battle, request.target)) {
        return { state: battle, value: { type: "REJECTED" } };
    }

    const context = { type: "ADJUSTMENT" as const, request, forbidden: new Set<never>() };
    const pending = { type: "NORMAL" as const, amount: Math.abs(request.delta) };
    const result =
        request.delta < 0
            ? apply.decrease(battle, context, pending, null)
            : apply.increase(battle, context, pending, null);
    if (result.value.type !== "APPLIED") {
        return { state: result.state, value: result.value };
    }

    const {
        received,
        application: { before, after },
    } = result.value;
    const death =
        request.delta < 0
            ? apply.confirmDeath(result.state, request.target, request.killer, null)
            : { state: result.state, value: before.hp > 0 && after.hp <= 0 };

    return {
        state: death.state,
        value: { type: "APPLIED", received, application: { before, after }, killed: death.value },
    };
}
