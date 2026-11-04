import assert from "node:assert/strict";
import { test } from "node:test";
import { sort, topK } from "../../dist/core/common/collection.js";

test("sorting and TopK preserve earlier candidates when priorities are equal", () => {
    const candidates = [
        { id: "first", value: 3 },
        { id: "best", value: 1 },
        { id: "second", value: 3 },
        { id: "middle", value: 2 },
    ];
    const compare = (left, right) => left.value - right.value;

    assert.deepEqual(sort(candidates, compare).map(value => value.id),
        ["best", "middle", "first", "second"]);
    assert.deepEqual(topK(candidates, 3, compare).map(value => value.id),
        ["best", "middle", "first"]);
    assert.deepEqual(candidates.map(value => value.id), ["first", "best", "second", "middle"]);
});
