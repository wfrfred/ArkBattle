import { Vec2 } from "../../../common/vector.js";
import type { State as BattleState } from "../../../battle/state.js";
import { effectiveMap } from "../../../battlefield/navigation/query.js";
import { World } from "../../../geometry/coordinate.js";
import { allows } from "../../../restriction.js";
import type { Unit } from "../../unit.js";
import * as attribute from "../../attribute.js";
import type { Locomotion } from "./capability.js";
import { nearestPassableNeighbor } from "./avoidance.js";

export function resolveMovement(battle: BattleState, self: Unit & Locomotion) {
    if (self.lifecycle !== "ACTIVE" || !allows(battle, { self }, self.locomotion.restrictions)) {
        return null;
    }

    const map = effectiveMap(battle.battlefield.navigation, self.locomotion.mode);
    let target = self.locomotion.target;
    if (target === null) {
        const tile = World.toTile(self.position);
        if (map.get(tile)?.passable !== false) {
            return null;
        }

        const goal = nearestPassableNeighbor(map, tile, self.position);
        if (goal === null) {
            return null;
        }

        target = { nextPoint: goal, goal };
    }

    const speed =
        attribute.resolve(self.definition.locomotion.speed, self.locomotion.speed, battle, self) *
        battle.definition.moveMultiplier;

    return speed > 0 ? { map, target, speed } : null;
}

export function isMoving(battle: BattleState, self: Unit & Locomotion): boolean {
    const movement = resolveMovement(battle, self);

    return movement !== null && !Vec2.equal(self.position, movement.target.goal);
}
