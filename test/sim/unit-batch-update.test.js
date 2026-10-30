import { lifetime as effectLifetime } from "../../dist/core/unit/effect/operations.js";
import { scope as lifetimeScope, getRef as lifetimeRef } from "../../dist/core/lifetime/index.js";
import { lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { update } from "../../dist/core/battle/unit.js";
import * as blocking from "../../dist/core/battle/blocking/operations.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { dependents } from "../../dist/core/lifetime/dependency.js";
import * as blocker from "../../dist/core/unit/capability/blocking/blocker.js";
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
    battle = update(battle, [{
        ...owner,
        blocker: blocker.setHook(owner.blocker, "acquired", hook("observe-final-batch", (current, { relation }) => {
            calls++;
            assert.equal(ownerId(current), 10);
            assert.deepEqual(blockedIds(current), [20]);
            assert.equal(getUnit(current, 10).blocker.blocked[0], relation.blocked);
            assert.equal(getUnit(current, 40).vitality.hp, 37);
            assert.deepEqual(dependents(current.lifetime.dependencies, lifetime).map(target => lifetimeRef(target, effectLifetime)), [
                effectRef(ownerEffect), effectRef(targetEffect),
            ]);
            return current;
        })),
    }]);
    const currentOwner = getUnit(battle, 10);
    const currentTarget = getUnit(battle, 20);
    const ownerEffect = preparedEffect(currentOwner, lifetime);
    const targetEffect = preparedEffect(currentTarget, lifetime);
    const targetReference = unitRef(currentTarget);
    const before = battle;
    battle = update(battle, [
        { ...currentTarget, effects: currentTarget.effects.add(targetEffect),
            blockable: { ...currentTarget.blockable, blocker: unitRef(currentOwner) } },
        { ...currentOwner, effects: currentOwner.effects.add(ownerEffect),
            blocker: { ...currentOwner.blocker, blocked: [targetReference] } },
        { ...getUnit(battle, 40), vitality: { ...getUnit(battle, 40).vitality, hp: 37 } },
    ]);

    assert.equal(calls, 1);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.deepEqual(dependents(before.lifetime.dependencies, lifetime).map(target => lifetimeRef(target, effectLifetime)), []);
    assert.deepEqual(blockedIds(before), []);
    assert.equal(getUnit(before, 40).vitality.hp, 100);
});

test("batch acquisitions share final capacity and retain other submitted owner state", () => {
    const initial = fixture([holder(), target(20), target(21)]);
    const owner = getUnit(initial, 10);
    const first = getUnit(initial, 20);
    const second = getUnit(initial, 21);
    const expanded = blocker.setCapacityContribution(owner.blocker, {
        id: "batch-expansion", value: [{ type: "ADD", value: 1 }],
    });
    const battle = update(initial, [
        { ...owner, vitality: { ...owner.vitality, hp: 51 },
            blocker: { ...expanded, blocked: [unitRef(first), unitRef(second)] } },
        { ...first, blockable: { ...first.blockable, blocker: unitRef(owner) } },
        { ...second, blockable: { ...second.blockable, blocker: unitRef(owner) } },
    ]);

    assert.deepEqual(blockedIds(battle), [20, 21]);
    assert.equal(getUnit(battle, 10).vitality.hp, 51);
    assert.equal(blocker.resolveCapacity(owner.definition.blocker, getUnit(battle, 10).blocker), 2);
    assert.deepEqual(battle.events.map(event => [event.type, event.blockedUnitId]), [
        ["BLOCKING_ACQUIRED", 20], ["BLOCKING_ACQUIRED", 21],
    ]);
    assert.deepEqual(blockedIds(initial), []);
});

test("a final capacity overflow rejects the whole batch before notifying any acquisition", () => {
    let calls = 0;
    let battle = fixture([holder(), target(20), target(21)]);
    const owner = getUnit(battle, 10);
    battle = update(battle, [{
        ...owner, blocker: blocker.setHook(owner.blocker, "acquired", hook("unexpected", current => {
            calls++;
            return current;
        })),
    }]);
    const current = getUnit(battle, 10);
    const first = getUnit(battle, 20);
    const second = getUnit(battle, 21);

    assert.throws(() => update(battle, [
        { ...current, blocker: { ...current.blocker, blocked: [unitRef(first), unitRef(second)] } },
        { ...first, blockable: { ...first.blockable, blocker: unitRef(current) } },
        { ...second, blockable: { ...second.blockable, blocker: unitRef(current) } },
    ]), RangeError);
    assert.equal(calls, 0);
    assert.deepEqual(battle.events, []);
    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(battle, 20), undefined);
    assert.equal(ownerId(battle, 21), undefined);
});

test("a Blockable ownership change merges its reverse link into the submitted owner", () => {
    const initial = fixture([holder(), target()]);
    const owner = getUnit(initial, 10);
    const blocked = getUnit(initial, 20);
    const battle = update(initial, [
        { ...owner, vitality: { ...owner.vitality, hp: 44 } },
        { ...blocked, blockable: { ...blocked.blockable, blocker: unitRef(owner) } },
    ]);

    assert.equal(getUnit(battle, 10).vitality.hp, 44);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(ownerId(battle), 10);
    assert.equal(battle.events.filter(event => event.type === "BLOCKING_ACQUIRED").length, 1);
});

test("nested Hook updates remain current and can invalidate later acquisition notifications", () => {
    const calls = [];
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21)]);
    const owner = getUnit(battle, 10);
    battle = update(battle, [{
        ...owner,
        blocker: blocker.setHook(owner.blocker, "acquired", hook("change-later-target", (current, { relation }) => {
            calls.push(relation.blocked.id);
            if (relation.blocked.id !== 20) return current;
            current = blocking.release(current, { id: 21 });
            const released = getUnit(current, 21);
            return update(current, [{
                ...released, position: [7, 1], vitality: { ...released.vitality, hp: 17 },
            }]);
        })),
    }]);
    const current = getUnit(battle, 10);
    const first = getUnit(battle, 20);
    const second = getUnit(battle, 21);
    const before = battle;
    battle = update(battle, [
        { ...current, blocker: { ...current.blocker, blocked: [unitRef(first), unitRef(second)] } },
        { ...first, blockable: { ...first.blockable, blocker: unitRef(current) } },
        { ...second, blockable: { ...second.blockable, blocker: unitRef(current) } },
    ]);

    assert.deepEqual(calls, [20]);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(ownerId(battle, 21), undefined);
    assert.equal(getUnit(battle, 21).vitality.hp, 17);
    assert.deepEqual(getUnit(battle, 21).position, [7, 1]);
    assert.equal(battle.events.some(event => event.type === "BLOCKING_ACQUIRED" && event.blockedUnitId === 21), false);
    assert.deepEqual(blockedIds(before), []);
    assert.equal(getUnit(before, 21).vitality.hp, 100);
});

test("a batch capacity reduction completes required releases without relying on Hooks", () => {
    let battle = acquire(fixture([holder(10, { capacity: 2 }), target(20), target(21)]));
    const owner = getUnit(battle, 10);
    const before = battle;
    battle = update(battle, [{
        ...owner,
        blocker: blocker.setCapacityContribution(owner.blocker, {
            id: "capacity-zero", value: [{ type: "ADD", value: -2 }],
        }),
    }]);

    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(battle, 20), undefined);
    assert.equal(ownerId(battle, 21), undefined);
    assert.deepEqual(battle.events.filter(event => event.type === "BLOCKING_RELEASED").map(event => event.blockedUnitId), [21, 20]);
    assert.deepEqual(blockedIds(before), [20, 21]);
});

test("a reverse-list-only removal rejects without leaving a stale Blockable owner", () => {
    const battle = acquire(fixture([holder(), target()]));
    const owner = getUnit(battle, 10);
    const blocked = getUnit(battle, 20);
    const entry = owner.blocker.blocked[0];

    assert.throws(() => update(battle, [{
        ...owner, blocker: { ...owner.blocker, blocked: [] },
    }]), RangeError);
    assert.equal(getUnit(battle, 10), owner);
    assert.equal(getUnit(battle, 20), blocked);
    assert.equal(getUnit(battle, 10).blocker.blocked[0], entry);
    assert.equal(ownerId(battle), 10);
    assert.equal(blocking.capture(battle, { id: 10 }).length, 1);
    assert.deepEqual(battle.events.map(event => event.type), ["BLOCKING_ACQUIRED"]);
});

test("empty and unchanged updates preserve state while missing and duplicate identities reject", () => {
    const first = target(20);
    const battle = fixture([first]);
    const missing = target(99);
    assert.equal(update(battle, []), battle);
    assert.equal(update(battle, [getUnit(battle, 20)]), battle);
    assert.throws(() => update(battle, [missing]), /unknown unit: 99/);
    assert.throws(() => update(battle, [first, first]), RangeError);
    assert.throws(() => update(battle, [missing, missing]), RangeError);
    const changed = { ...first, vitality: { ...first.vitality, hp: 25 } };
    for (const updates of [[missing, changed], [changed, missing]]) {
        assert.throws(() => update(battle, updates), /unknown unit: 99/);
    }
    assert.equal(getUnit(battle, 20), first);
    assert.equal(getUnit(battle, 99), undefined);
    assert.equal(getUnit(battle, 20).vitality.hp, 100);
});

test("a missing batch target rejects before any Blocking notification", () => {
    let calls = 0;
    let battle = acquire(fixture([holder(), target()]));
    const owner = getUnit(battle, 10);
    battle = update(battle, [{
        ...owner,
        blocker: blocker.setHook(owner.blocker, "released", hook("must-not-release", current => {
            calls++;
            return current;
        })),
    }]);
    const current = getUnit(battle, 10);
    const changed = { ...current, blocker: blocker.setCapacityContribution(current.blocker, {
        id: "zero-capacity", value: [{ type: "ZERO" }],
    }) };
    const missing = target(99);
    const field = battle.battlefield;
    const dependency = battle.lifetime.dependencies;
    const events = battle.events;

    for (const updates of [[changed, missing], [missing, changed]]) {
        assert.throws(() => update(battle, updates), /unknown unit: 99/);
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
    battle = update(battle, [{
        ...owner,
        blocker: blocker.setHook(owner.blocker, "released", hook("reacquire-after-spatial-update", (current, { relation }) => {
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
        })),
    }]);
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
