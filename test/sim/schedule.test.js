import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import * as lifecycle from "../../dist/core/unit/hook.js";
import { all, get, ref } from "../../dist/core/unit/query.js";
import { remove } from "../../dist/core/battle/unit.js";
import * as predefined from "../../dist/core/battle/steps/predefined.js";
import { step } from "../../dist/core/battle/runtime.js";
import { isCompleted, timing, triggerBranch } from "../../dist/core/battle/schedule/index.js";
import { battle, get as getUnit } from "../helpers/battle.js";

const plan = {
    motionMode: "WALK",
    startPosition: [1, 1],
    endPosition: null,
    checkpoints: [{ type: "WAIT", anchor: "ENTER", tick: 1000, timer: null }],
    requireAllCheckpoints: true,
};

function definition(id, enter) {
    return {
        id,
        hooks:
            enter === undefined
                ? Hooks.empty()
                : Hooks.empty().set(lifecycle.enter, {
                      id: `content/${id}`,
                      invoke: (state, self) => ({ state: enter(state, self), value: undefined }),
                  }),
        route: { alwaysCheckCurrentPoint: true },
    };
}

function spawn(definition, atTick = 0, wait = "NONE") {
    return { definition, plan, offset: [0, 0], randomRange: [0, 0], atTick, wait };
}

function fragment(spawns, preDelayTicks = 0) {
    return { spawns, preDelayTicks };
}

function wave(fragments, options = {}) {
    return { fragments, preDelayTicks: 0, postDelayTicks: 0, maxWaitingTicks: null, ...options };
}

function create(schedule) {
    return battle([], { schedule, rngState: 7 });
}

function through(state, tick) {
    while (state.tick <= tick) state = step(state, []);
    return state;
}

test("wave and fragment clocks execute preprocessed births and share the sampled offset", () => {
    const births = [];
    const unitDefinition = definition("waiting-enemy", (state, self) => {
        births.push({ tick: state.tick, self });
        return state;
    });
    const first = { ...spawn(unitDefinition), offset: [0.1, 0.2], randomRange: [0.3, 0.4] };
    const schedule = {
        waves: [
            wave(
                [
                    fragment([first, spawn(unitDefinition, 2)], 3),
                    fragment([spawn(unitDefinition)], 1),
                ],
                {
                    preDelayTicks: 2,
                    postDelayTicks: 2,
                },
            ),
            wave([fragment([spawn(unitDefinition)])], { preDelayTicks: 1 }),
        ],
        branches: {},
    };
    const state = through(create(schedule), 11);

    assert.deepEqual(
        births.map(({ tick }) => tick),
        [5, 7, 8, 11],
    );
    const self = births[0].self;
    assert.deepEqual(self.position, [1 + self.route.main.offset[0], 1 + self.route.main.offset[1]]);
    assert.ok(self.route.main.offset[0] >= -0.2 && self.route.main.offset[0] <= 0.4);
    assert.ok(self.route.main.offset[1] >= -0.2 && self.route.main.offset[1] <= 0.6);
    assert.equal(isCompleted(state.schedule), true);
    assert.equal([...all(state)].length, 4);
});

test("wait policies publish before enter; timeout leaves final waits until complete removal", () => {
    const entries = [];
    const observe = (state, self) => {
        entries.push({
            id: self.id,
            wave: state.schedule.waiting.wave.includes(self.id),
            final: state.schedule.waiting.final.includes(self.id),
        });
        return state;
    };
    let state = step(
        create({
            waves: [
                wave(
                    [
                        fragment([
                            spawn(definition("unmanaged", observe), 0, "NONE"),
                            spawn(definition("final", observe), 0, "FINAL"),
                            spawn(definition("wave", observe), 0, "WAVE"),
                        ]),
                    ],
                    { maxWaitingTicks: 2, postDelayTicks: 2 },
                ),
                wave([fragment([spawn(definition("next-wave", observe), 1)])]),
            ],
            branches: {
                late: {
                    phases: [
                        {
                            preDelayTicks: 0,
                            entries: [[spawn(definition("late-wave", observe), 0, "WAVE")]],
                        },
                    ],
                },
            },
        }),
        [],
    );

    assert.deepEqual(entries, [
        { id: 0, wave: false, final: false },
        { id: 1, wave: false, final: true },
        { id: 2, wave: true, final: true },
    ]);
    assert.equal(state.schedule.main.type, "WAITING");
    state = through(state, 2);
    assert.equal(state.schedule.main.type, "POST_DELAY");
    assert.deepEqual(state.schedule.waiting, { wave: [], final: [1, 2] });

    state = triggerBranch(state, "late", false);
    assert.deepEqual(state.schedule.waiting, { wave: [3], final: [1, 2, 3] });
    state = through(state, 4);
    assert.equal(state.schedule.waveIndex, 1);
    assert.deepEqual(state.schedule.waiting, { wave: [], final: [1, 2, 3] });
    state = through(state, 5);
    assert.equal(state.schedule.main.type, "COMPLETED");
    assert.equal(isCompleted(state.schedule), false);

    state = remove(state, ref(getUnit(state, 2)), "SCRIPT");
    assert.deepEqual(state.schedule.waiting.final, [1, 3]);
    state = remove(state, ref(getUnit(state, 1)), "SCRIPT");
    assert.deepEqual(state.schedule.waiting.final, [3]);
    state = remove(state, ref(getUnit(state, 3)), "SCRIPT");
    assert.equal(isCompleted(state.schedule), true);
    assert.deepEqual(
        [...all(state)].map(({ id }) => id),
        [0, 4],
    );
});

test("an enemy removed in enter releases its wait before the next wave starts", () => {
    const births = [];
    const departing = definition("departing", (state, self) => {
        births.push([self.definition.id, state.tick]);
        return remove(state, ref(self), "SCRIPT");
    });
    const following = definition("following", (state, self) => {
        births.push([self.definition.id, state.tick]);
        return state;
    });
    const state = step(
        create({
            waves: [
                wave([fragment([spawn(departing, 0, "WAVE")])]),
                wave([fragment([spawn(following)])]),
            ],
            branches: {},
        }),
        [],
    );

    assert.deepEqual(births, [
        ["departing", 0],
        ["following", 0],
    ]);
    assert.deepEqual(state.schedule.waiting, { wave: [], final: [] });
    assert.deepEqual(
        [...all(state)].map(({ definition }) => definition.id),
        ["following"],
    );
    assert.equal(isCompleted(state.schedule), true);
});

test("enter can trigger the next branch phase without losing its later births", () => {
    const births = [];
    const record = (state, self) => {
        births.push(self.definition.id);
        return state;
    };
    const first = definition("first", (state, self) => {
        births.push(self.definition.id);
        assert.equal(state.schedule.nextPhaseIndices.branch, 1);
        return triggerBranch(state, "branch", false);
    });
    const secondPhase = {
        preDelayTicks: 0,
        entries: [[spawn(definition("nested", record)), spawn(definition("later", record), 2)]],
    };
    let state = triggerBranch(
        create({
            waves: [],
            branches: {
                branch: {
                    phases: [
                        {
                            preDelayTicks: 0,
                            entries: [[spawn(first), spawn(definition("outer-tail", record))]],
                        },
                        secondPhase,
                    ],
                },
            },
        }),
        "branch",
        false,
    );

    assert.deepEqual(births, ["first", "nested", "outer-tail"]);
    assert.equal(state.schedule.nextPhaseIndices.branch, 2);
    assert.equal(state.schedule.activePhases.length, 1);
    state = through(state, 2);
    assert.deepEqual(births, ["first", "nested", "outer-tail", "later"]);
    assert.equal(isCompleted(state.schedule), true);
});

test("looping weighted phases publish RNG before enter and retain each selected execution", () => {
    const births = [];
    const record = (state, self) => {
        births.push([self.definition.id, state.tick]);
        return births.length === 1 ? triggerBranch(state, "loop", true) : state;
    };
    const phase = {
        preDelayTicks: 0,
        entries: [
            {
                options: [
                    {
                        weight: 1,
                        spawns: [
                            spawn(definition("a", record)),
                            spawn(definition("a-tail", record), 1),
                        ],
                    },
                    {
                        weight: 1,
                        spawns: [
                            spawn(definition("b", record)),
                            spawn(definition("b-tail", record), 2),
                        ],
                    },
                ],
            },
        ],
    };
    let state = triggerBranch(
        create({ waves: [], branches: { loop: { phases: [phase] } } }),
        "loop",
        true,
    );

    assert.deepEqual(births, [
        ["a", 0],
        ["b", 0],
    ]);
    assert.equal(state.schedule.activePhases.length, 2);
    state = step(state, []);
    assert.deepEqual(births, [
        ["a", 0],
        ["b", 0],
    ]);
    state = step(state, []);
    assert.deepEqual(births, [
        ["a", 0],
        ["b", 0],
        ["a-tail", 1],
    ]);
    assert.equal(state.schedule.activePhases.length, 1);
    state = step(state, []);
    assert.deepEqual(births, [
        ["a", 0],
        ["b", 0],
        ["a-tail", 1],
        ["b-tail", 2],
    ]);
    assert.equal(isCompleted(state.schedule), true);
});

test("dynamic birth waits use the captured Wave and Fragment clocks", () => {
    const snapshots = [];
    const capture = (state, self) => {
        snapshots.push([
            self.definition.id,
            state.tick,
            self.route.waveStartTick,
            self.route.fragmentReadyTick,
        ]);
        return state;
    };
    const follower = definition("follower", capture);
    const followerPlan = { ...plan, checkpoints: [
        { type: "WAIT", anchor: "WAVE", tick: 10, timer: null },
        { type: "WAIT", anchor: "FRAGMENT", tick: 6, timer: null },
        { type: "MOVE", position: [1, 3], offset: [0, 0], randomizeOffset: false },
    ] };
    const branch = definition("branch", (state, self) => {
        return predefined.appear(capture(state, self), 10);
    });
    let state = battle([], { schedule: {
        waves: [
            wave([], { preDelayTicks: 2, postDelayTicks: 1 }),
            wave([fragment([spawn(definition("main", capture), 1, "WAVE")], 3)], {
                preDelayTicks: 2,
            }),
        ],
        branches: { branch: { phases: [{ preDelayTicks: 2, entries: [[spawn(branch)]] }] } },
    }, predefines: [{
        id: 10, alias: null, initiallyPresent: false,
        creation: { type: "UNIT", definition: follower, position: [1, 1],
            initial: { route: { plan: followerPlan, offset: [0, 0] } },
        },
    }] });
    assert.deepEqual(timing(state.schedule), { waveStartTick: 0, fragmentReadyTick: 0 });
    state = through(state, 9);
    state = triggerBranch(state, "branch", false);
    state = through(state, 12);

    assert.deepEqual(snapshots, [
        ["main", 9, 3, 8],
        ["branch", 12, 3, 8],
        ["follower", 12, 3, 8],
    ]);
    assert.deepEqual(timing(state.schedule), { waveStartTick: 3, fragmentReadyTick: 8 });
    const followerRef = ref(all(state).find((unit) => unit.definition === follower));
    assert.equal(get(state, followerRef).route.main.current.anchor, "WAVE");
    state = step(state, []);
    assert.equal(get(state, followerRef).route.main.current.anchor, "FRAGMENT");
    state = step(state, []);
    assert.equal(get(state, followerRef).route.main.current.type, "MOVE");
});
