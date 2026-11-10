import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import { parseLevelDefinition } from "../../dist/data/arknights/level.js";
import { parseRouteDefinition } from "../../dist/data/arknights/route.js";
import { compileSpawnSchedule } from "../../dist/data/arknights/schedule.js";
import { createEnemyMovementContent, resolveEnemyMovementValues } from "../../dist/data/arknights/enemy.js";
import { parseEnemyMovementPrefab } from "../../dist/data/arknights/prefab.js";
import { initialize, step } from "../../dist/core/battle/runtime.js";
import { isCompleted, triggerBranch } from "../../dist/core/battle/schedule/index.js";
import { remove } from "../../dist/core/battle/unit.js";
import { all, ref } from "../../dist/core/unit/query.js";
import { get } from "../helpers/battle.js";

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

    const route = parseRouteDefinition({
        ...raw.routes[0],
        checkpoints: ["WAIT_FOR_SECONDS", "WAIT_FOR_PLAY_TIME", "WAIT_CURRENT_WAVE_TIME", "WAIT_CURRENT_FRAGMENT_TIME"]
            .map((type) => ({ type, time: 1 })),
    });
    assert.deepEqual(route.plan.checkpoints.map(({ anchor, tick }) => [anchor, tick]), [
        ["ENTER", 30], ["BATTLE", 30], ["WAVE", 30], ["FRAGMENT", 30],
    ]);
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
    assert.notEqual(compiled.rngState, seed);
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
});

test("Action and Enemy notCountInTotal release scheduling from still-present units", () => {
    const raw = fixture("level_act1autochess_01");
    const wave = { ...raw.waves[0], preDelay: 0, postDelay: 0, maxTimeWaitingForNextWave: -1 };
    const action = { ...wave.fragments[0].actions[0], count: 1, preDelay: 0, interval: 0 };
    const enemy = "enemy_9012_acloon";
    raw.waves = [
        { ...wave, fragments: [{ preDelay: 0, actions: [
            { ...action, notCountInTotal: true },
            action,
        ] }] },
        { ...wave, fragments: [] },
    ];
    raw.extraRoutes = raw.routes;
    raw.branches = { uncounted: { phases: [{ preDelay: 0, actions: [
        { ...action, key: enemy, forceBlockWaveInBranch: true },
    ] }] } };
    raw.enemyDbRefs.find(({ id }) => id === enemy).overwrittenData = {
        attributes: {}, notCountInTotal: { m_defined: true, m_value: true },
    };
    const level = parseLevelDefinition(raw);
    const compiled = compileSpawnSchedule(level, {
        actions: [0, 1].map((actionIndex) => ({ waveIndex: 0, fragmentIndex: 0, actionIndex })),
        branches: ["uncounted"],
    }, (reference) => {
        const values = resolveEnemyMovementValues(fixture(reference.id), reference.level, reference.overwrittenData);
        return createEnemyMovementContent(values, parseEnemyMovementPrefab(fixture(`prefab_${values.prefabKey}`)));
    }, 7);
    assert.deepEqual(compiled.schedule.waves[0].fragments[0].spawns.map(({ wait }) => wait), ["NONE", "WAVE"]);
    let state = step(initialize({
        map: level.map, schedule: compiled.schedule, predefines: [], initialMechanisms: [],
        routeMoveMultiplier: 1, rngState: compiled.rngState,
    }), []);
    assert.deepEqual(state.schedule.waiting, { wave: [1], final: [1] });
    state = triggerBranch(state, "uncounted", false);
    assert.deepEqual(state.schedule.waiting, { wave: [1], final: [1] });
    state = step(remove(state, ref(get(state, 1)), "DEATH"), []);
    assert.equal(isCompleted(state.schedule), true);
    assert.deepEqual(all(state).map(({ id }) => id).toArray(), [0, 2]);
});
