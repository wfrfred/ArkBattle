import { remove as endUnit } from "../../dist/core/battle/unit.js";
import { scope as lifetimeScope, getRef as lifetimeRef } from "../../dist/core/lifetime/index.js";
import { lifetime as effectLifetime } from "../../dist/core/unit/effect/operations.js";
import { lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize, getUnit, replaceUnit } from "../helpers/unit.js";

import * as effects from "../../dist/core/unit/effect/index.js";
import { dependents } from "../../dist/core/lifetime/dependency.js";
import { definition, install, effectFixtureWork } from "../helpers/effects.js";
const unit = (id) => initialize({ id, position: [0, 0], definition: { hooks: [], id: `host-${id}` } });

test("scope index tracks remote dependencies and preserves captured indexes", () => {
    let battle = effectFixtureWork(unit(1), unit(2), unit(9));
    const content = definition("indexed");
    let parent;
    ({ state: battle, value: parent } = install(battle, content, 1));
    let child;
    ({ state: battle, value: child } = install(battle, content, 9, { scopes: [lifetimeScope(effectLifetime, parent)] }));
    let other;
    ({ state: battle, value: other } = install(battle, content, 2, { scopes: [lifetimeScope(effectLifetime, parent)] }));
    const captured = battle;
    assert.deepEqual(dependents(battle.lifetime.dependencies, lifetimeScope(effectLifetime, parent)).map(target => lifetimeRef(target, effectLifetime)), [other, child]);
    battle = effects.end(battle, other);
    assert.deepEqual(dependents(battle.lifetime.dependencies, lifetimeScope(effectLifetime, parent)).map(target => lifetimeRef(target, effectLifetime)), [child]);
    assert.equal(dependents(captured.lifetime.dependencies, lifetimeScope(effectLifetime, parent)).map(target => lifetimeRef(target, effectLifetime)).length, 2);
    const unrelated = battle.lifetime.dependencies;
    const currentUnit = getUnit(battle, 2);
    battle = replaceUnit(battle, { ...currentUnit, position: [1, 0] });
    assert.equal(battle.lifetime.dependencies, unrelated);
    battle = effects.end(battle, parent);
    assert.deepEqual(dependents(battle.lifetime.dependencies, lifetimeScope(effectLifetime, parent)).map(target => lifetimeRef(target, effectLifetime)), []);
    assert.deepEqual(getUnit(battle, 9).effects.values().toArray(), []);
});

test("binding rejects scope cycles while sharing independent scopes", () => {
    let battle = effectFixtureWork(unit(1), unit(2));
    const content = definition("cycle");
    let first;
    ({ state: battle, value: first } = install(battle, content, 1));
    let second;
    ({ state: battle, value: second } = install(battle, content, 2, { scopes: [lifetimeScope(effectLifetime, first)] }));
    assert.throws(() => effects.bindLifetime(battle, first, lifetimeScope(effectLifetime, second)), /cycle/);
    const bound = effects.bindLifetime(battle, second, lifetimeScope(unitLifetime, { id: 1 }));
    battle = bound.state;
    assert.equal(bound.value, true);
    assert.deepEqual(
        dependents(battle.lifetime.dependencies, lifetimeScope(unitLifetime, { id: 1 })).map(target => lifetimeRef(target, effectLifetime)),
        [first, second],
    );
    battle = endUnit(battle, ({ id: 1 }).id, "SCRIPT");
    assert.deepEqual(getUnit(battle, 1), undefined);
    assert.deepEqual(getUnit(battle, 2).effects.values().toArray(), []);
});
