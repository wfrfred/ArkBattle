import {
    create as createAttack,
    faceTarget,
    sourceAttack,
    type Attack as BaseAttack,
} from "../../actions/attack.js";
import type { Ref } from "../../../core/common/ref.js";
import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
} from "../../../core/battle/resource/hp/damage/index.js";

import * as units from "../../../core/unit/index.js";
import type { Unit } from "../../../core/unit/index.js";
import type { Timing as AttackTiming } from "../../actions/timing.js";
import type { Profile } from "../../../data/unit/enemy.js";
import { perSecondToPerTick } from "../../../data/time.js";
import { assertNonnegativeSafeInteger, assertPositiveNumber } from "../../../core/common/assert.js";
import * as projectiles from "../../../core/projectile/index.js";
import type { Projectile as ProjectileInstance } from "../../../core/projectile/index.js";
import type { State as BattleState } from "../../../core/battle/index.js";
import * as tracking from "../../projectiles/tracking.js";
import { resolveAttack, type Offense } from "../../../core/unit/capability/offense/index.js";

import { hasVitality } from "../../../core/unit/capability/vitality/index.js";
import * as targeting from "../../../core/battle/targeting/index.js";
import type { Blockable } from "../../../core/unit/capability/blocking/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";
import { topK } from "../../../core/common/collection/order.js";

export interface Timing {
    readonly melee: AttackTiming;
    readonly ranged: AttackTiming;
}

export type Host = Classification & Blockable & Offense;

export type Attack = BaseAttack<object, object, Host>;

interface ArrowState extends tracking.State {
    readonly source: Ref<Unit & Offense> | null;
    readonly cachedAtk: number;
}

export interface Projectile {
    readonly definition: tracking.Definition<ArrowState>;
    readonly speedPerSecond: number;
    readonly stopDelayTicks: number;
}

const arrowApplyWay = "RANGED";

export function createArrow(): tracking.Definition<ArrowState> {
    const hit = (battle: BattleState, self: ProjectileInstance<ArrowState>): BattleState =>
        tracking.hit(battle, self, (state, current, target) => {
            const sourceRef = current.state.source;
            const source = sourceRef === null ? undefined : units.get(state, sourceRef);
            const request: DamageRequest = {
                attackType: "NORMAL",
                applyWay: arrowApplyWay,
                source: source === undefined ? null : sourceRef,
                killer: sourceRef,
                target: units.ref(target),
                nature: "DAMAGE",
                hitRecovery: true,
                parameters: {
                    type: "PHYSICAL",
                    attack: {
                        power:
                            source === undefined
                                ? current.state.cachedAtk
                                : resolveAttack(state, source),
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
        onTick: (battle, self) => tracking.advance(battle, self, 1, hit),
        onEnd: (battle, self, reason) => (reason === "ELIMINATED" ? battle : hit(battle, self)),
    };
}

export function createMelee(timing: Timing): Attack {
    return createAttack<Host>({
        id: "melee",
        onStart: faceTarget,
        triggerBindingId: "primary",
        period: { type: "ATTACK_SPEED" },
        timing: timing.melee,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined) {
                        return { state: battle, value: [] };
                    }

                    const owner = self.blockable.relation?.blocker;
                    const target = owner === undefined ? undefined : units.get(battle, owner);
                    if (target === undefined || !hasTargetable(target)) {
                        return { state: battle, value: [] };
                    }

                    const eligible = targeting.damage(self, () => true)(battle);

                    return {
                        state: battle,
                        value: eligible(target) ? [units.ref(target)] : [],
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        attackType: "NORMAL",
                        applyWay: "MELEE",
                        power: sourceAttack,
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

    return createAttack<Host>({
        id: "ranged",
        applyWay: arrowApplyWay,
        onStart: faceTarget,
        triggerBindingId: "primary",
        period: { type: "ATTACK_SPEED" },
        timing: timing.ranged,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined) {
                        return { state: battle, value: [] };
                    }

                    const blocker = self.blockable.relation?.blocker;
                    const candidates = units
                        .all(battle)
                        .filter(hasTargetable)
                        .filter(targeting.inCategories(["DEFAULT"]))
                        .filter(targeting.damage(self)(battle))
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
                operations: [],
            },
        ],
        output: (state, host, self) => {
            const source = units.get(state, host);
            const target = units.get(state, self.execution.state.target);
            if (source === undefined || target === undefined || !hasVitality(target)) {
                return state;
            }

            const initialized = projectiles.initialize(state, {
                definition: projectile.definition,
                side: source.definition.classification.side,
                position: source.position,
                state: {
                    source: units.ref(source),
                    target: units.ref(target),
                    destination: target.position,
                    cachedAtk: resolveAttack(state, source),
                    speedPerTick: perSecondToPerTick(projectile.speedPerSecond),
                    stopDelayTicks: projectile.stopDelayTicks,
                    stopAtTick: null,
                    hitAttempted: false,
                    launchedAtTick: state.tick,
                },
            });

            return projectiles.add(initialized.state, initialized.value);
        },
    });
}
