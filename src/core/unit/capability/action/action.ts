import type { State as BattleState } from "../../../battle/state.js";
import type { EraseCallbacks } from "../../../common/callback.js";
import { createRef, type Identified, type Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Action as ActionCapability } from "./capability.js";
import type { Definition } from "./definition.js";
import type * as cooldown from "./cooldown.js";
import type { Execution } from "./execution.js";

export interface Action<P extends object = object, E extends object = object> extends Identified<{
    readonly host: Ref<Unit & ActionCapability>;
}> {
    readonly definition: EraseCallbacks<Definition<P, E, never>>;
    readonly state: P;
    readonly cooldown: cooldown.State;
    readonly execution: Execution<E> | null;
}

export function createActionRef(host: Ref<Unit & ActionCapability>): Ref<Action> {
    return createRef<Action>({ host }, get);
}

function get(this: object, battle: BattleState): Action | undefined {
    const reference = this as Ref<Action>;

    return reference.host.get(battle)?.action.actions.get(reference);
}
