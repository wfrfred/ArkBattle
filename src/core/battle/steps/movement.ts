import { hasRoute } from "../../unit/capability/route/capability.js";
import * as route from "../../unit/capability/route/operations.js";
import { activeContext, movementTarget } from "../../unit/capability/route/query.js";
import { Vec2 } from "../../common/vector.js";
import {
    hasLocomotion,
    MOVE_SAMPLE_INTERVAL,
} from "../../unit/capability/locomotion/capability.js";
import { hasBlockable } from "../../unit/capability/blocking/blockable.js";
import * as blockable from "../../unit/capability/blocking/blockable-operations.js";
import * as locomotion from "../../unit/capability/locomotion/operations.js";
import { hasShiftable } from "../../unit/capability/shifting/shiftable.js";
import * as unbalance from "../../unit/capability/shifting/unbalance.js";
import { replace } from "../../unit/operations.js";
import * as units from "../../unit/query.js";
import type { State as BattleState } from "../state.js";

export function advanceMovement(
    battle: BattleState,
    { routeMoveMultiplier }: { readonly routeMoveMultiplier: number },
): BattleState {
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
        if (current?.lifecycle === "ACTIVE") {
            battle = unbalance.advance(battle, unbalance.ref(current));
            continue;
        }

        if (!hasRoute(unit) || (hasBlockable(unit) && unit.blockable.relation !== null)) {
            continue;
        }

        const target = movementTarget(battle, units.ref(unit));
        battle = locomotion.advance(battle, units.ref(unit), target, {
            mode: activeContext(unit).plan.motionMode,
            speedMultiplier: routeMoveMultiplier,
        });
    }

    const samples = units
        .all(battle)
        .filter(hasLocomotion)
        .filter(
            (unit) =>
                unit.lifecycle === "ACTIVE" && battle.tick >= unit.locomotion.nextMoveSampleTick,
        )
        .map((unit) => {
            const state = unit.locomotion;

            return {
                ...unit,
                locomotion: {
                    ...state,
                    totalMoveDistance:
                        state.totalMoveDistance +
                        Math.sqrt(
                            Vec2.distanceSquared(unit.position, state.lastMoveSamplePosition),
                        ),
                    lastMoveSamplePosition: unit.position,
                    nextMoveSampleTick: battle.tick + MOVE_SAMPLE_INTERVAL,
                },
            };
        });

    return replace(battle, samples.toArray());
}
