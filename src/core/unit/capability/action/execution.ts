import type { State as BattleState } from "../../../battle/state.js";
import { createRef, type Identified, type Ref } from "../../../common/ref.js";
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

export function create<E extends object>(
    host: Ref<Unit & ActionCapability>,
    id: Id,
    startedAtTick: number,
    state: E,
): Execution<E> {
    return {
        ref: createRef<Execution>({ host, id }, get),
        id,
        startedAtTick,
        lifecycle: "ACTIVE",
        state,
    };
}

function get(this: object, battle: BattleState): Execution | undefined {
    const reference = this as ExecutionRef;

    return reference.host.get(battle)?.action.actions.getByExecution(reference)?.execution;
}
