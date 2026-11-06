import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import { predefinedUnits } from "../helpers/predefined.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { damage as dealDamage, parameters } from "../helpers/vitality.js";
import { battle, unit, actionDefinition } from "../helpers/action-fixture.js";
import * as projectiles from "../../dist/core/battle/projectile.js";
import * as projectilesQuery from "../../dist/core/projectile/query.js";
import { advance } from "../../dist/core/battle/projectile.js";
import { advanceProjectiles } from "../../dist/core/battle/steps/projectiles.js";

import { getUnit } from "../helpers/unit.js";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";
import { createLegacyCombatSpec } from "../../dist/legacy/combat.js";

import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";

const candidates = battle => projectilesQuery.all(battle).map(projectilesQuery.ref);
const instances = battle => projectilesQuery.all(battle).toArray();
const damageEvents = battle => battle.events.filter(event => event.type === "DAMAGE");
const create = (battle, definition, state = {}, position = [0, 0]) =>
    projectiles.create(battle, definition, { position, state });
const tick = (battle, number) => advance({ ...battle, tick: number }, candidates(battle));

function runtime(initialUnits, maxTicks = 20) {
    return initializeBattle({ ...createLegacyCombatSpec({ rows: 1, columns: 8, operators: [], enemies: [], maxTicks, seed: 17 }),
        predefines: predefinedUnits(initialUnits.map(value => ({ definition: value.definition, position: value.position }))),
        schedule: { type: "TIMELINE", spawns: [{ definition: { hooks: Hooks.empty(), spatialPresence: {}, id: "future", vitality: { maxHp: 1, defense: 0, resistance: 0 }, locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } } },
            route: createRouteDefinition({ pathMotionMode: "WALK", startPosition: [0, 7], endPosition: [0, 1], spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [], allowDiagonalMove: false, visitEveryTileCenter: false, visitEveryNodeCenter: false, visitEveryCheckPoint: true }),
            tick: 100, timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true, notCountInTotal: false }] },
    });
}


test("Projectile creation registers before onStart and nested creation allocates independent identities", () => {
    const observed = [];
    const child = { id: "child", onStart(battle, self) {
        observed.push(["child", self.id, battle.execution.nextProjectileId]);
        assert.strictEqual(projectilesQuery.get(battle, projectilesQuery.ref(self)), self);
        return battle;
    } };
    const parent = { id: "parent", onStart(battle, self) {
        observed.push(["parent", self.id, battle.execution.nextProjectileId]);
        assert.strictEqual(projectilesQuery.get(battle, projectilesQuery.ref(self)), self);
        return create(battle, child, { child: true }).state;
    } };
    const initial = battle();
    const created = create(initial, parent, { parent: true });

    assert.deepEqual(created.value, { id: 0 });
    assert.deepEqual(observed, [["parent", 0, 1], ["child", 1, 2]]);
    assert.deepEqual(instances(created.state).map(self => self.id), [0, 1]);
    assert.equal(created.state.execution.nextProjectileId, 2);
    assert.equal(initial.execution.nextProjectileId, 0);
    assert.deepEqual(instances(initial), []);
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

    assert.deepEqual(created.value, { id: 0 });
    assert.equal(projectilesQuery.get(created.state, created.value), undefined);
    assert.deepEqual(observed, [["ENDING", "EXPLICIT"]]);
    assert.equal(created.state.execution.nextProjectileId, 1);
});


test("Projectile stop publishes ENDING before cleanup, and repeated stop is a no-op", () => {
    const observed = [];
    const definition = { id: "ending", onTick() { assert.fail("ENDING instances must not normally advance"); }, onEnd(battle, self, reason) {
        observed.push([self.lifecycle, reason]);
        assert.strictEqual(projectilesQuery.get(battle, projectilesQuery.ref(self)), self);
        assert.strictEqual(projectiles.stop(battle, projectilesQuery.ref(self), "DISPEL"), battle);
        assert.strictEqual(advance(battle, [projectilesQuery.ref(self)]), battle);
        return battle;
    } };
    const created = create(battle(), definition);
    const stopped = projectiles.stop(created.state, created.value, "SOURCE_UNAVAILABLE");

    assert.deepEqual(observed, [["ENDING", "SOURCE_UNAVAILABLE"]]);
    assert.equal(projectilesQuery.get(stopped, created.value), undefined);
    assert.strictEqual(projectiles.stop(stopped, created.value), stopped);
    assert.equal(projectilesQuery.get(created.state, created.value).lifecycle, "ACTIVE");
});

test("Stop callbacks can create children and terminate peers without losing their updates", () => {
    const observed = [];
    const child = { id: "child" };
    const parent = { id: "parent", onEnd(battle, self) {
        observed.push(self.id);
        if (self.id !== 0) return battle;
        battle = create(battle, child, { label: "survivor" }).state;
        const peer = battle.battlefield.projectiles.get(1);
        return projectiles.stop(battle, projectilesQuery.ref(peer));
    } };
    const first = create(battle(), parent);
    const initial = create(first.state, parent).state;
    const stopped = projectiles.stop(initial, first.value);

    assert.deepEqual(observed, [0, 1]);
    assert.deepEqual(projectilesQuery.all(stopped).map(self => [self.id, self.state]).toArray(), [[2, { label: "survivor" }]]);
    assert.strictEqual(instances(stopped)[0].definition, child);
    assert.equal(stopped.execution.nextProjectileId, 3);
    assert.deepEqual(instances(initial).map(self => self.id), [0, 1]);
});

test("Projectile advance fixes candidates and re-reads the latest instance and lifecycle", () => {
    const observed = [];
    let laterRef;
    let stoppedRef;
    const spawned = { id: "spawned", onTick(battle) { observed.push("spawned"); return battle; } };
    const definition = { id: "same-name", onTick(battle, self) {
        observed.push([self.id, self.state.count]);
        if (self.id !== 0) return battle;
        const currentProjectile = projectilesQuery.get(battle, laterRef);
        battle = projectiles.update(battle, laterRef, { state: { count: currentProjectile.state.count + 4 } });
        battle = projectiles.stop(battle, stoppedRef);
        return create(battle, spawned).state;
    } };
    const first = create(battle(), definition, { count: 0 });
    const later = create(first.state, definition, { count: 1 });
    const stopped = create(later.state, definition, { count: 2 });
    laterRef = later.value;
    stoppedRef = stopped.value;
    const progressed = advance(stopped.state, candidates(stopped.state));

    assert.deepEqual(observed, [[0, 0], [1, 5]]);
    assert.deepEqual(instances(progressed).map(self => self.id), [0, 1, 3]);
    assert.deepEqual(projectilesQuery.all(stopped.state).map(self => self.state.count).toArray(), [0, 1, 2]);
});

test("Projectile advance allows heterogeneous programs with equal names to keep their private state pairing", () => {
    const observed = [];
    const charges = { id: "same", onTick(battle, self) {
        observed.push(self.state.charges);
        const currentProjectile = projectilesQuery.get(battle, projectilesQuery.ref(self));
        return projectiles.update(battle, projectilesQuery.ref(self), { state: { charges: currentProjectile.state.charges - 1 } });
    } };
    const label = { id: "same", onTick(battle, self) { observed.push(self.state.label); return battle; } };
    const first = create(battle(), charges, { charges: 2 });
    const second = create(first.state, label, { label: "arrow" });
    const progressed = advance(second.state, candidates(second.state));

    assert.deepEqual(observed, [2, "arrow"]);
    assert.deepEqual(projectilesQuery.get(progressed, first.value).state, { charges: 1 });
    assert.deepEqual(projectilesQuery.get(progressed, second.value).state, { label: "arrow" });
    assert.equal(second.state.battlefield.projectiles.get(first.value.id, label), undefined);
});

test("A stationary Projectile remains ACTIVE and can continue periodic output after arrival", () => {
    const pulse = { id: "stationary-pulse", onTick(battle, self) {
        if (!self.state.arrived) {
            return projectiles.update(battle, projectilesQuery.ref(self), {
                position: [1, 0], state: { arrived: true, nextPulseTick: battle.tick + 1 },
            });
        }
        if (battle.tick < self.state.nextPulseTick) return battle;
        const currentProjectile = projectilesQuery.get(battle, projectilesQuery.ref(self));
        battle = projectiles.update(battle, projectilesQuery.ref(self), {
            state: { ...currentProjectile.state, nextPulseTick: battle.tick + 1 },
        });
        return dealDamage(battle, { source: null, target: { id: 1 }, parameters: parameters(3, "TRUE") }).state;
    } };
    const created = create(battle(unit(1)), pulse, { arrived: false, nextPulseTick: 0 });
    const arrived = tick(created.state, 1);
    const firstPulse = tick(arrived, 2);
    const secondPulse = tick(firstPulse, 3);

    assert.equal(projectilesQuery.get(secondPulse, created.value).lifecycle, "ACTIVE");
    assert.deepEqual(projectilesQuery.get(secondPulse, created.value).position, [1, 0]);
    assert.equal(getUnit(arrived, 1).vitality.hp, 100);
    assert.equal(getUnit(firstPulse, 1).vitality.hp, 97);
    assert.equal(getUnit(secondPulse, 1).vitality.hp, 94);
    assert.equal(damageEvents(secondPulse).length, 2);
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
    assert.ok(instances(initial).every(self => self.position[0] === 0));
});

test("Runtime freezes Projectile candidates before Unit callbacks, Action output and nested advances", () => {
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
    assert.deepEqual(projectilesQuery.all(rt).map(self => self.id).toArray(), [0, 1]);
    rt = stepBattle(rt, []);
    assert.deepEqual(observed.slice(2), [["unit-child", 1], ["action-child", 1]]);
    assert.deepEqual(projectilesQuery.all(rt).map(self => self.id).toArray(), [0, 1, 2]);
    rt = stepBattle(rt, []);
    assert.deepEqual(observed.slice(4), [["unit-child", 2], ["action-child", 2], ["grandchild", 2]]);
});

test("a terminal battle leaves outstanding projectiles frozen without termination callbacks", () => {
    let stops = 0;
    let advances = 0;
    const definition = { id: "frozen", onTick(battle) { advances++; return battle; }, onEnd(battle) { stops++; return battle; } };
    let rt = runtime([unit(0, { hooks: Hooks.empty().set(unitLifecycle.tick, { id: "test/tick",  invoke(battle) { return { state: create(battle, definition).state, value: undefined }; } }) })], 1);
    rt = stepBattle(rt, []);
    const snapshot = rt;

    assert.equal(snapshot.battlefield.projectiles.size, 1);
    assert.equal(advances, 0);
    assert.equal(stops, 0);
    assert.strictEqual((rt = stepBattle(rt, [])), snapshot);
});
