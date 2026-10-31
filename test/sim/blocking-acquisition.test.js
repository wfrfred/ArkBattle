import { createChange } from "../../dist/core/unit/change.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { replace as updateUnit } from "../../dist/core/battle/unit.js";
import { release, relations, maintain, advance, acquire as acquirePair } from "../../dist/core/battle/blocking/index.js";
import { getUnit, replaceUnit } from "../helpers/unit.js";
import * as blocker from "../../dist/core/unit/capability/blocking/blocker.js";
import * as blockerOperations from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import * as blockableOperations from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import { fixture, holder, target, acquire, blockedIds, ownerId, capacity, hook } from "../helpers/blocking.js";

test("both endpoint Rules receive the same pair and changes release an incompatible existing relation", () => {
    const owner = holder(10, { capacity: 3 });
    const candidate = target(21);
    let battle = { ...fixture([
        owner, holder(11, { capacity: 3 }), target(20), candidate, target(22),
    ]), tick: 7 };
    battle = applyUnitChanges(battle, [blockerOperations.setRule({ id: 10 }, {
        id: "skip-first",
        allows(current, blocker, blockable) {
            assert.equal(current.tick, 7);
            assert.equal(getUnit(current, blocker.id), blocker);
            assert.equal(getUnit(current, blockable.id), blockable);
            assert.equal(blocker.id, 10);
            return blockable.id !== 20;
        },
    })]);
    battle = applyUnitChanges(battle, [blockableOperations.setRule({ id: 21 }, {
        id: "second-owner-only",
        allows(current, blocker, blockable) {
            assert.equal(current.tick, 7);
            assert.equal(getUnit(current, blocker.id), blocker);
            assert.equal(getUnit(current, blockable.id), blockable);
            assert.equal(blockable.id, 21);
            return blocker.id === 11;
        },
    })]);

    battle = acquire(battle, 10);
    assert.deepEqual(blockedIds(battle, 10), [22]);
    battle = acquire(battle, 11);
    assert.deepEqual(blockedIds(battle, 11), [20, 21]);

    battle = applyUnitChanges(battle, [blockableOperations.setRule({ id: 22 }, {
        id: "second-owner-only",
        allows: (_current, blocker, blockable) => blocker.id === 11 && blockable.id === 22,
    })]);
    assert.equal(ownerId(battle, 22), undefined);
    assert.deepEqual(blockedIds(battle, 10), []);
    assert.deepEqual(blockedIds(battle, 11), [20, 21]);
    battle = acquire(battle, 11);
    assert.equal(ownerId(battle, 22), 11);
});

test("acquisition rechecks its own relation while indirect changes to earlier relations wait for the Blocking phase", () => {
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21, { position: [2.5, 1] })]);
    battle = applyUnitChanges(battle, [blockerOperations.setRule({ id: 10 }, {
        id: "twenty-excludes-twenty-one",
        allows(_battle, owner, candidate) {
            return candidate.id !== 20 || !owner.blocker.blocked.some(reference => reference.id === 21);
        },
    })]);

    battle = acquire(battle);

    assert.deepEqual(blockedIds(battle), [20, 21]);
    assert.equal(ownerId(battle, 20), 10);
    assert.deepEqual(battle.events.map(event => [event.type, event.blockedUnitId]), [
        ["BLOCKING_ACQUIRED", 20], ["BLOCKING_ACQUIRED", 21],
    ]);
    battle = advance(battle);

    assert.deepEqual(blockedIds(battle), [21]);
    assert.equal(ownerId(battle, 20), undefined);
    assert.equal(ownerId(battle, 21), 10);
    assert.deepEqual(battle.events.map(event => [event.type, event.blockedUnitId]), [
        ["BLOCKING_ACQUIRED", 20], ["BLOCKING_ACQUIRED", 21], ["BLOCKING_RELEASED", 20],
    ]);
});

test("explicit maintenance settles remaining Rules after releasing their prerequisite relationship", () => {
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21, { position: [2.1, 1] })]);
    battle = applyUnitChanges(battle, [blockerOperations.setRule({ id: 10 }, {
        id: "twenty-requires-twenty-one",
        allows(_battle, owner, candidate) {
            return candidate.id !== 20 || owner.blocker.blocked.some(reference => reference.id === 21);
        },
    })]);
    battle = acquire(battle);
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [21, 20]);

    battle = release(battle, relations(battle, { id: 21 }));
    assert.deepEqual(blockedIds(battle), [20], "release only changes the supplied relationship");
    battle = maintain(battle, relations(battle, { id: 20 })[0]);

    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(battle, 20), undefined);
    assert.equal(ownerId(battle, 21), undefined);
    assert.deepEqual(battle.events.map(event => [event.type, event.blockedUnitId]), [
        ["BLOCKING_ACQUIRED", 21], ["BLOCKING_ACQUIRED", 20],
        ["BLOCKING_RELEASED", 21], ["BLOCKING_RELEASED", 20],
    ]);
});

const denied = [
    ["outside acquisition radius", () => [holder(), target(20, { position: [6, 1] })]],
    ["insufficient capacity", () => [holder(10, { capacity: 0 }), target()]],
    ["target volume exceeds capacity", () => [holder(), target(20, { volume: 2 })]],
    ["blocker Rule denies acquisition", () => {
        const unit = holder();
        return [{ ...unit, blocker: { ...unit.blocker, rules: [...unit.blocker.rules, { id: "deny", allows: () => false }] } }, target()];
    }],
    ["Blockable Rule denies acquisition", () => {
        const unit = target();
        return [holder(), { ...unit, blockable: { ...unit.blockable, rules: [{ id: "deny", allows: () => false }] } }];
    }],
    ["target has no HP", () => {
        const unit = target();
        return [holder(), { ...unit, vitality: { ...unit.vitality, hp: 0 } }];
    }],
    ["blocker is leaving", () => [
        { ...holder(), lifecycle: "LEAVING" }, target(),
    ]],
    ["target is not hostile", () => [holder(), target(20, { side: "ALLY" })]],
    ["target is aerial", () => {
        const unit = target();
        return [holder(), { ...unit, layer: { ...unit.layer, type: "AIR" } }];
    }],
];

for (const [name, create] of denied) {
    test(`acquire rejects ${name} without changing state or notifying`, () => {
        let battle = fixture(create());
        const calls = [];
        for (const key of ["acquired", "released"]) {
            const currentUnit = getUnit(battle, 10);
            battle = applyUnitChanges(battle, [blockerOperations.setHook({ id: currentUnit.id }, key, hook(key, state => {
                    calls.push(key);
                    return state;
                }))]);
        }
        const initialOwner = getUnit(battle, 10);
        const initialTarget = getUnit(battle, 20);

        assert.equal(acquirePair(battle, { id: 10 }, { id: 20 }), battle);
        assert.deepEqual(calls, []);
        assert.equal(getUnit(battle, 10), initialOwner);
        assert.equal(getUnit(battle, 20), initialTarget);
        assert.deepEqual(battle.events, []);
        assert.equal(ownerId(battle), undefined);
        assert.deepEqual(blockedIds(battle), []);
        assert.equal(acquire(battle), battle, "search rejects the same invalid attempt without throwing");
    });
}

test("acquire reads the latest volume instead of an earlier Unit snapshot", () => {
    const initial = fixture([holder(), target()]);
    const battle = applyUnitChanges(initial, [blockableOperations.setVolumeContribution({ id: 20 }, { id: "larger", value: 1 })]);
    assert.equal(acquirePair(battle, { id: 10 }, { id: 20 }), battle);
    assert.equal(ownerId(battle), undefined);
    assert.equal(getUnit(initial, 20).blockable.volume.length, 0);
});


test("a qualified acquire preserves subsequent Hook changes", () => {
    let battle = fixture([holder(), target()]);
    const currentUnit2 = getUnit(battle, 10);
    battle = applyUnitChanges(battle, [blockerOperations.setHook({ id: currentUnit2.id }, "acquired", hook("update-target", state => {
            const currentUnit3 = getUnit(state, 20);
            return replaceUnit(state, { ...currentUnit3, vitality: { ...currentUnit3.vitality, hp: 75 } });
        }))]);
    const initial = battle;

    battle = acquirePair(battle, { id: 10 }, { id: 20 });

    assert.equal(ownerId(battle), 10);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(getUnit(battle, 20).vitality.hp, 75);
    assert.deepEqual(battle.events.map(event => event.type), ["BLOCKING_ACQUIRED"]);
    assert.equal(getUnit(initial, 20).vitality.hp, 100);
    assert.equal(ownerId(initial), undefined);
});

for (const [name, candidate, expectedError] of [
    ["a missing Unit", () => target(99), /unknown unit: 99/],
    ["the current Unit object", state => getUnit(state, 10)],
]) test(`updating ${name} does not trigger unrelated maintenance inside a release Hook`, () => {
    let battle = fixture([holder(10, { capacity: 3 }), target(20), target(21), target(22)]);
    const released = [];
    const currentUnit4 = getUnit(battle, 10);
    battle = applyUnitChanges(battle, [blockerOperations.setHook({ id: currentUnit4.id }, "released", hook("restore-capacity", (state, { relation }) => {
            released.push(relation.blocked.id);
            if (relation.blocked.id !== 22) return state;
            assert.deepEqual(blockedIds(state), [20, 21]);
            if (expectedError === undefined) {
                assert.equal(updateUnit(state, [candidate(state)]), state);
            } else {
                assert.throws(() => applyUnitChanges(state, [createChange({id:candidate(state).id}, unit=>unit)]), expectedError);
            }
            return capacity(state, 10, 2);
        }))]);

    battle = capacity(acquire(battle), 10, 1);

    assert.deepEqual(released, [22]);
    assert.deepEqual(blockedIds(battle), [20, 21]);
    assert.equal(getUnit(battle, 99), undefined);
});
