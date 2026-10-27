import type { State as BattleState } from "../../../core/battle/index.js";
import { type Id, ref as unitRef } from "../../../core/unit/index.js";

import { hasVitality, resolveMaxHp } from "../../../core/unit/capability/vitality/index.js";
import {
    calculateHealing,
    applyHealing,
    type HealingRequest,
} from "../../../core/battle/healing/index.js";

import type { Profile } from "../../../data/arknights/operator.js";

export function value(entries: Profile["moduleTrait"], key: string): number {
    const entry = entries.find((entry) => entry.key === key);
    if (entry === undefined) {
        throw new TypeError(`Mudrock content requires ${key}`);
    }

    return entry.value;
}

export function healSelf(state: BattleState, unitId: Id, ratio: number): BattleState {
    const unit = state.battlefield.units.get(unitId);
    if (unit === undefined || !hasVitality(unit)) {
        return state;
    }

    const maxHp = resolveMaxHp(unit.vitality, unit.definition.vitality);
    const request: HealingRequest = {
        source: unitRef(unit),
        target: unitRef(unit),
        parameters: { power: maxHp * ratio, multiplier: 1 },
    };

    return applyHealing(request, calculateHealing(state, request)).state;
}
