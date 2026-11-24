import type { State as BattleState } from "../../../battle/state.js";
import type { Identified, Identity, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Action } from "./action.js";
import type { Definition } from "./definition.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface State<E extends object = object> {
    readonly id: Id;
    readonly startedAtTick: number;
    readonly lifecycle: Lifecycle;
    readonly state: E;
}

export interface Execution<
    in out P extends object = object,
    in out E extends object = object,
> extends Identified<
    {
        readonly host: Ref<Unit & ActionCapability>;
        readonly id: Id;
    },
    Action<P, E>
> {
    readonly execution: State<E>;
}

export type ExecutionIdentity = Identified<
    Identity<Execution>,
    Pick<Execution, "execution"> & { readonly definition: Pick<Definition, "id"> }
>;

export type ExecutionRef = Ref<ExecutionIdentity>;

export function ref<P extends object, E extends object>(
    host: Ref<Unit & ActionCapability>,
    self: Execution<P, E>,
): Ref<Execution<P, E>> {
    return refForId(host, self.execution.id) as Ref<Execution<P, E>>;
}

export function refForId(host: Ref<Unit & ActionCapability>, id: Id): ExecutionRef {
    return { host, id, get } as ExecutionRef;
}

function get(this: object, battle: BattleState): Execution | undefined {
    const { host, id } = this as Identity<Execution>;

    return host.get(battle)?.action.actions.getExecution(id);
}
