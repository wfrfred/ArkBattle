import assert from "node:assert/strict";
import { test } from "node:test";
import { replace, update } from "../../dist/core/battle/unit.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as capability from "../../dist/core/unit/capability/blocking/index.js";
import { getUnit } from "../helpers/unit.js";
import { changeTile } from "../helpers/tiles.js";
import { fixture, holder, target, acquire, blockedIds, ownerId, hook } from "../helpers/blocking.js";

test("Blockable Rule settlements begin with their own relationship after the whole batch is published", () => {
    let battle = acquire(fixture([holder(10, { capacity: 2 }), target(20), target(21)]));
    const observed = [];
    battle = update(battle, [capability.setBlockerHook({ id: 10 }, "released", hook("rule-order", (state, { relation }) => {
        observed.push([relation.blocked.id, blockedIds(state)]);
        assert.equal(getUnit(state, 20).blockable.rules[0].id, "first-disabled");
        assert.equal(getUnit(state, 21).blockable.rules[0].id, "second-disabled");
        return state;
    }))]);
    battle = update(battle, [
        capability.setBlockableRule({ id: 21 }, { id: "second-disabled", allows: () => false }),
        capability.setBlockableRule({ id: 20 }, { id: "first-disabled", allows: () => false }),
    ]);
    assert.deepEqual(observed, [[21, [20]], [20, []]]);
    assert.deepEqual(blockedIds(battle), []);
});

test("maintaining a valid Blockable does not settle its owner's pending capacity change", () => {
    let battle = acquire(fixture([holder(10, { capacity: 2 }), target(20), target(21)]));
    const owner = getUnit(battle, 10);
    battle = replace(battle, [{ ...owner, blocker: {
        ...owner.blocker,
        capacity: [{ id: "published-limit", value: [{ type: "ADD", value: -1 }] }],
    } }]);
    const pending = battle;
    assert.equal(blocking.maintain(battle, { id: 20 }), pending);
    assert.deepEqual(blockedIds(battle), [20, 21]);
    battle = blocking.maintain(battle, { id: 10 });
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(ownerId(battle, 21), undefined);
});

test("global maintenance revisits an earlier owner after a later owner's released Hook changes its eligibility", () => {
    let battle = fixture([
        holder(10), holder(11, { position: [7, 1] }),
        target(20), target(21, { position: [7.25, 1] }),
    ]);
    battle = update(battle, [
        capability.setBlockerRule({ id: 10 }, {
            id: "other-blocker-grounded",
            allows: state => getUnit(state, 11).blocker.layer === "GROUND",
        }),
        capability.setBlockerHook({ id: 11 }, "released", hook("take-off", state =>
            update(state, [capability.setLayer({ id: 11 }, "AIR")])
        )),
    ]);
    battle = acquire(acquire(battle), 11);
    battle = { ...battle, events: [] };
    battle = changeTile(battle, [1, 7], { allowsBlocking: false });
    assert.deepEqual(blockedIds(battle, 10), []);
    assert.deepEqual(blockedIds(battle, 11), []);
    assert.equal(getUnit(battle, 11).blocker.layer, "AIR");
    assert.deepEqual(battle.events.map(({ type, blockerUnitId }) => [type, blockerUnitId]), [
        ["BLOCKING_RELEASED", 11], ["BLOCKING_RELEASED", 10],
    ]);
});

test("global maintenance uses owner order without prioritizing another owner's invalid relation over capacity", () => {
    let battle = acquire(fixture([
        holder(10, { capacity: 2 }), holder(11, { position: [7, 1] }),
        target(20), target(21), target(30, { position: [7.25, 1] }),
    ]));
    battle = acquire(battle, 11);
    const first = getUnit(battle, 10);
    const second = getUnit(battle, 11);
    battle = replace(battle, [
        { ...first, blocker: { ...first.blocker, capacity: [{ id: "limit", value: [{ type: "ADD", value: -1 }] }] } },
        { ...second, blocker: { ...second.blocker, rules: [{ id: "disabled", allows: () => false }] } },
    ]);
    battle = blocking.maintainAll({ ...battle, events: [] });
    assert.deepEqual(blockedIds(battle, 10), [20]);
    assert.deepEqual(blockedIds(battle, 11), []);
    assert.deepEqual(battle.events.map(({ blockerUnitId, blockedUnitId }) => [blockerUnitId, blockedUnitId]), [
        [10, 21], [11, 30],
    ]);
});
