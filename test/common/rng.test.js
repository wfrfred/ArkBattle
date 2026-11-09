import assert from "node:assert/strict";
import { test } from "node:test";
import { createRng } from "../../dist/core/common/rng.js";

test("sampling iterables is deterministic and draws without replacement only when a sample is requested", () => {
    const items = ["A", "B", "C", "D"];
    const rng = createRng(37);
    const first = rng.sample(items.values(), 2);
    const replay = createRng(37);

    assert.deepEqual(replay.sample(items.values(), 2), first);
    assert.equal(replay.state(), rng.state());
    assert.equal(first.length, 2);
    assert.equal(new Set(first).size, 2);
    assert.ok(first.every(value => items.includes(value)));
    assert.notEqual(rng.state(), 37);
    const afterDraw = rng.state();
    assert.deepEqual(rng.sample(items.values(), 0), []);
    assert.deepEqual(rng.sample([], 2), []);
    assert.equal(rng.state(), afterDraw);
    assert.deepEqual(new Set(rng.sample(items.values(), 10)), new Set(items));
});
