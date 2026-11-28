import { Vec2 } from "../../../common/vector.js";
import { assert, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { timing } from "../../../battle/schedule/query.js";
import type { Identified, Ref } from "../../../common/ref.js";
import type { TilePosition, WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as lifecycle from "../../hook.js";
import { hasLocomotion, type Locomotion } from "../locomotion/capability.js";
import { enter } from "./operations.js";
import { createContextRef, ref } from "./query.js";

export interface Definition {
    readonly alwaysCheckCurrentPoint: boolean;
}

export interface Plan {
    readonly startPosition: TilePosition;
    readonly checkpoints: readonly Checkpoint[];
    readonly destination: Destination | null;
}

export type Destination =
    | {
          readonly type: "MOVE";
          readonly position: TilePosition;
      }
    | {
          readonly type: "EXIT";
          readonly position: TilePosition;
          readonly requireFinish: boolean;
      };

export interface Initial {
    readonly plan: Plan;
    readonly offset: WorldPosition;
}

export type Checkpoint =
    | {
          readonly type: "MOVE";
          readonly position: TilePosition;
          readonly offset: WorldPosition;
          readonly randomizeOffset: boolean;
      }
    | {
          readonly type: "WAIT";
          readonly anchor: "ENTER" | "BATTLE" | "WAVE" | "FRAGMENT";
          readonly tick: number;
          readonly timer: number | null;
      }
    | { readonly type: "TRACE"; readonly position: TilePosition; readonly reached: boolean }
    | { readonly type: "GOTO"; readonly index: number }
    | { readonly type: "DISAPPEAR" }
    | {
          readonly type: "APPEAR";
          readonly position: TilePosition;
          readonly offset: WorldPosition;
      };

export type ActiveCheckpoint = Extract<Checkpoint, { readonly type: "MOVE" | "WAIT" | "TRACE" }>;

export interface Context extends Identified<{
    readonly host: Ref<Unit & Route>;
}> {
    readonly plan: Plan;
    readonly offset: WorldPosition;
    readonly index: number;
    readonly current: ActiveCheckpoint | null;
    readonly alwaysCheckCurrentPoint: boolean;
}

export interface ContextInput extends Initial {
    readonly alwaysCheckCurrentPoint: boolean;
}

export interface Override {
    readonly context: Context;
    readonly priority: number;
}

export interface State {
    readonly main: Context;
    readonly alternative: Context | null;
    readonly overrides: readonly Override[];
    readonly waveStartTick: number;
    readonly fragmentReadyTick: number;
}

export type Route = Locomotion & {
    readonly definition: { readonly route: Definition };
    readonly route: State;
};

export function hasRoute<U extends Unit>(unit: U): unit is U & Route {
    return "route" in unit && "route" in unit.definition;
}

export function initialize<
    U extends Unit & Locomotion & { readonly definition: { readonly route: Definition } },
>(battle: BattleState, unit: U, initial: Initial): Result<U & Route> {
    if (!hasLocomotion(unit)) {
        throw new TypeError("route requires locomotion");
    }

    const main = createContext(unit.ref as Ref<Unit & Route>, {
        ...initial,
        alwaysCheckCurrentPoint: unit.definition.route.alwaysCheckCurrentPoint,
    });

    return {
        state: battle,
        value: {
            ...unit,
            hooks: unit.hooks.set(lifecycle.entered, {
                id: "@route/enter",
                priority: 0,
                invoke: (current, self) => ({
                    state: enter(current, ref((self as Unit & Route).route.main)),
                    value: undefined,
                }),
            }),
            route: {
                main,
                alternative: null,
                overrides: [],
                ...timing(battle.schedule),
            },
        },
    };
}

export function createContext(host: Ref<Unit & Route>, input: ContextInput): Context {
    validatePlan(input.plan);
    assert(Vec2.is(input.offset), "invalid route offset", TypeError);

    return {
        ref: createContextRef(host),
        plan: input.plan,
        offset: input.offset,
        index: 0,
        current: null,
        alwaysCheckCurrentPoint: input.alwaysCheckCurrentPoint,
    };
}

export function validatePlan(plan: Plan): void {
    for (const checkpoint of plan.checkpoints) {
        if (checkpoint.type === "MOVE" || checkpoint.type === "APPEAR") {
            assert(Vec2.is(checkpoint.offset), "invalid checkpoint offset", TypeError);
        } else if (checkpoint.type === "WAIT") {
            assertNonnegativeSafeInteger(checkpoint.tick, "checkpoint tick");
        } else if (checkpoint.type === "GOTO") {
            assertNonnegativeSafeInteger(checkpoint.index, "checkpoint index");
            assert(
                checkpoint.index < plan.checkpoints.length,
                "checkpoint jump must identify an instruction",
                RangeError,
            );
        }
    }
}
