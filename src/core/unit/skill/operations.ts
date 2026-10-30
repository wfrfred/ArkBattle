import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import { replace as replaceUnits, update } from "../../battle/unit.js";
import type { Identified, Ref } from "../../common/ref.js";
import { appendEvents, type State as BattleState, type Result } from "../../battle/state.js";
import * as lifetimes from "../../lifetime/index.js";
import * as units from "../query.js";
import type { Unit } from "../unit.js";
import * as contribution from "../contribution/contribution.js";
import { isSpatiallyPresent } from "../capability/presence/capability.js";
import { hasVitality } from "../capability/vitality/capability.js";
import { hasAction, setReleasedHook } from "../capability/action/capability.js";
import type { ReleasedHook } from "../capability/action/release.js";
import { setHook as setDamageHook, type ReceivingStartedHook } from "../../battle/damage/hook.js";
import { hasSkill, type Skill as SkillCapability } from "../capability/skill/capability.js";
import {
    ref as activationRef,
    type Activation,
    type Trigger,
    type End,
    type Operation,
} from "./activation.js";
import type { State as SustainState } from "./sustain.js";
import { dispatch } from "../capability/skill/hook.js";
import * as query from "./query.js";
import { ref as skillRef, type Skill } from "./skill.js";
import * as sp from "./sp.js";
import { resolveCapacity as resolveAmmoCapacity } from "./ammo.js";

const hitRecovery: ReceivingStartedHook = {
    id: "@skill/hit-recovery",
    stage: "receivingStarted",
    priority: 0,
    invoke: (battle, { request }) => {
        const target = units.get(battle, request.target);

        return {
            state:
                target !== undefined && hasSkill(target)
                    ? sp.recover(battle, units.ref(target), "HIT").state
                    : battle,
            value: undefined,
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

export type Outcome<T extends Activation<any, any> = Activation> =
    | { readonly type: "ACTIVATED"; readonly ref: Ref<T> }
    | { readonly type: "REJECTED"; readonly reason: string };

export type Signal = {
    readonly unitId: number;
    readonly skillId: string;
    readonly activationId: number;
    readonly tick: number;
} & (
    | { readonly type: "SKILL_ACTIVATED"; readonly endsAtTick: number | null }
    | { readonly type: "SKILL_FINISHED"; readonly end: End }
);

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
    if (active.status === "ENDING") {
        throw new TypeError("cannot update an ending skill activation");
    }

    return state === active.state
        ? battle
        : replaceSkill(battle, unit, { ...self, activation: { ...active, state } });
}

export function activate<S extends object, A extends object>(
    battle: BattleState,
    reference: Ref<Skill<S, A>>,
    trigger: Trigger = "MANUAL",
): Result<Outcome<Activation<S, A>>> {
    const source = reference.host;
    const unit = units.get(battle, source);
    const reject = (reason: string): Result<Outcome<Activation<S, A>>> => ({
        state: battle,
        value: { type: "REJECTED", reason },
    });
    if (
        unit?.lifecycle !== "PRESENT" ||
        !isSpatiallyPresent(unit) ||
        (hasVitality(unit) && unit.vitality.hp <= 0)
    ) {
        return reject("UNAVAILABLE");
    }

    const self = query.getSkill(battle, reference);
    if (self === undefined) {
        throw new TypeError("skill definition is not configured for its source");
    }

    const definition = self.definition.activation;
    if (definition === null) {
        return reject("NO_ACTIVATION");
    }
    if (self.activation !== null) {
        return reject("ACTIVE");
    }
    if (definition.trigger !== trigger) {
        return reject("WRONG_TRIGGER");
    }
    if (trigger === "PASSIVE" && unit.skill.nextActivationId !== 0) {
        return reject("ALREADY_ACTIVATED");
    }
    if (
        !unit.skill.rules.every((rule) => rule.allowsActivation?.(battle, unit) ?? true) ||
        !(definition.accepts?.(battle, source, self) ?? true)
    ) {
        return reject("CONDITION");
    }

    const resource = self.definition.sp;
    const requirement = resource?.requirement ?? 0;
    const cost = definition.cost?.(battle, source, self) ?? resource?.cost ?? requirement;
    assertNonnegativeSafeInteger(cost, "skill activation SP cost");
    const previousSp = self.sp;
    if ((previousSp?.value ?? 0) < requirement || (previousSp?.value ?? 0) < cost) {
        return reject("INSUFFICIENT_SP");
    }

    const sustain = initialSustain(battle, unit);
    const active: Activation<S, A> = {
        definition: self.definition,
        state: self.state,
        sp: previousSp === null ? null : { ...previousSp, value: previousSp.value - cost },
        activation: {
            id: unit.skill.nextActivationId,
            startedAtTick: battle.tick,
            status: "ACTIVE",
            sustain,
            state: definition.initialize(battle, source, self),
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
    battle = appendEvents(battle, [
        {
            type: "SKILL_ACTIVATED",
            unitId: source.id,
            skillId: self.definition.id,
            activationId: active.activation.id,
            tick: battle.tick,
            endsAtTick: sustain.type === "TIME" ? sustain.endsAtTick : null,
        },
    ]);
    battle = dispatch(battle, source, "activationStarted", {
        ref: activationRef<Activation<any, any>>(source, active),
    });

    if (previousSp !== null) {
        battle = dispatch(battle, source, "spPaid", {
            amount: cost,
            previous: previousSp.value,
            current: previousSp.value - cost,
        });
    }

    const current = query.getActivation(battle, activatedRef);
    const currentUnit = units.get(battle, source);
    if (
        currentUnit?.lifecycle === "PRESENT" &&
        isSpatiallyPresent(currentUnit) &&
        (!hasVitality(currentUnit) || currentUnit.vitality.hp > 0) &&
        current?.activation.status === "ACTIVE" &&
        definition.onStart !== undefined
    ) {
        battle = definition.onStart(battle, source, current);
    }

    const after = query.getActivation(battle, activatedRef);
    if (
        after?.activation.status === "ACTIVE" &&
        after.activation.sustain.type === "TIME" &&
        after.activation.sustain.endsAtTick <= battle.tick
    ) {
        battle = finish(battle, activatedRef);
    }

    return { state: battle, value: { type: "ACTIVATED", ref: activatedRef } };
}

export const lifetime = lifetimes.create<Activation, Activation<any, any>, End>({
    kind: "SKILL",
    address: (reference) => [reference.host.id, reference.id],
    get: (battle, reference) => query.getActivation(battle, reference),
    isEnding: (self) => self.activation.status === "ENDING",
    begin: (self) => ({ ...self, activation: { ...self.activation, status: "ENDING" } }),
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
        battle = appendEvents(battle, [
            {
                type: "SKILL_FINISHED",
                unitId: reference.host.id,
                skillId: self.definition.id,
                activationId: self.activation.id,
                tick: battle.tick,
                end: ending,
            },
        ]);

        return dispatch(battle, reference.host, "activationEnded", {
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
): Result<{ readonly type: "APPLIED" } | { readonly type: "REJECTED"; readonly reason: string }> {
    const unit = units.get(battle, reference.host);
    const reject = (reason: string) => ({
        state: battle,
        value: { type: "REJECTED" as const, reason },
    });
    if (unit?.lifecycle !== "PRESENT") {
        return reject("UNAVAILABLE");
    }

    const self = query.getActivation(battle, reference);
    if (self?.activation.status !== "ACTIVE") {
        return reject("UNAVAILABLE");
    }

    const definition = self.definition.activation!;
    if (
        !unit.skill.rules.every((rule) => rule.allowsOperation?.(battle, unit, operation) ?? true)
    ) {
        return reject("CONDITION");
    }
    if (definition.onOperation !== undefined) {
        battle = definition.onOperation(battle, reference.host, self, operation);
    } else if (operation === "STOP") {
        battle = finish(battle, reference);
    } else {
        return reject("UNSUPPORTED");
    }

    return { state: battle, value: { type: "APPLIED" as const } };
}

export function advance(battle: BattleState, host: Ref<Unit & SkillCapability>): BattleState {
    battle = sp.advance(battle, host);
    let unit = units.get(battle, host);
    if (unit?.lifecycle === "PRESENT" && unit.skill.definition.onTick !== undefined) {
        battle = unit.skill.definition.onTick(battle, host, unit.skill);
    }

    unit = units.get(battle, host);

    if (unit?.lifecycle === "PRESENT" && unit.skill.activation?.status === "ACTIVE") {
        const active = unit.skill as Identified<never, typeof unit.skill> as Activation;
        if (
            active.activation.sustain.type === "TIME" &&
            active.activation.sustain.endsAtTick <= battle.tick
        ) {
            battle = finish(battle, activationRef<Activation>(host, active));
        } else {
            battle = active.definition.activation!.onTick?.(battle, host, active) ?? battle;
        }
    }

    const current = units.get(battle, host);
    const trigger = current?.skill.definition.activation?.trigger;
    if (
        current?.lifecycle === "PRESENT" &&
        current.skill.activation === null &&
        (trigger === "AUTO" || trigger === "PASSIVE")
    ) {
        battle = activate(battle, skillRef(host, current.skill.definition), trigger).state;
    }

    return battle;
}

export function enter(battle: BattleState, host: Ref<Unit & SkillCapability>): BattleState {
    let unit = units.get(battle, host);
    if (unit?.lifecycle !== "PRESENT") {
        return battle;
    }

    const definition = unit.skill.definition;
    if (hasVitality(unit) && definition.sp?.recovery.type === "HIT") {
        battle = update(battle, [setDamageHook(units.ref(unit), hitRecovery)]);
    } else if (hasAction(unit) && definition.sp?.recovery.type === "ACTION") {
        battle = update(battle, [setReleasedHook(units.ref(unit), actionRecovery)]);
    }

    unit = units.get(battle, host);

    if (unit?.lifecycle === "PRESENT" && definition.onEnter !== undefined) {
        battle = definition.onEnter(battle, host, unit.skill);
    }

    unit = units.get(battle, host);

    if (unit?.lifecycle === "PRESENT" && unit.skill.definition.activation?.trigger === "PASSIVE") {
        return activate(battle, skillRef(host, unit.skill.definition), "PASSIVE").state;
    }

    return battle;
}

export function extendTime<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
    ticks: number,
): BattleState {
    if (!Number.isSafeInteger(ticks)) {
        throw new TypeError("skill time adjustment must be a safe integer");
    }

    const unit = units.get(battle, reference.host);
    if (unit?.lifecycle !== "PRESENT" || (hasVitality(unit) && unit.vitality.hp <= 0)) {
        return battle;
    }

    const active = unit.skill.activation;
    if (
        active?.id !== reference.id ||
        active.status !== "ACTIVE" ||
        active.sustain.type !== "TIME"
    ) {
        return battle;
    }

    const endsAtTick = Math.max(battle.tick, active.sustain.endsAtTick + ticks);

    return replaceUnits(battle, [
        {
            ...unit,
            skill: {
                ...unit.skill,
                activation: { ...active, sustain: { type: "TIME", endsAtTick } },
            },
        },
    ]);
}

function initialSustain(battle: BattleState, unit: Unit & SkillCapability): SustainState {
    const definition = unit.skill.definition.activation!.sustain;

    if (definition.type === "INFINITE") {
        return { type: "INFINITE" };
    }

    if (definition.type === "AMMO") {
        const budget = resolveAmmoCapacity(
            definition.amount,
            contribution
                .resolve(unit.skill.ammo)
                .flatMap((input) => (typeof input === "function" ? input(battle, unit) : input)),
        );

        return { type: "AMMO", initial: budget, remaining: budget, replenished: 0 };
    }

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
