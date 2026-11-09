import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("typed construction and identities retain private state and capability proofs", async () => {
    const { default: ts } = await import("typescript");
    const module = (name) =>
        JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const file = fileURLToPath(new URL("../../.cache/semantic-contract.mts", import.meta.url));
    const source = `
import type { Ref } from ${module("common/ref")};
import type { State } from ${module("battle/state")};
import { Hooks, key, type Hook } from ${module("hook")};
import { initialize, ref, get, all as allUnits, compose, optional, type Unit, type Input as UnitInput, type Change } from ${module("unit/index")};
import { update } from ${module("battle/unit")};
import * as actions from ${module("unit/action/index")};
import * as effects from ${module("unit/effect/index")};
import * as hpDamage from ${module("battle/damage/hp/index")};
import * as vitality from ${module("unit/capability/vitality/index")};
import * as elemental from ${module("unit/capability/elemental/index")};
import * as skills from ${module("unit/skill/index")};
import { hasSkill, type Skill as SkillCapability } from ${module("unit/capability/skill/index")};
import { hasSpatialPresence, disappear } from ${module("unit/capability/presence/index")};
import { dispatch as dispatchSkill } from ${module("unit/capability/skill/hook")};
import { dispatch as dispatchElemental } from ${module("unit/capability/elemental/hook")};
import * as runtime from ${module("battle/runtime")};
import type { Input as BattleInput, Command } from ${module("battle/contract")};
import type { Card, UnitDefinition as CardDefinition } from ${module("battle/deployment/card/card")};
import type { Projectile } from ${module("projectile/projectile")};
import * as projectiles from ${module("projectile/query")};
import * as projectileOperations from ${module("battle/projectile")};
import type { Definition as ProjectileDefinition } from ${module("projectile/definition")};
import { reassign, selectContext, setTicking, type Plan, type Route } from ${module("unit/capability/route/index")};
import * as mechanisms from ${module("battle/mechanism")};
import { createPredefinedDefinition } from ${module("battle/steps/predefined")};
import * as actionCapability from ${module("unit/capability/action/index")};
import { createRegistrationOperations } from ${module("unit/registration")};
import type { Offense } from ${module("unit/capability/offense/index")};
import { setAttackContribution, resolveAttack } from ${module("unit/capability/offense/index")};
import { setLayer, type Blocker, type Blockable, type Relation, type Hook as BlockingHook } from ${module("unit/capability/blocking/index")};
import * as blocking from ${module("battle/blocking/index")};
import * as targeting from ${module("battle/targeting/index")};
import { hasTargetable } from ${module("unit/capability/targetable/capability")};
import { topK } from ${module("common/collection")};
import type { Spawn } from ${module("battle/schedule/index")};
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
    const cancellation: Command = { type: 'CANCEL_ACTION_EXECUTION', ref: execution };
    runtime.step(started.state, [cancellation]);
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
        return effects.setState(state, effects.ref(self), { charges: self.state.charges + attack });
    },
};
const installed = effects.install(battle, reference, shield);
if (installed.value !== undefined) {
    const charges: number = effects.get(installed.state, installed.value)!.state.charges;
    effects.setExpiration(installed.state, installed.value, { type: 'DEADLINE', tick: 10 });
    // @ts-expect-error writes cannot widen the identity's private data pairing.
    effects.setState(installed.state, installed.value, { charges: 'wrong' });
}
declare const burstRef: Ref<elemental.Burst>;
const burst = elemental.get(battle, burstRef)!;
effects.setExpiration(battle, burstRef, { ...burst.expiration, elapsed: burst.expiration.elapsed + 1 });
// @ts-expect-error writes retain the Burst identity's duration contract.
effects.setExpiration(battle, burstRef, { type: 'DEADLINE', tick: 10 });
const bare = initialize(battle, { id: 1, position: [0, 0], definition: { id: 'bare', hooks: Hooks.empty() } }).value;
const occupiedDefinition = { ...bare.definition, occupancy: { slot: 'OCCUPANT' as const } };
const occupiedInput: UnitInput<typeof occupiedDefinition> = {
    id: 3, definition: occupiedDefinition, position: [0, 0],
    initial: { occupancy: { tile: [0, 0] } },
};
const occupied = initialize(battle, occupiedInput).value;
const occupiedTile: readonly [number, number] = occupied.occupancy.tile;
const { initial: occupiedInitial, ...missingInitial } = occupiedInput;
// @ts-expect-error required capability input cannot be omitted at the Unit entry point.
initialize(battle, missingInitial);
// @ts-expect-error assigning an Input retains the same required construction facts.
const incompleteInput: UnitInput<typeof occupiedDefinition> = missingInitial;
// @ts-expect-error Occupancy requires a structural tile, independently of optional direction.
initialize(battle, { ...occupiedInput, initial: { occupancy: { direction: 'RIGHT' } } });
declare const plan: Plan;
const routedDefinition = { id: 'routed', hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true } };
initialize(battle, { id: 5, definition: routedDefinition, position: [0, 0], initial: { route: { plan, offset: [0, 0] } } });
// @ts-expect-error Route construction requires the instance Plan and offset.
initialize(battle, { id: 5, definition: routedDefinition, position: [0, 0] });
declare const scheduleSpawn: Spawn;
const routedSpawn: Spawn = { ...scheduleSpawn, definition: routedDefinition };
// @ts-expect-error scheduled construction requires the Route capability.
const missingRouteSpawn: Spawn = { ...scheduleSpawn, definition: bare.definition };
const occupiedRoutedDefinition = { ...routedDefinition, occupancy: { slot: 'OCCUPANT' as const } };
// @ts-expect-error this Spawn entry does not supply Occupancy's required initialization facts.
const missingOccupancySpawn: Spawn = { ...scheduleSpawn, definition: occupiedRoutedDefinition };
declare const skillCommandRef: Ref<Unit & SkillCapability>;
declare const routeCommandRef: Ref<Unit & Route>;
declare const routeDefinition: Plan;
const routeChange = compose(reassign(0, routeDefinition), compose(selectContext(0), setTicking(0, false)));
update(battle, routeCommandRef, routeChange);
// @ts-expect-error Route changes require a Route-capable Unit.
update(battle, ref(bare), routeChange);
declare const projectileCommandRef: Ref<Projectile<{ hits: number }>>;
const skillCommand: Command = { type: 'ACTIVATE_SKILL', ref: skillCommandRef };
const projectileCommand: Command<Card, Projectile<{ hits: number }>> = { type: 'STOP_PROJECTILE', ref: projectileCommandRef };
runtime.step(battle, [skillCommand, projectileCommand]);
// @ts-expect-error skill commands require a Skill-capable Unit.
const missingSkillCommand: Command = { type: 'STOP_SKILL', ref: ref(bare) };
// @ts-expect-error a Unit reference is not a Projectile reference.
const wrongProjectileCommand: Command = { type: 'STOP_PROJECTILE', ref: ref(bare) };
const projectileDefinition: ProjectileDefinition<{ hits: number }> = {
    id: 'projectile',
    onTick(state, self) {
        const hits: number = self.state.hits;
        return projectileOperations.update(state, projectiles.ref(self), { state: { hits: hits + 1 } });
    },
};
const createdProjectile = projectileOperations.create(battle, projectileDefinition, {
    position: [0, 0], state: { hits: 0 },
});
const projectileHits: number = projectiles.get(createdProjectile.state, createdProjectile.value)!.state.hits;
// @ts-expect-error a Projectile Ref fixes the private state accepted by writes.
projectileOperations.update(battle, createdProjectile.value, { state: { hits: 'wrong' } });
declare const erasedProjectileCommand: Extract<Command, { type: 'STOP_PROJECTILE' }>;
// @ts-expect-error an ordinary Command does not expose any private Projectile state.
projectiles.get(battle, erasedProjectileCommand.ref)!.state.hits;
declare const elementalUnit: Unit & elemental.Elemental;
elemental.available(elementalUnit);
// @ts-expect-error Elemental eligibility requires its resource capability.
elemental.available(bare);
declare const blockerRef: Ref<Unit & Blocker>;
const relation: Relation = blocking.relations(battle, blockerRef)[0]!;
const targetRef: Ref<Unit & Blockable> = relation.blocked;
const ownerRef: Ref<Unit & Blocker> = relation.blocker;
blocking.release(battle, [relation]);
blocking.maintain(battle, blocking.relations(battle, blockerRef)[0]!);
// @ts-expect-error each relation endpoint retains its required capability.
const invalidRelation: Relation = { blocker: blockerRef, blocked: blockerRef };
const relationshipHook: BlockingHook<Unit & Blocker> = {
    id: 'relationship',
    invoke: (state, context) => ({ state: blocking.release(state, [context.relation]), value: undefined }),
};
actions.cancelForUnit(battle, reference, 'SOURCE_ABSENT');
actions.forUnit(battle, reference);
actions.isCasting(battle, reference);
// @ts-expect-error cancelling a Unit's Actions requires its Action capability.
actions.cancelForUnit(battle, ref(bare), 'SOURCE_ABSENT');
// @ts-expect-error the host has not established the required capability.
effects.install(battle, ref(bare), shield);
const change: Change<Unit & Offense> = setAttackContribution({ id: 'bonus', value: [] });
const actionChange = actionCapability.setRule({ id: 'ready', allows: () => true });
const optionalAction: Change<Unit> = optional(actionCapability.hasAction, actionChange);
const optionalPresence: Change<Unit> = optional(hasSpatialPresence, disappear());
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
const actionHost = allUnits(battle).find(actionCapability.hasAction)!;
const foundAction: actionCapability.Action = actionHost;
const ordinaryPredicate: (self: Unit) => boolean = self => self.id > 0;
// @ts-expect-error an ordinary predicate does not establish a capability proof.
allUnits(battle).filter(ordinaryPredicate).find(() => true)!.action;
for (const self of allUnits(battle).filter(actionCapability.hasAction).filter(hasSpatialPresence)) {
    const present: boolean = self.spatialPresence.present;
    const action: actionCapability.Action = self;
}
for (const self of allUnits(battle).filter(actionCapability.hasAction).filter(hasSkill).filter(skills.hasSp)) {
    const action: actionCapability.Action = self;
    const speed: number = skills.resolveRecoverySpeed(battle, self);
}
const selectableActions = allUnits(battle).filter(actionCapability.hasAction).filter(hasTargetable);
const damagedCandidates = selectableActions.filter(targeting.damage(battle, host));
const nearestPatient = topK(damagedCandidates, 1, targeting.hpRatio)[0]!;
const preservedAction: actionCapability.Action = nearestPatient;
const establishedVitality: vitality.Vitality = nearestPatient;
for (const self of selectableActions.filter(targeting.elementHealing(battle, host))) {
    const preservedAction: actionCapability.Action = self;
    const establishedElemental: elemental.Elemental = self;
}
// @ts-expect-error selection policies take an explicitly supplied source value rather than locating a Ref.
targeting.damage(battle, reference);
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

declare const elementalHost: Ref<Unit & elemental.Elemental>;
declare const elementalStage: 'damaged' | 'burstStarted';
declare const pairedElementalEvent:
    | [stage: 'damaged', event: elemental.Damaged]
    | [stage: 'burstStarted', event: elemental.Burst];
dispatchElemental(battle, elementalHost, ...pairedElementalEvent);
// @ts-expect-error an independent union stage cannot prove the event matches.
dispatchElemental(battle, elementalHost, elementalStage, burst);
declare const skillStage: 'spPaid' | 'activationStarted';
declare const startedEvent: { readonly ref: Ref<skills.Activation> };
// @ts-expect-error Skill dispatch preserves the same key/event association.
dispatchSkill(battle, ref(skillHost), skillStage, startedEvent);

declare const baseInput: Omit<BattleInput, 'deployment' | 'predefines' | 'initialMechanisms'>;
declare const cardBase: Omit<CardDefinition, 'card'>;
declare const cardConfiguration: Omit<CardDefinition['card'], 'initialize' | 'onTick'>;
const counterCard: CardDefinition<{ count: number }> = {
    ...cardBase,
    card: {
        ...cardConfiguration,
        initialize: state => ({ state, value: { count: 0 } }),
        onTick(state, self) {
            const count: number = self.state.count;
            // @ts-expect-error a complete Card Definition retains its private state.
            self.state.label;
            return state;
        },
    },
};
const counterMechanism = mechanisms.createMechanismDefinition({
    id: 'counter', initialize: () => ({ count: 0 }),
    onTick(state, self) {
        return mechanisms.setState(state, mechanisms.ref(self), { count: self.state.count + 1 });
    },
});
const predefined = createPredefinedDefinition({
    id: 0, alias: null, initiallyPresent: true,
    creation: { type: 'UNIT', definition: patient.definition, position: [0, 0] },
});
const occupiedPredefined = createPredefinedDefinition({
    id: 2, alias: null, initiallyPresent: true,
    creation: { type: 'UNIT', ...occupiedInput },
});
const incompletePredefined = {
    id: 3, alias: null, initiallyPresent: true,
    creation: { type: 'UNIT' as const, ...missingInitial },
};
// @ts-expect-error predefined forwarding retains required capability input.
createPredefinedDefinition(incompletePredefined);
const account = { initialDp: 0, maxDp: 99, dpRecoveryTicks: null, slotLimit: null };
runtime.initialize({ ...baseInput,
    deployment: { definition: account, cards: [counterCard] },
    initialMechanisms: [{ definition: counterMechanism }],
    predefines: [predefined, occupiedPredefined, createPredefinedDefinition({
        id: 1, alias: null, initiallyPresent: true,
        creation: { type: 'MECHANISM', definition: counterMechanism },
    })],
});
const mismatchedMechanism = { ...counterMechanism, initialize: () => ({ label: 'wrong' }) };
// @ts-expect-error predefined construction cannot erase a mismatch rejected by ordinary creation.
createPredefinedDefinition({ id: 0, alias: null, initiallyPresent: true, creation: { type: 'MECHANISM', definition: mismatchedMechanism } });
const mismatchedCard = { ...counterCard, card: { ...counterCard.card, initialize: (state: State) => ({ state, value: { label: 'wrong' } }) } };
// @ts-expect-error aggregating a Card cannot weaken initialize/callback pairing.
runtime.initialize({ ...baseInput, deployment: { definition: account, cards: [mismatchedCard] }, initialMechanisms: [], predefines: [] });
const missingOccupancy = { id: 0, alias: null, initiallyPresent: true, creation: { type: 'UNIT' as const, definition: bare.definition, position: [0, 0] as const, initial: { occupancy: { tile: [0, 0] as const } } } };
// @ts-expect-error ordinary Unit construction cannot initialize an undeclared capability.
initialize(battle, { id: 4, ...missingOccupancy.creation });
// @ts-expect-error a predefined Unit cannot initialize an undeclared capability.
createPredefinedDefinition(missingOccupancy);
// @ts-expect-error raw Runtime input obeys the same construction constraint.
runtime.initialize({ ...baseInput, deployment: { definition: account, cards: [] }, initialMechanisms: [], predefines: [missingOccupancy] });
// @ts-expect-error raw Runtime input cannot erase required capability input either.
runtime.initialize({ ...baseInput, deployment: { definition: account, cards: [] }, initialMechanisms: [], predefines: [incompletePredefined] });
runtime.initialize({ ...baseInput, initialMechanisms: [], predefines: [], deployment: { definition: account, cards: [{ ...counterCard, card: { ...counterCard.card,
    onTick(state, self) {
        // @ts-expect-error aggregation must not supply an any private-state context.
        self.state.missing.deeply;
        return state;
    },
} }] } });
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
