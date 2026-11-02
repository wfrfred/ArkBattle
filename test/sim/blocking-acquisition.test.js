
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";

import * as blocking from "../../dist/core/battle/blocking/index.js";
import { sides } from "../../dist/core/unit/capability/blocking/index.js";

import { getUnit, replaceUnit } from "../helpers/unit.js";

import * as blockerOperations from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import * as blockableOperations from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import { fixture, holder, target, acquire, blockedIds, ownerId } from "../helpers/blocking.js";

test("both endpoint Rules receive the same pair and changes release an incompatible existing relation", () => {
    const owner = holder(10, { capacity: 3 });
    const candidate = target(21);
    let battle = { ...fixture([
        owner, holder(11, { capacity: 3 }), target(20), candidate, target(22),
    ]), tick: 7 };
    battle = applyUnitChanges(battle, [blockerOperations.setRule({ id: 10 }, {
        id: "skip-first",
        allows(current, { blocker, blockable }) {
            assert.equal(current.tick, 7);
            assert.equal(getUnit(current, blocker.id), blocker);
            assert.equal(getUnit(current, blockable.id), blockable);
            assert.equal(blocker.id, 10);
            return blockable.id !== 20;
        },
    })]);
    battle = applyUnitChanges(battle, [blockableOperations.setRule({ id: 21 }, {
        id: "second-owner-only",
        allows(current, { blocker, blockable }) {
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
        allows: (_current, { blocker, blockable }) => blocker.id === 11 && blockable.id === 22,
    })]);
    assert.equal(ownerId(battle, 22), undefined);
    assert.deepEqual(blockedIds(battle, 10), []);
    assert.deepEqual(blockedIds(battle, 11), [20, 21]);
    battle = acquire(battle, 11);
    assert.equal(ownerId(battle, 22), 11);
});


test("advance searches blockers in registration order; equal-distance targets retain registration order", () => {
    let battle = fixture([
        holder(10, { position: [1, 1], capacity: 2 }),
        target(23, { position: [1.5, 1] }),
        holder(5, { position: [2, 1] }),
        target(22, { position: [1.5, 1] }),
        target(21, { position: [1.25, 1] }),
    ]);
    battle = blocking.advance(battle);
    assert.deepEqual(blockedIds(battle, 10), [21, 23]);
    assert.deepEqual(blockedIds(battle, 5), [22]);
});

test("without configured Rules, blocking does not depend on either endpoint's allegiance", () => {
    for (const [left, right] of [["ALLY", "ALLY"], ["ALLY", "NEUTRAL"], [null, null]]) {
        const owner = holder(10, { side: left ?? "ALLY", definition: {
            blocker: { layer: "GROUND", rules: [], capacity: 1, radius: 1 },
        } });
        const candidate = target(20, { side: right ?? "ENEMY" });
        const battle = acquire(fixture([
            left === null ? withoutAllegiance(owner) : owner,
            right === null ? withoutAllegiance(candidate) : candidate,
        ]));
        assert.equal(ownerId(battle), 10, `${left} -> ${right}`);
    }
});

test("the standard ENEMY policy selects target sides without requiring blocker allegiance", () => {
    for (const [left, right, expected] of [
        ["ALLY", "ENEMY", true], ["ALLY", "ALLY", false], ["ALLY", "NEUTRAL", false],
        ["ALLY", null, false], [null, "ENEMY", true], ["ENEMY", "ENEMY", true],
    ]) {
        const owner = holder(10, { side: left ?? "ALLY" });
        const candidate = target(20, { side: right ?? "ENEMY" });
        const battle = acquire(fixture([
            left === null ? withoutAllegiance(owner) : owner,
            right === null ? withoutAllegiance(candidate) : candidate,
        ]));
        assert.equal(ownerId(battle), expected ? 10 : undefined, `${left} -> ${right}`);
    }
});

test("one side policy can admit both ALLY and NEUTRAL targets", () => {
    const battle = acquire(fixture([
        holder(10, { definition: {
            blocker: { layer: "GROUND", capacity: 3, radius: 1, rules: [sides("ALLY", "NEUTRAL")] },
        } }),
        target(20, { side: "ALLY" }), target(21, { side: "NEUTRAL" }), target(22),
    ]));
    assert.deepEqual(blockedIds(battle), [20, 21]);
});

test("existing blocking is retained beyond acquisition distance and radius changes only affect search", () => {
    let battle = acquire(fixture([holder(), target()]));
    const stored = getUnit(battle, 10).blocker.blocked[0];
    const currentUnit5 = getUnit(battle, 20);
    battle = replaceUnit(battle, { ...currentUnit5, position: [8, 1] });
    const currentUnit6 = getUnit(battle, 10);
    battle = replaceUnit(battle, { ...currentUnit6, blocker: { ...currentUnit6.blocker, radius: 0 } });
    assert.equal(getUnit(battle, 10).blocker.blocked[0], stored);
    assert.equal(ownerId(battle), 10);
    battle = blocking.release(battle, blocking.relations(battle, { id: 20 }));
    assert.equal(ownerId(acquire(battle)), undefined);
});

test("search uses inclusive radius and can acquire an out-of-map target", () => {
    for (const [position, expected] of [[[2.25, 1], true], [[2.2501, 1], false], [[-0.25, 1], true]]) {
        const positionOfHolder = position[0] < 0 ? [0, 1] : [2, 1];
        const battle = acquire(fixture([
            holder(10, { position: positionOfHolder, radius: 0.25 }), target(20, { position }),
        ]));
        assert.equal(ownerId(battle), expected ? 10 : undefined);
    }
});

function withoutAllegiance(unit) {
    const { allegiance: ignoredDefinition, ...definition } = unit.definition;
    const { allegiance: ignoredState, ...remaining } = unit;
    return { ...remaining, definition };
}
