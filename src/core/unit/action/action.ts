import type { Identified, Ref } from "../../common/ref.js";
import type { Unit } from "../unit.js";
import type { Action as ActionCapability } from "../capability/action/capability.js";
import type { Definition } from "./definition.js";
import type * as cooldown from "./cooldown.js";
import type { State as ExecutionState, Snapshot as ExecutionSnapshot } from "./execution.js";

export interface Action<P extends object = object, E extends object = object> extends Identified<{
    readonly host: Ref<Unit & ActionCapability>;
    readonly definition: Definition<P, E>;
}> {
    readonly definition: Definition<P, E>;
    readonly state: P;
    readonly cooldown: cooldown.State;
    readonly execution: ExecutionState<E> | null;
}

export interface Snapshot {
    readonly definition: Pick<Definition, "id" | "intervalTicks" | "speed">;
    readonly cooldown: cooldown.State;
    readonly state: unknown;
    readonly execution: ExecutionSnapshot | null;
}

export function ref<P extends object, E extends object>(
    host: Ref<Unit & ActionCapability>,
    definition: Definition<P, E>,
): Ref<Action<P, E>> {
    return { host, definition } as Ref<Action<P, E>>;
}
