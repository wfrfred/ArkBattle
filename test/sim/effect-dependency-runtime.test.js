import assert from "node:assert/strict";
import { test } from "node:test";
import { add as addUnit, remove, update as updateUnit, lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { available, scope, getRef } from "../../dist/core/lifetime/index.js";
import { dependents } from "../../dist/core/lifetime/dependency.js";
import { initialize, fixtureBattle, getUnit } from "../helpers/unit.js";

const unit = (id, definition = {}) => initialize({
    id, position: [id, 0], definition: { hooks: [], id: `dependency-host-${id}`, ...definition },
});
const effectRefs = (battle, target) => dependents(battle.lifetime.dependencies, target)
    .map(child => getRef(child, effects.lifetime));

function fixture(...units) {
    let battle = fixtureBattle();
    for (const unit of units) battle = addUnit(battle, unit);
    return battle;
}

test("Unit enter installs publish runtime dependencies without a Field index", () => {
    const target = scope(unitLifetime, { id: 2 });
    let reference;
    const host = unit(1, { hooks: [{
        id: "install-on-enter", stage: "enter",
        invoke(battle, self) {
            const installed = effects.install(battle, { id: self.id }, {
                id: "entry-effect", initialize: () => ({}),
            }, { scopes: [target] });
            reference = installed.value;
            return { state: installed.state, value: undefined };
        },
    }] });
    const battle = fixture(unit(2), host);
    assert.deepEqual(effectRefs(battle, target), [reference]);
    assert.equal("lifetime" in battle.battlefield, false);
    assert.equal("effectLifetimes" in battle.battlefield, false);
});

test("installing and removing a host updates runtime dependencies and preserves old snapshots", () => {
    const target = scope(unitLifetime, { id: 2 });
    const previous = fixture(unit(2));
    let battle = addUnit(previous, unit(1));
    const installed = effects.install(battle, { id: 1 }, {
        id: "installed", initialize: () => ({}),
    }, { scopes: [target] });
    battle = installed.state;
    assert.deepEqual(effectRefs(previous, target), []);
    assert.deepEqual(effectRefs(battle, target), [installed.value]);
    const captured = battle.lifetime.dependencies;
    battle = remove(battle, 1, "SCRIPT");
    assert.deepEqual(effectRefs(battle, target), []);
    assert.deepEqual(dependents(captured, target).map(child => getRef(child, effects.lifetime)), [installed.value]);
});

test("dependency writes precede install callbacks and support nested dependent creation", () => {
    let battle = fixture(unit(1), unit(2), unit(3));
    const target = scope(unitLifetime, { id: 2 });
    let nested;
    const result = effects.install(battle, { id: 1 }, {
        id: "parent", initialize: () => ({}),
        onInstall(current, self) {
            assert.deepEqual(effectRefs(current, target), [effects.ref(self)]);
            const child = effects.install(current, { id: 3 }, {
                id: "child", initialize: () => ({}),
            }, { scopes: [scope(effects.lifetime, effects.ref(self))] });
            nested = child.value;
            return child.state;
        },
    }, { scopes: [target] });
    battle = result.state;
    const parent = scope(effects.lifetime, result.value);
    const captured = dependents(battle.lifetime.dependencies, parent);
    assert.deepEqual(effectRefs(battle, parent), [nested]);
    battle = remove(battle, 2, "SCRIPT");
    assert.equal(effects.get(battle, result.value), undefined);
    assert.equal(effects.get(battle, nested), undefined);
    assert.deepEqual(effectRefs(battle, parent), []);
    assert.deepEqual(captured.map(child => getRef(child, effects.lifetime)), [nested]);
});

test("ENDING keeps its relationships until physical removal while refusing new bindings", () => {
    const target = scope(unitLifetime, { id: 2 });
    const observed = [];
    const installed = effects.install(fixture(unit(1), unit(2)), { id: 1 }, {
        id: "ending", initialize: () => ({}),
        onDisable(battle, self) {
            observed.push("disable");
            const current = scope(effects.lifetime, effects.ref(self));
            assert.equal(available(battle, current), false);
            assert.deepEqual(effectRefs(battle, target), [effects.ref(self)]);
            return battle;
        },
        onEnd(battle, self) {
            observed.push("end");
            assert.deepEqual(effectRefs(battle, target), [effects.ref(self)]);
            return battle;
        },
    }, { scopes: [target] });
    const battle = effects.end(installed.state, installed.value);
    assert.deepEqual(observed, ["disable", "end"]);
    assert.deepEqual(effectRefs(battle, target), []);
});

test("complete Unit updates retain installed dependencies alongside occupancy and data changes", () => {
    const target = scope(unitLifetime, { id: 2 });
    const installed = effects.install(fixture(unit(1, { occupancy: { slot: "OCCUPANT" } }), unit(2)), { id: 1 }, {
        id: "updated", initialize: () => ({}),
    }, { scopes: [target] });
    const previous = installed.state;
    const current = getUnit(previous, 1);
    let battle = updateUnit(previous, [{ ...current, occupancy: { tile: [0, 1] } }]);
    battle = effects.setData(battle, installed.value, { changed: true });
    assert.deepEqual(effectRefs(battle, target), [installed.value]);
    assert.deepEqual(effects.get(battle, installed.value).data, { changed: true });
    assert.deepEqual(getUnit(previous, 1).occupancy.tile, null);
    assert.deepEqual(getUnit(battle, 1).occupancy.tile, [0, 1]);
    battle = remove(battle, 2, "SCRIPT");
    assert.equal(effects.get(battle, installed.value), undefined);
    assert.deepEqual(effectRefs(battle, target), []);
});

test("ordinary Unit updates preserve the dependency index", () => {
    const target = scope(unitLifetime, { id: 2 });
    let battle = effects.install(fixture(unit(1), unit(2)), { id: 1 }, {
        id: "retained", initialize: () => ({}),
    }, { scopes: [target] }).state;
    const previous = battle.lifetime.dependencies;
    const captured = effectRefs(battle, target);
    battle = updateUnit(battle, [{ ...getUnit(battle, 1), position: [5, 0] }]);
    assert.equal(battle.lifetime.dependencies, previous);
    assert.deepEqual(effectRefs(battle, target), captured);
});

test("a dependent ending callback can mutate another bucket without losing its update", () => {
    const first = scope(unitLifetime, { id: 1 });
    const second = scope(unitLifetime, { id: 2 });
    let replacement;
    let battle = effects.install(fixture(unit(1), unit(2), unit(3), unit(4)), { id: 3 }, {
        id: "nested cleanup", initialize: () => ({}),
        onEnd(current) {
            const installed = effects.install(current, { id: 4 }, {
                id: "replacement", initialize: () => ({}),
            }, { scopes: [second] });
            replacement = installed.value;
            return installed.state;
        },
    }, { scopes: [first] }).state;
    battle = remove(battle, 1, "SCRIPT");
    assert.deepEqual(effectRefs(battle, first), []);
    assert.deepEqual(effectRefs(battle, second), [replacement]);
    assert.equal(effects.get(battle, replacement).status, "ACTIVE");
});
