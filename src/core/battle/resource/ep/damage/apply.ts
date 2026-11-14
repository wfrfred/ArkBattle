import type { Options } from "../../../../hook.js";
import type { Result } from "../../../state.js";
import * as units from "../../../../unit/query.js";
import { available, canReceiveDamage } from "../../../../unit/capability/elemental/query.js";
import { receiveDamage, commitDamage } from "../../../../unit/capability/elemental/operations.js";
import type { Calculated, Outcome, Request } from "./contract.js";
import {
    type CommitContext,
    dispatch,
    beforeReceive,
    beforeCommit,
    targetApplied,
    sourceApplied,
} from "./hook.js";

export function applyDamage(
    request: Request,
    calculated: Result<Calculated | undefined>,
    options?: Options,
): Result<Outcome> {
    let battle = calculated.state;
    const damage = calculated.value;
    const target = units.get(battle, request.target);
    if (damage === undefined || damage.amount === 0 || target === undefined || !available(target)) {
        return { state: battle, value: { type: "REJECTED" } };
    }

    const context = { target: request.target, request, calculated: damage };
    battle = dispatch(battle, request.target, beforeReceive, context, undefined, options).state;

    if (!canReceiveDamage(battle, request, damage.type)) {
        return { state: battle, value: { type: "REJECTED" } };
    }

    const receiving = receiveDamage(
        battle,
        context,
        {
            amount: damage.amount,
            type: "NORMAL",
        },
        options,
    );
    battle = receiving.state;
    const received = receiving.value;
    if (received.type === "CANCELLED") {
        return { state: battle, value: { type: "CANCELLED", received } };
    }
    if (!canReceiveDamage(battle, request, damage.type)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const commit: CommitContext = { ...context, received };
    battle = dispatch(battle, request.source, beforeCommit, commit, undefined, options).state;

    if (!canReceiveDamage(battle, request, damage.type)) {
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
