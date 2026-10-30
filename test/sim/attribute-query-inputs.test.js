
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as attribute from "../../dist/core/unit/contribution/attribute.js";
import * as units from "../../dist/core/unit/query.js";
import { replace as updateUnit, remove as removeUnit } from "../../dist/core/battle/unit.js";
import { actionCapability } from "../helpers/actions.js";
import * as action from "../../dist/core/unit/capability/action/index.js";
import * as timing from "../../dist/core/unit/capability/action/timing.js";
import * as movement from "../../dist/core/unit/capability/locomotion/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/capability.js";
import { resolveDefense } from "../../dist/core/unit/capability/vitality/query.js";
import { fixtureBattle, initialize } from "../helpers/unit.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";

const program = {
    id: "timing", intervalTicks: 10, speed: 100,
    initialize: battle => ({ state: battle, value: {} }),
    prepare: battle => ({ state: battle, value: {} }),
    onTick: battle => ({ state: battle, value: false }),
};

function fixture(tick = 0) {
    return addUnit(fixtureBattle(tick), initialize({
        id: 1, position: [0, 0], definition: { hooks: [],
            id: "dynamic-attributes",
            vitality: { maxHp: 100, defense: 100, resistance: 20 },
            action: actionCapability(program),
            locomotion: {
                speed: 0.5, minSpeed: 0, halfBodyWidth: 0,
                steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
            },
        },
    }));
}

test("Action timing inputs receive the queried BattleState and its current typed host", () => {
    const seen = [];
    let battle = fixture(2);
    const host = units.get(battle, { id: 1 });
    battle = applyUnitChanges(battle, [action.setSpeedContribution({ id: host.id }, {
            id: "speed", value(current, self) {
                seen.push([current, self]);
                assert.equal(units.get(current, units.ref(self)), self);
                return [attribute.create({ addition: current.tick * 10 })];
            },
        }), action.setIntervalContribution({ id: host.id }, {
            id: "interval", value(current, self) {
                seen.push([current, self]);
                assert.equal(units.get(current, units.ref(self)), self);
                return [attribute.create({ addition: self.action.interval.length })];
            },
        })]);
    seen.length = 0;
    const before = battle;
    assert.equal(timing.resolveSpeed(before, { id: 1 }, program), 120);
    assert.equal(timing.resolveBaseInterval(before, { id: 1 }, program), 11);
    const previousHost = units.get(before, { id: 1 });
    battle = updateUnit({ ...battle, tick: 5 }, [{ ...previousHost, position: [1, 0] }]);
    const current = units.get(battle, { id: 1 });
    assert.equal(timing.resolveSpeed(battle, { id: 1 }, program), 150);
    assert.equal(timing.resolveInterval(battle, { id: 1 }, program), 11 * 100 / 150);
    assert.equal(seen[0][0], before);
    assert.equal(seen[0][1], previousHost);
    assert.equal(seen[2][0], battle);
    assert.equal(seen[2][1], current);
    assert.equal(timing.resolveSpeed(before, { id: 1 }, program), 120);
});

test("Locomotion speed inputs observe the latest movement host and full battle facts", () => {
    const seen = [];
    let battle = fixture(1);
    const initial = units.get(battle, { id: 1 });
    battle = applyUnitChanges(battle, [movement.setSpeedContribution({ id: initial.id }, {
            id: "movement", value(current, self) {
                assert.equal(units.get(current, units.ref(self)), self);
                seen.push([current, self]);
                return [attribute.create({ finalScaler: self.position[0] === 0 ? current.tick + 1 : 0.5 })];
            },
        })]);
    const first = battle;
    const target = { nextPoint: [10, 0], goal: [10, 0] };
    const context = { mode: "WALK", speedMultiplier: 1 };
    battle = movement.advance(battle, { id: 1 }, target, context);
    assert.deepEqual(units.get(battle, { id: 1 }).position, [1, 0]);
    const second = { ...battle, tick: 2 };
    battle = movement.advance(second, { id: 1 }, target, context);
    assert.deepEqual(units.get(battle, { id: 1 }).position, [1.25, 0]);
    assert.equal(seen[0][0], first);
    assert.equal(seen[1][0], second);
    assert.equal(seen[1][1], units.get(second, { id: 1 }));
    assert.deepEqual(units.get(first, { id: 1 }).position, [0, 0]);
});

test("Vitality defense queries resolve current state from a Ref without a Context wrapper", () => {
    const seen = [];
    let battle = fixture(5);
    const initial = units.get(battle, { id: 1 });
    battle = applyUnitChanges(battle, [vitality.setDefenseContribution({ id: initial.id }, {
            id: "defense", value(current, self) {
                assert.equal(units.get(current, units.ref(self)), self);
                seen.push([current, self]);
                return [attribute.create({ addition: self.definition.vitality.resistance + current.tick })];
            },
        }), vitality.setResistanceContribution({ id: initial.id }, {
            id: "resistance", value: (current, self) => [attribute.create({
                multiplier: current.tick / self.definition.vitality.resistance,
            })],
        })]);
    const before = battle;
    assert.deepEqual(resolveDefense(before, { id: 1 }), { defense: 125, resistance: 25 });
    const host = units.get(battle, { id: 1 });
    battle = updateUnit({ ...battle, tick: 10 }, [{ ...host, lifecycle: "LEAVING" }]);
    assert.deepEqual(resolveDefense(battle, { id: 1 }), { defense: 130, resistance: 30 });
    assert.equal(seen[0][0], before);
    assert.equal(seen[1][0], battle);
    assert.equal(seen[1][1], units.get(battle, { id: 1 }));
    assert.deepEqual(resolveDefense(before, { id: 1 }), { defense: 125, resistance: 25 });
    assert.equal(resolveDefense(removeUnit(before, 1, "SCRIPT"), { id: 1 }), undefined);
});

test("attribute domains select Contribution winners before invoking their input programs", () => {
    let battle = fixture();
    const initial = units.get(battle, { id: 1 });
    const loser = {
        id: "loser", group: { id: "attribute", priority: 0 },
        value: () => assert.fail("an excluded Contribution must not execute"),
    };
    const winner = {
        id: "winner", group: { id: "attribute", priority: 1 },
        value: [attribute.create({ addition: 20 })],
    };
    battle = applyUnitChanges(battle, [action.setSpeedContribution({ id: initial.id }, loser), action.setSpeedContribution({ id: initial.id }, winner), vitality.setDefenseContribution({ id: initial.id }, loser), vitality.setDefenseContribution({ id: initial.id }, winner), movement.setSpeedContribution({ id: initial.id }, loser), movement.setSpeedContribution({ id: initial.id }, {
            ...winner, value: [attribute.create({ finalScaler: 2 })],
        })]);
    assert.equal(timing.resolveSpeed(battle, { id: 1 }, program), 120);
    assert.deepEqual(resolveDefense(battle, { id: 1 }), { defense: 120, resistance: 20 });
    battle = movement.advance(battle, { id: 1 }, {
        nextPoint: [10, 0], goal: [10, 0],
    }, { mode: "WALK", speedMultiplier: 1 });
    assert.deepEqual(units.get(battle, { id: 1 }).position, [1, 0]);
});
