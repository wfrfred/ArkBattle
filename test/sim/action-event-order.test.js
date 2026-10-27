import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, unit, actionDefinition } from "../helpers/action-fixture.js";
import { getUnit } from "../helpers/unit.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { start } from "../../dist/core/unit/action/index.js";
import { advance } from "../../dist/core/unit/action/index.js";
import { remove } from "../../dist/core/battle/unit.js";
import { at } from "../../dist/core/battlefield/occupancy.js";

test("action event order: lethal output completes platform onLeave content before action completion", () => {
    const trace = [];
    const attack = actionDefinition(10, { markerId: "damage" });
    const definition = { ...attack, onEnd(current, source, self, reason) {
        trace.push("action ended");
        return attack.onEnd?.(current, source, self, reason) ?? current;
    } };
    const source = unit(0, { action: definition });
    const support = {
        ...unit(1, {
            hp: 1,
            occupancy: { slot: "SUPPORT", hooks: [] },
            hooks: [{ id: "test/leave", stage: "leave", invoke(current, { unit }) {
                assert.equal(getUnit(current, unit.id), undefined);
                assert.equal(current.events.some(event => event.type === "DAMAGE"), true);
                assert.equal(current.events.some(event => event.type === "ACTION_FINISHED"), false);
                trace.push("platform left");
                const occupant = at(current.battlefield, unit.occupancy.tile)?.occupant;
                return { state: occupant === undefined || occupant === null ? current : remove(current, occupant.id, "SCRIPT"), value: undefined };
            } }],

        }),
        occupancy: { ...(unit(1, {
            hp: 1,
            occupancy: { slot: "SUPPORT", hooks: [] },
            hooks: [{ id: "test/leave", stage: "leave", invoke(current, { unit }) {
                assert.equal(getUnit(current, unit.id), undefined);
                assert.equal(current.events.some(event => event.type === "DAMAGE"), true);
                assert.equal(current.events.some(event => event.type === "ACTION_FINISHED"), false);
                trace.push("platform left");
                const occupant = at(current.battlefield, unit.occupancy.tile)?.occupant;
                return { state: occupant === undefined || occupant === null ? current : remove(current, occupant.id, "SCRIPT"), value: undefined };
            } }],

        })).occupancy, tile: [0, 1] },
    };
    const recipient = {
        ...unit(2, { hooks: [{ id: "test/leave", stage: "leave", invoke(current) { trace.push("occupant left"); return { state: current, value: undefined }; } }] }),
        occupancy: { ...(unit(2, { hooks: [{ id: "test/leave", stage: "leave", invoke(current) { trace.push("occupant left"); return { state: current, value: undefined }; } }] })).occupancy, tile: [0, 1] },
    };
    const state = battle(source, support, recipient);
    const result = start(state, unitRef(getUnit(state, 0)), definition);
    const completed = advance(result.state, result.value.ref);
    const types = completed.events.map((event) => event.type);
    assert.ok(types.indexOf("DAMAGE") < types.indexOf("ACTION_FINISHED"));
    assert.deepEqual(trace, ["platform left", "occupant left", "action ended"]);
    assert.deepEqual(completed.removedUnits.map(removed => removed.unitId), [1, 2]);
    assert.equal(getUnit(completed, 1), undefined);
    assert.equal(getUnit(completed, 2), undefined);
});
