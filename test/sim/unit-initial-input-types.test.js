import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

test("Unit creation accepts instance inputs and Predefined accepts plain creation data", async () => {
    const { default: ts } = await import("typescript");
    const cache = fileURLToPath(new URL("../../.cache/", import.meta.url));
    mkdirSync(cache, { recursive: true });
    const directory = mkdtempSync(join(cache, "unit-initial-input-types-"));
    const source = name => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "input.mts");
    writeFileSync(path, `
import { initialize } from ${source("unit/index")};
import { createPredefinedDefinition } from ${source("battle/steps/predefined")};
import type { State as BattleState } from ${source("battle/state")};
import type { Input as BattleInput } from ${source("battle/contract")};
import type { Direction as DirectionValue } from ${source("geometry/direction")};
declare const battle: BattleState;
declare const configuration: BattleInput;
const plain = { id: "plain", hooks: [] } as const;
const occupant = { id: "occupant", hooks: [], occupancy: { slot: "OCCUPANT" } } as const;
const initialized = initialize(battle, { id: 0, definition: occupant, position: [0, 0], initial: { occupancy: { direction: "UP", tile: [0, 1] } } }).value;
const direction: DirectionValue | null = initialized.occupancy.direction;
const creation = { type: "UNIT", definition: occupant, position: [0, 0], initial: { occupancy: { direction: "DOWN" } } } as const;
const predefined = createPredefinedDefinition({ id: 0, alias: null, initiallyPresent: true, creation });
const validBattle: BattleInput = { ...configuration, predefines: [predefined] };
const deployable = { id: "deployable", hooks: [], occupancy: { slot: "OCCUPANT" }, deployable: { retreatRules: [] } } as const;
const created = initialize(battle, { id: 1, definition: deployable, position: [0, 0] }).value;
created.deployable.card;
created.occupancy.tile;
createPredefinedDefinition({ id: 1, alias: null, initiallyPresent: true, creation: { type: "UNIT", definition: deployable, position: [0, 0] } });
// @ts-expect-error The base Unit does not own direction.
initialize(battle, { id: 2, definition: plain, position: [0, 0] }).value.direction;
// @ts-expect-error Initial inputs cannot grant a missing capability.
initialize(battle, { id: 3, definition: plain, position: [0, 0], initial: { occupancy: { direction: "UP" } } });
// @ts-expect-error Deployment facts are written by Deployment, not Capability initialization.
initialize(battle, { id: 4, definition: deployable, position: [0, 0], initial: { deployable: { card: null, cost: 10, slots: 1, refund: null } } });
// @ts-expect-error Arbitrary prebuilt capability state cannot be injected.
initialize(battle, { id: 5, definition: occupant, position: [0, 0], initial: { vitality: { hp: 1 } } });
// @ts-expect-error Initial Units use Predefined rather than a parallel initial collection.
const duplicate: BattleInput = { ...configuration, initialUnits: [] };
`);
    try {
        const program = ts.createProgram([path], {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            strict: true,
            exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true,
            skipLibCheck: true,
            noEmit: true,
        });
        const diagnostics = ts.getPreEmitDiagnostics(program);
        assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
            getCurrentDirectory: () => process.cwd(),
            getCanonicalFileName: value => value,
            getNewLine: () => "\n",
        }));
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
