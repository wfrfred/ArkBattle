import { replace as replaceUnits, lifetime as unitLifetime } from "../../battle/unit.js";
import { type State as BattleState, type Result } from "../../battle/state.js";
import type { Unit, Id } from "../unit.js";
import type { Ref } from "../../common/ref.js";
import * as units from "../query.js";
import {
    available,
    create,
    scope,
    type Lifetime,
    type Scope as LifetimeScope,
} from "../../lifetime/index.js";
import { register, unregister } from "../../lifetime/operations.js";
import type { Definition } from "./definition.js";
import { type Effect, ref as effectRef } from "./effect.js";
import { expired, validate, type Expiration } from "./expiration.js";
import { get } from "./query.js";

export interface Initial<S extends object> {
    readonly source?: Ref<Unit> | null;
    readonly scopes?: readonly LifetimeScope[];
    readonly expiration?: Expiration;
    readonly state?: S;
    readonly enabled?: boolean;
}

export function install<S extends object, H extends object>(
    battle: BattleState,
    host: Ref<Unit & NoInfer<H>>,
    definition: Definition<S, H>,
    initial: Initial<NoInfer<S>> = {},
): Result<Ref<Effect<S, H>> | undefined> {
    const unit = units.get(battle, host);
    const scopes = initial.scopes ?? [];
    const expiration = initial.expiration ?? { type: "INFINITE" };
    validate(expiration);

    if (unit?.lifecycle !== "PRESENT" || scopes.some((scope) => !available(battle, scope))) {
        return { state: battle, value: undefined };
    }

    const instance: Effect<S, H> = {
        id: unit.effects.nextId,
        host,
        definition,
        state: initial.state ?? definition.initialize(),
        source: initial.source ?? null,
        expiration,
        enabled: initial.enabled ?? true,
        status: "INSTALLING",
    };
    const ref = effectRef(instance);
    let currentUnit: Unit | undefined = { ...unit, effects: unit.effects.add(instance) };
    let installed: Effect<S, H> | undefined = instance;
    battle = replaceUnits(battle, [currentUnit]);
    battle = register(battle, scope(lifetime, ref), scope(unitLifetime, host), scopes);

    if (definition.onInstall !== undefined) {
        battle = definition.onInstall(battle, instance);
        currentUnit = units.get(battle, host);
        installed = currentUnit?.effects.get(ref);
    }
    if (installed?.status === "INSTALLING") {
        if (expired(installed.expiration, battle.tick)) {
            return { state: end(battle, ref, "EXPIRED"), value: ref };
        }

        battle = replaceEffect(battle, currentUnit!, { ...installed, status: "INACTIVE" });
        battle =
            definition.group === undefined
                ? updateStatus(battle, ref)
                : reconcileGroupActivity(battle, unit.id, definition.group.id);
    }

    return { state: battle, value: ref };
}

export function setState<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const unit = units.get<Unit>(battle, ref.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${ref.host.id}`);
    }

    const self = unit.effects.get(ref);
    if (self === undefined) {
        throw new RangeError(`unknown effect: ${ref.id}`);
    }

    return state === self.state ? battle : replaceEffect(battle, unit, { ...self, state });
}

export function setExpiration<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    expiration: NoInfer<T["expiration"]>,
): BattleState {
    validate(expiration);

    const unit = units.get<Unit>(battle, ref.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${ref.host.id}`);
    }

    const self = unit.effects.get(ref.id);
    if (self === undefined) {
        throw new RangeError(`unknown effect: ${ref.id}`);
    }

    return self.expiration === expiration
        ? battle
        : replaceEffect(battle, unit, { ...self, expiration });
}

export function setEnabled<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    enabled: boolean,
): BattleState {
    const unit = units.get<Unit>(battle, ref.host);
    const instance = unit?.effects.get(ref.id);
    if (instance === undefined || instance.status === "ENDING" || instance.enabled === enabled) {
        return battle;
    }

    battle = replaceEffect(battle, unit!, { ...instance, enabled });

    return updateStatus(battle, ref);
}

export const lifetime: Lifetime<Effect, Effect<any, any>, string> = create({
    kind: "EFFECT",
    address: (reference) => [reference.host.id, reference.id],
    get: (battle, reference) => units.get<Unit>(battle, reference.host)?.effects.get(reference.id),
    isEnding: (self) => self.status === "ENDING",
    begin: (self) => ({ ...self, status: "ENDING" }),
    replace: (battle, reference, next) =>
        replaceEffect(battle, units.get<Unit>(battle, reference.host)!, next),
    prepare(battle, reference, initial) {
        if (initial.status === "ACTIVE" && initial.definition.onDisable !== undefined) {
            const self = units.get<Unit>(battle, reference.host)!.effects.get(reference.id)!;
            battle = initial.definition.onDisable(battle, self);
        }

        return initial.definition.group === undefined
            ? battle
            : reconcileGroupActivity(battle, reference.host.id, initial.definition.group.id);
    },
    finalize(battle, reference, reason) {
        const self = units.get<Unit>(battle, reference.host)!.effects.get(reference.id)!;
        battle = self.definition.onEnd?.(battle, self, reason) ?? battle;
        const unit = units.get<Unit>(battle, reference.host)!;

        battle = replaceUnits(battle, [{ ...unit, effects: unit.effects.remove(reference.id) }]);

        return unregister(battle, scope(lifetime, reference));
    },
    reason: (reason) => reason,
    fromDependency: (reason) => reason,
});

export function end<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    reason = "EXPLICIT",
): BattleState {
    return lifetime.end(battle, ref, reason);
}

export function advance(battle: BattleState): BattleState {
    const candidates = units.all(battle).flatMap((host) => host.effects.values());

    for (const candidate of candidates) {
        const ref = effectRef(candidate);
        const unit = units.get(battle, ref.host);
        let instance = unit?.effects.get(ref.id);
        if (instance?.status === "ACTIVE") {
            const previous = instance.expiration;
            if (previous.type === "DURATION") {
                const elapsed = Math.min(previous.total, previous.elapsed + previous.rate);
                if (elapsed !== previous.elapsed) {
                    instance = { ...instance, expiration: { ...previous, elapsed } };
                    battle = replaceEffect(battle, unit!, instance);
                }
            }

            if (instance.definition.onTick !== undefined) {
                battle = instance.definition.onTick(battle, instance, previous);
            }
        }

        const current = get(battle, ref);
        if (
            current !== undefined &&
            current.status !== "ENDING" &&
            expired(current.expiration, battle.tick)
        ) {
            battle = end(battle, ref, "EXPIRED");
        }
    }

    return battle;
}

function replaceEffect<S extends object, H extends object>(
    battle: BattleState,
    unit: Unit,
    self: Effect<S, H>,
): BattleState {
    return replaceUnits(battle, [
        { ...unit, effects: unit.effects.replace(effectRef(self), self) },
    ]);
}

function updateStatus<T extends Effect<any, any>>(battle: BattleState, ref: Ref<T>): BattleState {
    const unit = units.get<Unit>(battle, ref.host);
    const instance = unit?.effects.get(ref.id);
    if (
        unit === undefined ||
        instance === undefined ||
        instance.status === "ENDING" ||
        instance.status === "INSTALLING"
    ) {
        return battle;
    }

    const group = instance.definition.group;
    const active =
        instance.enabled &&
        available(battle, scope(lifetime, ref)) &&
        (group === undefined ||
            !unit.effects
                .values()
                .some(
                    (other) =>
                        other.status !== "ENDING" &&
                        other.definition.group?.id === group.id &&
                        (other.definition.group.priority > group.priority ||
                            (other.definition.group.priority === group.priority &&
                                other.id < instance.id)),
                ));
    if (active === (instance.status === "ACTIVE")) {
        return battle;
    }
    if (active && expired(instance.expiration, battle.tick)) {
        return end(battle, ref, "EXPIRED");
    }

    const next: Effect = {
        ...instance,
        status: active ? "ACTIVE" : "INACTIVE",
    };
    battle = replaceEffect(battle, unit, next);

    const callback = active ? next.definition.onEnable : next.definition.onDisable;

    return callback === undefined ? battle : callback(battle, next);
}

function reconcileGroupActivity(battle: BattleState, unitId: Id, groupId: string): BattleState {
    const candidates =
        battle.battlefield.units
            .get(unitId)
            ?.effects.values()
            .filter((instance) => instance.definition.group?.id === groupId) ?? [];

    for (const candidate of candidates) {
        const ref = effectRef(candidate);
        if (get(battle, ref)?.status === "ACTIVE") {
            battle = updateStatus(battle, ref);
        }
    }
    for (const candidate of candidates) {
        const ref = effectRef(candidate);
        if (get(battle, ref)?.status === "INACTIVE") {
            battle = updateStatus(battle, ref);
        }
    }

    return battle;
}
