import type { Ref } from "../../../common/ref.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { replace } from "../../../battle/unit.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import * as hooks from "../../../hook.js";
import type * as damage from "../../../battle/resource/hp/damage/index.js";
import type * as healing from "../../../battle/resource/hp/healing/index.js";
import { receiving as damageReceiving } from "../../../battle/resource/hp/damage/hook.js";
import { receiving as healingReceiving } from "../../../battle/resource/hp/healing/hook.js";
import { resolveMaxHp, type Vitality } from "./capability.js";
import { isAlive, resolveRecoverySpeed } from "./query.js";
import { allows } from "../../../restriction.js";
import type { Restriction } from "./restriction.js";
import { damageCommitting } from "./hook.js";

export interface DamageApplication {
    readonly hpBefore: number;
    readonly hpAfter: number;
    readonly hpLoss: number;
}

export interface HealingApplication {
    readonly hpBefore: number;
    readonly hpAfter: number;
    readonly hpGain: number;
}

export function canReceiveDamage(
    battle: BattleState,
    context: damage.ReceivingContext,
    ignore?: (restriction: Restriction) => boolean,
): boolean {
    const target = units.get(battle, context.request.target);

    return (
        target?.lifecycle === "PRESENT" &&
        isAlive(target) &&
        allows(battle, context, target.vitality.damageRestrictions, ignore)
    );
}

export function canReceiveHealing(battle: BattleState, target: Ref<Unit & Vitality>): boolean {
    const unit = units.get(battle, target);

    return unit?.lifecycle === "PRESENT" && isAlive(unit);
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
    const committed = dispatchHook(
        battle,
        { request: context.request, hpBefore: unit.vitality.hp },
        unit.vitality.hp - context.received.amount,
        damageCommitting,
    );
    battle = committed.state;
    const current = units.get(battle, target);
    if (current?.lifecycle !== "PRESENT" || !isAlive(current)) {
        return { state: battle, value: null };
    }

    const hpBefore = current.vitality.hp;
    const maxHp = resolveMaxHp(current.definition.vitality, current.vitality);
    const hpAfter = Math.max(0, Math.min(committed.value, maxHp));
    const application = { hpBefore, hpAfter, hpLoss: Math.max(0, hpBefore - hpAfter) };

    return {
        state:
            hpAfter === hpBefore
                ? battle
                : replace(battle, [{ ...current, vitality: { ...current.vitality, hp: hpAfter } }]),
        value: application,
    };
}

export function commitHealing(
    battle: BattleState,
    context: healing.CommitContext,
): Result<HealingApplication> {
    const unit = units.get(battle, context.request.target)!;

    return increaseHp(battle, unit, context.received.amount);
}

export function advance(battle: BattleState, reference: Ref<Unit & Vitality>): BattleState {
    const unit = units.get(battle, reference);
    if (unit?.lifecycle !== "PRESENT" || !isAlive(unit)) {
        return battle;
    }

    return increaseHp(battle, unit, resolveRecoverySpeed(battle, unit) / TICKS_PER_SECOND).state;
}

function increaseHp(
    battle: BattleState,
    unit: Unit & Vitality,
    amount: number,
): Result<HealingApplication> {
    const hpBefore = unit.vitality.hp;
    const maxHp = resolveMaxHp(unit.definition.vitality, unit.vitality);
    const hpAfter = hpBefore + Math.max(0, Math.min(amount, maxHp - hpBefore));
    const application = { hpBefore, hpAfter, hpGain: hpAfter - hpBefore };

    return {
        state:
            hpAfter === hpBefore
                ? battle
                : replace(battle, [{ ...unit, vitality: { ...unit.vitality, hp: hpAfter } }]),
        value: application,
    };
}

function dispatchHook<
    C extends damage.Context | healing.Context,
    T,
    H extends hooks.Hook<C, T> & { readonly priority?: number },
>(
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

            return unit?.lifecycle === "PRESENT"
                ? [...unit.hooks.get(key)]
                      .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0))
                      .map(({ id }) => id)
                      .filter((id) => !hooks.excluded(options, key, id))
                : [];
        },
        find(current, id) {
            const unit = units.get(current, target);

            return unit?.lifecycle === "PRESENT" ? unit.hooks.find(key, id) : undefined;
        },
    });
}
