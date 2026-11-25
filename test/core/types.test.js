// Contract: [api-conventions](../../docs/architecture/api-conventions.md#统一-typed-ref-与类型恢复).
// Contract: [action](../../docs/architecture/action.md#3-definitionaction-与-execution).
// Contract: [deployment](../../docs/architecture/deployment.md#静态内容与-card).
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
import { end as endLifetime, type Lifetime } from ${module("lifetime/index")};
import { Hooks, key, type Hook } from ${module("hook")};
import { initialize, ref, all as allUnits, compose, optional, setHook, type Unit, type Input as UnitInput } from ${module("unit/index")};
import { update, remove } from ${module("unit/operations")};
import * as actions from ${module("unit/capability/action/index")};
import * as skills from ${module("unit/capability/skill/index")};
import * as effects from ${module("effect/index")};
import * as vitality from ${module("unit/capability/vitality/index")};
import * as elemental from ${module("unit/capability/elemental/index")};
import * as classification from ${module("unit/capability/classification/index")};
import * as targeting from ${module("battle/targeting/index")};
import * as resource from ${module("battle/resource/index")};
import type { Facing } from ${module("unit/capability/facing/index")};
import type { Layer } from ${module("unit/capability/layer/index")};
import type { Occupancy } from ${module("unit/capability/occupancy/index")};
import type { Plan } from ${module("unit/capability/route/index")};
import type { Spawn } from ${module("battle/schedule/index")};
import { hasTargetable } from ${module("unit/capability/targetable/capability")};
import { setAttackContribution, resolveAttack, type Offense } from ${module("unit/capability/offense/index")};
import { createWithState as attack, type StatefulDefinition } from ${module("../content/actions/attack")};
import * as runtime from ${module("battle/runtime")};
import type { Input as BattleInput } from ${module("battle/contract")};
import * as cards from ${module("battle/deployment/deck/card/index")};
import * as projectiles from ${module("projectile/index")};

declare const battle: State;
const attribute = (value: number) => ({ default: value, min: 0, max: null });
const bare = initialize(battle, {
    definition: { id: 'bare', hooks: Hooks.empty() }, position: [0, 0],
}).value;

// Host requirements are checked at assembly.
type Armed = Unit & Offense & Occupancy & Layer & Facing &
    actions.ActionCapability<Armed> & skills.SkillCapability<Armed>;
const strike: actions.Definition<{ uses: number }, { hits: number }, Armed> = {
    id: 'strike', applyWay: 'NONE', period: { type: 'FIXED', ticks: 10 },
    initialize: state => ({ state, value: { uses: 0 } }),
    prepare: (state, _source, self) => ({ state, value: { hits: self.state.uses + 1 } }),
    onTick(state, source, self, action) {
        const attack = resolveAttack(state, source.get(state)!);
        state = actions.setState(state, action, { uses: action.get(state)!.state.uses + 1 });
        return actions.setExecutionState(state, actions.executionRef(self), {
            hits: self.state.hits + attack,
        });
    },
};
const skill: skills.Definition<{ completed: number }, { remaining: number }, Armed> = {
    id: 'skill', sp: null, initialize: state => ({ state, value: { completed: 0 } }),
    activation: {
        trigger: 'MANUAL', ignoreRestrictions: [], requirement: 0, cost: 0,
        initialize(state, source, self) {
            const right = source.get(state)!.facing.direction === 'RIGHT';
            return {
                state: { remaining: self.state.completed + (right ? 1 : 0) },
                duration: { type: 'INFINITE' },
            };
        },
        operations: {
            STOP(state, source, self, skillRef) {
                state = skills.setState(state, skillRef, { completed: skillRef.get(state)!.state.completed + 1 });
                return skills.setActivationState(state, skills.activationRef(self), {
                    remaining: self.state.remaining - 1,
                });
            },
        },
    },
};
const armedDefinition = {
    id: 'armed', hooks: Hooks.empty(), offense: { attack: attribute(100) }, layer: { type: 'GROUND' },
    occupancy: { slot: 'OCCUPANT' }, facing: { restrictions: [] },
    action: { speed: attribute(100), interval: attribute(10), definitions: [strike] },
    skill: { definition: skill },
} satisfies Armed['definition'];
// @ts-expect-error this host definition cannot supply the Action's additional capabilities.
const wrongActionHost: actions.CapabilityDefinition<object>['definitions'] = [strike];
// @ts-expect-error this host definition cannot supply the Skill's additional capabilities.
const wrongSkillHost: skills.SkillCapability<object>['definition']['skill']['definition'] = skill;
const armedInput = {
    position: [0, 0], definition: armedDefinition,
    initial: { occupancy: { tile: [0, 0] }, facing: { direction: 'RIGHT' } },
} satisfies UnitInput<typeof armedDefinition>;
const armed: Armed = initialize(battle, armedInput).value;

// The selected definition determines Initial and the constructed abilities.
// @ts-expect-error an Occupancy Initial must provide the structural tile.
initialize(battle, { ...armedInput, initial: { ...armedInput.initial, occupancy: {} } });
declare const plan: Plan;
const routeDefinition = { id: 'route', hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true } };
const routeInput = {
    definition: routeDefinition, position: [0, 0], initial: { route: { plan, offset: [0, 0] } },
} satisfies UnitInput<typeof routeDefinition>;
const withUnusedInitial = initialize(battle, { ...routeInput, definition: bare.definition }).value;
// @ts-expect-error a known spare Initial does not create the associated capability.
withUnusedInitial.route;
// @ts-expect-error known spare values still follow the corresponding Initial type.
initialize(battle, { ...routeInput, definition: bare.definition, initial: { route: { plan, offset: 'wrong' } } });
declare const spawn: Spawn;
({ ...spawn, definition: routeDefinition }) satisfies Spawn;
// @ts-expect-error this entry supplies Route's Initial, but cannot supply Occupancy's.
({ ...spawn, definition: { ...routeDefinition, occupancy: armedDefinition.occupancy } }) satisfies Spawn;

// Capability proofs survive queries and Changes without being inferred from an ordinary filter.
const ordinary: (unit: Unit) => boolean = unit => unit.ref.id > 0;
// @ts-expect-error a boolean filter is not proof of a capability.
allUnits(battle).filter(ordinary).find(() => true)!.action;
// @ts-expect-error local queries require their declared capability.
vitality.isAlive(bare);
declare const targetingSource: Unit & classification.Classification;
const candidates = allUnits(battle).filter(actions.hasAction).filter(hasTargetable);
for (const patient of candidates.filter(targeting.healing(targetingSource)(battle))) {
    patient satisfies Unit & actions.ActionCapability & classification.Classification & vitality.Vitality;
}
for (const owner of candidates.filter(skills.hasSkill).filter(skills.hasSp)) {
    owner satisfies Unit & actions.ActionCapability;
    skills.resolveRecoverySpeed(battle, owner);
}
// @ts-expect-error selecting Skill alone does not prove that it has SP.
skills.resolveRecoverySpeed(battle, armed);
const actionRestriction = actions.setRestriction({ id: 'ready', value: { allows: () => true } });
const combined = compose(setAttackContribution({ id: 'bonus', value: [] }), actionRestriction);
combined(armed).next satisfies Armed;
update(battle, ref(armed), combined);
declare const offenseOnly: Ref<Unit & Offense>;
// @ts-expect-error composition must retain the requirements of both Changes.
update(battle, offenseOnly, combined);
const whenCapable = optional(actions.hasAction, actionRestriction);
update(battle, ref(bare), whenCapable);
whenCapable(armed).next satisfies Armed;
// @ts-expect-error the guard must establish the capability required by the conditional change.
optional(skills.hasSkill, actionRestriction);

declare const candidate: (Unit & actions.ActionCapability & classification.Classification<'OPERATOR' | 'SUMMON'>);
if (classification.isType(candidate, 'OPERATOR')) {
    candidate satisfies Unit & actions.ActionCapability & classification.Classification<'OPERATOR'>;
}
declare const category: classification.Type;
if (!classification.isType(candidate, category)) {
    // @ts-expect-error a failed comparison to a dynamic category cannot rule out all categories.
    candidate satisfies never;
}
declare const professionCandidate: Unit & (classification.Classification<'OPERATOR'> | classification.Classification<'SUMMON'>);
if (!classification.matchesProfession(professionCandidate, ['CASTER'], true)) {
    // @ts-expect-error another operator profession is still possible after a failed match.
    professionCandidate satisfies classification.Classification<'SUMMON'>;
}
// @ts-expect-error configured professions accept only their own sub-professions.
const wrongProfession: classification.Definition = { type: 'OPERATOR', side: 'ALLY', groupTags: [], profession: 'CASTER', subProfession: 'EXECUTOR', extraProfessions: [] };

// Typed identities distinguish persistent, execution and erased views.
const owner = ref(armed);
const actionRef = actions.ref(armed.action.actions.get(strike)!);
const started = actions.start(battle, actionRef);
if (started.value !== null) {
    const execution = started.value;
    const hits: number = execution.get(started.state)!.state.hits;
    actions.setExecutionState(started.state, execution, { hits: hits + 1 });
    // @ts-expect-error a write cannot infer a new private type for the current execution.
    actions.setExecutionState(started.state, execution, { hits: 'wrong' });
    // @ts-expect-error widening an execution type would weaken the private-write guarantee.
    const widened: Ref<actions.Execution> = execution;
    // @ts-expect-error an execution and its persistent action are different identities.
    const persistent: typeof actionRef = execution;
    runtime.step(started.state, [{ type: 'CANCEL_ACTION_EXECUTION', ref: execution }]);
}
const executionIdentity = actions.forUnit(battle, owner)[0]!;
const publicExecution = executionIdentity.get(battle)!;
publicExecution.state satisfies unknown;
// @ts-expect-error an erased query cannot read a private field.
publicExecution.state.hits;
// @ts-expect-error a round does not expose the persistent Action's Definition.
publicExecution.definition;
// @ts-expect-error a cancellation identity alone cannot write private state.
actions.setExecutionState(battle, executionIdentity, { hits: 1 });
// @ts-expect-error the numeric address does not carry a Unit identity proof.
const forged: Ref<Unit> = { id: 0 };
declare const exactSkill: skills.Skill<{ completed: number }, { remaining: number }>;
const skillRef = skills.ref(exactSkill);
const activated = skills.activate(battle, skillRef, { requirement: 0, cost: 0 });
if (activated.value !== null) {
    const active = activated.value.get(activated.state)!;
    active.state.remaining satisfies number;
    skillRef.get(activated.state)!.state.completed satisfies number;
    // @ts-expect-error an Activation Ref identifies one round rather than the persistent Skill.
    skills.activate(activated.state, activated.value);
}
// @ts-expect-error this call must specify both the gate and the payment.
skills.activate(battle, skillRef, { requirement: 0 });

// Definition shape controls policies that span multiple fields.
const attackInput = {
    id: 'timed', period: { type: 'FIXED', ticks: 1 } as const, triggerBindingId: 'primary',
    initialize: (state: State) => ({ state, value: { uses: 0 } }),
    prepare: (state: State) => ({ state, value: { hits: 0 } }),
    timing(_state, _source, self) {
        const hits = self.execution?.state.data.hits ?? 0;
        return { type: 'FIXED', windupTicks: self.state.uses + hits, recoveryTicks: 0 };
    },
    targetGroups: [{ id: 'primary', select: state => ({ state, value: [] }), operations: [] }],
} satisfies StatefulDefinition<{ uses: number }, { hits: number }, object>;
attack(attackInput);
// @ts-expect-error ordinary attack output derives applyWay from its operations.
attack({ ...attackInput, applyWay: 'RANGED' });
// @ts-expect-error a custom output must independently declare its applyWay.
attack({ ...attackInput, output: (state: State) => state });
// @ts-expect-error a synchronous cooldown Change accepts static contribution values.
actions.setSpeedContribution({ id: 'dynamic-speed', value: () => [] });
declare const recoveryOnly: skills.RecoveryRestriction;
// @ts-expect-error a recovery predicate cannot serve as an activation exemption.
({ ...skill.activation!, ignoreRestrictions: [recoveryOnly] }) satisfies NonNullable<typeof skill.activation>;

const layered = {
    id: 'layered',
    group: {
        type: 'STACK', id: 'layered', priority: 0, independentSource: false,
        maxCount: 3, maxEffectiveCount: 2, refreshAtMax: true, expirationPolicy: 'DECAY',
    },
    initialize: () => ({ power: 1 }),
    onTick(state, self, previous) {
        previous satisfies effects.Expiration<'DECAY'>;
        return effects.setState(state, effects.ref(self), { power: self.state.power + 1 });
    },
} satisfies effects.Definition<{ power: number }, Unit & Offense, 'DECAY'>;
// @ts-expect-error DECAY cannot be installed with an absolute deadline.
effects.install(battle, owner, layered, { expiration: { type: 'DEADLINE', tick: 10 } });
const merged = effects.install(battle, owner, layered);
if (merged.value !== null) {
    merged.value.host.get(merged.state)!.offense satisfies Offense['offense'];
    effects.decreaseStack(merged.state, merged.value, 1);
    // @ts-expect-error the returned DECAY reference must still reject deadlines on write.
    effects.setExpiration(merged.state, merged.value, { type: 'DEADLINE', tick: 10 });
    // @ts-expect-error a retained Effect may have arrived with a different private definition.
    merged.value.get(merged.state)!.state.power;
    const retained = effects.get(merged.state, merged.value, layered)!;
    retained.state.power satisfies number;
    endLifetime(merged.state, effects.ref(retained), 'CANCELLED');
}

const position = [0, 0] as const;
const slowable: projectiles.Definition<{ hits: number }, projectiles.Slowable> = {
    id: 'slowable',
    onTick(state, self) {
        const scale = projectiles.resolveMoveScale(self);
        return projectiles.update(state, projectiles.ref(self), {
            position: [scale, 0], state: { hits: self.state.hits + 1 },
        });
    },
};
const shot = { definition: slowable, side: 'ENEMY', position, state: { hits: 0 } } as const;
// @ts-expect-error the callback's instance trait must be assembled at creation.
projectiles.initialize(battle, shot);
const bullet = projectiles.initialize(battle, {
    ...shot, definition: { ...slowable, eliminatable: true }, move: { contributions: [] },
});
const fired = projectiles.add(bullet.state, bullet.value);
const restored = projectiles.ref(projectiles.ref(bullet.value).get(fired)!);
projectiles.remove(fired, restored, 'ELIMINATED');
const ordinaryProjectile = projectiles.initialize(battle, {
    ...shot, definition: { id: 'ordinary' } satisfies projectiles.Definition,
});
// @ts-expect-error the base entity does not declare a movement trait.
ordinaryProjectile.value.move;
// @ts-expect-error a plain reference gives no elimination eligibility.
projectiles.remove(battle, projectiles.ref(ordinaryProjectile.value), 'ELIMINATED');

// Hook keys preserve both the callback contract and its required unit.
const outputKey = key<Hook<{ amount: number }, number>>('output');
const registered = Hooks.empty().set(outputKey, {
    id: 'output', invoke: (state, context, current) => ({ state, value: current + context.amount }),
});
registered.get(outputKey)[0]!.invoke(battle, { amount: 1 }, 0) satisfies { state: State; value: number };
// @ts-expect-error the registration cannot widen the key's callback payload.
Hooks.empty().set(outputKey, { id: 'wrong', invoke: (state, context: { text: string }, current) => ({ state, value: current }) });
const guardHealth = setHook(vitality.damageCommitting, {
    id: 'keep-alive',
    invoke(state, _context, health) {
        return { state, value: { ...health, hp: Math.max(1, health.hp) } };
    },
});
// @ts-expect-error the key's owning capability remains required through Change.
update(battle, ref(bare), guardHealth);
// @ts-expect-error the post-commit key only notifies, so it cannot replace committed health.
Hooks.empty().set(vitality.damageCommitted, { id: 'rewrite', invoke: state => ({ state, value: { hp: 1, minusHp: 0 } }) });
declare const damageRestriction: elemental.DamageRestriction;
// @ts-expect-error a restriction from the damage context cannot be installed in the healing context.
elemental.setRestriction('healingRestrictions', { id: 'wrong-context', value: damageRestriction });

// Resource phases cannot skip the request facts or undo a one-way transition.
const damage = resource.hp.damage;
const receiving = Hooks.empty().set(damage.receiving, {
    id: 'evade', invoke: (state, context, current) => ({ state, value: damage.cancel(current, 'MISS', context.forbidden) }),
});
declare const receivingContext: resource.hp.damage.ReceivingContext;
declare const cancelled: resource.hp.damage.Pending<'MISS', 'CANCELLED'>;
receiving.get(damage.receiving)[0]!.invoke(battle, receivingContext, cancelled).value.reason satisfies 'MISS';
// @ts-expect-error a later receiver cannot restore a fixed value to NORMAL.
Hooks.empty().set(damage.beforeReceive, { id: 'unfix', invoke: (state, _context, current) => ({ state, value: { ...current, type: 'NORMAL' as const } }) });
// @ts-expect-error a later receiver cannot restore an already cancelled hit, even to FIXED.
Hooks.empty().set(damage.receiving, { id: 'revive', invoke: (state, _context, current) => ({ state, value: { ...current, type: 'FIXED' as const } }) });
// @ts-expect-error a later receiver cannot replace an established cancellation reason.
Hooks.empty().set(damage.receiving, { id: 'rewrite', invoke: (state, _context, current) => ({ state, value: current.type === 'CANCELLED' ? { ...current, reason: 'BLOCKED' as const } : current }) });
// @ts-expect-error the sender must explicitly supply this settlement's cancellation permissions.
damage.cancel(cancelled, 'BLOCKED');
// @ts-expect-error an HP dodge reason is outside EP's cancellation protocol.
resource.ep.damage.cancel({ type: 'NORMAL', amount: 10 }, 'MISS', new Set());
declare const request: resource.hp.damage.Request;
const { killer, ...damageWithoutAttribution } = request;
// @ts-expect-error attribution is explicit even if the output already has a source.
damageWithoutAttribution satisfies resource.hp.damage.Request;
const { applyWay, ...damageWithoutWay } = request;
// @ts-expect-error each damage request declares its way independently of its attack type.
damageWithoutWay satisfies resource.hp.damage.Request;
// @ts-expect-error explicit Unit death needs an attribution decision even without damage.
remove(battle, owner, { reason: 'DEATH' });
declare const result: resource.hp.damage.Outcome;
if (result.type === 'APPLIED') {
    result.killed satisfies boolean;
    // @ts-expect-error resource application precedes the final kill decision.
    result.application.killed;
}

// Independent constructors enforce pairing before heterogeneous storage.
declare const baseInput: Omit<BattleInput, 'deployment' | 'initialUnits' | 'initialEffects'>;
declare const cardUnit: cards.UnitDefinition;
declare const cardDefaults: Omit<cards.Definition<object, 'DEFAULT'>, 'initialize' | 'onTick' | 'policy'>;
const countCard: cards.Definition<{ count: number }, 'QUEUED'> = {
    ...cardDefaults, policy: 'QUEUED',
    supply: { ...cardDefaults.supply, pending: 0 },
    initialize: state => ({ state, value: { count: 0 } }),
    onTick: (state, self) => cards.setState(state, cards.ref(self), { count: self.state.count + 1 }),
};
const nameCard: cards.Definition<{ name: string }, 'UNIQUE'> = {
    ...cardDefaults, policy: 'UNIQUE',
    dp: { ...cardDefaults.dp, increase: true },
    initialize: state => ({ state, value: { name: 'second' } }),
    onTick: (state, self) => cards.setState(state, cards.ref(self), { name: self.state.name }),
};
const countInput = { definition: countCard, unitDefinition: cardUnit };
const builtCard = cards.initialize(battle, countInput);
const countCardRef = cards.ref(builtCard.value);
const exactCard = countCardRef.get(builtCard.state)!;
const cardEffect = {
    id: 'card-effect',
    initialize: () => ({}),
    onTick(state, self) {
        self.ref.host.get(state)!.state.count satisfies number;
        return state;
    },
} satisfies effects.Definition<object, cards.Card<{ count: number }>>;
declare const cardEffectHost: Ref<cards.Card<{ count: number }>>;
effects.install(builtCard.state, cardEffectHost, cardEffect);
// @ts-expect-error a Definition requiring a Card cannot be installed on a Unit.
effects.install(battle, owner, cardEffect);
declare const mixedRef: typeof owner | typeof countCardRef;
mixedRef.get(battle) satisfies typeof armed | typeof exactCard | undefined;
const scopes: readonly Ref<Lifetime>[] = [owner, countCardRef];
endLifetime(battle, owner, { reason: 'SCRIPT' });
// @ts-expect-error a persistent Action does not have its own Lifetime.
const invalidScope: Ref<Lifetime> = actionRef;
// @ts-expect-error Card can be a dependency target but cannot be explicitly ended.
endLifetime(battle, countCardRef, 'SCRIPT');
const enqueued = cards.supply.enqueue(cards.supply.consume(exactCard));
enqueued.state.count satisfies number;
enqueued.supply.pending satisfies number;
for (const card of cards.all(battle)) {
    // @ts-expect-error a heterogeneous query does not prove the card has a queue.
    card.supply.pending;
    if (card.policy === 'QUEUED') {
        card.supply.pending satisfies number;
    } else {
        // @ts-expect-error only queued cards can enqueue pending stock.
        cards.supply.enqueue(card);
    }
}
// @ts-expect-error normal placement cannot supply a Route Plan and offset.
cards.initialize(battle, { ...countInput, unitDefinition: { ...cardUnit, route: routeDefinition.route } });
// @ts-expect-error registration must reject state that does not match its own Definition.
cards.add(builtCard.state, { ...exactCard, state: { count: 'wrong' } });
const counter: effects.Definition<{ count: number }, null> = {
    id: 'counter', initialize: () => ({ count: 0 }),
    onTick: (state, self) => effects.setState(state, effects.ref(self), { count: self.state.count + 1 }),
};
const named: effects.Definition<{ name: string }, null> = {
    id: 'named', initialize: () => ({ name: 'controller' }),
    onTick: (state, self) => effects.setState(state, effects.ref(self), { name: self.state.name }),
};
const startup = {
    ...baseInput,
    deployment: {
        definition: { dp: { initial: 0, min: 0, max: 99, recoveryInterval: null }, slot: { limit: null } },
        cards: [countInput, { definition: nameCard, unitDefinition: cardUnit }],
    },
} as const;
runtime.initialize({
    ...startup, initialUnits: [armedInput, routeInput],
    initialEffects: [{ definition: counter }, { definition: named }],
});
runtime.initialize({
    ...startup,
    // @ts-expect-error startup must still require Facing's Initial for the selected Unit.
    initialUnits: [{ ...armedInput, initial: { occupancy: armedInput.initial.occupancy } }],
    initialEffects: [],
});
const wrongEffect = { ...counter, initialize: () => ({ name: 'wrong' }) };
// @ts-expect-error startup must preserve initializer and callback pairing before aggregation.
runtime.initialize({ ...startup, initialUnits: [], initialEffects: [{ definition: wrongEffect }] });
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
