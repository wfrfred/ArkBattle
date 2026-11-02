import assert from "node:assert/strict";
import { test } from "node:test";
import { Store } from "../../dist/core/common/collection/store.js";

test("store updates preserve preceding versions and reject duplicate or missing entries", () => {
    const empty = Store.empty();
    const first = empty.add("first", 1);
    const added = first.add("second", 2);
    const replaced = added.replace("first", 3);
    const removed = replaced.remove("second");

    assert.equal(empty.size, 0);
    assert.equal(empty.get("first"), undefined);
    assert.deepEqual(empty.keys().toArray(), []);
    assert.deepEqual(empty.values().toArray(), []);
    assert.deepEqual(first.values().toArray(), [1]);
    assert.deepEqual(added.values().toArray(), [1, 2]);
    assert.deepEqual(replaced.values().toArray(), [3, 2]);
    assert.deepEqual(removed.values().toArray(), [3]);
    assert.equal(added.size, 2);
    assert.equal(removed.size, 1);
    assert.equal(added.get("first"), 1);
    assert.equal(replaced.get("first"), 3);
    assert.equal(removed.get("second"), undefined);

    assert.throws(() => added.add("first", 99), RangeError);
    assert.throws(() => added.replace("missing", 99), RangeError);
    assert.throws(() => added.remove("missing"), RangeError);
    assert.deepEqual(added.keys().toArray(), ["first", "second"]);
    assert.deepEqual(added.values().toArray(), [1, 2]);
    assert.equal(added.size, 2);
});

test("replacement retains registration order while removal and readdition append at the end", () => {
    const original = Store.empty().add("a", 1).add("b", 2).add("c", 3);
    const replaced = original.replace("b", 20);
    const readded = replaced.remove("b").add("b", 200);

    assert.deepEqual(replaced.keys().toArray(), ["a", "b", "c"]);
    assert.deepEqual(replaced.values().toArray(), [1, 20, 3]);
    assert.deepEqual(readded.keys().toArray(), ["a", "c", "b"]);
    assert.deepEqual(readded.values().toArray(), [1, 3, 200]);
    assert.deepEqual(original.values().toArray(), [1, 2, 3]);
});

test("key and value queries remain bound to their old version and evaluate lazily on every traversal", () => {
    const original = Store.empty().add("first", 1).add("second", 2);
    const observed = [];
    const keys = original.keys();
    const values = original.values().map(value => {
        observed.push(value);
        return value * 10;
    });
    const changed = original.replace("first", 100).remove("second").add("third", 3);

    assert.deepEqual(observed, []);
    assert.deepEqual(values.take(1).toArray(), [10]);
    assert.deepEqual(observed, [1]);
    assert.deepEqual(values.toArray(), [10, 20]);
    assert.deepEqual(values.toArray(), [10, 20]);
    assert.deepEqual(observed, [1, 1, 2, 1, 2]);
    assert.deepEqual(keys.toArray(), ["first", "second"]);
    assert.deepEqual(keys.toArray(), ["first", "second"]);
    assert.deepEqual(changed.keys().toArray(), ["first", "third"]);
    assert.deepEqual(changed.values().toArray(), [100, 3]);
});


test("object keys are identified by reference rather than their contents", () => {
    const left = { id: 1 };
    const right = { id: 1 };
    const original = Store.empty().add(left, "left").add(right, "right");

    assert.equal(original.size, 2);
    assert.equal(original.get(left), "left");
    assert.equal(original.get(right), "right");
    assert.equal(original.get({ id: 1 }), undefined);
    assert.throws(() => original.add(left, "duplicate"), RangeError);

    const replaced = original.replace(left, "changed");
    const remaining = replaced.remove(right);

    assert.equal(replaced.get(left), "changed");
    assert.equal(replaced.get(right), "right");
    assert.strictEqual(replaced.keys().toArray()[0], left);
    assert.strictEqual(replaced.keys().toArray()[1], right);
    assert.equal(remaining.size, 1);
    assert.equal(remaining.get(right), undefined);
    assert.equal(original.get(left), "left");
});
