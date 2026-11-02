import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../helpers/unit.js";
import { effectFixtureWork, install, definition } from "../helpers/effects.js";
import * as effect from "../../dist/core/unit/effect/index.js";
import { get } from "../../dist/core/unit/effect/index.js";

const unit = () =>
    initialize({
        id: 0,
        position: [0, 0],
        definition: { hooks: [], id: "cleanup", vitality: { maxHp: 100, defense: 0, resistance: 0 } },
    });

test("effect cleanup: a replacement installed during end uses a new identity and survives the old cleanup", () => {
    let next;
    const replacement = definition("replacement");
    const value = definition(
        "old",
        {},
        {
            onEnd(state, self) {
                const installed = effect.install(
                    state,
                    self.host,
                    replacement,
                    {},
                );
                next = installed.value;
                return installed.state;
            },
        },
    );
    let battle = effectFixtureWork(unit());
    let old;
    ({ state: battle, value: old } = install(battle, value));
    battle = effect.end(battle, old);
    assert.equal(get(battle, old), undefined);
    assert.notEqual(next.id, old.id);
    assert.equal(get(battle, next).definition, replacement);
});
