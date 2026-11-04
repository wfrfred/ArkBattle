import { test } from "node:test";
import assert from "node:assert/strict";
import { Vec2 } from "../../dist/core/common/vector.js";

test("limiting a displacement preserves its direction and bounds its Euclidean length", () => {
    const displacement = [6, 8];
    const limited = Vec2.clampLength(displacement, 5);
    assert.deepEqual(limited, [3, 4]);
    assert.equal(Vec2.length(limited), 5);
    assert.equal(Vec2.distanceSquared([1, 2], [4, 6]), 25);
    assert.deepEqual(Vec2.clampLength(displacement, 12), displacement);
    assert.deepEqual(Vec2.clampLength([0, 0], 5), [0, 0]);
    assert.deepEqual(displacement, [6, 8]);
});
