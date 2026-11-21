import type { State as BattleState } from "../../../core/battle/index.js";
import {
    calculateDamage,
    applyDamage,
    type Request as DamageRequest,
} from "../../../core/battle/resource/hp/damage/index.js";
import type { Ref } from "../../../core/common/ref.js";
import type { Projectile as ProjectileInstance } from "../../../core/projectile/index.js";
import { resolveAttack, type Offense } from "../../../core/unit/capability/offense/index.js";
import * as units from "../../../core/unit/index.js";
import * as tracking from "../../projectiles/tracking.js";

interface ArrowState extends tracking.State {
    readonly source: Ref<units.Unit & Offense> | null;
    readonly cachedAtk: number;
}

export interface Projectile {
    readonly definition: tracking.Definition<ArrowState>;
    readonly speedPerSecond: number;
    readonly stopDelayTicks: number;
}

export const arrowApplyWay = "RANGED";

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
