import * as unitQueries from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { damage as dealDamage, parameters } from "../helpers/vitality.js";
import { battle, unit, actionDefinition } from "../helpers/action-fixture.js";
import * as projectiles from "../../dist/core/battle/projectile.js";
import * as projectilesQuery from "../../dist/core/projectile/query.js";
import { advance } from "../../dist/core/battle/projectile.js";
import { advanceProjectiles } from "../../dist/core/battle/steps/projectiles.js";
import { remove as removeUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";
import { createLegacyCombatSpec } from "../../dist/legacy/combat.js";

import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";

const candidates = battle => projectilesQuery.all(battle).map(projectilesQuery.ref).toArray();
const instances = battle => projectilesQuery.all(battle).toArray();
const damageEvents = battle => battle.events.filter(event => event.type === "DAMAGE");
const create = (battle, definition, state = {}, position = [0, 0]) =>
    projectiles.create(battle, definition, { position, state });
const tick = (battle, number) => advance({ ...battle, tick: number }, candidates(battle));

function runtime(initialUnits, maxTicks = 20) {
    return initializeBattle({ ...createLegacyCombatSpec({ rows: 1, columns: 8, operators: [], enemies: [], maxTicks, seed: 17 }),
        initialUnits: initialUnits.map(value => ({ definition: value.definition, position: value.position })),
        schedule: { type: "TIMELINE", spawns: [{ definition: { hooks: [], spatialPresence: {}, id: "future", vitality: { maxHp: 1, defense: 0, resistance: 0 }, locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } } },
            route: createRouteDefinition({ pathMotionMode: "WALK", startPosition: [0, 7], endPosition: [0, 1], spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [], allowDiagonalMove: false, visitEveryTileCenter: false, visitEveryNodeCenter: false, visitEveryCheckPoint: true }),
            tick: 100, timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true, notCountInTotal: false }] },
    });
}

function hitOriginal(battle, reference) {
    const self = projectilesQuery.get(battle, reference);
    if (self === undefined || self.state.hit) return battle;
    const target = getUnit(battle, self.state.target);
    if (target?.lifecycle !== "PRESENT" || target.vitality.hp <= 0) return battle;
    battle = projectiles.update(battle, reference, current => ({ state: { ...current.state, hit: true } }));
    return dealDamage(battle, {
        source: self.state.source, target: { id: target.id }, parameters: parameters(self.state.power, "TRUE"),
    }).state;
}

const arrow = {
    id: "original-target-arrow",
    onAdvance(battle, self) {
        battle = projectiles.update(battle, projectilesQuery.ref(self), () => ({ position: [1, 0] }));
        battle = hitOriginal(battle, projectilesQuery.ref(self));
        return projectiles.stop(battle, projectilesQuery.ref(self), "ARRIVED");
    },
    onTerminate(battle, self, reason) {
        return reason === "DISPEL" ? battle : hitOriginal(battle, projectilesQuery.ref(self));
    },
};
const arrowState = { source: { id: 0 }, target: 1, power: 10, hit: false };

test("Projectile creation registers before onCreate and nested creation allocates independent identities", () => {
    const observed = [];
    const child = { id: "child", onCreate(battle, self) {
        observed.push(["child", self.id, battle.execution.nextProjectileId]);
        assert.strictEqual(projectilesQuery.get(battle, projectilesQuery.ref(self)), self);
        return battle;
    } };
    const parent = { id: "parent", onCreate(battle, self) {
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

test("onCreate may synchronously stop its own instance while create still returns the allocated Ref", () => {
    const observed = [];
    const definition = {
        id: "instant",
        onCreate: (battle, self) => projectiles.stop(battle, projectilesQuery.ref(self)),
        onTerminate(battle, self, reason) {
            observed.push([self.lifecycle, reason]);
            return battle;
        },
    };
    const created = create(battle(), definition);

    assert.deepEqual(created.value, { id: 0 });
    assert.equal(projectilesQuery.get(created.state, created.value), undefined);
    assert.deepEqual(observed, [["ENDING", "EXPLICIT"]]);
    assert.equal(created.state.execution.nextProjectileId, 1);
    assert.deepEqual(created.state.events.map(event => event.type), ["PROJECTILE_STOPPED"]);
});

test("Projectile creation shares caller-provided immutable state and does not initialize or copy it", () => {
    const definition = { id: "shared" };
    const payload = { history: [1, 2] };
    const initial = battle();
    const first = create(initial, definition, payload);
    const sibling = create(initial, definition, payload);
    const second = create(first.state, definition, payload);

    assert.deepEqual(first, sibling);
    assert.equal(first.value.id, 0);
    assert.equal(second.value.id, 1);
    assert.strictEqual(projectilesQuery.get(second.state, first.value).definition, definition);
    assert.strictEqual(projectilesQuery.get(second.state, first.value).state, payload);
    assert.strictEqual(projectilesQuery.get(second.state, second.value).state, payload);
    assert.equal(initial.battlefield.projectiles.size, 0);
});

test("Projectile stop publishes ENDING and its event before cleanup, and repeated stop is a no-op", () => {
    const observed = [];
    const definition = { id: "ending", onAdvance() { assert.fail("ENDING instances must not normally advance"); }, onTerminate(battle, self, reason) {
        observed.push([self.lifecycle, reason, battle.events.at(-1).type]);
        assert.strictEqual(projectilesQuery.get(battle, projectilesQuery.ref(self)), self);
        assert.strictEqual(projectiles.stop(battle, projectilesQuery.ref(self), "DISPEL"), battle);
        assert.strictEqual(advance(battle, [projectilesQuery.ref(self)]), battle);
        return battle;
    } };
    const created = create(battle(), definition);
    const stopped = projectiles.stop(created.state, created.value, "SOURCE_UNAVAILABLE");

    assert.deepEqual(observed, [["ENDING", "SOURCE_UNAVAILABLE", "PROJECTILE_STOPPED"]]);
    assert.equal(projectilesQuery.get(stopped, created.value), undefined);
    assert.strictEqual(projectiles.stop(stopped, created.value), stopped);
    assert.deepEqual(stopped.events[0], {
        type: "PROJECTILE_STOPPED", tick: 0, projectileId: 0, position: [0, 0], reason: "SOURCE_UNAVAILABLE",
    });
    assert.equal(projectilesQuery.get(created.state, created.value).lifecycle, "ACTIVE");
});

test("Stop callbacks can create children and terminate peers without losing their updates", () => {
    const observed = [];
    const child = { id: "child" };
    const parent = { id: "parent", onTerminate(battle, self) {
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
    assert.deepEqual(projectilesQuery.all(stopped).map(({ id }) => stopped.battlefield.projectiles.read(id, self => [self.id, self.state])).toArray(), [[2, { label: "survivor" }]]);
    assert.strictEqual(instances(stopped)[0].definition, child);
    assert.equal(stopped.execution.nextProjectileId, 3);
    assert.deepEqual(instances(initial).map(self => self.id), [0, 1]);
});

test("Projectile advance fixes candidates and re-reads the latest instance and lifecycle", () => {
    const observed = [];
    let laterRef;
    let stoppedRef;
    const spawned = { id: "spawned", onAdvance(battle) { observed.push("spawned"); return battle; } };
    const definition = { id: "same-name", onAdvance(battle, self) {
        observed.push([self.id, self.state.count]);
        if (self.id !== 0) return battle;
        battle = projectiles.update(battle, laterRef, current => ({ state: { count: current.state.count + 4 } }));
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
    assert.deepEqual(projectilesQuery.all(stopped.state).map(({ id }) => stopped.state.battlefield.projectiles.read(id, self => self.state.count)).toArray(), [0, 1, 2]);
});

test("Projectile advance allows heterogeneous programs with equal names to keep their private state pairing", () => {
    const observed = [];
    const charges = { id: "same", onAdvance(battle, self) {
        observed.push(self.state.charges);
        return projectiles.update(battle, projectilesQuery.ref(self), current => ({ state: { charges: current.state.charges - 1 } }));
    } };
    const label = { id: "same", onAdvance(battle, self) { observed.push(self.state.label); return battle; } };
    const first = create(battle(), charges, { charges: 2 });
    const second = create(first.state, label, { label: "arrow" });
    const progressed = advance(second.state, candidates(second.state));

    assert.deepEqual(observed, [2, "arrow"]);
    assert.deepEqual(projectilesQuery.get(progressed, first.value).state, { charges: 1 });
    assert.deepEqual(projectilesQuery.get(progressed, second.value).state, { label: "arrow" });
    assert.equal(second.state.battlefield.projectiles.get(first.value.id, label), undefined);
});

test("A stationary Projectile remains ACTIVE and can continue periodic output after arrival", () => {
    const pulse = { id: "stationary-pulse", onAdvance(battle, self) {
        if (!self.state.arrived) {
            return projectiles.update(battle, projectilesQuery.ref(self), () => ({
                position: [1, 0], state: { arrived: true, nextPulseTick: battle.tick + 1 },
            }));
        }
        if (battle.tick < self.state.nextPulseTick) return battle;
        battle = projectiles.update(battle, projectilesQuery.ref(self), current => ({
            state: { ...current.state, nextPulseTick: battle.tick + 1 },
        }));
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

test("Ordinary stop may hit the saved original target while DISPEL omits that content policy", () => {
    for (const reason of ["ARRIVED", "EXPIRED", "EXPLICIT", "DISPEL"]) {
        const created = create(battle(unit(0), unit(1, { targetable: undefined, hitbox: undefined })), arrow, arrowState);
        const stopped = projectiles.stop(created.state, created.value, reason);
        assert.equal(getUnit(stopped, 1).vitality.hp, reason === "DISPEL" ? 100 : 90);
        assert.equal(projectilesQuery.get(stopped, created.value), undefined);
        assert.equal(stopped.events.find(event => event.type === "PROJECTILE_STOPPED").reason, reason);
    }
});

test("Original-target hit progress recorded before business prevents synchronous Stop fallback from repeating it", () => {
    let reference;
    const definition = { ...arrow, id: "reentrant-hit", onAdvance(battle, self) {
        battle = projectiles.update(battle, projectilesQuery.ref(self), current => ({ state: { ...current.state, hit: true } }));
        battle = projectiles.stop(battle, reference);
        return dealDamage(battle, { source: self.state.source, target: { id: self.state.target }, parameters: parameters(self.state.power, "TRUE") }).state;
    } };
    const created = create(battle(unit(0), unit(1)), definition, arrowState);
    reference = created.value;
    const progressed = advance(created.state, candidates(created.state));

    assert.equal(getUnit(progressed, 1).vitality.hp, 90);
    assert.equal(damageEvents(progressed).length, 1);
    assert.equal(projectilesQuery.get(progressed, reference), undefined);
    assert.deepEqual(projectilesQuery.get(created.state, reference).state, arrowState);
});

test("Source departure does not terminate independent projectiles or erase sampled output", () => {
    const created = create(battle(unit(0), unit(1)), arrow, arrowState);
    const retreated = removeUnit(created.state, 0, "RETREAT");
    const progressed = advance(retreated, candidates(retreated));

    assert.equal(getUnit(progressed, 0), undefined);
    assert.equal(getUnit(progressed, 1).vitality.hp, 90);
    assert.equal(projectilesQuery.get(progressed, created.value), undefined);
    assert.equal(getUnit(created.state, 1).vitality.hp, 100);
});

test("Battle commands stop in order before survivors advance and ignore duplicate or missing IDs", () => {
    const observed = [];
    const definition = { id: "command", onAdvance(battle, self) {
        observed.push(["advance", self.id]);
        return projectiles.update(battle, projectilesQuery.ref(self), () => ({ position: [1, 0] }));
    }, onTerminate(battle, self) { observed.push(["stop", self.id]); return battle; } };
    let initial = battle();
    for (let index = 0; index < 4; index++) initial = create(initial, definition).state;
    const progressed = advanceProjectiles(initial, candidates(initial), [2, 2, 999, 0].map(projectileId => ({ type: "STOP_PROJECTILE", projectileId })));

    assert.deepEqual(observed, [["stop", 2], ["stop", 0], ["advance", 1], ["advance", 3]]);
    assert.deepEqual(progressed.events.map(event => event.projectileId), [2, 0]);
    assert.deepEqual(instances(progressed).map(self => [self.id, self.position]), [[1, [1, 0]], [3, [1, 0]]]);
    assert.ok(instances(initial).every(self => self.position[0] === 0));
});

test("Runtime freezes Projectile candidates before Unit callbacks, Action output and nested advances", () => {
    const observed = [];
    const grandchild = { id: "grandchild", onAdvance(battle, self) { observed.push([self.definition.id, battle.tick]); return battle; } };
    const fromUnit = { id: "unit-child", onCreate(battle) { observed.push(["unit-create", battle.tick]); return battle; }, onAdvance(battle, self) {
        observed.push([self.definition.id, battle.tick]);
        return self.state.spawned ? battle : create(projectiles.update(battle, projectilesQuery.ref(self), () => ({ state: { spawned: true } })), grandchild).state;
    } };
    const fromAction = { id: "action-child", onCreate(battle) { observed.push(["action-create", battle.tick]); return battle; }, onAdvance(battle, self) { observed.push([self.definition.id, battle.tick]); return battle; } };
    const source = unit(0, { hooks: [{ id: "test/tick", stage: "tick", invoke(battle) {
        return { state: battle.tick === 0 ? create(battle, fromUnit, { spawned: false }).state : battle, value: undefined };
    } }], action: actionDefinition(0, { output: battle => create(battle, fromAction).state }) });
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

test("battle execution can stop a same-Tick creation explicitly without normally advancing it", () => {
    const observed = [];
    const definition = { id: "same-step", onCreate(battle) { observed.push("create"); return battle; },
        onAdvance(battle) { observed.push("advance"); return battle; },
        onTerminate(battle, _self, reason) { observed.push(reason); return battle; } };
    let rt = runtime([unit(0, { hooks: [{ id: "test/tick", stage: "tick", invoke(battle) { return { state: create(battle, definition).state, value: undefined }; } }] })]);
    const result = (rt = stepBattle(rt, [{ type: "STOP_PROJECTILE", projectileId: 0 }]));

    assert.deepEqual(observed, ["create", "EXPLICIT"]);
    assert.deepEqual(projectilesQuery.all(rt).toArray(), []);
    assert.equal(result.events.filter(event => event.type === "PROJECTILE_STOPPED").length, 1);
});

test("a throwing termination callback leaves the caller's BattleState unchanged", () => {
    const definition = { id: "throwing", onTerminate(battle) {
        battle = dealDamage(battle, { source: null, target: { id: 1 }, parameters: parameters(9, "TRUE") }).state;
        throw new Error("termination failed");
    } };
    let rt = runtime([unit(0, { hooks: [{ id: "test/tick", stage: "tick", invoke(battle) { return { state: battle.tick === 0 ? create(battle, definition).state : battle, value: undefined }; } }] }), unit(1)]);
    rt = stepBattle(rt, []);
    const before = rt;

    assert.throws(() => (rt = stepBattle(rt, [{ type: "STOP_PROJECTILE", projectileId: 0 }])), /termination failed/);
    assert.deepEqual(rt, before);
    assert.equal(unitQueries.all(before).toArray().find(self => self.id === 1).vitality.hp, 100);
    assert.equal(projectilesQuery.all(before).toArray()[0].lifecycle, "ACTIVE");
});

test("a terminal battle leaves outstanding projectiles frozen without termination callbacks", () => {
    let stops = 0;
    let advances = 0;
    const definition = { id: "frozen", onAdvance(battle) { advances++; return battle; }, onTerminate(battle) { stops++; return battle; } };
    let rt = runtime([unit(0, { hooks: [{ id: "test/tick", stage: "tick", invoke(battle) { return { state: create(battle, definition).state, value: undefined }; } }] })], 1);
    rt = stepBattle(rt, []);
    const snapshot = rt;

    assert.equal(snapshot.battlefield.projectiles.size, 1);
    assert.equal(advances, 0);
    assert.equal(stops, 0);
    assert.strictEqual((rt = stepBattle(rt, [])), snapshot);
});

test("A throwing onCreate or onTerminate leaves the caller's immutable branch intact", () => {
    const initial = battle(unit(1));
    const throwingCreate = { id: "throw-create", onCreate(battle) {
        battle = create(battle, { id: "nested" }).state;
        throw new Error("create failed");
    } };
    assert.throws(() => create(initial, throwingCreate), /create failed/);
    assert.equal(initial.execution.nextProjectileId, 0);
    assert.deepEqual(instances(initial), []);

    const created = create(initial, { id: "throw-stop", onTerminate(battle) {
        battle = dealDamage(battle, { source: null, target: { id: 1 }, parameters: parameters(10, "TRUE") }).state;
        throw new Error("stop failed");
    } });
    assert.throws(() => projectiles.stop(created.state, created.value), /stop failed/);
    assert.equal(getUnit(created.state, 1).vitality.hp, 100);
    assert.equal(projectilesQuery.get(created.state, created.value).lifecycle, "ACTIVE");
    assert.deepEqual(created.state.events, []);
});
