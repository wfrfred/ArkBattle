import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import { createRng } from "../../dist/core/common/rng.js";
import { parseLevelDefinition } from "../../dist/data/arknights/level.js";
import { parseRouteDefinition } from "../../dist/data/arknights/route.js";
import { compileSpawnSchedule } from "../../dist/data/arknights/schedule.js";

const fixture = (name) => JSON.parse(readFileSync(new URL(`../fixtures/arknights/${name}.json`, import.meta.url), "utf8"));

function source() {
    const level = parseLevelDefinition(fixture("level_act1autochess_01"));
    const original = level.waves[0].fragments[0].actions[0];
    const action = (key, group, weight, count = 1) => ({
        ...original, key, randomSpawnGroupKey: group, weight, count,
        preDelay: 0, interval: 0.1, routeIndex: 0,
    });
    const actions = [action("A", "group", 0), action("N", null, 0), action("B", "group", 1, 2)];
    const definitions = new Map(actions.map(({ key }) => [key, {
        id: key, hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true },
    }]));

    return {
        level: {
            ...level,
            enemyDbRefs: actions.map(({ key }) => ({ id: key, level: 0, useDb: true, overwrittenData: null })),
            extraRoutes: level.routes,
            waves: [{ ...level.waves[0], preDelay: 0, postDelay: 0, fragments: [{ preDelay: 0, actions }] }],
            branches: {},
        },
        resolve: ({ id }) => ({
            definition: definitions.get(id), delayToBornTicks: 0,
            onlyDelayToBornOnTileStart: false, notCountInTotal: false,
        }),
        definitions,
        actions,
    };
}

test("native routes compile patrol loops and retain wait anchors before birth", () => {
    const raw = fixture("level_act1autochess_h07_02");
    const level = parseLevelDefinition(raw);
    assert.deepEqual(level.routes[6].plan.checkpoints.map(({ type }) => type), ["MOVE", "MOVE", "MOVE", "GOTO"]);
    assert.equal(level.routes[6].plan.checkpoints[3].index, 0);
    assert.equal(level.routes[0].plan.checkpoints[2].anchor, "ENTER");
    assert.equal(level.routes[0].plan.checkpoints[2].timer, null);

    const route = parseRouteDefinition({
        ...raw.routes[0],
        checkpoints: ["WAIT_FOR_SECONDS", "WAIT_FOR_PLAY_TIME", "WAIT_CURRENT_WAVE_TIME", "WAIT_CURRENT_FRAGMENT_TIME"]
            .map((type) => ({ type, time: 1 })),
    });
    assert.deepEqual(route.plan.checkpoints.map(({ anchor, tick, timer }) => [anchor, tick, timer]), [
        ["ENTER", 30, null], ["BATTLE", 30, null], ["WAVE", 30, null], ["FRAGMENT", 30, null],
    ]);

    const patrol = raw.routes[6].checkpoints[0];
    const alert = parseRouteDefinition({ ...raw.routes[6], checkpoints: [patrol, { type: "ALERT" }] });
    assert.deepEqual(alert.plan.checkpoints.map(({ type }) => type), ["MOVE"]);
});

test("main random groups preserve source order and expand the selected count once", () => {
    const { level, resolve, definitions } = source();
    const seed = 123;
    const compiled = compileSpawnSchedule(level, {
        actions: [0, 1, 2].map((actionIndex) => ({ waveIndex: 0, fragmentIndex: 0, actionIndex })),
        branches: [],
    }, resolve, seed);
    const spawns = compiled.schedule.waves[0].fragments[0].spawns;

    assert.deepEqual(spawns.map(({ definition }) => definition.id), ["N", "B", "B"]);
    assert.deepEqual(spawns.map(({ atTick }) => atTick), [0, 0, 3]);
    assert.equal(spawns[1].definition, definitions.get("B"));
    assert.equal(spawns[1].plan, level.routes[0].plan);
    const rng = createRng(seed);
    rng.next();
    assert.equal(compiled.rngState, rng.state());
    const actions = level.waves[0].fragments[0].actions.map((action) => ({
        ...action, weight: action.randomSpawnGroupKey === null ? 0 : 1,
        randomSpawnGroupPackKey: action.key === "A" ? "pack" : null,
    }));
    assert.throws(() => compileSpawnSchedule({ ...level, waves: [{ ...level.waves[0],
        fragments: [{ preDelay: 0, actions }],
    }] }, { actions: [0, 1, 2].map((actionIndex) => ({ waveIndex: 0, fragmentIndex: 0, actionIndex })),
        branches: [] }, resolve, 1), /random packs/);

});

test("branch groups retain whole candidates for runtime choice and preserve entry order", () => {
    const { level, resolve, actions } = source();
    const phase = { preDelay: 0, actions: [actions[0], actions[2], actions[1]] };
    const compiled = compileSpawnSchedule({ ...level, waves: [], branches: { sample: { phases: [phase] } } }, {
        actions: [], branches: ["sample"],
    }, resolve, 123);
    const entries = compiled.schedule.branches.sample.phases[0].entries;

    assert.deepEqual(entries[0].options.map(({ weight, spawns }) => [weight, spawns.length]), [[0, 1], [1, 2]]);
    assert.equal(entries[1][0].definition.id, "N");
    assert.equal(compiled.rngState, 123);
    assert.throws(() => compileSpawnSchedule({
        ...level, waves: [], branches: { sample: { phases: [{ preDelay: 0, actions }] } },
    }, { actions: [], branches: ["sample"] }, resolve), /must be contiguous/);
});
