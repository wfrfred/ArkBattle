import assert from "node:assert/strict";
import { test } from "node:test";
import { add, replace, update } from "../../dist/core/battle/unit.js";
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

test("relation maintenance never takes over the capacity Settlement", () => {
    let battle = acquire(fixture([holder(10, { capacity: 2 }), target(20), target(21)]));
    const relation = blocking.relations(battle, { id: 20 })[0];
    const owner = getUnit(battle, 10);
    battle = replace(battle, [{ ...owner, blocker: {
        ...owner.blocker,
        capacity: [{ id: "published-limit", value: [{ type: "ADD", value: -1 }] }],
    } }]);
    const pending = battle;
    assert.equal(blocking.maintain(battle, relation), pending);
    assert.equal(blocking.maintainAll(battle), pending);
    assert.deepEqual(blockedIds(battle), [20, 21]);
    battle = update(battle, [capability.setCapacityContribution({ id: 10 }, {
        id: "published-limit", value: [{ type: "ADD", value: -1 }],
    })]);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(ownerId(battle, 21), undefined);
});

test("relation maintenance releases only its selected relation rather than invalid siblings", () => {
    let battle = acquire(fixture([holder(10, { capacity: 2 }), target(20), target(21)]));
    const selected = blocking.relations(battle, { id: 21 })[0];
    battle = replace(battle, [20, 21].map(id => {
        const self = getUnit(battle, id);
        return { ...self, blockable: {
            ...self.blockable, rules: [{ id: "published-denial", allows: () => false }],
        } };
    }));

    battle = blocking.maintain(battle, selected);

    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(ownerId(battle, 20), 10);
    assert.equal(ownerId(battle, 21), undefined);
});

test("an old relation cannot maintain a replacement between the same endpoints", () => {
    let battle = acquire(fixture([holder(), target()]));
    const old = blocking.relations(battle)[0];
    battle = blocking.release(battle, [old]);
    battle = blocking.acquire(battle, old.blocker, old.blocked);
    const current = blocking.relations(battle)[0];
    assert.notEqual(current.blocked, old.blocked);
    const self = getUnit(battle, 20);
    battle = replace(battle, [{ ...self, blockable: {
        ...self.blockable, rules: [{ id: "published-denial", allows: () => false }],
    } }]);

    assert.equal(blocking.maintain(battle, old), battle);
    assert.equal(getUnit(battle, 10).blocker.blocked[0], current.blocked);
    battle = blocking.maintain(battle, current);
    assert.deepEqual(blockedIds(battle), []);
});

test("a later released Hook changing an already checked relation waits for the next check point", () => {
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
    assert.deepEqual(blockedIds(battle, 10), [20]);
    assert.deepEqual(blockedIds(battle, 11), []);
    assert.equal(getUnit(battle, 11).blocker.layer, "AIR");
    assert.deepEqual(battle.events.map(({ type, blockerUnitId }) => [type, blockerUnitId]), [
        ["BLOCKING_RELEASED", 11],
    ]);

    battle = blocking.maintainAll(battle);
    assert.deepEqual(blockedIds(battle, 10), []);
    assert.deepEqual(battle.events.map(({ type, blockerUnitId }) => [type, blockerUnitId]), [
        ["BLOCKING_RELEASED", 11], ["BLOCKING_RELEASED", 10],
    ]);
});

test("the Blocking phase rechecks time-dependent Rules before searching new relationships", () => {
    let battle = fixture([holder(10), holder(11), target()]);
    battle = update(battle, [capability.setBlockerRule({ id: 10 }, {
        id: "before-tick-five", allows: state => state.tick < 5,
    })]);
    battle = acquire(battle);
    battle = { ...battle, tick: 5, events: [] };
    assert.equal(ownerId(battle), 10);

    battle = blocking.advance(battle);

    assert.equal(ownerId(battle), 11);
    assert.deepEqual(battle.events.map(({ type, blockerUnitId }) => [type, blockerUnitId]), [
        ["BLOCKING_RELEASED", 10], ["BLOCKING_ACQUIRED", 11],
    ]);
});

test("changes to a third Unit are observed at the Blocking phase without changing either endpoint's Rules", () => {
    let battle = fixture([holder(10), holder(11, { position: [9, 1] }), target()]);
    battle = update(battle, [capability.setBlockerRule({ id: 10 }, {
        id: "other-blocker-grounded",
        allows: state => getUnit(state, 11).blocker.layer === "GROUND",
    })]);
    battle = acquire(battle);
    battle = update(battle, [capability.setLayer({ id: 11 }, "AIR")]);
    assert.equal(ownerId(battle), 10);

    battle = blocking.advance(battle);

    assert.equal(ownerId(battle), undefined);
    assert.deepEqual(blockedIds(battle), []);
});

test("a Blocker created during existing-relation maintenance waits for the next phase's search", () => {
    let battle = fixture([holder(), target(), target(30, { position: [7.25, 1] })]);
    battle = update(battle, [
        capability.setBlockerRule({ id: 10 }, {
            id: "initial-tick", allows: state => state.tick === 0,
        }),
        capability.setBlockerHook({ id: 10 }, "released", hook("new-blocker", state =>
            add(state, holder(11, { position: [7, 1] }))
        )),
    ]);
    battle = acquire(battle);

    battle = blocking.advance({ ...battle, tick: 1 });
    assert.notEqual(getUnit(battle, 11), undefined);
    assert.equal(ownerId(battle, 30), undefined);

    battle = blocking.advance({ ...battle, tick: 2 });
    assert.equal(ownerId(battle, 30), 11);
});

test("global maintenance keeps its old relation identities when a Hook rebuilds a later relationship", () => {
    let battle = fixture([holder(10, { capacity: 2 }), holder(11, { position: [9, 1] }), target(20), target(21)]);
    battle = update(battle, [
        capability.setBlockableRule({ id: 20 }, {
            id: "initial-tick", allows: state => state.tick === 0,
        }),
        capability.setBlockableRule({ id: 21 }, {
            id: "other-blocker-grounded",
            allows: state => getUnit(state, 11).blocker.layer === "GROUND",
        }),
    ]);
    battle = acquire(battle);
    const previous = blocking.relations(battle, { id: 21 })[0];
    battle = update(battle, [capability.setBlockerHook({ id: 10 }, "released", hook("replace-later", (state, { relation }) => {
        if (relation.blocked.id !== 20) return state;
        state = blocking.release(state, [previous]);
        state = blocking.acquire(state, previous.blocker, previous.blocked);
        return update(state, [capability.setLayer({ id: 11 }, "AIR")]);
    }))]);

    battle = blocking.maintainAll({ ...battle, tick: 1 });
    assert.deepEqual(blockedIds(battle), [21]);
    assert.notEqual(getUnit(battle, 10).blocker.blocked[0], previous.blocked);

    battle = blocking.maintainAll(battle);
    assert.deepEqual(blockedIds(battle), []);
});

test("capacity Settlement trims the tail without taking over a later Rule Settlement", () => {
    let battle = acquire(fixture([holder(10, { capacity: 3 }), target(20), target(21), target(22)]));
    const observed = [];
    battle = update(battle, [capability.setBlockerHook({ id: 10 }, "released", hook("settlement-order", (state, { relation }) => {
        observed.push([relation.blocked.id, blockedIds(state)]);
        assert.equal(getUnit(state, 20).blockable.rules[0].id, "first-disabled");
        return state;
    }))]);

    battle = update(battle, [
        capability.setCapacityContribution({ id: 10 }, {
            id: "capacity-two", value: [{ type: "ADD", value: -1 }],
        }),
        capability.setBlockableRule({ id: 20 }, { id: "first-disabled", allows: () => false }),
    ]);

    assert.deepEqual(observed, [
        [22, [20, 21]], [20, [21]],
    ]);
    assert.deepEqual(blockedIds(battle), [21]);
});
