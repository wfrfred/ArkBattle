import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import * as mechanisms from "../../dist/core/battle/mechanism.js";
import { remove as removeUnit } from "../../dist/core/battle/unit.js";
import { battle as runtimeBattle, get } from "../helpers/battle.js";
import { ref } from "../../dist/core/unit/query.js";

const counter = (id, extra = {}) => mechanisms.createMechanismDefinition({
    id, initialize: () => ({ count: 0 }), ...extra,
});

function register(battle, definition, options) {
    const created = mechanisms.create(battle, definition, options);
    return [created.state, created.value];
}

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

test("advance fixes identities, rechecks latest state, and does not restore a removed self", () => {
    let removed;
    let activated;
    let created;
    const definition = counter("first", {
        onTick(battle, self) {
            battle = mechanisms.remove(battle, removed);
            battle = mechanisms.setActive(battle, activated, true);
            const added = mechanisms.create(battle, counter("created", {
                onTick: (state, next) => {
                    const currentState = mechanisms.get(state, mechanisms.ref(next)).state;
                    return mechanisms.setState(state, mechanisms.ref(next),
                    { count: currentState.count + 1 });
                },
            }));
            created = added.value;
            return mechanisms.remove(added.state, mechanisms.ref(self));
        },
    });
    let battle;
    let first;
    [battle, first] = register(runtimeBattle(), definition);
    [battle, removed] = register(battle, counter("removed", {
        onTick: () => assert.fail("removed candidates must be skipped"),
    }));
    [battle, activated] = register(battle, counter("activated", {
        onTick: (state, self) => {
            const currentState = mechanisms.get(state, mechanisms.ref(self)).state;
            return mechanisms.setState(state, mechanisms.ref(self),
            { count: currentState.count + 1 });
        },
    }), { active: false });
    battle = mechanisms.advance(battle);
    assert.equal(mechanisms.get(battle, first), undefined);
    assert.equal(mechanisms.get(battle, removed), undefined);
    assert.equal(mechanisms.get(battle, activated).state.count, 1);
    assert.equal(mechanisms.get(battle, created).state.count, 0);
    battle = mechanisms.advance(battle);
    assert.equal(mechanisms.get(battle, created).state.count, 1);
});

test("onTick and nested unit departure preserve the latest mechanism state", () => {
    let battle = runtimeBattle([{
        definition: { hooks: Hooks.empty(), id: "host" }, position: [0, 0],
    }]);
    const definition = mechanisms.createMechanismDefinition({
        id: "contacts", initialize: () => ({ contacts: [], departures: 0 }),
        onTick(state, self) {
            const currentState = mechanisms.get(state, mechanisms.ref(self)).state;
            state = mechanisms.setState(state, mechanisms.ref(self), {
                ...currentState, contacts: [0],
            });
            return removeUnit(state, ref(get(state, 0)), "SCRIPT");
        },
        onUnitLeave(state, self, departure) {
            assert.deepEqual(self.state.contacts, [departure.unit.id]);
            const currentState = mechanisms.get(state, mechanisms.ref(self)).state;
            return mechanisms.setState(state, mechanisms.ref(self), {
                contacts: [], departures: currentState.departures + 1,
            });
        },
    });
    let reference;
    [battle, reference] = register(battle, definition);
    battle = mechanisms.advance(battle);
    assert.deepEqual(mechanisms.get(battle, reference).state, { contacts: [], departures: 1 });
    assert.equal(battle.battlefield.units.get(0), undefined);
});
