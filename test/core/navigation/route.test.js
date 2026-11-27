// Contract: [navigation](../../../docs/architecture/navigation.md#route-定义与进度).
import { attribute as defineAttribute } from "../../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { Hooks } from "../../../dist/core/hook.js";
import { removed as unitRemoved, setHook } from "../../../dist/core/battle/unit-hook.js";
import * as route from "../../../dist/core/unit/capability/route/index.js";
import * as units from "../../../dist/core/unit/index.js";
import { update } from "../../../dist/core/unit/operations.js";
import { step } from "../../../dist/core/battle/runtime.js";
import { appear } from "../../../dist/core/unit/capability/presence/index.js";
import { shiftable, unbalance } from "../../../dist/core/unit/capability/shifting/index.js";
import { calculateOffset, search } from "../../../dist/core/battle/blocking/index.js";
import { blockable, blocker } from "../../../dist/core/unit/capability/blocking/index.js";
import * as navigation from "../../../dist/core/battlefield/navigation/state.js";
import { get as getTile } from "../../../dist/core/battlefield/map/map.js";
import { update as updateTile } from "../../../dist/core/battle/tile.js";

const plan = (checkpoints = [], extra = {}) => ({
    motionMode: "WALK", startPosition: [0, 0], destination: null,
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
        presence: {}, ...extra,
    }, hooks: Hooks.empty(), position: [0, 0], initial: { route: { plan: program, offset: [0, 0] } } };
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
    let state = battle([creation(program)]);
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
    assert.equal(navigation.distance(state.battlefield.navigation, "WALK", [0, 0], { tile: [2, 4], position: [4, 2] }), 6);
    assert.equal(route.remainingDistance(state, self, self.route.main), 7);
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
    const target = { tile: checkpoint.position, position: goal };

    // The offset endpoint is in [2, 1], which would require a turn around [2, 0].
    assert.deepEqual(route.movementTarget(state, host), { nextPoint: goal, goal });
    assert.equal(navigation.distance(state.battlefield.navigation, "WALK", [0, 1], target), 1.25);
    assert.equal(navigation.distance(state.battlefield.navigation, "WALK", [0.375, 1], { tile: [1, 1], position: [0.125, 1] }), 0.25);
    assert.equal(route.remainingDistance(state, get(state, 0), current(state)), 1.5);

    state = updateTile(state, checkpoint.position, {
        ...getTile(state.battlefield.map, checkpoint.position).state,
        passability: "NONE",
    });
    assert.equal(route.movementTarget(state, host), null);
    assert.equal(navigation.distance(state.battlefield.navigation, "WALK", [0, 1], target), null);
    assert.equal(route.remainingDistance(state, get(state, 0), current(state)), 1.25);
    // An unreachable MOVE is skipped when checking the current point is optional.
    state = route.advance(state, host);
    assert.equal(current(state).index, 1);
});

test("distance observes the requested Main or TRACE rather than temporary movement control", () => {
    let state = battle([creation(plan([wait(999)], { destination: { type: "EXIT", position: [0, 5], requireFinish: true } }))]);
    const host = units.ref(get(state, 0));
    const fear = route.createContext(state, host, {
        plan: plan([move([0, 1])]), offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    const trace = route.createContext(fear.state, host, {
        plan: plan([{ type: "TRACE", position: [0, 3], reached: false }]),
        offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    state = update(trace.state, host, route.selectContext(trace.value));
    state = update(state, host, appear([3, 0]));
    state = route.advance(state, host);
    assert.equal(trace.value.get(state).current.reached, true);
    state = update(state, host, units.compose(appear([1, 0]), route.selectContext(fear.value)));
    const self = get(state, 0);
    assert.equal(route.remainingDistance(state, self, self.route.main), 4);
    assert.equal(route.remainingDistance(state, self, trace.value.get(state)), 2);
    assert.equal(route.remainingDistance(state, self, fear.value.get(state)), undefined);
});

test("Context selection and ticking separately control relative and absolute waits", () => {
    let state = battle([creation(plan([wait(3), move([0, 2])]))]);
    const host = units.ref(get(state, 0));
    const temporary = route.createContext(state, host, {
        plan: plan([wait(2)]), offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    state = update(temporary.state, host, units.compose(
        route.selectContext(temporary.value), route.setTicking(route.ref(current(state)), false),
    ));
    state = ticks(state, 2);
    assert.equal(current(state).current.timer, 3);
    assert.equal(temporary.value.get(state).index, 1);
    state = update(state, host, units.compose(route.selectContext(route.ref(current(state))), route.setTicking(route.ref(current(state)), true)));
    state = ticks(state, 3);
    assert.equal(current(state).current.type, "MOVE");

    let absolute = battle([creation(plan([wait(2, "BATTLE"), move([0, 2])]))]);
    const absoluteHost = units.ref(get(absolute, 0));
    const other = route.createContext(absolute, absoluteHost, {
        plan: plan(), offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    absolute = update(other.state, absoluteHost, units.compose(
        route.selectContext(other.value), route.setTicking(route.ref(current(absolute)), false),
    ));
    absolute = ticks(absolute, 3);
    assert.equal(current(absolute).current.anchor, "BATTLE");
    absolute = update(absolute, absoluteHost, route.selectContext(route.ref(current(absolute))));
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
    assert.ok(forcedPosition[0] > 0);
    assert.equal(forcedPosition[1], 0);

    state = update(state, host, shiftable.setRestriction({ id: "immune", group: null, value: { allows: () => false } }));
    state = step(state, []);
    assert.equal(shiftable.isUnbalanced(get(state, 0)), false);
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
    const tracing = route.createContext(state, host, {
        plan: plan([{ type: "TRACE", position: [0, 2], reached: false }]),
        offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    state = update(tracing.state, host, units.compose(
        route.selectContext(tracing.value), route.setTicking(route.ref(current(state)), false),
    ));
    state = ticks(state, 3);
    let context = tracing.value.get(state);
    assert.deepEqual(context.current.position, [0, 2]);
    assert.equal(context.current.reached, true);
    assert.equal(context.index, 0);
    assert.equal(get(state, 0).route.active, route.ref(context));
    assert.equal(route.movementTarget(state, host), null);
    state = update(state, host, appear([0, 0]));
    state = update(state, host, route.setTraceTarget(route.ref(context), [0, 2]));
    context = tracing.value.get(state);
    assert.equal(context.current.reached, false);
    assert.deepEqual(route.movementTarget(state, host).goal, [2, 0]);
    state = update(state, host, route.removeContext(route.ref(context), route.ref(current(state))));
    assert.equal(tracing.value.get(state), undefined);
    assert.equal(current(state).current.timer, 999);
    assert.equal(get(state, 0).route.active, route.ref(current(state)));
});

test("Main MOVE destination keeps the Unit present and EXIT ends its lifetime once independently of the selected Context", () => {
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
    const temporary = route.createContext(state, host, {
        plan: plan([{ type: "TRACE", position: [0, 5], reached: false }]),
        offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    state = update(temporary.state, host, units.compose(
        route.selectContext(temporary.value), route.setTicking(route.ref(current(state)), false),
    ));
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
    assert.equal(route.remainingDistance(stay, get(stay, 0), current(stay)), 3);
    stay = ticks(stay, 5);
    assert.deepEqual(get(stay, 0).position, [3, 0]);
    assert.equal(route.remainingDistance(stay, get(stay, 0), current(stay)), 0);
    assert.equal(stay.events.some(event => event.type === "UNIT_REMOVED"), false);
});

test("spatial instructions publish consumption before hooks and resume the latest Context", () => {
    for (const operation of ["reassign", "ticking"]) {
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
                state = update(state, host, operation === "reassign"
                    ? route.reassign(route.ref(current(state)), replacement)
                    : route.setTicking(route.ref(current(state)), false));
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
            assert.equal(current(state).index, 2);
            assert.equal(current(state).current.timer, 4);
            assert.equal(current(state).ticking, false);
            assert.equal(get(state, 0).presence.present, true);
            assert.deepEqual(get(state, 0).position, [6, 0]);
        }
    }
});
