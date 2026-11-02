import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as offense from "../../dist/core/unit/capability/offense/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { update, remove, lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import { scope } from "../../dist/core/lifetime/index.js";

test("installation, participation, and destruction have distinct lifetimes and preserve current private data", () => {
    const observed = [];
    const program = {
        id: "buff",
        initialize: () => ({ activations: 0 }),
        onInstall(state, self) {
            observed.push(["install", self.status, offense.resolveAttack(state, self.host)]);
            return effects.setData(state, effects.ref(self), { activations: 1 });
        },
        onEnable(state, self) {
            observed.push(["enable", self.data.activations]);
            return update(state, [
                offense.setAttackContribution(self.host, {
                    id: "buff",
                    value: [modifier({ addition: 20 })],
                }),
            ]);
        },
        onDisable(state, self) {
            state = update(state, [offense.removeAttackContribution(self.host, "buff")]);
            return effects.setData(state, effects.ref(self), {
                activations: self.data.activations + 1,
            });
        },
        onEnd(state, self) {
            observed.push([
                "end",
                self.status,
                self.data.activations,
                offense.resolveAttack(state, self.host),
            ]);
            return state;
        },
    };
    const definition = { id: "operator", hooks: [], offense: { attack: 100 } };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const installed = effects.install(state, source, program, { enabled: false });
    state = installed.state;
    assert.equal(effects.get(state, installed.value).status, "INACTIVE");
    assert.deepEqual(observed, [["install", "INSTALLING", 100]]);
    state = effects.setEnabled(state, installed.value, true);
    assert.equal(offense.resolveAttack(state, source), 120);
    state = effects.setEnabled(state, installed.value, false);
    assert.equal(offense.resolveAttack(state, source), 100);
    assert.equal(effects.get(state, installed.value).data.activations, 2);
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
            update(state, [
                offense.setAttackContribution(self.host, {
                    id: "overall",
                    value: [modifier({ addition: self.data.bonus })],
                }),
            ]),
        onDisable: (state, self) =>
            update(state, [offense.removeAttackContribution(self.host, "overall")]),
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
    const definition = { id: "operator", hooks: [], offense: { attack: 100 } };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const low = effects.install(state, source, weak);
    const high = effects.install(low.state, source, strong);
    const equal = effects.install(high.state, source, later);
    state = equal.state;
    assert.equal(effects.get(state, low.value).status, "INACTIVE");
    assert.equal(effects.get(state, high.value).status, "ACTIVE");
    assert.equal(effects.get(state, equal.value).status, "INACTIVE");
    assert.equal(offense.resolveAttack(state, source), 120);
    state = effects.setEnabled(state, high.value, false);
    assert.equal(effects.get(state, low.value).status, "INACTIVE");
    assert.equal(effects.get(state, equal.value).status, "INACTIVE");
    assert.equal(offense.resolveAttack(state, source), 100);
    state = effects.end(state, high.value);
    assert.equal(effects.get(state, equal.value).status, "ACTIVE");
    assert.equal(offense.resolveAttack(state, source), 130);
    state = effects.end(state, equal.value);
    assert.equal(effects.get(state, low.value).status, "ACTIVE");
    assert.equal(offense.resolveAttack(state, source), 110);
});

test("absolute deadlines continue while inactive, active ticks do not catch up, and a deadline-tick callback can extend the effect", () => {
    const ended = [];
    const program = {
        id: "periodic",
        initialize: () => ({ ticks: 0, extended: false }),
        onTick(state, self) {
            state = effects.setData(state, effects.ref(self), {
                ...self.data,
                ticks: self.data.ticks + 1,
            });
            if (state.tick === 6) {
                state = effects.setDeadline(state, effects.ref(self), 9);
                state = effects.setData(state, effects.ref(self), {
                    ticks: self.data.ticks + 1,
                    extended: true,
                });
            }
            return state;
        },
        onEnd(state, self, reason) {
            ended.push({ id: self.definition.id, tick: state.tick, data: self.data, reason });
            return state;
        },
    };
    const inactive = { ...program, id: "inactive" };
    const definition = { id: "operator", hooks: [] };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const active = effects.install(state, source, program, { deadline: 6 });
    const paused = effects.install(active.state, source, inactive, { deadline: 3, enabled: false });
    state = effects.advance(paused.state);
    state = effects.setEnabled({ ...state, tick: 1 }, active.value, false);
    for (let tick = 1; tick <= 4; tick++) state = effects.advance({ ...state, tick });
    assert.equal(effects.get(state, active.value).data.ticks, 1);
    assert.equal(effects.get(state, paused.value), undefined);
    state = effects.setEnabled({ ...state, tick: 5 }, active.value, true);
    state = effects.advance(state);
    state = effects.advance({ ...state, tick: 6 });
    assert.equal(effects.get(state, active.value).deadline, 9);
    assert.equal(effects.get(state, active.value).data.ticks, 3);
    for (let tick = 7; tick <= 9; tick++) state = effects.advance({ ...state, tick });
    assert.equal(effects.get(state, active.value), undefined);
    assert.deepEqual(ended, [
        { id: "inactive", tick: 3, data: { ticks: 0, extended: false }, reason: "EXPIRED" },
        { id: "periodic", tick: 9, data: { ticks: 6, extended: true }, reason: "EXPIRED" },
    ]);
});

test("source attribution alone does not bind lifetime, while explicit scope and ownership do", () => {
    const definition = { id: "unit", hooks: [] };
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
