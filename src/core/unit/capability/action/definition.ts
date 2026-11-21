import type { Ref } from "../../../common/ref.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { ApplyWay } from "../../../battle/resource/damage.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Action } from "./action.js";
import type { Execution } from "./execution.js";

export type Id = string;

export type Period =
    { readonly type: "ATTACK_SPEED" } | { readonly type: "FIXED"; readonly ticks: number };

export type End =
    { readonly type: "FINISHED" } | { readonly type: "CANCELLED"; readonly reason: string };

export interface Definition<
    P extends object = object,
    E extends object = object,
    H extends object = object,
> {
    readonly id: Id;
    readonly applyWay: ApplyWay;
    readonly period: Period;
    readonly initialize: (battle: BattleState) => Result<P>;
    readonly prepare: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability & H>,
        self: Action<P, E, H>,
    ) => Result<E | null>;
    readonly onTick: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability & H>,
        self: Execution<P, E, H>,
    ) => BattleState;
    readonly onEnd?: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability & H>,
        self: Execution<P, E, H>,
        end: End,
    ) => BattleState;
}
