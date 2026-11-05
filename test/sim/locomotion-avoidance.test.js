import { test } from "node:test";
import assert from "node:assert/strict";
import { Map } from "../../dist/core/battlefield/navigation/map.js";
import { calculate } from "../../dist/core/unit/capability/locomotion/avoidance.js";
import { TICKS_PER_SECOND } from "../../dist/core/tick.js";

const tickForce = 1 / TICKS_PER_SECOND ** 2;
const map = (overrides = {}) => new Map(3, 3, Array.from({ length: 9 }, (_, index) => ({
    passable: true, cost: 1,
    departures: { UP: true, RIGHT: true, DOWN: true, LEFT: true },
    ...overrides[index],
})));
const close = (actual, expected) => {
    assert.ok(Math.abs(actual[0] - expected[0]) < 1e-12, `x: ${actual[0]} != ${expected[0]}`);
    assert.ok(Math.abs(actual[1] - expected[1]) < 1e-12, `y: ${actual[1]} != ${expected[1]}`);
};
const force = (terrain, position, input = {}) => calculate(
    terrain, input.mode ?? "WALK", position, input.halfBodyWidth ?? 0,
    input.direction ?? [0, 0], input.velocity ?? [0.1, 0], 0.1,
);

test("body width extends horizontal avoidance without acting as a circular radius", () => {
    const right = map({ 5: { passable: false } });
    close(force(right, [1.1, 1]), [0, 0]);
    close(force(right, [1.1, 1], { halfBodyWidth: 0.2 }), [-tickForce, 0]);
    close(force(map({ 7: { passable: false } }), [1, 1.1], { halfBodyWidth: 0.2 }), [0, 0]);
});

test("diagonal avoidance requires both axes and accumulates penetration before normalization", () => {
    close(force(map({ 8: { passable: false } }), [1.4, 1.2]), [0, 0]);
    const terrain = map({ 5: { passable: false }, 8: { passable: false } });
    close(force(terrain, [1.35, 1.4], { halfBodyWidth: 0.2 }), [
        -7 / Math.sqrt(58) * tickForce, -3 / Math.sqrt(58) * tickForce,
    ]);
});

test("WALK avoids high costs while FLY avoids only hard obstacles", () => {
    const costly = map({ 5: { cost: 1000 } });
    close(force(costly, [1.4, 1]), [-tickForce, 0]);
    close(force(costly, [1.4, 1], { mode: "FLY" }), [0, 0]);
    close(force(map({ 5: { passable: false } }), [1.4, 1], { mode: "FLY" }), [-tickForce, 0]);
});

test("avoidance removes the heading projection and scales the remaining force by historical speed", () => {
    const terrain = map({ 5: { passable: false } });
    close(force(terrain, [1.4, 1], { direction: [3, 3], velocity: [0, 0] }), [
        -tickForce / 4, tickForce / 4,
    ]);
    close(force(terrain, [1.4, 1], { direction: [3, 3], velocity: [0.2, 0] }), [
        -tickForce, tickForce,
    ]);
});

test("an impassable current cell recovers toward its nearest passable neighbor, including costly diagonals", () => {
    const blocked = Object.fromEntries(Array.from({ length: 9 }, (_, index) => [index, { passable: false }]));
    close(force(map({ ...blocked, 5: { passable: true }, 7: { passable: true } }), [1.2, 1]), [tickForce, 0]);
    close(force(map({ ...blocked, 8: { passable: true, cost: 1000 } }), [1, 1]), [tickForce, tickForce]);
});
