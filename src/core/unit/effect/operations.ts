import { update as updateUnit } from "../../battle/unit.js";
import { type State as BattleState, type Result } from "../../battle/state.js";
import type { Unit, Id } from "../unit.js";
import type { Ref } from "../../common/ref.js";
import * as units from "../query.js";
import { getExecution } from "../action/query.js";
import { get as getBurst } from "../capability/elemental/query.js";
import { get as getActivation } from "../capability/skill/query.js";
import type { Definition } from "./definition.js";
import {
    deadline,
    key,
    type Effect,
    type Lifetime,
    ref as effectRef,
    type Scope,
    type View,
} from "./effect.js";
import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import { dependents } from "./dependency.js";
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

export function setData<S extends object, H extends object>(
    battle: BattleState,
    ref: Ref<Effect<S, H>>,
    data: NoInfer<S>,
): BattleState {
    const unit = units.get(battle, ref.host);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${ref.host.id}`);
    }

    const self = unit.effects.get(ref);
    if (self === undefined) {
        throw new RangeError(`unknown effect: ${ref.id}`);
    }

    return data === self.data ? battle : replaceEffect(battle, unit, { ...self, data });
}

export function setDeadline(battle: BattleState, ref: Ref<View>, tick: number | null): BattleState {
    if (tick !== null) {
        assertNonnegativeSafeInteger(tick, "effect deadline");
    }

    const unit = units.get(battle, ref.host);
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

export function setEnabled(battle: BattleState, ref: Ref<View>, enabled: boolean): BattleState {
    const unit = units.get(battle, ref.host);
    const instance = unit?.effects.getEffect(ref.id);
    if (instance === undefined || instance.status === "ENDING" || instance.enabled === enabled) {
        return battle;
    }

    battle = replaceEffect(battle, unit!, { ...instance, enabled });

    return updateStatus(battle, ref);
}

export function bindLifetime(
    battle: BattleState,
    ref: Ref<View>,
    lifetime: Lifetime,
): Result<boolean> {
    const unit = units.get(battle, ref.host);
    const instance = unit?.effects.getEffect(ref.id);
    if (instance === undefined || instance.status === "ENDING" || !available(battle, lifetime)) {
        return { state: battle, value: false };
    }

    if (wouldCycle(battle, ref, lifetime)) {
        throw new TypeError("effect scopes cannot form a cycle");
    }
    if (!instance.scopes.some((scope) => key(scope) === key(lifetime))) {
        battle = replaceEffect(battle, unit!, {
            ...instance,
            scopes: [...instance.scopes, lifetime],
        });
    }

    return { state: battle, value: true };
}

export function end(battle: BattleState, ref: Ref<View>, reason = "EXPLICIT"): BattleState {
    const unit = units.get(battle, ref.host);
    const instance = unit?.effects.getEffect(ref.id);
    if (instance === undefined || instance.status === "ENDING") {
        return battle;
    }

    const children = dependents(battle.effect.dependency, { type: "EFFECT", ref });
    const definition = instance.definition;
    const reference = effectRef(instance);
    const ending = { ...instance, status: "ENDING" as const };
    battle = replaceEffect(battle, unit!, ending);
    let ended = get(battle, reference) ?? ending;

    if (instance.status === "ACTIVE" && definition.onDisable !== undefined) {
        battle = definition.onDisable(battle, ended);
        ended = get(battle, reference) ?? ended;
    }

    for (const child of children) {
        battle = end(battle, child, reason);
        ended = get(battle, reference) ?? ended;
    }

    if (definition.onEnd !== undefined) {
        battle = definition.onEnd(battle, ended, reason);
    }

    const current = units.get(battle, ref.host);
    if (current !== undefined) {
        battle = updateUnit(battle, [
            {
                ...current,
                effects: current.effects.remove(ref.id),
            },
        ]);
    }

    if (definition.group !== undefined) {
        battle = reconcileGroupActivity(battle, ref.host.id, definition.group.id);
    }

    return battle;
}

export function endDependents(
    battle: BattleState,
    lifetime: Lifetime,
    reason = "SCOPE_CLOSED",
): BattleState {
    const roots = dependents(battle.effect.dependency, lifetime);

    if (lifetime.type === "UNIT") {
        const hosted =
            units.get(battle, lifetime.ref)?.effects.values().map(effectRef).toArray() ?? [];

        for (const ref of hosted) {
            battle = end(battle, ref, reason);
        }
    }

    for (const ref of roots) {
        battle = end(battle, ref, reason);
    }

    return battle;
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

function available(battle: BattleState, lifetime: Lifetime): boolean {
    switch (lifetime.type) {
        case "UNIT":
            return units.get(battle, lifetime.ref)?.lifecycle === "PRESENT";

        case "ACTION":
            return getExecution(battle, lifetime.ref)?.execution.status === "RUNNING";

        case "SKILL": {
            return getActivation(battle, lifetime.ref)?.status === "ACTIVE";
        }

        case "ELEMENTAL_BURST":
            return getBurst(battle, lifetime.ref)?.status === "ACTIVE";

        case "EFFECT": {
            const instance = get(battle, lifetime.ref);

            return instance !== undefined && instance.status !== "ENDING";
        }
    }
}

function replaceEffect<S extends object, H extends object>(
    battle: BattleState,
    unit: Unit,
    self: Effect<S, H>,
): BattleState {
    return updateUnit(battle, [{ ...unit, effects: unit.effects.replace(effectRef(self), self) }]);
}

function updateStatus(battle: BattleState, ref: Ref<View>): BattleState {
    const unit = units.get(battle, ref.host);
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

    const current = units.get(battle, ref.host)?.effects.getEffect(ref.id);
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

function wouldCycle(battle: BattleState, ref: Ref<View>, lifetime: Lifetime): boolean {
    if (lifetime.type !== "EFFECT") {
        return false;
    }

    const pending: Ref<View>[] = [lifetime.ref];
    const seen = new Set<string>();

    while (pending.length > 0) {
        const current = pending.pop()!;
        const identity = key({ type: "EFFECT", ref: current });
        if (identity === key({ type: "EFFECT", ref })) {
            return true;
        }
        if (seen.has(identity)) {
            continue;
        }

        seen.add(identity);
        pending.push(
            ...(get(battle, current)
                ?.scopes.filter(
                    (scope): scope is Extract<Lifetime, { type: "EFFECT" }> =>
                        scope.type === "EFFECT",
                )
                .map((scope) => scope.ref) ?? []),
        );
    }

    return false;
}
