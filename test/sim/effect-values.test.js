import assert from "node:assert/strict";
import { test } from "node:test";
import { setDeadline, deadline } from "../../dist/core/unit/effect/effect.js";
import { get, setData } from "../../dist/core/unit/effect/index.js";
import { getUnit } from "../helpers/unit.js";
import { initialize } from "../helpers/unit.js";
import { definition, effectFixtureWork, install } from "../helpers/effects.js";

const host = () => initialize({ id: 0, position: [0, 0], definition: { hooks: [], id: "values" } });

test("effect values: local no-ops and replacements retain the input version", () => {
    const value = definition("identity", { charges: 2 });
    const installed = install(effectFixtureWork(host()), value);
    const { state, value: ref } = installed;
    const self = get(state, ref);
    assert.equal(getUnit(state, ref.host.id).effects.get(ref.id, definition("identity")), undefined);
    assert.equal(setDeadline(self, null), self);
    const currentData = get(state, ref).data;
    assert.equal(setData(state, ref, currentData), state);
    const unit = getUnit(state, 0);
    const currentData2 = get(state, ref).data;
    const changed = setData(state, ref, { ...currentData2, charges: 1 });
    assert.equal(get(state, ref).data.charges, 2);
    assert.equal(get(changed, ref).data.charges, 1);
    assert.equal(getUnit(state, 0), unit);
    assert.throws(() => unit.effects.replace({ ...ref, id: 9 }, self), TypeError);
    assert.throws(() => setData(state, { ...ref, id: 9 }, { charges: 1 }), /unknown effect: 9/);
});

test("effect values: deadline updates preserve lifetime constraints and reject invalid time", () => {
    const lifetime = { type: "UNIT", ref: { id: 0 } };
    const { state, value: ref } = install(effectFixtureWork(host()), definition("deadline"), 0, {
        scopes: [lifetime, { type: "TICK", tick: 3 }],
    });
    const self = get(state, ref);
    assert.equal(setDeadline(self, 3), self);
    const renewed = setDeadline(self, 8);
    assert.equal(deadline(renewed), 8);
    assert.equal(renewed.scopes[0], lifetime);
    assert.deepEqual(setDeadline(renewed, null).scopes, [lifetime]);
    assert.equal(deadline(self), 3);
    for (const tick of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
        assert.throws(() => setDeadline(self, tick), RangeError);
    }
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
