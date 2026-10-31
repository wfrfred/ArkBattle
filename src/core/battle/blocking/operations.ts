import { Vec2 } from "../../common/vector.js";
import { replace } from "../unit.js";
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
import { isSpatiallyPresent } from "../../unit/capability/presence/capability.js";
import { hasOccupancy } from "../../unit/capability/occupancy/capability.js";
import { hasVitality } from "../../unit/capability/vitality/capability.js";
import * as units from "../../unit/query.js";
import type { Id, Unit } from "../../unit/unit.js";
import { appendEvents, type State as BattleState } from "../state.js";
import type { Relation } from "../../unit/capability/blocking/contract.js";
import * as hooks from "./hook.js";
import { relations, usedCapacity } from "./query.js";
import { calculate as calculatePosition } from "./position.js";

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

export function release(battle: BattleState, relations: readonly Relation[]): BattleState {
    const prepared = new Map<Id, Unit>();
    const released: Relation[] = [];

    for (const relation of relations) {
        const owner = (prepared.get(relation.blocker.id) ?? units.get(battle, relation.blocker)) as
            (Unit & Blocker) | undefined;
        if (!owner?.blocker.blocked.includes(relation.blocked)) {
            continue;
        }

        const target = units.get(battle, relation.blocked)!;
        const nextOwner: Unit & Blocker = {
            ...owner,
            blocker: {
                ...owner.blocker,
                blocked: owner.blocker.blocked.filter((entry) => entry !== relation.blocked),
            },
        };
        const nextTarget: Unit & Blockable = {
            ...target,
            blockable: { ...target.blockable, blocker: null },
        };
        prepared.set(owner.id, nextOwner);
        prepared.set(target.id, nextTarget);
        released.push(relation);
    }

    if (released.length === 0) {
        return battle;
    }

    battle = replace(battle, [...prepared.values()]);
    battle = appendEvents(
        battle,
        released.map((relation) => ({
            type: "BLOCKING_RELEASED",
            blockerUnitId: relation.blocker.id,
            blockedUnitId: relation.blocked.id,
            tick: battle.tick,
        })),
    );

    for (const relation of released) {
        battle = hooks.dispatch(battle, "released", relation);
    }

    return battle;
}

export function maintain(battle: BattleState, relation: Relation): BattleState {
    const blocker = units.get(battle, relation.blocker);
    if (!blocker?.blocker.blocked.includes(relation.blocked)) {
        return battle;
    }

    const target = units.get(battle, relation.blocked)!;

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
    const to = calculatePosition(
        blocker.position,
        target.position,
        blocker.blocker.blocked.map((blocked) => stableBlockPosition(units.get(battle, blocked)!)),
    );

    battle = replace(battle, [
        {
            ...blocker,
            blocker: { ...blocker.blocker, blocked: [...blocker.blocker.blocked, reference] },
        },
        {
            ...target,
            blockable: {
                ...target.blockable,
                blocker: units.ref(blocker),
                adjustment: { from: target.position, to, startTick: battle.tick },
            },
        },
    ]);
    battle = appendEvents(battle, [
        {
            type: "BLOCKING_ACQUIRED",
            blockerUnitId: blockerRef.id,
            blockedUnitId: reference.id,
            tick: battle.tick,
        },
    ]);
    const relation = { blocker: blockerRef, blocked: reference };
    battle = hooks.dispatch(battle, "acquired", relation);

    return maintain(battle, relation);
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
