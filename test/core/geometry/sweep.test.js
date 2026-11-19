// Contract: [geometry](../../../docs/architecture/geometry.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { sweep, sweepAgainstBox } from "../../../dist/core/geometry/intersection.js";

const circle = (radius, offset = [0, 0]) => ({ type: "CIRCLE", radius, offset });
const box = (x, y, offset = [0, 0]) => ({ type: "BOX", halfExtents: [x, y], offset });
const capsule = (radius, halfLength, axis, offset = [0, 0]) => ({
    type: "CAPSULE", radius, halfLength, axis, offset,
});
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

test("capsules sweep against circles and other capsules using their axes and offsets", () => {
    near(sweep(capsule(0.25, 0.75, "X", [1, 0]), [-4, 0], [4, 0], circle(0.25, [-1, 0]), [2, 0]), 11 / 32);

    const horizontal = capsule(0.25, 0.75, "X");
    const vertical = capsule(0.25, 0.5, "Y");
    near(sweep(horizontal, [-4, 1], [4, 1], vertical, [0, 0]), 13 / 32);
    near(sweep(vertical, [1.25, -4], [1.25, 4], horizontal, [0, 0]), 7 / 16);
    assert.equal(sweep(horizontal, [-4, 1.01], [4, 1.01], vertical, [0, 0]), null);
    assert.equal(sweep(horizontal, [0.25, 0.25], [4, 4], vertical, [0, 0]), 0);
});

test("degenerate capsules retain their circle, segment or point boundaries", () => {
    near(sweep(capsule(0.5, 0, "X"), [-2, 0], [-1, 0], circle(0.5), [0, 0]), 1);

    const point = capsule(0, 0, "Y", [0.25, 0]);
    const segment = capsule(0, 0.75, "X");
    assert.equal(sweep(point, [1, 0], [1, 0], segment, [0, 0]), null);
    assert.equal(sweep(point, [0.5, 0], [0.5, 0], segment, [0, 0]), 0);
    assert.equal(sweep(point, [0.5, 0], [2, 0], segment, [0, 0]), 0);
    assert.equal(sweep(point, [2, 0], [0.5, 0], segment, [0, 0]), 1);
});

test("capsule sweeps and physical tile contacts preserve rounded corners and tangent normals", () => {
    const upright = capsule(0.5, 0.5, "Y");
    const tile = box(0.5, 0.5);
    near(sweep(upright, [-4, 1.3], [4, 1.3], tile, [0, 0]), 3.1 / 8);
    near(sweep(tile, [4, 1.3], [-4, 1.3], upright, [0, 0]), 3.1 / 8);

    const contact = sweepAgainstBox(upright, [-4, 1.3], [4, 1.3], tile, [0, 0]);

    assert.ok(contact);
    near(contact.time, 3.1 / 8);
    near(contact.normal[0], -0.8);
    near(contact.normal[1], 0.6);

    const tangent = sweepAgainstBox(
        capsule(0.1, 0.1, "Y"),
        [0.4, 0],
        [0.4, 4],
        tile,
        [1, 1],
    );
    assert.ok(tangent);
    near(tangent.time, 0.1);
    assert.deepEqual(tangent.normal, [-1, 0]);
});

test("physical box sweeps return the normal of the tile face at first contact", () => {
    const contact = sweepAgainstBox(box(0.5, 0.25), [-4, 0], [4, 0], box(0.5, 0.5), [0, 0]);
    assert.deepEqual(contact, { time: 3 / 8, normal: [-1, 0] });
});
