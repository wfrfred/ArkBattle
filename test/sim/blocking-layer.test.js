
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as capability from "../../dist/core/unit/capability/blocking/index.js";
import { getUnit, initialize } from "../helpers/unit.js";
import { changeTile } from "../helpers/tiles.js";
import { fixture, holder, target, acquire, blockedIds, ownerId, hook } from "../helpers/blocking.js";

function standardHolder(layer = "GROUND", capacity = 2) {
    return holder(10, {
        definition: {
            layer: { type: "GROUND" },
            blocker: { layer, capacity, rules: [capability.sides("ENEMY")] },
        },
    });
}

function onReleased(battle, id, capabilityName, entry) {
    const setHook = capabilityName === "blocker"
        ? capability.setBlockerHook
        : capability.setBlockableHook;
    return applyUnitChanges(battle, [setHook({ id }, "released", entry)]);
}


test("switching blocking layer replaces the standard radius and preserves Definition and own layer", () => {
    let battle = fixture([standardHolder()]);
    const definition = getUnit(battle, 10).definition;
    battle = applyUnitChanges(battle, [capability.setLayer({ id: 10 }, "AIR")]);
    assert.equal(getUnit(battle, 10).blocker.layer, "AIR");
    assert.equal(getUnit(battle, 10).blocker.radius, 0.8944);
    assert.equal(getUnit(battle, 10).layer.type, "GROUND");
    assert.equal(getUnit(battle, 10).definition, definition);
    assert.equal(definition.blocker.layer, "GROUND");
    battle = applyUnitChanges(battle, [capability.setLayer({ id: 10 }, "GROUND")]);
    assert.equal(getUnit(battle, 10).blocker.radius, 0.7071);
});

test("an explicit radius is retained by initialization and both layer transitions", () => {
    const unit = holder(10, { radius: 0.4472 });
    const radius = unit.definition.blocker.radius;
    assert.equal(unit.blocker.radius, radius);
    let battle = fixture([unit]);
    battle = applyUnitChanges(battle, [capability.setLayer({ id: 10 }, "AIR")]);
    assert.equal(getUnit(battle, 10).blocker.radius, radius);
    battle = applyUnitChanges(battle, [capability.setLayer({ id: 10 }, "GROUND")]);
    assert.equal(getUnit(battle, 10).blocker.radius, radius);
});

for (const [layer, expected] of [["GROUND", [20]], ["AIR", [21]]]) {
    test(`${layer} blocking acquires only matching targets and still applies side rules`, () => {
        let battle = fixture([
            standardHolder(layer, 3),
            target(20),
            target(21, { layer: "AIR", position: [2.1, 1] }),
            target(22, { layer, side: "ALLY", position: [2.05, 1] }),
        ]);
        battle = acquire(battle);
        assert.deepEqual(blockedIds(battle), expected);
        assert.equal(ownerId(battle, 22), undefined);
    });
}

test("search uses the larger AIR standard radius without inheriting it after landing", () => {
    let battle = fixture([
        standardHolder(),
        target(20, { position: [2.8, 1] }),
        target(21, { layer: "AIR", position: [2.8, 1] }),
    ]);
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), []);
    battle = applyUnitChanges(battle, [capability.setLayer({ id: 10 }, "AIR")]);
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [21]);
    battle = applyUnitChanges(battle, [capability.setLayer({ id: 10 }, "GROUND")]);
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), []);
});

test("AIR search bypasses ground tile permission while GROUND search requires it", () => {
    let battle = fixture([standardHolder(), target(), target(21, { layer: "AIR" })]);
    battle = changeTile(battle, [1, 2], { allowsBlocking: false });
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), []);
    battle = applyUnitChanges(battle, [capability.setLayer({ id: 10 }, "AIR")]);
    assert.deepEqual(blockedIds(battle), [], "switching layer does not perform a search");
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [21]);
});

test("an AIR relation survives a change to ground tile blocking permission", () => {
    let battle = acquire(fixture([standardHolder("AIR"), target(20, { layer: "AIR" })]));
    assert.equal(ownerId(battle), 10);
    battle = changeTile(battle, [1, 2], { allowsBlocking: false });
    assert.equal(ownerId(battle), 10);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(battle.events.filter(event => event.type === "BLOCKING_RELEASED").length, 0);
});

for (const layer of ["GROUND", "AIR"]) {
    test(`${layer} blocking requires the target to have an explicit layer`, () => {
        const candidate = initialize({
            id: 20,
            position: [2.25, 1],
            definition: {
                id: "blockable-without-layer",
                allegiance: { side: "ENEMY" },
                spatialPresence: {},
                blockable: { volume: 1 },
            },
        });
        const battle = acquire(fixture([standardHolder(layer), candidate]));
        assert.deepEqual(blockedIds(battle), []);
        assert.equal(ownerId(battle), undefined);
    });
}


test("layer switching publishes all old releases and the new radius before ordered notifications", () => {
    let battle = fixture([
        standardHolder(), target(20), target(21), target(22, { layer: "AIR" }),
    ]);
    const observed = [];
    battle = onReleased(battle, 10, "blocker", hook("inspect-switch", (state, { relation }) => {
        const current = getUnit(state, 10);
        assert.equal(current.blocker.layer, "AIR");
        assert.equal(current.blocker.radius, 0.8944);
        assert.equal(current.layer.type, "GROUND");
        assert.deepEqual(blockedIds(state), []);
        assert.equal(ownerId(state, 20), undefined);
        assert.equal(ownerId(state, 21), undefined);
        observed.push(["blocker", relation.blocked.id]);
        return state;
    }));
    for (const id of [20, 21]) {
        battle = onReleased(battle, id, "blockable", hook("inspect-owner", (state, { relation }) => {
            observed.push(["blockable", relation.blocked.id]);
            return state;
        }));
    }
    battle = acquire(battle);
    const definition = getUnit(battle, 10).definition;
    battle = applyUnitChanges(battle, [capability.setLayer({ id: 10 }, "AIR")]);
    assert.deepEqual(observed, [
        ["blocker", 20], ["blockable", 20], ["blocker", 21], ["blockable", 21],
    ]);
    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(battle, 22), undefined, "AIR targets wait for an explicit or scheduled search");
    assert.equal(getUnit(battle, 10).definition, definition);
    assert.deepEqual(
        battle.events.filter(event => event.type === "BLOCKING_RELEASED").map(event => event.blockedUnitId),
        [20, 21],
    );
});
