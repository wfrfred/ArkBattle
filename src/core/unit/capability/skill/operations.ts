import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import { lifetime as unitLifetime, replace as replaceUnits, update } from "../../operations.js";
import type { Identified, Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState, type Result } from "../../../battle/state.js";
import * as lifetimes from "../../../lifetime/index.js";
import { register, unregister } from "../../../lifetime/operations.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { setHook, type EnteredHook } from "../../hook.js";
import * as contribution from "../../../common/contribution.js";
import { hasVitality } from "../vitality/capability.js";
import { isAlive } from "../vitality/query.js";
import { hasAction } from "../action/capability.js";
import { released, type ReleasedHook } from "../action/release.js";
import { receiving, type ReceivingHook } from "../../../battle/resource/hp/damage/hook.js";
import { hasSkill, type Skill as SkillCapability } from "./capability.js";
import {
    ref as activationRef,
    type Activation,
    type Parameters as ActivationParameters,
    type End,
    type Operation,
} from "./activation.js";
import type { Definition as DurationDefinition, State as DurationState } from "./duration.js";
import { dispatch, activationStarted, spPaid, activationEnded } from "./hook.js";
import * as query from "./query.js";
import { ref as skillRef, type Skill } from "./skill.js";
import * as sp from "./sp.js";
import { resolveCapacity as resolveAmmoCapacity } from "./ammo.js";
import { allows } from "../../../restriction.js";

const hitRecovery: ReceivingHook = {
    id: "@skill/hit-recovery",
    priority: 10000,
    accepts: (_battle, { request }, current) =>
        current.type !== "CANCELLED" &&
        current.amount > 0 &&
        request.nature !== "LOSS" &&
        request.hitRecovery,
    invoke: (battle, { request }, current) => {
        const target = units.get(battle, request.target);

        return {
            state:
                target !== undefined && hasSkill(target)
                    ? sp.recover(battle, units.ref(target), "HIT").state
                    : battle,
            value: current,
        };
    },
};

const actionRecovery: ReleasedHook = {
    id: "@skill/action-recovery",
    invoke: (battle, { source }) => {
        const unit = units.get(battle, source);

        return {
            state:
                unit !== undefined && hasSkill(unit)
                    ? sp.recover(battle, units.ref(unit), "ACTION").state
                    : battle,
            value: undefined,
        };
    },
};

export function setState<X extends Skill<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    state: NoInfer<X["state"]>,
): BattleState {
    const unit = units.get(battle, reference.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const self = query.getSkill(battle, reference);
    if (self === undefined) {
        throw new TypeError("skill definition is not configured for its source");
    }

    return state === self.state ? battle : replaceSkill(battle, unit, { ...self, state });
}

export function setActivationState<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    state: NoInfer<X["activation"]["state"]>,
): BattleState {
    const unit = units.get(battle, reference.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const self = query.getActivation(battle, reference);
    if (self === undefined) {
        throw new RangeError(`unknown skill activation: ${reference.id}`);
    }

    const active = self.activation;
    if (active.lifecycle === "ENDING") {
        throw new TypeError("cannot update an ending skill activation");
    }

    return state === active.state
        ? battle
        : replaceSkill(battle, unit, { ...self, activation: { ...active, state } });
}

export function activate<S extends object, A extends object>(
    battle: BattleState,
    reference: Ref<Skill<S, A>>,
    parameters?: ActivationParameters,
): Result<Ref<Activation<S, A>> | null> {
    if (parameters !== undefined) {
        assertNonnegativeSafeInteger(parameters.requirement, "skill activation SP requirement");
        assertNonnegativeSafeInteger(parameters.cost, "skill activation SP cost");
    }

    const source = reference.host;
    const unit = units.get(battle, source);
    if (unit?.lifecycle !== "ACTIVE" || (hasVitality(unit) && !isAlive(unit))) {
        return { state: battle, value: null };
    }

    const self = query.getSkill(battle, reference);
    if (self === undefined) {
        throw new TypeError("skill definition is not configured for its source");
    }

    const definition = self.definition.activation;
    if (definition === null) {
        return { state: battle, value: null };
    }
    if (self.activation !== null) {
        return { state: battle, value: null };
    }
    if (definition.trigger === "PASSIVE" && unit.skill.nextActivationId !== 0) {
        return { state: battle, value: null };
    }
    if (
        !allows(battle, { self: unit }, unit.skill.activationRestrictions, (restriction) =>
            definition.ignoreRestrictions.includes(restriction),
        ) ||
        !(definition.accepts?.(battle, source, self) ?? true)
    ) {
        return { state: battle, value: null };
    }

    const { requirement, cost } = parameters ?? definition;
    const previousSp = self.sp;
    if ((previousSp?.value ?? 0) < requirement || (previousSp?.value ?? 0) < cost) {
        return { state: battle, value: null };
    }

    const initialized = definition.initialize(battle, source, self);
    const duration = initialDuration(battle, unit, initialized.duration);
    const active: Activation<S, A> = {
        definition: self.definition,
        state: self.state,
        sp: previousSp === null ? null : { ...previousSp, value: previousSp.value - cost },
        activation: {
            id: unit.skill.nextActivationId,
            startedAtTick: battle.tick,
            lifecycle: "ACTIVE",
            duration,
            state: initialized.state,
        },
    };
    const nextActivationId = active.activation.id + 1;

    battle = replaceUnits(battle, [
        {
            ...unit,
            skill: {
                ...unit.skill,
                sp: active.sp,
                nextActivationId,
                activation: active.activation,
            },
        },
    ]);
    const activatedRef = activationRef(source, active);
    battle = register(
        battle,
        lifetimes.scope(lifetime, activatedRef),
        lifetimes.scope(unitLifetime, source),
    );
    battle = appendEvents(battle, [
        {
            type: "SKILL_ACTIVATED",
            unitId: source.id,
            tick: battle.tick,
        },
    ]);
    battle = dispatch(battle, source, activationStarted, {
        ref: activationRef<Activation<any, any>>(source, active),
    });

    if (previousSp !== null) {
        battle = dispatch(battle, source, spPaid, {
            amount: cost,
            previous: previousSp.value,
            current: previousSp.value - cost,
        });
    }

    const current = query.getActivation(battle, activatedRef);
    const currentUnit = units.get(battle, source);
    if (
        currentUnit?.lifecycle === "ACTIVE" &&
        (!hasVitality(currentUnit) || isAlive(currentUnit)) &&
        current?.activation.lifecycle === "ACTIVE" &&
        definition.onStart !== undefined
    ) {
        battle = definition.onStart(battle, source, current);
    }

    const after = query.getActivation(battle, activatedRef);
    if (
        after?.activation.lifecycle === "ACTIVE" &&
        after.activation.duration.type === "TIME" &&
        after.activation.duration.endsAtTick <= battle.tick
    ) {
        battle = finish(battle, activatedRef);
    }

    return { state: battle, value: activatedRef };
}

export const lifetime = lifetimes.create<Activation, Activation<any, any>, End>({
    kind: "SKILL",
    address: (reference) => [reference.host.id, reference.id],
    get: (battle, reference) => query.getActivation(battle, reference),
    isEnding: (self) => self.activation.lifecycle === "ENDING",
    begin: (self) => ({ ...self, activation: { ...self.activation, lifecycle: "ENDING" } }),
    replace(battle, reference, next) {
        const host = units.get(battle, reference.host)!;

        return replaceSkill(battle, host, next);
    },
    finalize(battle, reference, ending) {
        const self = query.getActivation(battle, reference)!;
        battle =
            self.definition.activation!.onEnd?.(battle, reference.host, self, ending) ?? battle;

        const host = units.get(battle, reference.host)!;
        battle = replaceUnits(battle, [{ ...host, skill: { ...host.skill, activation: null } }]);
        battle = unregister(battle, lifetimes.scope(lifetime, reference));
        battle = appendEvents(battle, [
            {
                type: "SKILL_FINISHED",
                unitId: reference.host.id,
                tick: battle.tick,
            },
        ]);

        return dispatch(battle, reference.host, activationEnded, {
            ref: reference,
            end: ending,
        });
    },
    reason: (ending) => (ending.type === "FINISHED" ? "SKILL_FINISHED" : ending.reason),
    fromDependency: (reason) => ({ type: "CANCELLED", reason }),
});

export function finish<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): BattleState {
    return lifetime.end(battle, reference, { type: "FINISHED" });
}

export function cancel<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    reason = "CANCELLED",
): BattleState {
    return lifetime.end(battle, reference, { type: "CANCELLED", reason });
}

export function operate<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    operation: Operation,
): Result<boolean> {
    const unit = units.get(battle, reference.host);
    if (unit?.lifecycle !== "ACTIVE") {
        return { state: battle, value: false };
    }

    const self = query.getActivation(battle, reference);
    if (self?.activation.lifecycle !== "ACTIVE") {
        return { state: battle, value: false };
    }

    const handler = self.definition.activation!.operations?.[operation];
    if (handler === undefined) {
        return { state: battle, value: false };
    }

    if (!allows(battle, { self: unit, operation }, unit.skill.operationRestrictions)) {
        return { state: battle, value: false };
    }

    return { state: handler(battle, reference.host, self), value: true };
}

export function advance(battle: BattleState, host: Ref<Unit & SkillCapability>): BattleState {
    battle = sp.advance(battle, host);
    let unit = units.get(battle, host);
    if (unit?.lifecycle === "ACTIVE" && unit.skill.definition.onTick !== undefined) {
        battle = unit.skill.definition.onTick(battle, host, unit.skill);
    }

    unit = units.get(battle, host);

    if (unit?.lifecycle === "ACTIVE" && unit.skill.activation?.lifecycle === "ACTIVE") {
        const active = unit.skill as Identified<never, typeof unit.skill> as Activation;
        if (
            active.activation.duration.type === "TIME" &&
            active.activation.duration.endsAtTick <= battle.tick
        ) {
            battle = finish(battle, activationRef<Activation>(host, active));
        } else {
            battle = active.definition.activation!.onTick?.(battle, host, active) ?? battle;
        }
    }

    const current = units.get(battle, host);
    const trigger = current?.skill.definition.activation?.trigger;
    if (
        current?.lifecycle === "ACTIVE" &&
        current.skill.activation === null &&
        (trigger === "AUTO" || trigger === "PASSIVE")
    ) {
        battle = activate(battle, skillRef(host, current.skill.definition)).state;
    }

    return battle;
}

export const entered: EnteredHook = {
    id: "@skill/enter",
    invoke: (battle, self) => {
        const host = units.ref(self as Unit & SkillCapability);
        let unit = units.get(battle, host)!;
        const definition = unit.skill.definition;
        if (hasVitality(unit) && definition.sp?.recovery.type === "HIT") {
            battle = update(battle, units.ref(unit), setHook(receiving, hitRecovery));
        } else if (hasAction(unit) && definition.sp?.recovery.type === "ACTION") {
            battle = update(battle, units.ref(unit), setHook(released, actionRecovery));
        }

        unit = units.get(battle, host)!;
        battle = definition.onEnter?.(battle, host, unit.skill) ?? battle;

        const current = units.get(battle, host);
        if (
            current?.lifecycle === "ACTIVE" &&
            current.skill.definition.activation?.trigger === "PASSIVE"
        ) {
            battle = activate(battle, skillRef(host, current.skill.definition)).state;
        }

        return { state: battle, value: undefined };
    },
};

export function extendTime<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    ticks: number,
): BattleState {
    if (!Number.isSafeInteger(ticks)) {
        throw new TypeError("skill time adjustment must be a safe integer");
    }

    const unit = units.get(battle, reference.host);
    if (unit?.lifecycle !== "ACTIVE" || (hasVitality(unit) && !isAlive(unit))) {
        return battle;
    }

    const active = unit.skill.activation;
    if (
        active?.id !== reference.id ||
        active.lifecycle !== "ACTIVE" ||
        active.duration.type !== "TIME"
    ) {
        return battle;
    }

    const endsAtTick = Math.max(battle.tick, active.duration.endsAtTick + ticks);

    return replaceUnits(battle, [
        {
            ...unit,
            skill: {
                ...unit.skill,
                activation: { ...active, duration: { type: "TIME", endsAtTick } },
            },
        },
    ]);
}

function initialDuration(
    battle: BattleState,
    unit: Unit & SkillCapability,
    definition: DurationDefinition,
): DurationState {
    if (definition.type === "INFINITE") {
        return { type: "INFINITE" };
    }

    if (definition.type === "AMMO") {
        assertNonnegativeSafeInteger(definition.amount, "skill ammunition");

        const budget = resolveAmmoCapacity(
            definition.amount,
            contribution
                .resolve(unit.skill.ammo)
                .flatMap((input) => (typeof input === "function" ? input(battle, unit) : input)),
        );

        return { type: "AMMO", initial: budget, remaining: budget, replenished: 0 };
    }

    assertNonnegativeSafeInteger(definition.durationTicks, "skill duration ticks");

    return { type: "TIME", endsAtTick: battle.tick + definition.durationTicks };
}

function replaceSkill<S extends object, A extends object>(
    battle: BattleState,
    unit: Unit & SkillCapability,
    self: Skill<S, A> | Activation<S, A>,
): BattleState {
    return replaceUnits(battle, [
        {
            ...unit,
            skill: {
                ...unit.skill,
                definition: self.definition,
                state: self.state,
                sp: self.sp,
                activation: self.activation,
            },
        },
    ]);
}
