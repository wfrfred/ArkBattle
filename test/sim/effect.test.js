import { Hooks } from "../../dist/core/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as offense from "../../dist/core/unit/capability/offense/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { update, remove, lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import { scope } from "../../dist/core/lifetime/index.js";

test("installation, participation, and destruction have distinct lifetimes and preserve current private state", () => {
    const observed = [];
    const program = {
        id: "buff",
        initialize: () => ({ activations: 0 }),
        onInstall(state, self) {
            observed.push(["install", self.status, offense.resolveAttack(state, units.get(state, self.host))]);
            return effects.setState(state, effects.ref(self), { activations: 1 });
        },
        onEnable(state, self) {
            observed.push(["enable", self.state.activations]);
            return update(state, self.host, offense.setAttackContribution({
                    id: "buff",
                    value: [modifier({ addition: 20 })],
                }));
        },
        onDisable(state, self) {
            state = update(state, self.host, offense.removeAttackContribution("buff"));
            return effects.setState(state, effects.ref(self), {
                activations: self.state.activations + 1,
            });
        },
        onEnd(state, self) {
            observed.push([
                "end",
                self.status,
                self.state.activations,
                offense.resolveAttack(state, units.get(state, self.host)),
            ]);
            return state;
        },
    };
    const definition = { id: "operator", hooks: Hooks.empty(), offense: { attack: 100 } };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const installed = effects.install(state, source, program, { enabled: false });
    state = installed.state;
    assert.equal(effects.get(state, installed.value).status, "INACTIVE");
    assert.deepEqual(observed, [["install", "INSTALLING", 100]]);
    state = effects.setEnabled(state, installed.value, true);
    assert.equal(offense.resolveAttack(state, units.get(state, source)), 120);
    state = effects.setEnabled(state, installed.value, false);
    assert.equal(offense.resolveAttack(state, units.get(state, source)), 100);
    assert.equal(effects.get(state, installed.value).state.activations, 2);
    state = effects.setEnabled(state, installed.value, true);
    state = effects.end(state, installed.value);
    assert.equal(effects.get(state, installed.value), undefined);
    assert.deepEqual(observed.at(-1), ["end", "ENDING", 3, 100]);

    const selfEnding = {
        id: "self-ending",
        initialize: () => ({}),
        onInstall: (state, self) => effects.end(state, effects.ref(self)),
        onEnable: () => assert.fail("ended installation must not enable"),
    };
    const ended = effects.install(state, source, selfEnding);
    assert.equal(effects.get(ended.state, ended.value), undefined);
});

test("overall replacement uses priority and installation order; disabling the winner does not enable a weaker effect", () => {
    const weak = {
        id: "weak",
        group: { id: "overall", priority: 1 },
        initialize: () => ({ bonus: 10 }),
        onEnable: (state, self) =>
            update(state, self.host, offense.setAttackContribution({
                    id: "overall",
                    value: [modifier({ addition: self.state.bonus })],
                })),
        onDisable: (state, self) =>
            update(state, self.host, offense.removeAttackContribution("overall")),
    };
    const strong = {
        ...weak,
        id: "strong",
        group: { id: "overall", priority: 2 },
        initialize: () => ({ bonus: 20 }),
    };
    const later = {
        ...weak,
        id: "later",
        group: { id: "overall", priority: 2 },
        initialize: () => ({ bonus: 30 }),
    };
    const definition = { id: "operator", hooks: Hooks.empty(), offense: { attack: 100 } };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const low = effects.install(state, source, weak);
    const high = effects.install(low.state, source, strong);
    const equal = effects.install(high.state, source, later);
    state = equal.state;
    assert.equal(effects.get(state, low.value).status, "INACTIVE");
    assert.equal(effects.get(state, high.value).status, "ACTIVE");
    assert.equal(effects.get(state, equal.value).status, "INACTIVE");
    assert.equal(offense.resolveAttack(state, units.get(state, source)), 120);
    state = effects.setEnabled(state, high.value, false);
    assert.equal(effects.get(state, low.value).status, "INACTIVE");
    assert.equal(effects.get(state, equal.value).status, "INACTIVE");
    assert.equal(offense.resolveAttack(state, units.get(state, source)), 100);
    state = effects.end(state, high.value);
    assert.equal(effects.get(state, equal.value).status, "ACTIVE");
    assert.equal(offense.resolveAttack(state, units.get(state, source)), 130);
    state = effects.end(state, equal.value);
    assert.equal(effects.get(state, low.value).status, "ACTIVE");
    assert.equal(offense.resolveAttack(state, units.get(state, source)), 110);
});

test("absolute deadlines continue while inactive and the final callback can extend the effect", () => {
    const ended = [];
    const program = {
        id: "periodic",
        initialize: () => ({ ticks: 0, extended: false }),
        onTick(state, self) {
            state = effects.setState(state, effects.ref(self), {
                ...self.state,
                ticks: self.state.ticks + 1,
            });
            if (state.tick === 6) {
                state = effects.setExpiration(state, effects.ref(self), { type: "DEADLINE", tick: 9 });
                state = effects.setState(state, effects.ref(self), {
                    ticks: self.state.ticks + 1,
                    extended: true,
                });
            }
            return state;
        },
        onEnd(state, self, reason) {
            ended.push({ id: self.definition.id, tick: state.tick, state: self.state, reason });
            return state;
        },
    };
    const inactive = { ...program, id: "inactive" };
    const definition = { id: "operator", hooks: Hooks.empty() };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const active = effects.install(state, source, program, { expiration: { type: "DEADLINE", tick: 6 } });
    const paused = effects.install(active.state, source, inactive, { expiration: { type: "DEADLINE", tick: 3 }, enabled: false });
    state = effects.advance(paused.state);
    state = effects.setEnabled({ ...state, tick: 1 }, active.value, false);
    for (let tick = 1; tick <= 4; tick++) state = effects.advance({ ...state, tick });
    assert.equal(effects.get(state, active.value).state.ticks, 1);
    assert.equal(effects.get(state, paused.value), undefined);
    state = effects.setEnabled({ ...state, tick: 5 }, active.value, true);
    state = effects.advance(state);
    state = effects.advance({ ...state, tick: 6 });
    assert.deepEqual(effects.get(state, active.value).expiration, { type: "DEADLINE", tick: 9 });
    assert.equal(effects.get(state, active.value).state.ticks, 3);
    for (let tick = 7; tick <= 9; tick++) state = effects.advance({ ...state, tick });
    assert.equal(effects.get(state, active.value), undefined);
    assert.deepEqual(ended, [
        { id: "inactive", tick: 3, state: { ticks: 0, extended: false }, reason: "EXPIRED" },
        { id: "periodic", tick: 9, state: { ticks: 6, extended: true }, reason: "EXPIRED" },
    ]);
});

test("zero expiration runs installation and cleanup; installation may replace the expiration before enabling", () => {
    const observed = [];
    const definition = { id: "operator", hooks: Hooks.empty() };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const program = {
        id: "instant",
        initialize: () => ({ installed: false }),
        onInstall(state, self) {
            observed.push("install");
            return effects.setState(state, effects.ref(self), { installed: true });
        },
        onEnable: () => assert.fail("expired installation must not enable"),
        onTick: () => assert.fail("expired installation must not tick"),
        onDisable: () => assert.fail("an instance that never enabled must not disable"),
        onEnd(state, self) {
            assert.equal(self.state.installed, true);
            observed.push("end");
            return state;
        },
    };
    for (const expiration of [
        { type: "DURATION", elapsed: 0, total: 0, rate: 1 },
        { type: "DEADLINE", tick: 0 },
    ]) {
        const installed = effects.install(state, source, program, { expiration });
        state = installed.state;
        assert.equal(effects.get(state, installed.value), undefined);
    }
    assert.deepEqual(observed, ["install", "end", "install", "end"]);

    const extended = effects.install(state, source, {
        id: "extended-installation",
        initialize: () => ({}),
        onInstall: (state, self) => effects.setExpiration(state, effects.ref(self), {
            type: "DURATION", elapsed: 0, total: 2, rate: 1,
        }),
    }, { expiration: { type: "DURATION", elapsed: 0, total: 0, rate: 1 } });
    state = extended.state;
    assert.equal(effects.get(state, extended.value).status, "ACTIVE");
    state = effects.advance({ ...state, tick: 1 });
    assert.equal(effects.get(state, extended.value).expiration.elapsed, 1);
    state = effects.advance({ ...state, tick: 2 });
    assert.equal(effects.get(state, extended.value), undefined);
});

test("duration advances only while active, publishes before callbacks, and accepts manual progress and renewal", () => {
    const observed = [];
    const ended = [];
    const definition = { id: "operator", hooks: Hooks.empty() };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const installed = effects.install(state, source, {
        id: "duration",
        initialize: () => ({}),
        onTick(state, self, previous) {
            observed.push([previous.elapsed, self.expiration.elapsed]);
            assert.equal(effects.get(state, effects.ref(self)), self);
            if (self.expiration.elapsed === 3) {
                state = effects.setEnabled(state, effects.ref(self), false);
                state = effects.setExpiration(state, effects.ref(self), {
                    ...self.expiration, total: 5, rate: 2,
                });
            }
            return state;
        },
        onEnd(state, self) {
            ended.push(self.expiration.elapsed);
            return state;
        },
    }, { expiration: { type: "DURATION", elapsed: 0, total: 3, rate: 1 } });
    state = effects.advance({ ...installed.state, tick: 1 });
    state = effects.setEnabled(state, installed.value, false);
    state = effects.advance({ ...state, tick: 2 });
    state = effects.advance({ ...state, tick: 3 });
    assert.equal(effects.get(state, installed.value).expiration.elapsed, 1);
    state = effects.setEnabled({ ...state, tick: 4 }, installed.value, true);
    state = effects.advance(state);
    state = effects.advance({ ...state, tick: 5 });
    assert.equal(effects.get(state, installed.value).status, "INACTIVE");
    state = effects.setEnabled({ ...state, tick: 6 }, installed.value, true);
    state = effects.advance(state);
    assert.deepEqual(observed, [[0, 1], [1, 2], [2, 3], [3, 5]]);
    assert.deepEqual(ended, [5]);
    assert.equal(effects.get(state, installed.value), undefined);

    const manual = effects.install(state, source, {
        id: "manual-duration",
        initialize: () => ({}),
        onTick(state, self, previous) {
            assert.equal(self.expiration.elapsed, previous.elapsed);
            return effects.setExpiration(state, effects.ref(self), {
                ...self.expiration, elapsed: self.expiration.elapsed + 1,
            });
        },
    }, { expiration: { type: "DURATION", elapsed: 0, total: 2, rate: 0 } });
    state = effects.advance({ ...manual.state, tick: 7 });
    assert.equal(effects.get(state, manual.value).expiration.elapsed, 1);
    state = effects.advance({ ...state, tick: 8 });
    assert.equal(effects.get(state, manual.value), undefined);
});

test("source attribution alone does not bind lifetime, while explicit scope and ownership do", () => {
    const definition = { id: "unit", hooks: Hooks.empty() };
    const program = { id: "effect", initialize: () => ({}) };
    let state = battle([
        { definition, position: [1, 1] },
        { definition, position: [2, 1] },
    ]);
    const source = units.ref(get(state, 0));
    const owner = units.ref(get(state, 1));
    const attributed = effects.install(state, owner, program, { source });
    const bound = effects.install(attributed.state, owner, program, {
        source,
        scopes: [scope(unitLifetime, source)],
    });
    state = remove(bound.state, source.id, "SCRIPT");
    assert.equal(effects.get(state, bound.value), undefined);
    assert.equal(effects.get(state, attributed.value).status, "ACTIVE");
    assert.deepEqual(effects.get(state, attributed.value).source, source);
    state = remove(state, owner.id, "SCRIPT");
    assert.equal(get(state, owner.id), undefined);
    assert.equal(effects.get(state, attributed.value), undefined);
});
