import type { Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState } from "../../../battle/state.js";
import { replace, update } from "../../../battle/unit.js";
import type { DamageType, Request as DamageRequest } from "../../../battle/damage/hp/contract.js";
import { calculateDamage } from "../../../battle/damage/hp/calculate.js";
import { applyDamage } from "../../../battle/damage/hp/apply.js";
import { scope } from "../../../lifetime/operations.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import type { Change } from "../../change.js";
import * as effects from "../../effect/operations.js";
import { get as getEffect } from "../../effect/query.js";
import { ref, type Effect } from "../../effect/effect.js";
import type { Definition as EffectDefinition } from "../../effect/definition.js";
import { stun, silence, blockSpRecovery } from "../../control.js";
import * as attribute from "../../contribution/attribute.js";
import { hasAction, setHook, removeHook, type Action } from "../action/capability.js";
import {
    hasVitality,
    setContribution,
    removeContribution,
    type Vitality,
} from "../vitality/capability.js";
import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
} from "../offense/capability.js";
import { hasSkill } from "../skill/capability.js";
import { modify } from "../../skill/sp.js";
import { elementValues, type Elemental, type Type } from "./capability.js";
import { available, resolveMaxEp, resolveBurstRecoverySpeed } from "./query.js";
import { dispatch } from "./hook.js";

export interface Damage<T extends DamageType = DamageType> {
    readonly type: T;
    readonly power: number;
}

export interface Definition {
    readonly durationTicks: number;
    readonly burstDamage: Damage | null;
    readonly damagePerSecond: Damage<"ARTS" | "ELEMENTAL"> | null;
    readonly defReduction: number;
    readonly resReduction: number;
    readonly stun: boolean;
    readonly paralysisStacks: number;
    readonly spDrainPerSecond: number;
    readonly blocksSkill: boolean;
    readonly blocksSpRecovery: boolean;
    readonly attackReductionRatio: number;
}

export interface State {
    readonly type: Type;
    readonly elapsedTicks: number;
}

export type Burst = Effect<State, Elemental>;

export type End =
    { readonly type: "FINISHED" } | { readonly type: "CANCELLED"; readonly reason: string };

export { ref };

function define(type: Type): EffectDefinition<State, Elemental> {
    const reduction: EffectDefinition<object, Elemental & Vitality> = {
        id: `elemental/${type}/reduction`,
        initialize: () => ({}),
        onEnable(battle, self) {
            const unit = units.get(battle, self.host)!;
            const profile = unit.definition.elemental.bursts[type];
            const changes: Change[] = [];
            if (profile.defReduction !== 0) {
                changes.push(
                    setContribution(units.ref(unit), "defense", {
                        id: `@effect/${self.id}/defense`,
                        value: [attribute.create({ addition: -profile.defReduction })],
                    }),
                );
            }
            if (profile.resReduction !== 0) {
                changes.push(
                    setContribution(units.ref(unit), "resistance", {
                        id: `@effect/${self.id}/resistance`,
                        value: [attribute.create({ addition: -profile.resReduction })],
                    }),
                );
            }

            return update(battle, changes);
        },
        onDisable(battle, self) {
            return update(battle, [
                removeContribution(self.host, "defense", `@effect/${self.id}/defense`),
                removeContribution(self.host, "resistance", `@effect/${self.id}/resistance`),
            ]);
        },
    };
    const paralysis: EffectDefinition<{ used: number }, Elemental & Action> = {
        id: `elemental/${type}/paralysis`,
        initialize: () => ({ used: 0 }),
        onInstall(battle, self) {
            const effectId = self.id;

            return update(battle, [
                setHook(self.host, "beforeRelease", {
                    id: `@effect/${effectId}/paralysis`,
                    accepts(current) {
                        const host = units.get(current, self.host);
                        const active = host?.effects.get(effectId, paralysis);

                        return (
                            active?.status === "ACTIVE" &&
                            active.data.used <
                                host!.definition.elemental.bursts[type].paralysisStacks
                        );
                    },
                    invoke(current) {
                        const host = units.get(current, self.host)!;
                        const active = host.effects.get(effectId, paralysis)!;
                        const reference = ref(active);
                        const used = active.data.used + 1;
                        current = effects.setData(current, reference, { used });

                        if (used === host.definition.elemental.bursts[type].paralysisStacks) {
                            current = effects.end(current, reference);
                        }

                        const recoveryTicks = TICKS_PER_SECOND / 2;
                        const present = units.get(current, self.host);
                        if (present?.lifecycle === "PRESENT") {
                            current = effects.install(current, self.host, stun, {
                                deadline: current.tick + recoveryTicks,
                            }).state;
                        }

                        return { state: current, value: { type: "INTERRUPT", recoveryTicks } };
                    },
                }),
            ]);
        },
        onEnd: (battle, self) =>
            update(battle, [
                removeHook(self.host, "beforeRelease", `@effect/${self.id}/paralysis`),
            ]),
    };

    return {
        id: `elemental/${type}/burst`,
        initialize: () => ({ type, elapsedTicks: 0 }),
        onInstall(battle, self) {
            const host = units.get(battle, self.host)!;
            battle = replace(battle, [
                { ...host, elemental: { ...host.elemental, burst: ref(self) } },
            ]);
            battle = appendEvents(battle, [
                {
                    type: "ELEMENTAL_BURST",
                    unitId: host.id,
                    elementType: type,
                    position: host.position,
                    tick: battle.tick,
                },
            ]);

            return dispatch(battle, self.host, "burstStarted", self);
        },
        onEnable(battle, self) {
            const reference = ref(self);
            const scopes = [scope(effects.lifetime, reference)];
            let unit = activeHost(battle, reference);
            if (unit === undefined) {
                return battle;
            }

            const profile = unit.definition.elemental.bursts[type];
            if (hasVitality(unit) && (profile.defReduction !== 0 || profile.resReduction !== 0)) {
                battle = effects.install(battle, units.ref(unit), reduction, {
                    scopes: type === "EROSION" ? [] : scopes,
                }).state;
            }

            const controls = [
                ...(profile.stun ? [stun] : []),
                ...(profile.blocksSkill ? [silence] : []),
                ...(profile.blocksSpRecovery ? [blockSpRecovery] : []),
            ];

            for (const control of controls) {
                unit = activeHost(battle, reference);

                if (unit === undefined) {
                    return battle;
                }

                battle = effects.install(battle, self.host, control, { scopes }).state;
            }

            unit = activeHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }
            if (profile.attackReductionRatio > 0 && hasOffense(unit)) {
                battle = update(battle, [
                    setAttackContribution(units.ref(unit), {
                        id: `@effect/${self.id}/attack`,
                        value: [
                            attribute.create({ finalScaler: 1 - profile.attackReductionRatio }),
                        ],
                    }),
                ]);
            }
            if (profile.paralysisStacks > 0 && hasAction(unit)) {
                const existing = unit.effects
                    .values()
                    .find(
                        (effect) => effect.definition === paralysis && effect.status !== "ENDING",
                    );
                battle =
                    existing === undefined
                        ? effects.install(battle, units.ref(unit), paralysis).state
                        : effects.setData(
                              battle,
                              ref(existing as Effect<{ used: number }, Elemental & Action>),
                              { used: 0 },
                          );
            }

            unit = activeHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }
            if (profile.burstDamage !== null) {
                battle = hurt(battle, unit, profile.burstDamage);
            }

            const current = getEffect(battle, reference);
            if (current?.status === "ACTIVE" && profile.durationTicks === 0) {
                battle = effects.end(battle, reference, "ELEMENTAL_BURST_FINISHED");
            }

            return battle;
        },
        onDisable(battle, self) {
            const host = units.get(battle, self.host)!;

            return hasOffense(host) &&
                host.definition.elemental.bursts[type].attackReductionRatio > 0
                ? update(battle, [
                      removeAttackContribution(units.ref(host), `@effect/${self.id}/attack`),
                  ])
                : battle;
        },
        onTick(battle, self) {
            const reference = ref(self);
            const host = activeHost(battle, reference);
            if (host === undefined) {
                return battle;
            }

            const profile = host.definition.elemental.bursts[type];
            const elapsedTicks = Math.min(
                profile.durationTicks,
                self.data.elapsedTicks + resolveBurstRecoverySpeed(battle, host),
            );
            const maximum = resolveMaxEp(battle, host);
            const current = { ...self, data: { type, elapsedTicks } };
            const ep = elementValues((maximum * elapsedTicks) / profile.durationTicks);
            battle = replace(battle, [
                {
                    ...host,
                    effects: host.effects.replace(reference, current),
                    elemental: { ...host.elemental, ep },
                },
            ]);

            const previousSecond = Math.floor((self.data.elapsedTicks + 1e-8) / TICKS_PER_SECOND);
            const currentSecond = Math.floor((elapsedTicks + 1e-8) / TICKS_PER_SECOND);

            for (let second = previousSecond + 1; second <= currentSecond; second++) {
                let unit = activeHost(battle, reference);
                if (unit === undefined) {
                    return battle;
                }
                if (profile.spDrainPerSecond > 0 && hasSkill(unit)) {
                    battle = modify(battle, units.ref(unit), -profile.spDrainPerSecond).state;
                }

                unit = activeHost(battle, reference);

                if (unit === undefined) {
                    return battle;
                }
                if (profile.damagePerSecond !== null) {
                    battle = hurt(battle, unit, profile.damagePerSecond);
                }

                unit = activeHost(battle, reference);

                if (unit === undefined) {
                    return battle;
                }
                if (profile.attackReductionRatio > 0 && hasOffense(unit)) {
                    const scaler =
                        1 -
                        profile.attackReductionRatio *
                            Math.max(0, 1 - second / (profile.durationTicks / TICKS_PER_SECOND));
                    battle = update(battle, [
                        setAttackContribution(units.ref(unit), {
                            id: `@effect/${self.id}/attack`,
                            value: [attribute.create({ finalScaler: scaler })],
                        }),
                    ]);
                }
            }

            return elapsedTicks >= profile.durationTicks
                ? effects.end(battle, reference, "ELEMENTAL_BURST_FINISHED")
                : battle;
        },
        onEnd(battle, self, reason) {
            const host = units.get(battle, self.host)!;
            battle = replace(battle, [
                {
                    ...host,
                    elemental: {
                        ...host.elemental,
                        ep: elementValues(resolveMaxEp(battle, host)),
                        burst: null,
                    },
                },
            ]);
            const end: End =
                reason === "ELEMENTAL_BURST_FINISHED"
                    ? { type: "FINISHED" }
                    : { type: "CANCELLED", reason };

            return dispatch(battle, self.host, "burstEnded", { burst: self, end });
        },
    };
}

export const definitions: Readonly<Record<Type, EffectDefinition<State, Elemental>>> = {
    NEURAL: define("NEURAL"),
    EROSION: define("EROSION"),
    BURN: define("BURN"),
    NECROSIS: define("NECROSIS"),
};

function activeHost(battle: BattleState, reference: Ref<Burst>) {
    const host = units.get(battle, reference.host);

    return host !== undefined &&
        available(host) &&
        getEffect(battle, reference)?.status === "ACTIVE"
        ? host
        : undefined;
}

function hurt(battle: BattleState, host: Unit & Elemental, damage: Damage): BattleState {
    if (!hasVitality(host)) {
        return battle;
    }

    const attack = { power: damage.power, multiplier: 1, addition: 0 };
    const type = damage.type;
    const request: DamageRequest = {
        source: null,
        target: units.ref(host),
        parameters:
            type === "PHYSICAL" || type === "ARTS"
                ? { type, attack, penetration: { fixed: 0, proportional: 0 } }
                : { type, attack },
    };

    return applyDamage(request, calculateDamage(battle, request)).state;
}
