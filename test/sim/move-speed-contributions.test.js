
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";


import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fixtureBattle } from "../helpers/unit.js";
import { contributionEffect, refreshContribution } from "../helpers/effects.js";
import { initialize } from "../../dist/core/unit/initialize.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { add as addUnit, replace as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import {
    setSpeedContribution,
    removeSpeedContribution,
    setRule,
    removeRule,
} from "../../dist/core/unit/capability/locomotion/index.js";
import { advance } from "../../dist/core/unit/capability/locomotion/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as modifier from "../../dist/core/unit/contribution/attribute.js";

const address = { host: { id: 0 }, id: 0 };
const close = (actual, expected) =>
    assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≈ ${expected}`);

function harness({ speed = 0.25, minimum = 0, steeringParameters, blockable = false, route = false } = {}) {
    const initialized = initialize(fixtureBattle(0, { rngState: 17 }), {         id: 0,
        position: [0, 0],
        definition: { hooks: [],
            id: "dynamic-mover",
            ...(blockable ? {
                allegiance: { side: "ENEMY" }, layer: { type: "GROUND" }, blockable: { volume: 1 },
            } : {}),
            ...(route ? { route: {
                pathMotionMode: "WALK", startPosition: [0, 0], endPosition: [0, 20], offset: [0, 0],
                checkpoints: [], requireAllCheckpoints: true, alwaysCheckCurrentPoint: true,
            } } : {}),
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            spatialPresence: {},
            locomotion: {
                halfBodyWidth: 0, speed: speed,
                minSpeed: minimum,
                steeringParameters: steeringParameters ?? {
                    steeringFactor: 1,
                    maxSteeringForce: 100,
                },
            },
        },
    });
    let work = addUnit(initialized.state, initialized.value);
    return {
        get work() { return work; },
        set work(next) { work = next; },
        get unit() { return getUnit(work, 0); },
        step(tick, target = [20, 0], multiplier = 1) {
            work = { ...work, tick };
            if (target !== null) {
                work = advance(work, unitRef(getUnit(work, 0)), { nextPoint: target, goal: target }, { mode: "WALK", speedMultiplier: multiplier });
            }
            return getUnit(work, 0);
        },
    };
}

const output = {
    capability: "locomotion", set: setSpeedContribution,
    remove: removeSpeedContribution,
    value: (instance) => [instance.data.value],
};
function movementEffect(value = modifier.create({ multiplier: -0.5 })) {
    return contributionEffect("movement-buff", { value }, output);
}
const install = (work, program, expiresAtTick = null) =>
    effects.install(work, unitRef(getUnit(work, 0)), program, {
        deadline: expiresAtTick,
    });
const setSpeed = (work, program, data) => {
    work = effects.setData(work, address, data);
    return refreshContribution(work, address, program, output);
};
function speed(work) {
    const unit = getUnit(work, 0);
    const moved = advance(work, unitRef(unit), { nextPoint: [20, 0], goal: [20, 0] }, { mode: "WALK", speedMultiplier: 1 });
    return getUnit(moved, 0).position[0] - unit.position[0];
}

test("move speed: minimum, arithmetic and movement permission are separate", () => {
    const h = harness({ speed: 1 / 30, minimum: 0.1 / 30 });
    const program = movementEffect(modifier.create({ multiplier: -2 }));
    h.work = install(h.work, program).state;
    close(speed(h.work), 0.1 / 30);
    assert.deepEqual(h.step(0, [20, 0], 0).position, [0, 0]);
    h.work = applyUnitChanges(h.work, [setRule({ id: h.unit.id }, { id: "stop", allows: () => false })]);
    assert.deepEqual(h.step(1).position, [0, 0]);
    h.work = applyUnitChanges(h.work, [removeRule({ id: h.unit.id }, "stop")]);
    close(h.step(2, [20, 0], 0.5).position[0], 0.1 / 60);
    h.work = setSpeed(h.work, program, {
        ...effects.get(h.work, address).data,
        value: modifier.create({
            addition: 1 / 30, multiplier: 0.5,
            finalAddition: 1 / 30, finalScaler: 2,
        }),
    });
    close(speed(h.work), 8 / 30);
});


test("move speed: acceleration, zero budget and restoration use current contributions", () => {
    const program = movementEffect();
    const h = harness();
    close(h.step(0).position[0], 0.25);
    h.work = install(h.work, program).state;
    close(h.step(1).position[0], 0.375);
    h.work = setSpeed(h.work, program, {
        ...effects.get(h.work, address).data, value: modifier.create({ multiplier: 1 }),
    });
    close(h.step(2).position[0], 0.875);
    h.work = setSpeed(h.work, program, {
        ...effects.get(h.work, address).data, value: modifier.create({ multiplier: -1 }),
    });
    const velocity = h.unit.locomotion.velocity;
    close(h.step(3).position[0], 0.875);
    assert.equal(h.unit.locomotion.velocity, velocity);
    h.work = effects.setEnabled(h.work, address, false);
    close(h.step(4).position[0], 1.125);
    assert.equal(h.work.execution.rngState, 17);
});

test("move speed: live contributions read latest battle and unit facts", () => {
    const program = contributionEffect("live-move", {}, {
        capability: "locomotion", set: setSpeedContribution,
        remove: removeSpeedContribution, dynamic: true,
        value: (_, battle, self) => {
            assert.equal(getUnit(battle, self.id), self);
            return [modifier.create({ finalScaler: self.vitality.hp / 100 })];
        },
    });
    const h = harness({ speed: 0.5 });
    h.work = install(h.work, program).state;
    const fullHp = h.unit;
    h.work = updateUnit(h.work, [{
        ...fullHp, vitality: { ...fullHp.vitality, hp: 50 },
    }]);
    close(h.step(0, [20, 0], 0.5).position[0], 0.125);
    assert.equal(h.unit.definition.locomotion.speed, 0.5);
    assert.equal(fullHp.vitality.hp, 100);
});


test("move speed: native Mire modifier slows movement and expiry restores it", () => {
    const fixture = name => JSON.parse(readFileSync(
        new URL(`../fixtures/arknights/${name}.json`, import.meta.url), "utf8",
    ));
    const raw = fixture("buff_mire_attr");
    const skill = fixture("skill_sktok_mire").levels[0];
    const description = raw.node._buff.attributes.attributeModifiers.find(
        entry => entry.attributeType === "MOVE_SPEED",
    );
    assert.equal(description.formulaItem, "MULTIPLIER");
    const ratio = skill.blackboard.find(entry => entry.key === "move_speed").value;
    assert.equal(ratio, -0.05);
    const h = harness({ speed: 0.2 });
    h.work = install(h.work, movementEffect(modifier.create({ multiplier: ratio })), 2).state;
    const positions = [];
    for (let tick = 0; tick < 4; tick++) {
        h.work = effects.advance({ ...h.work, tick });
        positions.push(h.step(tick).position[0]);
    }
    positions.forEach((position, index) => close(position, [0.19, 0.38, 0.58, 0.78][index]));
    assert.equal(h.unit.locomotion.speed.length, 0);
    assert.equal(h.work.execution.rngState, 17);
});
