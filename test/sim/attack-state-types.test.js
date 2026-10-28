import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("Attack persistent and execution data keep separate types and typed activation references", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-attack-state-types-"));
    const source = (name) => JSON.stringify(fileURLToPath(new URL(`../../src/${name}.js`, import.meta.url)));
    const path = join(directory, "state.mts");
    try {
        writeFileSync(path, `
import type { Ref } from ${source("core/common/ref")};
import type { State as BattleState, Result } from ${source("core/battle/state")};
import { executionRef, ref as actionRef } from ${source("core/unit/action/index")};
import { setExecutionState, getAction, getExecution, setState } from ${source("core/unit/action/index")};
import type { Activation } from ${source("core/unit/skill/activation")};
import { get as getActivation } from ${source("core/unit/skill/index")};
import { consume, check } from ${source("core/unit/skill/ammo")};
import { create, createWithState, isAttack, type Attack, type Configuration } from ${source("content/actions/attack")};
import { create as createSkillAttack, type State as SkillAttackState } from ${source("content/actions/skill")};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
declare const configuration: Configuration;
declare const battle: BattleState;
declare const unknownDefinition: unknown;
type Persistent = { count: number };
type Active = { mode: "FIRST" | "SECOND" };
declare const activation: Ref<Activation<Active>>;
const counted = createWithState({
    ...configuration,
    initialize: current => ({ state: current, value: { count: 0 } }),
    prepare: (current, source, self): Result<{ sampled: number }> => ({ state: current, value: { sampled: self.state.count } }),
    output(current, source, self) {
        const persistent = getAction(current, actionRef(source, self.definition))!;
        const count: number = persistent.state.count;
        current = setState(current, actionRef(source, self.definition), { count: persistent.state.count + 1 });
        const latest = getExecution(current, executionRef(source, self))!;
        return setExecutionState(current, executionRef(source, self), { ...latest.execution.state, data: { sampled: count } });
    },
    afterOutput(current, source, self) {
        const sampled: number = self.execution.state.data.sampled;
        // @ts-expect-error
        self.execution.state.data.missing;
        // @ts-expect-error
        self.execution.state.data.count;
        return current;
    },
    onEnd(current, source, self) {
        const count: number = getAction(current, actionRef(source, self.definition))!.state.count;
        return current;
    },
});
type Counted = Assert<Equal<typeof counted, Attack<Persistent, { sampled: number }>>>;
const preciseAmmo = createWithState({
    ...configuration,
    initialize: current => ({ state: current, value: {} }),
    prepare: (current): { state: BattleState; value: { activation: Ref<Activation<Active>> | null } } => ({ state: current, value: { activation } }),
    afterOutput(current, source, self) {
        const sampled = self.execution.state.data.activation;
        type Sampled = Assert<Equal<typeof sampled, Ref<Activation<Active>> | null>>;
        if (sampled === null) return current;
        const latest = getActivation(current, sampled);
        type Latest = Assert<Equal<typeof latest, Activation<Active> | undefined>>;
        if (latest === undefined) return current;
        const mode: "FIRST" | "SECOND" = latest.data.mode;
        current = consume(current, sampled, 2).state;
        return check(current, sampled);
    },
});
type PreciseAmmo = Assert<Equal<typeof preciseAmmo, Attack<{}, { activation: Ref<Activation<Active>> | null }>>>;
const genericAmmo = createSkillAttack({
    ...configuration,
    ammoPerAction: 2,
    output(current, source, self) {
        const sampled: Ref<Activation> | null = self.execution.state.data.activation;
        if (sampled !== null) {
            const latest: Activation | undefined = getActivation(current, sampled);
            // @ts-expect-error
            latest!.data.mode;
        }
        return current;
    },
});
type GenericAmmo = Assert<Equal<typeof genericAmmo, Attack<object, SkillAttackState>>>;
// @ts-expect-error
createWithState<{ count: number }, {}>({ ...configuration });
// @ts-expect-error
create<{ count: number }>(configuration);
// @ts-expect-error
const fabricated: Attack<{ count: number }, {}> = create(configuration);
// @ts-expect-error
const mismatched: Attack<{ count: string }, { sampled: number }> = counted;
// @ts-expect-error
const wrongExecution: Attack<Persistent, { sampled: string }> = counted;
// @ts-expect-error
const raw: SkillAttackState = { activation: { host: { id: 0 }, id: 0 } };
if (isAttack(unknownDefinition)) {
    const identity: string = unknownDefinition.id;
    // @ts-expect-error
    unknownDefinition.onTick;
    // @ts-expect-error
    unknownDefinition.attack.output;
}
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
