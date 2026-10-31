import assert from "node:assert/strict";
import { test } from "node:test";
import { calculate } from "../../dist/core/battle/blocking/position.js";

function close(actual, expected) {
    for (let axis = 0; axis < 2; axis++) {
        assert.ok(Math.abs(actual[axis] - expected[axis]) < 1e-12, `${actual} != ${expected}`);
    }
}

test("blocking position separates a nearby target to 0.5 without changing a sufficient distance", () => {
    assert.deepEqual(calculate([3, 4], [3.1, 4], []), [3.5, 4]);
    assert.deepEqual(calculate([0, 0], [0.3, 0.4], []), [0.3, 0.4]);
    assert.deepEqual(calculate([3, 4], [4, 4], []), [4, 4]);
});

test("coincident and nearly coincident centers do not invent an outward direction", () => {
    assert.deepEqual(calculate([1, 2], [1, 2], [[1.5, 2]]), [1, 2]);
    assert.deepEqual(calculate([0, 0], [0.000001, 0], []), [0, 0]);
    close(calculate([0, 0], [0.00002, 0], []), [0.5, 0]);
});

test("a coincident settled target disperses clockwise while preserving the blocking radius", () => {
    const result = calculate([0, 0], [0.2, 0], [[0.5, 0]]);

    close(result, [0.4642383454426297, -0.1856953381770519]);
    assert.ok(Math.abs(Math.hypot(...result) - 0.5) < 1e-12);
    close(calculate([4, 7], [4, 7.2], [[4, 7.5]]), [4.185695338177052, 7.46423834544263]);
});

test("nearby targets do not trigger dispersion unless one lies within 0.1 of the preliminary point", () => {
    assert.deepEqual(calculate([0, 0], [0.2, 0], [[0.3, 0]]), [0.5, 0]);
    assert.deepEqual(calculate([0, 0], [0.2, 0], [[0.1, 0]]), [0.5, 0]);
    close(calculate([0, 0], [0.2, 0], [[0.5, 0]]), [0.4642383454426297, -0.1856953381770519]);
});

test("after dispersion is triggered, other targets inside 0.4 contribute weighted separation", () => {
    const result = calculate([0, 0], [0.2, 0], [[0.5, 0], [0.3, 0], [-1, 0]]);

    close(result, [0.49979748783340083, -0.014229235939485914]);
    assert.ok(Math.abs(Math.hypot(...result) - 0.5) < 1e-12);
});

test("settled positions can be consumed from a single-pass iterable", () => {
    function* previous() {
        yield [0.5, 0];
        yield [0.3, 0];
    }

    close(calculate([0, 0], [0.2, 0], previous()), [0.49979748783340083, -0.014229235939485914]);
});
