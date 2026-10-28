import assert from "node:assert/strict";
import { test } from "node:test";
import { Effects } from "../../dist/core/unit/effect/effects.js";
import { ref } from "../../dist/core/unit/effect/effect.js";

function instance(id, definition, data = definition.initialize(), host = { id: 0 }) {
    return {
        id,
        host,
        definition,
        data,
        source: null,
        scopes: [],
        enabled: true,
        status: "ACTIVE",
    };
}

test("Effect Store queries preserve old versions and replacement retains registration order", () => {
    const shield = { id: "shield", initialize: () => ({ charges: 2 }) };
    const poison = { id: "poison", initialize: () => ({ power: 10 }) };
    const first = instance(0, shield);
    const second = instance(1, poison);
    const original = Effects.empty().add(first).add(second);
    const oldKeys = original.keys();
    const oldValues = original.values();
    const consumed = { ...first, data: { charges: 1 } };
    const updated = original.replace(ref(first), consumed);
    const removed = updated.remove(0);
    const third = instance(2, shield);
    const added = removed.add(third);

    assert.equal(Effects.empty().size, 0);
    assert.deepEqual(oldKeys.toArray(), [0, 1]);
    assert.deepEqual(oldKeys.toArray(), [0, 1]);
    assert.deepEqual(oldValues.toArray(), [first, second]);
    assert.deepEqual(oldValues.toArray(), [first, second]);
    assert.deepEqual(updated.keys().toArray(), [0, 1]);
    assert.deepEqual(updated.values().toArray(), [consumed, second]);
    assert.deepEqual(added.keys().toArray(), [1, 2]);
    assert.deepEqual(added.values().toArray(), [second, third]);
    assert.equal(original.get(ref(first)).data.charges, 2);
    assert.equal(updated.get(ref(first)).data.charges, 1);
    assert.equal(removed.get(ref(first)), undefined);
    assert.equal(added.size, 2);
    assert.equal(added.nextId, 3);
});

test("Effect Store retains its missing-update no-op policy and never reuses allocated identities", () => {
    const definition = { id: "effect", initialize: () => ({ count: 1 }) };
    const first = instance(0, definition);
    const original = Effects.empty().add(first);
    const missing = instance(7, definition);
    const removed = original.remove(first.id);

    assert.strictEqual(original.replace(ref(first), first), original);
    assert.strictEqual(original.replace(ref(missing), missing), original);
    assert.strictEqual(original.remove(missing.id), original);
    assert.strictEqual(removed.remove(first.id), removed);
    assert.strictEqual(removed.replace(ref(first), first), removed);
    assert.equal(removed.nextId, 1);
    assert.throws(() => original.add(first), RangeError);
    assert.throws(() => original.add(instance(2, definition)), RangeError);
    assert.throws(() => removed.add(first), RangeError);
    assert.deepEqual(original.keys().toArray(), [0]);
    assert.deepEqual(removed.keys().toArray(), []);
    assert.equal(removed.add(instance(1, definition)).nextId, 2);
});

test("Effect Store restores precise reads only for the matching host and Definition identity", () => {
    const definition = { id: "effect", initialize: () => ({ count: 1 }) };
    const first = instance(0, definition);
    const original = Effects.empty().add(first);

    assert.strictEqual(original.get(ref(first)), first);
    assert.strictEqual(original.get(first.id, definition), first);
    assert.strictEqual(original.get(first.id).definition, definition);
    assert.equal(original.get(first.id, { ...definition }), undefined);
    assert.equal(original.get({ ...ref(first), host: { id: 1 } }), undefined);
    assert.equal(original.get(first.id).data.count, 1);
    assert.equal(original.get(9), undefined);
});
