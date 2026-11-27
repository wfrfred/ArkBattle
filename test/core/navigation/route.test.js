// Contract: [navigation](../../../docs/architecture/navigation.md#route-定义与进度).
import { attribute as defineAttribute } from "../../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { Hooks } from "../../../dist/core/hook.js";
import { removed as unitRemoved, setHook } from "../../../dist/core/battle/unit-hook.js";
import { isMoving } from "../../../dist/core/unit/capability/locomotion/index.js";
import * as route from "../../../dist/core/unit/capability/route/index.js";
import * as units from "../../../dist/core/unit/index.js";
import { update } from "../../../dist/core/unit/operations.js";
import { step } from "../../../dist/core/battle/runtime.js";
import { appear } from "../../../dist/core/unit/capability/presence/index.js";
import { shiftable, unbalance } from "../../../dist/core/unit/capability/shifting/index.js";
import { calculateOffset, search } from "../../../dist/core/battle/blocking/index.js";
import { blockable, blocker } from "../../../dist/core/unit/capability/blocking/index.js";
import { get as getTile } from "../../../dist/core/battlefield/map/map.js";
import { update as updateTile } from "../../../dist/core/battle/tile.js";

const plan = (checkpoints = [], extra = {}) => ({
    startPosition: [0, 0], destination: null,
    checkpoints, ...extra,
});
const wait = (tick, anchor = "ENTER") => ({ type: "WAIT", anchor, tick, timer: null });
const move = position => ({ type: "MOVE", position, offset: [0, 0], randomizeOffset: false });
const movement = {
    speed: defineAttribute(1), halfBodyWidth: 0,
    steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
};
function creation(program, extra = {}) {
    return { definition: {
        id: "traveller", hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true },
        presence: {}, locomotion: { ...movement, speed: defineAttribute(0) }, ...extra,
    }, hooks: Hooks.empty(), position: [0, 0], initial: { locomotion: { mode: "WALK" }, route: { plan: program, offset: [0, 0] } } };
}
const current = state => get(state, 0).route.main;
function ticks(state, count) {
    for (let i = 0; i < count; i++) state = step(state, []);
    return state;
}

test("remaining route distance follows navigation geometry and excludes teleport jumps", () => {
    const program = plan([
        move([2, 4]),
        { type: "APPEAR", position: [0, 6], offset: [0, 0] },
        move([0, 7]),
    ], { destination: { type: "MOVE", position: [0, 7] } });
    let state = battle([{ ...creation(program), position: [0.25, 0.25] }]);
    const corridor = new Set(["0:0", "0:1", "0:2", "1:2", "2:2", "2:3", "2:4", "0:6", "0:7"]);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if (!corridor.has(`${row}:${col}`)) {
                state = updateTile(state, [row, col], {
                    ...getTile(state.battlefield.map, [row, col]).state,
                    passability: "NONE",
                });
            }
        }
    }
    state = updateTile(state, [0, 0], {
        ...getTile(state.battlefield.map, [0, 0]).state, walkCost: 20,
    });
    const self = get(state, 0);
    assert.equal(route.remainingDistance(state, self), 6.75);
});

test("a MOVE across a tile boundary navigates to its registered tile with the actual offset endpoint", () => {
    const checkpoint = { ...move([1, 1]), offset: [0, 0.75] };
    const program = plan([checkpoint], { startPosition: [1, 0], destination: { type: "MOVE", position: [2, 1] } });
    const traveller = creation(program, { route: { alwaysCheckCurrentPoint: false } });
    let state = battle([{ ...traveller, position: [0, 1] }]);
    state = updateTile(state, [2, 0], {
        ...getTile(state.battlefield.map, [2, 0]).state,
        passability: "NONE",
    });
    const host = units.ref(get(state, 0));
    const goal = [1, 1.75];

    // The offset endpoint is in [2, 1], which would require a turn around [2, 0].
    assert.deepEqual(route.movementTarget(state, host), { nextPoint: goal, goal });
    assert.equal(route.remainingDistance(state, get(state, 0)), 1.5);

    state = updateTile(state, checkpoint.position, {
        ...getTile(state.battlefield.map, checkpoint.position).state,
        passability: "NONE",
    });
    assert.equal(route.movementTarget(state, host), null);
    assert.equal(route.remainingDistance(state, get(state, 0)), 1.25);
    // An unreachable MOVE is skipped when checking the current point is optional.
    state = route.advance(state, host);
    assert.equal(current(state).index, 1);

    // A direct endpoint behind the locator still contributes a positive geometric length.
    const reverse = plan([{ ...move([1, 1]), offset: [-0.875, 0] }], {
        startPosition: [1, 0], destination: { type: "MOVE", position: [1, 0] },
    });
    const reversed = battle([{ ...creation(reverse), position: [0.375, 1] }]);
    assert.equal(route.remainingDistance(reversed, get(reversed, 0)), 0.375);
});

test("two route layers restore control by priority while ordinary distance and waits remain independent", () => {
    const destination = { type: "EXIT", position: [0, 7], requireFinish: true };
    let state = battle([creation(plan([wait(3), move([0, 2])], { destination }))]);
    const host = units.ref(get(state, 0));
    const input = program => ({ plan: program, offset: [0, 0], alwaysCheckCurrentPoint: false });
    const high = route.addOverride(state, host, {
        ...input(plan([wait(3)])), priority: 10,
    });
    state = step(high.state, []);
    assert.equal(current(state).current.timer, 2);
    const alternative = route.setAlternative(state, host, input(plan([wait(2)], {
        destination: { type: "EXIT", position: [0, 5], requireFinish: true },
    })));
    const low = route.addOverride(alternative.state, host, {
        ...input(plan([wait(1), { type: "APPEAR", position: [0, 3], offset: [0, 0] }])), priority: 5,
    });
    const tied = route.addOverride(low.state, host, {
        ...input(plan([{ type: "APPEAR", position: [0, 4], offset: [0, 0] }])), priority: 10,
    });
    state = ticks(tied.state, 2);
    assert.equal(route.ref(route.activeContext(get(state, 0))), high.value);
    assert.deepEqual(get(state, 0).position, [0, 0]);
    assert.equal(high.value.get(state).index, 1);
    assert.equal(low.value.get(state).current.timer, 0);
    assert.equal(alternative.value.get(state).current.timer, 0);
    assert.equal(current(state).current.timer, 2);
    assert.equal(route.remainingDistance(state, get(state, 0)), 5);

    state = update(state, host, route.removeContext(high.value));
    state = step(state, []);
    assert.equal(route.ref(route.activeContext(get(state, 0))), tied.value);
    assert.deepEqual(get(state, 0).position, [4, 0]);
    state = update(state, host, route.removeContext(tied.value));
    state = step(state, []);
    assert.equal(route.ref(route.activeContext(get(state, 0))), low.value);
    assert.deepEqual(get(state, 0).position, [3, 0]);
    state = update(state, host, route.removeContext(low.value));
    state = step(state, []);
    assert.equal(route.ref(route.activeContext(get(state, 0))), alternative.value);
    assert.equal(alternative.value.get(state).index, 1);
    assert.equal(route.remainingDistance(state, get(state, 0)), 2);
    state = step(update(state, host, appear([5, 0])), []);
    assert.ok(get(state, 0));
    assert.equal(route.remainingDistance(state, get(state, 0)), 0);
    state = update(state, host, route.removeContext(alternative.value));
    state = ticks(state, 2);
    assert.equal(current(state).current.type, "MOVE");
    assert.equal(route.ref(route.activeContext(get(state, 0))), route.ref(current(state)));

    let absolute = battle([creation(plan([wait(2, "BATTLE"), move([0, 2])]))]);
    const absoluteHost = units.ref(get(absolute, 0));
    const other = route.setAlternative(absolute, absoluteHost, input(plan()));
    absolute = ticks(other.state, 3);
    assert.equal(current(absolute).current.anchor, "BATTLE");
    absolute = update(absolute, absoluteHost, route.removeContext(other.value));
    absolute = step(absolute, []);
    assert.equal(current(absolute).current.type, "MOVE");
});

test("route waits continue through forced movement and steering resumes after the forced step", () => {
    let state = battle([creation(plan([wait(1), move([2, 0])]), {
        layer: { type: "GROUND" },
        locomotion: movement,
        shiftable: {
            massLevel: defineAttribute(0),
            restrictions: [],
            body: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 }, mass: 1, frictionFactor: 0 },
        },
    })]);
    const host = units.ref(get(state, 0));
    state = step(unbalance.applyImpulse(state, host, [0.5, 0]).state, []);
    const forcedPosition = get(state, 0).position;
    assert.equal(current(state).current.type, "MOVE");
    assert.equal(isMoving(state, get(state, 0)), false);
    assert.ok(forcedPosition[0] > 0);
    assert.equal(forcedPosition[1], 0);

    state = update(state, host, shiftable.setRestriction({ id: "immune", group: null, value: { allows: () => false } }));
    state = step(state, []);
    assert.equal(shiftable.isUnbalanced(get(state, 0)), false);
    assert.equal(isMoving(state, get(state, 0)), true);
    assert.deepEqual(get(state, 0).position, forcedPosition);
    state = step(state, []);
    assert.ok(get(state, 0).position[1] > 0);
});

test("an impassable starting tile keeps the current MOVE while the unit recovers", () => {
    let state = battle([creation(plan([move([0, 5])]), {
        route: { alwaysCheckCurrentPoint: false },
        locomotion: { ...movement, speed: defineAttribute(0.25) },
    })]);
    const instruction = current(state).current;
    state = updateTile(state, [0, 0], {
        ...getTile(state.battlefield.map, [0, 0]).state,
        passability: "NONE",
    });

    assert.equal(isMoving(state, get(state, 0)), true);
    state = step(state, []);
    assert.deepEqual(current(state).current, instruction);
    assert.notDeepEqual(get(state, 0).position, [0, 0]);

    state = ticks(state, 40);
    assert.deepEqual(get(state, 0).position, [5, 0]);
    assert.equal(current(state).index, 1);
});

test("reassign rebuilds the entered instruction and skipWait only skips a relative wait", () => {
    const program = plan([wait(5), move([0, 3])]);
    let state = battle([creation(program)]);
    const host = units.ref(get(state, 0));
    state = update(state, host, route.skipWait(route.ref(current(state))));
    assert.equal(current(state).current.type, "MOVE");
    state = update(state, host, route.reassign(route.ref(current(state)), program));
    assert.equal(current(state).current.timer, 5);
    state = update(state, host, route.reassign(route.ref(current(state)), plan([wait(100, "BATTLE")])));
    state = update(state, host, route.skipWait(route.ref(current(state))));
    assert.equal(current(state).current.anchor, "BATTLE");
    assert.equal(current(state).current.tick, 100);
});

test("a long immediate program completes while an immediate GOTO cycle yields", () => {
    const program = plan([...Array.from({ length: 200 }, () => wait(0, "BATTLE")), move([0, 2])]);
    const state = battle([creation(program)]);
    assert.equal(current(state).index, 200);
    assert.equal(current(state).current.type, "MOVE");
    let cyclic = battle([creation(plan([wait(0), { type: "GOTO", index: 0 }]))]);
    assert.equal(current(cyclic).index, 0);
    cyclic = ticks(cyclic, 2);
    assert.equal(current(cyclic).index, 0);
});

test("MOVE samples on entry, queries keep the sample and loop entry samples again", () => {
    const instruction = { type: "MOVE", position: [0, 0], offset: [0.2, 0.2], randomizeOffset: true };
    let state = battle([creation(plan([instruction, { type: "GOTO", index: 0 }]), { locomotion: movement })]);
    const host = units.ref(get(state, 0));
    const sample = current(state).current.offset;
    assert.deepEqual(route.movementTarget(state, host).goal, sample);
    state = ticks(state, 2);
    assert.equal(current(state).current, null);
    state = step(state, []);
    assert.notDeepEqual(current(state).current.offset, sample);
});

test("TRACE holds its registered tile and control after arrival until explicitly restarted or removed", () => {
    let state = battle([creation(plan([wait(999)]), { locomotion: movement })]);
    const host = units.ref(get(state, 0));
    const tracing = route.setAlternative(state, host, {
        plan: plan([{ type: "TRACE", position: [0, 2], reached: false }]),
        offset: [0, 0], alwaysCheckCurrentPoint: false,
    });
    state = tracing.state;
    state = ticks(state, 3);
    let context = tracing.value.get(state);
    assert.deepEqual(context.current.position, [0, 2]);
    assert.equal(context.current.reached, true);
    assert.equal(context.index, 0);
    assert.equal(route.ref(route.activeContext(get(state, 0))), route.ref(context));
    assert.equal(route.movementTarget(state, host), null);
    state = update(state, host, appear([0, 0]));
    assert.equal(route.remainingDistance(state, get(state, 0)), 2);
    state = update(state, host, route.setTraceTarget(route.ref(context), [0, 2]));
    context = tracing.value.get(state);
    assert.equal(context.current.reached, false);
    assert.deepEqual(route.movementTarget(state, host).goal, [2, 0]);
    state = update(state, host, route.removeContext(route.ref(context)));
    assert.equal(tracing.value.get(state), undefined);
    assert.equal(current(state).current.timer, 999);
    assert.equal(route.ref(route.activeContext(get(state, 0))), route.ref(current(state)));
});

test("Main EXIT ends the Unit lifetime once independently of both other route layers, while MOVE keeps it present", () => {
    const exits = [];
    const observeExit = {
        id: "exit", priority: 0,
        invoke: (current, departure) => { exits.push(departure.reason); return { state: current, value: undefined }; },
    };
    let state = battle([creation(plan([{ type: "APPEAR", position: [0, 3], offset: [0, 0] }], {
        destination: { type: "EXIT", position: [0, 3], requireFinish: true },
    }))]);
    state = setHook(state, unitRemoved, observeExit);
    const host = units.ref(get(state, 0));
    assert.equal(current(state).index, 1);
    assert.deepEqual(get(state, 0).position, [3, 0]);
    state = route.setAlternative(state, host, {
        plan: plan([wait(999)]), offset: [0, 0], alwaysCheckCurrentPoint: false,
    }).state;
    const temporary = route.addOverride(state, host, {
        plan: plan([{ type: "TRACE", position: [0, 5], reached: false }]),
        offset: [0, 0], alwaysCheckCurrentPoint: false, priority: 1,
    });
    state = temporary.state;
    const exitTick = state.tick;
    state = step(state, []);
    assert.equal(get(state, 0), undefined);
    assert.deepEqual(state.events.filter(event => event.type === "UNIT_REMOVED")
        .map(({ type, unitId, tick, reason }) => ({ type, unitId, tick, reason })), [
        { type: "UNIT_REMOVED", unitId: host.id, tick: exitTick, reason: "EXIT" },
    ]);
    state = step(state, []);
    assert.equal(state.events.some(event => event.type === "UNIT_REMOVED" && event.reason === "EXIT"), false);
    assert.deepEqual(exits, ["EXIT"]);
    let forced = ticks(battle([creation(plan())]), 3);
    assert.notEqual(get(forced, 0), undefined);
    forced = setHook(forced, unitRemoved, observeExit);
    forced = units.remove(forced, units.ref(get(forced, 0)), { reason: "EXIT" });
    assert.equal(get(forced, 0), undefined);
    assert.deepEqual(exits, ["EXIT", "EXIT"]);
    const waitingAtExit = plan([wait(999)], { destination: { type: "EXIT", position: [0, 0], requireFinish: true } });
    assert.ok(get(step(battle([creation(waitingAtExit)]), []), 0));
    const earlyExit = { ...waitingAtExit, destination: { ...waitingAtExit.destination, requireFinish: false } };
    assert.equal(get(step(battle([creation(earlyExit)]), []), 0), undefined);

    let stay = battle([creation(plan([], { destination: { type: "MOVE", position: [0, 3] } }), { locomotion: movement })]);
    assert.equal(route.remainingDistance(stay, get(stay, 0)), 3);
    stay = ticks(stay, 5);
    assert.deepEqual(get(stay, 0).position, [3, 0]);
    assert.equal(route.remainingDistance(stay, get(stay, 0)), 0);
    assert.equal(stay.events.some(event => event.type === "UNIT_REMOVED"), false);
});

test("spatial instructions publish consumption before hooks and resume the latest Context", () => {
    for (const operation of ["reassign", "override"]) {
        let state = battle([
            creation(plan([wait(20)]), {
                layer: { type: "GROUND" }, blockable: { volume: 1, restrictions: [] },
            }),
            { definition: { id: "blocker", hooks: Hooks.empty(),
                blocker: { calculateOffset, capacity: 1, rule: { ...blocker.ground, radius: 1 }, restrictions: [] },
            }, hooks: Hooks.empty(), initial: {}, position: [0, 0] },
        ]);
        const host = units.ref(get(state, 0));
        const replacement = plan([wait(9), move([0, 2])]);
        let released = 0;
        state = update(state, host, units.setHook(blockable.released, {
            id: "change-route", priority: 0, invoke: (state) => {
                released++;
                assert.equal(current(state).index, 1);
                assert.equal(current(state).current, null);
                assert.equal(get(state, 0).presence.present, false);
                state = operation === "reassign"
                    ? update(state, host, route.reassign(route.ref(current(state)), replacement))
                    : route.addOverride(state, host, {
                        plan: plan([wait(9)]), offset: [0, 0], alwaysCheckCurrentPoint: false, priority: 1,
                    }).state;
                return { state, value: undefined };
            },
        }));
        state = search(state, units.ref(get(state, 1)));
        assert.notEqual(get(state, 0).blockable.relation, null);
        state = update(state, host, route.reassign(route.ref(current(state)), plan([
            { type: "DISAPPEAR" }, { type: "APPEAR", position: [0, 6], offset: [0, 0] }, wait(4),
        ])));
        assert.equal(released, 1);
        if (operation === "reassign") {
            assert.equal(current(state).plan, replacement);
            assert.equal(current(state).current.timer, 9);
            assert.deepEqual(get(state, 0).position, [0, 0]);
        } else {
            assert.equal(current(state).index, 1);
            assert.equal(current(state).current, null);
            assert.equal(get(state, 0).presence.present, false);
            state = update(state, host, route.removeContext(route.ref(route.activeContext(get(state, 0)))));
            state = step(state, []);
            assert.equal(current(state).index, 2);
            assert.equal(current(state).current.timer, 4);
            assert.equal(get(state, 0).presence.present, true);
            assert.deepEqual(get(state, 0).position, [6, 0]);
        }
    }
});
