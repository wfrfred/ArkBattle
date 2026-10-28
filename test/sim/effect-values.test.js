import assert from "node:assert/strict";
import { test } from "node:test";
import { deadline } from "../../dist/core/unit/effect/effect.js";
import { end, get, setData, setDeadline } from "../../dist/core/unit/effect/index.js";
import { remove as removeUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { initialize } from "../helpers/unit.js";
import { definition, effectFixtureWork, install } from "../helpers/effects.js";

const host = () => initialize({ id: 0, position: [0, 0], definition: { hooks: [], id: "values" } });

test("effect values: local no-ops and replacements retain the input version", () => {
    const value = definition("identity", { charges: 2 });
    const installed = install(effectFixtureWork(host()), value);
    const { state, value: ref } = installed;
    assert.equal(getUnit(state, ref.host.id).effects.get(ref.id, definition("identity")), undefined);
    assert.equal(setDeadline(state, ref, null), state);
    const currentData = get(state, ref).data;
    assert.equal(setData(state, ref, currentData), state);
    const unit = getUnit(state, 0);
    const currentData2 = get(state, ref).data;
    const changed = setData(state, ref, { ...currentData2, charges: 1 });
    assert.equal(get(state, ref).data.charges, 2);
    assert.equal(get(changed, ref).data.charges, 1);
    assert.equal(getUnit(state, 0), unit);
    assert.throws(() => setData(state, { ...ref, id: 9 }, { charges: 1 }), /unknown effect: 9/);
});

test("effect values: deadline updates preserve lifetime constraints and reject invalid time", () => {
    const lifetime = { type: "UNIT", ref: { id: 0 } };
    const { state, value: ref } = install(effectFixtureWork(host()), definition("deadline"), 0, {
        scopes: [lifetime, { type: "TICK", tick: 3 }],
    });
    const self = get(state, ref);
    assert.equal(setDeadline(state, ref, 3), state);
    const renewed = setDeadline(state, ref, 8);
    assert.equal(deadline(get(renewed, ref)), 8);
    assert.equal(get(renewed, ref).scopes[0], lifetime);
    const cleared = setDeadline(renewed, ref, null);
    assert.deepEqual(get(cleared, ref).scopes, [lifetime]);
    assert.equal(setDeadline(cleared, ref, null), cleared);
    assert.equal(deadline(self), 3);
    assert.equal(get(state, ref), self);
    for (const tick of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
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
    for (const tick of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
        assert.throws(
            () => install(state, value, 0, { scopes: [{ type: "TICK", tick }] }),
            RangeError,
        );
    }
    assert.deepEqual(trace, []);
    assert.equal(getUnit(state, 0).effects.values().toArray().length, 0);
});
