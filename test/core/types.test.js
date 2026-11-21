// Contract: [api-conventions](../../docs/architecture/api-conventions.md#统一-typed-ref-与类型恢复).
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
import { initialize, ref, get, all as allUnits, compose, optional, setHook as setUnitHook, removeHook as removeUnitHook, type Unit, type Input as UnitInput, type Change } from ${module("unit/index")};
import { removing as unitRemoving } from ${module("unit/hook")};
import { update, remove as removeUnit } from ${module("unit/operations")};
import * as actions from ${module("unit/capability/action/index")};
import * as effects from ${module("unit/effect/index")};
import * as hpDamage from ${module("battle/resource/hp/damage/index")};
import * as resource from ${module("battle/resource/index")};
import { createWithState as createAttackWithState, type Operation as AttackOperation } from ${module("../content/actions/attack")};
import * as vitality from ${module("unit/capability/vitality/index")};
import * as elemental from ${module("unit/capability/elemental/index")};
import * as facing from ${module("unit/capability/facing/index")};
import * as skills from ${module("unit/capability/skill/index")};
import { hasSkill, spRecovered, type SkillCapability, type RecoveryRestriction } from ${module("unit/capability/skill/index")};
import { hasPresence, disappear } from ${module("unit/capability/presence/index")};
import { dispatch as dispatchElemental } from ${module("unit/capability/elemental/hook")};
import * as runtime from ${module("battle/runtime")};
import type { Input as BattleInput, Command } from ${module("battle/contract")};
import type { SkillCommand } from ${module("battle/index")};
import type { UnitDefinition as CardDefinition } from ${module("battle/deployment/card/card")};
import * as cards from ${module("battle/deployment/card/index")};
import * as projectiles from ${module("projectile/index")};
import type { Definition as ProjectileDefinition, Projectile, Slowable } from ${module("projectile/index")};
import * as tracking from ${module("../content/projectiles/tracking")};
import type { Point as PullPoint } from ${module("unit/capability/shifting/pull")};
import { reassign, selectContext, setTicking, type Plan, type Route } from ${module("unit/capability/route/index")};
import * as mechanisms from ${module("mechanism/index")};
import { createPredefinedDefinition } from ${module("battle/predefined")};
import { createRegistrationOperations } from ${module("unit/registration")};
import type { Offense } from ${module("unit/capability/offense/index")};
import { setAttackContribution, resolveAttack } from ${module("unit/capability/offense/index")};
import type { Blocker, Blockable, Relation, Hook as BlockingHook } from ${module("unit/capability/blocking/index")};
import * as blocking from ${module("battle/blocking/index")};
import * as targeting from ${module("battle/targeting/index")};
import * as classification from ${module("unit/capability/classification/index")};
import { hasTargetable } from ${module("unit/capability/targetable/capability")};
import { topK } from ${module("common/collection/order")};
import type { Spawn } from ${module("battle/schedule/index")};
declare const battle: State;
const attribute = (value: number, min: number | null = 0, max: number | null = null) => ({ default: value, min, max });
const outputKey = key<Hook<{ amount: number }, number>>('output');
const textKey = key<Hook<{ text: string }, number>>('text');
const registered = Hooks.empty().set(outputKey, {
    id: 'output', priority: 5, invoke: (state, context, current) => ({ state, value: current + context.amount }),
});
registered.get(outputKey)[0]!.invoke(battle, { amount: 1 }, 0);
const prioritizedLifecycle: Change<Unit> = setUnitHook(unitRemoving, {
    id: 'before-cleanup', priority: 100,
    invoke: state => ({ state, value: undefined }),
});
const killedNotice: hpDamage.TargetKilledHook = {
    id: 'kill-reward',
    invoke(state, departure) {
        const reason: 'DEATH' = departure.reason;
        const victim: Unit = departure.unit;
        const killer: Ref<Unit> | null = departure.killer;
        return { state, value: undefined };
    },
};
const killedChange: Change<Unit> = setUnitHook(hpDamage.targetKilled, killedNotice);
// @ts-expect-error the death fact notification cannot replace its payload.
Hooks.empty().set(hpDamage.targetKilled, { id: 'rewrite-death', invoke: state => ({ state, value: 1 }) });
declare const departedUnit: Unit;
// @ts-expect-error the key always supplies a DEATH Departure.
const wrongDeathContext: hpDamage.TargetKilledContext = { reason: 'SCRIPT', unit: departedUnit };
// @ts-expect-error a key preserves its exact Hook type through storage.
const mismatchedKey: typeof outputKey = textKey;
// @ts-expect-error entries cannot widen the Hook type established by their key.
Hooks.empty().set(outputKey, { id: 'wrong', invoke: (state, context: { text: string }, current) => ({ state, value: current }) });
const receivingKey = hpDamage.receiving;
const forbiddenReasons: ReadonlySet<hpDamage.Reason> = new Set(['MISS', 'BLOCKED']);
const guardedReceiving: hpDamage.ReceivingHook = {
    id: 'evade', priority: 10, invoke: (state, context, current) => ({ state, value: hpDamage.cancel(current, 'MISS', context.forbidden) }),
};
const receivingHooks = Hooks.empty()
    .set(receivingKey, guardedReceiving)
    .set(hpDamage.beforeReceive, guardedReceiving);
const fixedReceiving: hpDamage.ReceivingHook = {
    id: 'fixed-amount',
    invoke: (state, _context, current) => ({ state, value: hpDamage.fix(current) }),
};
Hooks.empty().set(hpDamage.beforeReceive, fixedReceiving);
Hooks.empty().set(receivingKey, {
    id: 'reduce', invoke: (state, _context, current) => ({
        state, value: current.type === 'NORMAL' ? { ...current, amount: current.amount / 2 } : current,
    }),
});
setUnitHook(hpDamage.receiving, {
    id: 'conditional-receiving',
    invoke(state, context, current) {
        const target: Ref<Unit & vitality.Vitality> = context.request.target;
        if (current.type === 'CANCELLED' || current.amount <= 0) {
            return { state, value: current };
        }
        if (current.amount > 10) {
            return { state, value: hpDamage.cancel(current, 'BLOCKED', context.forbidden) };
        }
        if (current.type === 'FIXED') {
            return { state, value: current };
        }
        return { state, value: { ...current, amount: current.amount / 2 } };
    },
});
declare const receivingContext: hpDamage.ReceivingContext;
declare const damageOutcome: hpDamage.Outcome;
if (damageOutcome.type === 'APPLIED') {
    const killed: boolean = damageOutcome.killed;
    // @ts-expect-error the HP commit report does not predict the final kill result.
    damageOutcome.application.killed;
}
declare const appliedContext: hpDamage.AppliedContext;
// @ts-expect-error Applied executes before death confirmation.
appliedContext.killed;
declare const cancelled: hpDamage.Pending<'MISS', 'CANCELLED'>;
const selectedReason: 'MISS' = cancelled.reason;
const aggregateReason: 'MISS' = resource.hp.damage.cancel(cancelled, 'BLOCKED', forbiddenReasons).reason;
// @ts-expect-error the aggregate entry retains HP Damage's finite reason set.
resource.hp.damage.cancel(cancelled, 'OTHER', forbiddenReasons);
// @ts-expect-error shared receiving keeps EP's reason set narrower than HP's.
resource.ep.damage.cancel({ type: 'NORMAL', amount: 10 }, 'MISS', new Set<resource.ep.damage.Reason>());
Hooks.empty().set(resource.ep.healing.beforeReceive, {
    id: 'ep-healing',
    invoke: (state, _context, current) => ({ state, value: { ...current, amount: current.amount / 2 } }),
});
// @ts-expect-error EP Healing has no receiving key after admission.
resource.ep.healing.receiving;
const normalFixed: 'FIXED' = hpDamage.fix({ type: 'NORMAL', amount: 10 }).type;
const alreadyFixed: 'FIXED' = hpDamage.fix({ type: 'FIXED', amount: 10 }).type;
const fixedCancellation: 'MISS' = hpDamage.fix(cancelled).reason;
// @ts-expect-error cancel always requires an explicit forbidden set.
hpDamage.cancel(cancelled, 'BLOCKED');
const guardedNormal = hpDamage.cancel({ type: 'NORMAL', amount: 10 }, 'BLOCKED', forbiddenReasons);
const guardedNormalType: 'NORMAL' | 'CANCELLED' = guardedNormal.type;
if (guardedNormal.type === 'CANCELLED') {
    const guardedNormalReason: 'BLOCKED' = guardedNormal.reason;
}
const guardedFixed = hpDamage.cancel({ type: 'FIXED', amount: 10 }, 'BLOCKED', forbiddenReasons);
const guardedFixedType: 'FIXED' | 'CANCELLED' = guardedFixed.type;
if (guardedFixed.type === 'CANCELLED') {
    const guardedFixedReason: 'BLOCKED' = guardedFixed.reason;
}
const guardedOriginalReason: 'MISS' = hpDamage.cancel(cancelled, 'BLOCKED', forbiddenReasons).reason;
// @ts-expect-error forbidden reasons belong to this domain's finite Reason set.
hpDamage.cancel({ type: 'NORMAL', amount: 10 }, 'BLOCKED', new Set(['OTHER']));
declare const normalOrCancelled: hpDamage.Pending<'MISS', 'NORMAL' | 'CANCELLED'>;
const fixedUnion = hpDamage.fix(normalOrCancelled);
if (fixedUnion.type === 'CANCELLED') {
    const unionReason: 'MISS' = fixedUnion.reason;
}
const cancelledUnion = hpDamage.cancel(normalOrCancelled, 'BLOCKED', forbiddenReasons);
const cancelledUnionType: 'NORMAL' | 'CANCELLED' = cancelledUnion.type;
if (cancelledUnion.type === 'CANCELLED') {
    const cancelledUnionReason: 'MISS' | 'BLOCKED' = cancelledUnion.reason;
}
const reception = receivingHooks.get(receivingKey)[0]!.invoke(battle, receivingContext, cancelled);
const cancelledType: 'CANCELLED' = reception.value.type;
const preservedReason: 'MISS' = reception.value.reason;
const beforeReception = receivingHooks.get(hpDamage.beforeReceive)[0]!.invoke(battle, receivingContext, cancelled);
const beforeReason: 'MISS' = beforeReception.value.reason;
// @ts-expect-error the Hook interface itself rejects restoration, independently of storage.
const invalidDirect: hpDamage.ReceivingHook = { id: 'invalid-direct', invoke: (state, _context, current) => ({ state, value: { ...current, type: 'NORMAL' as const } }) };
// @ts-expect-error fixed work cannot become NORMAL, including through erased Hook storage.
Hooks.empty().set(hpDamage.beforeReceive, { id: 'unfix', invoke: (state, _context, current) => ({ state, value: { ...current, type: 'NORMAL' as const } }) });
// @ts-expect-error cancelled work cannot resume even as FIXED.
Hooks.empty().set(receivingKey, { id: 'revive', invoke: (state, _context, current) => ({ state, value: { ...current, type: 'FIXED' as const } }) });
// @ts-expect-error cancellation retains its original reason even when the replacement is a valid Reason.
Hooks.empty().set(hpDamage.beforeReceive, { id: 'rewrite-reason', invoke: (state, _context, current) => ({ state, value: current.type === 'CANCELLED' ? { ...current, reason: 'BLOCKED' as const } : current }) });
// @ts-expect-error fixing a rewritten state cannot hide an illegal restoration.
Hooks.empty().set(receivingKey, { id: 'restore-then-fix', invoke: (state, _context, current) => ({ state, value: hpDamage.fix({ ...current, type: 'NORMAL' as const }) }) });
// @ts-expect-error cancelling again cannot hide replacement of an existing reason.
Hooks.empty().set(receivingKey, { id: 'rewrite-then-cancel', invoke: (state, context, current) => ({ state, value: current.type === 'CANCELLED' ? hpDamage.cancel({ ...current, reason: 'BLOCKED' as const }, 'MISS', context.forbidden) : current }) });
const program: actions.Definition<{ uses: number }, { hits: number }> = {
    id: 'attack', applyWay: 'NONE', period: { type: 'FIXED', ticks: 10 },
    initialize: state => ({ state, value: { uses: 0 } }),
    prepare: state => ({ state, value: { hits: 1 } }),
    onTick: (state, source, self) => actions.finish(state, actions.executionRef(source, self)),
};
const timedAttack = createAttackWithState<{ uses: number }, { hits: number }>({
    id: 'typed-timing', period: { type: 'ATTACK_SPEED' }, triggerBindingId: 'primary',
    initialize: state => ({ state, value: { uses: 0 } }),
    prepare: state => ({ state, value: { hits: 1 } }),
    timing(_battle, _source, self) {
        const uses: number = self.state.uses;
        // @ts-expect-error timing evaluation preserves the persistent private state type.
        self.state.unknown;
        if (self.execution !== null) {
            const hits: number = self.execution.state.data.hits;
            // @ts-expect-error timing evaluation also preserves the execution's private data.
            self.execution.state.data.unknown;
        }
        return { type: 'FIXED', windupTicks: uses, recoveryTicks: 0 };
    },
    targetGroups: [{ id: 'primary', select: state => ({ state, value: [] }), operations: [] }],
});
const timedAttackInput = {
    ...timedAttack.attack,
    initialize: (state: typeof battle) => ({ state, value: { uses: 0 } }),
    prepare: (state: typeof battle) => ({ state, value: { hits: 1 } }),
};
// @ts-expect-error declarative attacks derive their apply way from operations.
createAttackWithState({ ...timedAttackInput, applyWay: 'RANGED' });
// @ts-expect-error custom output declares its apply way explicitly.
createAttackWithState({ ...timedAttackInput, output: state => state });
const host = initialize(battle, { position: [0, 0], definition: {
    id: 'armed', hooks: Hooks.empty(), offense: { attack: attribute(100) }, layer: { type: 'GROUND' },
    action: {
        speed: attribute(100, 20), interval: attribute(10),
        definitions: [program],
    },
} }).value;
const reference = ref(host);
removeUnit(battle, reference, { reason: 'SCRIPT' });
removeUnit(battle, reference, { reason: 'DEATH', killer: null });
// @ts-expect-error every death explicitly declares its attribution.
removeUnit(battle, reference, { reason: 'DEATH' });
// @ts-expect-error other departure reasons do not carry death attribution.
removeUnit(battle, reference, { reason: 'SCRIPT', killer: null });
const currentAction = host.action.actions.get(program.id, program)!;
const currentPeriod: number = actions.resolvePeriod(host, currentAction.definition);
actions.setSpeedContribution({ id: 'fixed-speed', value: [] });
const dynamicModifiers = (_state: State, _self: Unit & actions.ActionCapability) => [];
// @ts-expect-error Action time contributions publish fixed values through a Change.
actions.setSpeedContribution({ id: 'dynamic-speed', value: dynamicModifiers });
const persistent = actions.ref(reference, program);
const uses: number = actions.getAction(battle, persistent)!.state.uses;
actions.setState(battle, persistent, { uses: uses + 1 });
const started = actions.start(battle, persistent);
if (started.value !== null) {
    const execution = started.value;
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
const shield = {
    id: 'shield', initialize: () => ({ charges: 1 }),
    onTick(state, self) {
        const attack: number = get(state, self.host)!.definition.offense.attack.default;
        return effects.setState(state, effects.ref(self), { charges: self.state.charges + attack });
    },
} satisfies effects.OrdinaryDefinition<{ charges: number }, Offense>;
const installed = effects.install(battle, reference, shield);
if (installed.value !== null) {
    const charges: number = effects.get(installed.state, installed.value)!.state.charges;
    effects.setExpiration(installed.state, installed.value, { type: 'DEADLINE', tick: 10 });
    // @ts-expect-error writes cannot widen the identity's private data pairing.
    effects.setState(installed.state, installed.value, { charges: 'wrong' });
    // @ts-expect-error ordinary instances cannot be used for stack consumption.
    effects.decreaseStack(installed.state, installed.value, 1);
}
const layered = {
    id: 'layered',
    group: {
        type: 'STACK', id: 'layered', priority: 0, independentSource: false,
        maxCount: 3, maxEffectiveCount: 2, refreshAtMax: true, expirationPolicy: 'DECAY',
    },
    initialize: () => ({ power: 1 }),
    onTick(state, self, previous) {
        const power: number = self.state.power;
        const layerHost: Ref<Unit & Offense> = self.host;
        const time: effects.DecayExpiration = previous;
        // @ts-expect-error the callback's history excludes a DEADLINE.
        const deadline: Extract<effects.Expiration, { type: 'DEADLINE' }> = previous;
        return state;
    },
    onStackChange(state, self, previous) {
        const count: number = self.stackCount;
        const old: number = previous;
        return effects.setState(state, effects.ref(self), { power: self.state.power + 1 });
    },
} satisfies effects.StackDefinition<{ power: number }, Offense, 'DECAY'>;
const merged = effects.install(battle, reference, layered);
// @ts-expect-error a DECAY Definition cannot use DEADLINE through another overload.
effects.install(battle, reference, layered, { expiration: { type: 'DEADLINE', tick: 10 } });
if (merged.value !== null) {
    effects.decreaseStack(merged.state, merged.value, 1);
    effects.setExpiration(merged.state, merged.value, { type: 'INFINITE' });
    // @ts-expect-error a merged Ref preserves its DECAY policy.
    effects.setExpiration(merged.state, merged.value, { type: 'DEADLINE', tick: 10 });
    // @ts-expect-error the incoming private state does not prove the retained instance's state.
    effects.get(merged.state, merged.value)!.state.power;
    const known = get(merged.state, reference)!.effects.get(merged.value.id, layered)!;
    const power: number = known.state.power;
    const knownRef = effects.ref(known);
    // @ts-expect-error Definition identity restoration also preserves the time constraint.
    effects.setExpiration(merged.state, knownRef, { type: 'DEADLINE', tick: 10 });
}
declare const privateEffect: effects.Effect<{ power: number }, Offense>;
if (effects.hasStack(privateEffect)) {
    const power: number = privateEffect.state.power;
    const layerHost: Ref<Unit & Offense> = privateEffect.host;
    const count: number = privateEffect.stackCount;
}
declare const burstRef: Ref<elemental.Burst>;
const burst = elemental.get(battle, burstRef)!;
effects.setExpiration(battle, burstRef, { ...burst.expiration, remaining: burst.expiration.remaining - 1 });
// @ts-expect-error writes retain the Burst identity's duration contract.
effects.setExpiration(battle, burstRef, { type: 'DEADLINE', tick: 10 });
const bare = initialize(battle, { position: [0, 0], definition: { id: 'bare', hooks: Hooks.empty() } }).value;
// @ts-expect-error Unit instance identity is assigned by the initializer.
initialize(battle, { id: 1, position: [0, 0], definition: bare.definition });
update(battle, ref(bare), killedChange);
const classifiedDefinition = {
    id: 'classified', hooks: Hooks.empty(),
    classification: { type: 'DEVICE' as const, side: 'ALLY' as const, filterTags: [], groupTags: [] },
};
const classified = initialize(battle, { position: [0, 0], definition: classifiedDefinition }).value;
const classifiedCapability: classification.Classification<'DEVICE'> = classified;
const initializedClassification: classification.State = classified.classification;
const staticClassification: classification.Definition = classified.definition.classification;
// @ts-expect-error an unselected Classification does not appear in the Catalog product.
bare.classification;
// @ts-expect-error classification queries require a Classification-capable Unit.
classification.hasFilterTag(bare, 'sarkaz');
for (const side of ['ALLY', 'ENEMY', 'NEUTRAL'] as const) {
    const common = { side };
    const categoryDefinitions: readonly classification.Definition[] = [
        { ...common, type: 'DEVICE', filterTags: [], groupTags: ['rhodes'] },
        { ...common, type: 'OPERATOR', groupTags: ['rhodes'], profession: 'SPECIAL', subProfession: 'EXECUTOR', extraProfessions: [] },
        { ...common, type: 'SUMMON', groupTags: ['rhodes'], subProfession: 'EXECUTOR' },
        { ...common, type: 'SUMMON', groupTags: ['rhodes'], subProfession: null },
        { ...common, type: 'ENEMY', filterTags: ['sarkaz'], rank: 'ELITE' },
    ];
}
const commonClassification = { side: 'ALLY' as const };
// @ts-expect-error an operator requires its associated profession facts together.
const missingProfessionFacts: classification.Definition = { ...commonClassification, type: 'OPERATOR', groupTags: [] };
// @ts-expect-error an enemy requires its associated rank.
const missingRank: classification.Definition = { ...commonClassification, type: 'ENEMY', filterTags: [] };
// @ts-expect-error a profession only accepts its own sub-professions.
const wrongProfessionPair: classification.Definition = { ...commonClassification, type: 'OPERATOR', groupTags: [], profession: 'CASTER', subProfession: 'EXECUTOR', extraProfessions: [] };
// @ts-expect-error summon classification does not carry an operator profession.
const wrongSummonFields: classification.Definition = { ...commonClassification, type: 'SUMMON', groupTags: [], subProfession: 'EXECUTOR', profession: 'SPECIAL' };
// @ts-expect-error operators carry group tags rather than enemy filter tags.
const wrongOperatorTags: classification.Definition = { ...commonClassification, type: 'OPERATOR', groupTags: [], profession: 'SPECIAL', subProfession: 'EXECUTOR', extraProfessions: [], filterTags: [] };
// @ts-expect-error enemy classification does not carry group tags.
const wrongEnemyTags: classification.Definition = { ...commonClassification, type: 'ENEMY', rank: 'ELITE', filterTags: [], groupTags: [] };
// @ts-expect-error summons are a category rather than one of the eight professions.
const summonProfession: classification.Profession = 'TOKEN';
// @ts-expect-error original lowercase data identifiers are converted before Core construction.
const rawSubProfession: classification.SubProfession = 'executor';
// @ts-expect-error narrowing to one category rejects a different category's definition.
const mismatchedClassification: classification.Classification<'ENEMY'> = classified;

const receivingChange: Change<Unit & vitality.Vitality> = setUnitHook(hpDamage.receiving, receivingHooks.get(receivingKey)[0]!);
// @ts-expect-error receiving keys retain their Vitality owner requirement through Change.
update(battle, ref(bare), receivingChange);
// @ts-expect-error removal carries the same owner requirement as registration.
update(battle, ref(bare), removeUnitHook(hpDamage.receiving, 'evade'));
const facingDefinition = { ...bare.definition, facing: { restrictions: [] }, offense: { attack: attribute(10) } };
const facingHost = initialize(battle, {
    definition: facingDefinition, position: [0, 0], initial: { facing: { direction: 'LEFT' } },
}).value;
const facingAttack: number = facingHost.definition.offense.attack.default;
facing.turn(battle, ref(facingHost), 'RIGHT');
const facingChange: Change<Unit & facing.Facing> = facing.setRestriction({
    id: 'fixed', value: { allows: (_battle, { self, direction }) => self.facing.direction === direction },
});
const facingProduct: typeof facingHost = facingChange(facingHost).next;
// @ts-expect-error Facing construction requires the instance direction.
initialize(battle, { definition: facingDefinition, position: [0, 0] });
// @ts-expect-error facing operations require a Facing-capable Unit.
facing.turn(battle, ref(bare), 'LEFT');
const occupiedDefinition = { ...bare.definition, occupancy: { slot: 'OCCUPANT' as const } };
const occupiedInput: UnitInput<typeof occupiedDefinition> = {
    definition: occupiedDefinition, position: [0, 0],
    initial: { occupancy: { tile: [0, 0] } },
};
const occupied = initialize(battle, occupiedInput).value;
const occupiedTile: readonly [number, number] = occupied.occupancy.tile;
const { initial: occupiedInitial, ...missingInitial } = occupiedInput;
// @ts-expect-error required capability input cannot be omitted at the Unit entry point.
initialize(battle, missingInitial);
// @ts-expect-error Occupancy requires a structural tile, independently of optional direction.
initialize(battle, { ...occupiedInput, initial: { occupancy: { direction: 'RIGHT' } } });
declare const plan: Plan;
const routedDefinition = { id: 'routed', hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true } };
const routedInput: UnitInput<typeof routedDefinition> = {
    definition: routedDefinition, position: [0, 0],
    initial: { route: { plan, offset: [0, 0] } },
};
initialize(battle, routedInput);
const unusedRoute = initialize(battle, { ...routedInput, definition: bare.definition }).value;
// @ts-expect-error unused initialization input does not establish a capability.
unusedRoute.route;
// @ts-expect-error known input values remain checked even when the capability is absent.
initialize(battle, { ...routedInput, definition: bare.definition, initial: { route: { plan, offset: 'wrong' } } });
// @ts-expect-error an unknown initialization key is rejected alongside a valid one.
initialize(battle, { ...routedInput, initial: { ...routedInput.initial, rouet: routedInput.initial.route } });
// @ts-expect-error Route construction requires the instance Plan and offset.
initialize(battle, { definition: routedDefinition, position: [0, 0] });
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
const skillCommand: SkillCommand = { type: 'SKILL', ref: skillCommandRef, operation: 'ACTIVATE' };
runtime.step(battle, [skillCommand]);
// @ts-expect-error skill commands require a Skill-capable Unit.
const missingSkillCommand: Command = { type: 'SKILL', ref: ref(bare), operation: 'STOP' };
// @ts-expect-error a Unit reference is not a Projectile reference.
projectiles.remove(battle, ref(bare), 'EXPLICIT');
const projectileDefinition: ProjectileDefinition<{ hits: number }> = {
    id: 'projectile',
    onTick(state, self) {
        const hits: number = self.state.hits;
        return projectiles.update(state, projectiles.ref(self), { state: { hits: hits + 1 } });
    },
};
const createdProjectile = projectiles.initialize(battle, {
    definition: projectileDefinition, side: 'ALLY', position: [0, 0], state: { hits: 0 },
});
// @ts-expect-error an ordinary Definition does not select movement contributions.
projectiles.initialize(battle, { definition: projectileDefinition, side: 'ALLY', position: [0, 0], state: { hits: 0 }, move: { contributions: [] } });
// @ts-expect-error construction uses the private state type declared by the Definition.
projectiles.initialize(battle, { definition: projectileDefinition, side: 'ALLY', position: [0, 0], state: { hits: 'wrong' } });
const projectileBattle = projectiles.add(createdProjectile.state, createdProjectile.value);
const projectileRef = projectiles.ref(createdProjectile.value);
const projectileHits: number = projectiles.get(projectileBattle, projectileRef)!.state.hits;
// @ts-expect-error removing a Projectile requires an explicit reason.
projectiles.remove(projectileBattle, projectileRef);
// @ts-expect-error a Projectile Ref fixes the private state accepted by writes.
projectiles.update(projectileBattle, projectileRef, { state: { hits: 'wrong' } });
// @ts-expect-error a Projectile Ref without eligibility cannot request elimination.
projectiles.remove(projectileBattle, projectileRef, 'ELIMINATED');
// @ts-expect-error an ordinary Projectile Ref cannot receive speed contributions.
projectiles.setMoveContribution(projectileBattle, projectileRef, { id: 'slow', value: 0.05 });
for (const target of projectiles.all(projectileBattle).filter(projectiles.hasEliminatable)) {
    projectiles.remove(projectileBattle, projectiles.ref(target), 'ELIMINATED');
}
const slowableDefinition: ProjectileDefinition<{ hits: number }, Slowable> = {
    id: 'slowable-projectile',
    onTick(state, self) {
        const scale: number = projectiles.resolveMoveScale(self);
        return projectiles.update(state, projectiles.ref(self), { position: [scale, 0], state: { hits: self.state.hits + 1 } });
    },
};
const slowableInput = { definition: slowableDefinition, side: 'ENEMY', position: [0, 0], state: { hits: 0 } } as const;
// @ts-expect-error creation supplies the instance fields used by the paired Definition.
projectiles.initialize(battle, slowableInput);
declare const incompleteProjectile: Projectile<{ hits: number }, Slowable>;
// @ts-expect-error registration requires the assembled instance that onEnter receives.
projectiles.add(battle, incompleteProjectile);
const createdSlowable = projectiles.initialize(battle, {
    ...slowableInput, definition: { ...slowableDefinition, eliminatable: true }, move: { contributions: [] },
});
const slowableBattle = projectiles.add(createdSlowable.state, createdSlowable.value);
const slowableProjectileRef = projectiles.ref(createdSlowable.value);
const restoredRef = projectiles.ref(projectiles.get(slowableBattle, slowableProjectileRef)!);
projectiles.setMoveContribution(slowableBattle, restoredRef, { id: 'slow', value: 0.05 });
projectiles.remove(slowableBattle, restoredRef, 'ELIMINATED');
declare const trackedProjectile: Projectile<tracking.State, Slowable> & Slowable;
tracking.hit(battle, trackedProjectile, (next, self) => {
    projectiles.resolveMoveScale(self);
    return next;
});
tracking.advance(battle, trackedProjectile, 1, (next, self) => {
    projectiles.resolveMoveScale(self);
    return next;
});
const pullPoint: PullPoint = { type: 'PROJECTILE', projectile: slowableProjectileRef };
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
actions.hasExecution(battle, reference);
// @ts-expect-error cancelling a Unit's Actions requires its Action capability.
actions.cancelForUnit(battle, ref(bare), 'SOURCE_ABSENT');
// @ts-expect-error the host has not established the required capability.
effects.install(battle, ref(bare), shield);
const change: Change<Unit & Offense> = setAttackContribution({ id: 'bonus', value: [] });
const actionChange = actions.setRestriction({ id: 'ready', value: { allows: () => true } });
const optionalAction: Change<Unit> = optional(actions.hasAction, actionChange);
const optionalPresence: Change<Unit> = optional(hasPresence, disappear());
update(battle, ref(bare), optionalAction);
const optionalResult = optionalAction(host);
const optionalHost: typeof host = optionalResult.next;
const optionalLayer: 'GROUND' | 'AIR' = optionalResult.next.layer.type;
const combined = compose(change, actionChange);
const intersection: Change<Unit & Offense & actions.ActionCapability> = combined;
const applied = combined(host);
const completeHost: typeof host = applied.next;
const extraLayer: 'GROUND' | 'AIR' = applied.next.layer.type;
update(battle, reference, combined);
declare const offenseOnly: Ref<Unit & Offense>;
declare const actionOnly: Ref<Unit & actions.ActionCapability>;
// @ts-expect-error the composed Action requirement cannot be supplied by an Offense-only Ref.
update(battle, offenseOnly, combined);
// @ts-expect-error the composed Offense requirement cannot be supplied by an Action-only Ref.
update(battle, actionOnly, combined);
declare const skillChange: Change<Unit & SkillCapability>;
// @ts-expect-error an Action guard does not establish Skill.
optional(actions.hasAction, skillChange);
// @ts-expect-error requiring Skill cannot be weakened into requiring only Action.
const wrongRequirement: Change<Unit & actions.ActionCapability> = skillChange;
const general: Change<Unit> = self => ({ next: self, settlements: [] });
const usableWithAction: Change<Unit & actions.ActionCapability> = general;
const attack: number = resolveAttack(battle, host);
// @ts-expect-error value computation requires the relevant capability.
resolveAttack(battle, bare);
// @ts-expect-error life queries require the Vitality capability.
vitality.isAlive(bare);
// @ts-expect-error HP proportions require the Vitality capability.
vitality.hpRatio(bare);
declare const skillHost: Unit & SkillCapability;
const controlledActivation: skills.ActivationDefinition<{ completed: number }, { remaining: number }> = {
    trigger: 'MANUAL', ignoreRestrictions: [], requirement: 0, cost: 0,
    initialize(_battle, _source, self) {
        const duration: skills.DurationDefinition = self.state.completed === 0
            ? { type: 'TIME', durationTicks: 30 }
            : { type: 'INFINITE' };
        const initial: skills.ActivationInitial<{ remaining: number }> = {
            state: { remaining: 3 }, duration,
        };
        return initial;
    },
    operations: {
        STOP(state, source, self) {
            const completed: number = self.state.completed;
            const reference = skills.activationRef(source, self);
            // @ts-expect-error operation handlers retain the activation's private state type.
            skills.setActivationState(state, reference, { completed: 1 });
            return skills.finish(state, reference);
        },
    },
};
// @ts-expect-error an activation must declare its payment, including zero.
const missingPayment: skills.ActivationDefinition<object, object> = {
    trigger: 'MANUAL', ignoreRestrictions: [], requirement: 0, initialize: () => ({ state: {}, duration: { type: 'INFINITE' } }),
};
const invalidDynamicPayment: skills.ActivationDefinition<{ completed: number }, { remaining: number }> = {
    ...controlledActivation,
    // @ts-expect-error activation payment is a static amount.
    cost: () => 1,
};
const recoveryOnly: RecoveryRestriction = {
    allows: (_battle, context) => context.source === 'TIME',
};
const invalidActivationExemption: skills.ActivationDefinition<{ completed: number }, { remaining: number }> = {
    ...controlledActivation,
    // @ts-expect-error a recovery restriction requires facts not supplied by an activation check.
    ignoreRestrictions: [recoveryOnly],
};
const activationParameters: skills.ActivationParameters = { requirement: 0, cost: 0 };
const skillReference = skills.ref(ref(skillHost), skillHost.skill.definition);
skills.activate(battle, skillReference, activationParameters);
// @ts-expect-error a special activation must supply its requirement and payment together.
skills.activate(battle, skillReference, { requirement: 0 });
// @ts-expect-error a special activation must supply its requirement and payment together.
skills.activate(battle, skillReference, { cost: 0 });
// @ts-expect-error trigger is declared by the skill, not an activation call argument.
skills.activate(battle, skillReference, 'AUTO');
skills.pay(battle, ref(skillHost), 1);
// @ts-expect-error resource payment requires an explicit amount.
skills.pay(battle, ref(skillHost));
const prioritizedSpRecovery = setUnitHook(spRecovered, {
    id: 'resource-reaction', priority: 10,
    invoke: state => ({ state, value: undefined }),
});
update(battle, ref(skillHost), prioritizedSpRecovery);
// @ts-expect-error priority does not weaken a Skill Hook's host requirement.
update(battle, ref(bare), prioritizedSpRecovery);
// @ts-expect-error a Skill can legitimately have no SP resource.
skills.resolveRecoverySpeed(battle, skillHost);
if (skills.hasSp(skillHost)) {
    const speed: number = skills.resolveRecoverySpeed(battle, skillHost);
    const multiplier: number = skills.resolveRecoveryMultiplier(battle, skillHost);
}
const actionHost = allUnits(battle).find(actions.hasAction)!;
const foundAction: actions.ActionCapability = actionHost;
const ordinaryPredicate: (self: Unit) => boolean = self => self.id > 0;
// @ts-expect-error an ordinary predicate does not establish a capability proof.
allUnits(battle).filter(ordinaryPredicate).find(() => true)!.action;
for (const self of allUnits(battle).filter(actions.hasAction).filter(hasSkill).filter(skills.hasSp)) {
    const action: actions.ActionCapability = self;
    const speed: number = skills.resolveRecoverySpeed(battle, self);
}
const selectableActions = allUnits(battle).filter(actions.hasAction).filter(hasTargetable);
for (const self of allUnits(battle).filter(actions.hasAction).filter(classification.hasClassification)) {
    const preservedClassifiedAction: actions.ActionCapability = self;
    const establishedClassification: classification.Classification = self;
    if (classification.isType(self, 'OPERATOR')) {
        const preservedOperatorAction: actions.ActionCapability = self;
        const establishedOperator: classification.Classification<'OPERATOR'> = self;
        const profession: classification.Profession = self.definition.classification.profession;
        const groupTags: readonly string[] = self.definition.classification.groupTags;
    }
    if (classification.isType(self, 'OPERATOR') && classification.matchesProfession(self, ['CASTER'], true)) {
        const preservedProfessionAction: actions.ActionCapability = self;
        const establishedOperator: classification.Classification<'OPERATOR'> = self;
        const profession: classification.Profession = self.definition.classification.profession;
        // @ts-expect-error operator classification does not establish an enemy rank.
        self.definition.classification.rank;
    }
    if (classification.isType(self, 'SUMMON') && classification.matchesSubProfession(self, ['EXECUTOR'])) {
        const preservedSubProfessionAction: actions.ActionCapability = self;
        const establishedSummon: classification.Classification<'SUMMON'> = self;
        const subProfession: classification.SubProfession | null = self.definition.classification.subProfession;
        // @ts-expect-error a summon does not carry an operator profession.
        self.definition.classification.profession;
    }
    if (classification.isType(self, 'DEVICE') && classification.hasGroupTag(self, 'rhodes')) {
        const preservedGroupAction: actions.ActionCapability = self;
        const groupTags: readonly string[] = self.definition.classification.groupTags;
        const filterTags: readonly string[] = self.definition.classification.filterTags;
    }
    if (classification.isType(self, 'ENEMY') && classification.matchesRank(self, ['ELITE'])) {
        const preservedRankAction: actions.ActionCapability = self;
        const establishedEnemy: classification.Classification<'ENEMY'> = self;
        const rank: classification.Rank = self.definition.classification.rank;
        const filterTags: readonly string[] = self.definition.classification.filterTags;
        // @ts-expect-error rank matching does not establish operator profession facts.
        self.definition.classification.profession;
    }
}

declare const professionCandidate: (Unit & classification.Classification<'OPERATOR'>) | (Unit & classification.Classification<'SUMMON'>);
if (classification.matchesProfession(professionCandidate, ['CASTER'], true)) {
} else {
    // @ts-expect-error a failed profession match can still be a non-Caster operator.
    const incorrectlyExcludedOperator: Unit & classification.Classification<'SUMMON'> = professionCandidate;
}
declare const requestedCategory: classification.Type;
if (classification.isType(professionCandidate, requestedCategory)) {
} else {
    // @ts-expect-error comparing a dynamic category does not make the mismatch unreachable.
    const incorrectlyExcludedCandidate: never = professionCandidate;
}

declare const targetingSource: Unit & classification.Classification;
for (const qualify of [targeting.damage, targeting.healing]) {
    const candidates = selectableActions.filter(qualify(targetingSource)(battle));
    const nearestPatient = topK(candidates, 1, targeting.hpRatio)[0]!;
    const patientAlive: boolean = vitality.isAlive(nearestPatient);
    const patientHpRatio: number = vitality.hpRatio(nearestPatient);
    const preservedAction: actions.ActionCapability = nearestPatient;
    const establishedVitality: vitality.Vitality = nearestPatient;
    const establishedClassification: classification.Classification = nearestPatient;
}
for (const qualify of [targeting.elementDamage, targeting.elementHealing]) {
    for (const self of selectableActions.filter(qualify(targetingSource)(battle))) {
        const preservedAction: actions.ActionCapability = self;
        const establishedElemental: elemental.Elemental = self;
        const establishedClassification: classification.Classification = self;
    }
}
// @ts-expect-error standard target eligibility requires the source's Classification capability.
targeting.damage(host)(battle);
const patient = initialize(battle, { position: [0, 0], definition: {
    id: 'patient', hooks: Hooks.empty(),
    vitality: {
        maxHp: attribute(100, 1), defense: attribute(10), resistance: attribute(0, 0, 100),
        recoverySpeed: attribute(0), recoveryRatio: attribute(0, 0, 1),
    },
} }).value;
const patientRef = ref(patient);
const directRecovery: vitality.HealingApplication = vitality.increaseHp(battle, patientRef, 10).value;
// @ts-expect-error direct HP recovery requires Vitality on its target.
vitality.increaseHp(battle, ref(bare), 10);
const damageCommittingChange = setUnitHook(vitality.damageCommitting, {
    id: 'protect-health',
    invoke(state, context, health) {
        const target: Ref<Unit & vitality.Vitality> = context.request.target;
        const previous: vitality.Health = context.previous;
        const proposed: vitality.Health = health;
        return { state, value: { hp: Math.max(health.hp, 1), minusHp: Math.max(0, health.minusHp - 1) } };
    },
});
update(battle, patientRef, damageCommittingChange);
// @ts-expect-error damage committing hooks require Vitality on the host.
update(battle, ref(bare), damageCommittingChange);
// @ts-expect-error damage committing carries Health rather than a scalar HP.
Hooks.empty().set(vitality.damageCommitting, { id: 'number', invoke: state => ({ state, value: 1 }) });
const damageCommittedChange = setUnitHook(vitality.damageCommitted, {
    id: 'observe-health',
    invoke(state, context, current) {
        const request: hpDamage.Request = context.request;
        const application: vitality.DamageApplication = context.application;
        const after: vitality.Health = application.after;
        const notification: void = current;
        return { state, value: undefined };
    },
});
update(battle, patientRef, damageCommittedChange);
// @ts-expect-error committed notifications retain the Vitality owner requirement.
update(battle, ref(bare), damageCommittedChange);
// @ts-expect-error committed notifications cannot replace the already applied Health.
Hooks.empty().set(vitality.damageCommitted, { id: 'rewrite', invoke: state => ({ state, value: { hp: 1, minusHp: 0 } }) });
const classifiedRequest: hpDamage.Request = {
    source: null, killer: null, target: patientRef, nature: 'ENVIRONMENT', hitRecovery: true,
    attackType: 'NONE', applyWay: 'ALL',
    parameters: { type: 'TRUE', attack: { power: 10, multiplier: 1, addition: 0 } },
};
const { attackType: omittedAttackType, ...withoutAttackType } = classifiedRequest;
const { applyWay: omittedApplyWay, ...withoutApplyWay } = classifiedRequest;
const { killer: omittedKiller, ...withoutKiller } = classifiedRequest;
const independentAttribution: hpDamage.Request = { ...classifiedRequest, source: reference, killer: patientRef };
// @ts-expect-error HP damage declares attribution independently of its participating source.
const missingKiller: hpDamage.Request = withoutKiller;
// @ts-expect-error classification is explicit even when the request has no source.
const missingAttackType: hpDamage.Request = withoutAttackType;
// @ts-expect-error applyWay is independently required.
const missingApplyWay: hpDamage.Request = withoutApplyWay;
// @ts-expect-error classification is one value rather than an array of categories.
const multipleAttackTypes: hpDamage.Request = { ...classifiedRequest, attackType: ['NORMAL', 'SPLASH'] };
// @ts-expect-error a projectile does not introduce another ApplyWay value.
const unknownApplyWay: hpDamage.Request = { ...classifiedRequest, applyWay: 'PROJECTILE' };
const elementalOperation: AttackOperation = {
    type: 'ELEMENTAL_INJURY', power: 10, elementType: 'NEURAL',
    attackType: 'ADDITION', applyWay: 'NONE',
};
// @ts-expect-error attack operations provide classification before constructing resource requests.
const unclassifiedOperation: AttackOperation = { type: 'DAMAGE', power: 10, damageType: 'TRUE' };
update(battle, patientRef, receivingChange);
update(battle, patientRef, vitality.setRestriction({
    id: 'damage-permission', value: { allows: (_state, context) => context.calculated.amount > 0 },
}));
const injuryType: elemental.Type = 'NEURAL';
elemental.setRestriction('damageRestrictions', {
    id: 'injury-permission', value: { allows: (_state, context) => context.type === 'NEURAL' },
});
declare const elementalRestriction: elemental.DamageRestriction;
declare const elementalRestrictionKey: 'damageRestrictions' | 'healingRestrictions';
// @ts-expect-error a Restriction cannot be registered against an unrelated field Context.
elemental.setRestriction('healingRestrictions', { id: 'damage-permission', value: elementalRestriction });
const fixedRestriction = createRegistrationOperations<
    Unit & elemental.Elemental, 'elemental', typeof elementalRestrictionKey
>('elemental', elementalRestrictionKey);
// @ts-expect-error fixing an uncertain field does not erase its Entry pairing.
fixedRestriction.set({ id: 'damage-permission', value: elementalRestriction });
vitality.setContribution('defense', {
    id: 'armor', value: (_state, self) => {
        const defense: number = self.definition.vitality.defense.default;
        return [];
    },
});
setUnitHook(hpDamage.receiving, {
    id: 'cancel',
    invoke: (state, context, pending) => {
        const amount: number = context.calculated.amount;
        // @ts-expect-error inline callbacks retain precise working values rather than any.
        const invalidAmount: string = pending.amount;
        return { state, value: hpDamage.cancel(pending, 'MISS', context.forbidden) };
    },
});
setUnitHook(actions.beforeRelease, {
    id: 'interrupt',
    invoke: (state, context) => {
        const source: Ref<Unit> = context.source;
        return { state, value: { type: 'INTERRUPT', recoveryTicks: 1 } };
    },
});
// @ts-expect-error automatic operations cannot write a special field.
vitality.setContribution('maxHp', { id: 'wrong', value: [] });
// @ts-expect-error a numeric address alone does not establish a Unit proof.
const forged: Ref<Unit> = { id: 0 };

declare const elementalHost: Ref<Unit & elemental.Elemental>;
declare const elementalDamage: elemental.Damaged;
dispatchElemental(battle, elementalHost, elemental.damaged, elementalDamage);
dispatchElemental(battle, elementalHost, elemental.burstStarted, burst);
// @ts-expect-error the typed notification key determines the exact payload.
dispatchElemental(battle, elementalHost, elemental.damaged, burst);

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
const initializedCard = cards.initialize(battle, { ...counterCard, marker: true as const });
const cardRef = cards.ref(initializedCard.value);
const cardBattle = cards.add(initializedCard.state, initializedCard.value);
// @ts-expect-error registration requires the state type declared by the Card Definition.
cards.add(initializedCard.state, { ...initializedCard.value, state: { count: 'wrong' } });
const registeredCard = cards.get(cardBattle, cardRef)!;
const cardMarker: true = registeredCard.definition.marker;
const cardCount: number = registeredCard.state.count;
cards.setState(cardBattle, cardRef, { count: cardCount + 1 });
// @ts-expect-error lookup through a Card Ref preserves its exact private state.
cards.setState(cardBattle, cards.ref(registeredCard), { label: 'wrong' });
const counterMechanism: mechanisms.Definition<{ count: number }> & { readonly tag: 'counter' } = {
    id: 'counter', tag: 'counter', initialize: () => ({ count: 0 }),
    onTick(state, self) {
        return mechanisms.setState(state, mechanisms.ref(self), { count: self.state.count + 1 });
    },
};
const initializedMechanism = mechanisms.initialize(battle, { definition: counterMechanism });
const mechanismRef = mechanisms.ref(initializedMechanism.value);
const mechanismBattle = mechanisms.add(initializedMechanism.state, initializedMechanism.value);
const exactMechanismTag: 'counter' = mechanisms.get(mechanismBattle, mechanismRef)!.definition.tag;
// @ts-expect-error the Ref preserves the private state type.
mechanisms.setState(mechanismBattle, mechanismRef, { count: 'wrong' });
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
const unusedOccupancy = { id: 0, alias: null, initiallyPresent: true, creation: { type: 'UNIT' as const, definition: bare.definition, position: [0, 0] as const, initial: { occupancy: { tile: [0, 0] as const } } } };
createPredefinedDefinition(unusedOccupancy);
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
