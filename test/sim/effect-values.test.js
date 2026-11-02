import { scope as lifetimeScope, dependencies } from "../../dist/core/lifetime/index.js";
import { lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { end, get, setDeadline, lifetime as effectLifetime } from "../../dist/core/unit/effect/index.js";
import { remove as removeUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { initialize } from "../helpers/unit.js";
import { definition, effectFixtureWork, install } from "../helpers/effects.js";

const host = () => initialize({ id: 0, position: [0, 0], definition: { hooks: [], id: "values" } });

test("effect values: deadline updates preserve lifetime constraints and reject invalid time", () => {
    const lifetime = lifetimeScope(unitLifetime, { id: 0 });
    const { state, value: ref } = install(effectFixtureWork(host()), definition("deadline"), 0, {
        scopes: [lifetime], deadline: 3,
    });
    const self = get(state, ref);
    assert.equal(setDeadline(state, ref, 3), state);
    const renewed = setDeadline(state, ref, 8);
    assert.equal(get(renewed, ref).deadline, 8);
    assert.equal(dependencies(renewed, lifetimeScope(effectLifetime, ref))[0], lifetime);
    const cleared = setDeadline(renewed, ref, null);
    assert.deepEqual(dependencies(cleared, lifetimeScope(effectLifetime, ref)), [lifetime]);
    assert.equal(setDeadline(cleared, ref, null), cleared);
    assert.equal(self.deadline, 3);
    assert.equal(get(state, ref), self);
    for (const tick of [-1, 0.5]) {
        assert.throws(() => setDeadline(state, ref, tick), RangeError);
    }
    const ended = end(state, ref);
    assert.throws(() => setDeadline(ended, ref, 8), /unknown effect: 0/);
    const removed = removeUnit(state, ref.host.id, "RETREAT");
    assert.throws(() => setDeadline(removed, ref, 8), /unknown unit: 0/);
});

test("effect deadlines: invalid initial time is rejected before initialization or callbacks", () => {
    const state = effectFixtureWork(host());
    const trace = [];
    const value = {
        id: "invalid-deadline",
        initialize: () => {
            trace.push("initialize");
            return {};
        },
        onInstall: (state) => {
            trace.push("install");
            return state;
        },
    };
    for (const tick of [-1, 0.5]) {
        assert.throws(
            () => install(state, value, 0, { deadline: tick }),
            RangeError,
        );
    }
    assert.deepEqual(trace, []);
    assert.equal(getUnit(state, 0).effects.values().toArray().length, 0);
});
