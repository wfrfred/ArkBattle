import { type State as BattleState, type Result } from "../battle/state.js";
import type { Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import { assertNonnegativeSafeInteger } from "../common/assert.js";
import { available, end, type Lifetime } from "../lifetime/index.js";
import { register } from "../lifetime/operations.js";
import type { Definition, StackDefinition } from "./definition.js";
import {
    assertCompatible,
    mergeExpiration,
    mergeStack,
    validateExpiration,
    type Group,
} from "./group.js";
import {
    type Effect,
    type StackEffect,
    type Initial,
    type HostRef,
    createEffectRef,
    ref as effectRef,
} from "./effect.js";
import { elapse, expired } from "./expiration.js";
import { all, canEnable, forGroup, hasStack, resolveGroupSource } from "./query.js";

export function install<S extends object, H extends Lifetime | null>(
    battle: BattleState,
    host: HostRef<H>,
    definition: Definition<S, H> & {
        readonly group?: Group & { readonly type: "DEFAULT" | "UNIQUE" };
    },
    initial: Initial,
): Result<Ref<Effect<S, H>> | null>;
export function install<S extends object, H extends Lifetime | null>(
    battle: BattleState,
    host: HostRef<H>,
    definition: StackDefinition<S, H>,
    initial: Initial,
): Result<Ref<StackEffect<object, H>> | null>;
export function install<S extends object, H extends Lifetime | null>(
    battle: BattleState,
    host: HostRef<H>,
    definition: Definition<S, H> | StackDefinition<S, H>,
    initial: Initial,
): Result<Ref<Effect<object, H>> | null>;
export function install(
    battle: BattleState,
    host: HostRef,
    definition: Definition<object, Lifetime | null, never>,
    initial: Initial,
): Result<Ref<Effect> | null> {
    const { source, scopes, expiration, enabled } = initial;
    const group = definition.group;
    validateExpiration(group, expiration);

    if (
        (host !== null && !available(battle, host)) ||
        scopes.some((dependency) => !available(battle, dependency))
    ) {
        return { state: battle, value: null };
    }

    const groupSource = resolveGroupSource(battle, group, source);

    if (group !== undefined) {
        const [retained] = forGroup(battle, host, group, groupSource);
        if (retained !== undefined) {
            assertCompatible(retained.definition.group!, group);

            if (group.type === "UNIQUE") {
                return { state: battle, value: null };
            }
            if (hasStack(retained)) {
                return {
                    state: updateStack(
                        battle,
                        retained,
                        mergeStack(retained, expiration, battle.tick),
                    ),
                    value: effectRef(retained),
                };
            }
            if (group.type === "EXTEND" || group.type === "EXTEND_TIME") {
                const next = mergeExpiration(
                    group.type,
                    retained.expiration,
                    expiration,
                    battle.tick,
                );

                return {
                    state:
                        next === retained.expiration
                            ? battle
                            : replaceEffect(battle, { ...retained, expiration: next }),
                    value: effectRef(retained),
                };
            }
        }
    }

    const id = battle.execution.nextEffectId;
    const reference = createEffectRef(host);
    const instance: Effect = {
        id,
        ref: reference,
        config,
        definition,
        state: definition.initialize(battle),
        source,
        groupSource,
        expiration,
        enabled,
        lifecycle: "INSTALLING",
        ...(group?.type === "STACK" ? { stackCount: 1 } : {}),
    };
    battle = replaceIn(battle, ["execution", "nextEffectId"], id + 1);
    battle = replaceIn(battle, ["effects"], battle.effects.add(reference, instance));
    battle = register(battle, reference, host === null ? scopes : [host, ...scopes]);
    battle = (definition as Definition).onInstall?.(battle, instance) ?? battle;

    if (reference.get(battle)?.lifecycle === "INSTALLING") {
        battle = settleExpiration(battle, reference);
        const current = reference.get(battle);
        if (current?.lifecycle === "INSTALLING") {
            battle = replaceEffect(battle, { ...current, lifecycle: "INACTIVE" });

            if (!expired(current.expiration, battle.tick)) {
                battle =
                    group?.type === "DEFAULT"
                        ? reconcileGroupActivity(battle, current)
                        : updateLifecycle(battle, reference);
            }
        }
    }

    return { state: battle, value: reference };
}

export function setState<T extends Effect>(
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

export function setExpiration<T extends Effect>(
    battle: BattleState,
    reference: Ref<T>,
    expiration: NoInfer<T["expiration"]>,
): BattleState {
    const self = reference.get(battle);
    if (self === undefined) {
        throw new RangeError("unknown effect");
    }

    validateExpiration(self.definition.group, expiration);

    return self.expiration === expiration ? battle : replaceEffect(battle, { ...self, expiration });
}

export function decreaseStack(
    battle: BattleState,
    reference: Ref<StackEffect>,
    amount: number,
): BattleState {
    assertNonnegativeSafeInteger(amount, "effect stack consumption");
    const self = reference.get(battle);
    if (self === undefined || self.lifecycle === "ENDING" || amount === 0) {
        return battle;
    }

    return amount >= self.stackCount
        ? remove(battle, reference)
        : updateStack(battle, self, { ...self, stackCount: self.stackCount - amount });
}

export function setEnabled(
    battle: BattleState,
    reference: Ref<Effect>,
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
            const self: Effect = { ...initial, lifecycle: "ENDING" };
            battle = replaceEffect(battle, self);

            if (initial.lifecycle === "ACTIVE") {
                battle = (initial.definition as Definition).onDisable?.(battle, self) ?? battle;
            }

            return initial.definition.group?.type === "DEFAULT"
                ? reconcileGroupActivity(battle, initial)
                : battle;
        },
        finalize(battle, reference, _initial, reason) {
            const self = reference.get(battle)!;
            battle = (self.definition as Definition).onEnd?.(battle, self, reason) ?? battle;

            return replaceIn(battle, ["effects"], battle.effects.remove(reference));
        },
        dependencyEnd: "CANCELLED",
    },
};

export function remove(
    battle: BattleState,
    reference: Ref<Effect>,
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
            const expiration = elapse(previous);
            if (expiration !== previous) {
                instance = { ...instance, expiration };
                battle = replaceEffect(battle, instance);
            }
            if (instance.lifecycle === "ACTIVE") {
                battle =
                    (instance.definition as Definition).onTick?.(battle, instance, previous) ??
                    battle;
            }

            battle = settleExpiration(battle, reference);
        }
    }

    return battle;
}

function replaceEffect(battle: BattleState, self: Effect): BattleState {
    return replaceIn(battle, ["effects"], battle.effects.replace(effectRef(self), self));
}

function updateStack(battle: BattleState, previous: StackEffect, next: StackEffect): BattleState {
    battle = replaceEffect(battle, next);

    return previous.stackCount === next.stackCount
        ? battle
        : ((next.definition as StackDefinition).onStackChange?.(
              battle,
              next,
              previous.stackCount,
          ) ?? battle);
}

function settleExpiration(battle: BattleState, reference: Ref<Effect>): BattleState {
    const self = reference.get(battle);
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
        return updateStack(battle, self, {
            ...self,
            stackCount: self.stackCount - 1,
            expiration: { ...self.expiration, remaining: self.expiration.duration },
        });
    }

    return remove(battle, reference, "EXPIRED");
}

function updateLifecycle(battle: BattleState, reference: Ref<Effect>): BattleState {
    const instance = reference.get(battle);
    if (
        instance === undefined ||
        instance.lifecycle === "ENDING" ||
        instance.lifecycle === "INSTALLING"
    ) {
        return battle;
    }

    const active = canEnable(battle, instance);
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

    const next: Effect = { ...instance, lifecycle: active ? "ACTIVE" : "INACTIVE" };
    battle = replaceEffect(battle, next);
    const definition = next.definition as Definition;
    const callback = active ? definition.onEnable : definition.onDisable;

    return callback?.(battle, next) ?? battle;
}

function reconcileGroupActivity(battle: BattleState, self: Effect): BattleState {
    const candidates = forGroup(battle, self.ref.host, self.definition.group!, self.groupSource);

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
