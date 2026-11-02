import assert from "node:assert/strict";
import { test } from "node:test";
import { add, update } from "../../dist/core/battle/unit.js";
import { initialize as initializeUnit } from "../../dist/core/unit/initialize.js";
import { directionalRange } from "../../dist/core/battle/targeting/index.js";
import { ref } from "../../dist/core/unit/index.js";
import { hasDirection, setDirection } from "../../dist/core/unit/capability/occupancy/index.js";

import { fixtureBattle } from "../helpers/unit.js";


test("creation inputs set only declared capability facts without changing the shared definition", () => {
    const definition = {
        id: "oriented",
        hooks: [],
        occupancy: { slot: "OCCUPANT" },
    };
    const first = initializeUnit(fixtureBattle(), {
        id: 0, definition,
        position: [0, 0],
        initial: { occupancy: { tile: [0, 0], direction: "UP" } },
    });
    const second = initializeUnit(first.state, { id: 1, definition, position: [1, 0], initial: { occupancy: { direction: "RIGHT" } } });
    assert.equal(first.value.definition, definition);
    assert.equal(second.value.definition, definition);
    assert.deepEqual(first.value.occupancy, { tile: [0, 0], direction: "UP", pair: null });
    assert.deepEqual(second.value.occupancy, { tile: null, direction: "RIGHT", pair: null });
    const device = initializeUnit(second.state, {
        id: 2, definition: { id: "unoriented-device", hooks: [], occupancy: { slot: "OCCUPANT" } }, position: [2, 0],
    }).value;
    assert.equal(hasDirection(device), false);
    assert.equal(device.occupancy.direction, null);
});

test("directional targeting reads the current instance direction", () => {
    const initialized = initializeUnit(fixtureBattle(), {
        id: 0, definition: { id: "attacker", hooks: [], occupancy: { slot: "OCCUPANT" } },
        position: [0, 0], initial: { occupancy: { direction: "RIGHT" } },
    });
    const source = initialized.value;
    let battle = add(initialized.state, source);
    const target = initializeUnit(battle, {
        id: 1, definition: {
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
});
