import type { State as BattleState } from "../../battle/state.js";
import type { DamageType, Request } from "../../battle/damage/hp/contract.js";
import { calculateDamage } from "../../battle/damage/hp/calculate.js";
import { applyDamage } from "../../battle/damage/hp/apply.js";
import * as units from "../../unit/query.js";
import type { Unit } from "../../unit/unit.js";
import { hasVitality } from "../../unit/capability/vitality/capability.js";

export function hurt(
    battle: BattleState,
    host: Unit,
    type: DamageType,
    power: number,
): BattleState {
    if (!hasVitality(host)) {
        return battle;
    }

    const attack = { power, multiplier: 1, addition: 0 };
    const request: Request = {
        source: null,
        target: units.ref(host),
        nature: "DAMAGE",
        hitRecovery: false,
        parameters:
            type === "PHYSICAL" || type === "ARTS"
                ? { type, attack, penetration: { fixed: 0, proportional: 0 } }
                : { type, attack },
    };

    return applyDamage(request, calculateDamage(battle, request)).state;
}
