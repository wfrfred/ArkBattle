// Contract: [terrain](../../docs/architecture/terrain.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { step } from "../../dist/core/battle/runtime.js";
import { Hooks } from "../../dist/core/hook.js";
import { scope } from "../../dist/core/lifetime/index.js";
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

    const initialized = mechanisms.initialize(initial, { definition });
    const addedRef = mechanisms.ref(initialized.value);
    assert.equal(mechanisms.get(initialized.state, addedRef), undefined);
    const inactiveRef = mechanisms.ref(inactive);
    let state = mechanisms.add(initialized.state, initialized.value);
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
        { scopes: [scope(mechanisms.lifetime, inactiveRef)] },
    );
    const advanced = step(linked.state, []);
    let state = mechanisms.remove(advanced, inactiveRef);
    assert.equal(effects.get(state, linked.value), undefined);
    assert.equal(mechanisms.get(state, inactiveRef), undefined);
    state = mechanisms.remove(state, activeRef);
    assert.equal(mechanisms.get(state, activeRef), undefined);
    assert.deepEqual(trace, [
        ["disable", "INACTIVE"], ["dependent"], ["end", "ENDING", 1], ["end", "ENDING", 2],
    ]);
});
