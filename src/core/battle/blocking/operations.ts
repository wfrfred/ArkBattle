import { Vec2 } from "../../common/vector.js";
import { update } from "../unit.js";
import type { Ref } from "../../common/ref.js";
import { World } from "../../geometry/coordinate.js";
import { get as getTile } from "../../battlefield/map/map.js";
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
import type { Relation } from "../../unit/capability/blocking/contract.js";
import * as hooks from "./hook.js";
import { hasRelation, relations, usedCapacity } from "./query.js";

function isPresent(unit: Unit): boolean {
    return unit.lifecycle === "PRESENT" && isSpatiallyPresent(unit);
}

function allowsTile(battle: BattleState, unit: Unit & Blocker): boolean {
    if (unit.blocker.layer === "AIR") {
        return true;
    }

    const position =
        hasOccupancy(unit) && unit.occupancy.tile !== null
            ? unit.occupancy.tile
            : World.toTile(unit.position);
    const tile = getTile(battle.battlefield.map, position);

    return tile?.state.allowsBlocking === true;
}

function canSearch(battle: BattleState, unit: Unit & Blocker): boolean {
    return (
        isPresent(unit) && (!hasVitality(unit) || unit.vitality.hp > 0) && allowsTile(battle, unit)
    );
}

function canRetain(
    battle: BattleState,
    blocker: Unit & Blocker,
    target: Unit & Blockable,
): boolean {
    return (
        blocker.id !== target.id &&
        isPresent(blocker) &&
        isPresent(target) &&
        allowsTile(battle, blocker) &&
        hasLayer(target) &&
        blocker.blocker.layer === target.layer.type &&
        blocker.blocker.rules.every((rule) => rule.allows(battle, blocker, target)) &&
        target.blockable.rules.every((rule) => rule.allows(battle, blocker, target))
    );
}

function canAcquire(
    battle: BattleState,
    blocker: Unit & Blocker,
    target: Unit & Blockable,
): boolean {
    if (
        !canRetain(battle, blocker, target) ||
        (hasVitality(blocker) && blocker.vitality.hp <= 0) ||
        (hasVitality(target) && target.vitality.hp <= 0)
    ) {
        return false;
    }

    const distance = Vec2.distanceSquared(blocker.position, target.position);
    const radius = blocker.blocker.radius;
    const capacity = resolveCapacity(blocker.definition.blocker, blocker.blocker);
    const volume = resolveVolume(target.definition.blockable, target.blockable);

    return (
        distance <= radius * radius && usedCapacity(battle, units.ref(blocker)) + volume <= capacity
    );
}

function notify(
    battle: BattleState,
    type: "ACQUIRED" | "RELEASED",
    relation: Relation,
): BattleState {
    if (type === "ACQUIRED" && !hasRelation(battle, relation)) {
        return battle;
    }

    battle = appendEvents(battle, [
        {
            type: type === "ACQUIRED" ? "BLOCKING_ACQUIRED" : "BLOCKING_RELEASED",
            blockerUnitId: relation.blocker.id,
            blockedUnitId: relation.blocked.id,
            tick: battle.tick,
        },
    ]);

    return hooks.dispatch(battle, type === "ACQUIRED" ? "acquired" : "released", relation);
}

export function capture(battle: BattleState, reference: Ref<Unit>): readonly Relation[] {
    return relations(battle).filter(
        (relation) => relation.blocker.id === reference.id || relation.blocked.id === reference.id,
    );
}

function releaseUpdates(
    battle: BattleState,
    captured: readonly Relation[],
    updates: readonly Unit[] = [],
): readonly Unit[] {
    const prepared = new Map(updates.map((unit) => [unit.id, unit]));
    const current = (id: Id) => prepared.get(id) ?? battle.battlefield.units.get(id);

    for (const relation of captured) {
        const owner = current(relation.blocker.id) as Unit & Blocker;
        const blocked = owner.blocker.blocked.filter((entry) => entry.id !== relation.blocked.id);
        const updated: Unit & Blocker = { ...owner, blocker: { ...owner.blocker, blocked } };
        prepared.set(owner.id, updated);

        const latest = current(relation.blocked.id) as Unit & Blockable;
        const cleared: Unit & Blockable = {
            ...latest,
            blockable: { ...latest.blockable, blocker: null },
        };
        prepared.set(latest.id, cleared);
    }

    return [...prepared.values()];
}

function releaseRelation(battle: BattleState, relation: Relation): BattleState {
    if (!hasRelation(battle, relation)) {
        return battle;
    }

    battle = update(battle, releaseUpdates(battle, [relation]));

    return notify(battle, "RELEASED", relation);
}

export function releaseAll(
    battle: BattleState,
    captured: readonly Relation[],
    updates: readonly Unit[] = [],
): BattleState {
    const released = captured.filter((relation) => hasRelation(battle, relation));
    const next = update(battle, releaseUpdates(battle, released, updates));
    if (next === battle) {
        return battle;
    }

    battle = next;

    for (const relation of released) {
        battle = notify(battle, "RELEASED", relation);
    }

    return maintain(battle);
}

export function releaseCaptured(battle: BattleState, captured: readonly Relation[]): BattleState {
    for (const relation of captured) {
        const next = releaseRelation(battle, relation);
        battle = next === battle ? battle : maintain(next);
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

export function maintain(battle: BattleState): BattleState {
    while (true) {
        const pending = pendingMaintenance(battle);
        if (pending === undefined) {
            return battle;
        }

        battle = releaseRelation(battle, pending);
    }
}

export function acquire(
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

    battle = update(battle, [
        {
            ...blocker,
            blocker: { ...blocker.blocker, blocked: [...blocker.blocker.blocked, reference] },
        },
        { ...target, blockable: { ...target.blockable, blocker: units.ref(blocker) } },
    ]);
    battle = notify(battle, "ACQUIRED", { blocker: blockerRef, blocked: reference });

    return maintain(battle);
}

export function search(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    const blocker = units.get(battle, reference);
    if (blocker === undefined || !canSearch(battle, blocker)) {
        return battle;
    }

    const radius = blocker.blocker.radius;
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
        battle = acquire(battle, reference, candidate.reference);
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
