import { create as createSkill } from "../../dist/core/unit/skill/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../../dist/core/unit/initialize.js";
import { initializers } from "../../dist/core/unit/capability/catalog.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { createDefinition as elementalDefinition } from "../../dist/core/unit/capability/elemental/capability.js";
import { definition as skillDefinition } from "../helpers/skill.js";
import { fixtureBattle } from "../helpers/unit.js";
import { Effects } from "../../dist/core/unit/effect/effects.js";
import { createUnitPlacementDefinition } from "../../dist/core/battle/creation/placement.js";

const bursts = Object.fromEntries(["NEURAL", "EROSION", "BURN", "NECROSIS"].map(type => [type, {
    durationTicks: 300, onStart: battle => battle,
}]));

test("Unit initialization pairs every declared capability, including empty definitions and states", () => {
    const battle = fixtureBattle();
    const definition = { hooks: [],
        id: "paired-empty-capabilities",
        vitality: { maxHp: 100, defense: 0, resistance: 0 }, targetable: { restrictions: [] }, spatialPresence: {}, occupancy: { slot: "OCCUPANT" },

    };
    const result = initialize(battle, { id: 7, definition, position: [2, 0] });
    const unit = result.value;
    assert.equal(result.state, battle);
    assert.equal(unit.definition, definition);
    assert.deepEqual(unit.targetable, { restrictions: [] });
    assert.deepEqual(unit.spatialPresence, { present: true });
    assert.deepEqual(unit.occupancy, { tile: null });

    assert.equal(unit.vitality.hp, 100);
    assert.equal(getUnit(battle, unit.id), undefined);
    assert.equal(getUnit(addUnit(battle, unit), unit.id), unit);

    const bare = initialize(battle, { id: 8, definition: { hooks: [], id: "bare" }, position: [0, 0] }).value;
    for (const key of Object.keys(initializers)) assert.equal(Object.hasOwn(bare, key), false, key);
});

test("Skill and Elemental initialize from the current battle tick and keep shared definitions", () => {
    const battle = fixtureBattle(37);
    const skill = skillDefinition({ initialize: battle => ({ state: battle, value: ({ count: 3 }) }) });
    const elemental = elementalDefinition({ maxEp: 1000, bursts });
    const definition = { hooks: [], id: "clocks", skill: { initialize: current => createSkill(current, skill) }, elemental };
    const first = initialize(battle, { id: 1, definition, position: [0, 0] }).value;
    const second = initialize(battle, { id: 2, definition, position: [1, 0] }).value;
    assert.equal(first.skill.sp.lastTick, 37);
    assert.equal(first.elemental.lastAdvancedTick, 37);
    assert.deepEqual(first.skill.data, { count: 3 });
    assert.equal(first.definition, definition);
    assert.equal(second.definition, definition);
    assert.notEqual(first.skill, second.skill);
    assert.notEqual(first.skill.data, second.skill.data);
    assert.notEqual(first.elemental, second.elemental);
});

test("Unit initialization threads each capability result through the next initializer", () => {
    const originalVitality = initializers.vitality;
    const originalOffense = initializers.offense;
    const battle = fixtureBattle(5, { rngState: 17 });
    const trace = [];
    try {
        initializers.vitality = (current, definition) => {
            trace.push(["vitality", current.execution.rngState, definition.maxHp]);
            const result = originalVitality(current, definition);
            return { ...result, state: { ...result.state, execution: { ...result.state.execution, rngState: 23 } } };
        };
        initializers.offense = (current, definition) => {
            trace.push(["offense", current.execution.rngState, definition.attack]);
            const result = originalOffense(current, definition);
            return { ...result, state: { ...result.state, execution: { ...result.state.execution, rngState: 29 } } };
        };
        const result = initialize(battle, { id: 1, definition: { hooks: [], id: "threaded", vitality: { maxHp: 100, defense: 0, resistance: 0 }, offense: { attack: 7 } }, position: [0, 0],
        });
        assert.deepEqual(trace, [["vitality", 17, 100], ["offense", 23, 7]]);
        assert.equal(result.state.execution.rngState, 29);
        assert.equal(battle.execution.rngState, 17);
        assert.equal(result.value.vitality.hp, 100);
        assert.deepEqual(result.value.offense, { attack: [] });
    } finally {
        initializers.vitality = originalVitality;
        initializers.offense = originalOffense;
    }
});

test("generic Unit initialization cannot inject prepared states or override the battle clock", () => {
    const battle = fixtureBattle(19);
    const definition = { hooks: [], id: "no-prepared-state", vitality: { maxHp: 100, defense: 0, resistance: 0 }, elemental: elementalDefinition({ maxEp: 1000, bursts }) };
    const effects = Effects.empty().add({
        id: 0, host: { id: 1 }, definition: { id: "unsupported-preload", initialize: () => ({}) },
        data: {}, source: null, scopes: [], enabled: true, status: "ACTIVE",
    });
    const result = initialize(battle, {         id: 1, definition, position: [0, 0], tick: 900,
        effects,
        states: { vitality: { hp: 1 }, occupancy: { tile: [0, 0] } },
    });
    assert.equal(result.value.vitality.hp, 100);
    assert.equal(result.value.elemental.lastAdvancedTick, 19);
    assert.equal(Object.hasOwn(result.value, "occupancy"), false);
    assert.equal(result.value.effects.size, 0);
    const placement = createUnitPlacementDefinition({ definition, position: [0, 0], effects });
    assert.equal(Object.hasOwn(placement, "effects"), false);
    assert.equal(result.state, battle);
});
