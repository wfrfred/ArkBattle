import type { Ref } from "../../core/common/ref.js";
import {
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveNumber,
} from "../../core/common/assert.js";
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
    type Action,
    type Execution,
    type Definition as ActionDefinition,
} from "../../core/unit/action/index.js";
import * as actions from "../../core/unit/action/index.js";
import {
    type Action as ActionCapability,
    beforeRelease,
    released,
} from "../../core/unit/capability/action/index.js";

import { hasOffense, resolveAttack } from "../../core/unit/capability/offense/index.js";

import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
    type DamageType,
} from "../../core/battle/damage/hp/index.js";

import { hasVitality } from "../../core/unit/capability/vitality/index.js";
import {
    calculateHealing,
    applyHealing,
    type Request as HealingRequest,
} from "../../core/battle/healing/hp/index.js";

import {
    hasElemental,
    type Type as ElementType,
} from "../../core/unit/capability/elemental/index.js";
import * as epDamage from "../../core/battle/damage/ep/index.js";
import * as epHealing from "../../core/battle/healing/ep/index.js";

export type Operation =
    | {
          readonly type: "DAMAGE";
          readonly power: number;
          readonly damageType: DamageType;
          readonly powerSource?: "SOURCE_ATTACK";
      }
    | { readonly type: "HEAL"; readonly power: number }
    | {
          readonly type: "ELEMENTAL_INJURY";
          readonly power: number;
          readonly elementType: ElementType;
      }
    | { readonly type: "ELEMENTAL_INJURY_HEALED"; readonly power: number };

export interface TargetGroup {
    readonly id: string;
    readonly select: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
    ) => Result<readonly Ref<Unit>[]>;
    readonly operations: readonly Operation[];
}

export interface FollowUp {
    readonly receiver:
        { readonly type: "SOURCE" } | { readonly type: "BINDING"; readonly bindingId: string };
    readonly operation: Operation;
}

export interface Configuration {
    readonly id: string;
    readonly intervalTicks: number;
    readonly speed?: number;
    readonly triggerBindingId: string;
    readonly targetGroups: readonly [TargetGroup, ...TargetGroup[]];
    readonly followUps?: readonly FollowUp[];
    readonly windupTicks?: number;
    readonly recoveryTicks?: number;
}

export interface Definition<
    P extends object = object,
    E extends object = object,
> extends Configuration {
    readonly output?: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Execution<P, State<E>>,
    ) => BattleState;
    readonly afterOutput?: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Execution<P, State<E>>,
    ) => BattleState;
    readonly onEnd?: ActionDefinition<P, State<E>>["onEnd"];
}

export interface StatefulDefinition<P extends object, E extends object> extends Definition<P, E> {
    readonly initialize: (battle: BattleState) => Result<P>;
    readonly prepare: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Action<P, State<E>>,
    ) => Result<E>;
}

export interface State<S extends object = object> {
    readonly target: Ref<Unit>;
    readonly bindings: Readonly<Record<string, readonly Ref<Unit>[]>>;
    readonly releaseAtTick: number;
    readonly finishAtTick: number;
    readonly released: boolean;
    readonly previousReadyAtTick: number;
    readonly cooldownAdjusted: boolean;
    readonly data: S;
}

export interface Attack<
    P extends object = object,
    E extends object = object,
> extends ActionDefinition<P, State<E>> {
    readonly attack: Configuration;
}

export interface Stored extends Pick<ActionDefinition, "id" | "intervalTicks" | "speed"> {
    readonly attack: Configuration;
}

export function isAttack(value: unknown): value is Stored {
    return typeof value === "object" && value !== null && "attack" in value;
}

function sourcePresent(battle: BattleState, source: Ref<Unit>): boolean {
    const current = units.get(battle, source);

    return current?.lifecycle === "PRESENT";
}

export function chooseTargets(
    battle: BattleState,
    source: Ref<Unit & ActionCapability>,
    definition: Configuration,
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

function apply(
    battle: BattleState,
    source: Ref<Unit>,
    target: Ref<Unit>,
    operation: Operation,
): BattleState {
    switch (operation.type) {
        case "DAMAGE": {
            const receiver = units.get(battle, target);
            let power: number | undefined = operation.power;

            if (operation.powerSource === "SOURCE_ATTACK") {
                const current = units.get(battle, source);
                if (current === undefined) {
                    power = undefined;
                } else if (hasOffense(current)) {
                    power = resolveAttack(battle, current);
                } else {
                    power = 0;
                }
            }

            if (power === undefined || receiver === undefined || !hasVitality(receiver)) {
                return battle;
            }

            const attack = { power, multiplier: 1, addition: 0 };
            const type = operation.damageType;
            const request: DamageRequest = {
                source,
                target: units.ref(receiver),
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

export function create(definition: Definition): Attack {
    return createWithState({
        ...definition,
        initialize: (battle) => ({ state: battle, value: {} }),
        prepare: (battle) => ({ state: battle, value: {} }),
    });
}

export function createWithState<P extends object, E extends object>(
    definition: StatefulDefinition<P, E>,
): Attack<P, E> {
    assertPositiveNumber(definition.intervalTicks, "attack interval");
    assertNonnegativeSafeInteger(definition.windupTicks ?? 0, "attack windup");
    assertNonnegativeSafeInteger(definition.recoveryTicks ?? 0, "attack recovery");

    for (const group of definition.targetGroups) {
        for (const operation of group.operations) {
            assertNonnegativeNumber(operation.power, "attack operation power");
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

        assertNonnegativeNumber(followUp.operation.power, "attack operation power");
    }

    const configuration: Configuration = {
        id: definition.id,
        intervalTicks: definition.intervalTicks,
        triggerBindingId: definition.triggerBindingId,
        targetGroups: definition.targetGroups,
        followUps,
        ...(definition.speed === undefined ? {} : { speed: definition.speed }),
        ...(definition.windupTicks === undefined ? {} : { windupTicks: definition.windupTicks }),
        ...(definition.recoveryTicks === undefined
            ? {}
            : { recoveryTicks: definition.recoveryTicks }),
    };
    const attack: Attack<P, E> = {
        id: definition.id,
        intervalTicks: definition.intervalTicks,
        speed: definition.speed ?? 100,
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

            const releaseAtTick = battle.tick + (definition.windupTicks ?? 0);
            const initialized = definition.prepare(battle, source, self);
            const current = actions.getAction(initialized.state, ref(source, self.definition));

            return {
                state: initialized.state,
                value: {
                    target,
                    bindings,
                    releaseAtTick,
                    finishAtTick: releaseAtTick + (definition.recoveryTicks ?? 0),
                    released: false,
                    previousReadyAtTick: current?.cooldown.readyAtTick ?? initialized.state.tick,
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
                    const current = actions.getExecution(battle, identity);
                    if (
                        current?.execution.lifecycle !== "RUNNING" ||
                        !sourcePresent(battle, source)
                    ) {
                        return {
                            state: actions.cancel(battle, identity, "SOURCE_ABSENT"),
                            value: true,
                        };
                    }

                    self = current;
                }

                battle = actions.setExecutionState(battle, identity, {
                    ...self.execution.state,
                    cooldownAdjusted: true,
                });
                const current = actions.getExecution(battle, identity);
                if (current?.execution.lifecycle !== "RUNNING" || !sourcePresent(battle, source)) {
                    return {
                        state: actions.cancel(battle, identity, "SOURCE_ABSENT"),
                        value: true,
                    };
                }

                self = current;
                battle = appendEvents(battle, [
                    {
                        type: "ATTACK_STARTED",
                        sourceUnitId: source.id,
                        targetUnitId: self.execution.state.target.id,
                        tick: battle.tick,
                    },
                ]);
            }

            if (
                !self.execution.state.released &&
                battle.tick >= self.execution.state.releaseAtTick
            ) {
                battle = actions.setExecutionState(battle, identity, {
                    ...self.execution.state,
                    released: true,
                });
                const releasing = actions.getExecution(battle, identity);
                if (
                    releasing?.execution.lifecycle !== "RUNNING" ||
                    !sourcePresent(battle, source)
                ) {
                    return {
                        state: actions.cancel(battle, identity, "SOURCE_ABSENT"),
                        value: true,
                    };
                }

                self = releasing;
                const permission = beforeRelease(battle, identity);
                battle = permission.state;
                const current = actions.getExecution(battle, identity);
                if (current?.execution.lifecycle !== "RUNNING" || !sourcePresent(battle, source)) {
                    return {
                        state: actions.cancel(battle, identity, "SOURCE_ABSENT"),
                        value: true,
                    };
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

                    return { state: actions.cancel(battle, identity, "INTERRUPTED"), value: true };
                }

                battle = appendEvents(battle, [
                    {
                        type: "ACTION_RELEASED",
                        sourceUnitId: source.id,
                        tick: battle.tick,
                    },
                ]);

                battle = released(battle, identity);

                const output = actions.getExecution(battle, identity);
                if (output?.execution.lifecycle !== "RUNNING" || !sourcePresent(battle, source)) {
                    return {
                        state: actions.cancel(battle, identity, "SOURCE_ABSENT"),
                        value: true,
                    };
                }

                if (definition.output !== undefined) {
                    battle = definition.output(battle, source, output);
                } else {
                    for (const group of definition.targetGroups) {
                        for (const operation of group.operations) {
                            for (const target of output.execution.state.bindings[group.id] ?? []) {
                                if (
                                    actions.getExecution(battle, identity)?.execution.lifecycle !==
                                    "RUNNING"
                                ) {
                                    return { state: battle, value: true };
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
                                "RUNNING"
                            ) {
                                return { state: battle, value: true };
                            }

                            battle = apply(battle, source, target, followUp.operation);
                        }
                    }
                }

                const completed = actions.getExecution(battle, identity);
                if (completed?.execution.lifecycle !== "RUNNING") {
                    return { state: battle, value: true };
                }

                if (definition.afterOutput !== undefined) {
                    battle = definition.afterOutput(battle, source, completed);
                }
            }

            const current = actions.getExecution(battle, identity);

            return {
                state: battle,
                value: current === undefined || battle.tick >= current.execution.state.finishAtTick,
            };
        },
        ...(definition.onEnd === undefined ? {} : { onEnd: definition.onEnd }),
    };

    return attack;
}
