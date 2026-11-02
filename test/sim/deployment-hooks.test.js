import { predefinedUnits } from "../helpers/predefined.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { tiles as tileEntries } from "../helpers/tiles.js";
import { normal } from "../../dist/content/terrain/definition.js";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { getUnit, initialize, replaceUnit } from "../helpers/unit.js";
import { notifyDeployed } from "../../dist/core/battle/deployment/lifecycle.js";
import { setHook, removeHook } from "../../dist/core/battle/deployment/hook.js";
import { createCardDefinition } from "../helpers/deployable.js";
import { remove } from "../../dist/core/battle/unit.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { install } from "../../dist/core/unit/effect/index.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";

const tile = createTile({
    heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
});
const map = createMap(1, 8, tileEntries(Array(8).fill(tile)));
const route = createRouteDefinition({
    pathMotionMode: "WALK", startPosition: [0, 7], endPosition: [0, 0],
    spawnOffset: [0, 0], spawnRandomRange: [0, 0],
    checkpoints: [{ type: "WAIT_FOR_TICKS", durationTicks: 1000 }],
    allowDiagonalMove: false, visitEveryTileCenter: false,
    visitEveryNodeCenter: false, visitEveryCheckPoint: true,
});
const enemy = fields => ({ hooks: [], id: "enemy", spatialPresence: {},
    vitality: { maxHp: 100, defense: 0, resistance: 0 }, locomotion: {
        halfBodyWidth: 0, speed: 0, minSpeed: 0,
        steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
    }, ...fields,
});
const spawn = (definition, tick) => ({
    tick, definition, route, alwaysCheckCurrentPoint: true, notCountInTotal: false,
    timing: { waveStartedAtTick: tick, fragmentStartedAtTick: tick },
});
const definition = (id, fields = {}) => ({ id, hooks: [],
    vitality: { maxHp: 100, defense: 0, resistance: 0 },
    occupancy: { slot: "OCCUPANT" }, deployable: { retreatRules: [] },
    card: createCardDefinition({ cost: 0, redeployTicks: 0, slots: 0 }), ...fields,
});
const unit = (id, fields = {}) => initialize({ id, definition: definition(`unit:${id}`, fields), position: [id, 0] });
const deployment = definitions => ({
    definition: { initialDp: 0, maxDp: 99, dpRecoveryTicks: null, slotLimit: null },
    cards: definitions.map(definition => ({ definition })),
});
const input = (fields = {}) => ({
    map, schedule: { type: "TIMELINE", spawns: [spawn(enemy(), 1000)] },  predefines: [],
    initialMechanisms: [], maxTicks: 30, routeMoveMultiplier: 1, rngState: 1, ...fields,
});
const deploy = (cardId, column = 0) => ({ type: "DEPLOY_UNIT", cardId, tilePosition: [0, column] });
const record = (id, invoke, accepts) => ({ id, accepts, invoke(state, deployed) {
    return { state: invoke(state, deployed), value: undefined };
} });
const fact = (self, dp = 0) => ({ unit: self, request: {
    card: { id: 0 }, tilePosition: [0, self.id], quote: { dp, stock: 1, slots: 0 }, rules: [], hooks: [],
} });

test("deployment observers are global registrations and consume the latest preceding state", () => {
    const deployed = unit(1);
    let state = createBattleState(fixtureBattlefieldState([unit(0), deployed]));
    const calls = [];
    state = setHook(state, record("first", state => {
        calls.push("first");
        const current = getUnit(state, 0);
        state = replaceUnit(state, { ...current, vitality: { ...current.vitality, hp: 70 } });
        return removeHook(state, "removed");
    }));
    state = setHook(state, record("removed", () => assert.fail("removed observer ran")));
    state = setHook(state, record("enabled-after-first", (state, event) => {
        calls.push("enabled-after-first");
        assert.equal(getUnit(state, 0).vitality.hp, 70);
        assert.equal(event.unit, deployed);
        return state;
    }, state => getUnit(state, 0).vitality.hp === 70));
    const previous = state;
    const next = notifyDeployed(state, fact(deployed));
    assert.deepEqual(calls, ["first", "enabled-after-first"]);
    assert.equal(getUnit(next, 0).vitality.hp, 70);
    assert.equal(getUnit(previous, 0).vitality.hp, 100);
    assert.equal("deployedHooks" in getUnit(next, 0).deployable, false);
});

test("new deployment observers wait for the next dispatch and same-ID replacement retains order", () => {
    const deployed = unit(0);
    let state = createBattleState(fixtureBattlefieldState([deployed]));
    const calls = [];
    const late = record("late", state => { calls.push("late"); return state; });
    state = setHook(state, record("first", state => { calls.push("first"); return setHook(state, late); }));
    state = setHook(state, record("second", () => assert.fail("obsolete observer ran")));
    state = setHook(state, record("second", state => { calls.push("second"); return state; }));
    state = notifyDeployed(state, fact(deployed));
    assert.deepEqual(calls, ["first", "second"]);
    notifyDeployed(state, fact(deployed));
    assert.deepEqual(calls, ["first", "second", "first", "second", "late"]);
});

test("nested deployment notifications use their own candidates and return state to the outer observer", () => {
    const deployed = unit(0);
    let state = createBattleState(fixtureBattlefieldState([deployed]));
    const calls = [];
    state = setHook(state, record("first", (state, event) => {
        calls.push(["first", event.request.quote.dp]);
        if (event.request.quote.dp === 0) {
            state = setHook(state, record("late", (state, nested) => { calls.push(["late", nested.request.quote.dp]); return state; }));
            state = notifyDeployed(state, fact(deployed, null));
            assert.equal(getUnit(state, 0).vitality.hp, 50);
            return state;
        }
        const current = getUnit(state, 0);
        return replaceUnit(state, { ...current, vitality: { ...current.vitality, hp: 50 } });
    }));
    const next = notifyDeployed(state, fact(deployed));
    assert.deepEqual(calls, [["first", 0], ["first", null], ["late", null]]);
    assert.equal(getUnit(next, 0).vitality.hp, 50);
    assert.equal(getUnit(state, 0).vitality.hp, 100);
});

test("the registered deployment enter runs before the incoming Unit's own enter", () => {
    const calls = [];
    const bootstrap = { id: "bootstrap", vitality: { maxHp: 100, defense: 0, resistance: 0 }, hooks: [{
        id: "register-observer", stage: "enter", invoke(state) {
            return { state: setHook(state, record("observer", (state, event) => {
                calls.push(["observed", event.unit.id]);
                assert.equal(getUnit(state, event.unit.id).vitality.hp, 100);
                return state;
            })), value: undefined };
        },
    }] };
    const incoming = definition("incoming", { hooks: [{ id: "own-enter", stage: "enter", invoke(state, self) {
        calls.push(["entered", self.id]);
        return { state: replaceUnit(state, { ...getUnit(state, self.id), vitality: { ...self.vitality, hp: 75 } }), value: undefined };
    } }] });
    let runtime = initializeBattle(input({ predefines: predefinedUnits([{ definition: bootstrap, position: [7, 0] }]), deployment: deployment([incoming, incoming]) }));
    const previous = runtime;
    runtime = stepBattle(runtime, [deploy(0)]);
    runtime = stepBattle(runtime, [deploy(1, 1)]);
    assert.deepEqual(calls, [["observed", 1], ["entered", 1], ["observed", 2], ["entered", 2]]);
    assert.equal(getUnit(runtime, 1).vitality.hp, 75);
    assert.equal(previous.battlefield.units.size, 1);
});

test("deployment is observed before an incoming Unit immediately leaves in its own enter", () => {
    const calls = [];
    const incoming = definition("immediate-exit", { hooks: [{ id: "exit", stage: "enter", invoke(state, self) {
        return { state: remove(state, self.id, "SCRIPT"), value: undefined };
    } }, { id: "left", stage: "leave", invoke(state, departure) {
        calls.push(["left", departure.unit.id]); return { state, value: undefined };
    } }] });
    let runtime = initializeBattle(input({ deployment: deployment([incoming]) }));
    runtime = setHook(runtime, record("observer", (state, event) => {
        calls.push(["deployed", event.unit.id]); return state;
    }));
    runtime = stepBattle(runtime, [deploy(0)]);
    assert.deepEqual(calls, [["deployed", 0], ["left", 0]]);
    assert.equal(runtime.battlefield.units.size, 0);
    assert.equal(runtime.events.filter(event => event.type === "UNIT_DEPLOYED").length, 1);
});

test("ordinary enemy entry does not broadcast a deployment", () => {
    let entered = 0;
    const calls = [];
    let runtime = initializeBattle(input({ schedule: { type: "TIMELINE", spawns: [spawn(enemy({ hooks: [{
        id: "enemy-enter", stage: "enter", invoke(state) { entered++; return { state, value: undefined }; },
    }] }), 0)] }, deployment: deployment([definition("incoming")]) }));
    runtime = setHook(runtime, record("observer", (state, event) => { calls.push(event.unit.id); return state; }));
    runtime = stepBattle(runtime, [deploy(0)]);
    assert.deepEqual(calls, [0]);
    assert.equal(entered, 1);
});

test("an Effect on a non-Deployable source owns and removes its deployment observer", () => {
    const calls = [];
    const effect = { id: "deployment-talent", initialize: () => ({}),
        onEnable(state, self) {
            const reference = effectRef(self);
            return setHook(state, record(`talent/${reference.host.id}/${reference.id}`, (state, event) => {
                calls.push(event.unit.id); return state;
            }));
        },
        onDisable(state, self) { return removeHook(state, `talent/${self.host.id}/${self.id}`); },
    };
    const source = { id: "source", hooks: [{ id: "install", stage: "enter", invoke(state, self) {
        return { state: install(state, unitRef(self), effect).state, value: undefined };
    } }] };
    let runtime = initializeBattle(input({ predefines: predefinedUnits([{ definition: source, position: [7, 0] }]), deployment: deployment([definition("first"), definition("second")]) }));
    const initial = runtime;
    runtime = stepBattle(runtime, [deploy(0)]);
    runtime = remove(runtime, 0, "DEATH");
    runtime = stepBattle(runtime, [deploy(1, 1)]);
    assert.deepEqual(calls, [1]);
    assert.equal(getUnit(runtime, 0), undefined);
    assert.equal(getUnit(initial, 0).effects.values().find(() => true).status, "ACTIVE");
});

test("deployment notifications preserve their original fact after an earlier observer removes the Unit", () => {
    const deployed = unit(1);
    const event = fact(deployed);
    let state = createBattleState(fixtureBattlefieldState([unit(0), deployed]));
    state = setHook(state, record("remove", (state, current) => {
        assert.equal(current, event); return remove(state, current.unit.id, "SCRIPT");
    }));
    state = setHook(state, record("observe", (state, current) => {
        assert.equal(current, event);
        assert.equal(current.unit, deployed);
        assert.equal(getUnit(state, current.unit.id), undefined);
        return state;
    }));
    const next = notifyDeployed(state, event);
    assert.equal(getUnit(next, 1), undefined);
    assert.equal(getUnit(state, 1), deployed);
});

test("a failed deployment observer does not publish its Unit, Card or listener changes", () => {
    const failure = new Error("deployment callback failed");
    let runtime = initializeBattle(input({ deployment: deployment([definition("incoming")]) }));
    runtime = setHook(runtime, record("failure", state => {
        setHook(state, record("unpublished", current => current));
        throw failure;
    }));
    const previous = runtime;
    assert.throws(() => stepBattle(runtime, [deploy(0)]), error => error === failure);
    assert.equal(previous.battlefield.units.size, 0);
    assert.equal(previous.deployment.cards[0].stock, 1);
});
