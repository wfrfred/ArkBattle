import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("Action Refs preserve definition state and covariance across heterogeneous storage", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-action-ref-types-"));
    const source = (name) =>
        JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "refs.mts");
    try {
        writeFileSync(
            path,
            `
import type { Ref } from ${source("common/ref")};
import type { Query } from ${source("common/query")};
import type { State as BattleState } from ${source("battle/state")};
import type { Unit } from ${source("unit/unit")};
import type { Action as ActionCapability } from ${source("unit/capability/action/capability")};
import type { View } from ${source("unit/action/action")};
import type { Action, Execution, ExecutionView } from ${source("unit/action/index")};
import { executionRef, ref as actionRef } from ${source("unit/action/index")};
import { Actions } from ${source("unit/action/actions")};
import { create as createAction, createActions } from ${source("unit/action/index")};
import type { Definition } from ${source("unit/action/index")};
import { all, start, getExecution, cancel, updateExecution, getAction, updateState, updateCooldown, resetCooldown, clearCooldown } from ${source("unit/action/index")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
declare const battle: BattleState;
declare const source: Ref<Unit & ActionCapability>;
declare const action: Execution<object, { count: number }>;
declare const specialized: Ref<Execution<object, { count: number }> & { readonly marker: 17 }>;
const definition: Definition<object, { count: number }> = {
    id: "count", intervalTicks: 10, speed: 100,
    initialize: current => ({ state: current, value: {} }),
    prepare: current => ({ state: current, value: { count: 0 } }),
    onTick: (current, host, self) => ({ state: updateExecution(current, executionRef(host, self), state => ({ count: state.count + 1 })), value: false }),
};
const started = start(battle, actionRef(source, definition));
if (started.value.type === "STARTED") {
    const current = getExecution(started.state, started.value.ref);
    type Current = Assert<Equal<typeof current, Execution<object, { count: number }> | undefined>>;
}
const known = executionRef(source, action);
const host: Ref<Unit & ActionCapability> = known.host;
type Host = Assert<Equal<typeof known.host, Ref<Unit & ActionCapability>>>;
// @ts-expect-error A reference needs its host as well as the per-host execution id.
const hostless: Pick<typeof known, "host" | "id"> = { id: 0 };
type Known = Assert<Equal<typeof known, Ref<Execution<object, { count: number }>>>>;
const weaker: Ref<Execution<object, { count: number }>> = specialized;
const erased: Ref<ExecutionView> = weaker;
const candidates = all(battle);
type Candidates = Assert<Equal<typeof candidates, readonly Ref<ExecutionView>[]>>;
const entries = Actions.empty().add(action);
const publicEntries: Query<View> = entries.values();
const exactEntry = entries.get(definition.id, definition);
type ExactEntry = Assert<Equal<typeof exactEntry, Action<object, { count: number }> | undefined>>;
entries.replace(definition, { ...action, execution: { ...action.execution, state: { count: 1 } } });
// @ts-expect-error Public views cannot be inserted as complete aggregates.
entries.add(getExecution(battle, erased)!);
// @ts-expect-error A typed Definition fixes execution state inference.
entries.replace(definition, { ...action, execution: { ...action.execution, state: { count: "wrong" } } });
cancel(battle, erased, "SCRIPT");
// @ts-expect-error Phantom identity cannot be manufactured.
const forged: Ref<Execution<object, { count: number }>> = { id: 0 };
// @ts-expect-error
const stronger: Ref<Execution<object, { count: number }> & { readonly marker: 17 }> = weaker;
// @ts-expect-error
const mismatched: Ref<Execution<object, { label: string }>> = weaker;
// @ts-expect-error
getExecution(battle, source);
// @ts-expect-error
getExecution(battle, 0);
// @ts-expect-error
getExecution(battle, action);
// @ts-expect-error
getExecution(battle, erased)!.definition.onTick;
// @ts-expect-error Public execution views hide E.
getExecution(battle, erased)!.execution.state.count;
// @ts-expect-error Public aggregate views hide P.
getExecution(battle, erased)!.state;
updateExecution(battle, known, current => { const count: number = current.count; return { count: count + 1 }; });
// @ts-expect-error The execution reference fixes E.
updateExecution(battle, known, () => ({ count: "invalid" }));
// @ts-expect-error Public references do not prove private state.
updateExecution(battle, erased, current => current);
// @ts-expect-error A Unit reference cannot identify an execution.
updateExecution(battle, source, () => ({ count: 1 }));
// @ts-expect-error Updates require references rather than snapshots.
updateExecution(battle, action, () => ({ count: 1 }));
const persistent: Definition<{ uses: number }, { target: string }> = {
    id: "persistent", intervalTicks: 10, speed: 100,
    initialize: current => ({ state: current, value: { uses: 0 } }),
    prepare: (current, host, self) => ({ state: updateState(current, actionRef(host, self.definition), value => ({ uses: value.uses + 1 })), value: { target: "sampled" } }),
    onTick: (current, host, self) => {
        const stored = getAction(current, actionRef(host, self.definition))!;
        const uses: number = stored.state.uses;
        const target: string = self.execution.state.target;
        // @ts-expect-error
        const wrongPersistent: string = stored.state.uses;
        // @ts-expect-error
        const wrongExecution: number = self.execution.state.target;
        // @ts-expect-error Definition fixes P for transforms.
        updateState(current, actionRef(host, self.definition), () => ({ uses: "invalid" }));
        return { state: current, value: false };
    },
};
const persistentReference = actionRef(source, persistent);
type PersistentReference = Assert<Equal<typeof persistentReference, Ref<Action<{ uses: number }, { target: string }>>>>;
const persistentCurrent = getAction(battle, persistentReference);
type PersistentCurrent = Assert<Equal<typeof persistentCurrent, Action<{ uses: number }, { target: string }> | undefined>>;
updateState(battle, persistentReference, current => ({ uses: current.uses + 1 }));
updateCooldown(battle, persistentReference, current => ({ ...current, readyAtTick: 20 }));
resetCooldown(battle, persistentReference);
clearCooldown(battle, persistentReference);
const persistentStart = start(battle, persistentReference);
if (persistentStart.value.type === "STARTED") {
    type Started = Assert<Equal<typeof persistentStart.value.ref, Ref<Execution<{ uses: number }, { target: string }>>>>;
}
// @ts-expect-error A persistent reference retains its P type.
const wrongPersistentReference: Ref<Action<{ uses: string }, { target: string }>> = persistentReference;
// @ts-expect-error A persistent reference also retains its E type.
const wrongPersistentExecution: Ref<Action<{ uses: number }, { target: number }>> = persistentReference;
// @ts-expect-error A persistent Action and one of its executions have different identities.
const actionAsExecution: Ref<Execution<{ uses: number }, { target: string }>> = persistentReference;
// @ts-expect-error An execution reference cannot stand in for the persistent Action.
const executionAsAction: Ref<Action<object, { count: number }>> = known;
// @ts-expect-error Persistent lookup requires an Action reference.
getAction(battle, known);
// @ts-expect-error Execution lookup requires an Execution reference.
getExecution(battle, persistentReference);
// @ts-expect-error Starting uses the persistent Action identity.
start(battle, known);
// @ts-expect-error Cancellation targets a particular execution.
cancel(battle, persistentReference);
// @ts-expect-error Persistent state cannot be updated through an execution reference.
updateState(battle, known, current => current);
// @ts-expect-error Execution state cannot be updated through a persistent reference.
updateExecution(battle, persistentReference, current => current);
// @ts-expect-error Cooldown belongs to the persistent Action.
updateCooldown(battle, known, current => current);
const configuration: ActionCapability["definition"]["action"] = {
    initialize: current => createActions(current, createAction(definition), createAction(persistent)),
};
const initialized = configuration.initialize(battle);
// @ts-expect-error Generic initialized entries hide persistent content state.
initialized.value.get("persistent")!.state;
const initializedPersistent = initialized.value.get("persistent", persistent)!;
const initializedUses: number = initializedPersistent.state.uses;
declare const actionHost: Unit & ActionCapability;
// @ts-expect-error Untyped queries hide persistent content state.
actionHost.action.actions.get("persistent")!.state;
const persistentEntry = actionHost.action.actions.get("persistent", persistent)!;
const usage: number = persistentEntry.state.uses;
actionHost.action.actions.replace(persistent, { ...persistentEntry, state: { uses: 2 } });
// @ts-expect-error
 actionHost.action.actions.replace(persistent, { ...persistentEntry, state: { uses: "wrong" } });
actionHost.action.actions.read("persistent", self => {
    const stored = getAction(battle, actionRef(source, self.definition))!;
    // @ts-expect-error Unknown configuration keeps its private type abstract.
    stored.state.uses;
    return updateState(battle, actionRef(source, self.definition), current => current);
});
`,
        );
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
        assert.deepEqual(
            ts
                .getPreEmitDiagnostics(program)
                .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
            [],
        );
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
