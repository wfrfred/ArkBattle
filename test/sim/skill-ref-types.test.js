import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("Skill capabilities erase private program types while activation Refs retain proven data", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-skill-ref-types-"));
    const source = (name) => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "refs.mts");
    try {
        writeFileSync(path, `
import type { Ref } from ${source("common/ref")};
import type { State as BattleState } from ${source("battle/state")};
import type { Unit } from ${source("unit/unit")};
import { initialize } from ${source("unit/initialize")};
import * as units from ${source("unit/query")};
import { createDefinition, type Definition, type View as DefinitionView } from ${source("unit/skill/definition")};
import { initialize as initializeSkill, hasSkill, type Skill, type State } from ${source("unit/capability/skill/capability")};
import { ref, type Activation } from ${source("unit/skill/activation")};
import { get as getInstance } from ${source("unit/skill/instance")};
import { activate, cancel, setData as setPersistentData, setActivationData } from ${source("unit/skill/operations")};
import { get } from ${source("unit/skill/index")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type Persistent = { count: number };
type Active = { mode: "FIRST" | "SECOND" };
declare const battle: BattleState;
declare const self: Activation<Active>;
declare const specialized: Ref<Activation<Active> & { readonly marker: 17 }>;
const definition: Definition<Persistent, Active> = createDefinition({
    id: "typed-skill", initialize: () => ({ count: 0 }), sp: null,
    onEnter: (current, program) => {
        const count: number = program.state.data.count;
        // @ts-expect-error Persistent data is supplied as a value rather than a transform.
        setPersistentData(current, program, () => ({ count: count + 1 }));
        return setPersistentData(current, program, { count: count + 1 });
    },
    activation: { trigger: "MANUAL", sustain: { type: "INFINITE" },
        initialize: (_battle, program) => ({ mode: program.state.data.count === 0 ? "FIRST" : "SECOND" }),
        onStart: (current, activation) => {
            const proof = ref(activation);
            type Proof = Assert<Equal<typeof proof, Ref<Activation<Active>>>>;
            const mode: "FIRST" | "SECOND" | undefined = get(current, proof)?.data.mode;
            const program = getInstance(current, activation.host, definition);
            if (program === undefined) return current;
            const count: number = program.state.data.count;
            return setPersistentData(current, program, { count: count + 1 });
        },
        onTick: (current, activation) => setActivationData(current, ref(activation), { mode: "SECOND" }),
    },
});
const initialized = initialize(battle, { id: 0, position: [0, 0], definition: { hooks: [], id: "typed-host", skill: definition } }).value;
const view: DefinitionView = definition;
const publicHost: Unit & Skill = initialized;
const metadata: DefinitionView = publicHost.definition.skill;
const trigger: "MANUAL" | "AUTO" | "PASSIVE" | undefined = metadata.activation?.trigger;
// @ts-expect-error Definition views expose metadata, not persistent initialization programs.
view.initialize();
// @ts-expect-error Activation metadata does not expose its private data initializer.
metadata.activation?.initialize;
// @ts-expect-error Definition callbacks belong to the full paired program.
metadata.onTick;
// @ts-expect-error A metadata view does not prove a complete creation input.
initializeSkill(battle, view);
const state = initializeSkill(battle, definition).value;
type CommonState = Assert<Equal<typeof state, State>>;
// @ts-expect-error Unit capability state does not expose a program's private data.
initialized.skill.data.count;
// @ts-expect-error even direct capability initialization returns common State.
state.data.count;
// @ts-expect-error the erased input still requires the activation data initializer.
initialize(battle, { id: 1, position: [0, 0], definition: { hooks: [], id: "invalid", skill: { id: "invalid", initialize: () => ({}), sp: null, activation: { trigger: "MANUAL", sustain: { type: "INFINITE" } } } } });
const knownProgram = getInstance(battle, units.ref(initialized), definition);
const knownCount: number | undefined = knownProgram?.state.data.count;
const erasedProgram = getInstance(battle, units.ref(initialized));
// @ts-expect-error an internal current read does not restore private persistent fields.
erasedProgram?.state.data.count;
// @ts-expect-error restoring chosen private types still requires a Definition token.
getInstance<Persistent, Active>(battle, units.ref(initialized));
if (knownProgram !== undefined) {
    setPersistentData(battle, knownProgram, { count: 1 });
    // @ts-expect-error the result value cannot widen the Instance's proven data type.
    setPersistentData(battle, knownProgram, { count: "wrong" });
}
const started = activate(battle, units.ref(initialized));
if (started.value.type === "ACTIVATED") {
    const current = get(started.state, started.value.ref);
    type Current = Assert<Equal<typeof current, Activation | undefined>>;
    // @ts-expect-error a Unit ref alone cannot prove the active program's private type.
    current?.data.mode;
    const restored = get(started.state, started.value.ref, definition);
    type Restored = Assert<Equal<typeof restored, Activation<Active> | undefined>>;
    const mode: "FIRST" | "SECOND" | undefined = restored?.data.mode;
}
const known = ref(self);
type Known = Assert<Equal<typeof known, Ref<Activation<Active>>>>;
const weaker: Ref<Activation<Active>> = specialized;
const erased: Ref<Activation> = weaker;
cancel(battle, erased, "SCRIPT");
const candidates = units.all(battle).filter(hasSkill).map(units.ref).toArray();
type Candidates = Assert<Equal<typeof candidates, readonly Ref<Unit & Skill>[]>>;
const host = units.get(battle, self.host);
// @ts-expect-error a typed activation does not type its host's private persistent state.
host?.skill.data.count;
// @ts-expect-error Skill capability has no content program type parameters.
type GenericCapability = Skill<Persistent, Active>;
// @ts-expect-error callers cannot select private types when activating through a Unit ref.
activate<Persistent, Active>(battle, units.ref(initialized));
// @ts-expect-error
const forged: Ref<Activation<Active>> = { host: units.ref(initialized), id: 0 };
// @ts-expect-error
const stronger: Ref<Activation<Active> & { readonly marker: 17 }> = weaker;
// @ts-expect-error
const mismatched: Ref<Activation<{ count: number }>> = weaker;
// @ts-expect-error
get(battle, units.ref(initialized));
// @ts-expect-error
get(battle, 0);
// @ts-expect-error
get(battle, self);
// @ts-expect-error
get(battle, erased)!.data.mode;
// @ts-expect-error
setActivationData(battle, known, { mode: "INVALID" });
// @ts-expect-error Activation data is supplied as a value rather than a transform.
setActivationData(battle, known, () => ({ mode: "SECOND" }));
setActivationData(battle, known, { mode: "SECOND" });
// @ts-expect-error a Unit reference cannot identify an Activation.
setActivationData(battle, units.ref(initialized), { mode: "SECOND" });
// @ts-expect-error data writes are complete operations requiring BattleState and identity.
setActivationData(self, { mode: "SECOND" });
`);
        const program = ts.createProgram([path], {
            noEmit: true, strict: true, exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true, target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
            skipLibCheck: true, types: [],
        });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
