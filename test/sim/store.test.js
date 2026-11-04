import assert from "node:assert/strict";
import { test } from "node:test";
import { Store } from "../../dist/core/common/collection/store.js";

test("store writes preserve preceding versions, query snapshots and registration order", () => {
    const initial = Store.empty().add("a", 1).add("b", 2).add("c", 3);
    const candidates = initial.values();
    const replaced = initial.replace("b", 20);
    const removed = replaced.remove("a");

    assert.deepEqual(replaced.keys().toArray(), ["a", "b", "c"]);
    assert.deepEqual(replaced.values().toArray(), [1, 20, 3]);
    assert.deepEqual(removed.values().toArray(), [20, 3]);
    assert.deepEqual(candidates.toArray(), [1, 2, 3]);
    assert.deepEqual(initial.values().toArray(), [1, 2, 3]);
});
