import type { Ref } from "../../core/common/ref.js";
import { Vec2 } from "../../core/common/vector.js";
import { appendEvents, type State as BattleState, type Result } from "../../core/battle/index.js";
import * as units from "../../core/unit/index.js";
import type { Unit } from "../../core/unit/index.js";

import {
    ref,
    resolveAttackPeriod,
    dispatchBeforeRelease,
    dispatchReleased,
    type ActionCapability,
    type Execution,
    type ActionCallback,
    type ExecutionCallback,
    type Definition as ActionDefinition,
    type Period,
} from "../../core/unit/capability/action/index.js";
import * as actions from "../../core/unit/capability/action/index.js";
import * as timing from "./timing.js";
import type { Timing, Sample as TimingSample } from "./timing.js";
import type { ApplyWay } from "../../core/battle/resource/damage.js";
import { hasFacing, fromVector, turn } from "../../core/unit/capability/facing/index.js";

export interface Definition<
    P extends object = object,
    E extends object = object,
    H extends object = object,
> {
    readonly id: string;
    readonly period: Period;
    readonly applyWay: ApplyWay;
    readonly timing: Timing | ActionCallback<P, State<E>, H, Timing>;
    readonly select: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability & H>,
    ) => Result<readonly Ref<Unit>[]>;
    readonly output: ExecutionCallback<P, State<E>, H>;
    readonly onStart?: ExecutionCallback<P, State<E>, H>;
    readonly afterOutput?: ExecutionCallback<P, State<E>, H>;
    readonly onEnd?: ActionDefinition<P, State<E>, H>["onEnd"];
}

export type StatefulDefinition<
    P extends object,
    E extends object,
    H extends object = object,
> = Definition<P, E, H> & {
    readonly initialize: (battle: BattleState) => Result<P>;
    readonly prepare: ActionCallback<P, State<E>, H, Result<E>>;
};

export interface State<S extends object = object> {
    readonly targets: readonly [Ref<Unit>, ...Ref<Unit>[]];
    readonly timing: TimingSample;
    readonly released: boolean;
    readonly previousReadyAtTick: number;
    readonly cooldownAdjusted: boolean;
    readonly data: S;
}

export type Attack<
    P extends object = object,
    E extends object = object,
    H extends object = object,
> = ActionDefinition<P, State<E>, H>;

function isSourceActive(battle: BattleState, source: Ref<Unit>): boolean {
    const current = source.get(battle);

    return current?.lifecycle === "ACTIVE";
}

export function faceTarget<E extends object>(
    battle: BattleState,
    host: Ref<Unit>,
    self: Execution<State<E>>,
): BattleState {
    const unit = host.get(battle);
    const target = self.state.targets[0].get(battle);
    if (
        unit === undefined ||
        !hasFacing(unit) ||
        target === undefined ||
        Vec2.distanceSquared(unit.position, target.position) <= 0.04
    ) {
        return battle;
    }

    const direction = fromVector(Vec2.sub(target.position, unit.position));

    return direction === null ? battle : turn(battle, units.ref(unit), direction);
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

    const attack: Attack<P, E, H> = {
        id: definition.id,
        applyWay: definition.applyWay,
        period: definition.period,
        initialize: definition.initialize,
        prepare(battle, host, self) {
            const selected = definition.select(battle, host);
            battle = selected.state;
            const [target, ...others] = selected.value;
            if (host.get(battle) === undefined || target === undefined) {
                return { state: battle, value: null };
            }

            const initialized = definition.prepare(battle, host, self);
            const current = ref(self).get(initialized.state);
            const currentUnit = host.get(initialized.state);
            if (current === undefined || currentUnit === undefined) {
                return { state: initialized.state, value: null };
            }

            const input =
                typeof definition.timing === "function"
                    ? definition.timing(initialized.state, host, current)
                    : definition.timing;
            if (typeof definition.timing === "function") {
                timing.validate(input);
            }

            return {
                state: initialized.state,
                value: {
                    targets: [target, ...others],
                    timing: timing.sample(
                        input,
                        resolveAttackPeriod(currentUnit),
                        initialized.state.tick,
                    ),
                    released: false,
                    previousReadyAtTick: current.cooldown.readyAtTick,
                    cooldownAdjusted: false,
                    data: initialized.value,
                },
            };
        },
        onTick(battle, host, self, action) {
            const identity = ref(self);

            if (!self.state.cooldownAdjusted) {
                const overdue = self.startedAtTick - self.state.previousReadyAtTick;
                if (overdue >= 0 && overdue < 1) {
                    const { cooldown } = action.get(battle)!;
                    battle = actions.setCooldown(battle, action, {
                        ...cooldown,
                        readyAtTick: self.state.previousReadyAtTick + cooldown.periodTicks,
                    });
                }

                battle = actions.setExecutionState(battle, identity, {
                    ...self.state,
                    cooldownAdjusted: true,
                });
                self = identity.get(battle)!;
                battle = appendEvents(battle, [
                    {
                        type: "ATTACK_STARTED",
                        sourceUnitId: host.id,
                        targetUnitId: self.state.targets[0].id,
                        tick: battle.tick,
                    },
                ]);
                battle = definition.onStart?.(battle, host, self, action) ?? battle;

                const current = identity.get(battle);
                if (current?.lifecycle !== "ACTIVE") {
                    return battle;
                }
                if (!isSourceActive(battle, host)) {
                    return actions.cancel(battle, identity, "SOURCE_ABSENT");
                }

                self = current;
            }

            const beginUntilTick = self.state.timing.beginUntilTick;
            if (!self.state.released && beginUntilTick !== null && battle.tick >= beginUntilTick) {
                const unit = host.get(battle);
                if (unit === undefined) {
                    return battle;
                }

                const progressed = timing.advance(
                    self.state.timing,
                    resolveAttackPeriod(unit),
                    self.startedAtTick,
                    battle.tick,
                );
                if (progressed !== self.state.timing) {
                    battle = actions.setExecutionState(battle, identity, {
                        ...self.state,
                        timing: progressed,
                    });
                    self = identity.get(battle)!;
                }
            }

            const releaseAtTick = self.state.timing.releaseAtTick;
            if (!self.state.released && releaseAtTick !== null && battle.tick >= releaseAtTick) {
                battle = actions.setExecutionState(battle, identity, {
                    ...self.state,
                    released: true,
                    timing: timing.release(self.state.timing, self.startedAtTick, battle.tick),
                });
                const permission = dispatchBeforeRelease(battle, identity);
                battle = permission.state;
                const current = identity.get(battle);
                if (current?.lifecycle !== "ACTIVE") {
                    return battle;
                }
                if (!isSourceActive(battle, host)) {
                    return actions.cancel(battle, identity, "SOURCE_ABSENT");
                }
                if (permission.value.type === "INTERRUPT") {
                    const recoveryTicks = permission.value.recoveryTicks;
                    const { cooldown } = action.get(battle)!;
                    battle = actions.setCooldown(battle, action, {
                        ...cooldown,
                        readyAtTick: Math.max(cooldown.readyAtTick, battle.tick + recoveryTicks),
                    });

                    return actions.cancel(battle, identity, "INTERRUPTED");
                }

                battle = appendEvents(battle, [
                    {
                        type: "ACTION_RELEASED",
                        sourceUnitId: host.id,
                        tick: battle.tick,
                    },
                ]);

                battle = dispatchReleased(battle, identity);

                const output = identity.get(battle);
                if (output?.lifecycle !== "ACTIVE") {
                    return battle;
                }
                if (!isSourceActive(battle, host)) {
                    return actions.cancel(battle, identity, "SOURCE_ABSENT");
                }

                battle = definition.output(battle, host, output, action);

                const completed = identity.get(battle);
                if (completed?.lifecycle !== "ACTIVE") {
                    return battle;
                }

                if (definition.afterOutput !== undefined) {
                    battle = definition.afterOutput(battle, host, completed, action);
                }
            }

            const current = identity.get(battle);
            if (current?.lifecycle !== "ACTIVE") {
                return battle;
            }

            const { finishAtTick } = current.state.timing;

            return finishAtTick !== null && battle.tick >= finishAtTick
                ? actions.finish(battle, identity)
                : battle;
        },
        ...(definition.onEnd === undefined ? {} : { onEnd: definition.onEnd }),
    };

    return attack;
}
