import { Hooks } from "../../dist/core/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import { createCardDefinition } from "../helpers/deployable.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as offense from "../../dist/core/unit/capability/offense/index.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { update, remove, lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import { scope } from "../../dist/core/lifetime/index.js";

const operator = { id: "operator", hooks: Hooks.empty(), offense: { attack: 100 } };

test("installation, participation, and ending preserve completed business and current private state", () => {
    const observed = [];
    const definition = {
        id: "buff",
        initialize: () => ({ activations: 0 }),
        onInstall(state, self) {
            observed.push(["install", self.lifecycle]);
            return effects.setState(state, effects.ref(self), { activations: 1 });
        },
        onEnable(state, self) {
            observed.push(["enable", self.state.activations]);
            return update(
                state,
                self.host,
                offense.setAttackContribution({
                    id: "buff",
                    value: [modifier({ addition: 20 })],
                }),
            );
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
                self.lifecycle,
                self.state.activations,
                offense.resolveAttack(state, units.get(state, self.host)),
            ]);
            return state;
        },
    };
    let state = battle([{ definition: operator, position: [1, 1] }]);
    const owner = units.ref(get(state, 0));
    const installed = effects.install(state, owner, definition, { enabled: false });
    state = installed.state;
    assert.deepEqual(observed, [["install", "INSTALLING"]]);
    state = effects.setEnabled(state, installed.value, true);
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 120);
    state = effects.setEnabled(state, installed.value, false);
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 100);
    state = effects.setEnabled(state, installed.value, true);
    state = effects.end(state, installed.value);
    assert.equal(effects.get(state, installed.value), undefined);
    assert.deepEqual(observed.at(-1), ["end", "ENDING", 3, 100]);

    const instant = {
        id: "instant",
        initialize: () => ({}),
        onInstall(state) {
            observed.push("instant");
            return state;
        },
        onEnable: () => assert.fail("expired installation must not enable"),
        onTick: () => assert.fail("expired installation must not tick"),
        onDisable: () => assert.fail("never-active installation must not disable"),
        onEnd(state) {
            observed.push("instant-ended");
            return state;
        },
    };
    const expired = effects.install(state, owner, instant, {
        expiration: { type: "DURATION", duration: 0, remaining: 0, rate: 1 },
    });
    state = expired.state;
    assert.equal(effects.get(state, expired.value), undefined);
    assert.deepEqual(observed.slice(-2), ["instant", "instant-ended"]);

    const ended = effects.install(state, owner, {
        ...instant,
        id: "self-ending",
        onInstall: (current, self) => effects.end(current, effects.ref(self)),
    });
    assert.equal(effects.get(ended.state, ended.value), undefined);
});

test("DEFAULT retains candidates and installs them before priority and enabled determine participation", () => {
    const installed = [];
    const weak = {
        id: "weak",
        group: { type: "DEFAULT", id: "overall", priority: 1, independentSource: false },
        initialize: () => ({ bonus: 10 }),
        onInstall(state, self) {
            installed.push(self.definition.id);
            return state;
        },
        onEnable: (state, self) =>
            update(
                state,
                self.host,
                offense.setAttackContribution({
                    id: "overall",
                    value: [modifier({ addition: self.state.bonus })],
                }),
            ),
        onDisable: (state, self) =>
            update(state, self.host, offense.removeAttackContribution("overall")),
    };
    const strong = {
        ...weak,
        id: "strong",
        group: { ...weak.group, priority: 2 },
        initialize: () => ({ bonus: 20 }),
    };
    const later = { ...strong, id: "later", initialize: () => ({ bonus: 30 }) };
    let state = battle([{ definition: operator, position: [1, 1] }]);
    const owner = units.ref(get(state, 0));
    const low = effects.install(state, owner, weak);
    const high = effects.install(low.state, owner, strong);
    const equal = effects.install(high.state, owner, later);
    state = equal.state;
    assert.deepEqual(installed, ["weak", "strong", "later"]);
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 120);
    state = effects.setEnabled(state, high.value, false);
    assert.equal(effects.get(state, low.value).lifecycle, "INACTIVE");
    assert.equal(effects.get(state, equal.value).lifecycle, "INACTIVE");
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 100);
    state = effects.end(state, high.value);
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 130);
    state = effects.end(state, equal.value);
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 110);
});

test("time advances independently of participation, publishes before active business, and permits renewal and manual progress", () => {
    const observed = [];
    const ended = [];
    let renewed = false;
    let state = battle([{ definition: operator, position: [1, 1] }]);
    const owner = units.ref(get(state, 0));
    const duration = effects.install(
        state,
        owner,
        {
            id: "duration",
            initialize: () => ({}),
            onTick(current, self, previous) {
                observed.push([previous.remaining, self.expiration.remaining]);
                assert.equal(effects.get(current, effects.ref(self)).expiration, self.expiration);
                if (self.expiration.remaining === 0 && !renewed) {
                    renewed = true;
                    return effects.setExpiration(current, effects.ref(self), {
                        ...self.expiration,
                        remaining: 2,
                    });
                }
                return current;
            },
            onEnd(current) {
                ended.push("duration");
                return current;
            },
        },
        {
            expiration: { type: "DURATION", duration: 3, remaining: 3, rate: 1 },
            enabled: false,
        },
    );
    const deadline = effects.install(
        duration.state,
        owner,
        {
            id: "deadline",
            initialize: () => ({}),
            onTick: () => assert.fail("inactive deadline must not run business"),
            onEnd(current) {
                ended.push("deadline");
                return current;
            },
        },
        { expiration: { type: "DEADLINE", tick: 100 }, enabled: false },
    );
    const manual = effects.install(
        deadline.state,
        owner,
        {
            id: "manual",
            initialize: () => ({}),
            onTick(current, self, previous) {
                assert.equal(previous.remaining, self.expiration.remaining);
                return effects.setExpiration(current, effects.ref(self), {
                    ...self.expiration,
                    remaining: self.expiration.remaining - 1,
                });
            },
            onEnd(current) {
                ended.push("manual");
                return current;
            },
        },
        { expiration: { type: "DURATION", duration: 2, remaining: 2, rate: 0 } },
    );
    state = effects.advance({ ...manual.state, tick: 1 });
    assert.equal(effects.get(state, duration.value).expiration.remaining, 2);
    assert.deepEqual(observed, []);
    state = effects.setExpiration(state, deadline.value, { type: "DEADLINE", tick: 1 });
    assert.notEqual(effects.get(state, deadline.value), undefined);
    state = effects.setEnabled(state, duration.value, true);
    for (let tick = 2; tick <= 5; tick++) state = effects.advance({ ...state, tick });
    assert.deepEqual(observed, [
        [2, 1],
        [1, 0],
        [2, 1],
        [1, 0],
    ]);
    assert.deepEqual(new Set(ended), new Set(["deadline", "manual", "duration"]));
    assert.equal(effects.get(state, duration.value), undefined);
});

test("EXTEND and EXTEND_TIME renew the retained instance without creating incoming content", () => {
    let installations = 0;
    const extend = {
        id: "retained",
        group: { type: "EXTEND", id: "renewal", priority: 0, independentSource: false },
        initialize: () => ({ sampled: "retained" }),
        onInstall(state) {
            installations++;
            return state;
        },
    };
    let state = battle([
        { definition: operator, position: [1, 1] },
        { definition: operator, position: [0, 1] },
    ]);
    const owner = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    const first = effects.install(state, owner, extend, {
        source,
        scopes: [scope(unitLifetime, source)],
        expiration: { type: "DURATION", duration: 3, remaining: 3, rate: 1 },
    });
    state = effects.advance({ ...first.state, tick: 1 });
    const renewed = effects.install(
        state,
        owner,
        {
            ...extend,
            id: "incoming",
            initialize: () => assert.fail("merged input must not initialize a temporary instance"),
            onInstall: () => assert.fail("merged input must not run installation business"),
        },
        { expiration: { type: "DURATION", duration: 7, remaining: 7, rate: 1 } },
    );
    state = renewed.state;
    assert.deepEqual(renewed.value, first.value);
    const retained = effects.get(state, first.value);
    assert.equal(retained.definition, extend);
    assert.deepEqual(retained.state, { sampled: "retained" });
    assert.equal(retained.source, source);
    assert.deepEqual(retained.expiration, { type: "DURATION", duration: 3, remaining: 7, rate: 1 });
    assert.equal(installations, 1);

    const cumulative = {
        id: "cumulative",
        group: { type: "EXTEND_TIME", id: "cumulative", priority: 0, independentSource: false },
        initialize: () => ({}),
    };
    const original = effects.install(state, owner, cumulative, {
        expiration: { type: "DURATION", duration: 3, remaining: 3, rate: 1 },
    });
    state = effects.advance({ ...original.state, tick: 2 });
    const extended = effects.install(state, owner, cumulative, {
        expiration: { type: "DURATION", duration: 4, remaining: 4, rate: 1 },
    });
    assert.deepEqual(extended.value, original.value);
    assert.deepEqual(effects.get(extended.state, original.value).expiration, {
        type: "DURATION",
        duration: 7,
        remaining: 6,
        rate: 1,
    });
    state = remove(extended.state, source, "SCRIPT");
    assert.equal(effects.get(state, first.value), undefined);
    assert.notEqual(effects.get(state, original.value), undefined);
});

test("STACK separates effective output, manual consumption, and natural decay while preserving one instance", () => {
    const changes = [];
    let installations = 0;
    const stacked = {
        id: "stacked",
        group: {
            type: "STACK",
            id: "stacked",
            priority: 0,
            independentSource: false,
            maxCount: 3,
            maxEffectiveCount: 2,
            refreshAtMax: true,
            expirationPolicy: "DECAY",
        },
        initialize: () => ({}),
        onInstall(state) {
            installations++;
            return state;
        },
        onEnable: (state, self) =>
            update(
                state,
                self.host,
                offense.setAttackContribution({
                    id: "stacked",
                    value: [modifier({ addition: 10 * effects.effectiveStackCount(self) })],
                }),
            ),
        onStackChange(state, self, previous) {
            assert.equal(effects.get(state, effects.ref(self)).stackCount, self.stackCount);
            changes.push([previous, self.stackCount, self.expiration.remaining]);
            return update(
                state,
                self.host,
                offense.setAttackContribution({
                    id: "stacked",
                    value: [modifier({ addition: 10 * effects.effectiveStackCount(self) })],
                }),
            );
        },
        onDisable: (state, self) =>
            update(state, self.host, offense.removeAttackContribution("stacked")),
    };
    let state = battle([{ definition: operator, position: [1, 1] }]);
    const owner = units.ref(get(state, 0));
    const first = effects.install(state, owner, stacked, {
        expiration: { type: "DURATION", duration: 2, remaining: 2, rate: 1 },
    });
    state = effects.advance({ ...first.state, tick: 1 });
    const second = effects.install(state, owner, stacked, {
        expiration: { type: "DURATION", duration: 5, remaining: 5, rate: 1 },
    });
    const third = effects.install(second.state, owner, stacked, {
        expiration: { type: "DURATION", duration: 2, remaining: 2, rate: 1 },
    });
    state = effects.advance({ ...third.state, tick: 2 });
    const full = effects.install(state, owner, stacked, {
        expiration: { type: "DURATION", duration: 6, remaining: 6, rate: 1 },
    });
    state = full.state;
    assert.deepEqual(second.value, first.value);
    assert.deepEqual(third.value, first.value);
    assert.deepEqual(full.value, first.value);
    assert.equal(installations, 1);
    assert.equal(effects.get(state, first.value).stackCount, 3);
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 120);
    assert.deepEqual(changes, [
        [1, 2, 5],
        [2, 3, 5],
    ]);
    state = effects.decreaseStack(state, first.value, 1);
    assert.equal(effects.get(state, first.value).expiration.remaining, 6);
    for (let tick = 3; tick <= 8; tick++) state = effects.advance({ ...state, tick });
    assert.equal(effects.get(state, first.value).stackCount, 1);
    assert.equal(effects.get(state, first.value).expiration.remaining, 2);
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 110);
    for (let tick = 9; tick <= 10; tick++) state = effects.advance({ ...state, tick });
    assert.equal(effects.get(state, first.value), undefined);
    assert.equal(offense.resolveAttack(state, units.get(state, owner)), 100);
    assert.deepEqual(changes, [
        [1, 2, 5],
        [2, 3, 5],
        [3, 2, 6],
        [2, 1, 2],
    ]);

    const endTogether = {
        id: "end-together",
        initialize: () => ({}),
        group: {
            ...stacked.group,
            id: "end-together",
            expirationPolicy: "END",
            maxCount: 2,
            refreshAtMax: false,
        },
    };
    const endFirst = effects.install(state, owner, endTogether, {
        expiration: { type: "DURATION", duration: 1, remaining: 1, rate: 1 },
    });
    const endSecond = effects.install(endFirst.state, owner, endTogether, {
        expiration: { type: "DURATION", duration: 1, remaining: 1, rate: 1 },
    });
    const capped = effects.install(endSecond.state, owner, endTogether, {
        expiration: { type: "DURATION", duration: 10, remaining: 10, rate: 1 },
    });
    state = effects.advance({ ...capped.state, tick: 11 });
    assert.equal(effects.get(state, endFirst.value), undefined);
    const consumed = effects.install(state, owner, endTogether);
    state = effects.decreaseStack(consumed.state, consumed.value, 1);
    assert.equal(effects.get(state, consumed.value), undefined);
});

test("UNIQUE groups distinguish Unit and absent sources while source attribution remains independent of scope", () => {
    const definition = {
        id: "independent",
        group: { type: "UNIQUE", id: "independent", priority: 0, independentSource: true },
        initialize: () => ({}),
    };
    let state = battle([
        { definition: operator, position: [0, 0] },
        { definition: operator, position: [0, 1] },
        { definition: operator, position: [1, 1] },
    ]);
    const a = units.ref(get(state, 0));
    const b = units.ref(get(state, 1));
    const owner = units.ref(get(state, 2));
    const first = effects.install(state, owner, definition, { source: a, enabled: false });
    const rejected = effects.install(
        first.state,
        owner,
        {
            ...definition,
            initialize: () => assert.fail("rejected input must not initialize"),
            onInstall: () => assert.fail("rejected input must not install"),
        },
        { source: a },
    );
    assert.equal(rejected.value, null);
    const other = effects.install(rejected.state, owner, definition, { source: b });
    const absent = effects.install(other.state, owner, definition);
    assert.notEqual(other.value, null);
    assert.notEqual(absent.value, null);
    const shared = {
        ...definition,
        group: { ...definition.group, id: "shared", independentSource: false },
    };
    const unpartitioned = effects.install(absent.state, owner, shared, { source: a });
    assert.equal(effects.install(unpartitioned.state, owner, shared, { source: b }).value, null);
    const bound = effects.install(
        unpartitioned.state,
        owner,
        {
            id: "bound",
            initialize: () => ({}),
        },
        { source: a, scopes: [scope(unitLifetime, a)] },
    );
    state = remove(bound.state, a, "SCRIPT");
    assert.equal(effects.get(state, bound.value), undefined);
    assert.equal(effects.get(state, first.value).source, a);
    assert.equal(effects.install(state, owner, definition, { source: a }).value, null);
    state = remove(state, owner, "SCRIPT");
    assert.equal(effects.get(state, first.value), undefined);
    assert.equal(effects.get(state, other.value), undefined);
});

test("source grouping follows persistent Cards across redeployment and keeps Card and Unit identities separate", () => {
    const deployable = {
        ...operator,
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRules: [] },
        card: createCardDefinition(),
    };
    let state = battle([{ definition: operator, position: [1, 1] }], {
        deployment: {
            definition: { initialDp: 0, maxDp: 99, dpRecoveryTicks: null, slotLimit: 2 },
            cards: [deployable, deployable],
        },
    });
    const owner = units.ref(get(state, 0));
    const [a, b] = [...cards.all(state)].map(cards.ref);
    const definition = {
        id: "card-source",
        initialize: () => ({}),
        group: { type: "UNIQUE", id: "card-source", priority: 0, independentSource: true },
    };
    const firstUnit = deployment.deploy(state, deployment.createRequest(state, a, [0, 0]));
    const firstSource = units.ref(get(firstUnit.state, firstUnit.value.unitId));
    const installed = effects.install(firstUnit.state, owner, definition, { source: firstSource });
    state = deployment.retreat(installed.state, firstSource);
    state = deployment.advance(state);
    const redeployed = deployment.deploy(state, deployment.createRequest(state, a, [0, 0]));
    state = redeployed.state;
    assert.equal(redeployed.value.type, "DEPLOYED");
    const nextSource = units.ref(get(state, redeployed.value.unitId));
    assert.notEqual(nextSource.id, firstSource.id);
    assert.equal(effects.install(state, owner, definition, { source: nextSource }).value, null);
    const otherUnit = deployment.deploy(state, deployment.createRequest(state, b, [0, 1]));
    const other = effects.install(otherUnit.state, owner, definition, {
        source: units.ref(get(otherUnit.state, otherUnit.value.unitId)),
    });
    assert.notEqual(other.value, null);
    assert.equal(owner.id, a.id);
    const sameNumberUnit = effects.install(other.state, owner, definition, { source: owner });
    assert.notEqual(sameNumberUnit.value, null);
    assert.equal(effects.get(sameNumberUnit.state, installed.value).source, firstSource);
});
