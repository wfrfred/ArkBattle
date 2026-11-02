
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { actionDefinition, battle, unit } from "../helpers/action-fixture.js";
import { getUnit, replaceUnit } from "../helpers/unit.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import {
    setBeforeReleaseHook,
    removeBeforeReleaseHook,
} from "../../dist/core/unit/capability/action/index.js";
import { beforeRelease } from "../../dist/core/unit/capability/action/release.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { advance } from "../../dist/core/unit/action/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";

const CONTINUE = { type: "CONTINUE" };
const program = {
    id: "release",
    intervalTicks: 10,
    speed: 100,
    initialize: (state) => ({ state, value: {} }),
    prepare: (state) => ({ state, value: {} }),
    onTick: (state) => ({ state, value: false }),
};
function initial() {
    const state = battle(unit(0, { action: program }));
    return actions.start(state, actions.ref(unitRef(getUnit(state, 0)), program));
}
function releaseEffect(id, data, invoke) {
    const definition = {
        id,
        initialize: () => data,
        onInstall(state, self) {
            const ref = effectRef(self);
            const currentUnit = getUnit(state, ref.host.id);
            return applyUnitChanges(state, [setBeforeReleaseHook({ id: currentUnit.id }, {
                    id: `release/${ref.id}`,
                    accepts: (battle) => effects.get(battle, ref)?.status === "ACTIVE",
                    invoke: (battle, context, current) =>
                        invoke(battle, { unit: getUnit(battle, context.source.id), execution: context.execution }, effects.get(battle, ref), ref, current),
                })]);
        },
        onEnd: (state, self) =>
            {
                const currentUnit1 = getUnit(state, self.host.id);
                return applyUnitChanges(state, [removeBeforeReleaseHook({ id: currentUnit1.id }, `release/${self.id}`)]);
            },
    };
    return definition;
}
const attach = (state, definition) =>
    effects.install(state, unitRef(getUnit(state, 0)), definition);
const change = (state, ref, data) =>
    effects.setData(state, ref, data);


test("action release: hiding the source in a continuing hook cancels before release or damage", () => {
    const attack = actionDefinition();
    const initial = battle(
        { ...unit(0, { action: attack }), spatialPresence: { present: true } },
        unit(1),
    );
    const installed = attach(initial, releaseEffect("hide-source", {}, (state, { unit }) => {
        const currentUnit2 = getUnit(state, unit.id);
        return ({
        state: replaceUnit(state, ({
            ...currentUnit2, spatialPresence: { present: false },
        })),
        value: CONTINUE,
    });
    }));
    const started = actions.start(installed.state, actions.ref(unitRef(getUnit(installed.state, 0)), attack));

    assert.equal(started.value.type, "STARTED");
    const cancelled = advance(started.state, started.value.ref);
    assert.equal(getUnit(cancelled, 0).spatialPresence.present, false);
    assert.equal(getUnit(cancelled, 1).vitality.hp, 100);
    assert.equal(getUnit(cancelled, 0).action.actions.values().filter(self => self.execution !== null).toArray().length, 0);
    assert.equal(cancelled.events.some(event => event.type === "ACTION_RELEASED" || event.type === "DAMAGE"), false);
    assert.deepEqual(cancelled.events.filter(event => event.type === "ACTION_CANCELLED").map(event => event.reason), ["SOURCE_ABSENT"]);
    assert.equal(getUnit(installed.state, 0).spatialPresence.present, true);
});

test("action release: a hook publishes charge changes and returns its recovery directive", () => {
    const started = initial();
    const definition = releaseEffect("charges", { remaining: 3 }, (state, context, self, ref) => {
        state = change(state, ref, { remaining: self.data.remaining - 1 });
        assert.equal(effects.get(state, ref).data.remaining, self.data.remaining - 1);
        if (self.data.remaining === 1) state = effects.end(state, ref);
        return { state, value: { type: "INTERRUPT", recoveryTicks: 15 } };
    });
    const installed = attach(started.state, definition);
    let state = installed.state;
    for (const tick of [1, 2, 3]) {
        const result = beforeRelease({ ...state, tick }, started.value.ref);
        assert.deepEqual(result.value, { type: "INTERRUPT", recoveryTicks: 15 });
        state = result.state;
    }
    assert.equal(effects.get(state, installed.value), undefined);
    assert.deepEqual(beforeRelease(state, started.value.ref).value, CONTINUE);
    assert.equal(effects.get(installed.state, installed.value).data.remaining, 3);
});

test("action release: the first interruption stops later registered hooks", () => {
    const started = initial(),
        calls = [];
    let state = started.state;
    for (const [id, directive] of [
        ["first", CONTINUE],
        ["second", { type: "INTERRUPT", recoveryTicks: 4 }],
        ["third", CONTINUE],
    ]) {
        state = attach(
            state,
            releaseEffect(id, {}, (state) => {
                calls.push(id);
                return { state, value: directive };
            }),
        ).state;
    }
    assert.deepEqual(beforeRelease(state, started.value.ref).value, {
        type: "INTERRUPT",
        recoveryTicks: 4,
    });
    assert.deepEqual(calls, ["first", "second"]);
});
