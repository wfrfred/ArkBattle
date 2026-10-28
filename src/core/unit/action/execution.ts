import type { Identified, Ref } from "../../common/ref.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import type { Action } from "./action.js";

export type Id = number;

export type Status = "RUNNING" | "ENDING";

export interface State<E extends object = object> {
    readonly id: Id;
    readonly startedAtTick: number;
    readonly status: Status;
    readonly state: E;
}

export interface Snapshot extends Omit<State, "state"> {
    readonly state: unknown;
}

export interface Execution<P extends object = object, E extends object = object>
    extends
        Omit<Action<P, E>, keyof Identified<object>>,
        Identified<{
            readonly host: Ref<Unit & ActionCapability>;
            readonly id: Id;
        }> {
    readonly execution: State<E>;
}

export function ref<X extends Execution<any, any>>(
    host: Ref<Unit & ActionCapability>,
    self: X,
): Ref<X> {
    return { host, id: self.execution.id } as Ref<X>;
}
