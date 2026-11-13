import { advance } from "../../unit/capability/vitality/operations.js";
import { hasVitality } from "../../unit/capability/vitality/capability.js";
import * as units from "../../unit/query.js";
import type { State as BattleState } from "../state.js";

export function advanceVitality(battle: BattleState): BattleState {
    const candidates = units.all(battle).filter(hasVitality);

    for (const unit of candidates) {
        battle = advance(battle, units.ref(unit));
    }

    return battle;
}
