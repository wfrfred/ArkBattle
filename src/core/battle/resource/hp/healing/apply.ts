import type { Options } from "../../../../hook.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit } from "../../../../unit/unit.js";
import * as vitality from "../../../../unit/capability/vitality/operations.js";
import { appendEvents, type Result, type State as BattleState } from "../../../state.js";
import type { Calculated, Outcome, Pending, Reason, Request } from "./contract.js";
import {
    type CommitContext,
    type ReceivingContext,
    type ReceivingHook,
    dispatch,
    beforeReceive,
    beforeCommit,
    targetApplied,
    sourceApplied,
    completed,
} from "./hook.js";

export interface ApplyOptions extends Options {
    readonly forbidden?: ReadonlySet<Reason>;
}

export function applyHealing(
    request: Request,
    calculated: Result<Calculated | undefined>,
    options?: ApplyOptions,
): Result<Outcome> {
    let battle = calculated.state;
    const calculation = calculated.value;
    if (
        calculation === undefined ||
        calculation.amount === 0 ||
        !vitality.canReceiveHealing(battle, request.target)
    ) {
        return complete(battle, request, calculation, { type: "REJECTED" }, options);
    }

    const context = {
        request,
        calculated: calculation,
        forbidden: options?.forbidden ?? new Set<Reason>(),
    };
    const before = dispatch<ReceivingContext, Pending, ReceivingHook>(
        battle,
        request.target,
        beforeReceive,
        context,
        { amount: calculation.amount, type: "NORMAL" },
        options,
    );
    battle = before.state;

    if (!vitality.canReceiveHealing(battle, request.target)) {
        return complete(
            battle,
            request,
            calculation,
            before.value.type === "CANCELLED"
                ? { type: "CANCELLED", received: before.value }
                : { type: "REJECTED" },
            options,
        );
    }

    const receiving = vitality.receiveHealing(battle, context, before.value, options);
    battle = receiving.state;
    const received = receiving.value;
    if (received.type === "CANCELLED") {
        return complete(battle, request, calculation, { type: "CANCELLED", received }, options);
    }
    if (!vitality.canReceiveHealing(battle, request.target)) {
        return complete(battle, request, calculation, { type: "UNAVAILABLE", received }, options);
    }

    const commitContext: CommitContext = { ...context, received };
    battle = dispatch(
        battle,
        request.source,
        beforeCommit,
        commitContext,
        undefined,
        options,
    ).state;

    if (!vitality.canReceiveHealing(battle, request.target)) {
        return complete(battle, request, calculation, { type: "UNAVAILABLE", received }, options);
    }

    const committed = vitality.commitHealing(battle, commitContext);
    battle = committed.state;
    const application = committed.value;

    const appliedContext = { ...commitContext, application };
    battle = dispatch(
        battle,
        request.target,
        targetApplied,
        appliedContext,
        undefined,
        options,
    ).state;
    battle = dispatch(
        battle,
        request.source,
        sourceApplied,
        appliedContext,
        undefined,
        options,
    ).state;

    return complete(
        battle,
        request,
        calculation,
        { type: "APPLIED", received, application },
        options,
    );
}

function complete(
    battle: BattleState,
    request: Request,
    calculated: Calculated | undefined,
    outcome: Outcome,
    options?: Options,
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
    const context = { request, calculated, outcome };

    for (const owner of observers) {
        battle = dispatch(battle, owner, completed, context, undefined, options).state;
    }

    return { state: battle, value: outcome };
}
