import type { Options } from "../../../hook.js";
import type { DamageRestriction } from "../../../unit/capability/elemental/restriction.js";
import type { Result } from "../../../battle/state.js";
import * as units from "../../../unit/query.js";
import { available, canReceiveDamage } from "../../../unit/capability/elemental/query.js";
import { receiveDamage, commitDamage } from "../../../unit/capability/elemental/operations.js";
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
} from "./hook.js";

export interface ApplyOptions extends Options {
    readonly ignore?: (restriction: DamageRestriction) => boolean;
    readonly forbidden?: ReadonlySet<Reason>;
}

export function applyDamage(
    request: Request,
    calculated: Result<Calculated | undefined>,
    options?: ApplyOptions,
): Result<Outcome> {
    let battle = calculated.state;
    const damage = calculated.value;
    const target = units.get(battle, request.target);
    if (damage === undefined || damage.amount === 0 || target === undefined || !available(target)) {
        return { state: battle, value: { type: "REJECTED" } };
    }

    const context = {
        request,
        calculated: damage,
        forbidden: options?.forbidden ?? new Set<Reason>(),
    };
    const before = dispatch<ReceivingContext, Pending, ReceivingHook>(
        battle,
        request.target,
        beforeReceive,
        context,
        { amount: damage.amount, type: "NORMAL" },
        options,
    );
    battle = before.state;

    if (!canReceiveDamage(battle, request, damage.type, options?.ignore)) {
        return {
            state: battle,
            value:
                before.value.type === "CANCELLED"
                    ? { type: "CANCELLED", received: before.value }
                    : { type: "REJECTED" },
        };
    }

    const receiving = receiveDamage(battle, context, before.value, options);
    battle = receiving.state;
    const received = receiving.value;
    if (received.type === "CANCELLED") {
        return { state: battle, value: { type: "CANCELLED", received } };
    }
    if (!canReceiveDamage(battle, request, damage.type, options?.ignore)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const commit: CommitContext = { ...context, received };
    battle = dispatch(battle, request.source, beforeCommit, commit, undefined, options).state;

    if (!canReceiveDamage(battle, request, damage.type, options?.ignore)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const result = commitDamage(battle, commit);
    battle = result.state;
    const applied = { ...commit, application: result.value };
    battle = dispatch(battle, request.target, targetApplied, applied, undefined, options).state;
    battle = dispatch(battle, request.source, sourceApplied, applied, undefined, options).state;

    return {
        state: battle,
        value: { type: "APPLIED", received, application: result.value },
    };
}
