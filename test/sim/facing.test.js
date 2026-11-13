import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import { update } from "../../dist/core/battle/unit.js";
import * as units from "../../dist/core/unit/index.js";
import * as facing from "../../dist/core/unit/capability/facing/index.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/index.js";
import { battle, get } from "../helpers/battle.js";

test("Facing keeps an instance direction and checks current rules unless explicitly forced", () => {
    const definition = {
        id: "facing", hooks: Hooks.empty(),
        facing: { rules: [{ id: "locked", allows: current => current.tick >= 5 }] },
    };
    const initial = battle([{ definition, position: [3, 1],
        initial: { facing: { direction: "RIGHT" } },
    }]);
    const host = units.ref(get(initial, 0));
    assert.equal(facing.turn(initial, host, "LEFT"), initial);

    let state = facing.turn(initial, host, "LEFT", "FORCED");
    assert.equal(get(state, 0).facing.direction, "LEFT");
    assert.equal(facing.sign(get(state, 0).facing.direction), -1);
    assert.equal(get(initial, 0).facing.direction, "RIGHT");
    assert.equal(facing.turn(state, host, "LEFT"), state);

    state = facing.turn({ ...state, tick: 5 }, host, "RIGHT");
    assert.equal(get(state, 0).facing.direction, "RIGHT");
    assert.equal(facing.sign(get(state, 0).facing.direction), 1);
    state = update(state, host, facing.setRule({ id: "fixed", allows: () => false }));
    assert.equal(facing.turn(state, host, "LEFT"), state);
    state = update(state, host, facing.removeRule("fixed"));
    assert.equal(get(facing.turn(state, host, "LEFT"), 0).facing.direction, "LEFT");
});

test("eligible movement faces its navigation direction independently of velocity and turning permission", () => {
    const definition = {
        id: "mover", hooks: Hooks.empty(), facing: { rules: [] },
        locomotion: { speed: 0.1, minSpeed: 0, halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 0.01 } },
    };
    let state = battle([{ definition, position: [3, 1],
        initial: { facing: { direction: "RIGHT" } },
    }]);
    const host = units.ref(get(state, 0));
    const context = { mode: "WALK", speedMultiplier: 1 };
    const left = { nextPoint: [1, 1], goal: [1, 1] };
    const right = { nextPoint: [6, 1], goal: [6, 1] };
    state = update(state, host, locomotion.setRule({ id: "casting", allows: () => false }));
    assert.equal(locomotion.advance(state, host, left, context), state);
    state = update(state, host, locomotion.removeRule("casting"));
    state = update(state, host, facing.setRule({ id: "fixed", allows: () => false }));
    for (let tick = 0; tick < 4; tick++) {
        state = locomotion.advance({ ...state, tick }, host, right, context);
    }

    const movingRight = get(state, 0).position[0];
    state = locomotion.advance({ ...state, tick: 4 }, host, left, context);
    assert.ok(get(state, 0).position[0] > movingRight);
    assert.equal(get(state, 0).facing.direction, "RIGHT");

    const beforeTurn = get(state, 0).position[0];
    state = update(state, host, facing.setRule({
        id: "fixed", allows: (current, { self }) =>
            self.position[0] > beforeTurn && units.get(current, host) === self,
    }));
    state = locomotion.advance({ ...state, tick: 5 }, host, left, context);
    assert.ok(get(state, 0).locomotion.velocity[0] > 0);
    assert.equal(get(state, 0).facing.direction, "LEFT");
    state = update(state, host, facing.removeRule("fixed"));

    const vertical = [get(state, 0).position[0], 2];
    state = locomotion.advance({ ...state, tick: 6 }, host,
        { nextPoint: vertical, goal: vertical }, context);
    assert.equal(get(state, 0).facing.direction, "LEFT");
    const near = [get(state, 0).position[0] + 0.1, get(state, 0).position[1]];
    state = locomotion.advance({ ...state, tick: 7 }, host,
        { nextPoint: near, goal: near }, context);
    assert.equal(get(state, 0).facing.direction, "LEFT");
    assert.equal(locomotion.advance(state, host, right, { ...context, speedMultiplier: 0 }), state);
});
