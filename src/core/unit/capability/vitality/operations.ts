import type { Ref } from "../../../common/ref.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { replace } from "../../../battle/unit.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import * as hooks from "../../../hook.js";
import type * as damage from "../../../battle/damage/hp/index.js";
import type * as healing from "../../../battle/healing/hp/index.js";
import { resolveMaxHp, type Vitality } from "./capability.js";

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

export function canReceiveDamage(battle: BattleState, context: damage.ReceivingContext): boolean {
    const target = units.get(battle, context.target);

    return (
        target?.lifecycle === "PRESENT" &&
        target.vitality.hp > 0 &&
        target.vitality.damageRules.every((rule) => rule.allows(battle, context))
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
): Result<damage.Pending> {
    battle = dispatchReceiving(
        battle,
        context.target,
        context,
        undefined,
        (unit) => unit.vitality.damageReceivingStarted,
    ).state;

    const result = dispatchReceiving(
        battle,
        context.target,
        context,
        pending,
        (unit) => unit.vitality.damageReceiving,
    );

    return {
        state: result.state,
        value: { ...result.value, amount: Math.max(0, result.value.amount) },
    };
}

export function receiveHealing(
    battle: BattleState,
    context: healing.ReceivingContext,
    pending: healing.Pending,
): Result<healing.Pending> {
    const result = dispatchReceiving(
        battle,
        context.target,
        context,
        pending,
        (unit) => unit.vitality.healingReceiving,
    );

    return {
        state: result.state,
        value: { ...result.value, amount: Math.max(0, result.value.amount) },
    };
}

export function commitDamage(
    battle: BattleState,
    context: damage.CommitContext,
): Result<DamageApplication> {
    const unit = units.get(battle, context.target)!;
    const hpBefore = unit.vitality.hp;
    const hpAfter = Math.max(0, hpBefore - context.received.amount);
    const application = { hpBefore, hpAfter, hpLoss: hpBefore - hpAfter };

    return {
        state:
            hpAfter === hpBefore
                ? battle
                : replace(battle, [{ ...unit, vitality: { ...unit.vitality, hp: hpAfter } }]),
        value: application,
    };
}

export function commitHealing(
    battle: BattleState,
    context: healing.CommitContext,
): Result<HealingApplication> {
    const unit = units.get(battle, context.target)!;
    const hpBefore = unit.vitality.hp;
    const maxHp = resolveMaxHp(unit.definition.vitality, unit.vitality);
    const hpAfter = hpBefore + Math.max(0, Math.min(context.received.amount, maxHp - hpBefore));
    const application = { hpBefore, hpAfter, hpGain: hpAfter - hpBefore };

    return {
        state:
            hpAfter === hpBefore
                ? battle
                : replace(battle, [{ ...unit, vitality: { ...unit.vitality, hp: hpAfter } }]),
        value: application,
    };
}

function dispatchReceiving<C, T>(
    battle: BattleState,
    target: Ref<Unit & Vitality>,
    context: C,
    initial: T,
    select: (
        unit: Unit & Vitality,
    ) => readonly (hooks.Hook<C, T> & { readonly priority?: number })[],
): Result<T> {
    return hooks.dispatch(battle, context, initial, {
        candidates(current) {
            const unit = units.get(current, target);

            return unit?.lifecycle === "PRESENT"
                ? [...select(unit)]
                      .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0))
                      .map(({ id }) => id)
                : [];
        },
        find(current, id) {
            const unit = units.get(current, target);

            return unit?.lifecycle === "PRESENT"
                ? select(unit).find((entry) => entry.id === id)
                : undefined;
        },
    });
}
