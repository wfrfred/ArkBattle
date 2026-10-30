import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("Changes seal a typed target and programs before heterogeneous submission", async () => {
    const { default: ts } = await import("typescript");
    const module = (name) =>
        JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const file = fileURLToPath(new URL("./unit-change-contract.mts", import.meta.url));
    const source = `
import type { Unit, Change } from ${module("unit/index")};
import * as publicUnit from ${module("unit/index")};
import type { Ref } from ${module("common/ref")};
import type { State as BattleState } from ${module("battle/state")};
import { update } from ${module("battle/unit")};
import { createChange } from ${module("unit/change")};
import { hasOffense, setAttackContribution, type Offense } from ${module("unit/capability/offense/index")};
import { setLayer, type Blocker } from ${module("unit/capability/blocking/index")};
declare const battle: BattleState;
declare const plain: Unit;
declare const bare: Ref<Unit>;
declare const armed: Ref<Unit & Offense>;
declare const blocker: Ref<Unit & Blocker>;
const attack: Change = setAttackContribution(armed, { id: "bonus", value: [] });
const layer: Change = setLayer(blocker, "AIR");
const next: BattleState = update(battle, [attack, layer]);
const optional: Change[] = [];
if (hasOffense(plain)) {
    optional.push(setAttackContribution(publicUnit.ref(plain), { id: "optional", value: [] }));
}
update(battle, optional);
createChange(blocker, self => ({ ...self, blocker: { ...self.blocker, layer: "AIR" as const } }), (current, previous) => {
    const oldLayer: "GROUND" | "AIR" = previous.blocker.layer;
    return current;
});
// @ts-expect-error a naked Unit reference does not prove Blocker.
setLayer(bare, "AIR");
// @ts-expect-error transformation requirements cannot invent a capability absent from the Ref.
createChange(bare, (self: Unit & Blocker) => self);
// @ts-expect-error the settlement must match the reference's proven host type.
createChange(blocker, self => self, (current: BattleState, previous: Unit & Offense) => current);
// @ts-expect-error Changes cannot be manufactured without their hidden required brand.
const forged: Change = {};
// @ts-expect-error the publication API rejects complete Unit snapshots.
update(battle, [plain]);
// @ts-expect-error the publication API rejects arbitrary transforms.
update(battle, [(self: Unit) => self]);
// @ts-expect-error Changes already carry their own target; update has no separate host argument.
update(battle, armed, [attack]);
// @ts-expect-error the Core constructor is not part of the public Unit entrypoint.
publicUnit.createChange;
`;
    const options = {
        noEmit: true,
        strict: true,
        exactOptionalPropertyTypes: true,
        noUncheckedIndexedAccess: true,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        skipLibCheck: true,
        types: [],
    };
    const host = ts.createCompilerHost(options);
    const read = host.getSourceFile.bind(host);
    host.getSourceFile = (path, version, onError, create) =>
        path === file
            ? ts.createSourceFile(path, source, version, true)
            : read(path, version, onError, create);
    const program = ts.createProgram([file], options, host);
    assert.deepEqual(
        ts
            .getPreEmitDiagnostics(program)
            .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
        [],
    );
});
