import assert from "node:assert/strict";
import { test } from "node:test";
import { addCard } from "../../dist/core/battle/deployment/index.js";
import { deploy } from "../../dist/core/battle/deployment/operations.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { createDefinition as createDeployable } from "../helpers/deployable.js";
import { fixtureBattle, getUnit } from "../helpers/unit.js";

for (const slot of ["OCCUPANT", "SUPPORT"]) {
    test(`deployment uses declared ${slot} occupancy with declared occupancy`, () => {
        const definition = { hooks: [],
            id: `declared-${slot}`, occupancy: slot === "SUPPORT" ? { slot, hooks: [] } : { slot }, spatialPresence: {},
            deployable: createDeployable({ card: {}, cost: 0, redeployTicks: 0, slots: 1, buildableType: "ALL" }),

        };
        const indexedSlot = slot === "OCCUPANT" ? "occupant" : "support";
        const otherSlot = slot === "OCCUPANT" ? "support" : "occupant";
        const first = addCard(fixtureBattle(), definition);
        const second = addCard(first.state, definition);
        const request = { card: first.value, tilePosition: [0, 1] };
        const deployed = deploy(second.state, request);
        assert.equal(deployed.value.type, "DEPLOYED");
        const id = deployed.value.unitId;
        const original = getUnit(deployed.state, id);
        assert.equal(original.definition, definition);
        assert.deepEqual(original.occupancy, { tile: [0, 1], direction: null });
        assert.equal(at(deployed.state.battlefield, [0, 1])[indexedSlot].id, id);
        assert.equal(at(deployed.state.battlefield, [0, 1])[otherSlot], null);
        assert.deepEqual(deploy(deployed.state, { ...request, card: second.value }).value, {
            type: "REJECTED", reason: "OCCUPIED",
        });
    });
}
