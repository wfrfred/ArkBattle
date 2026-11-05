import { test } from "node:test";
import assert from "node:assert/strict";
import { sweep } from "../../dist/core/geometry/intersection.js";

const circle = (radius, offset = [0, 0]) => ({ type: "CIRCLE", radius, offset });
const box = (x, y, offset = [0, 0]) => ({ type: "BOX", halfExtents: [x, y], offset });
const near = (actual, expected) => {
    assert.notEqual(actual, null);
    assert.ok(Math.abs(actual - expected) < 1e-12);
};

test("circle and box sweeps find first contact and include tangent edges", () => {
    near(sweep(circle(0.25), [-4, 0], [4, 0], circle(0.75), [0, 0]), 3 / 8);
    near(sweep(circle(0.25), [-4, 1], [4, 1], circle(0.75), [0, 0]), 0.5);
    assert.equal(sweep(circle(0.25), [-4, 1.01], [4, 1.01], circle(0.75), [0, 0]), null);
    near(sweep(box(0.25, 0.25), [4, 0], [-4, 0], box(0.75, 0.75), [0, 0]), 3 / 8);
});

test("mixed sweeps use rounded corners and each shape's local offset", () => {
    near(sweep(circle(0.5), [-4, 1], [4, 1], box(0.5, 0.5), [0, 0]), 7 / 16);
    assert.equal(sweep(circle(0.5), [0.7, 1.1], [1.1, 0.7], box(0.5, 0.5), [0, 0]), null);
    near(sweep(circle(0.25, [0, 2]), [0, 0], [10, 0], circle(0.25, [-2, 2]), [7, 0]), 0.45);
});

test("stationary separation and endpoint contacts have defined fractions", () => {
    const shape = circle(0.5);
    assert.equal(sweep(shape, [2, 0], [2, 0], shape, [0, 0]), null);
    assert.equal(sweep(shape, [-1, 0], [-4, 0], shape, [0, 0]), 0);
    assert.equal(sweep(shape, [-4, 0], [-1, 0], shape, [0, 0]), 1);
});
