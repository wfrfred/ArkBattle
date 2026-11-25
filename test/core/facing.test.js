// Contract: [capability](../../docs/architecture/capability.md#facing).
import { attribute as defineAttribute } from "../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import { update } from "../../dist/core/unit/operations.js";
import * as units from "../../dist/core/unit/index.js";
import { step } from "../../dist/core/battle/runtime.js";
import * as facing from "../../dist/core/unit/capability/facing/index.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/index.js";
import { battle, get } from "../helpers/battle.js";

test("Facing keeps an instance direction and checks current restrictions unless explicitly forced", () => {
    const definition = {
        id: "facing", hooks: Hooks.empty(),
        facing: { restrictions: [{ id: "locked", group: null, value: { allows: current => current.tick >= 5 } }] },
    };
    const initial = battle([{ definition, hooks: Hooks.empty(), position: [3, 1],
        initial: { facing: { direction: "RIGHT" } },
    }]);
    const host = units.ref(get(initial, 0));
    assert.equal(facing.turn(initial, host, "LEFT"), initial);

    let state = facing.turn(initial, host, "LEFT", "FORCED");
    assert.equal(get(state, 0).facing.direction, "LEFT");
    assert.equal(facing.sign(get(state, 0).facing.direction), -1);
    assert.equal(get(initial, 0).facing.direction, "RIGHT");
    assert.equal(facing.turn(state, host, "LEFT"), state);

    for (let elapsed = 0; elapsed < 5; elapsed++) {
        state = step(state, []);
    }
    state = facing.turn(state, host, "RIGHT");
    assert.equal(get(state, 0).facing.direction, "RIGHT");
    assert.equal(facing.sign(get(state, 0).facing.direction), 1);
    state = update(state, host, facing.setRestriction({ id: "fixed", group: null, value: { allows: () => false } }));
    assert.equal(facing.turn(state, host, "LEFT"), state);
    state = update(state, host, facing.removeRestriction("fixed"));
    state = facing.turn(state, host, "LEFT");
    assert.equal(get(state, 0).facing.direction, "LEFT");

    let departureDirection;
    state = update(state, host, units.setHook(units.removing, {
        id: "try-forced-turn", priority: 0,
        invoke(current) {
            const attempted = facing.turn(current, host, "RIGHT", "FORCED");
            departureDirection = host.get(attempted).facing.direction;
            return { state: attempted, value: undefined };
        },
    }));
    units.remove(state, host, { reason: "SCRIPT" });
    assert.equal(departureDirection, "LEFT");
});

test("eligible movement faces its navigation direction independently of velocity and turning permission", () => {
    const definition = {
        id: "mover", hooks: Hooks.empty(), facing: { restrictions: [] },
        locomotion: { speed: defineAttribute(0.1), halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 0.01 } },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), position: [3, 1],
        initial: { facing: { direction: "RIGHT" } },
    }]);
    const host = units.ref(get(state, 0));
    const context = { mode: "WALK", speedMultiplier: 1 };
    const left = { nextPoint: [1, 1], goal: [1, 1] };
    const right = { nextPoint: [6, 1], goal: [6, 1] };
    state = update(state, host, locomotion.setRestriction({ id: "casting", group: null, value: { allows: () => false } }));
    assert.equal(locomotion.advance(state, host, left, context), state);
    state = update(state, host, locomotion.removeRestriction("casting"));
    state = update(state, host, facing.setRestriction({ id: "fixed", group: null, value: { allows: () => false } }));
    for (let advance = 0; advance < 4; advance++) {
        state = locomotion.advance(state, host, right, context);
    }

    const movingRight = get(state, 0).position[0];
    state = locomotion.advance(state, host, left, context);
    assert.ok(get(state, 0).position[0] > movingRight);
    assert.equal(get(state, 0).facing.direction, "RIGHT");

    const beforeTurn = get(state, 0).position[0];
    state = update(state, host, facing.setRestriction({
        id: "fixed", group: null, value: { allows: (current, { self }) =>
            self.position[0] > beforeTurn && host.get(current) === self },
    }));
    state = locomotion.advance(state, host, left, context);
    assert.ok(get(state, 0).locomotion.velocity[0] > 0);
    assert.equal(get(state, 0).facing.direction, "LEFT");
    state = update(state, host, facing.removeRestriction("fixed"));

    const vertical = [get(state, 0).position[0], 2];
    state = locomotion.advance(state, host, { nextPoint: vertical, goal: vertical }, context);
    assert.equal(get(state, 0).facing.direction, "LEFT");
    const near = [get(state, 0).position[0] + 0.1, get(state, 0).position[1]];
    state = locomotion.advance(state, host, { nextPoint: near, goal: near }, context);
    assert.equal(get(state, 0).facing.direction, "LEFT");
    assert.equal(locomotion.advance(state, host, right, { ...context, speedMultiplier: 0 }), state);
});
