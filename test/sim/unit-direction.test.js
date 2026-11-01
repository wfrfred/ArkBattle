import assert from "node:assert/strict";
import { test } from "node:test";
import { add, update } from "../../dist/core/battle/unit.js";
import { instantiateUnitPlacement } from "../../dist/core/battle/creation/placement.js";
import { directionalRange } from "../../dist/core/battle/targeting/index.js";
import { ref } from "../../dist/core/unit/index.js";
import { hasDirection, setDirection } from "../../dist/core/unit/capability/occupancy/index.js";
import { create as createSkill } from "../../dist/core/unit/skill/index.js";
import { fixtureBattle, getUnit } from "../helpers/unit.js";
import { definition as skillDefinition } from "../helpers/skill.js";

test("creation inputs set only declared capability facts without changing the shared definition", () => {
    const definition = {
        id: "oriented",
        hooks: [],
        occupancy: { slot: "OCCUPANT", direction: "RIGHT" },
    };
    const first = instantiateUnitPlacement(fixtureBattle(), {
        definition,
        position: [0, 0],
        initial: { occupancy: { tile: [0, 0], direction: "UP" } },
    });
    const second = instantiateUnitPlacement(first.state, { definition, position: [1, 0] });
    assert.equal(first.value.definition, definition);
    assert.equal(second.value.definition, definition);
    assert.deepEqual(first.value.occupancy, { tile: [0, 0], direction: "UP" });
    assert.deepEqual(second.value.occupancy, { tile: null, direction: "RIGHT" });
    assert.equal(definition.occupancy.direction, "RIGHT");
    const device = instantiateUnitPlacement(second.state, {
        definition: { id: "unoriented-device", hooks: [], occupancy: { slot: "OCCUPANT" } }, position: [2, 0],
    }).value;
    assert.equal(hasDirection(device), false);
    assert.equal(Object.hasOwn(device, "direction"), false);
    assert.equal(device.occupancy.direction, null);
});

test("directional targeting reads the current instance direction", () => {
    const initialized = instantiateUnitPlacement(fixtureBattle(), {
        definition: { id: "attacker", hooks: [], occupancy: { slot: "OCCUPANT", direction: "RIGHT" } },
        position: [0, 0],
    });
    const source = initialized.value;
    let battle = add(initialized.state, source);
    const target = instantiateUnitPlacement(battle, {
        definition: {
            id: "target", hooks: [],
            hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 } },
        },
        position: [1, 0],
    }).value;
    const filter = directionalRange([[0, 1]]);
    const request = { source: ref(source), purposes: ["DAMAGE"], filter, selector: () => [] };
    assert.equal(filter(battle, request, target), true);
    battle = update(battle, [setDirection(ref(source), "UP")]);
    assert.equal(filter(battle, request, target), false);
    assert.equal(filter(battle, request, { ...target, position: [0, 1] }), true);
    assert.equal(getUnit(battle, source.id).definition.occupancy.direction, "RIGHT");
});

test("explicit creation hooks keep registration order through capability initialization", () => {
    const trace = [];
    const before = { id: "given", stage: "enter", invoke(battle) {
        trace.push("given"); return { state: battle, value: undefined };
    } };
    const content = { id: "content", stage: "enter", invoke(battle) {
        trace.push("content"); return { state: battle, value: undefined };
    } };
    const skill = skillDefinition({ onEnter(battle) { trace.push("skill"); return battle; } });
    const definition = {
        id: "hook-order", hooks: [content],
        skill: { initialize: battle => createSkill(battle, skill) },
    };
    const initialized = instantiateUnitPlacement(fixtureBattle(), {
        definition, position: [0, 0], hooks: [before],
    });
    add(initialized.state, initialized.value);
    assert.deepEqual(trace, ["given", "skill", "content"]);
    assert.deepEqual(definition.hooks, [content]);
});
