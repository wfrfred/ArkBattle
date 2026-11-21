import type { Identified, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Definition, Program } from "./definition.js";
import type * as cooldown from "./cooldown.js";
import type { State as ExecutionState, Snapshot as ExecutionSnapshot } from "./execution.js";

export interface Action<
    P extends object = object,
    E extends object = object,
    H extends object = object,
> extends Identified<{
    readonly host: Ref<Unit & ActionCapability & H>;
    readonly definition: Definition<P, E, H>;
}> {
    readonly definition: Definition<P, E, H>;
    readonly state: P;
    readonly cooldown: cooldown.State;
    readonly execution: ExecutionState<E> | null;
}

export interface ActionView
    extends
        Identified<{
            readonly host: Ref<Unit & ActionCapability>;
            readonly definition: Program;
        }>,
        Pick<Action, "state" | "cooldown" | "execution"> {
    readonly definition: Program;
}

export interface Snapshot {
    readonly definition: Pick<Definition, "id" | "applyWay" | "period">;
    readonly cooldown: cooldown.State;
    readonly state: unknown;
    readonly execution: ExecutionSnapshot | null;
}

export function ref<P extends object, E extends object, H extends object>(
    host: Ref<Unit & ActionCapability & NoInfer<H>>,
    definition: Definition<P, E, H>,
): Ref<Action<P, E, H>> {
    return { host, definition } as Ref<Action<P, E, H>>;
}
