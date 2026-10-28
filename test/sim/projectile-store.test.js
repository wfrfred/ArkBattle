import assert from "node:assert/strict";
import { test } from "node:test";
import { fixtureBattle } from "../helpers/unit.js";
import { Projectiles } from "../../dist/core/projectile/projectiles.js";
import { all, get, ref } from "../../dist/core/projectile/query.js";

const definition = (id) => ({
    id,
});

const projectile = (id, program, state = {}) => ({
    id,
    definition: program,
    lifecycle: "ACTIVE",
    position: [0, 0],
    state,
});

test("projectile queries are lazy, repeatable and bound to their collection version", () => {
    const first = projectile(3, definition("first", { count: 1 }));
    const second = projectile(1, definition("second", { label: "ready" }));
    const original = Projectiles.empty().add(first).add(second);
    const observed = [];
    const values = original.values().map(value => {
        observed.push(value.id);
        return value.position;
    });
    const keys = original.keys();
    const replacement = { ...first, position: [1, 0] };
    const changed = original.replace(ref(first), replacement).remove(second.id);

    assert.deepEqual(observed, []);
    assert.deepEqual(values.take(1).toArray(), [[0, 0]]);
    assert.deepEqual(observed, [3]);
    assert.deepEqual(values.toArray(), [[0, 0], [0, 0]]);
    assert.deepEqual(values.toArray(), [[0, 0], [0, 0]]);
    assert.deepEqual(observed, [3, 3, 1, 3, 1]);
    assert.deepEqual(keys.toArray(), [3, 1]);
    assert.deepEqual(keys.toArray(), [3, 1]);
    assert.deepEqual(changed.keys().toArray(), [3]);
    assert.deepEqual(changed.values().map(value => value.position).toArray(), [[1, 0]]);
    assert.strictEqual(original.get(first.id), first);
    assert.strictEqual(changed.get(first.id), replacement);
});

test("projectile storage preserves strict missing and duplicate contracts", () => {
    const first = projectile(0, definition("shell", { count: 1 }));
    const second = projectile(1, definition("other", {}));
    const original = Projectiles.empty().add(first).add(second);
    assert.strictEqual(original.replace(ref(first), first), original);
    assert.throws(() => original.add(first), /duplicate store key/);
    const missing = { ...first, id: 99 };
    assert.throws(() => original.replace(ref(missing), missing), /unknown store key/);
    assert.throws(() => original.remove(99), /unknown store key/);
    assert.deepEqual(original.keys().toArray(), [0, 1]);
    assert.deepEqual(original.remove(0).add(first).keys().toArray(), [1, 0]);
    assert.equal(original.size, 2);
});

test("known references and Definition identities recover the same complete projectile", () => {
    const firstDefinition = definition("charges", { charges: 2 });
    const secondDefinition = definition("label", { label: "ready" });
    const first = projectile(0, firstDefinition, { charges: 2 });
    const second = projectile(1, secondDefinition, { label: "ready" });
    const original = Projectiles.empty().add(first).add(second);
    const known = ref(first);

    assert.strictEqual(original.get(known), first);
    assert.strictEqual(original.get(first.id, firstDefinition), first);
    assert.equal(original.get(first.id, secondDefinition), undefined);
    assert.equal(original.get(first.id, definition("charges", { charges: 2 })), undefined);
    assert.equal(original.get(999), undefined);
    assert.equal(original.get(999), undefined);
    assert.deepEqual(original.get(first.id).state, { charges: 2 });
    assert.deepEqual(original.get(second.id).state, { label: "ready" });

    const battle = fixtureBattle();
    const state = { ...battle, battlefield: { ...battle.battlefield, projectiles: original } };
    assert.strictEqual(get(state, known), first);
    assert.deepEqual(all(state).map(ref).toArray(), [ref(first), ref(second)]);
});

test("projectile queries and reads retain the collection version's immutable values", () => {
    const payload = { charges: 2, nested: { value: 7 } };
    const first = projectile(0, definition("charges", payload), payload);
    const original = Projectiles.empty().add(first);
    const captured = original.values().toArray();
    const capturedState = original.get(first.id).state;
    const replacement = { ...first, state: { ...payload, charges: 1 }, position: [1, 0] };
    const changed = original.replace(ref(first), replacement);

    assert.strictEqual(captured[0], first);
    assert.strictEqual(capturedState, payload);
    assert.strictEqual(capturedState.nested, payload.nested);
    assert.deepEqual(capturedState, { charges: 2, nested: { value: 7 } });
    assert.deepEqual(changed.get(first.id).state, { charges: 1, nested: { value: 7 } });
    assert.strictEqual(changed.get(ref(replacement)), replacement);
    assert.equal(original.get(0).definition, first.definition);
});
