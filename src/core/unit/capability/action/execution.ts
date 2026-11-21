import type { Identified, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Action, ActionView } from "./action.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface State<E extends object = object> {
    readonly id: Id;
    readonly startedAtTick: number;
    readonly lifecycle: Lifecycle;
    readonly state: E;
}

export interface Snapshot extends Omit<State, "state"> {
    readonly state: unknown;
}

export interface Execution<
    P extends object = object,
    E extends object = object,
    H extends object = object,
> extends Identified<
    {
        readonly host: Ref<Unit & ActionCapability & H>;
        readonly id: Id;
    },
    Action<P, E, H>
> {
    readonly execution: State<E>;
}

export interface ExecutionView extends Identified<
    {
        readonly host: Ref<Unit & ActionCapability>;
        readonly id: Id;
    },
    ActionView
> {
    readonly execution: State;
}

export function ref<X extends ExecutionView>(host: NoInfer<Ref<X>["host"]>, self: X): Ref<X> {
    return { host, id: self.execution.id } as Ref<X>;
}
