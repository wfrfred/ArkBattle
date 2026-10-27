import { test } from "node:test";
import assert from "node:assert/strict";
import { Vec2 } from "../../dist/core/common/vector.js";

test("vector guards recognize finite pairs", () => {
    assert.equal(Vec2.is([0.25, -1.5]), true);
    assert.equal(Vec2.is([Number.MAX_VALUE, -Number.MAX_VALUE]), true);

    for (const value of [null, {}, "1,2", [], [1], [1, 2, 3], [, 2], [1, ,], [NaN, 0], [0, Infinity], ["1", 2]]) {
        assert.equal(Vec2.is(value), false);
    }
});

test("vector arithmetic returns fresh tuples without modifying operands", () => {
    const a = Object.freeze([1.5, -2]);
    const b = Object.freeze([2.5, 4]);

    assert.deepEqual(Vec2.add(a, b), [4, 2]);
    assert.deepEqual(Vec2.sub(a, b), [-1, -6]);
    assert.deepEqual(Vec2.negate(a), [-1.5, 2]);
    assert.deepEqual(Vec2.scale(a, -2), [-3, 4]);
    assert.deepEqual(Vec2.negate([0, -0]), [-0, 0]);
    assert.notEqual(Vec2.add(a, [0, 0]), a);
    assert.notEqual(Vec2.sub(a, [0, 0]), a);
    assert.notEqual(Vec2.negate(a), a);
    assert.notEqual(Vec2.scale(a, 1), a);
    assert.deepEqual(a, [1.5, -2]);
    assert.deepEqual(b, [2.5, 4]);
});

test("length and squared distance retain Euclidean semantics", () => {
    assert.equal(Vec2.length([3, 4]), 5);
    assert.equal(Vec2.length([0, 0]), 0);
    assert.equal(Vec2.length([1e200, 1e200]), Math.hypot(1e200, 1e200));
    assert.equal(Vec2.distanceSquared([1, 2], [4, 6]), 25);
    assert.equal(Vec2.distanceSquared([-2, 3], [-2, 3]), 0);
});

test("clampLength limits magnitude while retaining direction and unchanged short vectors", () => {
    const vector = Object.freeze([6, 8]);
    const limited = Vec2.clampLength(vector, 5);

    assert.deepEqual(limited, [3, 4]);
    assert.equal(Vec2.length(limited), 5);
    assert.deepEqual(vector, [6, 8]);
    assert.deepEqual(Vec2.clampLength(vector, 10), vector);
    assert.deepEqual(Vec2.clampLength(vector, 20), vector);
    assert.deepEqual(Vec2.clampLength(vector, 0), [0, 0]);
    assert.deepEqual(Vec2.clampLength([0, 0], 0), [0, 0]);
    assert.deepEqual(Vec2.clampLength([0, 0], 5), [0, 0]);
});
