import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize, fixtureBattle } from "../helpers/unit.js";
import { add as addUnit, remove as removeUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";

function fixture(data, callbacks = {}, initial = {}) {
    const host = initialize({
        id: 0,
        position: [0, 0],
        definition: { hooks: [], id: "effect-update-host" },
    });
    const definition = { id: "updatable", initialize: () => data, ...callbacks };
    const created = effects.install(addUnit(fixtureBattle(), host), unitRef(host), definition, initial);

    return { ...created, definition };
}

test("Effect data writes preserve identity, Definition, lifecycle facts and earlier snapshots", () => {
    const nested = { sampled: 7 };
    const source = unitRef(initialize({
        id: 42, position: [0, 0], definition: { id: "effect-source" },
    }));
    const initial = fixture(
        { count: 1, nested },
        { group: { id: "updatable-group", priority: 2 } },
        { source, enabled: false, scopes: [{ type: "TICK", tick: 100 }] },
    );
    const original = effects.get(initial.state, initial.value);
    const first = effects.setData(initial.state, initial.value, { ...original.data, count: original.data.count + 4 });
    const latest = effects.get(first, initial.value);
    const second = effects.setData(first, initial.value, { ...latest.data, count: latest.data.count + 1 });
    const current = effects.get(second, initial.value);

    assert.equal(latest.data.count, 5);
    assert.equal(current.data.count, 6);
    assert.equal(original.data.count, 1);
    assert.strictEqual(current.data.nested, nested);
    assert.equal(current.id, original.id);
    assert.strictEqual(current.host, original.host);
    assert.strictEqual(current.definition, initial.definition);
    assert.strictEqual(current.scopes, original.scopes);
    assert.equal(current.source, source);
    assert.equal(current.enabled, false);
    assert.equal(current.status, "INACTIVE");
    assert.equal(getUnit(second, 0).effects.nextId, getUnit(initial.state, 0).effects.nextId);
    assert.strictEqual(second.execution, initial.state.execution);
});

test("Writing the same Effect data returns the original BattleState", () => {
    const created = fixture({ count: 1 });
    const original = effects.get(created.state, created.value);
    const unchanged = effects.setData(created.state, created.value, original.data);

    assert.strictEqual(unchanged, created.state);
    assert.strictEqual(effects.get(unchanged, created.value), original);
});

test("Effect data writes reject removed instances and hosts", () => {
    const created = fixture({ count: 1 });
    const ended = effects.end(created.state, created.value);
    const removed = removeUnit(ended, created.value.host.id, "RETREAT");
    assert.throws(() => effects.setData(ended, created.value, { count: 2 }), /unknown effect: 0/);
    assert.throws(() => effects.setData(removed, created.value, { count: 2 }), /unknown unit: 0/);
    assert.equal(effects.get(ended, created.value), undefined);
    assert.equal(effects.get(removed, created.value), undefined);
});

test("Effect update remains available during both ENDING callbacks without reviving the instance", () => {
    const observed = [];
    const created = fixture({ phases: [] }, {
        onDisable(state, self) {
            const ref = effectRef(self);
            assert.equal(effects.get(state, ref).status, "ENDING");
            const currentData = effects.get(state, ref).data;
            state = effects.setData(state, ref, { ...currentData, phases: [...currentData.phases, "disable"] });
            observed.push(effects.get(state, ref).data.phases);
            return state;
        },
        onEnd(state, self) {
            const ref = effectRef(self);
            assert.deepEqual(self.data.phases, ["disable"]);
            const currentData = effects.get(state, ref).data;
            state = effects.setData(state, ref, { ...currentData, phases: [...currentData.phases, "end"] });
            assert.equal(effects.get(state, ref).status, "ENDING");
            assert.strictEqual(effects.end(state, ref), state);
            observed.push(effects.get(state, ref).data.phases);
            return state;
        },
    });
    const ended = effects.end(created.state, created.value);

    assert.deepEqual(observed, [["disable"], ["disable", "end"]]);
    assert.equal(effects.get(ended, created.value), undefined);
    assert.deepEqual(effects.get(created.state, created.value).data.phases, []);
    assert.equal(effects.get(created.state, created.value).status, "ACTIVE");
});

test("Effect installation callbacks can initialize private data before enable observes it", () => {
    const observed = [];
    const created = fixture({ count: 0 }, {
        onInstall(state, self) {
            const ref = effectRef(self);
            assert.equal(effects.get(state, ref).status, "INSTALLING");
            const currentData = effects.get(state, ref).data;
            return effects.setData(state, ref, { ...currentData, count: currentData.count + 1 });
        },
        onEnable(state, self) {
            observed.push(self.data.count);
            return state;
        },
    });

    assert.deepEqual(observed, [1]);
    assert.equal(effects.get(created.state, created.value).data.count, 1);
    assert.equal(effects.get(created.state, created.value).status, "ACTIVE");
});
