import type { Identified, Identity, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Definition, Id as DefinitionId } from "./definition.js";
import type * as cooldown from "./cooldown.js";
import type { State as ExecutionState } from "./execution.js";

export interface Action<
    in out P extends object = object,
    in out E extends object = object,
> extends Identified<{
    readonly host: Ref<Unit & ActionCapability>;
    readonly definitionId: DefinitionId;
}> {
    readonly definition: Definition<P, E, never>;
    readonly state: P;
    readonly cooldown: cooldown.State;
    readonly execution: ExecutionState<E> | null;
}

export function ref<P extends object, E extends object>(
    host: Ref<Unit & ActionCapability>,
    definition: Definition<P, E, never>,
): Ref<Action<P, E>> {
    const identity: Identity<Action<P, E>> = { host, definitionId: definition.id };

    return identity as Ref<Action<P, E>>;
}
