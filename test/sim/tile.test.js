import assert from "node:assert/strict";
import { test } from "node:test";
import { create } from "../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { normal, infection, mire, deepsea, smog } from "../../dist/content/terrain/definition.js";
import * as conditions from "../../dist/content/terrain/condition.js";

const initial = (overrides = {}) => ({
    elevation: "LOWLAND", allowsBlocking: true, placement: "MELEE", passability: "ALL",
    walkCost: 1, siteCondition: conditions.normal, ...overrides,
});

const terrains = [
    normal.create({}),
    smog.create({}),
    infection.create({
        damage: 30, attackBonusRatio: -0.2, attackSpeedBonus: -5, durationTicks: 0,
    }),
    mire.create({
        stackIntervalTicks: 1, massThreshold: 3, attackSpeedPerStack: -5, moveSpeedRatioPerStack: -0.1, maxStacks: 2,
    }),
    deepsea.create({
        damage: 30, attackSpeedModifier: -5, moveSpeedMultiplier: 0.5,
    }),
];

for (const terrain of terrains) {
    test(`create pairs the ${terrain.definition.id.description} definition with its initial state`, () => {
        const definition = { terrain, initial: initial() };
        const result = create(definition);
        assert.deepEqual(result, { definition, state: definition.initial });
        assert.equal(result.definition, definition);
        assert.equal(result.state, definition.initial);
        assert.equal(result.definition.terrain.params, terrain.params);
        assert.equal(Object.isFrozen(result), false);
    });
}

test("normal is an explicit site condition and null represents no requirement", () => {
    const normalTile = create({ terrain: normal.create({}), initial: initial() });
    const unrestricted = create({ terrain: normal.create({}), initial: initial({ siteCondition: null }) });
    assert.equal(normalTile.state.siteCondition, conditions.normal);
    assert.equal(unrestricted.state.siteCondition, null);
    assert.notEqual(normalTile.state.siteCondition, unrestricted.state.siteCondition);
});

test("Tiles.replace changes only the current state and preserves the earlier version and definition", () => {
    const tile = create({ terrain: normal.create({}), initial: initial() });
    const previous = Tiles.empty().add(tile);
    const nextState = { ...tile.state, siteCondition: conditions.deepsea, placement: "NONE" };
    const next = previous.replace(0, nextState);
    assert.equal(previous.get(0), tile);
    assert.equal(previous.get(0).state, tile.definition.initial);
    assert.equal(next.get(0).definition, tile.definition);
    assert.equal(next.get(0).state, nextState);
    assert.equal(next.get(0).definition.initial.siteCondition, conditions.normal);
});

for (const [definition, params, invalidParams] of [
    [infection, terrains[2].params, {
        damage: [-1, Infinity],
        attackBonusRatio: [NaN],
        attackSpeedBonus: [-Infinity],
        durationTicks: [-1, 0.5, Number.MAX_SAFE_INTEGER + 1],
    }],
    [mire, terrains[3].params, {
        stackIntervalTicks: [0, -1, 0.5, Number.MAX_SAFE_INTEGER + 1],
        attackSpeedPerStack: [Infinity],
        moveSpeedRatioPerStack: [NaN],
        maxStacks: [0, -1, 0.5, Number.MAX_SAFE_INTEGER + 1],
    }],
    [deepsea, terrains[4].params, {
        damage: [-1, NaN, Infinity],
        attackSpeedModifier: [Infinity],
        moveSpeedMultiplier: [-1, Infinity],
    }],
]) {
    test(`terrain definitions reject invalid ${definition.id.description} numbers`, () => {
        for (const [name, values] of Object.entries(invalidParams)) {
            for (const value of values) {
                assert.throws(() => definition.create({ ...params, [name]: value }), RangeError, name);
            }
        }
    });
}
