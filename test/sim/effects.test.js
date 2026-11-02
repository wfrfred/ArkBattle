import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";

import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../helpers/unit.js";

import * as effect from "../../dist/core/unit/effect/index.js";
import { get } from "../../dist/core/unit/effect/index.js";
import { definition, effectFixtureWork, install } from "../helpers/effects.js";


const unit = (id = 0) =>
    initialize({
        id,
        position: [0, 0],
        definition: { hooks: [],
            id: `effect-unit-${id}`,
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            offense: { attack: 100 },
        },
    });

test("effects: a direct static definition initializes private state and runs install before enable", () => {
    const seen = [];
    const value = definition(
        "direct",
        { count: 0 },
        {
            onInstall(state, self) {
                assert.equal(get(state, effectRef(self)).definition, value);
                const currentData = effect.get(state, effectRef(self)).data;
                state = effect.setData(state, effectRef(self), {
                    count: currentData.count + 1,
                });
                seen.push(["install", get(state, effectRef(self)).data.count]);
                return state;
            },
            onEnable(state, self) {
                seen.push(["enable", self.data.count]);
                return state;
            },
        },
    );
    let battle = effectFixtureWork(unit());
    let ref;
    ({ state: battle, value: ref } = install(battle, value));
    assert.equal(get(battle, ref).definition, value);
    assert.deepEqual(get(battle, ref).data, { count: 1 });
    assert.equal(get(battle, ref).status, "ACTIVE");
    assert.deepEqual(seen, [
        ["install", 1],
        ["enable", 1],
    ]);
});
