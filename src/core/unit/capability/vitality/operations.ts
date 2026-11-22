import type { Ref } from "../../../common/ref.js";
import { assert, assertNonnegativeNumber } from "../../../common/assert.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import { appendEvents, type State as BattleState, type Result } from "../../../battle/state.js";
import { remove, replace } from "../../operations.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import * as hooks from "../../../hook.js";
import type * as damage from "../../../battle/resource/hp/damage/index.js";
import type * as healing from "../../../battle/resource/hp/healing/index.js";
import { receiving as damageReceiving } from "../../../battle/resource/hp/damage/hook.js";
import { receiving as healingReceiving } from "../../../battle/resource/hp/healing/hook.js";
import { resolveMaxHp, resolveMaxMinusHp, type Vitality } from "./capability.js";
import { isAlive, resolveRecoverySpeed } from "./query.js";
import { allows } from "../../../restriction.js";
import type { Restriction } from "./restriction.js";
import {
    damageCommitting,
    damageCommitted,
    type DamageCommittedContext,
    type DamageCommittedHook,
} from "./hook.js";
import { change, normalize, type Health } from "./health.js";
import { replaceIn } from "../../../common/object.js";

export interface DamageApplication {
    readonly before: Health;
    readonly after: Health;
    readonly hpLoss: number;
    readonly minusHpGain: number;
}

export interface HealingApplication {
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
    const target = units.get(battle, context.request.target);

    return (
        target?.lifecycle === "ACTIVE" &&
        isAlive(target) &&
        allows(battle, context, target.vitality.damageRestrictions, ignore)
    );
}

export function canReceiveHealing(battle: BattleState, target: Ref<Unit & Vitality>): boolean {
    const unit = units.get(battle, target);

    return unit?.lifecycle === "ACTIVE" && isAlive(unit);
}

export function receiveDamage(
    battle: BattleState,
    context: damage.ReceivingContext,
    pending: damage.Pending,
    options?: hooks.Options,
): Result<damage.Pending> {
    const result = dispatchHook(battle, context, pending, damageReceiving, options);

    return {
        state: result.state,
        value:
            result.value.type === "CANCELLED"
                ? result.value
                : { ...result.value, amount: Math.max(0, result.value.amount) },
    };
}

export function receiveHealing(
    battle: BattleState,
    context: healing.ReceivingContext,
    pending: healing.Pending,
    options?: hooks.Options,
): Result<healing.Pending> {
    const result = dispatchHook(battle, context, pending, healingReceiving, options);

    return {
        state: result.state,
        value:
            result.value.type === "CANCELLED"
                ? result.value
                : { ...result.value, amount: Math.max(0, result.value.amount) },
    };
}

export function commitDamage(
    battle: BattleState,
    context: damage.CommitContext,
): Result<DamageApplication | null> {
    const target = context.request.target;
    const unit = units.get(battle, target)!;
    const previous = unit.vitality.health;
    const committed = dispatchHook(
        battle,
        { request: context.request, previous },
        change(
            previous,
            previous.hp - context.received.amount,
            resolveMaxMinusHp(unit.definition.vitality, unit.vitality),
        ),
        damageCommitting,
    );
    battle = committed.state;
    const current = units.get(battle, target);
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

    battle = appendEvents(battle, [
        {
            type: "DAMAGE",
            targetUnitId: target.id,
            damageType: context.calculated.type,
            amount: application.hpLoss,
            tick: battle.tick,
        },
    ]);

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- The hook's work type is void.
    const notified = dispatchHook<DamageCommittedContext, void, DamageCommittedHook>(
        battle,
        { request: context.request, application },
        undefined,
        damageCommitted,
    );

    return {
        state: notified.state,
        value: application,
    };
}

export function commitHealing(
    battle: BattleState,
    context: healing.CommitContext,
): Result<HealingApplication> {
    return recoverHp(battle, context.request.target, context.received.amount, "HEAL");
}

export function advance(battle: BattleState, reference: Ref<Unit & Vitality>): BattleState {
    const unit = units.get(battle, reference);
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
): Result<HealingApplication> {
    return recoverHp(battle, reference, amount, null);
}

function recoverHp(
    battle: BattleState,
    reference: Ref<Unit & Vitality>,
    amount: number,
    event: "HEAL" | null,
): Result<HealingApplication> {
    assertNonnegativeNumber(amount, "HP recovery amount");
    const unit = units.get(battle, reference);
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

function dispatchHook<C extends damage.Context | healing.Context, T, H extends hooks.Hook<C, T>>(
    battle: BattleState,
    context: C,
    initial: T,
    key: hooks.Key<H, Unit & Vitality>,
    options?: hooks.Options,
): Result<T> {
    const target = context.request.target;

    return hooks.dispatch(battle, context, initial, {
        candidates(current) {
            const unit = units.get(current, target);

            return unit?.lifecycle === "ACTIVE"
                ? unit.hooks.get(key).filter(({ id }) => !hooks.excluded(options, key, id))
                : [];
        },
        find(current, id) {
            const unit = units.get(current, target);

            return unit?.lifecycle === "ACTIVE" ? unit.hooks.find(key, id) : undefined;
        },
    });
}
