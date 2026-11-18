import type { Options } from "../../../hook.js";
import type { Restriction } from "../../../unit/capability/vitality/restriction.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../../unit/unit.js";
import * as units from "../../../unit/query.js";
import { prepare, setHook } from "../../../unit/hook.js";
import * as vitality from "../../../unit/capability/vitality/operations.js";
import { isAlive } from "../../../unit/capability/vitality/query.js";
import { appendEvents, type Result, type State as BattleState } from "../../../battle/state.js";
import { remove, update } from "../../../unit/operations.js";
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
    dispatchTargetKilled,
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
        !isAlive(target)
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

    if (!vitality.canReceiveDamage(battle, context, options?.ignore)) {
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

    const receiving = vitality.receiveDamage(battle, context, before.value, options);
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
    if (application === null) {
        return complete(battle, request, calculation, { type: "UNAVAILABLE", received }, options);
    }

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
    const killed = current?.lifecycle === "PRESENT" && !isAlive(current);
    if (killed) {
        if (request.killer !== null) {
            battle = update(
                battle,
                request.target,
                setHook(prepare, {
                    id: "@damage/targetKilled",
                    priority: 10000,
                    invoke: (state, departure) =>
                        departure.reason === "DEATH"
                            ? dispatchTargetKilled(state, departure, options)
                            : { state, value: undefined },
                }),
            );
        }

        battle = remove(battle, request.target, { reason: "DEATH", killer: request.killer });
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
    const context = { request, calculated, outcome };

    for (const owner of observers) {
        battle = dispatch(battle, owner, completed, context, undefined, options).state;
    }

    return { state: battle, value: outcome };
}
