import type { Options } from "../../../../hook.js";
import type { Result } from "../../../state.js";
import * as units from "../../../../unit/query.js";
import { available, canReceiveHealing } from "../../../../unit/capability/elemental/query.js";
import { commitHealing } from "../../../../unit/capability/elemental/operations.js";
import type { Calculated, Outcome, Pending, Request } from "./contract.js";
import {
    type ReceivingContext,
    type ReceivingHook,
    dispatch,
    beforeReceive,
    beforeCommit,
    targetApplied,
    sourceApplied,
} from "./hook.js";

export function applyHealing(
    request: Request,
    calculated: Result<Calculated | undefined>,
    options?: Options,
): Result<Outcome> {
    let battle = calculated.state;
    const healing = calculated.value;
    const target = units.get(battle, request.target);
    if (
        healing === undefined ||
        healing.amount === 0 ||
        target === undefined ||
        !available(target)
    ) {
        return { state: battle, value: { type: "REJECTED" } };
    }

    const context = { target: request.target, request, calculated: healing };
    const before = dispatch<ReceivingContext, Pending, ReceivingHook>(
        battle,
        request.target,
        beforeReceive,
        context,
        { amount: healing.amount, cancellation: null },
        options,
    );
    battle = before.state;

    if (!canReceiveHealing(battle, request)) {
        return { state: battle, value: { type: "REJECTED" } };
    }

    const received: Pending = { ...before.value, amount: Math.max(0, before.value.amount) };
    const commit = { ...context, received };
    battle = dispatch(battle, request.source, beforeCommit, commit, undefined, options).state;

    if (!canReceiveHealing(battle, request)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const result = commitHealing(battle, commit);
    battle = result.state;
    const applied = { ...commit, application: result.value };
    battle = dispatch(battle, request.target, targetApplied, applied, undefined, options).state;
    battle = dispatch(battle, request.source, sourceApplied, applied, undefined, options).state;

    return {
        state: battle,
        value: { type: "APPLIED", received, application: result.value },
    };
}
