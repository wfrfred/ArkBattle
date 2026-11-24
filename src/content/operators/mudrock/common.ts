import type { State as BattleState } from "../../../core/battle/index.js";
import type { Ref } from "../../../core/common/ref.js";
import { type Unit, ref as unitRef } from "../../../core/unit/index.js";

import { hasVitality, resolveMaxHp } from "../../../core/unit/capability/vitality/index.js";
import {
    calculateHealing,
    applyHealing,
    type Request as HealingRequest,
} from "../../../core/battle/resource/hp/healing/index.js";

export function healSelf(state: BattleState, reference: Ref<Unit>, ratio: number): BattleState {
    const unit = reference.get(state);
    if (unit === undefined || !hasVitality(unit)) {
        return state;
    }

    const maxHp = resolveMaxHp(unit.definition.vitality, unit.vitality);
    const request: HealingRequest = {
        source: reference,
        target: unitRef(unit),
        parameters: { power: maxHp * ratio, multiplier: 1 },
    };

    return applyHealing(request, calculateHealing(state, request)).state;
}
