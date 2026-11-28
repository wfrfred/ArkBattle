import { hasRoute } from "../../unit/capability/route/capability.js";
import * as route from "../../unit/capability/route/operations.js";
import { hasLocomotion } from "../../unit/capability/locomotion/capability.js";
import { hasBlockable } from "../../unit/capability/blocking/blockable/blockable.js";
import * as blockable from "../../unit/capability/blocking/blockable/operations.js";
import * as locomotion from "../../unit/capability/locomotion/operations.js";
import { hasShiftable } from "../../unit/capability/shifting/shiftable.js";
import * as unbalance from "../../unit/capability/shifting/unbalance.js";
import * as units from "../../unit/query.js";
import type { State as BattleState } from "../state.js";

export function advanceMovement(battle: BattleState): BattleState {
    const candidates = units.all(battle);

    for (const unit of candidates.filter(hasBlockable)) {
        battle = blockable.advanceOffset(battle, units.ref(unit));
    }

    for (const initial of candidates) {
        const ref = units.ref(initial);
        if (hasRoute(initial)) {
            battle = route.advance(battle, units.ref(initial));
        }

        const unit = ref.get(battle);
        if (unit?.lifecycle !== "ACTIVE" || !hasLocomotion(unit)) {
            continue;
        }

        const current = hasShiftable(unit) ? unit.shiftable.unbalance : null;
        battle = locomotion.advance(battle, units.ref(unit));

        if (current?.lifecycle === "ACTIVE") {
            battle = unbalance.advance(battle, unbalance.ref(current));
        }
    }

    return battle;
}
