import { assertFiniteNumber, assertSafeInteger } from "../../core/common/assert.js";
import type { TilePosition, WorldPosition } from "../../core/geometry/coordinate.js";
import type { Checkpoint, Plan } from "../../core/unit/capability/route/capability.js";
import { secondsToTicks } from "./tick.js";

export interface Route {
    readonly plan: Plan;
    readonly spawnOffset: WorldPosition;
    readonly spawnRandomRange: WorldPosition;
}

type NativeCheckpoint =
    | Extract<Checkpoint, { readonly type: "MOVE" }>
    | (Omit<Extract<Checkpoint, { readonly type: "MOVE" }>, "type"> & {
          readonly type: "PATROL_MOVE";
      })
    | Exclude<Checkpoint, { readonly type: "MOVE" | "TRACE" | "GOTO" }>
    | { readonly type: "ALERT" };

function object(value: unknown, name: string, fields: readonly string[]): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    const data = value as Record<string, unknown>;

    for (const key of Object.keys(data)) {
        if (!fields.includes(key)) {
            throw new TypeError(`${name} has unsupported field ${key}`);
        }
    }

    return data;
}

function number(value: unknown, name: string): number {
    assertFiniteNumber(value, name);

    return value;
}

function boolean(value: unknown, name: string): boolean {
    if (typeof value !== "boolean") {
        throw new TypeError(`${name} must be boolean`);
    }

    return value;
}

function position(value: unknown, name: string): TilePosition {
    const data = object(value, name, ["row", "col"]);
    assertSafeInteger(data.row, `${name}.row`);
    assertSafeInteger(data.col, `${name}.col`);

    return [data.row, data.col];
}

function offset(value: unknown, name: string): WorldPosition {
    const data = object(value, name, ["x", "y"]);

    return [number(data.x, `${name}.x`), number(data.y, `${name}.y`)];
}

const waitAnchors = {
    WAIT_FOR_SECONDS: "ENTER",
    WAIT_FOR_PLAY_TIME: "BATTLE",
    WAIT_CURRENT_WAVE_TIME: "WAVE",
    WAIT_CURRENT_FRAGMENT_TIME: "FRAGMENT",
} as const;

function checkpoint(value: unknown): NativeCheckpoint {
    const data = object(value, "checkpoint", [
        "type",
        "time",
        "position",
        "reachOffset",
        "randomizeReachOffset",
        "reachDistance",
    ]);

    switch (data.type) {
        case "MOVE":
        case "PATROL_MOVE":
            return {
                type: data.type,
                position: position(data.position, "checkpoint.position"),
                offset: offset(data.reachOffset, "checkpoint.reachOffset"),
                randomizeOffset: boolean(
                    data.randomizeReachOffset,
                    "checkpoint.randomizeReachOffset",
                ),
            };

        case "WAIT_FOR_SECONDS":
        case "WAIT_FOR_PLAY_TIME":
        case "WAIT_CURRENT_FRAGMENT_TIME":
        case "WAIT_CURRENT_WAVE_TIME":
            return {
                type: "WAIT",
                anchor: waitAnchors[data.type],
                tick: Math.max(
                    0,
                    secondsToTicks(number(data.time, "checkpoint.time"), "checkpoint.time"),
                ),
                timer: null,
            };

        case "APPEAR_AT_POS":
            return {
                type: "APPEAR",
                position: position(data.position, "checkpoint.position"),
                offset: offset(data.reachOffset, "checkpoint.reachOffset"),
            };

        case "DISAPPEAR":
        case "ALERT":
            return { type: data.type };

        default:
            throw new RangeError("unsupported Arknights route checkpoint type");
    }
}

function compileCheckpoints(source: readonly NativeCheckpoint[]): readonly Checkpoint[] {
    const checkpoints: Checkpoint[] = [];
    const indices: number[] = [];

    for (const [index, current] of source.entries()) {
        indices.push(checkpoints.length);

        if (current.type === "MOVE" || current.type === "PATROL_MOVE") {
            checkpoints.push({ ...current, type: "MOVE" });

            if (
                current.type === "PATROL_MOVE" &&
                (index + 1 === source.length || source[index + 1]!.type === "MOVE")
            ) {
                let start = index;

                while (start > 0 && source[start - 1]!.type !== "MOVE") {
                    start--;
                }
                if (start < index) {
                    checkpoints.push({ type: "GOTO", index: indices[start]! });
                }
            }
        } else if (current.type !== "ALERT") {
            checkpoints.push(current);
        }
    }

    return checkpoints;
}

export function parseRouteDefinition(value: unknown): Route {
    const data = object(value, "route", [
        "motionMode",
        "startPosition",
        "endPosition",
        "spawnOffset",
        "spawnRandomRange",
        "checkpoints",
        "allowDiagonalMove",
        "visitEveryTileCenter",
        "visitEveryNodeCenter",
        "visitEveryCheckPoint",
    ]);
    const motionMode = data.motionMode;
    if (motionMode !== "WALK" && motionMode !== "FLY") {
        throw new RangeError("unsupported Arknights route motion mode");
    }
    if (!Array.isArray(data.checkpoints)) {
        throw new TypeError("route.checkpoints must be an array");
    }

    const checkpoints: NativeCheckpoint[] = [];

    for (let index = 0; index < data.checkpoints.length; index++) {
        const value: unknown = data.checkpoints[index];
        if (!Object.hasOwn(data.checkpoints, index) || value === undefined) {
            throw new TypeError("route.checkpoints must be dense");
        }

        checkpoints.push(checkpoint(value));
    }

    const spawnRandomRange = offset(data.spawnRandomRange, "route.spawnRandomRange");
    if (spawnRandomRange.some((halfWidth) => halfWidth < 0)) {
        throw new RangeError("route.spawnRandomRange must be nonnegative");
    }

    return {
        plan: {
            motionMode,
            startPosition: position(data.startPosition, "route.startPosition"),
            endPosition:
                data.endPosition === null ? null : position(data.endPosition, "route.endPosition"),
            checkpoints: compileCheckpoints(checkpoints),
            requireAllCheckpoints: boolean(data.visitEveryCheckPoint, "route.visitEveryCheckPoint"),
        },
        spawnOffset: offset(data.spawnOffset, "route.spawnOffset"),
        spawnRandomRange,
    };
}
