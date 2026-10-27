import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Actions } from "../../dist/core/unit/action/actions.js";
import { Definitions } from "../../dist/core/unit/action/definitions.js";
import * as operations from "../../dist/core/unit/action/operations.js";
import { initialize } from "../../dist/core/unit/initialize.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import * as units from "../../dist/core/unit/query.js";
import { fixtureBattle } from "../helpers/unit.js";

const definition = (id, data = {}, execution = {}) => ({
    id, intervalTicks: 10, speed: 100,
    initialize: state => ({ state, value: data }),
    start: state => ({ state, value: execution }),
    step: state => ({ state, value: false }),
});
const aggregate = (configured, state, execution = null) => ({ definition: configured, state, cooldown: { periodTicks: 10, readyAtTick: 0 }, execution });

test("Action Definitions preserve paired programs and snapshot-bound query order", () => {
    const first = definition("number", { count: 3 }, { remaining: 2 });
    const second = definition("string", { mode: "first" }, { targets: [] });
    const original = Definitions.empty().add(first).add(second);
    const values = original.values();
    const changed = original.add(definition("third"));
    assert.deepEqual(values.map(value => value.id).toArray(), ["number", "string"]);
    assert.deepEqual(values.map(value => value.id).toArray(), ["number", "string"]);
    assert.deepEqual(changed.keys().toArray(), ["number", "string", "third"]);
    assert.strictEqual(original.get(first.id), first);
    assert.strictEqual(original.get(first.id, first), first);
    assert.equal(original.get(first.id, { ...first }), undefined);
    assert.equal(original.get("missing"), undefined);
    assert.deepEqual(original.read(first.id, configured => configured.initialize(fixtureBattle()).value), { count: 3 });
    assert.deepEqual(original.read(second.id, configured => configured.initialize(fixtureBattle()).value), { mode: "first" });
    assert.equal(original.read("missing", () => assert.fail("missing programs must not dispatch")), undefined);
    assert.throws(() => original.add({ ...first }), RangeError);
    assert.throws(() => Definitions.empty().add({ ...first, id: "" }), TypeError);
    assert.throws(() => Definitions.empty().add({ ...first, intervalTicks: -1 }), RangeError);
    assert.throws(() => Definitions.empty().add({ ...first, speed: Infinity }), RangeError);
});

test("Actions stores one aggregate per definition and preserves paired private types", () => {
    const first = definition("first"), second = definition("second");
    const one = aggregate(first, { count: 1 });
    const two = aggregate(second, { label: "ready" }, { id: 0, startedAtTick: 4, status: "RUNNING", state: { message: "flying" } });
    const original = Actions.empty().add(one).add(two);
    assert.equal(original.size, 2);
    assert.strictEqual(original.get(first.id), one);
    assert.strictEqual(original.get(first.id, first), one);
    assert.equal(original.get(first.id, { ...first }), undefined);
    assert.equal(original.get("missing"), undefined);
    assert.deepEqual(original.keys().toArray(), ["first", "second"]);
    assert.deepEqual(original.read(first.id, self => self.state), { count: 1 });
    assert.deepEqual(original.readExecution(0, self => self.execution.state), { message: "flying" });
    assert.equal(original.readExecution(9, () => assert.fail("missing execution must not dispatch")), undefined);
    assert.throws(() => original.add(one), RangeError);
});

test("Aggregate replacements keep configured order and old snapshots while clearing only execution", () => {
    const first = definition("first"), second = definition("second");
    const one = aggregate(first, { count: 1 }, { id: 7, startedAtTick: 4, status: "RUNNING", state: { remaining: 2 } });
    const two = aggregate(second, { text: "other" });
    const original = Actions.empty().add(one).add(two);
    const query = original.values();
    const updated = { ...one, state: { count: 2 }, cooldown: { ...one.cooldown, readyAtTick: 40 }, execution: null };
    const changed = original.replace(first, updated);
    assert.strictEqual(original.replace(first, one), original);
    assert.strictEqual(original.get(first.id), one);
    assert.strictEqual(changed.get(first.id), updated);
    assert.strictEqual(changed.get(second.id), two);
    assert.deepEqual(changed.keys().toArray(), ["first", "second"]);
    assert.strictEqual(query.toArray()[0], one);
    assert.strictEqual(query.toArray()[0], one);
    assert.equal(changed.readExecution(7, () => assert.fail("cleared execution must not dispatch")), undefined);
    assert.equal(original.readExecution(7, self => self.execution.state.remaining), 2);
    assert.deepEqual(JSON.parse(JSON.stringify(changed)).map(self => [self.definition.id, self.state, self.execution]), [["first", { count: 2 }, null], ["second", { text: "other" }, null]]);
});

test("Action initialization, start and termination retain one persistent aggregate", () => {
    const ended = [];
    const configured = {
        ...definition("program", { starts: 0 }, { remaining: 2 }),
        start(battle, source, self) {
            return { state: operations.updateState(battle, source, self.definition, current => ({ starts: current.starts + 1 })), value: { remaining: 2 } };
        },
        onEnd(battle, source, self, end) {
            ended.push([self.execution.status, self.execution.state.remaining, end]);
            return battle;
        },
    };
    const created = initialize(fixtureBattle(), { id: 0, position: [0, 0], definition: { hooks: [], id: "program-host", action: { definitions: Definitions.empty().add(configured) } } });
    const before = addUnit(created.state, created.value), source = units.ref(created.value);
    const started = operations.start(before, source, configured);
    assert.equal(started.value.type, "STARTED");
    assert.deepEqual(operations.getAction(before, source, configured).state, { starts: 0 });
    assert.deepEqual(operations.getAction(started.state, source, configured).state, { starts: 1 });
    assert.deepEqual(operations.get(started.state, started.value.ref).execution.state, { remaining: 2 });
    const stopped = operations.cancel(started.state, started.value.ref, "TEST");
    assert.equal(operations.get(stopped, started.value.ref), undefined);
    assert.deepEqual(operations.getAction(stopped, source, configured).state, { starts: 1 });
    assert.equal(operations.getAction(stopped, source, configured).execution, null);
    assert.deepEqual(ended, [["ENDING", 2, { type: "CANCELLED", reason: "TEST" }]]);
    assert.deepEqual(operations.get(started.state, started.value.ref).execution.state, { remaining: 2 });
});

test("Action public Views hide private state and generic read retains persistent/execution pairing", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "arkbattle-action-store-types-"));
    const source = name => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "actions.mts");
    try {
        writeFileSync(path, `
import type { Ref } from ${source("common/ref")};
import type { Query } from ${source("common/query")};
import type { State as BattleState } from ${source("battle/state")};
import type { Unit } from ${source("unit/unit")};
import type { Action as ActionCapability } from ${source("unit/capability/action/capability")};
import type { Definition, View as DefinitionView } from ${source("unit/action/definition")};
import { ref, type Action, type Executing, type View, type ExecutingView } from ${source("unit/action/action")};
import { Actions } from ${source("unit/action/actions")};
import { Definitions } from ${source("unit/action/definitions")};
import * as operations from ${source("unit/action/operations")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
declare const battle: BattleState;
declare const source: Ref<Unit & ActionCapability>;
declare const precise: Executing<{ readonly count: number }, { readonly remaining: number }>;
declare const publicAction: View;
declare const publicExecution: ExecutingView;
declare const configured: Definition<{ readonly count: number }, { readonly remaining: number }>;
const preciseRef = ref(source, precise);
const publicRef: Ref<ExecutingView> = preciseRef;
const values = Actions.empty().values();
type Values = Assert<Equal<typeof values, Query<View>>>;
const known = Actions.empty().get(configured.id, configured);
type Known = Assert<Equal<typeof known, Action<{ readonly count: number }, { readonly remaining: number }> | undefined>>;
const current = operations.get(battle, preciseRef);
type Current = Assert<Equal<typeof current, typeof precise | undefined>>;
const unknown = operations.get(battle, publicRef);
type Unknown = Assert<Equal<typeof unknown, ExecutingView | undefined>>;
// @ts-expect-error Public aggregates hide persistent data.
publicAction.state;
// @ts-expect-error Public execution views hide content data.
publicExecution.execution.state;
// @ts-expect-error Public values cannot be inserted as paired programs.
Actions.empty().add(publicAction);
// @ts-expect-error Definition fixes persistent data.
Actions.empty().replace(configured, { ...precise, state: { unrelated: true } });
// @ts-expect-error Definition fixes execution data.
Actions.empty().replace(configured, { ...precise, execution: { ...precise.execution, state: { unrelated: true } } });
// @ts-expect-error An idle aggregate cannot identify an execution.
ref(source, publicAction);
// @ts-expect-error An erased reference cannot update private execution data.
operations.update(battle, publicRef, state => state);
const definitions = Definitions.empty().values();
type DefinitionValues = Assert<Equal<typeof definitions, Query<DefinitionView>>>;
Actions.empty().read(configured.id, self => { self.definition.start(battle, source, self); });
Actions.empty().readExecution(0, self => self.definition.step(battle, source, self));
`);
        const program = ts.createProgram([path], { noEmit: true, strict: true, exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, skipLibCheck: true, types: [] });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally { rmSync(directory, { recursive: true, force: true }); }
});
