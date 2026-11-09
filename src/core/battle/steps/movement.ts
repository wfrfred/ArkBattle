import { hasRoute } from "../../unit/capability/route/capability.js";
import * as route from "../../unit/capability/route/operations.js";
import { activeContext, movementTarget } from "../../unit/capability/route/query.js";
import { hasLocomotion } from "../../unit/capability/locomotion/capability.js";
import { hasBlockable } from "../../unit/capability/blocking/blockable.js";
import * as blockable from "../../unit/capability/blocking/blockable-operations.js";
import * as locomotion from "../../unit/capability/locomotion/operations.js";
import * as units from "../../unit/query.js";
import type { State as BattleState } from "../state.js";

export function advanceMovement(
    battle: BattleState,
    { routeMoveMultiplier }: { readonly routeMoveMultiplier: number },
): BattleState {
    const candidates = units.all(battle);

    for (const unit of candidates.filter(hasBlockable)) {
        battle = blockable.advancePosition(battle, units.ref(unit));
    }

    for (const initial of candidates.filter(hasRoute)) {
        const ref = units.ref(initial);
        battle = route.advance(battle, ref);
        const unit = units.get(battle, ref);
        if (
            unit?.lifecycle !== "PRESENT" ||
            (hasBlockable(unit) && unit.blockable.relation !== null) ||
            !hasLocomotion(unit)
        ) {
            continue;
        }

        const target = movementTarget(battle, ref);
        if (target !== null) {
            battle = locomotion.advance(battle, units.ref(unit), target, {
                mode: activeContext(unit).plan.motionMode,
                speedMultiplier: routeMoveMultiplier,
            });
        }
    }

    return battle;
}
