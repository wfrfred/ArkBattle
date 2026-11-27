import type { Ref } from "../../../common/ref.js";
import { assert, assertNonnegativeNumber } from "../../../common/assert.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import { appendEvents, type State as BattleState, type Result } from "../../../battle/state.js";
import { remove, replace } from "../../operations.js";
import type { Unit } from "../../unit.js";
import * as hooks from "../../../hook.js";
import type * as damage from "../../../battle/resource/hp/damage/index.js";
import * as decrease from "../../../battle/resource/hp/decrease.js";
import * as increase from "../../../battle/resource/hp/increase.js";
import type { Pending } from "../../../battle/resource/receiving.js";
import { resolveMaxHp, resolveMaxMinusHp, type Vitality } from "./capability.js";
import { isAlive, resolveRecoverySpeed } from "./query.js";
import { allows } from "../../../restriction.js";
import type { Restriction } from "./restriction.js";
import {
    lossCommitting,
    lossCommitted,
    type LossCommittedContext,
    type LossCommittedHook,
} from "./hook.js";
import { change, normalize, type Health } from "./health.js";
import { replaceIn } from "../../../common/object.js";

export interface DecreaseApplication {
    readonly before: Health;
    readonly after: Health;
    readonly hpLoss: number;
    readonly minusHpGain: number;
}

export interface IncreaseApplication {
    readonly before: Health;
    readonly after: Health;
    readonly hpGain: number;
    readonly minusHpLoss: number;
    readonly overflow: number;
}

export function canReceiveDamage(
    battle: BattleState,
    context: damage.ReceivingContext,
    ignore?: (restriction: Restriction) => boolean,
): boolean {
    const target = context.request.target.get(battle);

    return (
        target?.lifecycle === "ACTIVE" &&
        isAlive(target) &&
        allows(battle, context, target.vitality.damageRestrictions, ignore)
    );
}

export function canReceiveHp(battle: BattleState, target: Ref<Unit & Vitality>): boolean {
    const unit = target.get(battle);

    return unit?.lifecycle === "ACTIVE" && isAlive(unit);
}

export function receiveDecrease(
    battle: BattleState,
    context: decrease.ReceivingContext,
    pending: decrease.Pending,
    options: hooks.Options | null,
): Result<decrease.Pending> {
    return receive(battle, context, pending, decrease.receiving, options);
}

export function receiveIncrease(
    battle: BattleState,
    context: increase.ReceivingContext,
    pending: increase.Pending,
    options: hooks.Options | null,
): Result<increase.Pending> {
    return receive(battle, context, pending, increase.receiving, options);
}

interface TargetContext {
    readonly request: { readonly target: Ref<Unit & Vitality> };
}

function receive<C extends TargetContext, R extends string, H extends hooks.Hook<C, Pending<R>>>(
    battle: BattleState,
    context: C,
    pending: Pending<R>,
    key: hooks.Key<H, Unit & Vitality>,
    options: hooks.Options | null,
): Result<Pending<R>> {
    const result = dispatchHook(battle, context, pending, key, options);

    return {
        state: result.state,
        value:
            result.value.type === "CANCELLED"
                ? result.value
                : { ...result.value, amount: Math.max(0, result.value.amount) },
    };
}

export function commitDecrease(
    battle: BattleState,
    context: decrease.CommitContext,
): Result<DecreaseApplication | null> {
    const target = context.request.target;
    const unit = target.get(battle)!;
    const previous = unit.vitality.health;
    const committed = dispatchHook(
        battle,
        { ...context, previous },
        change(
            previous,
            previous.hp - context.received.amount,
            resolveMaxMinusHp(unit.definition.vitality, unit.vitality),
        ),
        lossCommitting,
        null,
    );
    battle = committed.state;
    const current = target.get(battle);
    if (current?.lifecycle !== "ACTIVE" || !isAlive(current)) {
        return { state: battle, value: null };
    }

    const before = current.vitality.health;
    const maxHp = resolveMaxHp(current.definition.vitality, current.vitality);
    const after = normalize(
        committed.value,
        maxHp,
        resolveMaxMinusHp(current.definition.vitality, current.vitality),
    );
    const application = {
        before,
        after,
        hpLoss: Math.max(0, before.hp - after.hp),
        minusHpGain: Math.max(0, after.minusHp - before.minusHp),
    };

    if (after.hp !== before.hp || after.minusHp !== before.minusHp) {
        battle = replace(battle, [replaceIn(current, ["vitality", "health"], after)]);
    }

    if (context.type === "DAMAGE") {
        battle = appendEvents(battle, [
            {
                type: "DAMAGE",
                targetUnitId: target.id,
                damageType: context.calculated.type,
                amount: application.hpLoss,
                tick: battle.tick,
            },
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- The hook's work type is void.
    const notified = dispatchHook<LossCommittedContext, void, LossCommittedHook>(
        battle,
        { ...context, application },
        undefined,
        lossCommitted,
        null,
    );

    return {
        state: notified.state,
        value: application,
    };
}

export function commitIncrease(
    battle: BattleState,
    context: increase.CommitContext,
): Result<IncreaseApplication> {
    return recoverHp(
        battle,
        context.request.target,
        context.received.amount,
        context.type === "HEALING" ? "HEAL" : null,
    );
}

export function advance(battle: BattleState, reference: Ref<Unit & Vitality>): BattleState {
    const unit = reference.get(battle);
    if (unit?.lifecycle !== "ACTIVE" || !isAlive(unit)) {
        return battle;
    }

    const amount = resolveRecoverySpeed(battle, unit) / TICKS_PER_SECOND;

    return amount === 0 ? battle : increaseHp(battle, reference, amount).state;
}

export function increaseHp(
    battle: BattleState,
    reference: Ref<Unit & Vitality>,
    amount: number,
): Result<IncreaseApplication> {
    return recoverHp(battle, reference, amount, null);
}

function recoverHp(
    battle: BattleState,
    reference: Ref<Unit & Vitality>,
    amount: number,
    event: "HEAL" | null,
): Result<IncreaseApplication> {
    assertNonnegativeNumber(amount, "HP recovery amount");
    const unit = reference.get(battle);
    assert(unit?.lifecycle === "ACTIVE", "HP recovery target is not active", RangeError);

    const before = unit.vitality.health;
    const maxHp = resolveMaxHp(unit.definition.vitality, unit.vitality);
    const maxMinusHp = resolveMaxMinusHp(unit.definition.vitality, unit.vitality);
    const after = normalize(change(before, before.hp + amount, maxMinusHp), maxHp, maxMinusHp);
    const hpGain = Math.max(0, after.hp - before.hp);
    const minusHpLoss = Math.max(0, before.minusHp - after.minusHp);
    const application = {
        before,
        after,
        hpGain,
        minusHpLoss,
        overflow: Math.max(0, amount - minusHpLoss - hpGain),
    };

    if (after.hp !== before.hp || after.minusHp !== before.minusHp) {
        battle = replace(battle, [replaceIn(unit, ["vitality", "health"], after)]);
    }

    if (event !== null) {
        battle = appendEvents(battle, [
            {
                type: event,
                targetUnitId: reference.id,
                amount: application.hpGain,
                tick: battle.tick,
            },
        ]);
    }

    if (before.hp > 0 && after.hp <= 0) {
        battle = remove(battle, reference, { reason: "DEATH", killer: null });
    }

    return { state: battle, value: application };
}

function dispatchHook<C extends TargetContext, T, H extends hooks.Hook<C, T>>(
    battle: BattleState,
    context: C,
    initial: T,
    key: hooks.Key<H, Unit & Vitality>,
    options: hooks.Options | null,
): Result<T> {
    const target = context.request.target;

    return hooks.dispatch(battle, context, initial, {
        candidates(current) {
            const unit = target.get(current);

            return unit?.lifecycle === "ACTIVE"
                ? unit.hooks.get(key).filter(({ id }) => !hooks.excluded(options, key, id))
                : [];
        },
        find(current, id) {
            const unit = target.get(current);

            return unit?.lifecycle === "ACTIVE" ? unit.hooks.find(key, id) : undefined;
        },
    });
}
