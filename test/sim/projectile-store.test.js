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

test("known references and Definition identities recover the same complete projectile", () => {
    const firstDefinition = definition("charges");
    const secondDefinition = definition("label");
    const first = projectile(0, firstDefinition, { charges: 2 });
    const second = projectile(1, secondDefinition, { label: "ready" });
    const original = Projectiles.empty().add(first).add(second);
    const known = ref(first);

    assert.strictEqual(original.get(known), first);
    assert.strictEqual(original.get(first.id, firstDefinition), first);
    assert.equal(original.get(first.id, secondDefinition), undefined);
    assert.equal(original.get(first.id, definition("charges")), undefined);
    assert.equal(original.get(999), undefined);
    assert.deepEqual(original.get(first.id).state, { charges: 2 });
    assert.deepEqual(original.get(second.id).state, { label: "ready" });

    const battle = fixtureBattle();
    const state = { ...battle, battlefield: { ...battle.battlefield, projectiles: original } };
    assert.strictEqual(get(state, known), first);
    assert.deepEqual(all(state).map(ref).toArray(), [ref(first), ref(second)]);
});
