import { Vec2 } from "../../../common/vector.js";
import { createRef, type Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as navigation from "../../../battlefield/navigation/query.js";
import type {
    State as NavigationState,
    MotionMode,
} from "../../../battlefield/navigation/state.js";
import type { Map } from "../../../battlefield/navigation/map.js";
import {
    Tile,
    World,
    type TilePosition,
    type WorldPosition,
} from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import type { MovementTarget } from "../locomotion/capability.js";
import type { Context, Route } from "./capability.js";

export { ref } from "../../../common/ref.js";

export function createContextRef(host: Ref<Unit & Route>): Ref<Context> {
    return createRef<Context>({ host }, getContext);
}

function getContext(this: object, battle: BattleState): Context | undefined {
    const reference = this as Ref<Context>;
    const self = reference.host.get(battle);

    return self === undefined ? undefined : contextFor(self, reference);
}

export function contextFor(self: Unit & Route, reference: Ref<Context>): Context | undefined {
    return self.route.main.ref === reference
        ? self.route.main
        : self.route.others.find((context) => context.ref === reference);
}

export function activeContext(self: Unit & Route): Context {
    return contextFor(self, self.route.active)!;
}

interface Target {
    readonly tile: TilePosition;
    readonly position: WorldPosition;
}

export function target(context: Context): Target | null {
    const current = context.current;
    if (current?.type === "MOVE") {
        return {
            tile: current.position,
            position: Vec2.add(Tile.center(current.position), current.offset),
        };
    }
    if (current?.type === "TRACE") {
        return current.reached
            ? null
            : { tile: current.position, position: Tile.center(current.position) };
    }

    return current === null &&
        context.index === context.plan.checkpoints.length &&
        context.plan.destination !== null
        ? {
              tile: context.plan.destination.position,
              position: Tile.center(context.plan.destination.position),
          }
        : null;
}

function distance(
    state: NavigationState,
    mode: MotionMode,
    current: WorldPosition,
    target: Target,
): number | null {
    const origin = World.toTile(current);
    const path = navigation.path(state, mode, origin, target.tile);
    if (path === null) {
        return null;
    }

    let position = Tile.center(origin);
    let first = true;
    let remaining = 0;

    for (const tile of path) {
        if (Vec2.equal(tile, origin)) {
            continue;
        }

        const final = Vec2.equal(tile, target.tile);
        const following = final ? target.position : Tile.center(tile);
        if (first) {
            if (final) {
                return Vec2.length(Vec2.sub(target.position, current));
            }

            const direction = Vec2.sub(following, position);
            const length = Vec2.length(direction);
            const displacement = Vec2.sub(current, position);
            remaining =
                length - (displacement[0] * direction[0] + displacement[1] * direction[1]) / length;
            first = false;
        } else {
            remaining += Vec2.length(Vec2.sub(following, position));
        }

        position = following;
    }

    return first ? Vec2.length(Vec2.sub(target.position, current)) : remaining;
}

export function remainingDistance(
    battle: BattleState,
    self: Unit & Route,
    context: Context,
): number | undefined {
    const state = battle.battlefield.navigation;
    const mode = self.locomotion.mode;
    let position = Vec2.sub(self.position, context.offset);
    if (context.current?.type === "TRACE") {
        const tile = context.current.position;
        const goal = Tile.center(tile);

        return (
            distance(state, mode, position, { tile, position: goal }) ??
            Vec2.length(Vec2.sub(goal, position))
        );
    }
    if (context.plan.destination === null) {
        return undefined;
    }

    let remaining = 0;
    let fallback: number | undefined;

    const move = (goal: Target): void => {
        if (fallback === undefined) {
            const length = distance(state, mode, position, goal);
            if (length === null) {
                fallback = remaining + Vec2.length(Vec2.sub(goal.position, position));
            } else {
                remaining += length;
            }
        }

        position = goal.position;
    };

    const visited = new Set<number>();
    let index = context.index;

    while (index < context.plan.checkpoints.length) {
        if (visited.has(index)) {
            return undefined;
        }

        visited.add(index);
        const entered = index === context.index && context.current !== null;
        const checkpoint = entered ? context.current : context.plan.checkpoints[index]!;

        switch (checkpoint.type) {
            case "MOVE": {
                const center = Tile.center(checkpoint.position);
                move({
                    tile: checkpoint.position,
                    position:
                        entered || !checkpoint.randomizeOffset
                            ? Vec2.add(center, checkpoint.offset)
                            : center,
                });
                break;
            }

            case "APPEAR":
                position = Vec2.sub(
                    Vec2.add(Tile.center(checkpoint.position), checkpoint.offset),
                    context.offset,
                );
                break;

            case "GOTO":
                index = checkpoint.index;
                continue;

            case "TRACE":
                return undefined;

            case "WAIT":
            case "DISAPPEAR":
                break;
        }

        index++;
    }

    move({
        tile: context.plan.destination.position,
        position: Tile.center(context.plan.destination.position),
    });

    return fallback ?? remaining;
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
    const self = reference.get(battle);
    if (self?.lifecycle !== "ACTIVE") {
        return null;
    }

    const context = activeContext(self);
    const goal = target(context);
    if (goal === null) {
        return null;
    }

    const mode = self.locomotion.mode;
    const map = battle.battlefield.navigation.baseline[mode];
    const locator = Vec2.sub(self.position, context.offset);
    if (!map.contains(World.toTile(self.position)) || !map.contains(World.toTile(locator))) {
        const recovery = recoveryPoint(map, self.position, context.offset);

        return recovery === null ? null : { nextPoint: recovery, goal: recovery };
    }

    const next = navigation.nextTile(
        battle.battlefield.navigation,
        mode,
        World.toTile(locator),
        goal.tile,
    );

    return next === null
        ? null
        : {
              nextPoint: Vec2.add(
                  Vec2.equal(next, goal.tile) ? goal.position : Tile.center(next),
                  context.offset,
              ),
              goal: Vec2.add(goal.position, context.offset),
          };
}
