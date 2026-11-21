import type { Identified, Identity, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Action } from "./action.js";

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
    in out P extends object = object,
    in out E extends object = object,
    in out H extends object = object,
> extends Identified<
    {
        readonly host: Ref<Unit & ActionCapability & H>;
        readonly id: Id;
    },
    Action<P, E, H>
> {
    readonly execution: State<E>;
}

export type ExecutionIdentity = Identified<Identity<Execution>, { readonly execution: Snapshot }>;

export type ExecutionRef = Ref<ExecutionIdentity>;

export function ref<P extends object, E extends object, H extends object>(
    host: Ref<Unit & ActionCapability & NoInfer<H>>,
    self: Execution<P, E, H>,
): Ref<Execution<P, E, H>> {
    return { host, id: self.execution.id } as Ref<Execution<P, E, H>>;
}
