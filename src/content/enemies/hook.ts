import type { Result, State as BattleState } from "../../core/battle/state.js";
import { Vec2 } from "../../core/common/vector.js";
import { hasAction, hasExecution } from "../../core/unit/capability/action/index.js";
import { fromVector, hasFacing, turn } from "../../core/unit/capability/facing/index.js";
import {
    hasLocomotion,
    setRestriction,
    type Restriction,
} from "../../core/unit/capability/locomotion/index.js";
import { hasRoute, movementTarget } from "../../core/unit/capability/route/index.js";
import { ref, update, type Unit } from "../../core/unit/index.js";

const castingRestriction: Restriction = {
    allows: (battle, { self }) => !hasAction(self) || !hasExecution(battle, ref(self), null),
};

export function restrictMovementDuringAction(battle: BattleState, self: Unit): Result<void> {
    if (hasLocomotion(self)) {
        battle = update(
            battle,
            ref(self),
            setRestriction({ id: "attack-casting", group: null, value: castingRestriction }),
        );
    }

    return { state: battle, value: undefined };
}

export function faceRoute(battle: BattleState, self: Unit): Result<void> {
    const current = ref(self).get(battle);
    if (current !== undefined && hasRoute(current) && hasFacing(current)) {
        const target = movementTarget(battle, ref(current));
        const direction =
            target === null ? null : fromVector(Vec2.sub(target.nextPoint, current.position));
        if (direction !== null) {
            battle = turn(battle, ref(current), direction, "FORCED");
        }
    }

    return { state: battle, value: undefined };
}
