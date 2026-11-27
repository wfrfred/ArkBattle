import * as hooks from "../../../hook.js";
import type { Unit } from "../../../unit/unit.js";
import type { Ref } from "../../../common/ref.js";
import type { Result, State as BattleState } from "../../state.js";
import { removing, setHook } from "../../../unit/hook.js";
import { remove, update } from "../../../unit/operations.js";
import { isAlive } from "../../../unit/capability/vitality/query.js";
import type { Vitality } from "../../../unit/capability/vitality/capability.js";
import * as vitality from "../../../unit/capability/vitality/operations.js";
import * as decreaseProtocol from "./decrease.js";
import * as increaseProtocol from "./increase.js";
import type { ApplyOptions as DamageOptions } from "./damage/apply.js";
import type { ApplyOptions as HealingOptions } from "./healing/apply.js";
import { dispatch } from "../hook.js";

type DirectionalOutcome<P, A> =
    | { readonly type: "CANCELLED"; readonly received: P }
    | { readonly type: "UNAVAILABLE"; readonly received: P }
    | { readonly type: "APPLIED"; readonly received: P; readonly application: A };

export function decrease(
    battle: BattleState,
    context: decreaseProtocol.ReceivingContext,
    pending: decreaseProtocol.Pending,
    options: DamageOptions | null,
): Result<DirectionalOutcome<decreaseProtocol.Pending, vitality.DecreaseApplication>> {
    const receiving = vitality.receiveDecrease(battle, context, pending, options);
    battle = receiving.state;
    const received = receiving.value;
    if (received.type === "CANCELLED") {
        return { state: battle, value: { type: "CANCELLED", received } };
    }

    const canReceive = (current: BattleState): boolean =>
        context.type === "DAMAGE"
            ? vitality.canReceiveDamage(current, context, options?.ignore)
            : vitality.canReceiveHp(current, context.request.target);
    if (!canReceive(battle)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const commitContext: decreaseProtocol.CommitContext = { ...context, received };
    battle = dispatch(
        battle,
        context.request.source,
        decreaseProtocol.beforeCommit,
        commitContext,
        undefined,
        options,
    ).state;

    if (!canReceive(battle)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const committed = vitality.commitDecrease(battle, commitContext);

    return {
        state: committed.state,
        value:
            committed.value === null
                ? { type: "UNAVAILABLE", received }
                : { type: "APPLIED", received, application: committed.value },
    };
}

export function increase(
    battle: BattleState,
    context: increaseProtocol.ReceivingContext,
    pending: increaseProtocol.Pending,
    options: HealingOptions | null,
): Result<DirectionalOutcome<increaseProtocol.Pending, vitality.IncreaseApplication>> {
    const receiving = vitality.receiveIncrease(battle, context, pending, options);
    battle = receiving.state;
    const received = receiving.value;
    if (received.type === "CANCELLED") {
        return { state: battle, value: { type: "CANCELLED", received } };
    }
    if (!vitality.canReceiveHp(battle, context.request.target)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const commitContext: increaseProtocol.CommitContext = { ...context, received };
    battle = dispatch(
        battle,
        context.request.source,
        increaseProtocol.beforeCommit,
        commitContext,
        undefined,
        options,
    ).state;

    if (!vitality.canReceiveHp(battle, context.request.target)) {
        return { state: battle, value: { type: "UNAVAILABLE", received } };
    }

    const committed = vitality.commitIncrease(battle, commitContext);

    return {
        state: committed.state,
        value: { type: "APPLIED", received, application: committed.value },
    };
}

function dispatchTargetKilled(
    battle: BattleState,
    context: decreaseProtocol.TargetKilledContext,
    options: hooks.Options | null,
): Result<void> {
    const killer = context.killer;
    if (killer === null) {
        return { state: battle, value: undefined };
    }

    return hooks.dispatch(battle, context, undefined, {
        candidates: (current) =>
            (killer.get(current)?.hooks.get(decreaseProtocol.targetKilled) ?? []).filter(
                ({ id }) => !hooks.excluded(options, decreaseProtocol.targetKilled, id),
            ),
        find: (current, id) => killer.get(current)?.hooks.find(decreaseProtocol.targetKilled, id),
    });
}

export function confirmDeath(
    battle: BattleState,
    target: Ref<Unit & Vitality>,
    killer: Ref<Unit> | null,
    options: hooks.Options | null,
): Result<boolean> {
    const current = target.get(battle);
    const killed = current?.lifecycle === "ACTIVE" && !isAlive(current);
    if (killed) {
        if (killer !== null) {
            battle = update(
                battle,
                target,
                setHook(removing, {
                    id: "@hp/targetKilled",
                    priority: 10000,
                    invoke: (state, departure) =>
                        departure.reason === "DEATH"
                            ? dispatchTargetKilled(state, departure, options)
                            : { state, value: undefined },
                }),
            );
        }

        battle = remove(battle, target, { reason: "DEATH", killer });
    }

    return { state: battle, value: killed };
}
