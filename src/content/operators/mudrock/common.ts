import type { State as BattleState } from "../../../core/battle/state.js";
import type { Id } from "../../../core/unit/unit.js";
import { ref as unitRef } from "../../../core/unit/query.js";
import { hasVitality, resolveMaxHp } from "../../../core/unit/capability/vitality/capability.js";
import { calculateHealing } from "../../../core/battle/healing/calculate.js";
import { applyHealing } from "../../../core/battle/healing/apply.js";
import type { HealingRequest } from "../../../core/battle/healing/contract.js";
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
