import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Actions } from "../../dist/core/unit/action/actions.js";
import { create as createAction, createActions } from "../../dist/core/unit/action/initialize.js";
import { initialize as initializeActions } from "../../dist/core/unit/capability/action/capability.js";
import { actionCapability } from "../helpers/actions.js";
import * as operations from "../../dist/core/unit/action/index.js";
import { initialize } from "../../dist/core/unit/initialize.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import * as units from "../../dist/core/unit/query.js";
import { fixtureBattle } from "../helpers/unit.js";

const definition = (id, data = {}, execution = {}) => ({
    id, intervalTicks: 10, speed: 100,
    initialize: state => ({ state, value: data }),
    prepare: state => ({ state, value: execution }),
    onTick: state => ({ state, value: false }),
});
const aggregate = (configured, state, execution = null) => ({ definition: configured, state, cooldown: { periodTicks: 10, readyAtTick: 0 }, execution });

test("Action initialization composes ordered programs and creates independent persistent data", () => {
    const calls = [];
    const make = (id, data, execution) => ({
        ...definition(id, data, execution),
        initialize(state) {
            calls.push([id, state.execution.rngState]);
            return {
                state: { ...state, execution: { ...state.execution, rngState: state.execution.rngState + 1 } },
                value: { ...data },
            };
        },
    });
    const first = make("number", { count: 3 }, { remaining: 2 });
    const second = make("string", { mode: "first" }, { targets: [] });
    const firstInitializer = createAction(first), secondInitializer = createAction(second);
    const configured = { initialize: battle => createActions(battle, firstInitializer, secondInitializer) };
    const initial = fixtureBattle(7, { rngState: 10 });
    const a = initializeActions(initial, configured);
    const b = initializeActions(a.state, configured);
    assert.deepEqual(calls, [["number", 10], ["string", 11], ["number", 12], ["string", 13]]);
    assert.equal(initial.execution.rngState, 10);
    assert.equal(a.state.execution.rngState, 12);
    assert.equal(b.state.execution.rngState, 14);
    assert.deepEqual(a.value.actions.keys().toArray(), ["number", "string"]);
    assert.deepEqual(a.value.actions.get(first.id, first).state, { count: 3 });
    assert.deepEqual(a.value.actions.get(second.id, second).state, { mode: "first" });
    assert.notEqual(a.value.actions.get(first.id, first).state, b.value.actions.get(first.id, first).state);
    assert.notEqual(a.value.actions.get(second.id, second).state, b.value.actions.get(second.id, second).state);
    assert.equal(a.value.actions.get(first.id, first).execution, null);
    const empty = initializeActions(initial, { initialize: createActions });
    assert.equal(empty.state, initial);
    assert.equal(empty.value.actions.size, 0);
    assert.equal(empty.value.nextExecutionId, 0);
    assert.throws(() => createActions(initial, firstInitializer, createAction({ ...first })), RangeError);
    assert.throws(() => createAction({ ...first, id: "" }), TypeError);
    assert.throws(() => createAction({ ...first, intervalTicks: -1 }), RangeError);
    assert.throws(() => createAction({ ...first, speed: Infinity }), RangeError);
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
    assert.strictEqual(original.getAction(first.id), one);
    assert.deepEqual(original.getAction(first.id).state, { count: 1 });
    assert.equal(original.getAction("missing"), undefined);
    assert.strictEqual(original.getExecution(0), two);
    assert.deepEqual(original.getExecution(0).execution.state, { message: "flying" });
    assert.equal(original.getExecution(9), undefined);
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
    assert.equal(changed.getExecution(7), undefined);
    assert.strictEqual(original.getExecution(7), one);
    assert.equal(original.getExecution(7).execution.state.remaining, 2);
    assert.deepEqual(JSON.parse(JSON.stringify(changed)).map(self => [self.definition.id, self.state, self.execution]), [["first", { count: 2 }, null], ["second", { text: "other" }, null]]);
});

test("Action initialization, start and termination retain one persistent aggregate", () => {
    const ended = [];
    const configured = {
        ...definition("program", { starts: 0 }, { remaining: 2 }),
        prepare(battle, source, self) {
            const currentState = operations.getAction(battle, operations.ref(source, self.definition)).state;
            return { state: operations.setState(battle, operations.ref(source, self.definition), { starts: currentState.starts + 1 }), value: { remaining: 2 } };
        },
        onEnd(battle, source, self, end) {
            ended.push([self.execution.status, self.execution.state.remaining, end]);
            return battle;
        },
    };
    const created = initialize(fixtureBattle(), { id: 0, position: [0, 0], definition: { hooks: [], id: "program-host", action: actionCapability(configured) } });
    const before = addUnit(created.state, created.value), source = units.ref(created.value);
    const started = operations.start(before, operations.ref(source, configured));
    assert.equal(started.value.type, "STARTED");
    assert.deepEqual(operations.getAction(before, operations.ref(source, configured)).state, { starts: 0 });
    assert.deepEqual(operations.getAction(started.state, operations.ref(source, configured)).state, { starts: 1 });
    assert.deepEqual(operations.getExecution(started.state, started.value.ref).execution.state, { remaining: 2 });
    const stopped = operations.cancel(started.state, started.value.ref, "TEST");
    assert.equal(operations.getExecution(stopped, started.value.ref), undefined);
    assert.deepEqual(operations.getAction(stopped, operations.ref(source, configured)).state, { starts: 1 });
    assert.equal(operations.getAction(stopped, operations.ref(source, configured)).execution, null);
    assert.deepEqual(ended, [["ENDING", 2, { type: "CANCELLED", reason: "TEST" }]]);
    assert.deepEqual(operations.getExecution(started.state, started.value.ref).execution.state, { remaining: 2 });
});

test("Action default queries expose complete programs with object private state", async () => {
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
import type { Definition } from ${source("unit/action/index")};
import { executionRef, type Action, type Execution } from ${source("unit/action/index")};
import { Actions } from ${source("unit/action/actions")};
import * as operations from ${source("unit/action/index")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
declare const battle: BattleState;
declare const source: Ref<Unit & ActionCapability>;
declare const precise: Execution<{ readonly count: number }, { readonly remaining: number }>;
declare const publicAction: Action;
declare const publicExecution: Execution;
declare const configured: Definition<{ readonly count: number }, { readonly remaining: number }>;
const preciseRef = executionRef(source, precise);
const publicRef = executionRef(source, publicExecution);
const values = Actions.empty().values();
type Values = Assert<Equal<typeof values, Query<Action>>>;
const known = Actions.empty().get(configured.id, configured);
type Known = Assert<Equal<typeof known, Action<{ readonly count: number }, { readonly remaining: number }> | undefined>>;
const current = operations.getExecution(battle, preciseRef);
type Current = Assert<Equal<typeof current, typeof precise | undefined>>;
const unknown = operations.getExecution(battle, publicRef);
type Unknown = Assert<Equal<typeof unknown, Execution | undefined>>;
// @ts-expect-error Default aggregates do not infer persistent fields.
publicAction.state.count;
// @ts-expect-error Default executions do not infer execution fields.
publicExecution.execution.state.remaining;
Actions.empty().add(publicAction);
publicAction.definition.prepare(battle, source, publicAction);
// @ts-expect-error Definition fixes persistent data.
Actions.empty().replace(configured, { ...precise, state: { unrelated: true } });
// @ts-expect-error Definition fixes execution data.
Actions.empty().replace(configured, { ...precise, execution: { ...precise.execution, state: { unrelated: true } } });
// @ts-expect-error An idle aggregate cannot identify an execution.
executionRef(source, publicAction);
operations.setExecutionState(battle, publicRef, {});
const action = Actions.empty().getAction(configured.id);
type ErasedAction = Assert<Equal<typeof action, Action | undefined>>;
if (action !== undefined) {
    action.definition.prepare(battle, source, action);
    // @ts-expect-error An erased getter does not infer persistent content fields.
    action.state.count;
}
const self = Actions.empty().getExecution(0);
type ErasedExecution = Assert<Equal<typeof self, Execution | undefined>>;
if (self !== undefined) {
    self.definition.onTick(battle, source, self);
    // @ts-expect-error An erased getter does not infer persistent content fields.
    self.state.count;
    // @ts-expect-error An erased getter does not infer execution content fields.
    self.execution.state.remaining;
}
`);
        const program = ts.createProgram([path], { noEmit: true, strict: true, exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, skipLibCheck: true, types: [] });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally { rmSync(directory, { recursive: true, force: true }); }
});
