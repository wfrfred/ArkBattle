import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";

test("Unit construction pairs declared capabilities and installs initial effects after registration", () => {
    const entryEffect = { id: "entry-effect", initialize: () => ({ charges: 2 }) };
    const entries = [];
    const definition = {
        id: "allied-unit",
        allegiance: { side: "ALLY" },
        hooks: [
            {
                id: "install-entry-effect",
                stage: "enter",
                invoke(state, self) {
                    assert.ok(units.get(state, units.ref(self)));
                    assert.equal(self.effects.size, 0);
                    entries.push(self.id);
                    return {
                        state: effects.install(state, units.ref(self), entryEffect).state,
                        value: undefined,
                    };
                },
            },
        ],
    };
    const empty = battle();
    assert.throws(
        () =>
            units.initialize(empty, {
                id: 0,
                position: [0, 0],
                definition: {
                    id: "conflicting-roles",
                    hooks: [],
                    blocker: { capacity: 1, layer: "GROUND", rules: [] },
                    blockable: { volume: 1 },
                },
            }),
        TypeError,
    );
    const constructed = units.initialize(empty, {
        id: 0,
        definition,
        position: [0, 0],
    }).value;

    assert.equal(constructed.allegiance.side, "ALLY");
    assert.equal(constructed.effects.size, 0);
    assert.equal(Object.hasOwn(constructed, "action"), false);
    assert.equal(units.get(empty, units.ref(constructed)), undefined);
    assert.deepEqual(entries, []);

    const state = battle([
        { definition, position: [0, 0] },
        { definition: { id: "plain-unit", hooks: [] }, position: [1, 0] },
    ]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    assert.deepEqual(entries, [0]);
    assert.equal(
        current.effects.values().find((effect) => effect.definition === entryEffect).data.charges,
        2,
    );
    assert.equal(
        units.all(state).find((unit) => unit.definition.id === "plain-unit").effects.size,
        0,
    );
    assert.equal(constructed.effects.size, 0);
});
