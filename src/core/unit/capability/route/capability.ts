import { Vec2 } from "../../../common/vector.js";
import { assert, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { timing } from "../../../battle/schedule/query.js";
import type { MotionMode } from "../../../battlefield/navigation/state.js";
import type { Identified, Ref } from "../../../common/ref.js";
import type { TilePosition, WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as lifecycle from "../../hook.js";
import * as units from "../../query.js";
import { enter } from "./operations.js";

export interface Definition {
    readonly alwaysCheckCurrentPoint: boolean;
}

export interface Plan {
    readonly motionMode: MotionMode;
    readonly startPosition: TilePosition;
    readonly endPosition: TilePosition | null;
    readonly checkpoints: readonly Checkpoint[];
    readonly requireAllCheckpoints: boolean;
}

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

export type ContextId = number;

export interface Context extends Identified<{
    readonly host: Ref<Unit & Route>;
    readonly id: ContextId;
}> {
    readonly id: ContextId;
    readonly plan: Plan;
    readonly offset: WorldPosition;
    readonly index: number;
    readonly current: Checkpoint | null;
    readonly alwaysCheckCurrentPoint: boolean;
    readonly ticking: boolean;
}

export interface ContextInput extends Initial {
    readonly alwaysCheckCurrentPoint: boolean;
    readonly ticking: boolean;
}

export interface State {
    readonly main: Context;
    readonly others: readonly Context[];
    readonly activeId: ContextId;
    readonly nextContextId: ContextId;
    readonly waveStartTick: number;
    readonly fragmentReadyTick: number;
}

export interface Route {
    readonly definition: { readonly route: Definition };
    readonly route: State;
}

export function hasRoute<U extends Unit>(unit: U): unit is U & Route {
    return "route" in unit && "route" in unit.definition;
}

export function initialize<U extends Unit & Pick<Route, "definition">>(
    battle: BattleState,
    unit: U,
    initial: Initial,
): Result<U & Route> {
    validatePlan(initial.plan);
    assert(Vec2.is(initial.offset), "invalid route offset", TypeError);

    return {
        state: battle,
        value: {
            ...unit,
            hooks: unit.hooks.set(lifecycle.enter, {
                id: "@route/enter",
                invoke: (current, self) => ({
                    state: enter(current, {
                        host: units.ref(self as Unit & Route),
                        id: 0,
                    } as Ref<Context>),
                    value: undefined,
                }),
            }),
            route: {
                main: {
                    id: 0,
                    plan: initial.plan,
                    offset: initial.offset,
                    index: 0,
                    current: null,
                    alwaysCheckCurrentPoint: unit.definition.route.alwaysCheckCurrentPoint,
                    ticking: true,
                },
                others: [],
                activeId: 0,
                nextContextId: 1,
                ...timing(battle.schedule),
            },
        },
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
