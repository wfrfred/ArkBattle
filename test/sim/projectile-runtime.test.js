import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, unit, actionDefinition } from "../helpers/action-fixture.js";
import * as projectiles from "../../dist/core/battle/projectile.js";
import * as projectilesQuery from "../../dist/core/projectile/query.js";
import { advanceProjectiles } from "../../dist/core/battle/steps/projectiles.js";

import { step as stepBattle } from "../../dist/core/battle/runtime.js";
import { battle as createBattle } from "../helpers/battle.js";


const candidates = battle => projectilesQuery.all(battle).map(projectilesQuery.ref);
const instances = battle => projectilesQuery.all(battle).toArray();
const create = (battle, definition, state = {}, position = [0, 0]) =>
    projectiles.create(battle, definition, { position, state });

function runtime(initialUnits) {
    return createBattle(initialUnits.map(self => ({
        definition: self.definition, position: self.position,
    })), { rows: 1, columns: 8, rngState: 17 });
}


test("Projectile creation registers before onStart and nested creation allocates independent identities", () => {
    const observed = [];
    const child = { id: "child", onStart(battle, self) {
        observed.push("child");
        assert.strictEqual(projectilesQuery.get(battle, projectilesQuery.ref(self)), self);
        return battle;
    } };
    const parent = { id: "parent", onStart(battle, self) {
        observed.push("parent");
        assert.strictEqual(projectilesQuery.get(battle, projectilesQuery.ref(self)), self);
        return create(battle, child, { child: true }).state;
    } };
    const initial = battle();
    const created = create(initial, parent, { parent: true });

    assert.deepEqual(observed, ["parent", "child"]);
    assert.deepEqual(projectilesQuery.get(created.state, created.value).state, { parent: true });
    assert.deepEqual(instances(created.state).map(self => self.state), [{ parent: true }, { child: true }]);
});

test("onStart may synchronously stop its own instance while create still returns the allocated Ref", () => {
    const observed = [];
    const definition = {
        id: "instant",
        onStart: (battle, self) => projectiles.stop(battle, projectilesQuery.ref(self)),
        onEnd(battle, self, reason) {
            observed.push([self.lifecycle, reason]);
            return battle;
        },
    };
    const created = create(battle(), definition);

    assert.equal(projectilesQuery.get(created.state, created.value), undefined);
    assert.deepEqual(observed, [["ENDING", "EXPLICIT"]]);
});


test("Battle commands stop in order before survivors advance and ignore repeated stale references", () => {
    const observed = [];
    const definition = { id: "command", onTick(battle, self) {
        observed.push(["advance", self.id]);
        return projectiles.update(battle, projectilesQuery.ref(self), { position: [1, 0] });
    }, onEnd(battle, self) { observed.push(["stop", self.id]); return battle; } };
    let initial = battle();
    for (let index = 0; index < 4; index++) initial = create(initial, definition).state;
    const references = instances(initial).map(projectilesQuery.ref);
    const progressed = advanceProjectiles(initial, candidates(initial), [references[2], references[2], references[0]].map(ref => ({ type: "STOP_PROJECTILE", ref })));

    assert.deepEqual(observed, [["stop", 2], ["stop", 0], ["advance", 1], ["advance", 3]]);
    assert.deepEqual(instances(progressed).map(self => [self.id, self.position]), [[1, [1, 0]], [3, [1, 0]]]);
});

test("Runtime freezes Projectile candidates before Unit callbacks and Action output", () => {
    const observed = [];
    const grandchild = { id: "grandchild", onTick(battle, self) { observed.push([self.definition.id, battle.tick]); return battle; } };
    const fromUnit = { id: "unit-child", onStart(battle) { observed.push(["unit-create", battle.tick]); return battle; }, onTick(battle, self) {
        observed.push([self.definition.id, battle.tick]);
        return self.state.spawned ? battle : create(projectiles.update(battle, projectilesQuery.ref(self), { state: { spawned: true } }), grandchild).state;
    } };
    const fromAction = { id: "action-child", onStart(battle) { observed.push(["action-create", battle.tick]); return battle; }, onTick(battle, self) { observed.push([self.definition.id, battle.tick]); return battle; } };
    const source = unit(0, { hooks: Hooks.empty().set(unitLifecycle.tick, { id: "test/tick",  invoke(battle) {
        return { state: battle.tick === 0 ? create(battle, fromUnit, { spawned: false }).state : battle, value: undefined };
    } }), action: actionDefinition(0, { output: battle => create(battle, fromAction).state }) });
    let rt = runtime([source, unit(1)]);

    rt = stepBattle(rt, []);
    assert.deepEqual(observed, [["unit-create", 0], ["action-create", 0]]);
    rt = stepBattle(rt, []);
    assert.deepEqual(observed.slice(2), [["unit-child", 1], ["action-child", 1]]);
    rt = stepBattle(rt, []);
    assert.deepEqual(observed.slice(4), [["unit-child", 2], ["action-child", 2], ["grandchild", 2]]);
});
