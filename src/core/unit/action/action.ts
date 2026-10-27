import type { Identified, Ref } from "../../common/ref.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import type { Definition, View as DefinitionView } from "./definition.js";
import type * as cooldown from "./cooldown.js";
import type {
    State as ExecutionState,
    StateView as ExecutionStateView,
    Snapshot as ExecutionSnapshot,
} from "./execution.js";

export interface View {
    readonly definition: DefinitionView;
    readonly cooldown: cooldown.State;
    readonly execution: ExecutionStateView | null;
}

export interface Action<P extends object = object, E extends object = object>
    extends
        View,
        Identified<{
            readonly host: Ref<Unit & ActionCapability>;
            readonly definition: Definition<P, E>;
        }> {
    readonly definition: Definition<P, E>;
    readonly state: P;
    readonly execution: ExecutionState<E> | null;
}

export interface Snapshot extends View {
    readonly state: unknown;
    readonly execution: ExecutionSnapshot | null;
}

export function ref<P extends object, E extends object>(
    host: Ref<Unit & ActionCapability>,
    definition: Definition<P, E>,
): Ref<Action<P, E>> {
    return { host, definition } as Ref<Action<P, E>>;
}
