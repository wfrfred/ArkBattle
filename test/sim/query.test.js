import assert from "node:assert/strict";
import { test } from "node:test";
import { create } from "../../dist/core/common/query.js";

test("queries preserve source order and repeat with independent cursors", () => {
    const visits = [];
    const query = create(() => [3, 1, 2][Symbol.iterator]());
    const selected = query.filter(value => {
        visits.push(value);
        return value > 1;
    }).map(value => value * 10);

    assert.deepEqual(visits, []);
    assert.deepEqual(selected.toArray(), [30, 20]);
    assert.deepEqual(selected.toArray(), [30, 20]);
    assert.deepEqual(visits, [3, 1, 2, 3, 1, 2]);

    const first = query[Symbol.iterator]();
    const second = query[Symbol.iterator]();
    assert.equal(first.next().value, 3);
    assert.equal(first.next().value, 1);
    assert.equal(second.next().value, 3);
});

test("nested queries preserve order and stop reading when their consumer finishes", () => {
    const visits = [];
    const query = create(function* () {
        try {
            for (const value of [1, 2, 3]) {
                visits.push(value);
                yield value;
            }
        } finally {
            visits.push("closed");
        }
    });
    const selected = query.flatMap(value => [value, -value]);

    assert.deepEqual(selected.take(3).toArray(), [1, -1, 2]);
    assert.deepEqual(visits, [1, 2, "closed"]);
    assert.deepEqual(selected.toArray(), [1, -1, 2, -2, 3, -3]);
});
