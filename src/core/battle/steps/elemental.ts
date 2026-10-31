import { advance } from "../../unit/capability/elemental/operations.js";
import { hasElemental } from "../../unit/capability/elemental/capability.js";
import * as units from "../../unit/query.js";
import type { State as BattleState } from "../state.js";

export function advanceElements(battle: BattleState): BattleState {
    const candidates = units.all(battle).filter(hasElemental);

    for (const unit of candidates) {
        battle = advance(battle, units.ref(unit));
    }

    return battle;
}
