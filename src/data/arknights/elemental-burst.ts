import { update as updateUnit } from "../../core/battle/unit.js";
import type { Ref } from "../../core/common/ref.js";
import type { State as BattleState } from "../../core/battle/index.js";
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
import { hasSkill, modify } from "../../core/unit/capability/skill/index.js";

import {
    type DamageRequest,
    calculateDamage,
    applyDamage,
} from "../../core/battle/damage/index.js";

import * as attribute from "../../core/unit/contribution/attribute.js";
import { stun } from "../../content/effects/stun.js";
import { silence, blockSpRecovery } from "../../content/effects/control.js";
import type { ArknightsElementalBurstProfile } from "./elemental.js";

interface Clock {
    readonly elapsedTicks: number;
    readonly lastAdvancedTick: number;
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

            let vitality = unit.vitality;

            if (self.data.defense !== 0) {
                vitality = setDefenseContribution(vitality, {
                    id: `@effect/${self.id}/defense`,
                    value: [attribute.create({ addition: -self.data.defense })],
                });
            }
            if (self.data.resistance !== 0) {
                vitality = setResistanceContribution(vitality, {
                    id: `@effect/${self.id}/resistance`,
                    value: [attribute.create({ addition: -self.data.resistance })],
                });
            }

            return vitality === unit.vitality
                ? battle
                : updateUnit(battle, [{ ...unit, vitality }]);
        },
        onDisable: (battle, self) => {
            const unit = units.get(battle, self.host);

            if (unit === undefined) {
                return battle;
            }

            const vitality = removeResistanceContribution(
                removeDefenseContribution(unit.vitality, `@effect/${self.id}/defense`),
                `@effect/${self.id}/resistance`,
            );

            return vitality === unit.vitality
                ? battle
                : updateUnit(battle, [{ ...unit, vitality }]);
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
                {
                    ...unit,
                    action: setBeforeReleaseHook(unit.action, {
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
                                    scopes: [{ type: "TICK", tick: battle.tick + recoveryTicks }],
                                }).state;
                            }

                            return { state: battle, value: { type: "INTERRUPT", recoveryTicks } };
                        },
                    }),
                },
            ]);
        },
        onEnd: (battle, self) => {
            const unit = units.get(battle, self.host);

            return unit === undefined
                ? battle
                : updateUnit(battle, [
                      {
                          ...unit,
                          action: removeBeforeReleaseHook(
                              unit.action,
                              `@effect/${self.id}/paralysis`,
                          ),
                      },
                  ]);
        },
    };
    const periodic: EffectDefinition<Clock, Elemental> = {
        id: `${id}/periodic`,
        initialize: () => ({
            elapsedTicks: 0,
            lastAdvancedTick: 0,
            scaler: 1 - profile.attackReductionRatio,
        }),
        onEnable: (battle, self) => {
            const unit = units.get(battle, self.host);

            return unit !== undefined && profile.attackReductionRatio > 0 && hasOffense(unit)
                ? updateUnit(battle, [
                      {
                          ...unit,
                          offense: setAttackContribution(unit.offense, {
                              id: `@effect/${self.id}/attack`,
                              value: [attribute.create({ finalScaler: self.data.scaler })],
                          }),
                      },
                  ])
                : battle;
        },
        onDisable: (battle, self) => {
            const unit = units.get(battle, self.host);

            return unit !== undefined && profile.attackReductionRatio > 0 && hasOffense(unit)
                ? updateUnit(battle, [
                      {
                          ...unit,
                          offense: removeAttackContribution(
                              unit.offense,
                              `@effect/${self.id}/attack`,
                          ),
                      },
                  ])
                : battle;
        },
        onTick: (battle, self) => {
            const ref = effectRef(self);
            const scope = self.scopes.find((scope) => scope.type === "ELEMENTAL_BURST");

            if (scope === undefined || getBurst(battle, scope.ref)?.status !== "ACTIVE") {
                return battle;
            }

            const rate =
                activeHost(battle, scope.ref) === undefined
                    ? 0
                    : resolveBurstRecoverySpeed(battle, self.host)!;
            const elapsedTicks = Math.min(
                profile.durationTicks,
                self.data.elapsedTicks + (battle.tick - self.data.lastAdvancedTick) * rate,
            );
            const previousSecond = Math.floor((self.data.elapsedTicks + 1e-8) / TICKS_PER_SECOND);
            const currentSecond = Math.floor((elapsedTicks + 1e-8) / TICKS_PER_SECOND);
            battle = effects.setData(battle, ref, {
                ...self.data,
                elapsedTicks,
                lastAdvancedTick: battle.tick,
            });

            for (let second = previousSecond + 1; second <= currentSecond; second++) {
                let unit = activeHost(battle, scope.ref);

                if (unit === undefined || effects.get(battle, ref)?.status !== "ACTIVE") {
                    return battle;
                }
                if (profile.spDrainPerSecond > 0 && hasSkill(unit)) {
                    battle = modify(battle, units.ref(unit), -profile.spDrainPerSecond).state;
                }

                unit = activeHost(battle, scope.ref);

                if (unit === undefined || effects.get(battle, ref)?.status !== "ACTIVE") {
                    return battle;
                }
                if (profile.damagePerSecond !== null) {
                    battle = hurt(battle, scope.ref, profile.damagePerSecond);
                }

                unit = activeHost(battle, scope.ref);
                const current = effects.get(battle, ref);

                if (unit === undefined || current?.status !== "ACTIVE") {
                    return battle;
                }
                if (profile.attackReductionRatio > 0 && hasOffense(unit)) {
                    const durationSeconds = profile.durationTicks / TICKS_PER_SECOND;
                    const scaler =
                        1 -
                        profile.attackReductionRatio * Math.max(0, 1 - second / durationSeconds);
                    battle = effects.setData(battle, ref, { ...current.data, scaler });
                    const host = activeHost(battle, scope.ref)!;

                    if (!hasOffense(host)) {
                        return battle;
                    }

                    battle = updateUnit(battle, [
                        {
                            ...host,
                            offense: setAttackContribution(host.offense, {
                                id: `@effect/${self.id}/attack`,
                                value: [attribute.create({ finalScaler: scaler })],
                            }),
                        },
                    ]);
                }
            }

            return battle;
        },
    };
    const controls: readonly EffectDefinition<object>[] = [
        ...(profile.stunTicks > 0 ? [stun] : []),
        ...(profile.blocksSkill ? [silence] : []),
        ...(profile.blocksSpRecovery ? [blockSpRecovery] : []),
    ];

    return Object.freeze({
        durationTicks: profile.durationTicks,
        onStart: (battle: BattleState, self: Burst): BattleState => {
            const ref = burstRef(self);
            const scopes = [{ type: "ELEMENTAL_BURST" as const, ref }];
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
                        lastAdvancedTick: battle.tick,
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
                    const current = unit.effects.get(existing.id, paralysis)!;
                    battle = effects.setData(battle, effectRef(current), {
                        ...current.data,
                        remaining: profile.paralysisStacks,
                    });
                }
            }

            return profile.burstDamage === null ? battle : hurt(battle, ref, profile.burstDamage);
        },
    });
}

function activeHost(battle: BattleState, ref: Ref<Burst>) {
    const host = units.get(battle, ref.host);

    return host !== undefined && available(host) && getBurst(battle, ref)?.status === "ACTIVE"
        ? host
        : undefined;
}

function hurt(
    battle: BattleState,
    ref: Ref<Burst>,
    damage: NonNullable<ArknightsElementalBurstProfile["burstDamage"]>,
): BattleState {
    const host = activeHost(battle, ref);

    if (host === undefined || !hasVitality(host)) {
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
