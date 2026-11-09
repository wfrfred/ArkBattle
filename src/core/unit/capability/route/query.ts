import { Vec2 } from "../../../common/vector.js";
import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as navigation from "../../../battlefield/navigation/state.js";
import type { Map } from "../../../battlefield/navigation/map.js";
import { Tile, World, type WorldPosition } from "../../../geometry/coordinate.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import type { MovementTarget } from "../locomotion/capability.js";
import type { Context, ContextId, Route } from "./capability.js";

export function ref(host: Ref<Unit & Route>, context: Context): Ref<Context> {
    return { host, id: context.id } as Ref<Context>;
}

export function contextFor(self: Unit & Route, id: ContextId): Context | undefined {
    return id === 0 ? self.route.main : self.route.others.find((context) => context.id === id);
}

export function getContext(battle: BattleState, reference: Ref<Context>): Context | undefined {
    const self = units.get(battle, reference.host);

    return self === undefined ? undefined : contextFor(self, reference.id);
}

export function activeContext(self: Unit & Route): Context {
    return contextFor(self, self.route.activeId)!;
}

export function target(context: Context): WorldPosition | null {
    const current = context.current;
    if (current?.type === "MOVE") {
        return Vec2.add(Tile.center(current.position), current.offset);
    }
    if (current?.type === "TRACE") {
        return current.reached ? null : Tile.center(current.position);
    }

    return current === null &&
        context.index === context.plan.checkpoints.length &&
        context.plan.endPosition !== null
        ? Tile.center(context.plan.endPosition)
        : null;
}

function recoveryPoint(
    map: Map,
    position: WorldPosition,
    offset: WorldPosition,
): WorldPosition | null {
    const margin = Number.EPSILON * Math.max(map.rows, map.columns);
    const minimum = [-0.5 + margin, -0.5 + margin] as const;
    const maximum = [map.columns - 0.5 - margin, map.rows - 0.5 - margin] as const;
    const minX = Math.max(minimum[0], minimum[0] + offset[0]);
    const maxX = Math.min(maximum[0], maximum[0] + offset[0]);
    const minY = Math.max(minimum[1], minimum[1] + offset[1]);
    const maxY = Math.min(maximum[1], maximum[1] + offset[1]);

    return minX > maxX || minY > maxY
        ? null
        : [
              Math.max(minX, Math.min(maxX, position[0])),
              Math.max(minY, Math.min(maxY, position[1])),
          ];
}

export function movementTarget(
    battle: BattleState,
    reference: Ref<Unit & Route>,
): MovementTarget | null {
    const self = units.get(battle, reference);
    if (self?.lifecycle !== "PRESENT") {
        return null;
    }

    const context = activeContext(self);
    const goal = target(context);
    if (goal === null) {
        return null;
    }

    const mode = context.plan.motionMode;
    const map = battle.battlefield.navigation.baseline[mode];
    const locator = Vec2.sub(self.position, context.offset);
    if (!map.contains(World.toTile(self.position)) || !map.contains(World.toTile(locator))) {
        const recovery = recoveryPoint(map, self.position, context.offset);

        return recovery === null ? null : { nextPoint: recovery, goal: recovery };
    }

    const point = navigation.nextPoint(battle.battlefield.navigation, mode, locator, goal);

    return point === null
        ? null
        : {
              nextPoint: Vec2.add(point, context.offset),
              goal: Vec2.add(goal, context.offset),
          };
}
