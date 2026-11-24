import type { State as BattleState } from "../../../battle/state.js";
import type { Identified, Identity, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface Execution<in out E extends object = object> extends Identified<{
    readonly host: Ref<Unit & ActionCapability>;
    readonly id: Id;
}> {
    readonly id: Id;
    readonly startedAtTick: number;
    readonly lifecycle: Lifecycle;
    readonly state: E;
}

export type ExecutionIdentity = Omit<Execution, "state"> & { readonly state: unknown };

export type ExecutionRef = Ref<ExecutionIdentity>;

export function ref<E extends object>(
    host: Ref<Unit & ActionCapability>,
    self: Execution<E>,
): Ref<Execution<E>> {
    return { host, id: self.id, get } as Ref<Execution<E>>;
}

function get<E extends object>(this: object, battle: BattleState): Execution<E> | undefined {
    const { host, id } = this as Identity<Execution>;

    return host.get(battle)?.action.actions.getByExecution(id)?.execution as
        Execution<E> | undefined;
}
