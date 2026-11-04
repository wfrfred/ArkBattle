import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../../unit/unit.js";
import * as units from "../../../unit/query.js";
import * as vitality from "../../../unit/capability/vitality/operations.js";
import { appendEvents, type Result, type State as BattleState } from "../../state.js";
import { remove } from "../../unit.js";
import type { Calculated, Outcome, Request } from "./contract.js";
import {
    dispatch,
    beforeReceive,
    beforeCommit,
    targetApplied,
    sourceApplied,
    completed,
} from "./hook.js";

export function applyDamage(
    request: Request,
    calculated: Result<Calculated | undefined>,
): Result<Outcome> {
    let battle = calculated.state;
    const calculation = calculated.value;
    const target = units.get(battle, request.target);
    if (
        calculation === undefined ||
        calculation.amount === 0 ||
        target?.lifecycle !== "PRESENT" ||
        target.vitality.hp <= 0
    ) {
        return complete(battle, request, calculation, { kind: "REJECTED" });
    }

    const context = { target: request.target, request, calculated: calculation };
    battle = dispatch(battle, request.target, beforeReceive, context, undefined).state;

    if (!vitality.canReceiveDamage(battle, context)) {
        return complete(battle, request, calculation, { kind: "REJECTED" });
    }

    const receiving = vitality.receiveDamage(battle, context, {
        amount: calculation.amount,
        cancellation: null,
    });
    battle = receiving.state;
    const received = receiving.value;
    if (received.cancellation !== null) {
        return complete(battle, request, calculation, { kind: "CANCELLED", received });
    }
    if (!vitality.canReceiveDamage(battle, context)) {
        return complete(battle, request, calculation, { kind: "UNAVAILABLE", received });
    }

    const commitContext = { ...context, received };
    battle = dispatch(battle, request.source, beforeCommit, commitContext, undefined).state;

    if (!vitality.canReceiveDamage(battle, context)) {
        return complete(battle, request, calculation, { kind: "UNAVAILABLE", received });
    }

    const committed = vitality.commitDamage(battle, commitContext);
    battle = committed.state;
    const application = committed.value;
    battle = appendEvents(battle, [
        {
            type: "DAMAGE",
            targetUnitId: request.target.id,
            damageType: calculation.type,
            amount: application.hpLoss,
            tick: battle.tick,
        },
    ]);

    const appliedContext = { ...commitContext, application };
    battle = dispatch(battle, request.target, targetApplied, appliedContext, undefined).state;
    battle = dispatch(battle, request.source, sourceApplied, appliedContext, undefined).state;

    const current = units.get(battle, request.target);
    if (current?.lifecycle === "PRESENT" && current.vitality.hp <= 0) {
        battle = remove(battle, request.target.id, "DEATH");
    }

    return complete(battle, request, calculation, { kind: "APPLIED", received, application });
}

function complete(
    battle: BattleState,
    request: Request,
    calculated: Calculated | undefined,
    outcome: Outcome,
): Result<Outcome> {
    if (outcome.kind === "CANCELLED" && calculated !== undefined) {
        battle = appendEvents(battle, [
            {
                type: "DAMAGE",
                targetUnitId: request.target.id,
                damageType: calculated.type,
                amount: 0,
                tick: battle.tick,
            },
        ]);
    }

    const observers: readonly Ref<Unit>[] =
        request.source !== null && request.source.id !== request.target.id
            ? [request.target, request.source]
            : [request.target];
    const context = { target: request.target, request, calculated, outcome };

    for (const owner of observers) {
        battle = dispatch(battle, owner, completed, context, undefined).state;
    }

    return { state: battle, value: outcome };
}
