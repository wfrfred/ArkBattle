import type { Ref } from "../../common/ref.js";
import type { State as BattleState, Result } from "../../battle/state.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import type { Action, Executing } from "./action.js";

export type Id = string;

export type End =
    { readonly type: "FINISHED" } | { readonly type: "CANCELLED"; readonly reason: string };

export interface View {
    readonly id: Id;
    readonly intervalTicks: number;
    readonly speed: number;
}

export interface Definition<P extends object = object, E extends object = object> extends View {
    readonly initialize: (battle: BattleState) => Result<P>;
    readonly prepare: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Action<P, E>,
    ) => Result<E | null>;
    readonly onTick: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Executing<P, E>,
    ) => Result<boolean>;
    readonly onEnd?: (
        battle: BattleState,
        source: Ref<Unit & ActionCapability>,
        self: Executing<P, E>,
        end: End,
    ) => BattleState;
}
