import { Vec2 } from "../../../common/vector.js";
import { replace } from "../../operations.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { Ref } from "../../../common/ref.js";
import { type State as BattleState } from "../../../battle/state.js";
import { effectiveMap } from "../../../battlefield/navigation/query.js";
import { World } from "../../../geometry/coordinate.js";

import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import * as attribute from "../../attribute.js";
import type { Locomotion, MovementContext, MovementTarget } from "./capability.js";
import { isUnbalanced } from "../shifting/shiftable.js";
import { calculate as avoidance, nearestPassableNeighbor } from "./avoidance.js";
import { reflect } from "./motion.js";
import { integrate } from "./steering.js";
import { hasFacing, fromVector } from "../facing/capability.js";
import { turn } from "../facing/operations.js";
import { allows } from "../../../restriction.js";

function resolveSpeed(battle: BattleState, self: Unit & Locomotion): number {
    const definition = self.definition.locomotion;

    return attribute.resolve(definition.speed, self.locomotion.speed, battle, self);
}

export function advance(
    battle: BattleState,
    ref: Ref<Unit & Locomotion>,
    target: MovementTarget | null,
    context: MovementContext,
): BattleState {
    const self = ref.get(battle);
    if (
        self?.lifecycle !== "ACTIVE" ||
        isUnbalanced(self) ||
        !allows(battle, { self }, self.locomotion.restrictions)
    ) {
        return battle;
    }

    const map = effectiveMap(battle.battlefield.navigation, context.mode);
    if (target === null) {
        const tile = World.toTile(self.position);
        if (map.get(tile)?.passable !== false) {
            return battle;
        }

        const goal = nearestPassableNeighbor(map, tile, self.position);
        if (goal === null) {
            return battle;
        }

        target = { nextPoint: goal, goal };
    }

    assertNonnegativeNumber(context.speedMultiplier, "speedMultiplier");
    const speed = resolveSpeed(battle, self) * context.speedMultiplier;

    if (speed === 0) {
        return battle;
    }

    let position = self.position;
    let velocity = self.locomotion.velocity;

    if (Vec2.distanceSquared(position, target.goal) <= speed * speed) {
        position = target.goal;
    } else {
        const direction = Vec2.sub(target.nextPoint, position);
        const force = avoidance(
            map,
            context.mode,
            position,
            self.definition.locomotion.halfBodyWidth,
            direction,
            velocity,
            speed,
        );
        velocity = integrate(
            velocity,
            direction,
            speed,
            force,
            self.definition.locomotion.steeringParameters,
        );
        position = reflect(position, Vec2.add(position, velocity), map);
    }

    if (Vec2.equal(position, self.position)) {
        position = self.position;
    }
    if (Vec2.equal(velocity, self.locomotion.velocity)) {
        velocity = self.locomotion.velocity;
    }

    if (position !== self.position || velocity !== self.locomotion.velocity) {
        battle = replace(battle, [
            {
                ...self,
                position,
                locomotion:
                    velocity === self.locomotion.velocity
                        ? self.locomotion
                        : { ...self.locomotion, velocity },
            },
        ]);
    }

    if (hasFacing(self) && Vec2.distanceSquared(self.position, target.nextPoint) > 0.25 * 0.25) {
        const direction = fromVector(Vec2.sub(target.nextPoint, self.position));
        if (direction !== null) {
            battle = turn(battle, units.ref(self), direction);
        }
    }

    return battle;
}
