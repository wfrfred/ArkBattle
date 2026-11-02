import assert from "node:assert/strict";
import { test } from "node:test";
import { createRng } from "../../dist/core/common/rng.js";
import { initialize as initializeRoutedUnit } from "../../dist/core/battle/creation/routed-unit.js";
import { createInput, normalize } from "../../dist/core/battle/creation/route.js";

import { parseRouteDefinition } from "../../dist/data/arknights/route.js";
import { fixtureBattle } from "../helpers/unit.js";

const move = (column, type = "MOVE") => ({
    type,
    target: { position: [0, column], reachOffset: [0.1, -0.2] },
});
const input = (overrides = {}) => createInput({
    pathMotionMode: "WALK",
    startPosition: [0, 1],
    endPosition: [0, 8],
    spawnOffset: [0.2, -0.3],
    spawnRandomRange: [0.4, 0.5],
    checkpoints: [],
    visitEveryCheckPoint: true,
    ...overrides,
});
const rawRoute = (overrides = {}) => ({
    motionMode: "WALK",
    startPosition: { row: 0, col: 1 },
    endPosition: { row: 0, col: 5 },
    spawnOffset: { x: 0.25, y: -0.1 },
    spawnRandomRange: { x: 0.2, y: 0.3 },
    checkpoints: [{
        type: "MOVE", position: { row: 0, col: 3 }, reachOffset: { x: 0.1, y: 0.2 },
        randomizeReachOffset: false, reachDistance: 0,
    }],
    allowDiagonalMove: false,
    visitEveryTileCenter: false,
    visitEveryNodeCenter: false,
    visitEveryCheckPoint: true,
    ...overrides,
});
const timing = { waveStartedAtTick: 20, fragmentStartedAtTick: 45 };
const enemyDefinition = { hooks: [],
    spatialPresence: {},
    id: "route-spawn-test",
    vitality: { maxHp: 100, defense: 0, resistance: 0 },
    locomotion: {
        speed: 0.1,
        minSpeed: 0,
        halfBodyWidth: 0,
        steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
    },
};

test("Spawn binds wave and fragment waits while keeping relative waits relative", () => {
    const raw = input({ checkpoints: [
        { type: "WAIT_FOR_TICKS", durationTicks: 5 },
        { type: "WAIT_FOR_PLAY_TICK", targetPlayTick: 7 },
        { type: "WAIT_CURRENT_WAVE_TICKS", targetElapsedTicks: 12 },
        { type: "WAIT_CURRENT_FRAGMENT_TICKS", targetElapsedTicks: 8 },
    ] });
    const first = normalize(raw, timing, [0.25, -0.4], true);
    const second = normalize(raw, { waveStartedAtTick: 100, fragmentStartedAtTick: 120 }, [0, 0], false);

    assert.deepEqual(first.checkpoints, [
        { type: "WAIT", tick: 5 },
        { type: "WAIT_UNTIL", tick: 7 },
        { type: "WAIT_UNTIL", tick: 32 },
        { type: "WAIT_UNTIL", tick: 53 },
    ]);
    assert.deepEqual(second.checkpoints.map(checkpoint => checkpoint.tick), [5, 7, 112, 128]);
    assert.deepEqual(first.offset, [0.25, -0.4]);
    assert.equal(first.alwaysCheckCurrentPoint, true);
    assert.equal(first.requireAllCheckpoints, true);
});

test("Patrol normalization retains group loops and remaps later jump indices", () => {
    const raw = input({ checkpoints: [
        move(1),
        { type: "WAIT_FOR_TICKS", durationTicks: 3 },
        move(2, "PATROL_MOVE"),
        move(3, "PATROL_MOVE"),
        move(4),
        move(5, "PATROL_MOVE"),
        move(6, "PATROL_MOVE"),
    ] });
    const route = normalize(raw, timing, [0, 0], true);

    assert.deepEqual(route.checkpoints.map(checkpoint => checkpoint.type), [
        "MOVE", "WAIT", "MOVE", "MOVE", "GOTO", "MOVE", "MOVE", "MOVE", "GOTO",
    ]);
    assert.deepEqual(route.checkpoints[4], { type: "GOTO", index: 1 });
    assert.deepEqual(route.checkpoints[8], { type: "GOTO", index: 6 });
    assert.deepEqual(route.checkpoints[2], { type: "MOVE", position: [0, 2], offset: [0.1, -0.2] });
    const single = normalize(input({ checkpoints: [move(1, "PATROL_MOVE")] }), timing, [0, 0], true);
    assert.deepEqual(single.checkpoints.map(checkpoint => checkpoint.type), ["MOVE"]);
});

test("Route parser retains source offsets and rejects unsupported checkpoint instructions", () => {
    const raw = rawRoute();
    const route = parseRouteDefinition(raw);

    assert.deepEqual(route.spawnRandomRange, [0.2, 0.3]);
    assert.deepEqual(route.checkpoints[0], {
        type: "MOVE", target: { position: [0, 3], reachOffset: [0.1, 0.2] },
    });
    for (const type of ["MAP_OFFSET_MOVE", "WAIT_BOSSRUSH_WAVE"]) {
        assert.throws(() => parseRouteDefinition({
            ...raw, checkpoints: [{ ...raw.checkpoints[0], type }],
        }), RangeError);
    }
});

test("Route parser rejects noninteger rows and columns before creating tile positions", () => {
    const raw = rawRoute();
    for (const axis of ["row", "col"]) {
        const position = { row: 0, col: 1, [axis]: 0.5 };
        assert.throws(() => parseRouteDefinition(rawRoute({ startPosition: position })), RangeError);
        assert.throws(() => parseRouteDefinition(rawRoute({ endPosition: position })), RangeError);
        for (const type of ["MOVE", "PATROL_MOVE", "APPEAR_AT_POS"]) {
            assert.throws(() => parseRouteDefinition(rawRoute({
                checkpoints: [{ ...raw.checkpoints[0], type, position }],
            })), RangeError);
        }
    }
});

test("Enemy initialization uses one sampled offset for its Route Definition and body position", () => {
    const raw = input();
    const seed = 831;
    const rng = createRng(seed);
    const expected = [
        raw.spawnOffset[0] + (-raw.spawnRandomRange[0] + rng.next() * (2 * raw.spawnRandomRange[0])),
        raw.spawnOffset[1] + (-raw.spawnRandomRange[1] + rng.next() * (2 * raw.spawnRandomRange[1])),
    ];
    const before = fixtureBattle(9, { rngState: seed });
    const result = initializeRoutedUnit(before, {
        id: 3, definition: enemyDefinition, route: raw, timing, alwaysCheckCurrentPoint: true,
    });
    const enemy = result.value;

    assert.equal(result.state.execution.rngState, rng.state());
    assert.equal(before.execution.rngState, seed);
    assert.deepEqual(enemy.definition.route.offset, expected);
    assert.deepEqual(enemy.position, [1 + expected[0], expected[1]]);
    assert.strictEqual(enemy.route.main.definition, enemy.definition.route);
    assert.equal(enemy.route.alternative, null);
    assert.equal("route" in enemyDefinition, false);
    assert.equal(result.state.battlefield.units.has(enemy.id), false);
});
