import { update } from "../../unit/operations.js";
import type { State as BattleState } from "../../battle/state.js";
import type { Ref } from "../../common/ref.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import * as units from "../../unit/query.js";
import type { Unit } from "../../unit/unit.js";
import * as effects from "../../unit/effect/operations.js";
import { ref } from "../../unit/effect/effect.js";
import type { OrdinaryDefinition as EffectDefinition } from "../../unit/effect/definition.js";
import { setHook, removeHook } from "../../unit/hook.js";
import { compose, optional } from "../../unit/change.js";
import * as modifier from "../../common/modifier.js";
import { hasAction } from "../../unit/capability/action/capability.js";
import {
    setSpeedContribution,
    removeSpeedContribution,
} from "../../unit/capability/action/attributes.js";
import { released } from "../../unit/capability/action/release.js";
import type { ExecutionRef } from "../../unit/capability/action/execution.js";
import { hasSkill } from "../../unit/capability/skill/capability.js";
import { activationStarted } from "../../unit/capability/skill/hook.js";
import { Type } from "../../unit/capability/elemental/capability.js";
import {
    onInstall as registerBurst,
    advance,
    onEnd,
    availableHost,
    type Definition,
    type State as BurstState,
} from "../../unit/capability/elemental/burst.js";
import { hurt } from "./damage.js";

export interface ActionScaledDamageParameters {
    readonly durationTicks: number;
    readonly effectDurationTicks: number;
    readonly attackSpeed: number;
    readonly damagePerSecond: number;
    readonly damagePerAction: number;
    readonly maxDamagePerSecond: number;
}

export interface TimeScaledDamageParameters {
    readonly durationTicks: number;
    readonly attackSpeed: number;
    readonly damagePerSecond: number;
    readonly damageIncreasePerSecond: number;
}

interface ActionDamageState {
    readonly damage: number;
    readonly timer: number;
    readonly executions: readonly ExecutionRef[];
}

interface TimeDamageState extends BurstState {
    readonly damage: number;
    readonly timer: number;
}

function setSpeed(
    battle: BattleState,
    reference: Ref<Unit>,
    id: number,
    amount: number | null,
): BattleState {
    const host = reference.get(battle)!;
    if (!hasAction(host)) {
        return battle;
    }

    const key = `@effect/${id}/speed`;

    return update(
        battle,
        units.ref(host),
        amount === null
            ? removeSpeedContribution(key)
            : setSpeedContribution({ id: key, value: [modifier.create({ addition: amount })] }),
    );
}

export function createActionScaledDamage(parameters: ActionScaledDamageParameters): Definition {
    const damage: EffectDefinition<ActionDamageState> = {
        id: "elemental/mania/action-damage",
        group: {
            id: "elemental/mania/action-damage",
            type: "DEFAULT",
            priority: 0,
            independentSource: false,
        },
        initialize: () => ({
            damage: parameters.damagePerSecond,
            timer: TICKS_PER_SECOND,
            executions: [],
        }),
        onInstall(battle, self) {
            const host = self.host.get(battle)!;
            const reference = ref(self);

            return update(
                battle,
                units.ref(host),
                compose(
                    optional(
                        hasAction,
                        setHook(released, {
                            id: `@effect/${self.id}/mania`,
                            accepts(current, { execution }) {
                                const active = reference.get(current);

                                return (
                                    active?.lifecycle === "ACTIVE" &&
                                    active.state.damage < parameters.maxDamagePerSecond &&
                                    !active.state.executions.includes(execution)
                                );
                            },
                            invoke(current, { execution }) {
                                const active = reference.get(current)!;

                                return {
                                    state: effects.setState(current, reference, {
                                        ...active.state,
                                        damage: Math.min(
                                            parameters.maxDamagePerSecond,
                                            active.state.damage + parameters.damagePerAction,
                                        ),
                                        executions: [...active.state.executions, execution],
                                    }),
                                    value: undefined,
                                };
                            },
                        }),
                    ),
                    optional(
                        hasSkill,
                        setHook(activationStarted, {
                            id: `@effect/${self.id}/mania`,
                            accepts(current) {
                                const active = reference.get(current);

                                return (
                                    active?.lifecycle === "ACTIVE" &&
                                    active.state.damage < parameters.maxDamagePerSecond
                                );
                            },
                            invoke(current) {
                                const active = reference.get(current)!;

                                return {
                                    state: effects.setState(current, reference, {
                                        ...active.state,
                                        damage: Math.min(
                                            parameters.maxDamagePerSecond,
                                            active.state.damage + parameters.damagePerAction,
                                        ),
                                    }),
                                    value: undefined,
                                };
                            },
                        }),
                    ),
                ),
            );
        },
        onEnable: (battle, self) => setSpeed(battle, self.host, self.id, parameters.attackSpeed),
        onDisable: (battle, self) => setSpeed(battle, self.host, self.id, null),
        onTick(battle, self) {
            const timer = self.state.timer - 1;
            battle = effects.setState(battle, ref(self), {
                ...self.state,
                timer: timer === 0 ? TICKS_PER_SECOND : timer,
            });

            return timer === 0
                ? hurt(battle, self.host.get(battle)!, "TRUE", self.state.damage, "NORMAL", true)
                : battle;
        },
        onEnd(battle, self) {
            const host = self.host.get(battle)!;

            return update(
                battle,
                units.ref(host),
                compose(
                    optional(hasAction, removeHook(released, `@effect/${self.id}/mania`)),
                    optional(hasSkill, removeHook(activationStarted, `@effect/${self.id}/mania`)),
                ),
            );
        },
    };

    return {
        id: "elemental/mania/action-scaled",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.MANIA }),
        onInstall(battle, self) {
            battle = registerBurst(battle, self);

            if (availableHost(battle, ref(self)) === undefined) {
                return battle;
            }

            return effects.install(battle, self.host, damage, {
                expiration: {
                    type: "DEADLINE",
                    tick: battle.tick + parameters.effectDurationTicks,
                },
            }).state;
        },
        onTick: (battle, self) => advance(battle, self),
        onEnd,
    };
}

export function createTimeScaledDamage(
    parameters: TimeScaledDamageParameters,
): Definition<TimeDamageState> {
    return {
        id: "elemental/mania/time-scaled",
        durationTicks: parameters.durationTicks,
        initialize: () => ({
            type: Type.MANIA,
            damage: parameters.damagePerSecond,
            timer: TICKS_PER_SECOND,
        }),
        onInstall: registerBurst,
        onEnable: (battle, self) => setSpeed(battle, self.host, self.id, parameters.attackSpeed),
        onDisable: (battle, self) => setSpeed(battle, self.host, self.id, null),
        onTick(battle, self) {
            battle = advance(battle, self);
            const reference = ref(self);
            const current = reference.get(battle)!;
            const host = availableHost(battle, reference);
            if (host === undefined) {
                return battle;
            }

            const timer = current.state.timer - 1;
            const damage =
                timer === 0
                    ? current.state.damage + parameters.damageIncreasePerSecond
                    : current.state.damage;
            battle = effects.setState(battle, reference, {
                ...current.state,
                damage,
                timer: timer === 0 ? TICKS_PER_SECOND : timer,
            });

            return timer === 0 ? hurt(battle, host, "ELEMENTAL", damage, "BUFF", false) : battle;
        },
        onEnd,
    };
}
