import type { State as BattleState } from "../../../battle/state.js";
import { createRef, type Ref } from "../../../common/ref.js";
import type { Config, Lifetime } from "../../../lifetime/index.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { End } from "./definition.js";
import { config } from "./operations.js";

export type Id = number;

export type Lifecycle = "ACTIVE" | "ENDING";

export interface Execution<E extends object = object> extends Lifetime<{
    readonly host: Ref<Unit & ActionCapability>;
}> {
    readonly config: Config<Execution, End>;
    readonly id: Id;
    readonly startedAtTick: number;
    readonly lifecycle: Lifecycle;
    readonly state: E;
}

export type ExecutionRef = Ref<Execution>;

export function create<E extends object>(
    host: Ref<Unit & ActionCapability>,
    id: Id,
    startedAtTick: number,
    state: E,
): Execution<E> {
    return {
        ref: createRef<Execution>({ host }, get),
        config,
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
