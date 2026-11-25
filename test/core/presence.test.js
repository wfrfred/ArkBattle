// Contract: [presence](../../docs/architecture/presence.md).
import { attribute as defineAttribute } from "../helpers/attribute.js";
import test from "node:test";
import assert from "node:assert/strict";
import { Hooks } from "../../dist/core/hook.js";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as lifecycle from "../../dist/core/unit/hook.js";
import { update } from "../../dist/core/unit/operations.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as block from "../../dist/core/unit/capability/blocking/index.js";
import * as actions from "../../dist/core/unit/capability/action/index.js";
import * as effects from "../../dist/core/effect/index.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/deck/card/index.js";
import { step } from "../../dist/core/battle/runtime.js";
import { effectInitial } from "../helpers/effect.js";

test("disappearance preserves deployment and lifetimes, releases blocking before cancelling actions, and removes only its restrictions", () => {
    const departures = [];
    const ended = [];
    let entries = 0;
    const program = {
        id: "attack", applyWay: "NONE", period: { type: "FIXED", ticks: 0 },
        initialize: (state) => ({ state, value: {} }),
        prepare: (state) => ({ state, value: {} }),
        onTick: state => state,
        onEnd(state, _source, _self, end) {
            ended.push(end);
            return state;
        },
    };
    const idle = { ...program, id: "idle" };
    const operator = {
        id: "operator", presence: {},
        hooks: Hooks.empty().set(lifecycle.entered, {
            id: "enter", priority: 0, invoke(state) { entries++; return { state, value: undefined }; },
        }).set(lifecycle.removed, {
            id: "leave", priority: 0, invoke(state, departure) { departures.push(departure); return { state, value: undefined }; },
        }),
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRestrictions: [], refund: { rate: 0.5, limit: "BASE_COST" } },
        blocker: { capacity: 2, layer: "GROUND", radius: null, restrictions: [] },
        action: { speed: defineAttribute(100, 20), interval: defineAttribute(10), definitions: [program, idle] },
    };

    const cardDefinition = {
        policy: "UNIQUE",
        dp: {
            parameters: cards.dp.create({ cost: 10, step: 0.5, maxMultiplier: 2 }), increase: true,
        },
        slot: 1,
        supply: {
            stock: 1, stockLimit: 1, activeLimit: 1, cooldown: 10,
        },
        deploymentRestrictions: [], hooks: Hooks.empty(),
        initialize: (state) => ({ state, value: {} }),
    };
    const enemy = {
        id: "enemy", hooks: Hooks.empty(), presence: {},
        blockable: { volume: 1, restrictions: [] }, layer: { type: "GROUND" },
    };
    let state = battle([
        { definition: { id: "support", hooks: Hooks.empty(), occupancy: { slot: "SUPPORT" } }, hooks: Hooks.empty(), position: [2, 1], initial: { occupancy: { tile: [1, 2], direction: null } } },
        { definition: enemy, hooks: Hooks.empty(), initial: {}, position: [2.1, 1] },
        { definition: enemy, hooks: Hooks.empty(), initial: {}, position: [2.2, 1] },
    ], { deployment: {
        definition: {
            costCeiling: 99,
            dp: { initial: 20, min: 0, max: 99, recoveryInterval: null },
            slot: { limit: 1 },
        },
        cards: [{ definition: cardDefinition, unitDefinition: operator }],
    } });
    const card = cards.ref([...cards.all(state)][0]);
    const deployed = deployment.deploy(state, deployment.createRequest(state, card, [1, 2], null));
    assert.equal(deployed.value.type, "DEPLOYED");
    state = deployed.state;
    const owner = deployed.value.unit;
    const targets = [1, 2].map((id) => units.ref(get(state, id)));
    const pair = owner.get(state).occupancy.pair;
    assert.ok(pair);
    const actionRef = actions.ref(owner.get(state).action.actions.get(program));
    const idleAction = actions.ref(owner.get(state).action.actions.get(idle));
    const started = actions.start(state, actionRef);
    state = started.state;
    const installed = effects.install(state, owner, {
        id: "ordinary-duration", group: null, initialize: () => ({}),
    }, { ...effectInitial, expiration: { type: "DURATION", duration: 3, remaining: 3, rate: 1 } });
    state = installed.state;
    for (const target of targets) state = blocking.acquire(state, owner, target);
    let notifications = 0;
    state = update(state, owner, units.compose(units.setHook(block.blockerReleased, {
        id: "observe-published-restrictions", priority: 0,
        invoke(current) {
            notifications++;
            assert.equal(owner.get(current).presence.present, false);
            assert.deepEqual(blocking.blocked(current, owner), []);
            assert.ok(targets.every((target) => blocking.blockerOf(current, target) === undefined));
            assert.equal(started.value.get(current).lifecycle, "ACTIVE");
            assert.equal(actions.start(current, idleAction).value, null);
            current = blocking.acquire(current, owner, targets[0]);
            assert.deepEqual(blocking.blocked(current, owner), []);
            return { state: current, value: undefined };
        },
    }), presence.disappear()));
    assert.equal(notifications, 2);
    assert.equal(owner.get(state).lifecycle, "ACTIVE");
    assert.deepEqual(owner.get(state).position, [2, 1]);
    assert.equal(owner.get(state).occupancy.pair, pair);
    assert.equal(get(state, 0).occupancy.pair, pair);
    assert.equal(state.deployment.slot.used, 1);
    assert.equal(entries, 1);
    assert.deepEqual(departures, []);
    assert.equal(started.value.get(state), undefined);
    assert.deepEqual(ended, [{ type: "CANCELLED", reason: "SOURCE_ABSENT" }]);
    assert.ok(installed.value.get(state));

    state = step(state, []);
    state = update(state, owner, actions.setRestriction({ id: "other-source", group: null, value: { allows: () => false } }));
    state = update(state, owner, presence.appear([2, 1]));
    assert.equal(actions.start(state, actionRef).value, null);
    state = update(state, owner, actions.removeRestriction("other-source"));
    const restarted = actions.start(state, actionRef);
    assert.notEqual(restarted.value, null);
    assert.equal(restarted.value.get(restarted.state).lifecycle, "ACTIVE");
});
