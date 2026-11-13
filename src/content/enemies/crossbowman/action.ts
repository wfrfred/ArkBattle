import { create as createAttack, type Attack } from "../../actions/attack.js";
import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
} from "../../../core/battle/damage/hp/index.js";

import * as units from "../../../core/unit/index.js";
import type { Profile } from "../../../data/unit/enemy.js";
import { perSecondToPerTick, secondsToTicks } from "../../../data/time.js";
import { assertNonnegativeSafeInteger, assertPositiveNumber } from "../../../core/common/assert.js";
import { create as createProjectile } from "../../../core/battle/projectile.js";
import type { Projectile as ProjectileInstance } from "../../../core/projectile/index.js";
import type { State as BattleState } from "../../../core/battle/index.js";
import * as tracking from "../../projectiles/tracking.js";
import { hasOffense, resolveAttack } from "../../../core/unit/capability/offense/index.js";

import { hasVitality } from "../../../core/unit/capability/vitality/index.js";
import * as targeting from "../../../core/battle/targeting/index.js";
import { hasBlockable } from "../../../core/unit/capability/blocking/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import { hasAllegiance } from "../../../core/unit/capability/allegiance/capability.js";
import { topK } from "../../../core/common/collection.js";

export interface Timing {
    readonly windupTicks: number;
    readonly recoveryTicks: number;
}

export interface Projectile {
    readonly definition: tracking.Definition;
    readonly speedPerSecond: number;
    readonly stopDelayTicks: number;
}

export function createArrow(): tracking.Definition {
    const hit = (battle: BattleState, self: ProjectileInstance<tracking.State>): BattleState =>
        tracking.hit(battle, self, (state, current, target) => {
            const source = current.state.source;
            const request: DamageRequest = {
                source: source !== null && units.get(state, source) !== undefined ? source : null,
                target: units.ref(target),
                nature: "DAMAGE",
                hitRecovery: true,
                parameters: {
                    type: "PHYSICAL",
                    attack: {
                        power: tracking.attackPower(state, current),
                        multiplier: 1,
                        addition: 0,
                    },
                    penetration: { fixed: 0, proportional: 0 },
                },
            };

            return applyDamage(request, calculateDamage(state, request)).state;
        });

    return {
        id: "main-mode-crossbow-arrow",
        tracking: true,
        onTick: (battle, self) => tracking.advance(battle, self, hit),
        onEnd: (battle, self, reason) => (reason === "DISPEL" ? battle : hit(battle, self)),
    };
}

export function createMelee(profile: Profile, timing: Timing): Attack {
    return createAttack({
        id: "melee",
        speed: profile.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: secondsToTicks(profile.baseAttackTime),
        windupTicks: timing.windupTicks,
        recoveryTicks: timing.recoveryTicks,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined || !hasAllegiance(self)) {
                        return { state: battle, value: [] };
                    }

                    const owner = hasBlockable(self) ? self.blockable.relation?.blocker : undefined;
                    const target = owner === undefined ? undefined : units.get(battle, owner);
                    if (target === undefined || !hasTargetable(target)) {
                        return { state: battle, value: [] };
                    }

                    const eligible = targeting.damage(battle, self, () => true);

                    return {
                        state: battle,
                        value: eligible(target) ? [units.ref(target)] : [],
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        power: profile.attack,
                        powerSource: "SOURCE_ATTACK",
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
    });
}

export function createRanged(profile: Profile, timing: Timing, projectile: Projectile): Attack {
    assertPositiveNumber(projectile.speedPerSecond, "enemy arrow speed");
    assertNonnegativeSafeInteger(projectile.stopDelayTicks, "enemy arrow stop delay");

    return createAttack({
        id: "ranged",
        speed: profile.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: secondsToTicks(profile.baseAttackTime),
        windupTicks: timing.windupTicks,
        recoveryTicks: timing.recoveryTicks,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined || !hasAllegiance(self)) {
                        return { state: battle, value: [] };
                    }

                    const blocker = hasBlockable(self)
                        ? self.blockable.relation?.blocker
                        : undefined;
                    const candidates = units
                        .all(battle)
                        .filter(hasTargetable)
                        .filter(targeting.damage(battle, self))
                        .filter((target) => target.id !== blocker?.id)
                        .filter(
                            targeting.inRange(self.position, [
                                { type: "CIRCLE", offset: [0, 0], radius: profile.rangeRadius },
                            ]),
                        );

                    return {
                        state: battle,
                        value: topK(candidates, 1, targeting.distance(self.position)).map(
                            units.ref,
                        ),
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        power: profile.attack,
                        powerSource: "SOURCE_ATTACK",
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
        output: (state, host, self) => {
            const source = units.get(state, host);
            const target = units.get(state, self.execution.state.target);
            if (source === undefined || target === undefined || !hasVitality(target)) {
                return state;
            }

            const cachedAtk = hasOffense(source) ? resolveAttack(state, source) : 0;

            return createProjectile(state, projectile.definition, {
                position: source.position,
                state: {
                    source: units.ref(source),
                    target: units.ref(target),
                    destination: target.position,
                    cachedAtk,
                    speedPerTick: perSecondToPerTick(projectile.speedPerSecond),
                    stopDelayTicks: projectile.stopDelayTicks,
                    stopAtTick: null,
                    hitAttempted: false,
                    launchedAtTick: state.tick,
                },
            }).state;
        },
    });
}
