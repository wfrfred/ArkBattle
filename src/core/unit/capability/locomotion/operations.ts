import { Vec2 } from "../../../common/vector.js";
import { update as updateUnit } from "../../../battle/unit.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { Ref } from "../../../common/ref.js";
import { type State as BattleState } from "../../../battle/state.js";
import { effectiveMap } from "../../../battlefield/navigation/cache.js";

import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import { isSpatiallyPresent } from "../presence/capability.js";
import type { Locomotion, MovementContext, MovementTarget } from "./capability.js";
import { calculate as avoidance } from "./avoidance.js";
import { reflect } from "./motion.js";
import { integrate } from "./steering.js";

function canMove(battle: BattleState, self: Unit & Locomotion): boolean {
    return self.locomotion.rules.every((rule) => rule.allows(battle, self));
}

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
    if (self?.lifecycle !== "PRESENT" || !isSpatiallyPresent(self) || !canMove(battle, self)) {
        return battle;
    }

    assertNonnegativeNumber(context.speedMultiplier, "speedMultiplier");
    const speed = resolveSpeed(battle, self) * context.speedMultiplier;
    assertNonnegativeNumber(speed, "movement budget");

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

    if (position[0] === self.position[0] && position[1] === self.position[1]) {
        position = self.position;
    }
    if (
        velocity[0] === self.locomotion.velocity[0] &&
        velocity[1] === self.locomotion.velocity[1]
    ) {
        velocity = self.locomotion.velocity;
    }

    return position === self.position && velocity === self.locomotion.velocity
        ? battle
        : updateUnit(battle, [
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
