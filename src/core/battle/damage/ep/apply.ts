import type { Result } from "../../state.js";
import * as units from "../../../unit/query.js";
import { available, canReceiveDamage } from "../../../unit/capability/elemental/query.js";
import { receiveDamage, commitDamage } from "../../../unit/capability/elemental/operations.js";
import type { Calculated, Outcome, Request } from "./contract.js";
import { dispatch, beforeReceive, beforeCommit, targetApplied, sourceApplied } from "./hook.js";

export function applyDamage(
    request: Request,
    calculated: Result<Calculated | undefined>,
): Result<Outcome> {
    let battle = calculated.state;
    const damage = calculated.value;
    const target = units.get(battle, request.target);
    if (damage === undefined || damage.amount === 0 || target === undefined || !available(target)) {
        return { state: battle, value: { type: "REJECTED" } };
    }

    const context = { target: request.target, request, calculated: damage };
    battle = dispatch(battle, request.target, beforeReceive, context, undefined).state;

    if (!canReceiveDamage(battle, request, damage.type)) {
        return { state: battle, value: { type: "REJECTED" } };
    }

    const receiving = receiveDamage(battle, context, {
        amount: damage.amount,
        cancellation: null,
    });
    battle = receiving.state;
    const received = receiving.value;
    if (received.cancellation !== null) {
        return { state: battle, value: { type: "CANCELLED", received } };
    }
    if (!canReceiveDamage(battle, request, damage.type)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const commit = { ...context, received };
    battle = dispatch(battle, request.source, beforeCommit, commit, undefined).state;

    if (!canReceiveDamage(battle, request, damage.type)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const result = commitDamage(battle, commit);
    battle = result.state;
    const applied = { ...commit, application: result.value };
    battle = dispatch(battle, request.target, targetApplied, applied, undefined).state;
    battle = dispatch(battle, request.source, sourceApplied, applied, undefined).state;

    return {
        state: battle,
        value: { type: "APPLIED", received, application: result.value },
    };
}
