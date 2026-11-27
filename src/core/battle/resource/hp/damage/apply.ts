import type { Options } from "../../../../hook.js";
import type { Restriction } from "../../../../unit/capability/vitality/restriction.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit } from "../../../../unit/unit.js";
import { isAlive, canReceiveDamage } from "../../../../unit/capability/vitality/query.js";
import { appendEvents, type Result, type State as BattleState } from "../../../state.js";
import type { Calculated, Outcome, Request } from "./contract.js";
import { decrease, confirmDeath } from "../apply.js";
import type { Pending, Reason } from "../decrease.js";
import {
    type CommitContext,
    type ReceivingContext,
    type ReceivingHook,
    dispatch,
    beforeReceive,
    targetApplied,
    sourceApplied,
    completed,
} from "./hook.js";

export interface ApplyOptions extends Options {
    readonly ignore?: (restriction: Restriction) => boolean;
    readonly forbidden: ReadonlySet<Reason>;
}

export function applyDamage(
    request: Request,
    calculated: Result<Calculated | undefined>,
    options: ApplyOptions | null,
): Result<Outcome> {
    let battle = calculated.state;
    const calculation = calculated.value;
    const target = request.target.get(battle);
    if (
        calculation === undefined ||
        calculation.amount === 0 ||
        target?.lifecycle !== "ACTIVE" ||
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

    if (!canReceiveDamage(battle, context, options?.ignore)) {
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

    const receivingContext = { ...context, type: "DAMAGE" as const };
    const committed = decrease(battle, receivingContext, before.value, options);
    battle = committed.state;
    const outcome = committed.value;
    if (outcome.type !== "APPLIED") {
        return complete(battle, request, calculation, outcome, options);
    }

    const { received, application } = outcome;
    const commitContext: CommitContext = { ...context, received };
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

    const death = confirmDeath(battle, request.target, request.killer, options);

    return complete(
        death.state,
        request,
        calculation,
        {
            type: "APPLIED",
            received,
            application,
            killed: death.value,
        },
        options,
    );
}

function complete(
    battle: BattleState,
    request: Request,
    calculated: Calculated | undefined,
    outcome: Outcome,
    options: Options | null,
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
        request.source !== null && request.source !== request.target
            ? [request.target, request.source]
            : [request.target];
    const context = { request, calculated, outcome };

    for (const owner of observers) {
        battle = dispatch(battle, owner, completed, context, undefined, options).state;
    }

    return { state: battle, value: outcome };
}
