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
import type { Action, Executing, ExecutingView } from ${source("unit/action/index")};
import { ref } from ${source("unit/action/index")};
import { Actions } from ${source("unit/action/actions")};
import { create as createAction, createActions } from ${source("unit/action/index")};
import type { Definition } from ${source("unit/action/index")};
import { all, start, get, cancel, update, getAction, updateState } from ${source("unit/action/index")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
declare const battle: BattleState;
declare const source: Ref<Unit & ActionCapability>;
declare const action: Executing<object, { count: number }>;
declare const specialized: Ref<Executing<object, { count: number }> & { readonly marker: 17 }>;
const definition: Definition<object, { count: number }> = {
    id: "count", intervalTicks: 10, speed: 100,
    initialize: current => ({ state: current, value: {} }),
    prepare: current => ({ state: current, value: { count: 0 } }),
    onTick: (current, host, self) => ({ state: update(current, ref(host, self), state => ({ count: state.count + 1 })), value: false }),
};
const started = start(battle, source, definition);
if (started.value.type === "STARTED") {
    const current = get(started.state, started.value.ref);
    type Current = Assert<Equal<typeof current, Executing<object, { count: number }> | undefined>>;
}
const known = ref(source, action);
const host: Ref<Unit & ActionCapability> = known.host;
type Host = Assert<Equal<typeof known.host, Ref<Unit & ActionCapability>>>;
// @ts-expect-error A reference needs its host as well as the per-host execution id.
const hostless: Pick<typeof known, "host" | "id"> = { id: 0 };
type Known = Assert<Equal<typeof known, Ref<Executing<object, { count: number }>>>>;
const weaker: Ref<Executing<object, { count: number }>> = specialized;
const erased: Ref<ExecutingView> = weaker;
const candidates = all(battle);
type Candidates = Assert<Equal<typeof candidates, readonly Ref<ExecutingView>[]>>;
const entries = Actions.empty().add(action);
const publicEntries: Query<View> = entries.values();
const exactEntry = entries.get(definition.id, definition);
type ExactEntry = Assert<Equal<typeof exactEntry, Action<object, { count: number }> | undefined>>;
entries.replace(definition, { ...action, execution: { ...action.execution, state: { count: 1 } } });
// @ts-expect-error Public views cannot be inserted as complete aggregates.
entries.add(get(battle, erased)!);
// @ts-expect-error A typed Definition fixes execution state inference.
entries.replace(definition, { ...action, execution: { ...action.execution, state: { count: "wrong" } } });
cancel(battle, erased, "SCRIPT");
// @ts-expect-error Phantom identity cannot be manufactured.
const forged: Ref<Executing<object, { count: number }>> = { id: 0 };
// @ts-expect-error
const stronger: Ref<Executing<object, { count: number }> & { readonly marker: 17 }> = weaker;
// @ts-expect-error
const mismatched: Ref<Executing<object, { label: string }>> = weaker;
// @ts-expect-error
get(battle, source);
// @ts-expect-error
get(battle, 0);
// @ts-expect-error
get(battle, action);
// @ts-expect-error
get(battle, erased)!.definition.onTick;
// @ts-expect-error Public execution views hide E.
get(battle, erased)!.execution.state.count;
// @ts-expect-error Public aggregate views hide P.
get(battle, erased)!.state;
update(battle, known, current => { const count: number = current.count; return { count: count + 1 }; });
// @ts-expect-error The execution reference fixes E.
update(battle, known, () => ({ count: "invalid" }));
// @ts-expect-error Public references do not prove private state.
update(battle, erased, current => current);
// @ts-expect-error A Unit reference cannot identify an execution.
update(battle, source, () => ({ count: 1 }));
// @ts-expect-error Updates require references rather than snapshots.
update(battle, action, () => ({ count: 1 }));
const persistent: Definition<{ uses: number }, { target: string }> = {
    id: "persistent", intervalTicks: 10, speed: 100,
    initialize: current => ({ state: current, value: { uses: 0 } }),
    prepare: (current, host, self) => ({ state: updateState(current, host, self.definition, value => ({ uses: value.uses + 1 })), value: { target: "sampled" } }),
    onTick: (current, host, self) => {
        const stored = getAction(current, host, self.definition)!;
        const uses: number = stored.state.uses;
        const target: string = self.execution.state.target;
        // @ts-expect-error
        const wrongPersistent: string = stored.state.uses;
        // @ts-expect-error
        const wrongExecution: number = self.execution.state.target;
        // @ts-expect-error Definition fixes P for transforms.
        updateState(current, host, self.definition, () => ({ uses: "invalid" }));
        return { state: current, value: false };
    },
};
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
    const stored = getAction(battle, source, self.definition)!;
    // @ts-expect-error Unknown configuration keeps its private type abstract.
    stored.state.uses;
    return updateState(battle, source, self.definition, current => current);
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
