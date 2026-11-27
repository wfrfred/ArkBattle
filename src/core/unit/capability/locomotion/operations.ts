import { Vec2 } from "../../../common/vector.js";
import { replace } from "../../operations.js";
import type { Ref } from "../../../common/ref.js";
import { type State as BattleState } from "../../../battle/state.js";

import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import type { Locomotion } from "./capability.js";
import { calculate as avoidance } from "./avoidance.js";
import { reflect } from "./motion.js";
import { integrate } from "./steering.js";
import { hasFacing, fromVector } from "../facing/capability.js";
import { turn } from "../facing/operations.js";
import { resolveMovement } from "./query.js";

export function advance(battle: BattleState, ref: Ref<Unit & Locomotion>): BattleState {
    const self = ref.get(battle);
    if (self === undefined) {
        return battle;
    }

    const movement = resolveMovement(battle, self);
    if (movement === null) {
        return battle;
    }

    const { map, target, speed } = movement;
    let position = self.position;
    let velocity = self.locomotion.velocity;

    if (Vec2.distanceSquared(position, target.goal) <= speed * speed) {
        position = target.goal;
    } else {
        const direction = Vec2.sub(target.nextPoint, position);
        const force = avoidance(
            map,
            self.locomotion.mode,
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
