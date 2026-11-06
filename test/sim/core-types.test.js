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
import { initialize, ref, get, compose, optional, type Unit, type Change } from ${module("unit/index")};
import { update } from ${module("battle/unit")};
import * as actions from ${module("unit/action/index")};
import * as effects from ${module("unit/effect/index")};
import * as hpDamage from ${module("battle/damage/hp/index")};
import * as vitality from ${module("unit/capability/vitality/index")};
import * as elemental from ${module("unit/capability/elemental/index")};
import * as skills from ${module("unit/skill/index")};
import type { Skill as SkillCapability } from ${module("unit/capability/skill/index")};
import * as actionCapability from ${module("unit/capability/action/index")};
import { createRegistrationOperations } from ${module("unit/registration")};
import type { Offense } from ${module("unit/capability/offense/index")};
import { setAttackContribution, resolveAttack } from ${module("unit/capability/offense/index")};
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
    id: 'armed', hooks: Hooks.empty(), offense: { attack: 100 }, layer: { type: 'GROUND' },
    action: { initialize: state => actions.createActions(state, actions.create(program)) },
} }).value;
const reference = ref(host);
const currentAction = host.action.actions.get(program.id, program)!;
const currentPeriod: number = actionCapability.resolvePeriod(host, currentAction);
// @ts-expect-error an Action calculation takes the instance rather than a detached Definition.
actionCapability.resolvePeriod(host, program);
actionCapability.setSpeedContribution({ id: 'fixed-speed', value: [] });
const dynamicModifiers = (_state: State, _self: Unit & actionCapability.Action) => [];
// @ts-expect-error Action time contributions publish fixed values through a Change.
actionCapability.setSpeedContribution({ id: 'dynamic-speed', value: dynamicModifiers });
// @ts-expect-error interval changes use the same fixed contribution contract as speed.
actionCapability.setIntervalContribution({ id: 'dynamic-interval', value: dynamicModifiers });
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
    effects.setExpiration(installed.state, installed.value, { type: 'DEADLINE', tick: 10 });
    // @ts-expect-error writes cannot widen the identity's private data pairing.
    effects.setData(installed.state, installed.value, { charges: 'wrong' });
}
declare const burstRef: Ref<elemental.Burst>;
const burst = elemental.get(battle, burstRef)!;
effects.setExpiration(battle, burstRef, { ...burst.expiration, elapsed: burst.expiration.elapsed + 1 });
// @ts-expect-error writes retain the Burst identity's duration contract.
effects.setExpiration(battle, burstRef, { type: 'DEADLINE', tick: 10 });
const bare = initialize(battle, { id: 1, position: [0, 0], definition: { id: 'bare', hooks: Hooks.empty() } }).value;
actions.cancelForUnit(battle, reference, 'SOURCE_ABSENT');
// @ts-expect-error cancelling a Unit's Actions requires its Action capability.
actions.cancelForUnit(battle, ref(bare), 'SOURCE_ABSENT');
// @ts-expect-error the host has not established the required capability.
effects.install(battle, ref(bare), shield);
const change: Change<Unit & Offense> = setAttackContribution({ id: 'bonus', value: [] });
const actionChange = actionCapability.setRule({ id: 'ready', allows: () => true });
const optionalAction: Change<Unit> = optional(actionCapability.hasAction, actionChange);
update(battle, ref(bare), optionalAction);
const optionalResult = optionalAction(host);
const optionalHost: typeof host = optionalResult.next;
const optionalLayer: 'GROUND' | 'AIR' = optionalResult.next.layer.type;
const combined = compose(change, actionChange);
const intersection: Change<Unit & Offense & actionCapability.Action> = combined;
const applied = combined(host);
const completeHost: typeof host = applied.next;
const extraLayer: 'GROUND' | 'AIR' = applied.next.layer.type;
update(battle, reference, combined);
declare const offenseOnly: Ref<Unit & Offense>;
declare const actionOnly: Ref<Unit & actionCapability.Action>;
// @ts-expect-error the composed Action requirement cannot be supplied by an Offense-only Ref.
update(battle, offenseOnly, combined);
// @ts-expect-error the composed Offense requirement cannot be supplied by an Action-only Ref.
update(battle, actionOnly, combined);
declare const skillChange: Change<Unit & SkillCapability>;
// @ts-expect-error an Action guard does not establish Skill.
optional(actionCapability.hasAction, skillChange);
// @ts-expect-error an Action guard does not establish every composed requirement.
optional(actionCapability.hasAction, compose(actionChange, skillChange));
// @ts-expect-error requiring Skill cannot be weakened into requiring only Action.
const wrongRequirement: Change<Unit & actionCapability.Action> = skillChange;
const general: Change<Unit> = self => ({ next: self, settlements: [] });
const usableWithAction: Change<Unit & actionCapability.Action> = general;
const attack: number = resolveAttack(battle, host);
// @ts-expect-error value computation accepts the current object rather than its address.
resolveAttack(battle, reference);
// @ts-expect-error value computation requires the relevant capability.
resolveAttack(battle, bare);
declare const skillHost: Unit & SkillCapability;
// @ts-expect-error a Skill can legitimately have no SP resource.
skills.resolveRecoverySpeed(battle, skillHost);
if (skills.hasSp(skillHost)) {
    const speed: number = skills.resolveRecoverySpeed(battle, skillHost);
    const multiplier: number = skills.resolveRecoveryMultiplier(battle, skillHost);
}
const patient = initialize(battle, { id: 2, position: [0, 0], definition: {
    id: 'patient', hooks: Hooks.empty(),
    vitality: { maxHp: 100, defense: 10, resistance: 0 },
} }).value;
const patientRef = ref(patient);
update(battle, patientRef, vitality.setRule({
    id: 'damage-permission', allows: (_state, context) => context.calculated.amount > 0,
}));
const injuryType: elemental.Type = 'NEURAL';
elemental.setRule('damageRules', {
    id: 'injury-permission', allows: (_state, context) => context.type === 'NEURAL',
});
declare const elementalRule: elemental.DamageRule;
declare const elementalRuleKey: 'damageRules' | 'healingRules';
// @ts-expect-error a Rule cannot be registered against an unrelated field Context.
elemental.setRule('healingRules', elementalRule);
const fixedRule = createRegistrationOperations<
    Unit & elemental.Elemental, 'elemental', typeof elementalRuleKey
>('elemental', elementalRuleKey);
// @ts-expect-error fixing an uncertain field does not erase its Entry pairing.
fixedRule.set(elementalRule);
vitality.setContribution('defense', {
    id: 'armor', value: (_state, self) => {
        const defense: number = self.definition.vitality.defense;
        return [];
    },
});
vitality.setHook('damageReceiving', {
    id: 'cancel',
    invoke: (state, context, pending) => {
        const amount: number = context.calculated.amount;
        // @ts-expect-error inline callbacks retain precise working values rather than any.
        const invalidAmount: string = pending.amount;
        return { state, value: hpDamage.cancel(pending, 'EVADE') };
    },
});
actionCapability.setHook('beforeRelease', {
    id: 'interrupt',
    invoke: (state, context) => {
        const source: Ref<Unit> = context.source;
        return { state, value: { type: 'INTERRUPT', recoveryTicks: 1 } };
    },
});
// @ts-expect-error automatic operations cannot write a special field.
vitality.setContribution('maxHp', { id: 'wrong', value: [] });
// @ts-expect-error an Entry cannot establish a missing host capability.
update(battle, ref(bare), vitality.setContribution('defense', { id: 'wrong', value: [] }));
declare const damageReceiving: hpDamage.ReceivingHook;
declare const pairedRegistration:
    | [key: 'damageReceiving', hook: hpDamage.ReceivingHook]
    | [key: 'damageReceivingStarted', hook: hpDamage.ReceivingStartedHook];
vitality.setHook(...pairedRegistration);
// @ts-expect-error each field retains its corresponding Hook type.
vitality.setHook('healingReceiving', damageReceiving);
declare const receivingStage: 'damageReceiving' | 'healingReceiving';
// @ts-expect-error a union key and an unrelated Entry are not a paired argument.
vitality.setHook(receivingStage, damageReceiving);
// @ts-expect-error a factory can select only actual registration fields.
createRegistrationOperations<Unit & vitality.Vitality, 'vitality', 'unknown'>('vitality');
// @ts-expect-error ordinary resource values are not registration arrays.
createRegistrationOperations<Unit & vitality.Vitality, 'vitality', 'hp'>('vitality');
// @ts-expect-error a different capability cannot be inferred from an unrelated proof.
update(battle, reference, setLayer('AIR'));
// @ts-expect-error public updates take Change behavior rather than complete snapshots.
update(battle, reference, host);
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
