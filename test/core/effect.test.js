// Contract: [effect](../../docs/architecture/effect.md).
import { attribute as defineAttribute } from "../helpers/attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import { createCardDefinition } from "../helpers/deployable.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/effect/index.js";
import * as offense from "../../dist/core/unit/capability/offense/index.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/deck/card/index.js";
import { create as modifier } from "../../dist/core/common/modifier.js";
import { update, remove } from "../../dist/core/unit/operations.js";
import { step } from "../../dist/core/battle/runtime.js";
import { effectInitial } from "../helpers/effect.js";

const operator = { id: "operator", hooks: Hooks.empty(), offense: { attack: defineAttribute(100) } };

test("unhosted and Card effects share the lifecycle and keep host groups independent", () => {
    const trace = [];
    const group = { id: "global-rule", type: "UNIQUE" };
    const controller = {
        id: "global-rule",
        group,
        initialize: () => ({ count: 0 }),
        onInstall(state) {
            trace.push("install");
            return state;
        },
        onEnable(state) {
            trace.push("enable");
            return state;
        },
        onDisable(state, self) {
            trace.push(["disable", self.lifecycle]);
            return effects.setState(state, effects.ref(self), { count: self.state.count + 1 });
        },
        onTick: (state, self) =>
            effects.setState(state, effects.ref(self), { count: self.state.count + 2 }),
        onEnd(state, self) {
            trace.push(["end", self.state.count]);
            return state;
        },
    };
    const initial = battle([], {
        initialEffects: [{ initial: effectInitial, definition: controller }],
        deployment: {
            definition: {
                dp: { initial: 0, min: 0, max: 99, recoveryInterval: null },
                slot: { limit: 1 },
            },
            cards: [{
                definition: createCardDefinition(),
                unitDefinition: {
                    ...operator,
                    occupancy: { slot: "OCCUPANT" },
                    deployable: { retreatRestrictions: [], refund: null },
                },
            }],
        },
    });
    const controllerRef = effects.ref(effects.forHost(initial, null).find(self =>
        self.definition === controller,
    ));
    const card = cards.ref(cards.all(initial).find(() => true));
    const linked = effects.install(initial, card, {
        id: "card-dependent", group, initialize: () => ({}),
        onEnd(state) {
            trace.push("dependent");
            return state;
        },
    }, { ...effectInitial, scopes: [controllerRef] });
    let state = effects.setEnabled(linked.state, controllerRef, false);
    state = step(state, []);
    assert.equal(controllerRef.get(state).state.count, 1);
    state = effects.setEnabled(state, controllerRef, true);
    state = step(state, []);
    state = effects.remove(state, controllerRef);
    assert.equal(controllerRef.get(state), undefined);
    assert.equal(linked.value.get(state), undefined);
    assert.ok(card.get(state));
    assert.deepEqual(trace, [
        "install", "enable", ["disable", "INACTIVE"], "enable",
        ["disable", "ENDING"], "dependent", ["end", 4],
    ]);
});

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
                self.ref.host,
                offense.setAttackContribution({
                    id: "buff",
                    value: [modifier({ addition: 20 })],
                }),
            );
        },
        onDisable(state, self) {
            state = update(state, self.ref.host, offense.removeAttackContribution("buff"));
            return effects.setState(state, effects.ref(self), {
                activations: self.state.activations + 1,
            });
        },
        onEnd(state, self) {
            observed.push([
                "end",
                self.lifecycle,
                self.state.activations,
                offense.resolveAttack(state, self.ref.host.get(state)),
            ]);
            return state;
        },
    };
    let state = battle([{ definition: operator, position: [1, 1] }]);
    const owner = units.ref(get(state, 0));
    const installed = effects.install(state, owner, definition, { ...effectInitial, enabled: false });
    state = installed.state;
    assert.deepEqual(observed, [["install", "INSTALLING"]]);
    state = effects.setEnabled(state, installed.value, true);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 120);
    state = effects.setEnabled(state, installed.value, false);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 100);
    state = effects.setEnabled(state, installed.value, true);
    state = effects.remove(state, installed.value);
    assert.equal(installed.value.get(state), undefined);
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
        ...effectInitial,
        expiration: { type: "DURATION", duration: 0, remaining: 0, rate: 1 },
    });
    state = expired.state;
    assert.equal(expired.value.get(state), undefined);
    assert.deepEqual(observed.slice(-2), ["instant", "instant-ended"]);

    const ended = effects.install(state, owner, {
        ...instant,
        id: "self-ending",
        onInstall: (current, self) => effects.remove(current, effects.ref(self)),
    }, effectInitial);
    assert.equal(ended.value.get(ended.state), undefined);

    const renewed = effects.install(state, owner, {
        ...instant,
        id: "renewed-on-install",
        onInstall: (current, self) => effects.setExpiration(current, effects.ref(self), {
            type: "DURATION", duration: 2, remaining: 2, rate: 1,
        }),
        onEnable(current, self) {
            observed.push(["renewed", self.expiration.remaining]);
            return current;
        },
    }, { ...effectInitial, expiration: { type: "DURATION", duration: 0, remaining: 0, rate: 1 } });
    assert.equal(renewed.value.get(renewed.state).lifecycle, "ACTIVE");
    assert.deepEqual(observed.at(-1), ["renewed", 2]);
});

test("DEFAULT retains candidates and installs them before priority and enabled determine participation", () => {
    const installed = [];
    const weak = {
        id: "weak",
        group: { type: "DEFAULT", id: "overall", priority: 1 },
        initialize: () => ({ bonus: 10 }),
        onInstall(state, self) {
            installed.push(self.definition.id);
            return state;
        },
        onEnable: (state, self) =>
            update(
                state,
                self.ref.host,
                offense.setAttackContribution({
                    id: "overall",
                    value: [modifier({ addition: self.state.bonus })],
                }),
            ),
        onDisable: (state, self) =>
            update(state, self.ref.host, offense.removeAttackContribution("overall")),
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
    const low = effects.install(state, owner, weak, effectInitial);
    const high = effects.install(low.state, owner, strong, effectInitial);
    const equal = effects.install(high.state, owner, later, effectInitial);
    state = equal.state;
    assert.deepEqual(installed, ["weak", "strong", "later"]);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 120);
    state = effects.setEnabled(state, high.value, false);
    assert.equal(low.value.get(state).lifecycle, "INACTIVE");
    assert.equal(equal.value.get(state).lifecycle, "INACTIVE");
    assert.equal(offense.resolveAttack(state, owner.get(state)), 100);
    state = effects.remove(state, high.value);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 130);
    state = effects.remove(state, equal.value);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 110);
});

test("time advances independently of participation, publishes before active business, and permits renewal and manual progress", () => {
    const observed = [];
    const ended = [];
    const laterTicks = [];
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
                assert.equal(effects.ref(self).get(current).expiration, self.expiration);
                if (current.tick === 2) {
                    return effects.install(current, self.ref.host, {
                        id: "added-during-tick",
                        initialize: () => ({}),
                        onTick(next) {
                            laterTicks.push(next.tick);
                            return next;
                        },
                    }, { ...effectInitial, expiration: { type: "DEADLINE", tick: 3 } }).state;
                }
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
            ...effectInitial,
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
        { ...effectInitial, expiration: { type: "DEADLINE", tick: 100 }, enabled: false },
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
        { ...effectInitial, expiration: { type: "DURATION", duration: 2, remaining: 2, rate: 0 } },
    );
    state = effects.advance({ ...manual.state, tick: 1 });
    assert.equal(duration.value.get(state).expiration.remaining, 2);
    assert.deepEqual(observed, []);
    state = effects.setExpiration(state, deadline.value, { type: "DEADLINE", tick: 1 });
    assert.notEqual(deadline.value.get(state), undefined);
    state = effects.setEnabled(state, duration.value, true);
    for (let tick = 2; tick <= 5; tick++) state = effects.advance({ ...state, tick });
    assert.deepEqual(observed, [
        [2, 1],
        [1, 0],
        [2, 1],
        [1, 0],
    ]);
    assert.deepEqual(new Set(ended), new Set(["deadline", "manual", "duration"]));
    assert.deepEqual(laterTicks, [3]);
    assert.equal(duration.value.get(state), undefined);
});

test("EXTEND and EXTEND_TIME renew the retained instance without creating incoming content", () => {
    let installations = 0;
    const extend = {
        id: "retained",
        group: { type: "EXTEND", id: "renewal" },
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
        ...effectInitial,
        source,
        scopes: [source],
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
        { ...effectInitial, expiration: { type: "DURATION", duration: 7, remaining: 7, rate: 1 } },
    );
    state = renewed.state;
    assert.equal(renewed.value, first.value);
    const retained = first.value.get(state);
    assert.equal(retained.definition, extend);
    assert.deepEqual(retained.state, { sampled: "retained" });
    assert.equal(retained.source, source);
    assert.deepEqual(retained.expiration, { type: "DURATION", duration: 3, remaining: 7, rate: 1 });
    assert.equal(installations, 1);
    assert.throws(
        () => effects.install(state, owner, {
            ...extend,
            id: "incompatible-default",
            group: { ...extend.group, type: "DEFAULT" },
            initialize: () => assert.fail("incompatible group must be detected before installation"),
        }, effectInitial),
        { name: "TypeError", message: /renewal/ },
    );

    const cumulative = {
        id: "cumulative",
        group: { type: "EXTEND_TIME", id: "cumulative" },
        initialize: () => ({}),
    };
    const original = effects.install(state, owner, cumulative, {
        ...effectInitial,
        expiration: { type: "DURATION", duration: 3, remaining: 3, rate: 1 },
    });
    state = effects.advance({ ...original.state, tick: 2 });
    const extended = effects.install(state, owner, cumulative, {
        ...effectInitial,
        expiration: { type: "DURATION", duration: 4, remaining: 4, rate: 1 },
    });
    assert.equal(extended.value, original.value);
    assert.deepEqual(original.value.get(extended.state).expiration, {
        type: "DURATION",
        duration: 7,
        remaining: 6,
        rate: 1,
    });
    state = remove(extended.state, source, { reason: "SCRIPT" });
    assert.equal(first.value.get(state), undefined);
    assert.notEqual(original.value.get(state), undefined);
});

test("STACK separates effective output, manual consumption, and natural decay while preserving one instance", () => {
    const changes = [];
    let installations = 0;
    const stacked = {
        id: "stacked",
        group: {
            type: "STACK",
            id: "stacked",
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
                self.ref.host,
                offense.setAttackContribution({
                    id: "stacked",
                    value: [modifier({ addition: 10 * effects.stacks(self) })],
                }),
            ),
        onStackChange(state, self, previous) {
            assert.equal(effects.ref(self).get(state).stackCount, self.stackCount);
            changes.push([previous, self.stackCount, self.expiration.remaining]);
            if (self.lifecycle !== "ACTIVE") {
                return state;
            }
            return update(
                state,
                self.ref.host,
                offense.setAttackContribution({
                    id: "stacked",
                    value: [modifier({ addition: 10 * effects.stacks(self) })],
                }),
            );
        },
        onDisable: (state, self) =>
            update(state, self.ref.host, offense.removeAttackContribution("stacked")),
    };
    let state = battle([{ definition: operator, position: [1, 1] }]);
    const owner = units.ref(get(state, 0));
    assert.throws(() => effects.install(state, owner, stacked, {
        ...effectInitial,
        expiration: { type: "DEADLINE", tick: 10 },
    }), TypeError);
    const first = effects.install(state, owner, stacked, {
        ...effectInitial,
        expiration: { type: "DURATION", duration: 2, remaining: 2, rate: 1 },
    });
    assert.throws(() => effects.setExpiration(first.state, first.value, {
        type: "DEADLINE", tick: 10,
    }), TypeError);
    state = effects.advance({ ...first.state, tick: 1 });
    const incoming = {
        ...stacked,
        id: "incoming-stack",
        group: { ...stacked.group, maxCount: 1, maxEffectiveCount: 1, refreshAtMax: false },
    };
    const second = effects.install(state, owner, incoming, {
        ...effectInitial,
        expiration: { type: "DURATION", duration: 5, remaining: 5, rate: 1 },
    });
    const third = effects.install(second.state, owner, stacked, {
        ...effectInitial,
        expiration: { type: "DURATION", duration: 2, remaining: 2, rate: 1 },
    });
    state = effects.advance({ ...third.state, tick: 2 });
    const full = effects.install(state, owner, incoming, {
        ...effectInitial,
        expiration: { type: "DURATION", duration: 6, remaining: 6, rate: 1 },
    });
    state = full.state;
    assert.equal(second.value, first.value);
    assert.equal(third.value, first.value);
    assert.equal(full.value, first.value);
    assert.equal(installations, 1);
    assert.equal(first.value.get(state).stackCount, 3);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 120);
    assert.deepEqual(changes, [
        [1, 2, 5],
        [2, 3, 5],
    ]);
    state = effects.setEnabled(state, first.value, false);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 100);
    state = effects.decreaseStack(state, first.value, 1);
    assert.equal(first.value.get(state).expiration.remaining, 6);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 100);
    for (let tick = 3; tick <= 8; tick++) state = effects.advance({ ...state, tick });
    assert.equal(first.value.get(state).stackCount, 1);
    assert.equal(first.value.get(state).expiration.remaining, 2);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 100);
    state = effects.setEnabled(state, first.value, true);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 110);
    for (let tick = 9; tick <= 10; tick++) state = effects.advance({ ...state, tick });
    assert.equal(first.value.get(state), undefined);
    assert.equal(offense.resolveAttack(state, owner.get(state)), 100);
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
        ...effectInitial,
        expiration: { type: "DEADLINE", tick: 11 },
    });
    assert.throws(
        () => effects.install(endFirst.state, owner, {
            ...endTogether,
            id: "incompatible-decay",
            group: { ...endTogether.group, expirationPolicy: "DECAY" },
        }, effectInitial),
        { name: "TypeError", message: /end-together/ },
    );
    const endSecond = effects.install(endFirst.state, owner, endTogether, {
        ...effectInitial,
        expiration: { type: "DURATION", duration: 1, remaining: 1, rate: 1 },
    });
    const capped = effects.install(endSecond.state, owner, endTogether, {
        ...effectInitial,
        expiration: { type: "DURATION", duration: 10, remaining: 10, rate: 1 },
    });
    state = effects.advance({ ...capped.state, tick: 11 });
    assert.equal(endFirst.value.get(state), undefined);
    const consumed = effects.install(state, owner, endTogether, effectInitial);
    state = effects.decreaseStack(consumed.state, consumed.value, 1);
    assert.equal(consumed.value.get(state), undefined);
});

test("UNIQUE groups distinguish shared, Unit, and absent sources while source attribution remains independent of scope", () => {
    const definition = {
        id: "independent",
        group: {
            type: "UNIQUE", id: "independent",
            partition: (battle, source) => source?.get(battle) === undefined ? null : source,
        },
        initialize: () => ({}),
    };
    const bySource = {
        ...definition,
        group: { ...definition.group, partition: (_battle, source) => source },
    };
    let state = battle([
        { definition: operator, position: [0, 0] },
        { definition: operator, position: [0, 1] },
        { definition: operator, position: [1, 1] },
    ]);
    const a = units.ref(get(state, 0));
    const b = units.ref(get(state, 1));
    const owner = units.ref(get(state, 2));
    const first = effects.install(state, owner, definition, { ...effectInitial, source: a, enabled: false });
    const rejected = effects.install(
        first.state,
        owner,
        {
            ...bySource,
            initialize: () => assert.fail("rejected input must not initialize"),
            onInstall: () => assert.fail("rejected input must not install"),
        },
        { ...effectInitial, source: a },
    );
    assert.equal(rejected.value, null);
    const other = effects.install(rejected.state, owner, definition, { ...effectInitial, source: b });
    const absent = effects.install(other.state, owner, definition, effectInitial);
    assert.notEqual(other.value, null);
    assert.notEqual(absent.value, null);
    const shared = {
        ...definition,
        group: { type: "UNIQUE", id: "independent" },
    };
    const unpartitioned = effects.install(absent.state, owner, shared, { ...effectInitial, source: a });
    assert.notEqual(unpartitioned.value, null);
    assert.equal(unpartitioned.value.get(unpartitioned.state).lifecycle, "ACTIVE");
    assert.equal(absent.value.get(unpartitioned.state).lifecycle, "ACTIVE");
    assert.equal(effects.install(unpartitioned.state, owner, shared, { ...effectInitial, source: b }).value, null);
    const bound = effects.install(
        unpartitioned.state,
        owner,
        {
            id: "bound",
            initialize: () => ({}),
        },
        { ...effectInitial, source: a, scopes: [a] },
    );
    state = remove(bound.state, a, { reason: "SCRIPT" });
    assert.equal(bound.value.get(state), undefined);
    assert.equal(first.value.get(state).source, a);
    assert.equal(effects.install(state, owner, bySource, { ...effectInitial, source: a }).value, null);
    state = remove(state, owner, { reason: "SCRIPT" });
    assert.equal(first.value.get(state), undefined);
    assert.equal(other.value.get(state), undefined);
});

test("source grouping follows persistent Cards across redeployment and keeps Card and Unit identities separate", () => {
    const deployable = {
        ...operator,
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRestrictions: [], refund: null },
    };
    const card = { definition: createCardDefinition(), unitDefinition: deployable };
    let state = battle([{ definition: operator, position: [1, 1] }], {
        deployment: {
            definition: {
                dp: { initial: 0, min: 0, max: 99, recoveryInterval: null },
                slot: { limit: 2 },
            },
            cards: [card, card],
        },
    });
    const owner = units.ref(get(state, 0));
    const [a, b] = [...cards.all(state)].map(cards.ref);
    const definition = {
        id: "card-source",
        initialize: () => ({}),
        group: { type: "UNIQUE", id: "card-source", partition: deployment.sourceIdentity },
    };
    const firstUnit = deployment.deploy(state, deployment.createRequest(state, a, [0, 0]));
    const firstSource = firstUnit.value.unit;
    const installed = effects.install(firstUnit.state, owner, definition, { ...effectInitial, source: firstSource });
    state = deployment.retreat(installed.state, firstSource);
    assert.equal(firstSource.get(state), undefined);
    assert.equal(effects.install(state, owner, definition, { ...effectInitial, source: firstSource }).value, null);
    state = effects.remove(state, installed.value);
    const delayed = {
        ...definition,
        id: "delayed-card-source",
        group: { ...definition.group, id: "delayed-card-source" },
    };
    const lateInstall = effects.install(state, owner, delayed, { ...effectInitial, source: firstSource });
    state = lateInstall.state;
    assert.notEqual(lateInstall.value, null);
    const redeployed = deployment.deploy(state, deployment.createRequest(state, a, [0, 0]));
    state = redeployed.state;
    assert.equal(redeployed.value.type, "DEPLOYED");
    const nextSource = redeployed.value.unit;
    assert.notEqual(nextSource, firstSource);
    assert.equal(effects.install(state, owner, delayed, { ...effectInitial, source: nextSource }).value, null);
    const otherUnit = deployment.deploy(state, deployment.createRequest(state, b, [0, 1]));
    const other = effects.install(otherUnit.state, owner, delayed, {
        ...effectInitial,
        source: otherUnit.value.unit,
    });
    assert.notEqual(other.value, null);
    const unitSource = effects.install(other.state, owner, delayed, { ...effectInitial, source: owner });
    assert.notEqual(unitSource.value, null);
    assert.equal(lateInstall.value.get(unitSource.state).source, firstSource);
});
