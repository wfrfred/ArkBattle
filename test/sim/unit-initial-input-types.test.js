import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

test("creation inputs are paired with the declared capability and preserve concrete outputs", async () => {
    const { default: ts } = await import("typescript");
    const cache = fileURLToPath(new URL("../../.cache/", import.meta.url));
    mkdirSync(cache, { recursive: true });
    const directory = mkdtempSync(join(cache, "unit-initial-input-types-"));
    const source = name => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "input.mts");
    writeFileSync(path, `
import { initialize } from ${source("unit/index")};
import { instantiateUnitPlacement, createUnitPlacementDefinition } from ${source("battle/creation/placement")};
import type { State as BattleState } from ${source("battle/state")};
import type { Input as BattleInput } from ${source("battle/contract")};
import type { Direction as DirectionValue } from ${source("geometry/direction")};
declare const battle: BattleState;
const plain = { id: "plain", hooks: [] } as const;
const directional = { id: "directional", hooks: [], occupancy: { slot: "OCCUPANT", direction: "RIGHT" } } as const;
const occupant = { id: "occupant", hooks: [], occupancy: { slot: "OCCUPANT" } } as const;
const a = initialize(battle, { id: 0, definition: directional, position: [0, 0], initial: { occupancy: { direction: "UP" } } }).value;
const direction: DirectionValue | null = a.occupancy.direction;
const b = instantiateUnitPlacement(battle, { definition: occupant, position: [0, 0], initial: { occupancy: { tile: [0, 1] } } }).value;
b.occupancy.tile;
const c = createUnitPlacementDefinition({ definition: directional, position: [0, 0], initial: { occupancy: { direction: "DOWN" } } });
instantiateUnitPlacement(battle, c).value.occupancy.direction;
declare const configuration: Omit<BattleInput, "initialUnits">;
const validBattle: BattleInput = { ...configuration, initialUnits: [c] };
// @ts-expect-error heterogeneous Battle inputs retain the constructor's capability pairing.
const invalidBattle: BattleInput = { ...configuration, initialUnits: [{ definition: plain, position: [0, 0], initial: { occupancy: { direction: "LEFT" } } }] };
// @ts-expect-error the base Unit does not own direction.
initialize(battle, { id: 1, definition: plain, position: [0, 0] }).value.direction;
// @ts-expect-error initial input cannot grant a missing capability.
initialize(battle, { id: 2, definition: plain, position: [0, 0], initial: { occupancy: { direction: "UP" } } });
// @ts-expect-error a placement cannot grant missing occupancy.
instantiateUnitPlacement(battle, { definition: plain, position: [0, 0], initial: { occupancy: { tile: [0, 1] } } });
// @ts-expect-error normalization enforces the same capability pairing.
createUnitPlacementDefinition({ definition: plain, position: [0, 0], initial: { occupancy: { direction: "LEFT" } } });
// @ts-expect-error arbitrary prebuilt capability state cannot be injected.
initialize(battle, { id: 3, definition: occupant, position: [0, 0], initial: { vitality: { hp: 1 } } });
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
