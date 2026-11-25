import { replace as replaceUnits, lifetime as unitLifetime } from "../operations.js";
import { cardForUnit } from "../../battle/deployment/query.js";
import { type State as BattleState, type Result } from "../../battle/state.js";
import type { Unit } from "../unit.js";
import type { Ref } from "../../common/ref.js";
import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import * as units from "../query.js";
import { available, create, scope, type Scope as LifetimeScope } from "../../lifetime/index.js";
import { register } from "../../lifetime/operations.js";
import type {
    Definition,
    DefinitionFields,
    Group,
    OrdinaryDefinition,
    OrdinaryGroup,
    StackDefinition,
} from "./definition.js";
import {
    type Effect,
    type OrdinaryEffect,
    type StackEffect,
    type GroupSource,
    createEffectRef,
    ref as effectRef,
} from "./effect.js";
import { expired, validate, type Expiration, type DecayExpiration } from "./expiration.js";
import { hasStack } from "./query.js";

export interface Initial<S extends object, E extends Expiration = Expiration> {
    readonly source?: Ref<Unit> | null;
    readonly scopes?: readonly LifetimeScope[];
    readonly expiration?: E;
    readonly state?: S;
    readonly enabled?: boolean;
}

export function install<S extends object, H extends object>(
    battle: BattleState,
    host: Ref<Unit & NoInfer<H>>,
    definition: OrdinaryDefinition<S, H> & {
        readonly group?: OrdinaryGroup & { readonly type: "DEFAULT" | "UNIQUE" };
    },
    initial?: Initial<NoInfer<S>>,
): Result<Ref<OrdinaryEffect<S, H>> | null>;
export function install<S extends object, H extends object>(
    battle: BattleState,
    host: Ref<Unit & NoInfer<H>>,
    definition: StackDefinition<S, H, "END">,
    initial?: Initial<NoInfer<S>>,
): Result<Ref<StackEffect<object, object, "END">> | null>;
export function install<S extends object, H extends object>(
    battle: BattleState,
    host: Ref<Unit & NoInfer<H>>,
    definition: StackDefinition<S, H, "DECAY">,
    initial?: Initial<NoInfer<S>, DecayExpiration>,
): Result<Ref<StackEffect<object, object, "DECAY">> | null>;
export function install<S extends object, H extends object>(
    battle: BattleState,
    host: Ref<Unit & NoInfer<H>>,
    definition: OrdinaryDefinition<S, H>,
    initial?: Initial<NoInfer<S>>,
): Result<Ref<OrdinaryEffect> | null>;
export function install<S extends object, H extends object>(
    battle: BattleState,
    host: Ref<Unit & NoInfer<H>>,
    definition: Definition<S, H>,
    initial: Initial<NoInfer<S>> = {},
): Result<Ref<Effect<any, any>> | null> {
    const unit = host.get(battle);
    const scopes = initial.scopes ?? [];
    const expiration = initial.expiration ?? { type: "INFINITE" };
    validate(expiration);

    if (
        unit?.lifecycle !== "ACTIVE" ||
        scopes.some((dependency) => !available(battle, dependency))
    ) {
        return { state: battle, value: null };
    }

    const group = definition.group;
    const source = initial.source ?? null;
    const groupSource = resolveGroupSource(battle, group, source);
    const retained =
        group === undefined
            ? undefined
            : unit.effects
                  .values()
                  .find(
                      (self) =>
                          self.lifecycle !== "ENDING" && matchesGroup(self, group, groupSource),
                  );

    if (retained !== undefined && group !== undefined) {
        const existing = retained.definition.group!;
        if (
            existing.type !== group.type ||
            (existing.type === "STACK" &&
                group.type === "STACK" &&
                existing.expirationPolicy !== group.expirationPolicy)
        ) {
            throw new TypeError(`incompatible policies for effect group ${group.id}`);
        }

        if (group.type === "UNIQUE") {
            return { state: battle, value: null };
        }

        if (group.type !== "DEFAULT") {
            return {
                state: merge(battle, unit, retained, expiration),
                value: effectRef(retained),
            };
        }
    }

    const id = unit.effects.nextId;
    const reference = createEffectRef(host);
    const instance = {
        id,
        ref: reference,
        host,
        definition,
        state: initial.state ?? definition.initialize(),
        source,
        groupSource,
        expiration,
        enabled: initial.enabled ?? true,
        lifecycle: "INSTALLING",
        ...(group?.type === "STACK" ? { stackCount: 1 } : {}),
    } as unknown as Effect;
    battle = replaceUnits(battle, [{ ...unit, effects: unit.effects.add(instance) }]);
    battle = register(battle, lifetime, reference, [scope(unitLifetime, host), ...scopes]);
    battle = callbacks(instance.definition).onInstall?.(battle, instance) ?? battle;

    if (reference.get(battle)?.lifecycle === "INSTALLING") {
        battle = settleExpiration(battle, reference);
        const current = reference.get(battle);
        if (current?.lifecycle === "INSTALLING") {
            battle = replaceEffect(battle, host.get(battle)!, {
                ...current,
                lifecycle: "INACTIVE",
            });

            if (!expired(current.expiration, battle.tick)) {
                battle =
                    group === undefined
                        ? updateLifecycle(battle, reference)
                        : reconcileGroupActivity(battle, current);
            }
        }
    }

    return { state: battle, value: reference };
}

export function setState<T extends Effect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const unit = (reference.host as Ref<Unit>).get(battle);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const self = unit.effects.get(reference);
    if (self === undefined) {
        throw new RangeError("unknown effect");
    }

    return state === self.state ? battle : replaceEffect(battle, unit, { ...self, state });
}

export function setExpiration<T extends Effect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
    expiration: NoInfer<T["expiration"]>,
): BattleState {
    validate(expiration);
    const unit = (reference.host as Ref<Unit>).get(battle);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const self = unit.effects.get(reference);
    if (self === undefined) {
        throw new RangeError("unknown effect");
    }

    if (self.expiration === expiration) {
        return battle;
    }

    const next: T = { ...self, expiration };

    return replaceEffect(battle, unit, next);
}

export function decreaseStack<T extends StackEffect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
    amount: number,
): BattleState {
    assertNonnegativeSafeInteger(amount, "effect stack consumption");
    const unit = (reference.host as Ref<Unit>).get(battle);
    const self = unit?.effects.get(reference);
    if (self === undefined || self.lifecycle === "ENDING" || amount === 0) {
        return battle;
    }

    const stack = self as StackEffect;

    return amount >= stack.stackCount
        ? remove(battle, reference)
        : updateStack(battle, unit!, stack, stack.stackCount - amount, stack.expiration);
}

export function setEnabled<T extends Effect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
    enabled: boolean,
): BattleState {
    const unit = (reference.host as Ref<Unit>).get(battle);
    const instance = unit?.effects.get(reference);
    if (instance === undefined || instance.lifecycle === "ENDING" || instance.enabled === enabled) {
        return battle;
    }

    battle = replaceEffect(battle, unit!, { ...instance, enabled });

    return updateLifecycle(battle, reference);
}

export const lifetime = create<Effect<any, any>, string>({
    end: {
        prepare(battle, reference, initial) {
            const host = (reference.host as Ref<Unit>).get(battle)!;
            const self = { ...initial, lifecycle: "ENDING" as const };
            battle = replaceEffect(battle, host, self);

            if (initial.lifecycle === "ACTIVE") {
                battle = callbacks(initial.definition).onDisable?.(battle, self) ?? battle;
            }

            return initial.definition.group === undefined
                ? battle
                : reconcileGroupActivity(battle, initial);
        },
        finalize(battle, reference, _initial, reason) {
            const self = reference.get(battle)!;
            battle = callbacks(self.definition).onEnd?.(battle, self, reason) ?? battle;
            const unit = (reference.host as Ref<Unit>).get(battle)!;

            return replaceUnits(battle, [{ ...unit, effects: unit.effects.remove(reference) }]);
        },
        dependencyEnd: "CANCELLED",
    },
});

export function remove<T extends Effect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
    reason = "EXPLICIT",
): BattleState {
    return lifetime.end(battle, reference, reason);
}

export function advance(battle: BattleState): BattleState {
    const candidates = units.all(battle).flatMap((host) => host.effects.values());

    for (const candidate of candidates) {
        const reference = effectRef(candidate);
        const unit = reference.host.get(battle);
        let instance = unit?.effects.get(reference);
        if (instance?.lifecycle === "ACTIVE" || instance?.lifecycle === "INACTIVE") {
            const previous = instance.expiration;
            if (previous.type === "DURATION") {
                const remaining = Math.max(0, previous.remaining - previous.rate);
                if (remaining !== previous.remaining) {
                    instance = { ...instance, expiration: { ...previous, remaining } };
                    battle = replaceEffect(battle, unit!, instance);
                }
            }
            if (instance.lifecycle === "ACTIVE") {
                battle =
                    callbacks(instance.definition).onTick?.(battle, instance, previous) ?? battle;
            }

            battle = settleExpiration(battle, reference);
        }
    }

    return battle;
}

type Callbacks = DefinitionFields<object, Effect> & {
    readonly onStackChange?: (
        battle: BattleState,
        self: StackEffect,
        previous: number,
    ) => BattleState;
};

function callbacks(definition: Definition<object>): Callbacks {
    return definition as Callbacks;
}

function replaceEffect(battle: BattleState, unit: Unit, self: Effect<any, any>): BattleState {
    return replaceUnits(battle, [{ ...unit, effects: unit.effects.replace(self) }]);
}

function resolveGroupSource(
    battle: BattleState,
    group: Group | undefined,
    source: Ref<Unit> | null,
): GroupSource | null {
    if (group?.independentSource !== true || source === null) {
        return null;
    }

    return cardForUnit(battle, source) ?? source;
}

function matchesGroup(self: Effect, group: Group, source: GroupSource | null): boolean {
    return (
        self.definition.group?.id === group.id &&
        self.definition.group.independentSource === group.independentSource &&
        self.groupSource === source
    );
}

function merge(battle: BattleState, unit: Unit, self: Effect, incoming: Expiration): BattleState {
    const group = self.definition.group!;
    if (hasStack(self)) {
        const policy = self.definition.group;
        const count =
            policy.maxCount === null
                ? self.stackCount + 1
                : Math.min(self.stackCount + 1, policy.maxCount);
        const expiration =
            count > self.stackCount || policy.refreshAtMax
                ? refreshTime(self.expiration, remainingTime(incoming, battle.tick), battle.tick)
                : self.expiration;

        return updateStack(battle, unit, self, count, expiration);
    }

    const amount = fullDuration(incoming, battle.tick);
    const expiration =
        group.type === "EXTEND"
            ? refreshTime(self.expiration, amount, battle.tick)
            : extendTime(self.expiration, amount);

    return expiration === self.expiration
        ? battle
        : replaceEffect(battle, unit, { ...self, expiration });
}

function updateStack(
    battle: BattleState,
    unit: Unit,
    self: StackEffect,
    count: number,
    expiration: Expiration,
): BattleState {
    if (count === self.stackCount && expiration === self.expiration) {
        return battle;
    }

    const next = { ...self, stackCount: count, expiration } as StackEffect;
    battle = replaceEffect(battle, unit, next);

    return count === self.stackCount
        ? battle
        : (callbacks(next.definition).onStackChange?.(battle, next, self.stackCount) ?? battle);
}

function settleExpiration(battle: BattleState, reference: Ref<Effect>): BattleState {
    const unit = reference.host.get(battle);
    const self = unit?.effects.get(reference);
    if (
        self === undefined ||
        self.lifecycle === "ENDING" ||
        !expired(self.expiration, battle.tick)
    ) {
        return battle;
    }
    if (
        hasStack(self) &&
        self.definition.group.expirationPolicy === "DECAY" &&
        self.expiration.type === "DURATION" &&
        self.stackCount > 1
    ) {
        return updateStack(battle, unit!, self, self.stackCount - 1, {
            ...self.expiration,
            remaining: self.expiration.duration,
        });
    }

    return remove(battle, reference, "EXPIRED");
}

function remainingTime(expiration: Expiration, tick: number): number {
    switch (expiration.type) {
        case "DURATION":
            return expiration.remaining;

        case "DEADLINE":
            return Math.max(0, expiration.tick - tick);

        case "INFINITE":
            return Infinity;
    }
}

function fullDuration(expiration: Expiration, tick: number): number {
    return expiration.type === "DURATION" ? expiration.duration : remainingTime(expiration, tick);
}

function refreshTime(expiration: Expiration, amount: number, tick: number): Expiration {
    if (expiration.type === "INFINITE") {
        return expiration;
    }
    if (amount === Infinity) {
        return { type: "INFINITE" };
    }
    if (expiration.type === "DURATION") {
        const remaining = Math.max(expiration.remaining, amount);

        return remaining === expiration.remaining ? expiration : { ...expiration, remaining };
    }

    const deadline = Math.max(expiration.tick, tick + Math.ceil(amount));

    return deadline === expiration.tick ? expiration : { ...expiration, tick: deadline };
}

function extendTime(expiration: Expiration, amount: number): Expiration {
    if (expiration.type === "INFINITE" || amount === Infinity || amount === 0) {
        return expiration;
    }

    return expiration.type === "DURATION"
        ? {
              ...expiration,
              duration: expiration.duration + amount,
              remaining: expiration.remaining + amount,
          }
        : { ...expiration, tick: expiration.tick + Math.ceil(amount) };
}

function updateLifecycle<T extends Effect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
): BattleState {
    const unit = (reference.host as Ref<Unit>).get(battle);
    const instance = unit?.effects.get(reference);
    if (
        unit === undefined ||
        instance === undefined ||
        instance.lifecycle === "ENDING" ||
        instance.lifecycle === "INSTALLING"
    ) {
        return battle;
    }

    const group = instance.definition.group;
    const active =
        instance.enabled &&
        available(battle, scope(lifetime, reference)) &&
        (group === undefined ||
            !unit.effects
                .values()
                .some(
                    (other) =>
                        other.lifecycle !== "ENDING" &&
                        matchesGroup(other, group, instance.groupSource) &&
                        (other.definition.group!.priority > group.priority ||
                            (other.definition.group!.priority === group.priority &&
                                other.id < instance.id)),
                ));
    if (active === (instance.lifecycle === "ACTIVE")) {
        return battle;
    }
    if (active && expired(instance.expiration, battle.tick)) {
        battle = settleExpiration(battle, reference);
        const current = reference.get(battle);

        return current !== undefined &&
            current.lifecycle !== "ENDING" &&
            !expired(current.expiration, battle.tick)
            ? updateLifecycle(battle, reference)
            : battle;
    }

    const next = { ...instance, lifecycle: active ? "ACTIVE" : "INACTIVE" } as Effect;
    battle = replaceEffect(battle, unit, next);
    const callback = active
        ? callbacks(next.definition).onEnable
        : callbacks(next.definition).onDisable;

    return callback?.(battle, next) ?? battle;
}

function reconcileGroupActivity(battle: BattleState, self: Effect): BattleState {
    const group = self.definition.group!;
    const candidates =
        self.host
            .get(battle)
            ?.effects.values()
            .filter((other) => matchesGroup(other, group, self.groupSource)) ?? [];

    for (const candidate of candidates) {
        const reference = effectRef(candidate);
        if (reference.get(battle)?.lifecycle === "ACTIVE") {
            battle = updateLifecycle(battle, reference);
        }
    }
    for (const candidate of candidates) {
        const reference = effectRef(candidate);
        if (reference.get(battle)?.lifecycle === "INACTIVE") {
            battle = updateLifecycle(battle, reference);
        }
    }

    return battle;
}
