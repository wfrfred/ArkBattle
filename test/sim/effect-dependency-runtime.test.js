import assert from "node:assert/strict";
import { test } from "node:test";
import { add as addUnit, remove, lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { scope, getRef } from "../../dist/core/lifetime/index.js";
import { dependents } from "../../dist/core/lifetime/dependency.js";
import { initialize, fixtureBattle } from "../helpers/unit.js";

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
