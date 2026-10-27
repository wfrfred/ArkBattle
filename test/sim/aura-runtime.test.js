import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import * as unitQueries from "../../dist/core/unit/query.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";

import { getUnit } from "../helpers/unit.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";

import { createDefinition as createDeployableDefinition } from "../helpers/deployable.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { effectFixtureWork } from "../helpers/effects.js";
import {
    attackEffect,
    auraUnit,
    effectProgram,
    auraEffect,
    seededPlacement,
    attackAt,
} from "../helpers/aura.js";

const tile = createTile({
    heightType: "LOWLAND", meleeBlockable: true,
    buildableType: "ALL",
    passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
});

function route({ start = 4, end = 7, wait = true } = {}) {
    return createRouteDefinition({
        pathMotionMode: "WALK",
        startPosition: [0, start],
        endPosition: [0, end],
        spawnOffset: [0, 0],
        spawnRandomRange: [0, 0],
        checkpoints: wait ? [{ type: "WAIT_FOR_TICKS", durationTicks: 100 }] : [],
        allowDiagonalMove: false,
        visitEveryTileCenter: false,
        visitEveryNodeCenter: false,
        visitEveryCheckPoint: true,
    });
}

function spawn({ tick = 2, start = 4, end = 7, speed = 0, wait = true } = {}) {
    return {
        definition: { hooks: [],
            spatialPresence: {},
            id: "scheduled-receiver",
            targetable: { restrictions: [] },
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            locomotion: {
                halfBodyWidth: 0, minSpeed: 0, speed: speed,
                steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
            },
            offense: Object.freeze({ attack: 100 }),
        },
        route: route({ start, end, wait }),
        tick,
        timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 },
        alwaysCheckCurrentPoint: true,
        notCountInTotal: false,
    };
}

function input(host, overrides = {}) {
    return {
        map: createMap(1, 8, tileEntries(Array(8).fill(tile))),
        initialUnits: [host, { definition: auraUnit(1).definition, position: [1, 0] }],
        schedule: { type: "TIMELINE", spawns: [spawn()] },
        predefines: [],
        initialMechanisms: [],
        maxTicks: 10,
        routeMoveMultiplier: 1,
        rngState: 17,
        ...overrides,
    };
}

test("aura runtime: a restored aura refreshes on its first tick without creating a source mechanism", () => {

    const receiver = attackEffect("initial-aura-receiver");
    const aura = auraEffect(receiver);
    const host = seededPlacement(aura);
    let runtime = initializeBattle(input(host));
    const initial = runtime;
    assert.deepEqual([...initial.mechanisms.values()], []);
    assert.equal(unitQueries.all(initial).toArray()[0].effects.values().toArray()[0].definition, aura);
    assert.deepEqual(unitQueries.all(initial).toArray()[0].effects.values().toArray()[0].data.bindings, []);
    assert.equal(attackAt(initial, 1), 100);
    assert.deepEqual(host.effects.values().toArray()[0].data.bindings, []);
    runtime = stepBattle(runtime, []);
    const after = runtime;
    assert.deepEqual(
        unitQueries.all(after).toArray()[0].effects.values().toArray()[0].data.bindings.map((binding) => binding.unitId),
        [1],
    );
    assert.equal(attackAt(after, 1), 120);
    assert.equal(unitQueries.all(after).toArray()[1].effects.nextId, 1);
    assert.equal(attackAt(initial, 1), 100);
});

test("aura runtime: predefined, deployment and spawning join before the same tick effect advance", () => {

    const starts = [];
    const receiver = attackEffect("registration-receiver", {
        onInstall: (state, self) => {
            starts.push([self.host.id, state.tick]);
            return state;
        },
    });
    const aura = auraEffect(receiver);
    const seen = [];
    const observer = {
        ...effectProgram("registration-observer"),
        onTick: (state) => {
            seen.push(
                unitQueries.all(state).map(unit => [
                    unit.id,
                    unit.effects.values().toArray().some((effect) => effect.definition === receiver),
                ]).toArray(),
            );
            return state;
        },
    };
    let hostState = effectFixtureWork(auraUnit(0));
    for (const effect of [observer, aura])
        hostState = effects.install(hostState, unitRef(getUnit(hostState, 0)), effect, { source: 0 }).state;
    const hostUnit = getUnit(hostState, 0);
    const host = {
        definition: hostUnit.definition,
        position: hostUnit.position,
        effects: hostUnit.effects,
    };
    const predefined = {
        id: 7,
        alias: "late-aura-receiver",
        initiallyPresent: false,
        creation: {
            type: "UNIT",
            definition: auraUnit(2).definition,
            position: [3, 0],
            },
    };
    const deployable = auraUnit(3, [0, 0], {
        occupancy: { slot: "OCCUPANT" }, deployable: createDeployableDefinition({ cost: 0, redeployTicks: 0, slots: 1, buildableType: "ALL" }),
    }).definition;
    let runtime = initializeBattle(input(host, {
            predefines: [predefined],
            deployment: {
                definition: { initialDp: 0, maxDp: 99, dpRecoveryTicks: null, slotLimit: null },
                cards: [{ unit: deployable }],
            },
            schedule: { type: "TIMELINE", spawns: [spawn({ tick: 0 })] },
        }));
    assert.deepEqual(starts, []);
    runtime = stepBattle(runtime, [
        { type: "APPEAR_PREDEFINED", definitionId: 7 },
        { type: "DEPLOY_UNIT", cardId: 0, tilePosition: [0, 2] },
    ]);
    assert.deepEqual(starts, [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
    ]);
    assert.deepEqual(seen, [
        [
            [0, false],
            [1, false],
            [2, false],
            [3, false],
            [4, false],
        ],
    ]);
    const after = runtime;
    const auraInstance = unitQueries.all(after).toArray()[0].effects.values().toArray().find(
        (effect) => effect.definition === aura,
    );
    assert.deepEqual(
        auraInstance.data.bindings.map((binding) => binding.unitId),
        [1, 2, 3, 4],
    );
    assert.deepEqual(
        [1, 2, 3, 4].map((id) => attackAt(after, id)),
        [120, 120, 120, 120],
    );
});

test("aura runtime: movement departure is observed at the next aura tick", () => {

    let before;
    const receiver = attackEffect("moving-receiver", {
        onEnable: (state, self) => {
            if (self.host.id === 2) {
                before = state;
            }
            return state;
        },
    });
    const aura = auraEffect(receiver, { accepts: (target) => target.position[0] <= 4.1 });
    const host = seededPlacement(aura);
    let runtime = initializeBattle(input(host, {
            schedule: { type: "TIMELINE", spawns: [spawn({ tick: 0, speed: 1, wait: false })] },
        }));
    let departed;
    for (let tick = 0; tick < 8 && departed === undefined; tick++) {
        runtime = stepBattle(runtime, []);
        const after = runtime;
        const moved = unitQueries.all(after).toArray().find((unit) => unit.id === 2);
        if (moved && moved.position[0] > 4.1) departed = after;
    }
    assert.ok(before, "receiver entered the aura before departure");
    assert.ok(departed, "receiver moved out of the aura");
    assert.equal(attackAt(before, 2), 120);
    assert.equal(attackAt(departed, 2), 120);
    assert.equal(
        unitQueries.get(departed, { id: 0 }).effects.values().toArray()[0].data.bindings.some(
            (binding) => binding.unitId === 2,
        ),
        true,
    );
    runtime = stepBattle(runtime, []);
    const refreshed = runtime;
    assert.equal(attackAt(refreshed, 2), 100);
    assert.equal(
        unitQueries.all(refreshed).toArray()[0].effects.values().toArray()[0].data.bindings.some(
            (binding) => binding.unitId === 2,
        ),
        false,
    );
    assert.equal(attackAt(departed, 2), 120);
    assert.equal(attackAt(before, 2), 120);
});

test("aura runtime: callback failure propagates the original error without publishing the tick", () => {

    const failure = new Error("aura registration failed");
    const attempts = [];
    let receiver;
    receiver = attackEffect("fallible-aura-receiver", {
        onInstall: (state, self) => {
            state = effects.update(state, effectRef(self), (current) => ({ ...current, starts: 1 }));
            if (self.host.id === 2) {
                attempts.push(effectRef(self));
                throw failure;
            }
            return state;
        },
    });
    const aura = auraEffect(receiver);
    let runtime = initializeBattle(input(seededPlacement(aura)));
    runtime = stepBattle(runtime, []);
    runtime = stepBattle(runtime, []);
    const before = runtime;
    assert.throws(
        () => (runtime = stepBattle(runtime, [])),
        (error) => error === failure,
    );
    assert.deepEqual(runtime, before);
    assert.equal(attempts.length, 1);
});

test("aura runtime: source retirement ends remote bound buffs within the same step", () => {

    const receiver = attackEffect("retired-aura-receiver");
    const aura = auraEffect(receiver);
    let runtime = initializeBattle(input(seededPlacement(aura)));
    runtime = stepBattle(runtime, []);
    const before = runtime;
    runtime = stepBattle(runtime, [{ type: "RETREAT_UNIT", unitId: 0 }]);
    const after = runtime;
    assert.equal(
        unitQueries.all(after).toArray().some((unit) => unit.id === 0),
        false,
    );
    assert.equal(attackAt(after, 1), 100);
    assert.equal(attackAt(before, 1), 120);
});
