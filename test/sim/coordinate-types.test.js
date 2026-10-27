import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("tile guards narrow unknown values and typed tuples preserve the readonly position contract", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-coordinate-types-"));
    const source = JSON.stringify(fileURLToPath(new URL("../../src/core/geometry/coordinate.js", import.meta.url)));
    const path = join(directory, "coordinate.mts");

    try {
        writeFileSync(path, `
import { Tile, type TilePosition } from ${source};
declare const candidate: unknown;
// @ts-expect-error unknown values require validation before use as a position.
const unchecked: TilePosition = candidate;
const valid: boolean = Tile.is(candidate);
if (Tile.is(candidate)) {
    const position: TilePosition = candidate;
    const row: number = candidate[0];
    const column: number = candidate[1];
    // @ts-expect-error validated positions retain the readonly tuple contract.
    candidate[0] = 1;
    // @ts-expect-error a position has exactly two components.
    const third = candidate[2];
}
const created: TilePosition = [1, 2];
const createdRow: number = created[0];
const createdColumn: number = created[1];
// @ts-expect-error typed positions are readonly.
created[0] = 1;
// @ts-expect-error a position has exactly two components.
const createdThird = created[2];
`);
        const program = ts.createProgram([path], {
            strict: true, noEmit: true, skipLibCheck: true,
            exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true,
            target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext, types: [],
        });

        assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
