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
import { resolveRecoverySpeed } from "./query.js";
import { allows } from "../../../restriction.js";
import type { Restriction } from "./restriction.js";
import { committing } from "./hook.js";

interface Application {
    readonly hpBefore: number;
    readonly hpAfter: number;
}

export interface DamageApplication extends Application {
    readonly hpLoss: number;
}

export interface HealingApplication extends Application {
    readonly hpGain: number;
}

export function canReceiveDamage(
    battle: BattleState,
    context: damage.ReceivingContext,
    ignore?: (restriction: Restriction) => boolean,
): boolean {
    const target = units.get(battle, context.target);

    return (
        target?.lifecycle === "PRESENT" &&
        target.vitality.hp > 0 &&
        allows(battle, context, target.vitality.damageRestrictions, ignore)
    );
}

export function canReceiveHealing(battle: BattleState, target: Ref<Unit & Vitality>): boolean {
    const unit = units.get(battle, target);

    return unit?.lifecycle === "PRESENT" && unit.vitality.hp > 0;
}

export function receiveDamage(
    battle: BattleState,
    context: damage.ReceivingContext,
    pending: damage.Pending,
    options?: hooks.Options,
): Result<damage.Pending> {
    const result = dispatchHook(battle, context.target, context, pending, damageReceiving, options);

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
    const result = dispatchHook(
        battle,
        context.target,
        context,
        pending,
        healingReceiving,
        options,
    );

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
    const unit = units.get(battle, context.target)!;
    const committed = commitHp(battle, unit, unit.vitality.hp - context.received.amount);
    const application = committed.value;

    return {
        state: committed.state,
        value:
            application === null
                ? null
                : {
                      ...application,
                      hpLoss: Math.max(0, application.hpBefore - application.hpAfter),
                  },
    };
}

export function commitHealing(
    battle: BattleState,
    context: healing.CommitContext,
): Result<HealingApplication | null> {
    const unit = units.get(battle, context.target)!;
    const committed = commitHp(battle, unit, unit.vitality.hp + context.received.amount);
    const application = committed.value;

    return {
        state: committed.state,
        value:
            application === null
                ? null
                : {
                      ...application,
                      hpGain: Math.max(0, application.hpAfter - application.hpBefore),
                  },
    };
}

export function advance(battle: BattleState, reference: Ref<Unit & Vitality>): BattleState {
    const unit = units.get(battle, reference);
    if (unit?.lifecycle !== "PRESENT" || unit.vitality.hp <= 0) {
        return battle;
    }

    const amount = resolveRecoverySpeed(battle, unit) / TICKS_PER_SECOND;

    return amount === 0 ? battle : commitHp(battle, unit, unit.vitality.hp + amount).state;
}

function commitHp(
    battle: BattleState,
    unit: Unit & Vitality,
    hp: number,
): Result<Application | null> {
    const target = units.ref(unit);
    const committed = dispatchHook(
        battle,
        target,
        { target, hpBefore: unit.vitality.hp },
        hp,
        committing,
    );
    battle = committed.state;
    const current = units.get(battle, target);
    if (current?.lifecycle !== "PRESENT" || current.vitality.hp <= 0) {
        return { state: battle, value: null };
    }

    const hpBefore = current.vitality.hp;
    const maxHp = resolveMaxHp(current.definition.vitality, current.vitality);
    const hpAfter = Math.max(0, Math.min(committed.value, maxHp));

    return {
        state:
            hpAfter === hpBefore
                ? battle
                : replace(battle, [{ ...current, vitality: { ...current.vitality, hp: hpAfter } }]),
        value: { hpBefore, hpAfter },
    };
}

function dispatchHook<C, T, H extends hooks.Hook<C, T> & { readonly priority?: number }>(
    battle: BattleState,
    target: Ref<Unit & Vitality>,
    context: C,
    initial: T,
    key: hooks.Key<H, Unit & Vitality>,
    options?: hooks.Options,
): Result<T> {
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
