import { ref as unitRef } from "../../dist/core/unit/query.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import { resolveDefense } from "../../dist/core/unit/capability/vitality/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
    initialize,
    resolveMaxHp,
    setMaxHpContribution,
    removeMaxHpContribution,
    setDefenseContribution,
    setResistanceContribution,
} from "../../dist/core/unit/capability/vitality/capability.js";
import { initializers } from "../../dist/core/unit/capability/catalog.js";
import { create } from "../../dist/core/unit/contribution/attribute.js";
import { getUnit, fixtureBattle, initialize as initializeUnit, replaceUnit } from "../helpers/unit.js";

import { effectFixtureWork } from "../helpers/effects.js";

test("Vitality starts full at its effective MaxHP and preserves fractional attributes", () => {
    const battle = fixtureBattle();
    for (const [maxHp, expected] of [[0, 1], [0.5, 1], [1, 1], [100.5, 100.5]]) {
        const definition = { maxHp, defense: 20.5, resistance: 10.25 };
        const result = initialize(battle, definition);
        assert.equal(result.state, battle);
        assert.equal(result.value.hp, expected);
        assert.equal(resolveMaxHp(result.value, definition), expected);
        assert.deepEqual(result.value.defense, []);
        assert.deepEqual(result.value.resistance, []);
    }
    assert.equal(Object.hasOwn(initializers, "defense"), false);
});

test("Vitality initialization rejects invalid base attributes at the shared construction boundary", () => {
    for (const field of ["maxHp", "defense", "resistance"]) {
        for (const invalid of [-1, NaN, Infinity, -Infinity, undefined]) {
            assert.throws(() => initializeUnit({
                id: 1,
                position: [0, 0],
                definition: { hooks: [],
                    id: "invalid-vitality",
                    vitality: { maxHp: 100, defense: 0, resistance: 0, [field]: invalid },
                },
            }), new RegExp(field));
        }
    }
});

test("MaxHP transitions preserve fractional HP ratios and the effective minimum", () => {
    const battle = fixtureBattle();
    const definition = { maxHp: 100.5, defense: 0, resistance: 0 };
    const unit = initializeUnit({ id: 1, position: [0, 0],
        definition: { id: "fractional-max-hp", vitality: definition },
        states: { vitality: { ...initialize(battle, definition).value, hp: 25.125 } },
    });
    const initialBattle = effectFixtureWork(unit);
    const initial = unit.vitality;
    const increasedBattle = applyUnitChanges(initialBattle, [setMaxHpContribution(unitRef(unit), {
        id: "equipment", value: [create({ finalAddition: 100.5 })],
    })]);
    const increased = getUnit(increasedBattle, unit.id).vitality;
    assert.equal(increased.hp, 50.25);
    assert.equal(resolveMaxHp(increased, definition), 201);
    const restoredBattle = applyUnitChanges(increasedBattle, [removeMaxHpContribution(unitRef(unit), "equipment")]);
    const restored = getUnit(restoredBattle, unit.id).vitality;
    assert.equal(restored.hp, 25.125);
    assert.equal(resolveMaxHp(restored, definition), 100.5);
    assert.equal(initial.hp, 25.125);
    assert.equal(increased.hp, 50.25);

    const floorDefinition = { maxHp: 0.5, defense: 0, resistance: 0 };
    const floorUnit = initializeUnit({ id: 2, position: [0, 0],
        definition: { id: "floor-max-hp", vitality: floorDefinition },
        states: { vitality: { ...initialize(battle, floorDefinition).value, hp: 0.25 } },
    });
    const reducedBattle = applyUnitChanges(effectFixtureWork(floorUnit), [setMaxHpContribution(unitRef(floorUnit), {
        id: "penalty", value: [create({ finalAddition: -10 })],
    })]);
    const reduced = getUnit(reducedBattle, floorUnit.id).vitality;
    assert.equal(resolveMaxHp(reduced, floorDefinition), 1);
    assert.equal(reduced.hp, 0.25);
});

test("dynamic DEF and RES contributions use current Unit and battlefield facts without changing snapshots", () => {
    const target = initializeUnit({
        id: 1,
        position: [0, 0],
        definition: { hooks: [], id: "target", vitality: { maxHp: 100, defense: 20.5, resistance: 10.25 } },
    });
    const source = initializeUnit({
        id: 2,
        position: [1, 0],
        definition: { hooks: [], id: "source", vitality: { maxHp: 100, defense: 0, resistance: 0 } },
    });
    const initial = applyUnitChanges(effectFixtureWork(target, source), [
        setDefenseContribution(unitRef(target), {
            id: "conditional-defense",
            value: (_battle, self) => [create({ finalAddition: self.vitality.hp < 50 ? -100 : 5.25 })],
        }),
        setResistanceContribution(unitRef(target), {
            id: "source-resistance",
            value: battle => [create({ finalAddition: getUnit(battle, 2).vitality.hp })],
        }),
    ]);
    const modified = getUnit(initial, target.id);
    const currentUnit = getUnit(initial, 1);
    const currentBattle = replaceUnit(initial, {
        ...currentUnit, vitality: { ...currentUnit.vitality, hp: 25 },
    });
    const currentUnit2 = getUnit(currentBattle, 2);
    const current = replaceUnit(currentBattle, { ...currentUnit2, vitality: { ...currentUnit2.vitality, hp: 20.5 } });
    const resolve = battle => {
        const unit = getUnit(battle, 1);
        return resolveDefense(battle, unitRef(unit));
    };
    assert.deepEqual(resolve(initial), { defense: 25.75, resistance: 100 });
    assert.deepEqual(resolve(current), { defense: 0, resistance: 30.75 });
    assert.deepEqual(resolve(initial), { defense: 25.75, resistance: 100 });
    assert.equal(getUnit(current, 1).vitality.defense, modified.vitality.defense);
    assert.equal(target.vitality.defense.length, 0);
});
