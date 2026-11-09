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

test("disappearance preserves deployment and lifetimes, releases blocking before cancelling actions, and removes only its rules", () => {
    const departures = [];
    const ended = [];
    let entries = 0;
    const program = {
        id: "attack", intervalTicks: 0, speed: 100,
        initialize: (state) => ({ state, value: {} }),
        prepare: (state) => ({ state, value: {} }),
        onTick: (state) => ({ state, value: false }),
        onEnd(state, _source, _self, end) {
            ended.push(end);
            return state;
        },
    };
    const idle = { ...program, id: "idle" };
    const operator = {
        id: "operator", presence: {},
        hooks: Hooks.empty().set(lifecycle.enter, {
            id: "enter", invoke(state) { entries++; return { state, value: undefined }; },
        }).set(lifecycle.leave, {
            id: "leave", invoke(state, departure) { departures.push(departure); return { state, value: undefined }; },
        }),
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRules: [] },
        blocker: { capacity: 2, layer: "GROUND", rules: [] },
        action: { initialize: (state) => actions.createActions(state, actions.create(program), actions.create(idle)) },
        card: {
            cost: 10, redeployTicks: 10, slots: 1, stock: 1, stockLimit: 1, activeLimit: 1,
            cooldownOnDeploy: false, recoverOnRetreatOrDeath: true, increaseCostOnRetreatOrDeath: true,
            refund: { rate: 0.5, limit: "BASE_COST" }, deploymentRules: [], unitHooks: Hooks.empty(),
            initialize: (state) => ({ state, value: {} }),
        },
    };
    const enemy = {
        id: "enemy", hooks: Hooks.empty(), presence: {},
        blockable: { volume: 1, rules: [] }, layer: { type: "GROUND" },
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
    const actionRef = actions.ref(owner, program);
    const idleAction = actions.ref(owner, idle);
    const started = actions.start(state, actionRef);
    state = started.state;
    const installed = effects.install(state, owner, {
        id: "ordinary-duration", initialize: () => ({}),
    }, { expiration: { type: "DURATION", elapsed: 0, total: 3, rate: 1 } });
    state = installed.state;
    for (const target of targets) state = blocking.acquire(state, owner, target);
    let notifications = 0;
    state = update(state, owner, units.compose(block.setBlockerHook("released", {
        id: "observe-published-restrictions",
        invoke(current) {
            notifications++;
            assert.equal(get(current, owner.id).presence.present, false);
            assert.deepEqual(blocking.blocked(current, owner), []);
            assert.ok(targets.every((target) => blocking.blockerOf(current, target) === undefined));
            assert.equal(actions.getExecution(current, started.value.ref).execution.lifecycle, "RUNNING");
            assert.equal(actions.start(current, idleAction).value.reason, "RULE");
            current = blocking.acquire(current, owner, targets[0]);
            assert.deepEqual(blocking.blocked(current, owner), []);
            return { state: current, value: undefined };
        },
    }), presence.disappear()));
    assert.equal(notifications, 2);
    assert.equal(get(state, owner.id).lifecycle, "PRESENT");
    assert.deepEqual(get(state, owner.id).position, [2, 1]);
    assert.equal(get(state, owner.id).occupancy.pair, pair);
    assert.equal(get(state, 0).occupancy.pair, pair);
    assert.equal(state.deployment.usedSlots, 1);
    assert.equal(state.deployment.dp, 10);
    assert.equal(cards.get(state, card).stock, 0);
    assert.equal(entries, 1);
    assert.deepEqual(departures, []);
    assert.equal(actions.getExecution(state, started.value.ref), undefined);
    assert.deepEqual(ended, [{ type: "CANCELLED", reason: "SOURCE_ABSENT" }]);
    state = effects.advance({ ...state, tick: 1 });
    assert.equal(effects.get(state, installed.value).expiration.elapsed, 1);
    state = effects.advance({ ...state, tick: 2 });
    state = effects.advance({ ...state, tick: 3 });
    assert.equal(effects.get(state, installed.value), undefined);
    assert.equal(get(state, owner.id).lifecycle, "PRESENT");

    state = update(state, owner, action.setRule({ id: "other-source", allows: () => false }));
    state = update(state, owner, presence.appear([2, 1]));
    assert.equal(actions.start(state, actionRef).value.reason, "RULE");
    state = update(state, owner, action.removeRule("other-source"));
    const restarted = actions.start(state, actionRef);
    assert.equal(restarted.value.type, "STARTED");
    assert.equal(actions.getExecution(restarted.state, restarted.value.ref).execution.lifecycle, "RUNNING");
});
