import type { Ref } from "../../core/common/ref.js";
import { Vec2 } from "../../core/common/vector.js";
import { assertNonnegativeNumber } from "../../core/common/assert.js";
import {
    appendEvents,
    type State as BattleState,
    type OperationResult as Result,
} from "../../core/battle/index.js";
import * as units from "../../core/unit/index.js";
import type { Unit } from "../../core/unit/index.js";

import {
    ref,
    executionRef,
    resolveAttackPeriod,
    dispatchBeforeRelease,
    dispatchReleased,
    type Action,
    type ActionCapability,
    type Execution,
    type Definition as ActionDefinition,
    type Period,
} from "../../core/unit/capability/action/index.js";
import * as actions from "../../core/unit/capability/action/index.js";
import * as timing from "./timing.js";
import type { Timing, Sample as TimingSample } from "./timing.js";
import { mergeApplyWays } from "../../core/battle/resource/damage.js";

import { resolveAttack, type Offense } from "../../core/unit/capability/offense/index.js";
import { hasFacing, fromVector, turn } from "../../core/unit/capability/facing/index.js";

import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
    type DamageType,
    type AttackType,
    type ApplyWay,
} from "../../core/battle/resource/hp/damage/index.js";

import { hasVitality } from "../../core/unit/capability/vitality/index.js";
import {
    calculateHealing,
    applyHealing,
    type Request as HealingRequest,
} from "../../core/battle/resource/hp/healing/index.js";

import {
    hasElemental,
    type Type as ElementType,
} from "../../core/unit/capability/elemental/index.js";
import * as epDamage from "../../core/battle/resource/ep/damage/index.js";
import * as epHealing from "../../core/battle/resource/ep/healing/index.js";

type Source<H extends object> = Ref<Unit & ActionCapability & H>;

export type Operation<H extends object = object> =
    | {
          readonly type: "DAMAGE";
          readonly power: number | ((battle: BattleState, source: Source<H>) => number | undefined);
          readonly damageType: DamageType;
          readonly attackType: AttackType;
          readonly applyWay: ApplyWay;
      }
    | { readonly type: "HEAL"; readonly power: number }
    | {
          readonly type: "ELEMENTAL_INJURY";
          readonly power: number;
          readonly elementType: ElementType;
          readonly attackType: AttackType;
          readonly applyWay: ApplyWay;
      }
    | { readonly type: "ELEMENTAL_INJURY_HEALED"; readonly power: number };

export interface TargetGroup<H extends object = object> {
    readonly id: string;
    readonly select: (battle: BattleState, source: Source<H>) => Result<readonly Ref<Unit>[]>;
    readonly operations: readonly Operation<H>[];
}

export interface FollowUp<H extends object = object> {
    readonly receiver:
        { readonly type: "SOURCE" } | { readonly type: "BINDING"; readonly bindingId: string };
    readonly operation: Operation<H>;
}

export interface Configuration<
    P extends object = object,
    E extends object = object,
    H extends object = object,
> {
    readonly id: string;
    readonly period: Period;
    readonly triggerBindingId: string;
    readonly targetGroups: readonly [TargetGroup<H>, ...TargetGroup<H>[]];
    readonly followUps?: readonly FollowUp<H>[];
    readonly timing:
        Timing | ((battle: BattleState, source: Source<H>, self: Action<P, State<E>, H>) => Timing);
}

export type Definition<
    P extends object = object,
    E extends object = object,
    H extends object = object,
> = Configuration<P, E, H> & {
    readonly onStart?: (
        battle: BattleState,
        source: Source<H>,
        self: Execution<P, State<E>, H>,
    ) => BattleState;
    readonly afterOutput?: (
        battle: BattleState,
        source: Source<H>,
        self: Execution<P, State<E>, H>,
    ) => BattleState;
    readonly onEnd?: ActionDefinition<P, State<E>, H>["onEnd"];
} & (
        | { readonly output?: undefined; readonly applyWay?: never }
        | {
              readonly applyWay: ApplyWay;
              readonly output: (
                  battle: BattleState,
                  source: Source<H>,
                  self: Execution<P, State<E>, H>,
              ) => BattleState;
          }
    );

export type StatefulDefinition<
    P extends object,
    E extends object,
    H extends object = object,
> = Definition<P, E, H> & {
    readonly initialize: (battle: BattleState) => Result<P>;
    readonly prepare: (
        battle: BattleState,
        source: Source<H>,
        self: Action<P, State<E>, H>,
    ) => Result<E>;
};

export interface State<S extends object = object> {
    readonly target: Ref<Unit>;
    readonly bindings: Readonly<Record<string, readonly Ref<Unit>[]>>;
    readonly timing: TimingSample;
    readonly released: boolean;
    readonly previousReadyAtTick: number;
    readonly cooldownAdjusted: boolean;
    readonly data: S;
}

export interface Attack<
    P extends object = object,
    E extends object = object,
    H extends object = object,
> extends ActionDefinition<P, State<E>, H> {
    readonly attack: Configuration<P, E, H>;
}

function isSourceActive(battle: BattleState, source: Ref<Unit>): boolean {
    const current = units.get(battle, source);

    return current?.lifecycle === "ACTIVE";
}

export function faceTarget<P extends object, E extends object, H extends object>(
    battle: BattleState,
    source: Source<H>,
    self: Execution<P, State<E>, H>,
): BattleState {
    const host = units.get(battle, source);
    const target = units.get(battle, self.execution.state.target);
    if (
        host === undefined ||
        !hasFacing(host) ||
        target === undefined ||
        Vec2.distanceSquared(host.position, target.position) <= 0.04
    ) {
        return battle;
    }

    const direction = fromVector(Vec2.sub(target.position, host.position));

    return direction === null ? battle : turn(battle, units.ref(host), direction);
}

export function chooseTargets<P extends object, E extends object, H extends object>(
    battle: BattleState,
    source: Source<H>,
    definition: Configuration<P, E, H>,
): Result<State["bindings"]> {
    const unit = units.get(battle, source);
    if (unit === undefined) {
        return { state: battle, value: {} };
    }

    const bindings: Record<string, readonly Ref<Unit>[]> = {};

    for (const group of definition.targetGroups) {
        const selected = group.select(battle, source);
        battle = selected.state;
        bindings[group.id] = selected.value;
    }

    return { state: battle, value: bindings };
}

export function sourceAttack(battle: BattleState, source: Ref<Unit & Offense>): number | undefined {
    const current = units.get(battle, source);

    return current === undefined ? undefined : resolveAttack(battle, current);
}

function apply<H extends object>(
    battle: BattleState,
    source: Source<H>,
    target: Ref<Unit>,
    operation: Operation<H>,
): BattleState {
    switch (operation.type) {
        case "DAMAGE": {
            const receiver = units.get(battle, target);
            if (receiver === undefined || !hasVitality(receiver)) {
                return battle;
            }

            const power =
                typeof operation.power === "function"
                    ? operation.power(battle, source)
                    : operation.power;
            if (power === undefined) {
                return battle;
            }

            const attack = { power, multiplier: 1, addition: 0 };
            const type = operation.damageType;
            const request: DamageRequest = {
                attackType: operation.attackType,
                applyWay: operation.applyWay,
                source,
                killer: source,
                target: units.ref(receiver),
                nature: "DAMAGE",
                hitRecovery: true,
                parameters:
                    type === "PHYSICAL" || type === "ARTS"
                        ? { type, attack, penetration: { fixed: 0, proportional: 0 } }
                        : { type, attack },
            };

            return applyDamage(request, calculateDamage(battle, request)).state;
        }

        case "HEAL": {
            const receiver = units.get(battle, target);
            if (receiver === undefined || !hasVitality(receiver)) {
                return battle;
            }

            const request: HealingRequest = {
                source,
                target: units.ref(receiver),
                parameters: { power: operation.power, multiplier: 1 },
            };

            return applyHealing(request, calculateHealing(battle, request)).state;
        }

        case "ELEMENTAL_INJURY": {
            const receiver = units.get(battle, target);
            if (receiver === undefined || !hasElemental(receiver)) {
                return battle;
            }

            const request: epDamage.Request = {
                attackType: operation.attackType,
                applyWay: operation.applyWay,
                nature: "DAMAGE",
                source,
                target: units.ref(receiver),
                parameters: { type: operation.elementType, power: operation.power },
            };

            return epDamage.applyDamage(request, epDamage.calculateDamage(battle, request)).state;
        }

        case "ELEMENTAL_INJURY_HEALED": {
            const receiver = units.get(battle, target);
            if (receiver === undefined || !hasElemental(receiver)) {
                return battle;
            }

            const request: epHealing.Request = {
                source,
                target: units.ref(receiver),
                parameters: { power: operation.power },
            };

            return epHealing.applyHealing(request, epHealing.calculateHealing(battle, request))
                .state;
        }
    }
}

export function create<H extends object = object>(
    definition: Definition<object, object, H>,
): Attack<object, object, H> {
    return createWithState<object, object, H>({
        ...definition,
        initialize: (battle) => ({ state: battle, value: {} }),
        prepare: (battle) => ({ state: battle, value: {} }),
    });
}

export function createWithState<P extends object, E extends object, H extends object = object>(
    definition: StatefulDefinition<P, E, H>,
): Attack<P, E, H> {
    if (typeof definition.timing !== "function") {
        timing.validate(definition.timing);
    }

    for (const group of definition.targetGroups) {
        for (const operation of group.operations) {
            if (typeof operation.power !== "function") {
                assertNonnegativeNumber(operation.power, "attack operation power");
            }
        }
    }

    const ids = new Set(definition.targetGroups.map((group) => group.id));
    if (
        ids.has("") ||
        ids.size !== definition.targetGroups.length ||
        !ids.has(definition.triggerBindingId)
    ) {
        throw new TypeError("attack target bindings must be unique and include its trigger");
    }

    const followUps = definition.followUps ?? [];

    for (const followUp of followUps) {
        if (followUp.receiver.type === "BINDING" && !ids.has(followUp.receiver.bindingId)) {
            throw new TypeError("attack follow-up references an unknown target binding");
        }

        if (typeof followUp.operation.power !== "function") {
            assertNonnegativeNumber(followUp.operation.power, "attack operation power");
        }
    }

    const operations = [
        ...definition.targetGroups.flatMap((group) => group.operations),
        ...followUps.map(({ operation }) => operation),
    ];
    const configuration: Configuration<P, E, H> = {
        id: definition.id,
        period: definition.period,
        triggerBindingId: definition.triggerBindingId,
        targetGroups: definition.targetGroups,
        followUps,
        timing: definition.timing,
    };
    const attack: Attack<P, E, H> = {
        id: definition.id,
        applyWay:
            definition.output === undefined
                ? mergeApplyWays(
                      operations.map((operation) =>
                          "applyWay" in operation ? operation.applyWay : "NONE",
                      ),
                  )
                : definition.applyWay,
        period: definition.period,
        attack: configuration,
        initialize: definition.initialize,
        prepare(battle, source, self) {
            const selected = chooseTargets(battle, source, definition);
            battle = selected.state;
            const unit = units.get(battle, source);
            const bindings = selected.value;
            const target = bindings[definition.triggerBindingId]?.[0];
            if (unit === undefined || target === undefined) {
                return { state: battle, value: null };
            }

            const initialized = definition.prepare(battle, source, self);
            const current = actions.getAction(initialized.state, ref(source, self.definition));
            const host = units.get(initialized.state, source);
            if (current === undefined || host === undefined) {
                return { state: initialized.state, value: null };
            }

            const input =
                typeof definition.timing === "function"
                    ? definition.timing(initialized.state, source, current)
                    : definition.timing;
            if (typeof definition.timing === "function") {
                timing.validate(input);
            }

            return {
                state: initialized.state,
                value: {
                    target,
                    bindings,
                    timing: timing.sample(input, resolveAttackPeriod(host), initialized.state.tick),
                    released: false,
                    previousReadyAtTick: current.cooldown.readyAtTick,
                    cooldownAdjusted: false,
                    data: initialized.value,
                },
            };
        },
        onTick(battle, source, self) {
            const identity = executionRef(source, self);

            if (!self.execution.state.cooldownAdjusted) {
                const overdue =
                    self.execution.startedAtTick - self.execution.state.previousReadyAtTick;
                if (overdue >= 0 && overdue < 1) {
                    battle = actions.setCooldown(battle, ref(source, self.definition), {
                        ...self.cooldown,
                        readyAtTick:
                            self.execution.state.previousReadyAtTick + self.cooldown.periodTicks,
                    });
                }

                battle = actions.setExecutionState(battle, identity, {
                    ...self.execution.state,
                    cooldownAdjusted: true,
                });
                self = actions.getExecution(battle, identity)!;
                battle = appendEvents(battle, [
                    {
                        type: "ATTACK_STARTED",
                        sourceUnitId: source.id,
                        targetUnitId: self.execution.state.target.id,
                        tick: battle.tick,
                    },
                ]);
                battle = definition.onStart?.(battle, source, self) ?? battle;

                const current = actions.getExecution(battle, identity);
                if (current?.execution.lifecycle !== "ACTIVE") {
                    return battle;
                }
                if (!isSourceActive(battle, source)) {
                    return actions.cancel(battle, identity, "SOURCE_ABSENT");
                }

                self = current;
            }

            const beginUntilTick = self.execution.state.timing.beginUntilTick;
            if (
                !self.execution.state.released &&
                beginUntilTick !== null &&
                battle.tick >= beginUntilTick
            ) {
                const host = units.get(battle, source);
                if (host === undefined) {
                    return battle;
                }

                const progressed = timing.advance(
                    self.execution.state.timing,
                    resolveAttackPeriod(host),
                    self.execution.startedAtTick,
                    battle.tick,
                );
                if (progressed !== self.execution.state.timing) {
                    battle = actions.setExecutionState(battle, identity, {
                        ...self.execution.state,
                        timing: progressed,
                    });
                    self = actions.getExecution(battle, identity)!;
                }
            }

            const releaseAtTick = self.execution.state.timing.releaseAtTick;
            if (
                !self.execution.state.released &&
                releaseAtTick !== null &&
                battle.tick >= releaseAtTick
            ) {
                battle = actions.setExecutionState(battle, identity, {
                    ...self.execution.state,
                    released: true,
                    timing: timing.release(
                        self.execution.state.timing,
                        self.execution.startedAtTick,
                        battle.tick,
                    ),
                });
                const permission = dispatchBeforeRelease(battle, identity);
                battle = permission.state;
                const current = actions.getExecution(battle, identity);
                if (current?.execution.lifecycle !== "ACTIVE") {
                    return battle;
                }
                if (!isSourceActive(battle, source)) {
                    return actions.cancel(battle, identity, "SOURCE_ABSENT");
                }
                if (permission.value.type === "INTERRUPT") {
                    const recoveryTicks = permission.value.recoveryTicks;
                    battle = actions.setCooldown(battle, ref(source, self.definition), {
                        ...current.cooldown,
                        readyAtTick: Math.max(
                            current.cooldown.readyAtTick,
                            battle.tick + recoveryTicks,
                        ),
                    });

                    return actions.cancel(battle, identity, "INTERRUPTED");
                }

                battle = appendEvents(battle, [
                    {
                        type: "ACTION_RELEASED",
                        sourceUnitId: source.id,
                        tick: battle.tick,
                    },
                ]);

                battle = dispatchReleased(battle, identity);

                const output = actions.getExecution(battle, identity);
                if (output?.execution.lifecycle !== "ACTIVE") {
                    return battle;
                }
                if (!isSourceActive(battle, source)) {
                    return actions.cancel(battle, identity, "SOURCE_ABSENT");
                }

                if (definition.output !== undefined) {
                    battle = definition.output(battle, source, output);
                } else {
                    for (const group of definition.targetGroups) {
                        for (const operation of group.operations) {
                            for (const target of output.execution.state.bindings[group.id] ?? []) {
                                if (
                                    actions.getExecution(battle, identity)?.execution.lifecycle !==
                                    "ACTIVE"
                                ) {
                                    return battle;
                                }

                                battle = apply(battle, source, target, operation);
                            }
                        }
                    }
                    for (const followUp of definition.followUps ?? []) {
                        for (const target of followUp.receiver.type === "SOURCE"
                            ? [source]
                            : (output.execution.state.bindings[followUp.receiver.bindingId] ??
                              [])) {
                            if (
                                actions.getExecution(battle, identity)?.execution.lifecycle !==
                                "ACTIVE"
                            ) {
                                return battle;
                            }

                            battle = apply(battle, source, target, followUp.operation);
                        }
                    }
                }

                const completed = actions.getExecution(battle, identity);
                if (completed?.execution.lifecycle !== "ACTIVE") {
                    return battle;
                }

                if (definition.afterOutput !== undefined) {
                    battle = definition.afterOutput(battle, source, completed);
                }
            }

            const current = actions.getExecution(battle, identity);
            if (current?.execution.lifecycle !== "ACTIVE") {
                return battle;
            }

            const { finishAtTick } = current.execution.state.timing;

            return finishAtTick !== null && battle.tick >= finishAtTick
                ? actions.finish(battle, identity)
                : battle;
        },
        ...(definition.onEnd === undefined ? {} : { onEnd: definition.onEnd }),
    };

    return attack;
}
