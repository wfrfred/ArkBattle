import { create as createAttack, type Attack } from "../../actions/attack.js";
import { calculateDamage } from "../../../core/battle/damage/calculate.js";
import { applyDamage } from "../../../core/battle/damage/apply.js";
import type { DamageRequest } from "../../../core/battle/damage/contract.js";
import * as units from "../../../core/unit/query.js";
import type { Profile } from "../../../data/arknights/enemy.js";
import { perSecondToPerTick, secondsToTicks } from "../../../data/arknights/tick.js";
import { assertNonnegativeSafeInteger, assertPositiveNumber } from "../../../core/common/assert.js";
import { create as createProjectile } from "../../../core/battle/projectile.js";
import type { Projectile as ProjectileInstance } from "../../../core/projectile/projectile.js";
import type { State as BattleState } from "../../../core/battle/state.js";
import * as tracking from "../../projectiles/tracking.js";
import { hasOffense } from "../../../core/unit/capability/offense/capability.js";
import { resolveAttack } from "../../../core/unit/capability/offense/query.js";
import { hasVitality } from "../../../core/unit/capability/vitality/capability.js";
import * as filters from "../../../core/battle/targeting/filter.js";
import * as compare from "../../../core/battle/targeting/compare.js";
import { first } from "../../../core/battle/targeting/selector.js";

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
        onAdvance: (battle, self) => tracking.advance(battle, self, hit),
        onTerminate: (battle, self, reason) => (reason === "DISPEL" ? battle : hit(battle, self)),
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
                targeting: {
                    purposes: ["DAMAGE"],
                    filter: filters.and(
                        filters.present,
                        filters.alive,
                        filters.hostile,
                        filters.blocker,
                    ),
                    selector: first(1, compare.distance),
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
                targeting: {
                    purposes: ["DAMAGE"],
                    filter: filters.and(
                        filters.damage,
                        filters.not(filters.blocker),
                        filters.range([
                            { type: "CIRCLE", offset: [0, 0], radius: profile.rangeRadius },
                        ]),
                    ),
                    selector: first(1, compare.distance),
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

            const cachedAtk = hasOffense(source) ? resolveAttack(state, units.ref(source)) : 0;

            if (cachedAtk === undefined) {
                throw new Error("enemy arrow action requires Offense");
            }

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
