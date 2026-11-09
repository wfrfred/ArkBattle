import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { step } from "../../dist/core/battle/runtime.js";
import * as predefined from "../../dist/core/battle/steps/predefined.js";
import { dp } from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";

const account = {
    initialDp: 20,
    maxDp: 99,
    dpRecoveryTicks: null,
    slotLimit: 1,
};

test("initial and scheduled entry see registered battle facts and preserve their resource operations", () => {
    const entered = [];
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
        hooks: Hooks.empty().set(units.enter, {
            id: "observe-birth",
            invoke(current, self) {
                assert.equal(get(current, self.id).definition.id, "scheduled");
                assert.equal(current.deployment.dp, 22);
                entered.push(self.definition.id);
                return { state: dp.modify(current, 3), value: undefined };
            },
        }),
    };
    const initial = {
        id: "initial",
        hooks: Hooks.empty().set(units.enter, {
            id: "observe-initialization",
            invoke(current, self) {
                assert.equal(current.schedule.definition.waves.length, 1);
                assert.equal(current.deployment.dp, 20);
                assert.equal(get(current, self.id).definition, initial);
                assert.ok(current.predefinedPresence.some(
                    ({ source }) => source.type === "UNIT" && source.ref.id === self.id,
                ));
                entered.push(self.definition.id);
                return { state: dp.modify(current, 2), value: undefined };
            },
        }),
    };
    let state = battle([{ definition: initial, position: [0, 0] }], {
        deployment: { definition: account, cards: [] },
        schedule: { waves: [{
            preDelayTicks: 0, postDelayTicks: 0, maxWaitingTicks: null,
            fragments: [{ preDelayTicks: 0, spawns: [{
                atTick: 0, definition: scheduled, plan, offset: [0, 0],
                randomRange: [0, 0], wait: "WAVE",
            }] }],
        }], branches: {} },
    });
    assert.equal(state.deployment.dp, 22);
    state = step(state, []);
    assert.deepEqual(entered, ["initial", "scheduled"]);
    assert.equal(state.deployment.dp, 25);
});

test("a predefined departure can create its successor without losing that binding or the next operation", () => {
    const reappearing = {
        id: "reappearing",
        hooks: Hooks.empty().set(units.leave, {
            id: "return-after-departure",
            invoke(current, { unit }) {
                assert.equal(get(current, unit.id), undefined);
                assert.equal(current.predefinedPresence.some(({ definitionId }) => definitionId === 10), false);
                return {
                    state: predefined.appear(current, 10),
                    value: undefined,
                };
            },
        }),
    };
    const predefines = [
        { id: 10, alias: null, initiallyPresent: true, creation: {
            type: "UNIT", definition: reappearing, position: [0, 0],
        } },
        { id: 11, alias: null, initiallyPresent: false, creation: {
            type: "UNIT", definition: { id: "next-operation", hooks: Hooks.empty() }, position: [1, 0],
        } },
    ];
    const before = battle([], { predefines });
    const original = units.all(before).find((self) => self.definition === reappearing);
    const after = predefined.appear(predefined.remove(before, 10, "SCRIPT"), 11);
    const replacement = after.predefinedPresence.find(({ definitionId }) => definitionId === 10).source.ref.id;
    const next = after.predefinedPresence.find(({ definitionId }) => definitionId === 11).source.ref.id;
    assert.notEqual(replacement, original.id);
    assert.notEqual(next, replacement);
    assert.equal(get(after, original.id), undefined);
    assert.equal(get(after, replacement).definition, reappearing);
    assert.equal(get(after, next).definition.id, "next-operation");
});

test("Tick phases publish their resource operations and failures preserve the input", () => {
    const failure = new Error("content failed");
    let fail = false;
    let interrupted;
    const operator = {
        id: "operator",
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRules: [] },
        card: {
            cost: 5, redeployTicks: 0, slots: 1,
            stock: 1, stockLimit: 1, activeLimit: 1,
            cooldownOnDeploy: false, recoverOnRetreatOrDeath: true, increaseCostOnRetreatOrDeath: false,
            refund: null, deploymentRules: [], unitHooks: Hooks.empty(),
            initialize: (current) => ({ state: current, value: {} }),
        },
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
        deployment: { definition: account, cards: [operator] },
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
    assert.equal(completed.deployment.dp, 17);
    assert.equal(cards.get(completed, card).stock, 0);
    const finished = step(completed, []);
    assert.equal(finished.tick, 2);
    assert.equal(finished.deployment.dp, 19);

    fail = true;
    let branch = before;
    assert.throws(() => { branch = step(branch, commands); }, (error) => error === failure);
    assert.equal(interrupted.deployment.dp, 17);
    assert.equal(branch.tick, 0);
    assert.equal(branch.deployment.dp, 20);
    assert.equal(cards.get(branch, card).stock, 1);
    assert.deepEqual([...units.all(branch)], []);
});
