import type { State as BattleState } from "../../../battle/state.js";
import type { Ref } from "../../../common/ref.js";
import { allows } from "../../../restriction.js";
import type { Unit } from "../../unit.js";
import type { Deployable } from "./capability.js";

export function canRetreat(battle: BattleState, reference: Ref<Unit & Deployable>): boolean {
    const self = reference.get(battle);

    return (
        self?.lifecycle === "ACTIVE" &&
        allows(battle, { self }, self.deployable.retreatRestrictions)
    );
}
