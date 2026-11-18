import type { Contact } from "../../../battlefield/collision.js";
import type { State as BattleState } from "../../../battle/state.js";
import type { Ref } from "../../../common/ref.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import * as hooks from "../../../hook.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import type { Locomotion } from "./capability.js";
import type { Unbalance } from "./unbalance.js";

export interface ForcedMovement {
    readonly unbalance: Ref<Unbalance>;
    readonly from: WorldPosition;
    readonly to: WorldPosition;
    readonly contacts: readonly Contact[];
}

export const forcedMoved = hooks.key<hooks.Hook<ForcedMovement, void>, Unit & Locomotion>(
    "locomotion.forcedMoved",
);

export function dispatchMoved(battle: BattleState, event: ForcedMovement): BattleState {
    const { host } = event.unbalance;

    return hooks.dispatch(battle, event, undefined, {
        candidates: (current) => units.get(current, host)?.hooks.get(forcedMoved) ?? [],
        find: (current, id) => units.get(current, host)?.hooks.find(forcedMoved, id),
    }).state;
}
