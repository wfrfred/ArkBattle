// Contract: [terrain](../../docs/architecture/terrain.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { step } from "../../dist/core/battle/runtime.js";
import { Hooks } from "../../dist/core/hook.js";
import * as mechanisms from "../../dist/core/mechanism/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { battle as runtimeBattle, get } from "../helpers/battle.js";

const counter = (id, extra = {}) => ({
    id, initialize: () => ({ count: 0 }), ...extra,
});

function register(battle, definition, options) {
    const initialized = mechanisms.initialize(battle, { definition, ...options });
    return [mechanisms.add(initialized.state, initialized.value), mechanisms.ref(initialized.value)];
}

test("registration invokes enter and actual toggles invoke enable or disable", () => {
    const trace = [];
    const definition = counter("callbacks", {
        onEnter(state, self) {
            assert.equal(mechanisms.ref(self).get(state).lifecycle, self.lifecycle);
            trace.push(["enter", mechanisms.ref(self), self.lifecycle]);
            return mechanisms.setState(state, mechanisms.ref(self), { count: 1 });
        },
        onEnable(state, self) {
            assert.equal(self.lifecycle, "ACTIVE");
            assert.equal(mechanisms.ref(self).get(state).lifecycle, "ACTIVE");
            trace.push(["enable", mechanisms.ref(self), self.state.count]);
            return state;
        },
        onDisable(state, self) {
            assert.equal(mechanisms.ref(self).get(state).lifecycle, "INACTIVE");
            trace.push(["disable", mechanisms.ref(self)]);
            return state;
        },
    });
    const initial = runtimeBattle([], {
        initialMechanisms: [{ definition }, { definition, active: false }],
    });
    const [active, inactive] = mechanisms.all(initial).toArray();
    const activeRef = mechanisms.ref(active);
    const inactiveRef = mechanisms.ref(inactive);
    assert.deepEqual(trace, [
        ["enter", activeRef, "ACTIVE"], ["enter", inactiveRef, "INACTIVE"],
    ]);

    const initialized = mechanisms.initialize(initial, { definition });
    const addedRef = mechanisms.ref(initialized.value);
    assert.equal(addedRef.get(initialized.state), undefined);
    let state = mechanisms.add(initialized.state, initialized.value);
    assert.equal(mechanisms.setActive(state, inactiveRef, false), state);
    state = mechanisms.setActive(state, inactiveRef, true);
    assert.equal(mechanisms.setActive(state, inactiveRef, true), state);
    state = mechanisms.setActive(state, inactiveRef, false);
    assert.equal(mechanisms.setActive(state, inactiveRef, false), state);
    state = mechanisms.setActive(state, inactiveRef, true);
    assert.equal(inactiveRef.get(state).lifecycle, "ACTIVE");

    assert.deepEqual(trace, [
        ["enter", activeRef, "ACTIVE"], ["enter", inactiveRef, "INACTIVE"],
        ["enter", addedRef, "ACTIVE"],
        ["enable", inactiveRef, 1], ["disable", inactiveRef], ["enable", inactiveRef, 1],
    ]);
    assert.equal(trace[0][1], activeRef);
    assert.equal(trace[2][1], addedRef);
    assert.ok([trace[1], ...trace.slice(3)].every((entry) => entry[1] === inactiveRef));
});

test("disabled mechanisms stop advancing but still finish their dependents before removal", () => {
    const trace = [];
    const definition = counter("cleanup", {
        onDisable(state, self) {
            trace.push(["disable", self.lifecycle]);
            return mechanisms.setState(state, mechanisms.ref(self), {
                count: self.state.count + 1,
            });
        },
        onTick(state, self) {
            return mechanisms.setState(state, mechanisms.ref(self), { count: self.state.count + 2 });
        },
        onEnd(state, self) {
            trace.push(["end", self.lifecycle, self.state.count]);
            return state;
        },
    });
    const battle = runtimeBattle([{ definition: { id: "target", hooks: Hooks.empty() }, position: [0, 0] }]);
    const [initial, inactiveRef] = register(battle, definition);
    const inactive = mechanisms.setActive(initial, inactiveRef, false);
    const [active, activeRef] = register(inactive, definition);
    const linked = effects.install(
        active,
        unitRef(get(active, 0)),
        {
            id: "dependent",
            initialize: () => ({}),
            onEnd(current) {
                trace.push(["dependent"]);
                return current;
            },
        },
        { scopes: [inactiveRef] },
    );
    const advanced = step(linked.state, []);
    let state = mechanisms.remove(advanced, inactiveRef);
    assert.equal(linked.value.get(state), undefined);
    assert.equal(inactiveRef.get(state), undefined);
    state = mechanisms.remove(state, activeRef);
    assert.equal(activeRef.get(state), undefined);
    assert.deepEqual(trace, [
        ["disable", "INACTIVE"], ["dependent"], ["end", "ENDING", 1], ["end", "ENDING", 2],
    ]);
});
