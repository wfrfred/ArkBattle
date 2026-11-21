import type { Identified, Identity, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Definition } from "./definition.js";
import type * as cooldown from "./cooldown.js";
import type { State as ExecutionState, Snapshot as ExecutionSnapshot } from "./execution.js";

export interface Action<
    in out P extends object = object,
    in out E extends object = object,
> extends Identified<{
    readonly host: Ref<Unit & ActionCapability>;
    readonly definition: Definition<P, E, never>;
}> {
    readonly definition: Definition<P, E, never>;
    readonly state: P;
    readonly cooldown: cooldown.State;
    readonly execution: ExecutionState<E> | null;
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
): Ref<Action<P, E>> {
    const identity: Identity<Action<P, E>> = { host, definition };

    return identity as Ref<Action<P, E>>;
}
