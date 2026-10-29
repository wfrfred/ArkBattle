import { Vec2 } from "../../common/vector.js";
import { update } from "../unit.js";
import type { Ref } from "../../common/ref.js";
import { World } from "../../geometry/coordinate.js";
import { get as getTile } from "../../battlefield/map/map.js";
import { areHostile, hasAllegiance } from "../../unit/capability/allegiance/capability.js";
import {
    hasBlocker,
    resolveCapacity,
    type Blocker,
} from "../../unit/capability/blocking/blocker.js";
import {
    hasBlockable,
    resolveVolume,
    type Blockable,
} from "../../unit/capability/blocking/blockable.js";
import { hasLayer } from "../../unit/capability/layer/capability.js";
import { isSpatiallyPresent } from "../../unit/capability/presence/capability.js";
import { hasOccupancy } from "../../unit/capability/occupancy/capability.js";
import { hasVitality } from "../../unit/capability/vitality/capability.js";
import * as units from "../../unit/query.js";
import type { Id, Unit } from "../../unit/unit.js";
import { appendEvents, type State as BattleState } from "../state.js";
import type { Change, Relation } from "./contract.js";
import * as hooks from "./hook.js";
import { hasRelation, relations, usedCapacity } from "./query.js";

function isActive(unit: Unit): boolean {
    return (
        unit.lifecycle === "PRESENT" &&
        isSpatiallyPresent(unit) &&
        (!hasVitality(unit) || unit.vitality.hp > 0)
    );
}

function canSearch(battle: BattleState, unit: Unit & Blocker): boolean {
    if (!isActive(unit) || !hasAllegiance(unit)) {
        return false;
    }

    const position =
        hasOccupancy(unit) && unit.occupancy.tile !== null
            ? unit.occupancy.tile
            : World.toTile(unit.position);
    const tile = getTile(battle.battlefield.map, position);

    return tile?.state.allowsBlocking === true;
}

function canRetain(
    battle: BattleState,
    blocker: Unit & Blocker,
    target: Unit & Blockable,
): boolean {
    return (
        canSearch(battle, blocker) &&
        hasAllegiance(blocker) &&
        isActive(target) &&
        (!hasLayer(target) || target.layer.type === "GROUND") &&
        hasAllegiance(target) &&
        areHostile(blocker, target) &&
        blocker.blocker.rules.every((rule) => rule.allows(battle, blocker, target)) &&
        target.blockable.rules.every((rule) => rule.allows(battle, blocker, target))
    );
}

function canAcquire(
    battle: BattleState,
    blocker: Unit & Blocker,
    target: Unit & Blockable,
): boolean {
    if (!canRetain(battle, blocker, target)) {
        return false;
    }

    const distance = Vec2.distanceSquared(blocker.position, target.position);
    const radius = blocker.blocker.geometry.radius;
    const capacity = resolveCapacity(blocker.definition.blocker, blocker.blocker);
    const volume = resolveVolume(target.definition.blockable, target.blockable);

    return (
        distance <= radius * radius && usedCapacity(battle, units.ref(blocker)) + volume <= capacity
    );
}

export function prepareUpdates(battle: BattleState, updates: readonly Unit[]): readonly Unit[] {
    const prepared = new Map(updates.map((unit) => [unit.id, unit]));
    const current = (id: Id) => prepared.get(id) ?? battle.battlefield.units.get(id);

    for (const unit of updates) {
        const previous = battle.battlefield.units.get(unit.id);
        if (!hasBlocker(unit) || previous === undefined || !hasBlocker(previous)) {
            continue;
        }

        const references = new Map(previous.blocker.blocked.map((entry) => [entry.id, entry]));
        const blocked = unit.blocker.blocked.map((entry) => references.get(entry.id) ?? entry);
        if (blocked.some((entry, index) => entry !== unit.blocker.blocked[index])) {
            const updated: Unit & Blocker = { ...unit, blocker: { ...unit.blocker, blocked } };
            prepared.set(unit.id, updated);
        }
    }

    for (const unit of updates) {
        const previousUnit = battle.battlefield.units.get(unit.id);
        const nextUnit = current(unit.id)!;
        const previous =
            previousUnit !== undefined && hasBlockable(previousUnit)
                ? previousUnit.blockable.blocker
                : null;
        const next = hasBlockable(nextUnit) ? nextUnit.blockable.blocker : null;
        if (previous?.id === next?.id) {
            continue;
        }
        if (previous !== null && next !== null) {
            throw new RangeError("blocking ownership must be released before reassignment");
        }

        if (previous !== null) {
            const owner = current(previous.id);
            if (owner !== undefined && hasBlocker(owner)) {
                const blocked = owner.blocker.blocked.filter((entry) => entry.id !== unit.id);
                if (blocked.length !== owner.blocker.blocked.length) {
                    const updated: Unit & Blocker = {
                        ...owner,
                        blocker: { ...owner.blocker, blocked },
                    };
                    prepared.set(owner.id, updated);
                }
            }
        }

        if (next !== null && hasBlockable(nextUnit)) {
            const owner = current(next.id);
            if (owner === undefined || !hasBlocker(owner)) {
                throw new RangeError(`unknown blocker: ${next.id}`);
            }

            if (!owner.blocker.blocked.some((entry) => entry.id === nextUnit.id)) {
                const blocked = [...owner.blocker.blocked, units.ref(nextUnit)];
                const updated: Unit & Blocker = {
                    ...owner,
                    blocker: { ...owner.blocker, blocked },
                };
                prepared.set(owner.id, updated);
            }
        }
    }

    for (const unit of prepared.values()) {
        if (hasBlocker(unit)) {
            const ids = new Set<Id>();

            for (const entry of unit.blocker.blocked) {
                const target = current(entry.id);
                if (
                    ids.has(entry.id) ||
                    target === undefined ||
                    !hasBlockable(target) ||
                    target.blockable.blocker?.id !== unit.id
                ) {
                    throw new RangeError("blocking relationship endpoints must agree");
                }

                ids.add(entry.id);
            }

            const previous = battle.battlefield.units.get(unit.id);
            if (previous !== undefined && hasBlocker(previous)) {
                for (const entry of previous.blocker.blocked) {
                    const target = current(entry.id);
                    if (
                        target !== undefined &&
                        hasBlockable(target) &&
                        target.blockable.blocker?.id === unit.id &&
                        !ids.has(entry.id)
                    ) {
                        throw new RangeError("blocking relationship endpoints must agree");
                    }
                }
            }
        }

        if (hasBlockable(unit) && unit.blockable.blocker !== null) {
            const owner = current(unit.blockable.blocker.id);
            if (
                owner === undefined ||
                !hasBlocker(owner) ||
                !owner.blocker.blocked.some((entry) => entry.id === unit.id)
            ) {
                throw new RangeError("blocking relationship endpoints must agree");
            }
        }
    }

    return [...prepared.values()];
}

export function changes(
    previous: BattleState,
    next: BattleState,
    updates: readonly Unit[],
): readonly Change[] {
    const changed: Change[] = [];

    for (const unit of updates) {
        const previousUnit = previous.battlefield.units.get(unit.id);
        const nextUnit = next.battlefield.units.get(unit.id);
        const before =
            previousUnit !== undefined && hasBlockable(previousUnit)
                ? previousUnit.blockable.blocker
                : null;
        const after =
            nextUnit !== undefined && hasBlockable(nextUnit) ? nextUnit.blockable.blocker : null;
        if (before?.id === after?.id) {
            continue;
        }

        if (before !== null) {
            const owner = units.get(previous, before);
            const target = owner?.blocker.blocked.find((entry) => entry.id === unit.id);
            if (target !== undefined) {
                changed.push({ type: "RELEASED", relation: { blocker: before, blocked: target } });
            }
        }

        if (after !== null && nextUnit !== undefined && hasBlockable(nextUnit)) {
            const owner = units.get(next, after);
            if (
                owner === undefined ||
                !canRetain(next, owner, nextUnit) ||
                Vec2.distanceSquared(owner.position, nextUnit.position) >
                    owner.blocker.geometry.radius * owner.blocker.geometry.radius ||
                usedCapacity(next, after) > resolveCapacity(owner.definition.blocker, owner.blocker)
            ) {
                throw new RangeError("blocking ownership requires acquisition eligibility");
            }

            const target = owner.blocker.blocked.find((entry) => entry.id === unit.id)!;
            changed.push({ type: "ACQUIRED", relation: { blocker: after, blocked: target } });
        }
    }

    return changed;
}

export function settleUpdates(battle: BattleState, changes: readonly Change[]): BattleState {
    const pending = pendingMaintenance(battle);

    for (const change of changes) {
        battle = notify(battle, change);
    }

    return pending !== undefined && requiresMaintenance(battle, pending)
        ? releaseRelation(battle, pending)
        : battle;
}

export function notify(battle: BattleState, change: Change): BattleState {
    const { relation } = change;
    if (change.type === "ACQUIRED" && !hasRelation(battle, relation)) {
        return battle;
    }

    battle = appendEvents(battle, [
        {
            type: change.type === "ACQUIRED" ? "BLOCKING_ACQUIRED" : "BLOCKING_RELEASED",
            blockerUnitId: relation.blocker.id,
            blockedUnitId: relation.blocked.id,
            tick: battle.tick,
        },
    ]);

    return hooks.dispatch(battle, change.type === "ACQUIRED" ? "acquired" : "released", relation);
}

export function capture(battle: BattleState, reference: Ref<Unit>): readonly Relation[] {
    return relations(battle).filter(
        (relation) => relation.blocker.id === reference.id || relation.blocked.id === reference.id,
    );
}

export function releaseUpdates(
    battle: BattleState,
    captured: readonly Relation[],
    updates: readonly Unit[] = [],
): readonly Unit[] {
    const prepared = new Map(updates.map((unit) => [unit.id, unit]));
    const current = (id: Id) => prepared.get(id) ?? battle.battlefield.units.get(id);

    for (const relation of captured) {
        if (!hasRelation(battle, relation)) {
            continue;
        }

        const owner = current(relation.blocker.id)!;
        const target = current(relation.blocked.id)!;

        if (hasBlocker(owner)) {
            const blocked = owner.blocker.blocked.filter((entry) => entry.id !== target.id);
            const updated: Unit & Blocker = { ...owner, blocker: { ...owner.blocker, blocked } };
            prepared.set(owner.id, updated);
        }

        const latest = current(target.id)!;
        if (hasBlockable(latest) && latest.blockable.blocker?.id === owner.id) {
            const updated: Unit & Blockable = {
                ...latest,
                blockable: { ...latest.blockable, blocker: null },
            };
            prepared.set(latest.id, updated);
        }
    }

    return [...prepared.values()];
}

function releaseRelation(battle: BattleState, relation: Relation): BattleState {
    return hasRelation(battle, relation)
        ? update(battle, releaseUpdates(battle, [relation]))
        : battle;
}

export function releaseCaptured(battle: BattleState, captured: readonly Relation[]): BattleState {
    for (const relation of captured) {
        battle = releaseRelation(battle, relation);
    }

    return battle;
}

export function release(battle: BattleState, reference: Ref<Unit>): BattleState {
    return releaseCaptured(battle, capture(battle, reference));
}

function pendingMaintenance(battle: BattleState): Relation | undefined {
    const invalid = relations(battle).find((relation) => {
        const blocker = units.get(battle, relation.blocker);
        const target = units.get(battle, relation.blocked);

        return blocker !== undefined && target !== undefined && !canRetain(battle, blocker, target);
    });
    if (invalid !== undefined) {
        return invalid;
    }

    const overflowing = units
        .all(battle)
        .filter(hasBlocker)
        .find(
            (unit) =>
                usedCapacity(battle, units.ref(unit)) >
                resolveCapacity(unit.definition.blocker, unit.blocker),
        );

    return overflowing === undefined
        ? undefined
        : { blocker: units.ref(overflowing), blocked: overflowing.blocker.blocked.at(-1)! };
}

function requiresMaintenance(battle: BattleState, relation: Relation): boolean {
    if (!hasRelation(battle, relation)) {
        return false;
    }

    const owner = units.get(battle, relation.blocker)!;
    const target = units.get(battle, relation.blocked)!;

    return (
        !canRetain(battle, owner, target) ||
        (owner.blocker.blocked.at(-1) === relation.blocked &&
            usedCapacity(battle, relation.blocker) >
                resolveCapacity(owner.definition.blocker, owner.blocker))
    );
}

export function maintain(battle: BattleState): BattleState {
    const pending = pendingMaintenance(battle);

    return pending === undefined ? battle : releaseRelation(battle, pending);
}

function tryAcquire(
    battle: BattleState,
    blockerRef: Ref<Unit & Blocker>,
    targetRef: Ref<Unit & Blockable>,
): BattleState {
    const blocker = units.get(battle, blockerRef);
    const target = units.get(battle, targetRef);
    if (
        blocker === undefined ||
        target?.blockable.blocker !== null ||
        !canAcquire(battle, blocker, target)
    ) {
        return battle;
    }

    const reference = units.ref(target);

    return update(battle, [
        {
            ...blocker,
            blocker: { ...blocker.blocker, blocked: [...blocker.blocker.blocked, reference] },
        },
        { ...target, blockable: { ...target.blockable, blocker: units.ref(blocker) } },
    ]);
}

export function search(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    const blocker = units.get(battle, reference);
    if (blocker === undefined || !canSearch(battle, blocker)) {
        return battle;
    }

    const radius = blocker.blocker.geometry.radius;
    const candidates = [
        ...units
            .all(battle)
            .filter(hasBlockable)
            .filter(
                (target) =>
                    canRetain(battle, blocker, target) &&
                    Vec2.distanceSquared(blocker.position, target.position) <= radius * radius,
            )
            .map((target) => ({
                reference: units.ref(target),
                distance: Vec2.distanceSquared(blocker.position, target.position),
            }))
            .toArray(),
    ].sort(
        (left, right) => left.distance - right.distance || left.reference.id - right.reference.id,
    );

    for (const candidate of candidates) {
        battle = tryAcquire(battle, reference, candidate.reference);
    }

    return battle;
}

export function advance(battle: BattleState): BattleState {
    const candidates = units.all(battle).filter(hasBlocker).map(units.ref).toArray();

    for (const reference of candidates) {
        battle = search(battle, reference);
    }

    return battle;
}
