import { update as updateUnit } from "../../core/battle/unit.js";
import type { Ref } from "../../core/common/ref.js";
import type { State as BattleState } from "../../core/battle/index.js";
import { dependencies, getRef, scope } from "../../core/lifetime/index.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";
import * as units from "../../core/unit/index.js";
import * as effects from "../../core/unit/effect/index.js";
import {
    ref as effectRef,
    type Definition as EffectDefinition,
} from "../../core/unit/effect/index.js";

import {
    ref as burstRef,
    type Burst,
    type BurstDefinition as Definition,
    type Elemental,
    available,
    get as getBurst,
    resolveBurstRecoverySpeed,
    lifetime as burstLifetime,
} from "../../core/unit/capability/elemental/index.js";

import {
    hasAction,
    setBeforeReleaseHook,
    removeBeforeReleaseHook,
    type Action,
} from "../../core/unit/capability/action/index.js";
import {
    hasVitality,
    setDefenseContribution,
    removeDefenseContribution,
    setResistanceContribution,
    removeResistanceContribution,
    type Vitality,
} from "../../core/unit/capability/vitality/index.js";
import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
} from "../../core/unit/capability/offense/index.js";
import { modify } from "../../core/unit/skill/index.js";
import { hasSkill } from "../../core/unit/capability/skill/index.js";

import {
    type Request as DamageRequest,
    calculateDamage,
    applyDamage,
} from "../../core/battle/damage/hp/index.js";

import * as attribute from "../../core/unit/contribution/attribute.js";
import { stun } from "../../content/effects/stun.js";
import { silence, blockSpRecovery } from "../../content/effects/control.js";
import type { ArknightsElementalBurstProfile } from "./elemental.js";

interface Clock {
    readonly elapsedTicks: number;
    readonly scaler: number;
}

export function create(id: string, profile: ArknightsElementalBurstProfile): Definition {
    const reduction: EffectDefinition<{ defense: number; resistance: number }, Vitality> = {
        id: `${id}/defense`,
        initialize: () => ({
            defense: profile.defReduction,
            resistance: profile.resReduction,
        }),
        onEnable: (battle, self) => {
            const unit = units.get(battle, self.host);
            if (unit === undefined) {
                return battle;
            }

            const changes: units.Change[] = [];

            if (self.data.defense !== 0) {
                changes.push(
                    setDefenseContribution(units.ref(unit), {
                        id: `@effect/${self.id}/defense`,
                        value: [attribute.create({ addition: -self.data.defense })],
                    }),
                );
            }
            if (self.data.resistance !== 0) {
                changes.push(
                    setResistanceContribution(units.ref(unit), {
                        id: `@effect/${self.id}/resistance`,
                        value: [attribute.create({ addition: -self.data.resistance })],
                    }),
                );
            }

            return updateUnit(battle, changes);
        },
        onDisable: (battle, self) => {
            const unit = units.get(battle, self.host);
            if (unit === undefined) {
                return battle;
            }

            return updateUnit(battle, [
                removeDefenseContribution(units.ref(unit), `@effect/${self.id}/defense`),
                removeResistanceContribution(units.ref(unit), `@effect/${self.id}/resistance`),
            ]);
        },
    };
    const paralysis: EffectDefinition<{ remaining: number }, Action> = {
        id: `${id}/paralysis`,
        initialize: () => ({ remaining: profile.paralysisStacks }),
        onInstall: (battle, self) => {
            const unit = units.get(battle, self.host);
            if (unit === undefined) {
                return battle;
            }

            const effectId = self.id;

            return updateUnit(battle, [
                setBeforeReleaseHook(units.ref(unit), {
                    id: `@effect/${effectId}/paralysis`,
                    accepts: (battle, context) => {
                        const current = units
                            .get(battle, context.source)
                            ?.effects.get(effectId, paralysis);

                        return current?.status === "ACTIVE" && current.data.remaining > 0;
                    },
                    invoke: (battle, context) => {
                        const self = units
                            .get(battle, context.source)!
                            .effects.get(effectId, paralysis)!;
                        const ref = effectRef(self);
                        const remaining = self.data.remaining - 1;
                        battle = effects.setData(battle, ref, {
                            ...self.data,
                            remaining,
                        });

                        if (remaining === 0) {
                            battle = effects.end(battle, ref, "EXPLICIT");
                        }

                        const recoveryTicks = TICKS_PER_SECOND / 2;
                        const current = units.get(battle, self.host);
                        if (current?.lifecycle === "PRESENT") {
                            battle = effects.install(battle, self.host, stun, {
                                deadline: battle.tick + recoveryTicks,
                            }).state;
                        }

                        return { state: battle, value: { type: "INTERRUPT", recoveryTicks } };
                    },
                }),
            ]);
        },
        onEnd: (battle, self) => {
            const unit = units.get(battle, self.host);

            return unit === undefined
                ? battle
                : updateUnit(battle, [
                      removeBeforeReleaseHook(units.ref(unit), `@effect/${self.id}/paralysis`),
                  ]);
        },
    };
    const periodic: EffectDefinition<Clock, Elemental> = {
        id: `${id}/periodic`,
        initialize: () => ({
            elapsedTicks: 0,
            scaler: 1 - profile.attackReductionRatio,
        }),
        onEnable: (battle, self) => {
            const unit = units.get(battle, self.host);

            return unit !== undefined && profile.attackReductionRatio > 0 && hasOffense(unit)
                ? updateUnit(battle, [
                      setAttackContribution(units.ref(unit), {
                          id: `@effect/${self.id}/attack`,
                          value: [attribute.create({ finalScaler: self.data.scaler })],
                      }),
                  ])
                : battle;
        },
        onDisable: (battle, self) => {
            const unit = units.get(battle, self.host);

            return unit !== undefined && profile.attackReductionRatio > 0 && hasOffense(unit)
                ? updateUnit(battle, [
                      removeAttackContribution(units.ref(unit), `@effect/${self.id}/attack`),
                  ])
                : battle;
        },
        onTick: advancePeriodic,
        onEnd: (battle, self, reason) =>
            reason === "ELEMENTAL_BURST_FINISHED" ? advancePeriodic(battle, self) : battle,
    };

    function advancePeriodic(
        battle: BattleState,
        self: effects.Effect<Clock, Elemental>,
    ): BattleState {
        const ref = effectRef(self);
        const reference = dependencies(battle, scope(effects.lifetime, ref))
            .map((entry) => getRef(entry, burstLifetime))
            .find((reference) => reference !== undefined);
        const burst = reference === undefined ? undefined : getBurst(battle, reference);
        const ending = self.status === "ENDING";
        if (
            reference === undefined ||
            burst === undefined ||
            (ending ? burst.remainingTicks !== 0 : burst.status !== "ACTIVE")
        ) {
            return battle;
        }

        const currentHost = (state: BattleState) => {
            const host = units.get(state, self.host);

            return host !== undefined &&
                available(host) &&
                getBurst(state, reference)?.status === burst.status &&
                effects.get(state, ref)?.status === self.status
                ? host
                : undefined;
        };
        if (currentHost(battle) === undefined) {
            return battle;
        }

        const elapsedTicks = ending
            ? profile.durationTicks
            : Math.min(
                  profile.durationTicks,
                  self.data.elapsedTicks + resolveBurstRecoverySpeed(battle, self.host)!,
              );
        const previousSecond = Math.floor((self.data.elapsedTicks + 1e-8) / TICKS_PER_SECOND);
        const currentSecond = Math.floor((elapsedTicks + 1e-8) / TICKS_PER_SECOND);
        battle = effects.setData(battle, ref, {
            ...self.data,
            elapsedTicks,
        });

        for (let second = previousSecond + 1; second <= currentSecond; second++) {
            let unit = currentHost(battle);
            if (unit === undefined) {
                return battle;
            }
            if (profile.spDrainPerSecond > 0 && hasSkill(unit)) {
                battle = modify(battle, units.ref(unit), -profile.spDrainPerSecond).state;
            }

            unit = currentHost(battle);

            if (unit === undefined) {
                return battle;
            }
            if (profile.damagePerSecond !== null) {
                battle = hurt(battle, unit, profile.damagePerSecond);
            }

            unit = currentHost(battle);
            const current = effects.get(battle, ref);
            if (unit === undefined) {
                return battle;
            }
            if (!ending && profile.attackReductionRatio > 0 && hasOffense(unit)) {
                const durationSeconds = profile.durationTicks / TICKS_PER_SECOND;
                const scaler =
                    1 - profile.attackReductionRatio * Math.max(0, 1 - second / durationSeconds);
                battle = effects.setData(battle, ref, { ...current!.data, scaler });
                battle = updateUnit(battle, [
                    setAttackContribution(units.ref(unit), {
                        id: `@effect/${self.id}/attack`,
                        value: [attribute.create({ finalScaler: scaler })],
                    }),
                ]);
            }
        }

        return battle;
    }

    const controls: readonly EffectDefinition<object>[] = [
        ...(profile.stunTicks > 0 ? [stun] : []),
        ...(profile.blocksSkill ? [silence] : []),
        ...(profile.blocksSpRecovery ? [blockSpRecovery] : []),
    ];

    return {
        durationTicks: profile.durationTicks,
        onStart: (battle: BattleState, self: Burst): BattleState => {
            const ref = burstRef(self);
            const scopes = [scope(burstLifetime, ref)];
            let unit = activeHost(battle, ref);
            if (unit === undefined) {
                return battle;
            }
            if (hasVitality(unit) && (profile.defReduction !== 0 || profile.resReduction !== 0)) {
                battle = effects.install(battle, units.ref(unit), reduction, {
                    scopes: profile.defReduction > 0 ? [] : scopes,
                }).state;
            }

            for (const control of controls) {
                unit = activeHost(battle, ref);

                if (unit === undefined) {
                    return battle;
                }

                battle = effects.install(battle, self.host, control, { scopes }).state;
            }

            unit = activeHost(battle, ref);

            if (unit === undefined) {
                return battle;
            }
            if (
                profile.damagePerSecond !== null ||
                profile.spDrainPerSecond > 0 ||
                profile.attackReductionRatio > 0
            ) {
                battle = effects.install(battle, self.host, periodic, {
                    scopes,
                    data: {
                        elapsedTicks: 0,
                        scaler: 1 - profile.attackReductionRatio,
                    },
                }).state;
            }

            unit = activeHost(battle, ref);

            if (unit === undefined) {
                return battle;
            }
            if (profile.paralysisStacks > 0 && hasAction(unit)) {
                const existing = unit.effects
                    .values()
                    .find(
                        (effect) => effect.definition === paralysis && effect.status !== "ENDING",
                    );
                if (existing === undefined) {
                    battle = effects.install(battle, units.ref(unit), paralysis).state;
                } else {
                    const current = existing as effects.Effect<{ remaining: number }, Action>;
                    battle = effects.setData(battle, effectRef(current), {
                        ...current.data,
                        remaining: profile.paralysisStacks,
                    });
                }
            }

            unit = activeHost(battle, ref);

            return profile.burstDamage === null || unit === undefined
                ? battle
                : hurt(battle, unit, profile.burstDamage);
        },
    };
}

function activeHost(battle: BattleState, ref: Ref<Burst>) {
    const host = units.get(battle, ref.host);

    return host !== undefined && available(host) && getBurst(battle, ref)?.status === "ACTIVE"
        ? host
        : undefined;
}

function hurt(
    battle: BattleState,
    host: units.Unit & Elemental,
    damage: NonNullable<ArknightsElementalBurstProfile["burstDamage"]>,
): BattleState {
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
