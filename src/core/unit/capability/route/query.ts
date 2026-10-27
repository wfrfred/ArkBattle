import { Vec2 } from "../../../common/vector.js";
import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as navigation from "../../../battlefield/navigation/state.js";
import { Tile, World, type WorldPosition } from "../../../geometry/coordinate.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import type { MovementTarget } from "../locomotion/capability.js";
import type { Progress, Route } from "./capability.js";

export function target(progress: Progress): WorldPosition | null {
    const phase = progress.phase;
    if (phase.type === "END") {
        return Tile.center(progress.definition.endPosition);
    }
    if (phase.type !== "CHECKPOINT" || phase.checkpointState.type !== "MOVING") {
        return null;
    }

    const checkpoint = progress.definition.checkpoints[phase.index]!;

    return checkpoint.type === "MOVE"
        ? Vec2.add(Tile.center(checkpoint.position), checkpoint.offset)
        : null;
}

function recoveryPoint(battle: BattleState, self: Unit, progress: Progress): WorldPosition | null {
    const definition = progress.definition;
    const map = battle.battlefield.navigation.baseline[progress.pathMotionMode];
    const locator = Vec2.add(self.position, Vec2.negate(definition.offset));
    if (map.contains(World.toTile(self.position)) && map.contains(World.toTile(locator))) {
        return null;
    }

    const margin = Number.EPSILON * Math.max(map.rows, map.columns);
    const minimum = [-0.5 + margin, -0.5 + margin] as const;
    const maximum = [map.columns - 0.5 - margin, map.rows - 0.5 - margin] as const;
    const minX = Math.max(minimum[0], minimum[0] + definition.offset[0]);
    const maxX = Math.min(maximum[0], maximum[0] + definition.offset[0]);
    const minY = Math.max(minimum[1], minimum[1] + definition.offset[1]);
    const maxY = Math.min(maximum[1], maximum[1] + definition.offset[1]);

    return minX > maxX || minY > maxY
        ? null
        : [
              Math.max(minX, Math.min(maxX, self.position[0])),
              Math.max(minY, Math.min(maxY, self.position[1])),
          ];
}

export function movementTarget(battle: BattleState, ref: Ref<Unit & Route>): MovementTarget | null {
    const self = units.get(battle, ref);
    if (self?.lifecycle !== "PRESENT") {
        return null;
    }

    const progress = self.route.alternative ?? self.route.main;
    const goal = target(progress);
    if (goal === null) {
        return null;
    }

    const definition = progress.definition;
    const map = battle.battlefield.navigation.baseline[progress.pathMotionMode];
    const locator = Vec2.add(self.position, Vec2.negate(definition.offset));
    if (!map.contains(World.toTile(self.position)) || !map.contains(World.toTile(locator))) {
        const recovery = recoveryPoint(battle, self, progress);

        return recovery === null ? null : { nextPoint: recovery, goal: recovery };
    }

    const point = navigation.nextPoint(
        battle.battlefield.navigation,
        progress.pathMotionMode,
        locator,
        goal,
    );

    return point === null
        ? null
        : {
              nextPoint: Vec2.add(point, definition.offset),
              goal: Vec2.add(goal, definition.offset),
          };
}
