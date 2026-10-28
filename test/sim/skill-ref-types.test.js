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
import { type Definition } from ${source("unit/skill/definition")};
import { initialize as initializeSkill, hasSkill, type Skill as SkillCapability, type State } from ${source("unit/capability/skill/capability")};
import { create, ref, activationRef, getSkill, getActivation, activate, cancel, setData, setActivationData, type Skill, type Activation, lifetime as skillLife } from ${source("unit/skill/index")};
import { getCurrent } from ${source("unit/skill/query")};
import { scope, getRef } from ${source("lifetime/index")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type Persistent = { count: number };
type Active = { mode: "FIRST" | "SECOND" };
declare const battle: BattleState;
declare const sourceRef: Ref<Unit & SkillCapability>;
declare const self: Activation<Persistent, Active>;
declare const specialized: Ref<Activation<Persistent, Active> & { readonly marker: 17 }>;
const definition: Definition<Persistent, Active> = ({
    id: "typed-skill", initialize: current => ({ state: current, value: { count: 0 } }), sp: null,
    onEnter(current, source, program) {
        const count: number = program.data.count;
        const identity = ref(source, program.definition);
        // @ts-expect-error persistent data is supplied as a value rather than a transform.
        setData(current, identity, () => ({ count: count + 1 }));
        return setData(current, identity, { count: count + 1 });
    },
    activation: { trigger: "MANUAL", sustain: { type: "INFINITE" },
        initialize: (_battle, _source, program) => ({ mode: program.data.count === 0 ? "FIRST" : "SECOND" }),
        onStart(current, source, activation) {
            const proof = activationRef(source, activation);
            type Proof = Assert<Equal<typeof proof, Ref<Activation<Persistent, Active>>>>;
            const mode: "FIRST" | "SECOND" | undefined = getActivation(current, proof)?.activation.data.mode;
            const identity = ref(source, activation.definition);
            return setData(current, identity, { count: activation.data.count + 1 });
        },
        onTick: (current, source, activation) => setActivationData(current, activationRef(source, activation), { mode: "SECOND" }),
    },
});
const factory = { initialize: (current: BattleState) => create(current, definition) };
const initialized = initialize(battle, { id: 0, position: [0, 0], definition: { hooks: [], id: "typed-host", skill: factory } }).value;
const publicHost: Unit & SkillCapability = initialized;
const program: Definition = publicHost.skill.definition;
const trigger: "MANUAL" | "AUTO" | "PASSIVE" | undefined = program.activation?.trigger;
const genericData = program.initialize(battle).value;
type GenericData = Assert<Equal<typeof genericData,object>>;
// @ts-expect-error Complete default programs do not infer private persistent fields.
genericData.count;
program.onTick?.(battle, sourceRef, publicHost.skill);
// @ts-expect-error Unit configuration stores a factory rather than a program.
publicHost.definition.skill.id;
// @ts-expect-error A program's private initializer is not a Skill aggregate factory.
initializeSkill(battle, program);
// @ts-expect-error A complete program does not replace the aggregate's required private data.
initializeSkill(battle, { initialize: current => ({ state: current, value: { definition: program, sp: null, activation: null } }) });
const incompleteActivation = { trigger: "MANUAL" as const, sustain: { type: "INFINITE" as const } };
// @ts-expect-error Private data cannot replace a missing activation initialization program.
initializeSkill(battle, { initialize: current => ({ state: current, value: { definition: { ...definition, activation: incompleteActivation }, data: { count: 0 }, sp: null, activation: null } }) });
const state = initializeSkill(battle, factory).value;
type CommonState = Assert<Equal<typeof state, State>>;
// @ts-expect-error capability state does not expose a program's private data.
initialized.skill.data.count;
// @ts-expect-error capability initialization returns default object private state.
state.data.count;
// @ts-expect-error an ordinary program is not a Unit capability factory.
initialize(battle, { id: 1, position: [0, 0], definition: { hooks: [], id: "invalid", skill: definition } });
const persistent = ref(units.ref(initialized), definition);
type PersistentRef = Assert<Equal<typeof persistent, Ref<Skill<Persistent, Active>>>>;
const knownProgram = getSkill(battle, persistent);
const knownCount: number | undefined = knownProgram?.data.count;
const opaque = getCurrent(battle, units.ref(initialized));
// @ts-expect-error the internal current read cannot recover chosen private fields.
opaque?.data.count;
// @ts-expect-error getCurrent does not accept invented private generics.
getCurrent<Persistent, Active>(battle, units.ref(initialized));
if (opaque !== undefined) opaque.definition.onTick?.(battle, sourceRef, opaque);
setData(battle, persistent, { count: 1 });
// @ts-expect-error the result value cannot widen the Ref's proven persistent type.
setData(battle, persistent, { count: "wrong" });
const started = activate(battle, persistent);
if (started.value.type === "ACTIVATED") {
    const current = getActivation(started.state, started.value.ref);
    type Current = Assert<Equal<typeof current, Activation<Persistent, Active> | undefined>>;
    const mode: "FIRST" | "SECOND" | undefined = current?.activation.data.mode;
    const count: number | undefined = current?.data.count;
}
const known = activationRef(sourceRef, self);
const skillScope = scope(skillLife,known);
skillLife.end(battle,known,{type:"FINISHED"});
const restoredRound = getRef(skillScope,skillLife);
type LifetimeRound = Assert<Equal<typeof restoredRound,Ref<Activation>|undefined>>;
// @ts-expect-error The persistent Skill slot does not identify an activation lifetime.
scope(skillLife,persistent);
type Known = Assert<Equal<typeof known, Ref<Activation<Persistent, Active>>>>;
const weaker: Ref<Activation<Persistent, Active>> = specialized;
declare const erased: Ref<Activation>;
cancel(battle, erased, "SCRIPT");
const candidates = units.all(battle).filter(hasSkill).map(units.ref).toArray();
type Candidates = Assert<Equal<typeof candidates, readonly Ref<Unit & SkillCapability>[]>>;
// @ts-expect-error an aggregate does not contain its source identity.
self.host;
// @ts-expect-error a bare address does not prove an activation type.
const forged: Ref<Activation<Persistent, Active>> = { host: sourceRef, id: self.activation.id };
// @ts-expect-error Unit references cannot prove aggregate identities.
activate(battle, sourceRef);
// @ts-expect-error round references do not identify the persistent slot.
activate(battle, known);
// @ts-expect-error persistent references do not identify a round.
cancel(battle, persistent);
// @ts-expect-error persistent data writes use a persistent Ref.
setData(battle, known, { count: 1 });
// @ts-expect-error activation data writes use a round Ref.
setActivationData(battle, persistent, { mode: "SECOND" });
// @ts-expect-error source and program must use their matching Ref kind.
ref(known, definition);
// @ts-expect-error private data is hidden after erasing the round proof.
getActivation(battle, erased)!.activation.data.mode;
// @ts-expect-error the round Ref fixes the activation data type.
setActivationData(battle, known, { mode: "INVALID" });
// @ts-expect-error activation data accepts a computed value.
setActivationData(battle, known, () => ({ mode: "SECOND" }));
setActivationData(battle, known, { mode: "SECOND" });
// @ts-expect-error getters no longer accept a second Definition token.
getActivation(battle, known, definition);
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
