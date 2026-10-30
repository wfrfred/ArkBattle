import { createChange } from "../../dist/core/unit/change.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import { lifetime as effectLifetime } from "../../dist/core/unit/effect/operations.js";
import { scope as lifetimeScope, getRef as lifetimeRef } from "../../dist/core/lifetime/index.js";
import { lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { replace as update } from "../../dist/core/battle/unit.js";
import * as blocking from "../../dist/core/battle/blocking/operations.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { dependents } from "../../dist/core/lifetime/dependency.js";
import * as blocker from "../../dist/core/unit/capability/blocking/blocker.js";
import { setHook as setBlockableHook } from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import * as blockerOperations from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import * as presence from "../../dist/core/unit/capability/presence/operations.js";
import { fixture, holder, target, acquire, blockedIds, ownerId, hook } from "../helpers/blocking.js";
import { getUnit, initialize } from "../helpers/unit.js";

function occupant(id, column) {
    return initialize({
        id, position: [column, 1], definition: { hooks: [], id: `batch-occupant-${id}`, occupancy: { slot: "OCCUPANT" } },
        states: { occupancy: { tile: [1, column] } },
    });
}

function preparedEffect(host, lifetime) {
    return {
        id: host.effects.nextId, host: unitRef(host),
        definition: { id: `batch-effect-${host.id}`, initialize: () => ({}) },
        data: {}, source: null, scopes: [lifetime], enabled: true, status: "ACTIVE",
    };
}

test("complete batch updates exchange occupied tiles using one final occupancy state", () => {
    const left = occupant(1, 1);
    const right = occupant(2, 2);
    const battle = fixture([left, right]);
    const updated = update(battle, [
        { ...left, occupancy: right.occupancy, position: right.position },
        { ...right, occupancy: left.occupancy, position: left.position },
    ]);

    assert.equal(at(updated.battlefield, [1, 1]).occupant.id, 2);
    assert.equal(at(updated.battlefield, [1, 2]).occupant.id, 1);
    assert.deepEqual(getUnit(updated, 1).position, [2, 1]);
    assert.deepEqual(getUnit(updated, 2).position, [1, 1]);
    assert.equal(at(battle.battlefield, [1, 1]).occupant.id, 1);
    assert.equal(at(battle.battlefield, [1, 2]).occupant.id, 2);
    assert.deepEqual(updated.events, []);
});

test("the first acquired Hook sees every batch Unit and all Effect dependencies", () => {
    const lifetime = lifetimeScope(unitLifetime, { id: 40 });
    let calls = 0;
    let battle = fixture([holder(), target(), target(40, { position: [8, 1] })]);
    const owner = getUnit(battle, 10);
    battle = applyUnitChanges(battle, [blockerOperations.setHook({ id: owner.id }, "acquired", hook("observe-final-batch", (current, { relation }) => {
            calls++;
            assert.equal(ownerId(current), 10);
            assert.deepEqual(blockedIds(current), [20]);
            assert.equal(getUnit(current, 10).blocker.blocked[0], relation.blocked);
            assert.equal(getUnit(current, 40).vitality.hp, 37);
            assert.deepEqual(dependents(current.lifetime.dependencies, lifetime).map(target => lifetimeRef(target, effectLifetime)), [
                effectRef(ownerEffect), effectRef(targetEffect),
            ]);
            return current;
        }))]);
    const currentOwner = getUnit(battle, 10);
    const currentTarget = getUnit(battle, 20);
    const ownerEffect = preparedEffect(currentOwner, lifetime);
    const targetEffect = preparedEffect(currentTarget, lifetime);
    const before = battle;
    battle = update(battle, [
        { ...currentTarget, effects: currentTarget.effects.add(targetEffect) },
        { ...currentOwner, effects: currentOwner.effects.add(ownerEffect) },
        { ...getUnit(battle, 40), vitality: { ...getUnit(battle, 40).vitality, hp: 37 } },
    ]);

    assert.equal(calls, 0, "data publication does not acquire a relation");
    battle = blocking.acquire(battle, { id: 10 }, { id: 20 });
    assert.equal(calls, 1);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.deepEqual(dependents(before.lifetime.dependencies, lifetime).map(target => lifetimeRef(target, effectLifetime)), []);
    assert.deepEqual(blockedIds(before), []);
    assert.equal(getUnit(before, 40).vitality.hp, 100);
});

test("explicit acquisitions use committed capacity and retain other submitted owner state", () => {
    const initial = fixture([holder(), target(20), target(21)]);
    const expanded = applyUnitChanges(initial, [blockerOperations.setCapacityContribution({ id: 10 }, {
        id: "batch-expansion", value: [{ type: "ADD", value: 1 }],
    })]);
    const owner = getUnit(expanded, 10);
    let battle = update(expanded, [{ ...owner, vitality: { ...owner.vitality, hp: 51 } }]);
    battle = blocking.acquire(battle, { id: 10 }, { id: 20 });
    battle = blocking.acquire(battle, { id: 10 }, { id: 21 });

    assert.deepEqual(blockedIds(battle), [20, 21]);
    assert.equal(getUnit(battle, 10).vitality.hp, 51);
    assert.equal(blocker.resolveCapacity(owner.definition.blocker, getUnit(battle, 10).blocker), 2);
    assert.deepEqual(battle.events.map(event => [event.type, event.blockedUnitId]), [
        ["BLOCKING_ACQUIRED", 20], ["BLOCKING_ACQUIRED", 21],
    ]);
    assert.deepEqual(blockedIds(initial), []);
});


test("acquire updates both endpoints after an unrelated owner data commit", () => {
    const initial = fixture([holder(), target()]);
    const owner = getUnit(initial, 10);
    const committed = update(initial, [{ ...owner, vitality: { ...owner.vitality, hp: 44 } }]);
    const battle = blocking.acquire(committed, { id: 10 }, { id: 20 });

    assert.equal(getUnit(battle, 10).vitality.hp, 44);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(ownerId(battle), 10);
    assert.equal(battle.events.filter(event => event.type === "BLOCKING_ACQUIRED").length, 1);
});


test("acquisition Hooks can update a later search candidate before its own attempt", () => {
    const calls = [];
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21)]);
    const owner = getUnit(battle, 10);
    battle = applyUnitChanges(battle, [blockerOperations.setHook({ id: owner.id }, "acquired", hook("change-later-target", (current, { relation }) => {
            calls.push(relation.blocked.id);
            if (relation.blocked.id !== 20) return current;
            current = blocking.release(current, { id: 21 });
            const released = getUnit(current, 21);
            return update(current, [{
                ...released, position: [7, 1], vitality: { ...released.vitality, hp: 17 },
            }]);
        }))]);
    const before = battle;
    battle = blocking.search(battle, { id: 10 });

    assert.deepEqual(calls, [20]);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(ownerId(battle, 21), undefined);
    assert.equal(getUnit(battle, 21).vitality.hp, 17);
    assert.deepEqual(getUnit(battle, 21).position, [7, 1]);
    assert.equal(battle.events.some(event => event.type === "BLOCKING_ACQUIRED" && event.blockedUnitId === 21), false);
    assert.deepEqual(blockedIds(before), []);
    assert.equal(getUnit(before, 21).vitality.hp, 100);
});

test("a complete capacity reduction releases the required relations without relying on Hooks", () => {
    let battle = acquire(fixture([holder(10, { capacity: 2 }), target(20), target(21)]));
    const before = battle;
    battle = applyUnitChanges(battle, [blockerOperations.setCapacityContribution({ id: 10 }, {
        id: "capacity-zero", value: [{ type: "ADD", value: -2 }],
    })]);

    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(battle, 20), undefined);
    assert.equal(ownerId(battle, 21), undefined);
    assert.deepEqual(battle.events.filter(event => event.type === "BLOCKING_RELEASED").map(event => event.blockedUnitId), [21, 20]);
    assert.deepEqual(blockedIds(before), [20, 21]);
});

test("ordinary Unit updates neither reconcile Blocking fields nor dispatch relationship events", () => {
    const initial = fixture([holder(), target()]);
    const owner = getUnit(initial, 10);
    const candidate = getUnit(initial, 20);
    const reference = unitRef(candidate);
    const oneSide = update(initial, [{
        ...candidate, blockable: { ...candidate.blockable, blocker: unitRef(owner) },
    }]);
    assert.equal(ownerId(oneSide), 10);
    assert.deepEqual(blockedIds(oneSide), [], "Unit storage does not manufacture the reverse endpoint");
    assert.deepEqual(oneSide.events, []);
    const bothSides = update(oneSide, [{
        ...owner, blocker: { ...owner.blocker, blocked: [reference] },
    }]);
    assert.deepEqual(blockedIds(bothSides), [20]);
    assert.deepEqual(bothSides.events, []);
    const cleared = update(bothSides, [
        { ...getUnit(bothSides, 10), blocker: { ...getUnit(bothSides, 10).blocker, blocked: [] } },
        { ...getUnit(bothSides, 20), blockable: { ...getUnit(bothSides, 20).blockable, blocker: null } },
    ]);
    assert.deepEqual(blockedIds(cleared), []);
    assert.deepEqual(cleared.events, [], "raw data publication also does not announce a release");
    assert.deepEqual(blockedIds(initial), []);
});


test("empty and unchanged Changes preserve state while repeated targets compose in order", () => {
    const first = target(20);
    const battle = fixture([first]);
    const reference = unitRef(first);
    assert.equal(applyUnitChanges(battle, []), battle);
    assert.equal(applyUnitChanges(battle, [createChange(reference, self => self)]), battle);
    const changed = applyUnitChanges(battle, [
        createChange(reference, self => ({ ...self, vitality: { ...self.vitality, hp: self.vitality.hp / 2 } })),
        createChange(reference, self => ({ ...self, vitality: { ...self.vitality, hp: self.vitality.hp / 2 } })),
    ]);
    assert.equal(getUnit(changed, 20).vitality.hp, 25);
    assert.equal(getUnit(battle, 20), first);
    assert.equal(getUnit(battle, 99), undefined);
    assert.equal(getUnit(battle, 20).vitality.hp, 100);
});

test("a missing batch target rejects before any Blocking notification", () => {
    let calls = 0;
    let battle = acquire(fixture([holder(), target()]));
    const owner = getUnit(battle, 10);
    battle = applyUnitChanges(battle, [blockerOperations.setHook({ id: owner.id }, "released", hook("must-not-release", current => {
            calls++;
            return current;
        }))]);
    const changed = blockerOperations.setCapacityContribution(unitRef(owner), {
        id: "pending-reduction", value: [{ type: "ZERO" }],
    });
    const missing = createChange({ id: 99 }, self => self);
    const field = battle.battlefield;
    const dependency = battle.lifetime.dependencies;
    const events = battle.events;

    for (const changes of [[changed, missing], [missing, changed]]) {
        assert.throws(() => applyUnitChanges(battle, changes), /unknown unit: 99/);
    }
    assert.equal(calls, 0);
    assert.equal(battle.battlefield, field);
    assert.equal(battle.lifetime.dependencies, dependency);
    assert.equal(battle.events, events);
    assert.deepEqual(blockedIds(battle), [20]);
});

test("spatial updates clear the captured batch before Hooks and preserve newly acquired relations", () => {
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21)]);
    const owner = getUnit(battle, 10);
    const released = [];
    let captured;
    battle = applyUnitChanges(battle, [blockerOperations.setHook({ id: owner.id }, "released", hook("reacquire-after-spatial-update", (current, { relation }) => {
            released.push(relation.blocked);
            if (relation.blocked === captured[0].blocked) {
                assert.deepEqual(blockedIds(current), []);
                assert.equal(ownerId(current, 20), undefined);
                assert.equal(ownerId(current, 21), undefined);
                assert.deepEqual(getUnit(current, 10).position, [2.1, 1]);
                return acquire(current);
            }
            assert.deepEqual(blockedIds(current), [20, 21]);
            return current;
        }))]);
    battle = acquire(battle);
    captured = blocking.capture(battle, unitRef(getUnit(battle, 10)));
    const before = battle;
    battle = presence.appear(battle, unitRef(getUnit(battle, 10)), [2.1, 1]);

    assert.deepEqual(released, captured.map(relation => relation.blocked));
    assert.deepEqual(blockedIds(battle), [20, 21]);
    for (let index = 0; index < captured.length; index++) {
        assert.notEqual(getUnit(battle, 10).blocker.blocked[index], captured[index].blocked);
    }
    assert.deepEqual(getUnit(before, 10).position, [2, 1]);
    assert.equal(blocking.releaseCaptured(battle, captured), battle);
});

test("disappearing a dual-capability Unit publishes both releases before notifying incoming then outgoing", () => {
    const middle = holder(10, { definition: {
        layer: { type: "GROUND" }, blockable: { volume: 1 },
    } });
    const outer = holder(30, { definition: {
        blocker: {
            capacity: 1, layer: "GROUND", radius: 1,
            rules: [{ id: "middle-only", allows: (_battle, _owner, candidate) => candidate.id === 10 }],
        },
    } });
    let battle = fixture([middle, target(20), outer]);
    const observed = [];
    const record = label => (state, { relation }) => {
        observed.push([relation.blocker.id, relation.blocked.id, label]);
        assert.equal(getUnit(state, 10).spatialPresence.present, false);
        assert.equal(getUnit(state, 10).lifecycle, "PRESENT");
        assert.deepEqual(blockedIds(state, 10), []);
        assert.deepEqual(blockedIds(state, 30), []);
        assert.equal(ownerId(state, 10), undefined);
        assert.equal(ownerId(state, 20), undefined);
        return state;
    };
    const owner = getUnit(battle, 10);
    const candidate = getUnit(battle, 20);
    const blockerUnit = getUnit(battle, 30);
    battle = applyUnitChanges(battle, [blockerOperations.setHook({ id: owner.id }, "released", hook("outgoing-owner", record("blocker"))), setBlockableHook({ id: owner.id }, "released", hook("incoming-target", record("blockable"))), setBlockableHook({ id: candidate.id }, "released", hook("outgoing-target", record("blockable"))), blockerOperations.setHook({ id: blockerUnit.id }, "released", hook("incoming-owner", record("blocker")))]);
    battle = blocking.acquire(battle, { id: 10 }, { id: 20 });
    battle = blocking.acquire(battle, { id: 30 }, { id: 10 });
    assert.deepEqual(blocking.capture(battle, { id: 10 }).map(relation => [relation.blocker.id, relation.blocked.id]), [
        [10, 20], [30, 10],
    ], "registration order places the outgoing relationship first in capture");

    battle = presence.disappear(battle, { id: 10 });

    assert.deepEqual(observed, [
        [30, 10, "blocker"], [30, 10, "blockable"],
        [10, 20, "blocker"], [10, 20, "blockable"],
    ]);
    assert.deepEqual(battle.events.filter(event => event.type === "BLOCKING_RELEASED").map(event => [event.blockerUnitId, event.blockedUnitId]), [
        [30, 10], [10, 20],
    ]);
});
