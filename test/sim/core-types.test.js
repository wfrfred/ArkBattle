import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("typed identities retain private data and capability proofs across erased Core storage", async () => {
    const { default: ts } = await import("typescript");
    const module = (name) =>
        JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const file = fileURLToPath(new URL("../../.cache/semantic-contract.mts", import.meta.url));
    const source = `
import type { Ref } from ${module("common/ref")};
import type { State } from ${module("battle/state")};
import { Hooks, key, type Hook } from ${module("hook")};
import { initialize, ref, get, type Unit, type Change } from ${module("unit/index")};
import { update } from ${module("battle/unit")};
import * as actions from ${module("unit/action/index")};
import * as effects from ${module("unit/effect/index")};
import * as hpDamage from ${module("battle/damage/hp/index")};
import type { Offense } from ${module("unit/capability/offense/index")};
import { setAttackContribution } from ${module("unit/capability/offense/index")};
import { setLayer } from ${module("unit/capability/blocking/index")};
declare const battle: State;
const outputKey = key<Hook<{ amount: number }, number>>('output');
const textKey = key<Hook<{ text: string }, number>>('text');
const registered = Hooks.empty().set(outputKey, {
    id: 'output', invoke: (state, context, current) => ({ state, value: current + context.amount }),
});
registered.get(outputKey)[0]!.invoke(battle, { amount: 1 }, 0);
// @ts-expect-error a key preserves its exact Hook type through storage.
const mismatchedKey: typeof outputKey = textKey;
// @ts-expect-error entries cannot widen the Hook type established by their key.
Hooks.empty().set(outputKey, { id: 'wrong', invoke: (state, context: { text: string }, current) => ({ state, value: current }) });
const receivingKey = key<hpDamage.ReceivingHook>('receiving');
const receivingHooks = Hooks.empty().set(receivingKey, {
    id: 'evade', invoke: (state, _context, current) => ({ state, value: hpDamage.cancel(current, 'EVADE') }),
});
declare const receivingContext: hpDamage.ReceivingContext;
declare const cancelled: hpDamage.Pending<hpDamage.Cancellation<'EVADE'>>;
const reception = receivingHooks.get(receivingKey)[0]!.invoke(battle, receivingContext, cancelled);
const preservedReason: 'EVADE' = reception.value.cancellation.reason;
// @ts-expect-error erased storage preserves the specialized Receiving signature.
Hooks.empty().set(receivingKey, { id: 'revive', invoke: (state, _context, current: hpDamage.Pending) => ({ state, value: { ...current, cancellation: null } }) });
const program: actions.Definition<{ uses: number }, { hits: number }> = {
    id: 'attack', intervalTicks: 10, speed: 100,
    initialize: state => ({ state, value: { uses: 0 } }),
    prepare: state => ({ state, value: { hits: 1 } }),
    onTick: state => ({ state, value: true }),
};
const host = initialize(battle, { id: 0, position: [0, 0], definition: {
    id: 'armed', hooks: Hooks.empty(), offense: { attack: 100 },
    action: { initialize: state => actions.createActions(state, actions.create(program)) },
} }).value;
const reference = ref(host);
const persistent = actions.ref(reference, program);
const uses: number = actions.getAction(battle, persistent)!.state.uses;
actions.setState(battle, persistent, { uses: uses + 1 });
const started = actions.start(battle, persistent);
if (started.value.type === 'STARTED') {
    const execution = started.value.ref;
    const hits: number = actions.getExecution(started.state, execution)!.execution.state.hits;
    actions.setExecutionState(started.state, execution, { hits: hits + 1 });
    // @ts-expect-error the execution identity retains its own private state type.
    actions.setExecutionState(started.state, execution, { hits: 'wrong' });
    // @ts-expect-error persistent and execution identities are different.
    actions.getAction(started.state, execution);
}
declare const erased: Ref<actions.Execution>;
// @ts-expect-error ordinary erased reads cannot invent private fields.
actions.getExecution(battle, erased)!.execution.state.hits;
const shield: effects.Definition<{ charges: number }, Offense> = {
    id: 'shield', initialize: () => ({ charges: 1 }),
    onTick(state, self) {
        const attack: number = get(state, self.host)!.definition.offense.attack;
        return effects.setData(state, effects.ref(self), { charges: self.data.charges + attack });
    },
};
const installed = effects.install(battle, reference, shield);
if (installed.value !== undefined) {
    const charges: number = effects.get(installed.state, installed.value)!.data.charges;
    // @ts-expect-error writes cannot widen the identity's private data pairing.
    effects.setData(installed.state, installed.value, { charges: 'wrong' });
}
const bare = initialize(battle, { id: 1, position: [0, 0], definition: { id: 'bare', hooks: Hooks.empty() } }).value;
// @ts-expect-error the host has not established the required capability.
effects.install(battle, ref(bare), shield);
const change: Change = setAttackContribution(reference, { id: 'bonus', value: [] });
update(battle, [change]);
// @ts-expect-error a different capability cannot be inferred from an unrelated proof.
setLayer(reference, 'AIR');
// @ts-expect-error public writes accept constructed Changes rather than complete snapshots.
update(battle, [host]);
// @ts-expect-error callers cannot fabricate an opaque Change.
const fabricated: Change = {};
// @ts-expect-error a numeric address alone does not establish a Unit proof.
const forged: Ref<Unit> = { id: 0 };
`;
    const options = {
        noEmit: true,
        strict: true,
        exactOptionalPropertyTypes: true,
        noUncheckedIndexedAccess: true,
        skipLibCheck: true,
        types: [],
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
    };
    const host = ts.createCompilerHost(options);
    const read = host.getSourceFile.bind(host);
    host.getSourceFile = (name, version, ...rest) =>
        name === file
            ? ts.createSourceFile(name, source, version, true)
            : read(name, version, ...rest);
    const program = ts.createProgram([file], options, host);
    assert.deepEqual(
        ts
            .getPreEmitDiagnostics(program)
            .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
        [],
    );
});
