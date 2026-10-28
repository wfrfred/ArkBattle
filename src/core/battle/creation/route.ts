import { Vec2 } from "../../common/vector.js";
import { assert, assertNonnegativeSafeInteger } from "../../common/assert.js";
import { type TilePosition, type WorldPosition } from "../../geometry/coordinate.js";
import type { MotionMode } from "../../battlefield/navigation/state.js";
import type {
    Checkpoint as RouteCheckpoint,
    Definition,
} from "../../unit/capability/route/capability.js";

export interface MoveTarget {
    readonly position: TilePosition;
    readonly reachOffset: WorldPosition;
}

export type Checkpoint =
    | { readonly type: "MOVE" | "PATROL_MOVE"; readonly target: MoveTarget }
    | { readonly type: "WAIT_FOR_TICKS"; readonly durationTicks: number }
    | { readonly type: "WAIT_FOR_PLAY_TICK"; readonly targetPlayTick: number }
    | {
          readonly type: "WAIT_CURRENT_FRAGMENT_TICKS" | "WAIT_CURRENT_WAVE_TICKS";
          readonly targetElapsedTicks: number;
      }
    | {
          readonly type: "APPEAR_AT_POS";
          readonly position: TilePosition;
          readonly reachOffset: WorldPosition;
      }
    | { readonly type: "DISAPPEAR" | "ALERT" };

export interface Input {
    readonly pathMotionMode: MotionMode;
    readonly startPosition: TilePosition;
    readonly endPosition: TilePosition;
    readonly spawnOffset: WorldPosition;
    readonly spawnRandomRange: WorldPosition;
    readonly checkpoints: readonly Checkpoint[];
    readonly visitEveryCheckPoint: boolean;
}

export interface Timing {
    readonly waveStartedAtTick: number;
    readonly fragmentStartedAtTick: number;
}

export function createTiming(timing: Timing): Timing {
    assertNonnegativeSafeInteger(timing.waveStartedAtTick, "waveStartedAtTick");
    assertNonnegativeSafeInteger(timing.fragmentStartedAtTick, "fragmentStartedAtTick");

    return { ...timing };
}

export function createInput(input: Input): Input {
    assert(Vec2.is(input.spawnOffset), "invalid route spawn offset", RangeError);
    assert(Vec2.is(input.spawnRandomRange), "invalid route spawn random range", RangeError);

    for (const checkpoint of input.checkpoints) {
        switch (checkpoint.type) {
            case "MOVE":
            case "PATROL_MOVE":
                assert(
                    Vec2.is(checkpoint.target.reachOffset),
                    "invalid checkpoint offset",
                    RangeError,
                );
                break;

            case "APPEAR_AT_POS":
                assert(Vec2.is(checkpoint.reachOffset), "invalid checkpoint offset", RangeError);
                break;

            case "WAIT_FOR_TICKS":
                assertNonnegativeSafeInteger(checkpoint.durationTicks, "durationTicks");
                break;

            case "WAIT_FOR_PLAY_TICK":
                assertNonnegativeSafeInteger(checkpoint.targetPlayTick, "targetPlayTick");
                break;

            case "WAIT_CURRENT_FRAGMENT_TICKS":
            case "WAIT_CURRENT_WAVE_TICKS":
                assertNonnegativeSafeInteger(checkpoint.targetElapsedTicks, "targetElapsedTicks");
                break;

            case "DISAPPEAR":
            case "ALERT":
                break;
        }
    }

    return input;
}

function deadline(start: number, elapsed: number): number {
    const tick = start + elapsed;
    assertNonnegativeSafeInteger(tick, "route wait deadline");

    return tick;
}

export function normalize(
    input: Input,
    timing: Timing,
    offset: WorldPosition,
    alwaysCheckCurrentPoint: boolean,
): Definition {
    const checkpoints: RouteCheckpoint[] = [];
    const indices: number[] = [];

    for (let index = 0; index < input.checkpoints.length; index++) {
        const checkpoint = input.checkpoints[index]!;
        indices.push(checkpoints.length);

        switch (checkpoint.type) {
            case "MOVE":
            case "PATROL_MOVE": {
                checkpoints.push({
                    type: "MOVE",
                    position: checkpoint.target.position,
                    offset: checkpoint.target.reachOffset,
                });

                if (
                    checkpoint.type === "PATROL_MOVE" &&
                    (index + 1 === input.checkpoints.length ||
                        input.checkpoints[index + 1]!.type === "MOVE")
                ) {
                    let start = index;

                    while (start > 0 && input.checkpoints[start - 1]!.type !== "MOVE") {
                        start--;
                    }
                    if (start < index) {
                        checkpoints.push({ type: "GOTO", index: indices[start]! });
                    }
                }

                break;
            }

            case "WAIT_FOR_TICKS":
                checkpoints.push({ type: "WAIT", tick: checkpoint.durationTicks });
                break;

            case "WAIT_FOR_PLAY_TICK":
                checkpoints.push({ type: "WAIT_UNTIL", tick: checkpoint.targetPlayTick });
                break;

            case "WAIT_CURRENT_FRAGMENT_TICKS":
                checkpoints.push({
                    type: "WAIT_UNTIL",
                    tick: deadline(timing.fragmentStartedAtTick, checkpoint.targetElapsedTicks),
                });
                break;

            case "WAIT_CURRENT_WAVE_TICKS":
                checkpoints.push({
                    type: "WAIT_UNTIL",
                    tick: deadline(timing.waveStartedAtTick, checkpoint.targetElapsedTicks),
                });
                break;

            case "APPEAR_AT_POS":
                checkpoints.push({
                    type: checkpoint.type,
                    position: checkpoint.position,
                    offset: checkpoint.reachOffset,
                });
                break;

            case "DISAPPEAR":
            case "ALERT":
                checkpoints.push({ type: checkpoint.type });
                break;
        }
    }

    return {
        pathMotionMode: input.pathMotionMode,
        startPosition: input.startPosition,
        endPosition: input.endPosition,
        offset,
        checkpoints: checkpoints.map((checkpoint) => checkpoint),
        requireAllCheckpoints: input.visitEveryCheckPoint,
        alwaysCheckCurrentPoint,
    };
}
