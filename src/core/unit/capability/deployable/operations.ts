import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import { retreat as settleRetreat } from "../../../battle/deployment/lifecycle.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import type { Deployable } from "./capability.js";

export function canRetreat(battle: BattleState, reference: Ref<Unit & Deployable>): boolean {
    const self = units.get(battle, reference);

    return (
        self?.lifecycle === "PRESENT" &&
        self.deployable.retreatRules.every((rule) => rule.allows(battle, { ref: reference }))
    );
}

export function retreat(battle: BattleState, reference: Ref<Unit & Deployable>): BattleState {
    return canRetreat(battle, reference) ? settleRetreat(battle, reference) : battle;
}
