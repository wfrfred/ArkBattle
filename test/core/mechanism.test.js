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

test("registration invokes enter and actual toggles invoke enable or disable", () => {
    const trace = [];
    const definition = counter("callbacks", {
        onEnter(state, self) {
            assert.equal(mechanisms.get(state, mechanisms.ref(self)).lifecycle, self.lifecycle);
            trace.push(["enter", self.id, self.lifecycle]);
            return mechanisms.setState(state, mechanisms.ref(self), { count: 1 });
        },
        onEnable(state, self) {
            assert.equal(self.lifecycle, "ACTIVE");
            assert.equal(mechanisms.get(state, mechanisms.ref(self)).lifecycle, "ACTIVE");
            trace.push(["enable", self.id, self.state.count]);
            return state;
        },
        onDisable(state, self) {
            assert.equal(mechanisms.get(state, mechanisms.ref(self)).lifecycle, "INACTIVE");
            trace.push(["disable", self.id]);
            return state;
        },
    });
    const initial = runtimeBattle([], {
        initialMechanisms: [{ definition }, { definition, active: false }],
    });
    const [active, inactive] = mechanisms.all(initial).toArray();
    assert.deepEqual(trace, [
        ["enter", active.id, "ACTIVE"], ["enter", inactive.id, "INACTIVE"],
    ]);

    const [added, addedRef] = register(initial, definition);
    const inactiveRef = mechanisms.ref(inactive);
    let state = added;
    assert.equal(mechanisms.setActive(state, inactiveRef, false), state);
    state = mechanisms.setActive(state, inactiveRef, true);
    assert.equal(mechanisms.setActive(state, inactiveRef, true), state);
    state = mechanisms.setActive(state, inactiveRef, false);
    assert.equal(mechanisms.setActive(state, inactiveRef, false), state);
    state = mechanisms.setActive(state, inactiveRef, true);
    assert.equal(mechanisms.get(state, inactiveRef).lifecycle, "ACTIVE");

    assert.deepEqual(trace, [
        ["enter", active.id, "ACTIVE"], ["enter", inactive.id, "INACTIVE"],
        ["enter", addedRef.id, "ACTIVE"],
        ["enable", inactive.id, 1], ["disable", inactive.id], ["enable", inactive.id, 1],
    ]);
});

test("disabled mechanisms retain their state and removal invokes end", () => {
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
        ["end", "ENDING", 0],
    ]);
});
