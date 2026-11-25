import { allows } from "../../restriction.js";
import { Vec2 } from "../../common/vector.js";
import { replace } from "../../unit/operations.js";
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
    stableBlockPosition,
    type Blockable,
} from "../../unit/capability/blocking/blockable.js";
import { hasLayer } from "../../unit/capability/layer/capability.js";
import { isUnbalanced } from "../../unit/capability/shifting/shiftable.js";
import { hasOccupancy } from "../../unit/capability/occupancy/capability.js";
import { hasVitality } from "../../unit/capability/vitality/capability.js";
import { isAlive } from "../../unit/capability/vitality/query.js";
import * as units from "../../unit/query.js";
import type { Unit } from "../../unit/unit.js";
import type { State as BattleState } from "../state.js";
import type { Relation } from "../../unit/capability/blocking/contract.js";
import * as hooks from "./hook.js";
import { relations, usedCapacity } from "./query.js";
import { calculate as calculatePosition } from "./position.js";

function allowsTile(battle: BattleState, unit: Unit & Blocker): boolean {
    if (unit.blocker.layer === "AIR") {
        return true;
    }

    const position = hasOccupancy(unit) ? unit.occupancy.tile : World.toTile(unit.position);
    const tile = getTile(battle.battlefield.map, position);

    return tile?.state.allowsBlocking === true;
}

function canSearch(battle: BattleState, unit: Unit & Blocker): boolean {
    return (
        unit.lifecycle === "ACTIVE" &&
        !isUnbalanced(unit) &&
        (!hasVitality(unit) || isAlive(unit)) &&
        allowsTile(battle, unit)
    );
}

function canRetain(
    battle: BattleState,
    blocker: Unit & Blocker,
    target: Unit & Blockable,
): boolean {
    return (
        blocker.lifecycle === "ACTIVE" &&
        target.lifecycle === "ACTIVE" &&
        !isUnbalanced(blocker) &&
        !isUnbalanced(target) &&
        allowsTile(battle, blocker) &&
        hasLayer(target) &&
        blocker.blocker.layer === target.layer.type &&
        allows(battle, { blocker, blockable: target }, blocker.blocker.restrictions) &&
        allows(battle, { blocker, blockable: target }, target.blockable.restrictions)
    );
}

function canAcquire(
    battle: BattleState,
    blocker: Unit & Blocker,
    target: Unit & Blockable,
): boolean {
    if (
        !canRetain(battle, blocker, target) ||
        (hasVitality(blocker) && !isAlive(blocker)) ||
        (hasVitality(target) && !isAlive(target))
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

export function release(battle: BattleState, relations: readonly Relation[]): BattleState {
    const prepared = new Map<Ref<Unit>, Unit>();
    const released: Relation[] = [];

    for (const relation of relations) {
        const owner = (prepared.get(relation.blocker) ?? relation.blocker.get(battle)) as
            (Unit & Blocker) | undefined;
        if (!owner?.blocker.relations.includes(relation)) {
            continue;
        }

        const target = relation.blocked.get(battle)!;
        const nextOwner: Unit & Blocker = {
            ...owner,
            blocker: {
                ...owner.blocker,
                relations: owner.blocker.relations.filter((entry) => entry !== relation),
            },
        };
        const nextTarget: Unit & Blockable = {
            ...target,
            blockable: { ...target.blockable, relation: null },
        };
        prepared.set(relation.blocker, nextOwner);
        prepared.set(relation.blocked, nextTarget);
        released.push(relation);
    }

    if (released.length === 0) {
        return battle;
    }

    battle = replace(battle, [...prepared.values()]);

    for (const relation of released) {
        battle = hooks.dispatch(battle, "released", relation);
    }

    return battle;
}

export function maintain(battle: BattleState, relation: Relation): BattleState {
    const blocker = relation.blocker.get(battle);
    if (!blocker?.blocker.relations.includes(relation)) {
        return battle;
    }

    const target = relation.blocked.get(battle)!;

    return canRetain(battle, blocker, target) ? battle : release(battle, [relation]);
}

export function maintainAll(battle: BattleState): BattleState {
    for (const relation of relations(battle)) {
        battle = maintain(battle, relation);
    }

    return battle;
}

export function acquire(
    battle: BattleState,
    blockerRef: Ref<Unit & Blocker>,
    targetRef: Ref<Unit & Blockable>,
): BattleState {
    const blocker = blockerRef.get(battle);
    const target = targetRef.get(battle);
    if (
        blocker === undefined ||
        target?.blockable.relation !== null ||
        !canAcquire(battle, blocker, target)
    ) {
        return battle;
    }

    const relation: Relation = { blocker: units.ref(blocker), blocked: units.ref(target) };
    const to = calculatePosition(
        blocker.position,
        target.position,
        blocker.blocker.relations.map((entry) => stableBlockPosition(entry.blocked.get(battle)!)),
    );

    battle = replace(battle, [
        {
            ...blocker,
            blocker: { ...blocker.blocker, relations: [...blocker.blocker.relations, relation] },
        },
        {
            ...target,
            blockable: {
                ...target.blockable,
                relation,
                adjustment: { from: target.position, to, startTick: battle.tick },
            },
        },
    ]);
    battle = hooks.dispatch(battle, "acquired", relation);

    return maintain(battle, relation);
}

export function search(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    const blocker = reference.get(battle);
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
            })),
    ].sort((left, right) => left.distance - right.distance);

    for (const candidate of candidates) {
        battle = acquire(battle, reference, candidate.reference);
    }

    return battle;
}

export function advance(battle: BattleState): BattleState {
    const candidates = units.all(battle).filter(hasBlocker);
    battle = maintainAll(battle);

    for (const unit of candidates) {
        battle = search(battle, units.ref(unit));
    }

    return battle;
}
