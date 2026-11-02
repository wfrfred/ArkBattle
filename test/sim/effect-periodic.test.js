import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../helpers/unit.js";
import { getUnit } from "../helpers/unit.js";
import * as effect from "../../dist/core/unit/effect/index.js";
import { get } from "../../dist/core/unit/effect/index.js";
import { effectFixtureWork, install, definition, at } from "../helpers/effects.js";

const unit = (id) =>
    initialize({
        id,
        position: [0, 0],
        definition: { hooks: [], id: `periodic-${id}`, vitality: { maxHp: 100, defense: 0, resistance: 0 } },
    });

test("effect time: inactive Effects do not tick, but their deadlines continue to expire", () => {
    const value = definition("disabled", {}, { onTick: () => assert.fail("inactive tick") });
    let battle = effectFixtureWork(unit(0));
    let ref;
    ({ state: battle, value: ref } = install(battle, value, 0, {
        enabled: false,
        deadline: 2,
    }));
    battle = effect.advance(at(battle, 1));
    assert.equal(get(battle, ref).status, "INACTIVE");
    battle = effect.advance(at(battle, 2));
    assert.equal(get(battle, ref), undefined);
});

test("effect time: a new Effect waits for the next advance while ended candidates are skipped", () => {
    const seen = [];
    let later;
    const newborn = definition(
        "newborn",
        {},
        {
            onTick: (state) => {
                seen.push("newborn");
                return state;
            },
        },
    );
    const first = definition(
        "first",
        { spawned: false },
        {
            onTick(state, self) {
                seen.push("first");
                if (self.data.spawned) return state;
                state = effect.setData(state, effectRef(self), { spawned: true });
                state = effect.install(
                    state,
                    unitRef(getUnit(state, self.host.id)),
                    newborn,
                    {},
                ).state;
                return effect.end(state, later, "EXPLICIT");
            },
        },
    );
    const last = definition(
        "later",
        {},
        {
            onTick: (state) => {
                seen.push("later");
                return state;
            },
        },
    );
    let battle = effectFixtureWork(unit(0));
    battle = install(battle, first).state;
    ({ state: battle, value: later } = install(battle, last));
    battle = effect.advance(at(battle, 0));
    assert.deepEqual(seen, ["first"]);
    battle = effect.advance(at(battle, 1));
    assert.deepEqual(seen, ["first", "first", "newborn"]);
});
