import { replace as replaceUnits, lifetime as unitLifetime } from "../../battle/unit.js";
import { cardForUnit } from "../../battle/deployment/query.js";
import { type State as BattleState, type Result } from "../../battle/state.js";
import type { Unit } from "../unit.js";
import type { Ref } from "../../common/ref.js";
import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import * as units from "../query.js";
import {
    available,
    create,
    scope,
    type Lifetime,
    type Scope as LifetimeScope,
} from "../../lifetime/index.js";
import { register, unregister } from "../../lifetime/operations.js";
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
    ref as effectRef,
} from "./effect.js";
import { expired, validate, type Expiration, type DecayExpiration } from "./expiration.js";
import { get, hasStack } from "./query.js";

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
    const unit = units.get(battle, host);
    const scopes = initial.scopes ?? [];
    const expiration = initial.expiration ?? { type: "INFINITE" };
    validate(expiration);

    if (
        unit?.lifecycle !== "PRESENT" ||
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

    if (retained !== undefined && group !== undefined && group.type !== "DEFAULT") {
        if (group.type === "UNIQUE") {
            return { state: battle, value: null };
        }

        return {
            state: merge(battle, unit, retained, expiration),
            value: effectRef(retained),
        };
    }

    const instance = {
        id: unit.effects.nextId,
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
    const reference = effectRef(instance);
    battle = replaceUnits(battle, [{ ...unit, effects: unit.effects.add(instance) }]);
    battle = register(battle, scope(lifetime, reference), scope(unitLifetime, host), scopes);
    battle = callbacks(instance.definition).onInstall?.(battle, instance) ?? battle;

    if (get(battle, reference)?.lifecycle === "INSTALLING") {
        battle = settleExpiration(battle, reference);
        const current = get(battle, reference);
        if (current?.lifecycle === "INSTALLING") {
            battle = replaceEffect(battle, units.get(battle, host)!, {
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
    const unit = units.get<Unit>(battle, reference.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const self = unit.effects.get(reference);
    if (self === undefined) {
        throw new RangeError(`unknown effect: ${reference.id}`);
    }

    return state === self.state ? battle : replaceEffect(battle, unit, { ...self, state });
}

export function setExpiration<T extends Effect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
    expiration: NoInfer<T["expiration"]>,
): BattleState {
    validate(expiration);
    const unit = units.get<Unit>(battle, reference.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.host.id}`);
    }

    const self = unit.effects.get(reference);
    if (self === undefined) {
        throw new RangeError(`unknown effect: ${reference.id}`);
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
    const unit = units.get<Unit>(battle, reference.host);
    const self = unit?.effects.get(reference.id);
    if (self === undefined || self.lifecycle === "ENDING" || amount === 0) {
        return battle;
    }

    const stack = self as StackEffect;

    return amount >= stack.stackCount
        ? end(battle, reference)
        : updateStack(battle, unit!, stack, stack.stackCount - amount, stack.expiration);
}

export function setEnabled<T extends Effect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
    enabled: boolean,
): BattleState {
    const unit = units.get<Unit>(battle, reference.host);
    const instance = unit?.effects.get(reference.id);
    if (instance === undefined || instance.lifecycle === "ENDING" || instance.enabled === enabled) {
        return battle;
    }

    battle = replaceEffect(battle, unit!, { ...instance, enabled });

    return updateLifecycle(battle, reference);
}

export const lifetime: Lifetime<Effect, Effect<any, any>, string> = create({
    kind: "EFFECT",
    address: (reference) => [reference.host.id, reference.id],
    get: (battle, reference) => units.get<Unit>(battle, reference.host)?.effects.get(reference.id),
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING" }),
    replace: (battle, reference, next) =>
        replaceEffect(battle, units.get<Unit>(battle, reference.host)!, next),
    prepare(battle, reference, initial) {
        if (initial.lifecycle === "ACTIVE") {
            const self = units.get<Unit>(battle, reference.host)!.effects.get(reference.id)!;
            battle = callbacks(initial.definition).onDisable?.(battle, self) ?? battle;
        }

        return initial.definition.group === undefined
            ? battle
            : reconcileGroupActivity(battle, initial);
    },
    finalize(battle, reference, reason) {
        const self = units.get<Unit>(battle, reference.host)!.effects.get(reference.id)!;
        battle = callbacks(self.definition).onEnd?.(battle, self, reason) ?? battle;
        const unit = units.get<Unit>(battle, reference.host)!;
        battle = replaceUnits(battle, [{ ...unit, effects: unit.effects.remove(reference.id) }]);

        return unregister(battle, scope(lifetime, reference));
    },
    reason: (reason) => reason,
    fromDependency: (reason) => reason,
});

export function end<T extends Effect<any, any>>(
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
        const unit = units.get(battle, reference.host);
        let instance = unit?.effects.get(reference.id);
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
    return replaceUnits(battle, [
        { ...unit, effects: unit.effects.replace(effectRef(self), self) },
    ]);
}

function resolveGroupSource(
    battle: BattleState,
    group: Group | undefined,
    source: Ref<Unit> | null,
): GroupSource | null {
    if (group?.independentSource !== true || source === null) {
        return null;
    }

    const card = cardForUnit(battle, source);

    return card === null ? { type: "UNIT", id: source.id } : { type: "CARD", id: card.id };
}

function matchesGroup(self: Effect, group: Group, source: GroupSource | null): boolean {
    return (
        self.definition.group?.id === group.id &&
        self.definition.group.independentSource === group.independentSource &&
        (self.groupSource === source ||
            (self.groupSource !== null &&
                source !== null &&
                self.groupSource.type === source.type &&
                self.groupSource.id === source.id))
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
    const unit = units.get(battle, reference.host);
    const self = unit?.effects.get(reference.id);
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

    return end(battle, reference, "EXPIRED");
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
    const unit = units.get<Unit>(battle, reference.host);
    const instance = unit?.effects.get(reference.id);
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
        const current = get(battle, reference);

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
        units
            .get(battle, self.host)
            ?.effects.values()
            .filter((other) => matchesGroup(other, group, self.groupSource)) ?? [];

    for (const candidate of candidates) {
        const reference = effectRef(candidate);
        if (get(battle, reference)?.lifecycle === "ACTIVE") {
            battle = updateLifecycle(battle, reference);
        }
    }
    for (const candidate of candidates) {
        const reference = effectRef(candidate);
        if (get(battle, reference)?.lifecycle === "INACTIVE") {
            battle = updateLifecycle(battle, reference);
        }
    }

    return battle;
}
