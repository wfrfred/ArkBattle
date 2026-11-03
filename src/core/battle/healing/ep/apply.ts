import type { Result } from "../../state.js";
import * as units from "../../../unit/query.js";
import { available, canReceiveHealing } from "../../../unit/capability/elemental/query.js";
import { commitHealing } from "../../../unit/capability/elemental/operations.js";
import type { Calculated, Outcome, Pending, Request } from "./contract.js";
import { dispatch, beforeReceive, beforeCommit, targetApplied, sourceApplied } from "./hook.js";

export function applyHealing(
    request: Request,
    calculated: Result<Calculated | undefined>,
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
        return { state: battle, value: { kind: "REJECTED" } };
    }

    const context = { target: request.target, request, calculated: healing };
    battle = dispatch(battle, request.target, beforeReceive, context, undefined).state;

    if (!canReceiveHealing(battle, request)) {
        return { state: battle, value: { kind: "REJECTED" } };
    }

    const received: Pending = { amount: healing.amount, cancellation: null };
    const commit = { ...context, received };
    battle = dispatch(battle, request.source, beforeCommit, commit, undefined).state;

    if (!canReceiveHealing(battle, request)) {
        return { state: battle, value: { kind: "UNAVAILABLE", received } };
    }

    const result = commitHealing(battle, commit);
    battle = result.state;
    const applied = { ...commit, application: result.value };
    battle = dispatch(battle, request.target, targetApplied, applied, undefined).state;
    battle = dispatch(battle, request.source, sourceApplied, applied, undefined).state;

    return {
        state: battle,
        value: { kind: "APPLIED", received, application: result.value },
    };
}
