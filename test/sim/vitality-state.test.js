import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize, resolveMaxHp } from "../../dist/core/unit/capability/vitality/capability.js";
import { initializers } from "../../dist/core/unit/capability/catalog.js";

import { baseUnit, fixtureBattle, initialize as initializeUnit } from "../helpers/unit.js";

test("Vitality starts full at its effective MaxHP and preserves fractional attributes", () => {
    const battle = fixtureBattle();
    for (const [maxHp, expected] of [[0, 1], [0.5, 1], [1, 1], [100.5, 100.5]]) {
        const definition = { maxHp, defense: 20.5, resistance: 10.25 };
        const result = initialize(battle, baseUnit({ id: "vitality", hooks: Hooks.empty(), vitality: definition }));
        assert.equal(result.state, battle);
        assert.equal(result.value.vitality.hp, expected);
        assert.equal(resolveMaxHp(result.value.vitality, definition), expected);
        assert.deepEqual(result.value.vitality.defense, []);
        assert.deepEqual(result.value.vitality.resistance, []);
    }
    assert.equal(Object.hasOwn(initializers, "defense"), false);
});

test("Vitality initialization rejects invalid base attributes at the shared construction boundary", () => {
    for (const field of ["maxHp", "defense", "resistance"]) {
        for (const invalid of [-1, undefined]) {
            assert.throws(() => initializeUnit({
                id: 1,
                position: [0, 0],
                definition: { hooks: Hooks.empty(),
                    id: "invalid-vitality",
                    vitality: { maxHp: 100, defense: 0, resistance: 0, [field]: invalid },
                },
            }), new RegExp(field));
        }
    }
});
