import type { Identified, Identity, Ref } from "../../common/ref.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import type { Definition, View as DefinitionView } from "./definition.js";
import type * as cooldown from "./cooldown.js";
import type {
    Execution,
    Id,
    View as ExecutionView,
    Snapshot as ExecutionSnapshot,
} from "./execution.js";

export interface View {
    readonly definition: DefinitionView;
    readonly cooldown: cooldown.State;
    readonly execution: ExecutionView | null;
}

export interface Action<P extends object = object, E extends object = object> extends View {
    readonly definition: Definition<P, E>;
    readonly state: P;
    readonly execution: Execution<E> | null;
}

export interface ExecutingView
    extends
        View,
        Identified<{
            readonly host: Ref<Unit & ActionCapability>;
            readonly id: Id;
        }> {
    readonly execution: ExecutionView;
}

export interface Executing<P extends object = object, E extends object = object>
    extends Action<P, E>, Identified<Identity<ExecutingView>> {
    readonly execution: Execution<E>;
}

export interface Snapshot extends View {
    readonly state: unknown;
    readonly execution: ExecutionSnapshot | null;
}

export function ref<A extends ExecutingView>(host: Ref<Unit & ActionCapability>, self: A): Ref<A> {
    return { host, id: self.execution.id } as Ref<A>;
}
