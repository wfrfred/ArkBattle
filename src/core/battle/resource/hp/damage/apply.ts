import type { Options } from "../../../../hook.js";
import type { Restriction } from "../../../../unit/capability/vitality/restriction.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit } from "../../../../unit/unit.js";
import * as units from "../../../../unit/query.js";
import * as vitality from "../../../../unit/capability/vitality/operations.js";
import { appendEvents, type Result, type State as BattleState } from "../../../state.js";
import { remove } from "../../../unit.js";
import type { Calculated, Outcome, Reason, Request } from "./contract.js";
import {
    type CommitContext,
    dispatch,
    beforeReceive,
    beforeCommit,
    targetApplied,
    sourceApplied,
    completed,
} from "./hook.js";

export interface ApplyOptions extends Options {
    readonly ignore?: (restriction: Restriction) => boolean;
    readonly forbidden?: ReadonlySet<Reason>;
}

export function applyDamage(
    request: Request,
    calculated: Result<Calculated | undefined>,
    options?: ApplyOptions,
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
        return complete(battle, request, calculation, { type: "REJECTED" }, options);
    }

    const context = {
        target: request.target,
        request,
        calculated: calculation,
        forbidden: options?.forbidden ?? new Set<Reason>(),
    };
    battle = dispatch(battle, request.target, beforeReceive, context, undefined, options).state;

    if (!vitality.canReceiveDamage(battle, context, options?.ignore)) {
        return complete(battle, request, calculation, { type: "REJECTED" }, options);
    }

    const receiving = vitality.receiveDamage(
        battle,
        context,
        {
            amount: calculation.amount,
            type: "NORMAL",
        },
        options,
    );
    battle = receiving.state;
    const received = receiving.value;
    if (received.type === "CANCELLED") {
        return complete(battle, request, calculation, { type: "CANCELLED", received }, options);
    }
    if (!vitality.canReceiveDamage(battle, context, options?.ignore)) {
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

    if (!vitality.canReceiveDamage(battle, context, options?.ignore)) {
        return complete(battle, request, calculation, { type: "UNAVAILABLE", received }, options);
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

    const current = units.get(battle, request.target);
    const killed = current?.lifecycle === "PRESENT" && current.vitality.hp <= 0;
    if (killed) {
        battle = remove(battle, request.target, "DEATH");
    }

    return complete(
        battle,
        request,
        calculation,
        {
            type: "APPLIED",
            received,
            application,
            killed,
        },
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
        battle = dispatch(battle, owner, completed, context, undefined, options).state;
    }

    return { state: battle, value: outcome };
}
