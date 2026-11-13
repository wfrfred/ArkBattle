import { Vec2 } from "../../../common/vector.js";
import { replace } from "../../../battle/unit.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { Ref } from "../../../common/ref.js";
import { type State as BattleState } from "../../../battle/state.js";
import { effectiveMap } from "../../../battlefield/navigation/cache.js";

import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Locomotion, MovementContext, MovementTarget } from "./capability.js";
import { calculate as avoidance } from "./avoidance.js";
import { reflect } from "./motion.js";
import { integrate } from "./steering.js";
import { hasFacing, fromVector } from "../facing/capability.js";
import { turn } from "../facing/operations.js";

function resolveSpeed(battle: BattleState, self: Unit & Locomotion): number {
    const definition = self.definition.locomotion;

    return Math.max(
        definition.minSpeed,
        attribute.apply(
            definition.speed,
            contribution
                .resolve(self.locomotion.speed)
                .flatMap((input) => (typeof input === "function" ? input(battle, self) : input)),
        ),
    );
}

export function advance(
    battle: BattleState,
    ref: Ref<Unit & Locomotion>,
    target: MovementTarget,
    context: MovementContext,
): BattleState {
    const self = units.get(battle, ref);
    if (
        self?.lifecycle !== "PRESENT" ||
        !self.locomotion.rules.every((rule) => rule.allows(battle, { self }))
    ) {
        return battle;
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
        const map = effectiveMap(battle.battlefield.navigation, context.mode);
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
