import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../../unit/unit.js";
import * as vitality from "../../../unit/capability/vitality/operations.js";
import { appendEvents, type Result, type State as BattleState } from "../../state.js";
import type { Calculated, Outcome, Request } from "./contract.js";
import {
    dispatch,
    beforeReceive,
    beforeCommit,
    targetApplied,
    sourceApplied,
    completed,
} from "./hook.js";

export function applyHealing(
    request: Request,
    calculated: Result<Calculated | undefined>,
): Result<Outcome> {
    let battle = calculated.state;
    const calculation = calculated.value;
    if (
        calculation === undefined ||
        calculation.amount === 0 ||
        !vitality.canReceiveHealing(battle, request.target)
    ) {
        return complete(battle, request, calculation, { type: "REJECTED" });
    }

    const context = { target: request.target, request, calculated: calculation };
    battle = dispatch(battle, request.target, beforeReceive, context, undefined).state;

    if (!vitality.canReceiveHealing(battle, request.target)) {
        return complete(battle, request, calculation, { type: "REJECTED" });
    }

    const receiving = vitality.receiveHealing(battle, context, {
        amount: calculation.amount,
        cancellation: null,
    });
    battle = receiving.state;
    const received = receiving.value;
    if (received.cancellation !== null) {
        return complete(battle, request, calculation, { type: "CANCELLED", received });
    }
    if (!vitality.canReceiveHealing(battle, request.target)) {
        return complete(battle, request, calculation, { type: "UNAVAILABLE", received });
    }

    const commitContext = { ...context, received };
    battle = dispatch(battle, request.source, beforeCommit, commitContext, undefined).state;

    if (!vitality.canReceiveHealing(battle, request.target)) {
        return complete(battle, request, calculation, { type: "UNAVAILABLE", received });
    }

    const committed = vitality.commitHealing(battle, commitContext);
    battle = committed.state;
    const application = committed.value;
    battle = appendEvents(battle, [
        {
            type: "HEAL",
            targetUnitId: request.target.id,
            amount: application.hpGain,
            tick: battle.tick,
        },
    ]);

    const appliedContext = { ...commitContext, application };
    battle = dispatch(battle, request.target, targetApplied, appliedContext, undefined).state;
    battle = dispatch(battle, request.source, sourceApplied, appliedContext, undefined).state;

    return complete(battle, request, calculation, { type: "APPLIED", received, application });
}

function complete(
    battle: BattleState,
    request: Request,
    calculated: Calculated | undefined,
    outcome: Outcome,
): Result<Outcome> {
    if (outcome.type === "CANCELLED" && calculated !== undefined) {
        battle = appendEvents(battle, [
            {
                type: "HEAL",
                targetUnitId: request.target.id,
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
