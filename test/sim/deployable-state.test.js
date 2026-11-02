import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { initialize } from "../../dist/core/unit/index.js";
import { initialize as initializeDeployable, hasDeployable } from "../../dist/core/unit/capability/deployable/index.js";
import { initialize as initializeOccupancy } from "../../dist/core/unit/capability/occupancy/index.js";
import { baseUnit, fixtureBattle } from "../helpers/unit.js";

const definition = {
    id: "deployable", hooks: [],
    occupancy: { slot: "OCCUPANT" },
    deployable: { retreatRules: [] },
};
const initial = { card: null, cost: 0, slots: 0, refund: null };

 test("deployable initializes empty deployment facts after Occupancy", () => {
    const battle = fixtureBattle();
    const unit = initialize(battle, {
        id: 0, definition, position: [2, 0],
        initial: { occupancy: { tile: [0, 2] } },
    }).value;
    assert.equal(hasDeployable(unit), true);
    assert.equal(unit.definition, definition);
    assert.deepEqual(unit.occupancy.tile, [0, 2]);
    assert.deepEqual(unit.deployable, { ...initial, retreatRules: definition.deployable.retreatRules });

    const occupied = initializeOccupancy(battle, baseUnit(definition), { tile: [0, 2] }).value;
    const paired = initializeDeployable(battle, occupied).value;
    assert.equal(paired.occupancy, occupied.occupancy);
    assert.deepEqual(paired.deployable, unit.deployable);
    assert.equal(hasDeployable(baseUnit({ id: "other", hooks: [] })), false);
    assert.throws(() => initialize(battle, {
        id: 1, definition: { id: "missing-occupancy", hooks: [], deployable: { retreatRules: [] } }, position: [0, 0],
    }), /deployable requires occupancy/);
});

test("deployable initialization preserves earlier programs and adds its own cleanup", () => {
    const entered = { id: "source/enter", stage: "enter", invoke: state => ({ state, value: undefined }) };
    const unit = initialize(fixtureBattle(), {
        id: 0, definition, position: [0, 0], hooks: [entered],
    }).value;
    assert.equal(unit.hooks[0], entered);
    assert.ok(unit.hooks.some(entry => entry.id === "@deployable/release-slots"));
    assert.equal(unit.deployable.card, null);
});

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
