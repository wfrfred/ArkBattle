import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as hpDamage from "../../dist/core/battle/damage/hp/index.js";
import * as hpHealing from "../../dist/core/battle/healing/hp/index.js";
import * as epDamage from "../../dist/core/battle/damage/ep/index.js";
import * as epHealing from "../../dist/core/battle/healing/ep/index.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { appendEvents } from "../../dist/core/battle/state.js";
import { step } from "../../dist/core/battle/runtime.js";
import { createInput } from "../../dist/core/battle/creation/route.js";
import { advanceMovement, resolveRouteCompletion } from "../../dist/core/battle/steps/movement.js";
import { TacticalDemoPresentation } from "../../dist/legacy/tactical-demo-presentation.js";

import { createArknightsElementalDefinition } from "../../dist/data/arknights/elemental.js";
import { update } from "../../dist/core/battle/unit.js";

const elemental = createArknightsElementalDefinition({ receiver: "CHARACTER" });
const data = { lookup() {} };

test("EVENT-01: real HP and EP damage and healing produce the corresponding floating text", () => {
    let state = battle([{ definition: {
        id: "receiver", hooks: Hooks.empty(), elemental,
        vitality: { maxHp: 1000, defense: 0, resistance: 0 },
    }, position: [1, 1] }]);
    const target = units.ref(get(state, 0));
    const hp = {
        source: null, target,
        parameters: { type: "ELEMENTAL", attack: { power: 50, multiplier: 1, addition: 0 } },
    };
    state = hpDamage.applyDamage(hp, hpDamage.calculateDamage(state, hp)).state;
    const injury = { source: null, target, type: "NEURAL", power: 100 };
    state = epDamage.applyDamage(injury, epDamage.calculateDamage(state, injury)).state;
    const elementalRecovery = { source: null, target, power: 40 };
    state = epHealing.applyHealing(elementalRecovery, epHealing.calculateHealing(state, elementalRecovery)).state;
    const recovery = { source: null, target, parameters: { power: 30, multiplier: 1 } };
    state = hpHealing.applyHealing(recovery, hpHealing.calculateHealing(state, recovery)).state;

    const view = new TacticalDemoPresentation(data);
    assert.deepEqual(view.advance(state, state.events), [
        ["dmg", 0, 50, "true"],
        ["dmg", 0, 100, "neural"],
        ["heal", 0, 40],
        ["heal", 0, 30],
    ]);
    assert.equal(get(state, 0).vitality.hp, 980);
    assert.equal(get(state, 0).elemental.ep.NEURAL, 940);
});

test("EVENT-02: a Burst keeps its original position through movement and death in the same Tick", () => {
    let state = battle([{ definition: {
        id: "receiver", hooks: Hooks.empty(), elemental, spatialPresence: {},
        vitality: { maxHp: 2000, defense: 0, resistance: 0 },
    }, position: [1, 1] }]);
    const target = units.ref(get(state, 0));
    const injury = { source: null, target, type: "BURN", power: 1000 };
    state = epDamage.applyDamage(injury, epDamage.calculateDamage(state, injury)).state;
    state = update(state, [presence.appear(target, [4, 1])]);
    const lethal = {
        source: null, target,
        parameters: { type: "TRUE", attack: { power: 2000, multiplier: 1, addition: 0 } },
    };
    state = hpDamage.applyDamage(lethal, hpDamage.calculateDamage(state, lethal)).state;

    assert.equal(get(state, 0), undefined);
    const view = new TacticalDemoPresentation(data);
    assert.deepEqual(view.advance(state, state.events), [
        ["dmg", 0, 1000, "burn"],
        ["fx", "burst", 1, 1, { id: 0, element: "burn" }],
        ["dmg", 0, 1200, "arts"],
        ["dmg", 0, 800, "true"],
        ["die", 0, "killed"],
    ]);
    assert.deepEqual(view.units(state)[0].info.x, 4);
});

test("EVENT-03: real route completion updates business counts independently of temporary UI output", () => {
    const route = {
        pathMotionMode: "WALK", startPosition: [1, 1], endPosition: [1, 1], offset: [0, 0],
        checkpoints: [], requireAllCheckpoints: true, alwaysCheckCurrentPoint: true,
    };
    const futureRoute = createInput({
        pathMotionMode: "WALK", startPosition: [1, 2], endPosition: [1, 3],
        spawnOffset: [0, 0], spawnRandomRange: [0, 0],
        checkpoints: [{ type: "WAIT_FOR_TICKS", durationTicks: 100 }],
        visitEveryCheckPoint: true,
    });
    const initial = battle([{ definition: {
        id: "route-unit", hooks: Hooks.empty(), route,
    }, position: [1, 1] }], {
        schedule: { type: "TIMELINE", spawns: [{
            tick: 100, definition: { id: "future", hooks: Hooks.empty() }, route: futureRoute,
            alwaysCheckCurrentPoint: true, notCountInTotal: false,
            timing: { waveStartedAtTick: 100, fragmentStartedAtTick: 100 },
        }] },
    });
    const withOutput = appendEvents(initial, [{ type: "ROUTE_COMPLETED", unitId: 0, tick: 0 }]);
    assert.equal(withOutput.completedRouteCount, 0);
    assert.equal(withOutput.schedule, initial.schedule);
    assert.equal(withOutput.result, null);
    const moved = advanceMovement(initial, { routeMoveMultiplier: 1 });
    const completed = resolveRouteCompletion(moved);
    assert.equal(completed.completedRouteCount, 1);
    assert.equal(get(completed, 0), undefined);
    const view = new TacticalDemoPresentation(data);
    assert.deepEqual(view.advance(completed, completed.events), [["leak", 0]]);
    assert.deepEqual(new TacticalDemoPresentation(data).advance(completed, []), []);
    assert.equal(completed.completedRouteCount, 1);
    const extraOutput = appendEvents(completed, [{ type: "ROUTE_COMPLETED", unitId: 0, tick: 0 }]);
    assert.equal(extraOutput.completedRouteCount, 1);
    assert.equal(extraOutput.schedule, completed.schedule);
    const next = step(extraOutput, []);
    assert.deepEqual(next.events, []);
    assert.equal(next.completedRouteCount, 1);
    assert.equal(completed.events.some(event => event.type === "ROUTE_COMPLETED"), true);
    assert.equal(withOutput.completedRouteCount, 0);
});
