// Contract: [ARCHITECTURE](../../docs/architecture/ARCHITECTURE.md#战斗状态的层级).
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as mechanisms from "../../dist/core/mechanism/index.js";
import { step } from "../../dist/core/battle/runtime.js";
import { dp } from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/deck/card/index.js";
import * as skills from "../../dist/core/unit/capability/skill/index.js";

const account = {
    dp: { initial: 20, min: 0, max: 99, recoveryInterval: null },
    slot: { limit: 1 },
};
const cardDefinition = {
    dp: { cost: 5, increaseCostOnRetreatOrDeath: false, refund: null },
    slot: 1,
    supply: {
        stock: 1, stockLimit: 1, activeLimit: 1, cooldown: 0,
        policy: { type: "UNIQUE" },
    },
    deploymentRestrictions: [], unitHooks: Hooks.empty(),
    initialize: (current) => ({ state: current, value: {} }),
};

test("initial and scheduled entry see registered battle facts and preserve their resource operations", () => {
    const entered = [];
    const controller = {
        id: "controller",
        initialize: () => ({}),
        onEnter(current) {
            assert.ok(cards.all(current).find(card => card.definition === cardDefinition));
            entered.push("controller");
            return current;
        },
    };
    const plan = {
        motionMode: "WALK",
        startPosition: [0, 5],
        endPosition: [0, 6],
        checkpoints: [{ type: "WAIT", anchor: "ENTER", tick: 30, timer: null }],
        requireAllCheckpoints: true,
    };
    const scheduled = {
        id: "scheduled",
        route: { alwaysCheckCurrentPoint: true },
        hooks: Hooks.empty().set(units.entered, {
            id: "observe-birth",
            invoke(current, self) {
                assert.equal(get(current, self.id).definition.id, "scheduled");
                assert.equal(current.deployment.dp.balance, 22);
                entered.push(self.definition.id);
                return { state: dp.modify(current, 3), value: undefined };
            },
        }),
    };
    const initial = {
        id: "initial",
        hooks: Hooks.empty().set(units.entered, {
            id: "observe-initialization",
            invoke(current, self) {
                assert.equal(current.schedule.definition.waves.length, 1);
                assert.equal(current.deployment.dp.balance, 20);
                assert.equal(get(current, self.id).definition, initial);
                const mechanism = mechanisms.all(current).find(({ definition }) => definition === controller);
                assert.equal(mechanism?.lifecycle, "ACTIVE");
                entered.push(self.definition.id);
                return { state: dp.modify(current, 2), value: undefined };
            },
        }),
    };
    const following = {
        id: "following",
        hooks: Hooks.empty().set(units.entered, {
            id: "observe-previous-initial-unit",
            invoke(current, self) {
                assert.equal(current.deployment.dp.balance, 22);
                assert.equal(get(current, 0).definition, initial);
                entered.push(self.definition.id);
                return { state: current, value: undefined };
            },
        }),
    };
    let state = battle([
        { definition: initial, position: [0, 0] },
        { definition: following, position: [1, 0] },
    ], {
        deployment: { definition: account, cards: [{
            definition: cardDefinition,
            unitDefinition: {
                id: "reserve", hooks: Hooks.empty(),
                occupancy: { slot: "OCCUPANT" },
                deployable: { retreatRestrictions: [] },
            },
        }] },
        initialMechanisms: [{ definition: controller }],
        schedule: { waves: [{
            preDelayTicks: 0, postDelayTicks: 0, maxWaitingTicks: null,
            fragments: [{ preDelayTicks: 0, entries: [{
                atTick: 0, definition: scheduled, plan, offset: [0, 0],
                randomRange: [0, 0], wait: "WAVE",
            }] }],
        }], branches: {} },
    });
    assert.equal(state.deployment.dp.balance, 22);
    state = step(state, []);
    assert.deepEqual(entered, ["controller", "initial", "following", "scheduled"]);
    assert.equal(state.deployment.dp.balance, 25);
});

test("Tick phases publish their resource operations and failures preserve the input", () => {
    const failure = new Error("content failed");
    let fail = false;
    let interrupted;
    const operator = {
        id: "operator",
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRestrictions: [] },
        hooks: Hooks.empty().set(units.tick, {
            id: "tick-resource",
            invoke(current) {
                current = dp.modify(current, 2);
                if (fail) {
                    interrupted = current;
                    throw failure;
                }
                return { state: current, value: undefined };
            },
        }),
    };
    const before = battle([], {
        deployment: {
            definition: account,
            cards: [{ definition: cardDefinition, unitDefinition: operator }],
        },
    });
    const card = cards.ref([...cards.all(before)][0]);
    const commands = [
        { type: "DEPLOY_UNIT", ref: card, tilePosition: [0, 1] },
    ];
    const completed = step(before, commands);
    assert.equal(completed.tick, 1);
    assert.deepEqual(units.all(completed).map(({ definition, position }) => [definition.id, position]).toArray(), [
        ["operator", [1, 0]],
    ]);
    assert.equal(completed.deployment.dp.balance, 17);
    assert.equal(cards.get(completed, card).supply.stock, 0);
    const finished = step(completed, []);
    assert.equal(finished.tick, 2);
    assert.equal(finished.deployment.dp.balance, 19);

    fail = true;
    let branch = before;
    assert.throws(() => { branch = step(branch, commands); }, (error) => error === failure);
    assert.equal(interrupted.deployment.dp.balance, 17);
    assert.equal(branch.tick, 0);
    assert.equal(branch.deployment.dp.balance, 20);
    assert.equal(cards.get(branch, card).supply.stock, 1);
    assert.deepEqual([...units.all(branch)], []);
});

test("manual commands preserve AUTO and PASSIVE scheduling while direct activation can start AUTO", () => {
    const programs = ["MANUAL", "AUTO", "PASSIVE"].map(trigger => ({
        id: trigger, sp: null,
        initialize: state => ({ state, value: { starts: 0 } }),
        activation: {
            trigger, ignoreRestrictions: [], requirement: 0, cost: 0,
            initialize: () => ({ state: {}, duration: { type: "TIME", durationTicks: 0 } }),
            onStart(state, source, self) {
                return skills.setState(state, skills.ref(source, self.definition), {
                    starts: self.state.starts + 1,
                });
            },
        },
    }));
    let state = battle(programs.map(program => ({
        definition: {
            id: program.id, hooks: Hooks.empty(),
            skill: { definition: program },
        },
        position: [1, 1],
    })));
    const sources = programs.map((_program, index) => units.ref(get(state, index)));
    const starts = state => sources.map(source => get(state, source.id).skill.state.starts);
    assert.deepEqual(starts(state), [0, 0, 1]);
    state = step(state, sources.map(ref => ({ type: "SKILL", ref, operation: "ACTIVATE" })));
    assert.deepEqual(starts(state), [1, 1, 1]);
    const explicit = skills.activate(state, skills.ref(sources[1], programs[1]));
    assert.notEqual(explicit.value, null);
    state = explicit.state;
    assert.deepEqual(starts(state), [1, 2, 1]);
    const repeatedPassive = skills.activate(state, skills.ref(sources[2], programs[2]));
    assert.equal(repeatedPassive.value, null);
    assert.equal(repeatedPassive.state, state);
    state = step(state, []);
    assert.deepEqual(starts(state), [1, 3, 1]);
});
