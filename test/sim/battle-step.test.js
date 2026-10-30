import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize, step } from "../../dist/core/battle/runtime.js";
import { replace as updateUnit } from "../../dist/core/battle/unit.js";
import { remove } from "../../dist/core/battle/unit.js";
import * as units from "../../dist/core/unit/query.js";
import { fixtureBattle } from "../helpers/unit.js";

function input(definition) {
    return {
        map: fixtureBattle().battlefield.map,
        initialUnits: [{ definition, position: [0, 0] }],
        initialMechanisms: [], predefines: [],
        schedule: { type: "TIMELINE", spawns: [] },
        maxTicks: 2, routeMoveMultiplier: 1, rngState: 1,
    };
}

test("battle step returns complete immutable State values and preserves its input", () => {
    let battle;
    const marker = { count: 1 };
    battle = initialize(input({
        id: "published-state",
        hooks: [{ id: "test/tick", stage: "tick", invoke(battle, self) {
            return { state: updateUnit(battle, [{ ...self, marker }]), value: undefined };
        } }],
    }));
    const before = battle;
    const original = units.get(before, { id: 0 });
    battle = step(battle, []);
    const current = battle;
    assert.notEqual(current, before);
    assert.equal(before.tick, 0);
    assert.equal(current.tick, 1);
    assert.equal(current.schedule.definition.type, "TIMELINE");
    assert.equal(units.get(current, { id: 0 }).marker, marker);
    assert.equal(units.get(before, { id: 0 }), original);
    assert.equal(Object.hasOwn(original, "marker"), false);
    assert.equal(current.definition, before.definition);
    assert.deepEqual(step(before, []), current);
    assert.equal(step(current, []), current);
});

test("a throwing battle step does not change its input or require a recovery protocol", () => {
    const failure = new Error("state publication failed");
    let working;
    let battle = initialize(input({
        id: "failed-state",
        hooks: [{ id: "test/tick", stage: "tick", invoke(battle, self) {
            working = updateUnit(battle, [{ ...self, marker: { failed: true } }]);
            throw failure;
        } }],
    }));
    const before = battle;
    const original = units.get(before, { id: 0 });
    assert.throws(() => { battle = step(battle, []); }, error => error === failure);
    assert.equal(battle, before);
    assert.equal(units.get(battle, { id: 0 }), original);
    assert.equal(units.get(working, { id: 0 }).marker.failed, true);
    assert.equal(Object.hasOwn(original, "marker"), false);
    assert.deepEqual(before.events, []);
    assert.deepEqual(before.removedUnits, []);
});

test("Unit removal events share the recorded immutable Unit including content-owned fields", () => {
    const marker = { resource: "retained" };
    let battle = initialize(input({
        id: "removed-state",
        hooks: [{ id: "test/tick", stage: "tick", invoke(battle, self) {
            battle = updateUnit(battle, [{ ...self, marker }]);
            return { state: remove(battle, self.id, "SCRIPT"), value: undefined };
        } }],
    }));
    const before = battle;
    battle = step(battle, []);
    const removed = battle.removedUnits[0];
    const event = battle.events.find(event => event.type === "UNIT_REMOVED");
    assert.equal(event.unit, removed.unit);
    assert.equal(event.unit.marker, marker);
    assert.equal(event.unit.lifecycle, "LEAVING");
    assert.equal(units.get(battle, { id: 0 }), undefined);
    assert.equal(units.get(before, { id: 0 }).lifecycle, "PRESENT");
});
