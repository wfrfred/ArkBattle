import type { State as BattleState } from "../../core/battle/state.js";
import type { Ref } from "../../core/common/ref.js";
import * as units from "../../core/unit/index.js";
import type { Execution } from "../../core/unit/capability/action/index.js";
import { resolveAttack, type Offense } from "../../core/unit/capability/offense/index.js";
import { hasVitality } from "../../core/unit/capability/vitality/index.js";
import {
    applyDamage,
    calculateDamage,
    type Request as DamageRequest,
} from "../../core/battle/resource/hp/damage/index.js";
import type { State as AttackState } from "./attack.js";

export function normalMeleeOutput(
    battle: BattleState,
    host: Ref<units.Unit & Offense>,
    self: Execution<AttackState>,
): BattleState {
    const receiver = self.state.targets[0].get(battle);
    if (receiver === undefined || !hasVitality(receiver)) {
        return battle;
    }

    const source = host.get(battle);
    if (source === undefined) {
        return battle;
    }

    const request: DamageRequest = {
        attackType: "NORMAL",
        applyWay: "MELEE",
        source: host,
        killer: host,
        target: units.ref(receiver),
        nature: "DAMAGE",
        hitRecovery: true,
        parameters: {
            type: "PHYSICAL",
            attack: { power: resolveAttack(battle, source), multiplier: 1, addition: 0 },
            penetration: { fixed: 0, proportional: 0 },
        },
    };

    return applyDamage(request, calculateDamage(battle, request, null), null).state;
}
