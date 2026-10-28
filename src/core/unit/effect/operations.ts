import { update as updateUnit } from "../../battle/unit.js";
import { type State as BattleState, type Result } from "../../battle/state.js";
import type { Unit, Id } from "../unit.js";
import type { Ref } from "../../common/ref.js";
import * as units from "../query.js";
import { available, create, scope, type Scope as LifetimeScope } from "../../lifetime/index.js";
import { key, wouldCycle } from "../../lifetime/dependency.js";
import type { Definition } from "./definition.js";
import { deadline, type Effect, ref as effectRef, type Scope } from "./effect.js";
import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import { get } from "./query.js";

export interface Initial<S extends object> {
    readonly source?: Ref<Unit> | null;
    readonly scopes?: readonly Scope[];
    readonly data?: S;
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

    for (const scope of scopes) {
        if (scope.type === "TICK") {
            assertNonnegativeSafeInteger(scope.tick, "effect deadline");
        }
    }

    if (
        unit?.lifecycle !== "PRESENT" ||
        scopes.some((scope) => scope.type !== "TICK" && !available(battle, scope))
    ) {
        return { state: battle, value: undefined };
    }

    const instance: Effect<S, H> = {
        id: unit.effects.nextId,
        host,
        definition,
        data: initial.data ?? definition.initialize(),
        source: initial.source ?? null,
        scopes,
        enabled: initial.enabled ?? true,
        status: "INSTALLING",
    };
    const ref = effectRef(instance);
    battle = updateUnit(battle, [{ ...unit, effects: unit.effects.add(instance) }]);

    let currentUnit = units.get(battle, host);
    let installed = currentUnit?.effects.get(ref);
    if (installed?.status === "INSTALLING" && definition.onInstall !== undefined) {
        battle = definition.onInstall(battle, installed);
        currentUnit = units.get(battle, host);
        installed = currentUnit?.effects.get(ref);
    }
    if (installed?.status === "INSTALLING") {
        battle = replaceEffect(battle, currentUnit!, { ...installed, status: "INACTIVE" });
        battle =
            definition.group === undefined
                ? updateStatus(battle, ref)
                : reconcileGroupActivity(battle, unit.id, definition.group.id);
    }

    return { state: battle, value: ref };
}

export function setData<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    data: NoInfer<T["data"]>,
): BattleState {
    const unit = units.get<Unit>(battle, ref.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${ref.host.id}`);
    }

    const self = unit.effects.get(ref);
    if (self === undefined) {
        throw new RangeError(`unknown effect: ${ref.id}`);
    }

    return data === self.data ? battle : replaceEffect(battle, unit, { ...self, data });
}

export function setDeadline<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    tick: number | null,
): BattleState {
    if (tick !== null) {
        assertNonnegativeSafeInteger(tick, "effect deadline");
    }

    const unit = units.get<Unit>(battle, ref.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${ref.host.id}`);
    }

    const self = unit.effects.getEffect(ref.id);
    if (self === undefined) {
        throw new RangeError(`unknown effect: ${ref.id}`);
    }

    const deadlines = self.scopes.filter((scope) => scope.type === "TICK");
    if (
        (tick === null && deadlines.length === 0) ||
        (deadlines.length === 1 && deadlines[0]!.tick === tick)
    ) {
        return battle;
    }

    return replaceEffect(battle, unit, {
        ...self,
        scopes: [
            ...self.scopes.filter((scope) => scope.type !== "TICK"),
            ...(tick === null ? [] : [{ type: "TICK" as const, tick }]),
        ],
    });
}

export function setEnabled<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    enabled: boolean,
): BattleState {
    const unit = units.get<Unit>(battle, ref.host);
    const instance = unit?.effects.getEffect(ref.id);
    if (instance === undefined || instance.status === "ENDING" || instance.enabled === enabled) {
        return battle;
    }

    battle = replaceEffect(battle, unit!, { ...instance, enabled });

    return updateStatus(battle, ref);
}

export function bindLifetime<T extends Effect<any, any>>(
    battle: BattleState,
    ref: Ref<T>,
    parent: LifetimeScope,
): Result<boolean> {
    const unit = units.get<Unit>(battle, ref.host);
    const instance = unit?.effects.getEffect(ref.id);
    if (instance === undefined || instance.status === "ENDING" || !available(battle, parent)) {
        return { state: battle, value: false };
    }

    if (wouldCycle(battle.lifetime.dependencies, scope(lifetime, ref), parent)) {
        throw new TypeError("effect scopes cannot form a cycle");
    }
    if (!instance.scopes.some((entry) => entry.type === "LIFETIME" && key(entry) === key(parent))) {
        battle = replaceEffect(battle, unit!, {
            ...instance,
            scopes: [...instance.scopes, parent],
        });
    }

    return { state: battle, value: true };
}

export const lifetime = create<Effect, Effect<any, any>, string>({
    kind: "EFFECT",
    address: (reference) => [reference.host.id, reference.id],
    get: (battle, reference) =>
        units.get<Unit>(battle, reference.host)?.effects.getEffect(reference.id),
    isEnding: (self) => self.status === "ENDING",
    begin: (self) => ({ ...self, status: "ENDING" }),
    replace: (battle, reference, next) =>
        replaceEffect(battle, units.get<Unit>(battle, reference.host)!, next),
    prepare(battle, reference, initial) {
        if (initial.status === "ACTIVE" && initial.definition.onDisable !== undefined) {
            const self = units.get<Unit>(battle, reference.host)!.effects.getEffect(reference.id)!;
            battle = initial.definition.onDisable(battle, self);
        }

        return initial.definition.group === undefined
            ? battle
            : reconcileGroupActivity(battle, reference.host.id, initial.definition.group.id);
    },
    finalize(battle, reference, reason) {
        const self = units.get<Unit>(battle, reference.host)!.effects.getEffect(reference.id)!;
        battle = self.definition.onEnd?.(battle, self, reason) ?? battle;
        const unit = units.get<Unit>(battle, reference.host)!;

        return updateUnit(battle, [{ ...unit, effects: unit.effects.remove(reference.id) }]);
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
    const candidates = units
        .all(battle)
        .flatMap((host) => host.effects.values().map(effectRef))
        .toArray();

    for (const ref of candidates) {
        const instance = units.get(battle, ref.host)?.effects.getEffect(ref.id);
        if (instance?.status === "ACTIVE" && instance.definition.onTick !== undefined) {
            battle = instance.definition.onTick(battle, instance);
        }

        const current = get(battle, ref);
        const expires = current === undefined ? null : deadline(current);
        if (expires !== null && expires <= battle.tick) {
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
    return updateUnit(battle, [{ ...unit, effects: unit.effects.replace(effectRef(self), self) }]);
}

function updateStatus<T extends Effect<any, any>>(battle: BattleState, ref: Ref<T>): BattleState {
    const unit = units.get<Unit>(battle, ref.host);
    const instance = unit?.effects.getEffect(ref.id);
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
        unit.lifecycle === "PRESENT" &&
        !instance.scopes.some((scope) => scope.type !== "TICK" && !available(battle, scope)) &&
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

    battle = replaceEffect(battle, unit, {
        ...instance,
        status: active ? "ACTIVE" : "INACTIVE",
    });

    const current = units.get<Unit>(battle, ref.host)?.effects.getEffect(ref.id);
    if (current?.status !== (active ? "ACTIVE" : "INACTIVE")) {
        return battle;
    }

    const callback = active ? current.definition.onEnable : current.definition.onDisable;

    return callback === undefined ? battle : callback(battle, current);
}

function reconcileGroupActivity(battle: BattleState, unitId: Id, groupId: string): BattleState {
    const refs =
        battle.battlefield.units
            .get(unitId)
            ?.effects.values()
            .filter((instance) => instance.definition.group?.id === groupId)
            .map(effectRef)
            .toArray() ?? [];

    for (const ref of refs) {
        if (get(battle, ref)?.status === "ACTIVE") {
            battle = updateStatus(battle, ref);
        }
    }
    for (const ref of refs) {
        if (get(battle, ref)?.status === "INACTIVE") {
            battle = updateStatus(battle, ref);
        }
    }

    return battle;
}
