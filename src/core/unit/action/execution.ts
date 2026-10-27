import type { Identified, Ref } from "../../common/ref.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import type { View as ActionView } from "./action.js";
import type { Definition } from "./definition.js";

export type Id = number;

export type Status = "RUNNING" | "ENDING";

export interface StateView {
    readonly id: Id;
    readonly startedAtTick: number;
    readonly status: Status;
}

export interface State<E extends object = object> extends StateView {
    readonly state: E;
}

export interface Snapshot extends StateView {
    readonly state: unknown;
}

export interface View
    extends
        ActionView,
        Identified<{
            readonly host: Ref<Unit & ActionCapability>;
            readonly id: Id;
        }> {
    readonly execution: StateView;
}

export interface Execution<P extends object = object, E extends object = object> extends View {
    readonly definition: Definition<P, E>;
    readonly state: P;
    readonly execution: State<E>;
}

export function ref<X extends View>(host: Ref<Unit & ActionCapability>, self: X): Ref<X> {
    return { host, id: self.execution.id } as Ref<X>;
}
