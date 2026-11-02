import { create as createSkill } from "../../dist/core/unit/skill/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../../dist/core/unit/initialize.js";
import { initializers } from "../../dist/core/unit/capability/catalog.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { definition as skillDefinition } from "../helpers/skill.js";
import { fixtureBattle } from "../helpers/unit.js";

import { enter as skillEntry } from "../../dist/core/unit/skill/operations.js";

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
    assert.deepEqual(unit.occupancy, { tile: null, direction: null, pair: null });

    assert.equal(unit.vitality.hp, 100);
    assert.equal(getUnit(battle, unit.id), undefined);
    assert.equal(getUnit(addUnit(battle, unit), unit.id), unit);

    const bare = initialize(battle, { id: 8, definition: { hooks: [], id: "bare" }, position: [0, 0] }).value;
    for (const key of Object.keys(initializers)) assert.equal(Object.hasOwn(bare, key), false, key);
});

test("Skill and Elemental initialize separate states from shared definitions", () => {
    const battle = fixtureBattle(37);
    const skill = skillDefinition({ initialize: battle => ({ state: battle, value: ({ count: 3 }) }) });
    const elemental = {
        maxEp: 1000, recoveryPerSecond: 0, elementResistance: 0,
        damageResistance: 0, burstRecoverySpeed: 1, bursts,
    };
    const contentEntry = { id: 'test/content-entry', stage: 'enter', invoke: state => ({ state, value: undefined }) };
    const definition = { hooks: [contentEntry], id: "clocks", skill: { initialize: current => createSkill(current, skill) }, elemental };
    const first = initialize(battle, { id: 1, definition, position: [0, 0] }).value;
    const second = initialize(battle, { id: 2, definition, position: [1, 0] }).value;
    assert.equal(first.skill.sp.lastTick, 37);
    assert.deepEqual(first.skill.state, { count: 3 });
    assert.equal(first.definition, definition);
    assert.equal(second.definition, definition);
    assert.deepEqual(first.hooks, [skillEntry, contentEntry]);
    assert.deepEqual(second.hooks, [skillEntry, contentEntry]);
    assert.deepEqual(definition.hooks, [contentEntry]);
    assert.notEqual(first.hooks, second.hooks);
    assert.notEqual(first.skill, second.skill);
    assert.notEqual(first.skill.state, second.skill.state);
    assert.notEqual(first.elemental, second.elemental);
});
