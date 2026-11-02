import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";





test("Deployable Capability initialization requires Occupancy", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "arkbattle-deployable-types-"));
    const module = path => JSON.stringify(fileURLToPath(new URL(path, import.meta.url)));
    const path = join(directory, "deployable.mts");
    try {
        writeFileSync(path, `
import { initialize } from ${module("../../src/core/unit/initialize.js")};
import { initialize as initializeDeployable, hasDeployable, type Deployable } from ${module("../../src/core/unit/capability/deployable/capability.js")};
import type { Unit } from ${module("../../src/core/unit/unit.js")};
import type { Occupancy } from ${module("../../src/core/unit/capability/occupancy/capability.js")};
declare const battle: import(${module("../../src/core/battle/state.js")}).State;
const definition = { id: "typed", hooks: [], occupancy: { slot: "OCCUPANT" as const }, deployable: { retreatRules: [] } };
const created = initialize(battle, { id: 0, definition, position: [0, 0] }).value;
const paired: Unit & Deployable = created;
const occupancy: Occupancy = paired;
declare const unknownUnit: Unit & { readonly label: string };
if (hasDeployable(unknownUnit)) { const guarded: Unit & Occupancy = unknownUnit; const label: string = unknownUnit.label; }
declare const incomplete: Unit & { readonly definition: { readonly deployable: { readonly retreatRules: readonly [] } } };
// @ts-expect-error Capability initialization consumes an already initialized Occupancy.
initializeDeployable(battle, incomplete);
`);
        const program = ts.createProgram([path], {
            noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext, strict: true, exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true, skipLibCheck: true, types: [],
        });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map(d => ts.flattenDiagnosticMessageText(d.messageText, "\n")), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
