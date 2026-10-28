import { createTile } from "../helpers/tiles.js";
import { normal } from '../../dist/content/terrain/definition.js';
import { Tiles } from '../../dist/core/battlefield/map/tiles.js';
import * as unitQueries from "../../dist/core/unit/query.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";

import { definition } from "../helpers/effects.js";
import { initialize } from "../helpers/unit.js";
import { effectPlacement } from "../helpers/aura.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";

test("runtime accepts the battle contract Input directly with structural maps and creation references", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-battle-input-types-"));
    const sourceModule = (path) =>
        JSON.stringify(
            fileURLToPath(new URL(`../../src/core/${path}.js`, import.meta.url)),
        );
    const path = join(directory, "input.mts");
    try {
        writeFileSync(
            path,
            `
import type { Input, Command, Event, Result } from ${sourceModule("battle/contract")};
import { initialize as initializeBattle, step as stepBattle } from ${sourceModule("battle/runtime")};
// @ts-expect-error Runtime state is threaded through pure operations.
import { BattleRuntime } from ${sourceModule("battle/runtime")};
import type { State as BattleState } from ${sourceModule("battle/state")};
import type { Map } from ${sourceModule("battlefield/map/map")};
import { Tiles } from ${sourceModule("battlefield/map/tiles")};
import { normal } from ${JSON.stringify(fileURLToPath(new URL('../../src/content/terrain/definition.js', import.meta.url)))};
declare const input: Input;
declare const rawMap: Pick<Map, 'rows' | 'columns' | 'tiles' | 'markers' | 'blockEdges'>;
const initial = initializeBattle(input);
initializeBattle(Object.freeze(input));
const commands: readonly Command[] = [];
const advanced = stepBattle(initial, commands);
const events: readonly Event[] = advanced.events;
const result: Result | null = advanced.result;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type InitialState = Assert<Equal<typeof initial, BattleState>>;
type AdvancedState = Assert<Equal<typeof advanced, BattleState>>;
// @ts-expect-error Commands must be supplied explicitly.
stepBattle(initial);
// @ts-expect-error BattleState has no Runtime facade.
initial.step(commands);
initializeBattle({ ...input, map: rawMap });
initializeBattle({ ...input, map: Object.freeze(rawMap) });
const { tiles: omittedTiles, ...incompleteMap } = rawMap;
// @ts-expect-error Battle input maps require every map field.
initializeBattle({ ...input, map: incompleteMap });
const validTile = rawMap.tiles.get(0, normal)!;
const invalidTile = { ...validTile, state: { ...validTile.state, passability: 'INVALID' as const } };
// @ts-expect-error Battle input maps require valid tile field types.
Tiles.empty().add(invalidTile);
${["initialUnits", "initialMechanisms"]
    .map(
        (field, index) => `
const { ${field}: omitted${index}, ...without${index} } = input;
// @ts-expect-error Every initial collection must be supplied explicitly.
initializeBattle(without${index});
`,
    )
    .join("")}
${[
    "nextUnitId",
    "nextMechanismId",
    "nextOverlayId",
    "nextProjectileId",
]
    .map(
        (field) => `
// @ts-expect-error Instance identity allocation belongs to the runtime.
initializeBattle({ ...input, ${field}: 100 });
`,
    )
    .join("")}

`,
        );
        const program = ts.createProgram([path], {
            noEmit: true,
            strict: true,
            exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true,
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            skipLibCheck: true,
            types: [],
        });
        assert.deepEqual(
            ts
                .getPreEmitDiagnostics(program)
                .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
            [],
        );
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});

const placement = (id, column) => ({
    definition: { hooks: [], id, vitality: { maxHp: 100, defense: 0, resistance: 0 } },
    position: [column, 0],
});

function fixture({ spawnTick = 100 } = {}) {
    const tile = createTile({
        heightType: "LOWLAND", meleeBlockable: true,
        buildableType: "ALL",
        passableMask: "ALL",
        terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
    });
    const map = {
        rows: 1,
        columns: 8,
        tiles: Array.from({ length: 8 }, () => tile).reduce((tiles, value) => tiles.add(value), Tiles.empty()),
        markers: [],
        blockEdges: [],
    };

    const lifecycle = [];
    const initial = definition("initial-state", { quota: { remaining: 3 }, marks: [1, 2] }, {
        onInstall(state, self) {
            assert.equal(unitQueries.get(state, self.host).effects.get(self.id), self);
            lifecycle.push(["install", self.host.id, self.source.id]);
            return state;
        },
        onEnable(state, self) {
            lifecycle.push(["enable", self.host.id, self.source.id]);
            return state;
        },
    });
    const enemy = { hooks: [],
        spatialPresence: {},
        id: "scheduled-enemy",
        vitality: { maxHp: 100, defense: 0, resistance: 0 },
        locomotion: {
            halfBodyWidth: 0, minSpeed: 0, speed: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
        },
    };
    const route = createRouteDefinition({
        pathMotionMode: "WALK",
        startPosition: [0, 7],
        endPosition: [0, 7],
        spawnOffset: [0, 0],
        spawnRandomRange: [0.3, 0.3],
        checkpoints: [{ type: "WAIT_FOR_TICKS", durationTicks: 100 }],
        allowDiagonalMove: false,
        visitEveryTileCenter: false,
        visitEveryNodeCenter: false,
        visitEveryCheckPoint: true,
    });
    const fields = {
        map,
        schedule: {
            type: "TIMELINE",
            spawns: [
                {
                    definition: enemy,
                    route,
                    tick: spawnTick,
                    timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 },
                    alwaysCheckCurrentPoint: true,
                    notCountInTotal: false,
                },
            ],
        },
        initialUnits: [
            placement("placed-a", 0),
            effectPlacement(initial, initialize({ id: 1, ...placement("placed-b", 1) })),
        ],
        initialMechanisms: [
            { definition: { id: "first-mechanism", initialize: () => ({}) } },
            { definition: { id: "plain-mechanism", initialize: () => ({}) } },
        ],

        predefines: [
            {
                id: 100,
                alias: "present-mechanism",
                initiallyPresent: true,
                creation: {
                    type: "MECHANISM",
                    definition: { id: "predefined-mechanism", initialize: () => ({}) },

                },
            },
            {
                id: 101,
                alias: "present-unit",
                initiallyPresent: true,
                creation: {
                    type: "UNIT",
                    ...placement("predefined-unit", 2),
                },
            },
            {
                id: 102,
                alias: "later-mechanism",
                initiallyPresent: false,
                creation: {
                    type: "MECHANISM",
                    definition: { id: "later-mechanism", initialize: () => ({}) },

                },
            },
            {
                id: 103,
                alias: "later-unit",
                initiallyPresent: false,
                creation: {
                    type: "UNIT",
                    ...effectPlacement(initial, initialize({ id: 103, ...placement("later-unit", 3) })),
                },
            },
        ],
        maxTicks: 4,
        routeMoveMultiplier: 1,
        rngState: 17,
    };
    return { fields, effectDefinition: initial, lifecycle };
}

test("runtime allocates initial IDs, resolves creation references, and never reuses predefined instance IDs", () => {
    const { fields, effectDefinition, lifecycle } = fixture();
    const input = fields;
    let runtime = initializeBattle(input);
    const initial = runtime;

    assert.equal(unitQueries.all(initial).toArray()[0].definition, fields.initialUnits[0].definition);
    assert.equal([...initial.mechanisms.values()][1].definition, fields.initialMechanisms[1].definition);

    assert.deepEqual(
        unitQueries.all(initial).toArray().map((unit) => unit.id),
        [0, 1, 2],
    );
    assert.deepEqual(
        [...initial.mechanisms.values()].map((mechanism) => mechanism.id),
        [0, 1, 2],
    );

    assert.deepEqual(initial.execution, {
        rngState: 17,
        nextCardId: 0,
        nextUnitId: 3,
        nextMechanismId: 3,
        nextOverlayId: 0,
        nextProjectileId: 0,
    });



    assert.deepEqual(unitQueries.all(initial).toArray()[1].effects.values().toArray()[0].source, unitQueries.ref(unitQueries.all(initial).toArray()[1]));
    assert.equal(unitQueries.all(initial).toArray()[1].effects.values().toArray()[0].definition, effectDefinition);
    assert.equal(unitQueries.all(initial).toArray()[1].effects.values().toArray()[0].status, "ACTIVE");
    assert.deepEqual(unitQueries.all(initial).toArray()[1].effects.values().toArray()[0].data, {
        quota: { remaining: 3 },
        marks: [1, 2],
    });
    assert.deepEqual(lifecycle, [["install", 1, 1], ["enable", 1, 1]]);

    runtime = stepBattle(runtime, [
        { type: "APPEAR_PREDEFINED", definitionId: 102 },
        { type: "APPEAR_PREDEFINED", definitionId: 103 },
    ]);
    const appeared = runtime;
    const appearedEffect = unitQueries.get(appeared, { id: 3 }).effects.get(0);
    assert.deepEqual(appearedEffect.host, unitQueries.ref(unitQueries.get(appeared, { id: 3 })));
    assert.deepEqual(appearedEffect.source, appearedEffect.host);
    assert.deepEqual(lifecycle, [["install", 1, 1], ["enable", 1, 1], ["install", 3, 3], ["enable", 3, 3]]);
    assert.deepEqual(
        unitQueries.all(appeared).toArray().map((unit) => unit.id),
        [0, 1, 2, 3],
    );
    assert.deepEqual(
        [...appeared.mechanisms.values()].map((mechanism) => mechanism.id),
        [0, 1, 2, 3],
    );

    assert.deepEqual(
        appeared.predefinedPresence.filter((binding) => binding.definitionId >= 102),
        [
            { definitionId: 102, source: { type: "MECHANISM", ref: { id: 3 } } },
            { definitionId: 103, source: { type: "UNIT", unitId: 3 } },
        ],
    );

    runtime = stepBattle(runtime, [
        { type: "REMOVE_PREDEFINED", definitionId: 102, reason: "SCRIPT" },
        { type: "REMOVE_PREDEFINED", definitionId: 103, reason: "SCRIPT" },
        { type: "APPEAR_PREDEFINED", definitionId: 102 },
        { type: "APPEAR_PREDEFINED", definitionId: 103 },
    ]);
    const replaced = runtime;
    const replacedEffect = unitQueries.get(replaced, { id: 4 }).effects.get(0);
    assert.deepEqual(replacedEffect.host, unitQueries.ref(unitQueries.get(replaced, { id: 4 })));
    assert.deepEqual(replacedEffect.source, replacedEffect.host);
    assert.deepEqual(lifecycle.slice(-2), [["install", 4, 4], ["enable", 4, 4]]);
    assert.deepEqual(appearedEffect.host, { id: 3 });
    assert.deepEqual(
        unitQueries.all(replaced).toArray().map((unit) => unit.id),
        [0, 1, 2, 4],
    );
    assert.deepEqual(
        [...replaced.mechanisms.values()].map((mechanism) => mechanism.id),
        [0, 1, 2, 4],
    );

    assert.equal(replaced.execution.nextUnitId, 5);
    assert.equal(replaced.execution.nextMechanismId, 5);
    assert.equal(replaced.execution.nextOverlayId, 0);
});

test("one battle input replays allocations, seeded spawning and navigation deterministically", () => {
    const { fields } = fixture({ spawnTick: 0 });
    const input = fields;
    const runtimes = [
        initializeBattle(input),
        initializeBattle(input),
    ];
    const commands = [
        { type: "APPEAR_PREDEFINED", definitionId: 102 },
        { type: "APPEAR_PREDEFINED", definitionId: 103 },
    ];
    const initial = runtimes[0];
    for (let tick = 0; tick < input.maxTicks; tick++) {
        const outputs = runtimes.map((runtime, index) => runtimes[index] = stepBattle(runtime, tick === 0 ? commands : []));
        assert.deepEqual(outputs[0], outputs[1]);
        assert.deepEqual(runtimes[0], runtimes[1]);
        assert.deepEqual(runtimes[0].battlefield.navigation, runtimes[1].battlefield.navigation);
    }
    const final = runtimes[0];
    const spawned = unitQueries.all(final).toArray().find((unit) => unit.definition.id === "scheduled-enemy");
    assert.equal(spawned.id, 4);
    assert.notDeepEqual(spawned.position, [7, 0]);
    assert.notEqual(final.execution.rngState, input.rngState);
    assert.equal(initial.execution.rngState, input.rngState);
    assert.equal(runtimes[0].result.reason, "TIME_LIMIT");
    assert.equal(runtimes[0].result.spawnedCount, 1);
});
