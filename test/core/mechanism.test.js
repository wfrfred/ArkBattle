// Contract: [terrain](../../docs/architecture/terrain.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import * as mechanisms from "../../dist/core/mechanism/index.js";
import { battle as runtimeBattle } from "../helpers/battle.js";

const counter = (id, extra = {}) => ({
    id, initialize: () => ({ count: 0 }), ...extra,
});

function register(battle, definition, options) {
    const initialized = mechanisms.initialize(battle, { definition, ...options });
    return [mechanisms.add(initialized.state, initialized.value), mechanisms.ref(initialized.value)];
}

test("initial mechanisms retain activation input and reserve IDs before direct registration", () => {
    const definition = counter("counter");
    const state = runtimeBattle([], {
        initialMechanisms: [{ definition }, { definition, active: false }],
    });
    const [active, inactive] = mechanisms.all(state).toArray();
    assert.equal(active.lifecycle, "ACTIVE");
    assert.equal(inactive.lifecycle, "INACTIVE");

    const initialized = mechanisms.initialize(state, { definition });
    const reference = mechanisms.ref(initialized.value);
    assert.equal(reference.id, inactive.id + 1);
    assert.equal(mechanisms.get(initialized.state, reference), undefined);
    const added = mechanisms.add(initialized.state, initialized.value);
    assert.equal(mechanisms.get(added, reference), initialized.value);
});

test("disabled mechanisms retain their state, and removal disables only active output", () => {
    const trace = [];
    const definition = counter("cleanup", {
        onDisable(state, self) {
            trace.push(["disable", self.lifecycle]);
            return mechanisms.setState(state, mechanisms.ref(self), {
                count: self.state.count + 1,
            });
        },
        onEnd(state, self) {
            trace.push(["end", self.lifecycle, self.state.count]);
            return state;
        },
    });
    const [initial, inactiveRef] = register(runtimeBattle(), definition);
    let state = mechanisms.setActive(initial, inactiveRef, false);
    assert.equal(mechanisms.get(state, inactiveRef).state.count, 1);
    state = mechanisms.remove(state, inactiveRef);
    assert.equal(mechanisms.get(state, inactiveRef), undefined);
    const [active, activeRef] = register(state, definition);
    state = mechanisms.remove(active, activeRef);
    assert.equal(mechanisms.get(state, activeRef), undefined);
    assert.deepEqual(trace, [
        ["disable", "INACTIVE"], ["end", "ENDING", 1],
        ["disable", "ENDING"], ["end", "ENDING", 1],
    ]);
});
