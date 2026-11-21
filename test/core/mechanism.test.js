// Contract: [terrain](../../docs/architecture/terrain.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import * as mechanisms from "../../dist/core/mechanism/index.js";
import { remove as removeUnit } from "../../dist/core/unit/operations.js";
import { battle as runtimeBattle, get } from "../helpers/battle.js";
import { ref } from "../../dist/core/unit/query.js";

const counter = (id, extra = {}) => ({
    id, initialize: () => ({ count: 0 }), ...extra,
});

function register(battle, definition, options) {
    const initialized = mechanisms.initialize(battle, { definition, ...options });
    return [mechanisms.add(initialized.state, initialized.value), mechanisms.ref(initialized.value)];
}

test("initial and predefined mechanisms use the same input and reserve IDs before registration", () => {
    const definition = counter("counter");
    const state = runtimeBattle([], {
        initialMechanisms: [{ definition }],
        predefines: [{ id: 7, alias: null, initiallyPresent: true, creation: {
            type: "MECHANISM", definition, active: false,
        } }],
    });
    const [initial, predefined] = mechanisms.all(state).toArray();
    const [binding] = state.predefinedPresence;
    assert.equal(initial.lifecycle, "ACTIVE");
    assert.equal(predefined.lifecycle, "INACTIVE");
    assert.deepEqual(binding, { definitionId: 7, source: { type: "MECHANISM", ref: mechanisms.ref(predefined) } });

    const initialized = mechanisms.initialize(state, { definition });
    const reference = mechanisms.ref(initialized.value);
    assert.equal(reference.id, predefined.id + 1);
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

test("onTick and nested unit departure preserve the latest mechanism state", () => {
    let battle = runtimeBattle([{
        definition: { hooks: Hooks.empty(), id: "host" }, position: [0, 0],
    }]);
    const definition = {
        id: "contacts", initialize: () => ({ contacts: [], departures: 0 }),
        onTick(state, self) {
            const currentState = mechanisms.get(state, mechanisms.ref(self)).state;
            state = mechanisms.setState(state, mechanisms.ref(self), {
                ...currentState, contacts: [0],
            });
            return removeUnit(state, ref(get(state, 0)), { reason: "SCRIPT" });
        },
        onUnitRemoved(state, self, departure) {
            assert.deepEqual(self.state.contacts, [departure.unit.id]);
            const currentState = mechanisms.get(state, mechanisms.ref(self)).state;
            return mechanisms.setState(state, mechanisms.ref(self), {
                contacts: [], departures: currentState.departures + 1,
            });
        },
    };
    let reference;
    [battle, reference] = register(battle, definition);
    battle = mechanisms.advance(battle);
    assert.deepEqual(mechanisms.get(battle, reference).state, { contacts: [], departures: 1 });
    assert.equal(battle.battlefield.units.get(0), undefined);
});
