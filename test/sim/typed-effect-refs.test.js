import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";


test("Unified Effect references retain data and host types through queries and reject invalid writes", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-typed-effect-refs-"));
    const source = (name) => JSON.stringify(fileURLToPath(
        new URL(`../../src/core/${name}.js`, import.meta.url),
    ));
    const path = join(directory, "contract.mts");
    writeFileSync(path, `
import type { Ref } from ${source("common/ref")};
import type { State as BattleState } from ${source("battle/state")};
import type { Unit } from ${source("unit/unit")};
import * as units from ${source("unit/query")};
import type { Vitality } from ${source("unit/capability/vitality/capability")};
import type { Effect } from ${source("unit/effect/effect")};
import type { Definition } from ${source("unit/effect/definition")};
import * as effects from ${source("unit/effect/index")};
declare const battle: BattleState;
declare const host: Ref<Unit & Vitality>;
declare const bare: Ref<Unit>;
const definition: Definition<{ charges: number }, Vitality> = {
    id: "shield", initialize: () => ({ charges: 2 }),
    onInstall(state, self) {
        const hp: number | undefined = units.get(state, self.host)?.vitality.hp;
        return effects.setData(state, effects.ref(self), { charges: self.data.charges + 1 });
    },
};
const installed = effects.install(battle, host, definition, { source: bare });
// @ts-expect-error The host must provide the capability required by the Effect.
effects.install(battle, bare, definition);
// @ts-expect-error Provenance is a Unit reference, not an ID.
effects.install(battle, host, definition, { source: 42 });
const reference: Ref<Effect<{ charges: number }, Vitality>> | undefined = installed.value;
if (reference !== undefined) {
    const current = effects.get(battle, reference)!;
    const charges: number = current.data.charges;
    effects.setData(battle, reference, { charges: charges - 1 });
    // @ts-expect-error A typed reference preserves the private state.
    effects.setData(battle, reference, { charges: "one" });
    const erased = units.get(battle, host)!.effects.get(reference.id)!;
    erased.definition.onTick?.(battle, erased);
    // @ts-expect-error Ordinary heterogeneous queries do not invent private fields.
    erased.data.charges;
}
// @ts-expect-error Unit and Effect references identify different domains.
effects.get(battle, host);
`);
    try {
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
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map((diagnostic) =>
            ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
