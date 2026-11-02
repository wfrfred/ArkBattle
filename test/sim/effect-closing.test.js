import { remove as endUnit } from "../../dist/core/battle/unit.js";
import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as effectLifetime } from "../../dist/core/unit/effect/operations.js";
import { lifetime as unitLifetime } from "../../dist/core/battle/unit.js";

import { ref as unitRef } from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../helpers/unit.js";

import { getUnit } from "../helpers/unit.js";


import * as effect from "../../dist/core/unit/effect/index.js";
import { get } from "../../dist/core/unit/effect/index.js";
import { effectFixtureWork, install, definition } from "../helpers/effects.js";


const unit = (id) =>
    initialize({
        id,
        position: [0, 0],
        definition: { hooks: [],
            id: `scope-unit-${id}`,
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            offense: { attack: 100 },
        },
    });

test("effect lifetimes: parent ending cascades across Units and shared descendants end once", () => {
    const trace = [];
    const value = definition(
        "dependent",
        {},
        {
            onEnd: (state, self) => {
                trace.push(self.data.name);
                return state;
            },
        },
    );
    let battle = effectFixtureWork(unit(0), unit(1), unit(2));
    let a;
    ({ state: battle, value: a } = install(battle, value, 0, { data: { name: "parent" } }));
    let b;
    ({ state: battle, value: b } = install(battle, value, 1, {
        data: { name: "left" },
        scopes: [lifetimeScope(effectLifetime, a)],
    }));
    let c;
    ({ state: battle, value: c } = install(battle, value, 2, {
        data: { name: "right" },
        scopes: [lifetimeScope(effectLifetime, a)],
    }));
    let d;
    ({ state: battle, value: d } = install(battle, value, 2, {
        data: { name: "shared" },
        scopes: [lifetimeScope(effectLifetime, b), lifetimeScope(effectLifetime, c)],
    }));
    battle = effect.end(battle, a, "DISPELLED");
    assert.deepEqual(new Set(trace), new Set(["parent", "left", "right", "shared"]));
    assert.equal(trace.length, 4);
    assert.equal(trace.at(-1), "parent");
    assert.ok([a, b, c, d].every((ref) => get(battle, ref) === undefined));
    battle = effect.end(battle, d);
    assert.equal(trace.length, 4);
});

test("effect lifetimes: provenance does not imply dependence on the source Unit", () => {
    let battle = effectFixtureWork(unit(0), unit(1));
    const source = unitRef(getUnit(battle, 0));
    let independent;
    ({ state: battle, value: independent } = install(battle, definition("poison"), 1, {
        source,
    }));
    let bound;
    ({ state: battle, value: bound } = install(battle, definition("aura-child"), 1, {
        source,
        scopes: [lifetimeScope(unitLifetime, { id: 0 })],
    }));
    battle = endUnit(battle, (unitRef(getUnit(battle, 0))).id, "RETREAT");
    assert.ok(get(battle, independent));
    assert.equal(get(battle, independent).source, source);
    assert.equal(get(battle, bound), undefined);
    battle = endUnit(battle, (unitRef(getUnit(battle, 1))).id, "DEATH");
    assert.equal(get(battle, independent), undefined);
});

test("effect lifetimes: a closing host rejects a new dependent before its install callback", () => {
    let attempts = 0;
    let installed;
    const child = definition(
        "new-child",
        {},
        {
            onInstall: (state) => {
                attempts++;
                return state;
            },
        },
    );
    const parent = definition(
        "parent",
        {},
        {
            onEnd(state, self) {
                const result = effect.install(state, self.host, child, {});
                installed = result.value;
                return result.state;
            },
        },
    );
    let battle = effectFixtureWork(unit(0));
    battle = install(battle, parent).state;
    endUnit(battle, (unitRef(getUnit(battle, 0))).id, "DEATH");
    assert.equal(installed, undefined);
    assert.equal(attempts, 0);
});

test("effect lifetimes: closing a host never reenables its suppressed effects", () => {
    const enabled = [];
    const weak = definition(
        "weak",
        {},
        {
            group: { id: "rule", priority: 1 },
            onEnable: (state) => {
                enabled.push("weak");
                return state;
            },
        },
    );
    const strong = definition(
        "strong",
        {},
        {
            group: { id: "rule", priority: 2 },
            onEnable: (state) => {
                enabled.push("strong");
                return state;
            },
        },
    );
    let battle = effectFixtureWork(unit(0));
    battle = install(battle, weak).state;
    battle = install(battle, strong).state;
    enabled.length = 0;

    battle = endUnit(battle, (unitRef(getUnit(battle, 0))).id, "RETREAT");

    assert.deepEqual(enabled, []);
    assert.equal(getUnit(battle, 0), undefined);
});
