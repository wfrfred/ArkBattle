import test from "node:test";
import assert from "node:assert/strict";
import { Hooks } from "../../dist/core/hook.js";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as lifecycle from "../../dist/core/unit/hook.js";
import { update } from "../../dist/core/battle/unit.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as block from "../../dist/core/unit/capability/blocking/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import * as action from "../../dist/core/unit/capability/action/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";

test("disappearance preserves deployment and lifetimes, publishes restrictions before release, and cleans only captured executions", () => {
    const departures = [];
    const ended = [];
    let entries = 0;
    const program = (id) => ({
        id, intervalTicks: 0, speed: 100,
        initialize: (state) => ({ state, value: {} }),
        prepare: (state) => ({ state, value: {} }),
        onTick: (state) => ({ state, value: false }),
        onEnd(state, _source, _self, end) {
            ended.push([id, end]);
            return state;
        },
    });
    const original = program("original");
    const replacement = program("replacement");
    const operator = {
        id: "operator", spatialPresence: {},
        hooks: Hooks.empty().set(lifecycle.enter, {
            id: "enter", invoke(state) { entries++; return { state, value: undefined }; },
        }).set(lifecycle.leave, {
            id: "leave", invoke(state, departure) { departures.push(departure); return { state, value: undefined }; },
        }),
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRules: [] },
        blocker: { capacity: 2, layer: "GROUND", rules: [] },
        action: { initialize: (state) => actions.createActions(state, actions.create(original), actions.create(replacement)) },
        card: {
            cost: 10, redeployTicks: 10, slots: 1, stock: 1, stockLimit: 1, activeLimit: 1,
            cooldownOnDeploy: false, recoverOnLeave: true, increaseCostOnLeave: true,
            refund: { rate: 0.5, limit: "BASE_COST" }, deploymentRules: [], unitHooks: Hooks.empty(),
            initialize: (state) => ({ state, value: {} }),
        },
    };
    const enemy = {
        id: "enemy", hooks: Hooks.empty(), spatialPresence: {},
        blockable: { volume: 1 }, layer: { type: "GROUND" },
    };
    let state = battle([
        { definition: { id: "support", hooks: Hooks.empty(), occupancy: { slot: "SUPPORT" } }, position: [2, 1], initial: { occupancy: { tile: [1, 2] } } },
        { definition: enemy, position: [2.1, 1] },
        { definition: enemy, position: [2.2, 1] },
    ], { deployment: {
        definition: { initialDp: 20, maxDp: 99, dpRecoveryTicks: null, slotLimit: 1 },
        cards: [operator],
    } });
    const card = cards.ref([...cards.all(state)][0]);
    const deployed = deployment.deploy(state, deployment.createRequest(state, card, [1, 2]));
    assert.equal(deployed.value.type, "DEPLOYED");
    state = deployed.state;
    const owner = units.ref(get(state, deployed.value.unitId));
    const targets = [1, 2].map((id) => units.ref(get(state, id)));
    const pair = get(state, owner.id).occupancy.pair;
    assert.ok(pair);
    const actionRef = actions.ref(owner, original);
    const nextAction = actions.ref(owner, replacement);
    const started = actions.start(state, actionRef);
    state = started.state;
    const installed = effects.install(state, owner, {
        id: "ordinary-duration", initialize: () => ({}),
    }, { expiration: { type: "DURATION", elapsed: 0, total: 3, rate: 1 } });
    state = installed.state;
    for (const target of targets) state = blocking.acquire(state, owner, target);
    let notifications = 0;
    state = update(state, units.combine([block.setBlockerHook(owner, "released", {
        id: "observe-published-restrictions",
        invoke(current) {
            notifications++;
            assert.equal(get(current, owner.id).spatialPresence.present, false);
            assert.deepEqual(blocking.blocked(current, owner), []);
            assert.ok(targets.every((target) => blocking.blockerOf(current, target) === undefined));
            assert.equal(actions.start(current, nextAction).value.reason, "RULE");
            current = blocking.acquire(current, owner, targets[0]);
            assert.deepEqual(blocking.blocked(current, owner), []);
            return { state: current, value: undefined };
        },
    }), presence.disappear(owner)]));
    assert.equal(notifications, 2);
    assert.equal(get(state, owner.id).lifecycle, "PRESENT");
    assert.deepEqual(get(state, owner.id).position, [2, 1]);
    assert.equal(get(state, owner.id).occupancy.pair, pair);
    assert.equal(get(state, 0).occupancy.pair, pair);
    assert.equal(deployment.usedSlots(state), 1);
    assert.equal(state.deployment.dp, 10);
    assert.equal(cards.get(state, card).stock, 0);
    assert.equal(entries, 1);
    assert.deepEqual(departures, []);
    assert.equal(actions.getExecution(state, started.value.ref), undefined);
    assert.deepEqual(ended, [["original", { type: "CANCELLED", reason: "SOURCE_ABSENT" }]]);
    state = effects.advance({ ...state, tick: 1 });
    assert.equal(effects.get(state, installed.value).expiration.elapsed, 1);
    state = effects.advance({ ...state, tick: 2 });
    state = effects.advance({ ...state, tick: 3 });
    assert.equal(effects.get(state, installed.value), undefined);
    assert.equal(get(state, owner.id).lifecycle, "PRESENT");

    state = update(state, action.setRule(owner, { id: "other-source", allows: () => false }));
    state = update(state, presence.appear(owner, [2, 1]));
    assert.equal(actions.start(state, nextAction).value.reason, "RULE");
    state = update(state, action.removeRule(owner, "other-source"));
    const old = actions.start(state, actionRef);
    state = old.state;
    for (const target of targets) state = blocking.acquire(state, owner, target);
    let resumed;
    notifications = 0;
    state = update(state, units.combine([block.setBlockerHook(owner, "released", {
        id: "observe-published-restrictions",
        invoke(current) {
            notifications++;
            if (notifications === 1) {
                current = update(current, units.combine([
                    presence.appear(owner, [2, 1]),
                    block.removeBlockerRule(owner, "earlier-release"),
                ]));
                const next = actions.start(current, nextAction);
                assert.equal(next.value.type, "STARTED");
                resumed = next.value.ref;
                current = blocking.acquire(next.state, owner, targets[0]);
            }
            return { state: current, value: undefined };
        },
    }), block.setBlockerRule(owner, { id: "earlier-release", allows: () => false }), presence.disappear(owner)]));
    assert.equal(notifications, 2);
    assert.equal(get(state, owner.id).spatialPresence.present, true);
    assert.equal(actions.getExecution(state, old.value.ref), undefined);
    assert.equal(actions.getExecution(state, resumed).execution.status, "RUNNING");
    assert.deepEqual(blocking.blocked(state, owner).map(({ id }) => id), [targets[0].id]);
    assert.equal(get(state, owner.id).occupancy.pair, pair);
    assert.equal(entries, 1);
    assert.deepEqual(departures, []);
});
