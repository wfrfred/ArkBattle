import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as lifecycle from "../../dist/core/unit/hook.js";
import * as route from "../../dist/core/unit/capability/route/index.js";
import * as units from "../../dist/core/unit/index.js";
import { update, remove } from "../../dist/core/battle/unit.js";
import { step } from "../../dist/core/battle/runtime.js";
import { appear } from "../../dist/core/unit/capability/presence/index.js";
import { search } from "../../dist/core/battle/blocking/index.js";
import { setHook } from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import * as navigation from "../../dist/core/battlefield/navigation/state.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { update as updateTile } from "../../dist/core/battle/tile.js";

const plan = (checkpoints = [], extra = {}) => ({
    motionMode: "WALK", startPosition: [0, 0], endPosition: null,
    checkpoints, requireAllCheckpoints: true, ...extra,
});
const wait = (tick, anchor = "ENTER") => ({ type: "WAIT", anchor, tick, timer: null });
const move = position => ({ type: "MOVE", position, offset: [0, 0], randomizeOffset: false });
const movement = {
    speed: 1, minSpeed: 0, halfBodyWidth: 0,
    steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
};
function creation(program, extra = {}) {
    return { definition: {
        id: "traveller", hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true },
        spatialPresence: {}, ...extra,
    }, position: [0, 0], initial: { route: { plan: program, offset: [0, 0] } } };
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
    ], { endPosition: [0, 7] });
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
    assert.equal(navigation.distance(state.battlefield.navigation, "WALK", [0, 0], [4, 2]), 6);
    assert.equal(route.remainingDistance(state, self, self.route.main), 7);

    const open = battle();
    assert.ok(navigation.distance(open.battlefield.navigation, "WALK", [0.49, 0.49], [0.51, 0.1]) > 0);
});

test("distance observes the requested Main or TRACE rather than temporary movement control", () => {
    let state = battle([creation(plan([wait(999)], { endPosition: [0, 5] }))]);
    const host = units.ref(get(state, 0));
    const fear = route.createContext(state, host, {
        plan: plan([move([0, 1])]), offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    const trace = route.createContext(fear.state, host, {
        plan: plan([{ type: "TRACE", position: [0, 3], reached: false }]),
        offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    state = update(trace.state, host, route.selectContext(trace.value.id));
    state = update(state, host, appear([3, 0]));
    state = route.advance(state, host);
    assert.equal(route.getContext(state, trace.value).current.reached, true);
    state = update(state, host, units.compose(appear([1, 0]), route.selectContext(fear.value.id)));
    const self = get(state, 0);
    assert.equal(route.remainingDistance(state, self, self.route.main), 4);
    assert.equal(route.remainingDistance(state, self, route.getContext(state, trace.value)), 2);
    assert.equal(route.remainingDistance(state, self, route.getContext(state, fear.value)), undefined);
});

test("Context selection and ticking separately control relative and absolute waits", () => {
    let state = battle([creation(plan([wait(3), move([0, 2])]))]);
    const host = units.ref(get(state, 0));
    const temporary = route.createContext(state, host, {
        plan: plan([wait(2)]), offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    state = update(temporary.state, host, units.compose(
        route.selectContext(temporary.value.id), route.setTicking(0, false),
    ));
    state = ticks(state, 2);
    assert.equal(current(state).current.timer, 3);
    assert.equal(route.getContext(state, temporary.value).index, 1);
    state = update(state, host, units.compose(route.selectContext(0), route.setTicking(0, true)));
    state = ticks(state, 3);
    assert.equal(current(state).current.type, "MOVE");

    let absolute = battle([creation(plan([wait(2, "BATTLE"), move([0, 2])]))]);
    const absoluteHost = units.ref(get(absolute, 0));
    const other = route.createContext(absolute, absoluteHost, {
        plan: plan(), offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    absolute = update(other.state, absoluteHost, units.compose(
        route.selectContext(other.value.id), route.setTicking(0, false),
    ));
    absolute = ticks(absolute, 3);
    assert.equal(current(absolute).current.anchor, "BATTLE");
    absolute = update(absolute, absoluteHost, route.selectContext(0));
    absolute = step(absolute, []);
    assert.equal(current(absolute).current.type, "MOVE");
});

test("reassign rebuilds the entered instruction and skipWait only skips a relative wait", () => {
    const program = plan([wait(5), move([0, 3])]);
    let state = battle([creation(program)]);
    const host = units.ref(get(state, 0));
    state = update(state, host, route.skipWait(0));
    assert.equal(current(state).current.type, "MOVE");
    state = update(state, host, route.reassign(0, program));
    assert.equal(current(state).current.timer, 5);
    state = update(state, host, route.reassign(0, plan([wait(100, "BATTLE")])));
    state = update(state, host, route.skipWait(0));
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
    const rngState = state.execution.rngState;
    assert.deepEqual(route.movementTarget(state, host).goal, sample);
    assert.equal(state.execution.rngState, rngState);
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
        route.selectContext(tracing.value.id), route.setTicking(0, false),
    ));
    state = ticks(state, 3);
    let context = route.getContext(state, tracing.value);
    assert.deepEqual(context.current.position, [0, 2]);
    assert.equal(context.current.reached, true);
    assert.equal(context.index, 0);
    assert.equal(get(state, 0).route.activeId, context.id);
    assert.equal(route.movementTarget(state, host), null);
    state = update(state, host, appear([0, 0]));
    state = update(state, host, route.setTraceTarget(context.id, [0, 2]));
    context = route.getContext(state, tracing.value);
    assert.equal(context.current.reached, false);
    assert.deepEqual(route.movementTarget(state, host).goal, [2, 0]);
    state = update(state, host, route.removeContext(context.id, 0));
    assert.equal(route.getContext(state, tracing.value), undefined);
    assert.equal(current(state).current.timer, 999);
    assert.equal(get(state, 0).route.activeId, 0);
});

test("Main exit is independent of the selected Context and completes Unit lifetime once", () => {
    let leaves = 0;
    let state = battle([creation(plan([{ type: "APPEAR", position: [0, 3], offset: [0, 0] }], {
        endPosition: [0, 3],
    }), { hooks: Hooks.empty().set(lifecycle.leave, {
        id: "leave", invoke: state => { leaves++; return { state, value: undefined }; },
    }) })]);
    const host = units.ref(get(state, 0));
    assert.equal(current(state).index, 1);
    assert.deepEqual(get(state, 0).position, [3, 0]);
    const temporary = route.createContext(state, host, {
        plan: plan([{ type: "TRACE", position: [0, 5], reached: false }]),
        offset: [0, 0], alwaysCheckCurrentPoint: false, ticking: true,
    });
    state = update(temporary.state, host, units.compose(
        route.selectContext(temporary.value.id), route.setTicking(0, false),
    ));
    state = step(state, []);
    assert.equal(get(state, 0), undefined);
    assert.equal(leaves, 1);
    assert.equal(state.events.filter(event => event.type === "ROUTE_COMPLETED").length, 1);
    assert.notEqual(get(ticks(battle([creation(plan())]), 3), 0), undefined);
    const waitingAtExit = plan([wait(999)], { endPosition: [0, 0] });
    assert.ok(get(step(battle([creation(waitingAtExit)]), []), 0));
    const earlyExit = { ...waitingAtExit, requireAllCheckpoints: false };
    assert.equal(get(step(battle([creation(earlyExit)]), []), 0), undefined);
});

test("spatial instructions publish consumption before hooks and resume the latest Context", () => {
    for (const operation of ["reassign", "ticking", "remove"]) {
        let state = battle([
            creation(plan([wait(20)]), {
                layer: { type: "GROUND" }, blockable: { volume: 1, rules: [] },
            }),
            { definition: { id: "blocker", hooks: Hooks.empty(),
                blocker: { layer: "GROUND", capacity: 1, radius: 1, rules: [] },
            }, position: [0, 0] },
        ]);
        const host = units.ref(get(state, 0));
        const replacement = plan([wait(9), move([0, 2])]);
        let released = 0;
        state = update(state, host, setHook("released", {
            id: "change-route", invoke: (state) => {
                released++;
                assert.equal(current(state).index, 1);
                assert.equal(current(state).current, null);
                assert.equal(get(state, 0).spatialPresence.present, false);
                if (operation === "remove") {
                    state = remove(state, host.id, "SCRIPT");
                } else {
                    state = update(state, host, operation === "reassign"
                        ? route.reassign(0, replacement)
                        : route.setTicking(0, false));
                }
                return { state, value: undefined };
            },
        }));
        state = search(state, units.ref(get(state, 1)));
        assert.notEqual(get(state, 0).blockable.relation, null);
        state = update(state, host, route.reassign(0, plan([
            { type: "DISAPPEAR" }, { type: "APPEAR", position: [0, 6], offset: [0, 0] }, wait(4),
        ])));
        assert.equal(released, 1);
        if (operation === "remove") {
            assert.equal(get(state, 0), undefined);
        } else if (operation === "reassign") {
            assert.equal(current(state).plan, replacement);
            assert.equal(current(state).current.timer, 9);
            assert.deepEqual(get(state, 0).position, [0, 0]);
        } else {
            assert.equal(current(state).index, 2);
            assert.equal(current(state).current.timer, 4);
            assert.equal(current(state).ticking, false);
            assert.equal(get(state, 0).spatialPresence.present, true);
            assert.deepEqual(get(state, 0).position, [6, 0]);
        }
    }
});
