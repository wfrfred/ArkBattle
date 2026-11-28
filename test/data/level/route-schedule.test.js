// Contract: [data](../../../docs/architecture/data.md).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Hooks } from "../../../dist/core/hook.js";
import { parseLevelDefinition } from "../../../dist/data/level/definition.js";
import { parseRouteDefinition } from "../../../dist/data/level/route.js";
import { compileSpawnSchedule } from "../../../dist/data/level/schedule.js";
import { resolveEnemy } from "../../../dist/data/unit/enemy.js";
import { readEnemyMovementPrefab } from "../../../dist/data/unit/prefab.js";
import { initialize, step } from "../../../dist/core/battle/runtime.js";
import { isCompleted, triggerBranch } from "../../../dist/core/battle/schedule/index.js";
import { remove } from "../../../dist/core/unit/operations.js";
import { all, ref } from "../../../dist/core/unit/query.js";
import { get } from "../../helpers/battle.js";

const fixture = (name) => JSON.parse(readFileSync(new URL(`../../fixtures/arknights/${name}.json`, import.meta.url), "utf8"));

function source() {
    const level = parseLevelDefinition(fixture("level_act1autochess_01"), { mire: null, deepsea: null, tileDeploymentPrefabs: [] });
    const original = level.waves[0].fragments[0].actions[0];
    const action = (key, group, weight, count = 1) => ({
        ...original, key, randomSpawnGroupKey: group, weight, count,
        preDelay: 0, interval: 0.1, routeIndex: 0,
    });
    const actions = [
        action("A", "group", 0),
        { ...action("N", null, 0), dontBlockWave: true },
        { ...action("B", "group", 1, 2), managedByScheduler: false, isUnharmfulAndAlwaysCountAsKilled: true },
    ];
    const definitions = new Map(actions.map(({ key }) => [key, {
        id: key, hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true },
        locomotion: { speed: { default: 0, min: 0, max: null }, halfBodyWidth: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
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
            notCountInTotal: false,
            lifePointLoss: 2,
        }),
        actions,
    };
}

test("native routes compile patrol loops and retain wait anchors before birth", () => {
    const raw = fixture("level_act1autochess_h07_02");
    const level = parseLevelDefinition(raw, { mire: null, deepsea: null, tileDeploymentPrefabs: [] });
    assert.deepEqual(level.routes.map(({ mode }) => mode), raw.routes.map(({ motionMode }) => motionMode));
    assert.deepEqual(level.routes[6].plan.checkpoints.map(({ type }) => type), ["MOVE", "MOVE", "MOVE", "GOTO"]);
    assert.equal(level.routes[6].plan.checkpoints[3].index, 0);

    const route = parseRouteDefinition({
        ...raw.routes[0],
        visitEveryCheckPoint: true,
        checkpoints: ["WAIT_FOR_SECONDS", "WAIT_FOR_PLAY_TIME", "WAIT_CURRENT_WAVE_TIME", "WAIT_CURRENT_FRAGMENT_TIME"]
            .map((type) => ({ type, time: 1 })),
    });
    assert.deepEqual(route.plan.destination, {
        type: "EXIT", position: [raw.routes[0].endPosition.col, raw.routes[0].endPosition.row],
        requireFinish: true,
    });
    assert.equal(level.routes[0].plan.destination.requireFinish, false);
    assert.equal(parseRouteDefinition({ ...raw.routes[0], endPosition: null }).plan.destination, null);
    assert.deepEqual(route.plan.checkpoints.map(({ anchor, tick }) => [anchor, tick]), [
        ["ENTER", 30], ["BATTLE", 30], ["WAVE", 30], ["FRAGMENT", 30],
    ]);
});

test("level push multiplier retains the configured value, including zero", () => {
    const raw = fixture("level_act1autochess_h07_02");
    assert.equal(parseLevelDefinition(raw, { mire: null, deepsea: null, tileDeploymentPrefabs: [] }).pushMultiplier, 0.5);
    const level = parseLevelDefinition({ ...raw, options: { ...raw.options, moveMultiplier: 0 } }, { mire: null, deepsea: null, tileDeploymentPrefabs: [] });
    assert.equal(level.pushMultiplier, 0);
});

test("native dragon branch uses the default one point loss when the database leaves it undefined", () => {
    const level = parseLevelDefinition(fixture("level_act1autochess_01"), { mire: null, deepsea: null, tileDeploymentPrefabs: [] });
    const raw = fixture("enemy_9012_acloon");
    assert.deepEqual(raw.Value[0].enemyData.lifePointReduce, { m_defined: false, m_value: 0 });
    const compiled = compileSpawnSchedule(level, { actions: [], branches: ["dragon"] }, reference => {
        assert.equal(reference.id, raw.Key);
        const resolved = resolveEnemy(raw, reference);
        return {
            definition: { id: resolved.id, hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true } },
            delayToBornTicks: 0, notCountInTotal: resolved.notCountInTotal, lifePointLoss: resolved.lifePointLoss,
        };
    }, 123);
    const [spawn] = compiled.schedule.branches.dragon.phases[0].entries;
    assert.equal(spawn.definition.id, raw.Key);
    assert.equal(spawn.statistics, null);
    assert.equal(spawn.lifePointLoss, 1);
});

test("main random groups preserve source order and expand the selected count once", () => {
    const { level, resolve } = source();
    const seed = 123;
    const compiled = compileSpawnSchedule(level, {
        actions: [0, 1, 2].map((actionIndex) => ({ waveIndex: 0, fragmentIndex: 0, actionIndex })),
        branches: [],
    }, resolve, seed);
    const spawns = compiled.schedule.waves[0].fragments[0].entries;

    assert.deepEqual(spawns.map(({ definition }) => definition.id), ["N", "B", "B"]);
    assert.deepEqual(spawns.map(({ atTick }) => atTick), [0, 0, 3]);
    assert.deepEqual(spawns.map(({ mode }) => mode), Array(3).fill(level.routes[0].mode));
    assert.deepEqual(spawns.map(({ wait }) => wait), ["FINAL", "NONE", "NONE"]);
    assert.deepEqual(spawns.map(({ statistics }) => statistics), ["NORMAL", "ALWAYS_KILLED", "ALWAYS_KILLED"]);
    assert.deepEqual(spawns.map(({ lifePointLoss }) => lifePointLoss), [2, 0, 0]);
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

    assert.deepEqual(entries[0].options.map(({ weight, entries }) => [weight, entries.length]), [[0, 1], [1, 2]]);
    assert.equal(entries[1].definition.id, "N");
    assert.equal(entries[1].wait, "FINAL");
    assert.deepEqual(entries[0].options.flatMap(({ entries }) => entries.map(({ statistics }) => statistics)), [null, null, null]);
    assert.equal(entries[1].statistics, null);
    assert.deepEqual(entries[0].options.flatMap(({ entries }) => entries.map(({ lifePointLoss }) => lifePointLoss)), [2, 0, 0]);
    assert.equal(entries[1].lifePointLoss, 2);
    assert.equal(compiled.rngState, 123);
});

test("Action and Enemy notCountInTotal release scheduling from still-present units", () => {
    const raw = fixture("level_act1autochess_01");
    const wave = { ...raw.waves[0], preDelay: 0, postDelay: 0, maxTimeWaitingForNextWave: -1 };
    const action = { ...wave.fragments[0].actions[0], key: "enemy_1000_gopro", count: 1, preDelay: 0, interval: 0 };
    const enemy = "enemy_1003_ncbow";
    const skills = [{ prefabKey: "stage-crossbow-shot" }];
    raw.waves = [
        { ...wave, fragments: [{ preDelay: 0, actions: [
            { ...action, notCountInTotal: true },
            action,
            { ...action, key: enemy },
        ] }] },
        { ...wave, fragments: [] },
    ];
    raw.extraRoutes = raw.routes;
    raw.branches = { uncounted: { phases: [{ preDelay: 0, actions: [
        { ...action, key: enemy, forceBlockWaveInBranch: true },
    ] }] } };
    raw.enemyDbRefs = [
        { id: action.key, useDb: true, level: 0, overwrittenData: null },
        { id: enemy, useDb: true, level: 0, overwrittenData: {
            attributes: {}, notCountInTotal: { m_defined: true, m_value: true },
            lifePointReduce: { m_defined: true, m_value: 3 },
            skills,
        } },
    ];
    const records = fixture("main-mode-units").enemies;
    const prefabs = {
        [action.key]: fixture(`prefab_${action.key}`),
        [enemy]: fixture(`prefab_${enemy}`),
    };
    const level = parseLevelDefinition(raw, { mire: null, deepsea: null, tileDeploymentPrefabs: [] });
    const definition = {
        id: "scheduled-unit", hooks: Hooks.empty(),
        route: { alwaysCheckCurrentPoint: true },
        locomotion: { speed: { default: 0, min: 0, max: null }, halfBodyWidth: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
    };
    const compiled = compileSpawnSchedule(level, {
        actions: [0, 1, 2].map((actionIndex) => ({ waveIndex: 0, fragmentIndex: 0, actionIndex })),
        branches: ["uncounted"],
    }, (reference) => {
        const record = records.find(({ Key }) => Key === reference.id);
        const resolved = resolveEnemy(record, {
            level: reference.level, overwrittenData: reference.overwrittenData,
        });
        if (reference.id === enemy) {
            assert.deepEqual(resolved.layers.at(-1).skills, skills);
        }
        const { delayToBornTicks } = readEnemyMovementPrefab(resolved, prefabs);
        return { definition, notCountInTotal: resolved.notCountInTotal, lifePointLoss: resolved.lifePointLoss, delayToBornTicks };
    }, 7);
    const spawns = compiled.schedule.waves[0].fragments[0].entries;
    assert.deepEqual(spawns.map(({ wait }) => wait), ["NONE", "WAVE", "NONE"]);
    assert.deepEqual(spawns.map(({ statistics }) => statistics), [null, "NORMAL", null]);
    assert.deepEqual(spawns.map(({ lifePointLoss }) => lifePointLoss), [1, 1, 3]);
    assert.equal(compiled.schedule.branches.uncounted.phases[0].entries[0].lifePointLoss, 3);
    let state = step(initialize({
        map: level.map, schedule: compiled.schedule, initialUnits: [], initialEffects: [],
        lifePoints: { balance: level.options.maxLifePoint, temporary: 0 },
        moveMultiplier: 1, pushMultiplier: level.pushMultiplier, deployment: null, initialCards: [], rngState: compiled.rngState,
    }), []);
    const waiting = ref(get(state, 1));
    assert.deepEqual(state.schedule.waiting, { wave: [waiting], final: [waiting] });
    state = triggerBranch(state, "uncounted", false);
    assert.deepEqual(state.schedule.waiting, { wave: [waiting], final: [waiting] });
    state = step(remove(state, waiting, { reason: "DEATH", killer: null }), []);
    assert.equal(isCompleted(state.schedule), true);
    assert.deepEqual(all(state).map(unit => unit.ref.id).toArray(), [0, 2, 3]);
    assert.deepEqual(state.statistics, { total: 1, finished: 1, killed: 1, pending: new Map() });
    assert.equal(state.lifePoints.balance, raw.options.maxLifePoint);
    state = remove(state, ref(get(state, 2)), { reason: "EXIT" });
    assert.equal(state.lifePoints.balance, Math.max(0, raw.options.maxLifePoint - 3));
});
