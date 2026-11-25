import { cardForUnit } from "../battle/deployment/query.js";
import { type State as BattleState, type Result } from "../battle/state.js";
import type { Unit } from "../unit/unit.js";
import type { Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import { assertNonnegativeSafeInteger } from "../common/assert.js";
import { available, end, type Lifetime } from "../lifetime/index.js";
import { register } from "../lifetime/operations.js";
import type { Definition, Group, OrdinaryGroup } from "./definition.js";
import {
    type Effect,
    type GroupSource,
    type HostRef,
    createEffectRef,
    ref as effectRef,
} from "./effect.js";
import {
    expired,
    validate,
    type Expiration,
    type ExpirationPolicy,
    type Policy,
} from "./expiration.js";
import { all, forHost, hasStack } from "./query.js";

export interface Initial<S extends object, P extends Policy = undefined> {
    readonly source?: Ref<Unit> | null;
    readonly scopes?: readonly Ref<Lifetime>[];
    readonly expiration?: Expiration<P>;
    readonly state?: S;
    readonly enabled?: boolean;
}

export function install<S extends object, H extends Lifetime | null>(
    battle: BattleState,
    host: HostRef<NoInfer<H>>,
    definition: Definition<S, H> & {
        readonly group?: OrdinaryGroup & { readonly type: "DEFAULT" | "UNIQUE" };
    },
    initial?: Initial<NoInfer<S>>,
): Result<Ref<Effect<S, H, undefined>> | null>;
export function install<S extends object, H extends Lifetime | null, P extends Policy = undefined>(
    battle: BattleState,
    host: HostRef<NoInfer<H>>,
    definition: Definition<S, H, P>,
    initial?: Initial<NoInfer<S>, NoInfer<P>>,
): Result<Ref<Effect<object, H, P>> | null>;
export function install(
    battle: BattleState,
    host: HostRef,
    definition: Pick<Definition<object, Lifetime | null, Policy>, "id" | "group" | "initialize">,
    initial: Initial<object, Policy> = {},
): Result<Ref<Lifetime> | null> {
    const scopes = initial.scopes ?? [];
    const expiration = initial.expiration ?? { type: "INFINITE" };
    validate(expiration);

    if (
        (host !== null && !available(battle, host)) ||
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
            : forHost(battle, host).find(
                  (self) => self.lifecycle !== "ENDING" && matchesGroup(self, group, groupSource),
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
                state: merge(battle, retained, expiration),
                value: effectRef(retained),
            };
        }
    }

    const id = battle.execution.nextEffectId;
    const reference = createEffectRef(host);
    const instance = {
        id,
        ref: reference,
        config,
        definition,
        state: initial.state ?? definition.initialize(),
        source,
        groupSource,
        expiration,
        enabled: initial.enabled ?? true,
        lifecycle: "INSTALLING",
        ...(group?.type === "STACK" ? { stackCount: 1 } : {}),
    } as unknown as Effect;
    battle = replaceIn(battle, ["execution", "nextEffectId"], id + 1);
    battle = replaceIn(battle, ["effects"], battle.effects.add(reference, instance));
    battle = register(battle, reference, host === null ? scopes : [host, ...scopes]);
    battle = callbacks(instance.definition).onInstall?.(battle, instance) ?? battle;

    if (reference.get(battle)?.lifecycle === "INSTALLING") {
        battle = settleExpiration(battle, reference);
        const current = reference.get(battle);
        if (current?.lifecycle === "INSTALLING") {
            battle = replaceEffect(battle, {
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
    const self = reference.get(battle);
    if (self === undefined) {
        throw new RangeError("unknown effect");
    }

    return state === self.state ? battle : replaceEffect(battle, { ...self, state });
}

export function setExpiration<T extends Effect<any, any>>(
    battle: BattleState,
    reference: Ref<T>,
    expiration: NoInfer<T["expiration"]>,
): BattleState {
    validate(expiration);
    const self = reference.get(battle);
    if (self === undefined) {
        throw new RangeError("unknown effect");
    }

    return self.expiration === expiration
        ? battle
        : replaceEffect(battle, { ...self, expiration } as Effect<any, any>);
}

export function decreaseStack(
    battle: BattleState,
    reference: Ref<Effect<any, any, ExpirationPolicy>>,
    amount: number,
): BattleState {
    assertNonnegativeSafeInteger(amount, "effect stack consumption");
    const self = reference.get(battle);
    if (self === undefined || self.lifecycle === "ENDING" || amount === 0) {
        return battle;
    }

    return amount >= self.stackCount
        ? remove(battle, reference)
        : updateStack(battle, self, self.stackCount - amount, self.expiration);
}

export function setEnabled(
    battle: BattleState,
    reference: Ref<Effect<any, any>>,
    enabled: boolean,
): BattleState {
    const instance = reference.get(battle);
    if (instance === undefined || instance.lifecycle === "ENDING" || instance.enabled === enabled) {
        return battle;
    }

    battle = replaceEffect(battle, { ...instance, enabled });

    return updateLifecycle(battle, reference);
}

const config: Effect["config"] = {
    end: {
        prepare(battle, _reference, initial) {
            const self = { ...initial, lifecycle: "ENDING" as const };
            battle = replaceEffect(battle, self);

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

            return replaceIn(battle, ["effects"], battle.effects.remove(reference));
        },
        dependencyEnd: "CANCELLED",
    },
};

export function remove(
    battle: BattleState,
    reference: Ref<Effect<any, any>>,
    reason = "EXPLICIT",
): BattleState {
    return end(battle, reference, reason);
}

export function advance(battle: BattleState): BattleState {
    const candidates = all(battle);

    for (const candidate of candidates) {
        const reference = effectRef(candidate);
        let instance = reference.get(battle);
        if (instance?.lifecycle === "ACTIVE" || instance?.lifecycle === "INACTIVE") {
            const previous = instance.expiration;
            if (previous.type === "DURATION") {
                const remaining = Math.max(0, previous.remaining - previous.rate);
                if (remaining !== previous.remaining) {
                    instance = { ...instance, expiration: { ...previous, remaining } };
                    battle = replaceEffect(battle, instance);
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

interface Callbacks {
    readonly onInstall?: (battle: BattleState, self: Effect) => BattleState;
    readonly onEnable?: (battle: BattleState, self: Effect) => BattleState;
    readonly onDisable?: (battle: BattleState, self: Effect) => BattleState;
    readonly onTick?: (battle: BattleState, self: Effect, previous: Expiration) => BattleState;
    readonly onEnd?: (battle: BattleState, self: Effect, reason: string) => BattleState;
    readonly onStackChange?: (
        battle: BattleState,
        self: Effect<object, Lifetime | null, ExpirationPolicy>,
        previous: number,
    ) => BattleState;
}

function callbacks(definition: Effect["definition"]): Callbacks {
    return definition as unknown as Callbacks;
}

function replaceEffect(battle: BattleState, self: Effect<any, any>): BattleState {
    return replaceIn(battle, ["effects"], battle.effects.replace(effectRef(self), self));
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

function merge(battle: BattleState, self: Effect, incoming: Expiration): BattleState {
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

        return updateStack(battle, self, count, expiration);
    }

    const amount = fullDuration(incoming, battle.tick);
    const expiration =
        group.type === "EXTEND"
            ? refreshTime(self.expiration, amount, battle.tick)
            : extendTime(self.expiration, amount);

    return expiration === self.expiration ? battle : replaceEffect(battle, { ...self, expiration });
}

function updateStack(
    battle: BattleState,
    self: Effect<object, Lifetime | null, ExpirationPolicy>,
    count: number,
    expiration: Expiration,
): BattleState {
    if (count === self.stackCount && expiration === self.expiration) {
        return battle;
    }

    const next = { ...self, stackCount: count, expiration } as Effect<
        object,
        Lifetime | null,
        ExpirationPolicy
    >;
    battle = replaceEffect(battle, next);

    return count === self.stackCount
        ? battle
        : (callbacks(next.definition).onStackChange?.(battle, next, self.stackCount) ?? battle);
}

function settleExpiration(battle: BattleState, reference: Ref<Effect<any, any>>): BattleState {
    const self = reference.get(battle) as Effect | undefined;
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
        return updateStack(battle, self, self.stackCount - 1, {
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

function updateLifecycle(battle: BattleState, reference: Ref<Effect<any, any>>): BattleState {
    const instance = reference.get(battle) as unknown as Effect | undefined;
    if (
        instance === undefined ||
        instance.lifecycle === "ENDING" ||
        instance.lifecycle === "INSTALLING"
    ) {
        return battle;
    }

    const group = instance.definition.group;
    const active =
        instance.enabled &&
        available(battle, reference) &&
        (group === undefined ||
            !forHost(battle, instance.ref.host).some(
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
    battle = replaceEffect(battle, next);
    const callback = active
        ? callbacks(next.definition).onEnable
        : callbacks(next.definition).onDisable;

    return callback?.(battle, next) ?? battle;
}

function reconcileGroupActivity(battle: BattleState, self: Effect): BattleState {
    const group = self.definition.group!;
    const candidates = forHost(battle, self.ref.host).filter((other) =>
        matchesGroup(other, group, self.groupSource),
    );

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
