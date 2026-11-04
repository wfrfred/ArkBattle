import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("query guards establish structural proofs while ordinary predicates do not", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-query-types-"));
    const source = JSON.stringify(fileURLToPath(new URL("../../src/core/common/query.js", import.meta.url)));
    const path = join(directory, "query.mts");

    try {
        writeFileSync(path, `
import { create, type Query } from ${source};
interface Base { readonly id: number }
interface Named extends Base { readonly name: string }
declare const values: readonly Base[];
declare const isNamed: (value: Base) => value is Named;
const all: Query<Base> = create(() => values[Symbol.iterator]());
const named: Query<Named> = all.filter(isNamed);
const names: readonly string[] = named.map(value => value.name).toArray();
const found: Named | undefined = all.find(isNamed);
const ordinary: (value: Base) => boolean = value => value.id > 0;
const filtered = all.filter(ordinary);
filtered.map(value => {
    // @ts-expect-error boolean predicates do not install new properties.
    return value.name;
});
// @ts-expect-error boolean find results remain Base values.
const invalidFind: Named | undefined = all.find(ordinary);
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
