// Contract: [projectile](../../docs/architecture/projectile.md).
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, unit, actionDefinition } from "../helpers/action-fixture.js";
import * as projectiles from "../../dist/core/projectile/index.js";
import { advance } from "../../dist/core/projectile/operations.js";

import { step as stepBattle } from "../../dist/core/battle/runtime.js";
import { battle as createBattle } from "../helpers/battle.js";


const candidates = battle => projectiles.all(battle).map(projectiles.ref);
const instances = battle => projectiles.all(battle).toArray();
function create(battle, definition, state = {}) {
    const initialized = projectiles.initialize(battle, { definition, side: "NEUTRAL", position: [0, 0], state });
    return { state: projectiles.add(initialized.state, initialized.value), value: projectiles.ref(initialized.value) };
}

function runtime(initialUnits) {
    return createBattle(initialUnits.map(self => ({
        definition: self.definition, position: self.position,
    })), { rows: 1, columns: 8, rngState: 17 });
}


test("Projectile initialization reserves its identity before add publishes it and calls onEnter", () => {
    const observed = [];
    const child = { id: "child", onEnter(battle, self) {
        observed.push("child");
        assert.strictEqual(projectiles.ref(self).get(battle), self);
        return battle;
    } };
    const parent = { id: "parent", onEnter(battle, self) {
        observed.push("parent");
        assert.strictEqual(projectiles.ref(self).get(battle), self);
        return create(battle, child, { child: true }).state;
    } };
    const initial = battle();
    const initialized = projectiles.initialize(initial, {
        definition: parent, side: "ALLY", position: [0, 0], state: { parent: true },
    });
    const reference = projectiles.ref(initialized.value);
    assert.equal(reference.get(initialized.state), undefined);
    assert.deepEqual(observed, []);
    const added = projectiles.add(initialized.state, initialized.value);

    assert.deepEqual(observed, ["parent", "child"]);
    assert.deepEqual(reference.get(added).state, { parent: true });
    assert.equal(reference.get(added).side, "ALLY");
    assert.deepEqual(instances(added).map(self => self.state), [{ parent: true }, { child: true }]);
});

test("onEnter may synchronously remove its own registered instance", () => {
    const observed = [];
    const definition = {
        id: "instant",
        onEnter: (battle, self) => projectiles.remove(battle, projectiles.ref(self), "EXPLICIT"),
        onEnd(battle, self, reason) {
            observed.push([self.lifecycle, reason]);
            return battle;
        },
    };
    const created = create(battle(), definition);

    assert.equal(created.value.get(created.state), undefined);
    assert.deepEqual(observed, [["ENDING", "EXPLICIT"]]);
});


test("the Projectile step skips a candidate removed earlier in the same step", () => {
    const observed = [];
    const target = create(battle(), { id: "target", onTick(battle) {
        observed.push("target");
        return battle;
    } });
    const source = create(target.state, { id: "source", onTick(battle, self) {
        observed.push(["advance", self.id]);
        return projectiles.remove(battle, target.value, "EXPLICIT");
    } });
    const progressed = advance(source.state, [source.value, target.value]);

    assert.deepEqual(observed, [["advance", source.value.id]]);
    assert.equal(target.value.get(progressed), undefined);
});

test("Slowable projectiles compose the contributions of each source and remove them independently", () => {
    const initialized = projectiles.initialize(battle(), {
        definition: { id: "slowable", onTick(battle, self) {
            return projectiles.update(battle, projectiles.ref(self), {
                position: [self.position[0] + projectiles.resolveMoveScale(self), 0],
            });
        } },
        side: "ENEMY", position: [0, 0], state: {}, move: { contributions: [] },
    });
    const added = projectiles.add(initialized.state, initialized.value);
    const ordinary = create(added, { id: "ordinary" });
    const references = projectiles.all(ordinary.state)
        .filter(projectiles.hasSlowable).map(projectiles.ref).toArray();
    assert.deepEqual(references, [projectiles.ref(initialized.value)]);
    const [reference] = references;

    let state = projectiles.setMoveContribution(ordinary.state, reference, { id: "a", value: 0.5 });
    state = projectiles.setMoveContribution(state, reference, { id: "b", value: 0.25 });
    state = projectiles.setMoveContribution(state, reference, { id: "b", value: 0.5 });
    state = advance(state, candidates(state));
    assert.deepEqual(reference.get(state).position, [0.25, 0]);

    state = advance(projectiles.removeMoveContribution(state, reference, "a"), [reference]);
    assert.deepEqual(reference.get(state).position, [0.75, 0]);
    state = advance(projectiles.removeMoveContribution(state, reference, "b"), [reference]);
    assert.deepEqual(reference.get(state).position, [1.75, 0]);
});

test("Runtime freezes Projectile candidates before Unit callbacks and Action output", () => {
    const observed = [];
    const fromUnit = { id: "unit-child", onEnter(battle) { observed.push(["unit-create", battle.tick]); return battle; }, onTick(battle, self) {
        observed.push([self.definition.id, battle.tick]);
        return battle;
    } };
    const fromAction = { id: "action-child", onEnter(battle) { observed.push(["action-create", battle.tick]); return battle; }, onTick(battle, self) { observed.push([self.definition.id, battle.tick]); return battle; } };
    const source = unit(0, { hooks: Hooks.empty().set(unitLifecycle.tick, { id: "test/tick",  invoke(battle) {
        return { state: battle.tick === 0 ? create(battle, fromUnit).state : battle, value: undefined };
    } }), action: actionDefinition(0, { output: battle => create(battle, fromAction).state }) });
    let rt = runtime([source, unit(1)]);

    rt = stepBattle(rt, []);
    assert.deepEqual(observed, [["unit-create", 0], ["action-create", 0]]);
    rt = stepBattle(rt, []);
    assert.deepEqual(observed.slice(2), [["unit-child", 1], ["action-child", 1]]);
});
