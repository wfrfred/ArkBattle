import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import { remove } from "../../../battle/unit.js";
import { changeDp } from "../../../battle/deployment/dp.js";
import * as cards from "../../../battle/deployment/card/operations.js";
import { get as getCard } from "../../../battle/deployment/card/query.js";
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
    if (!canRetreat(battle, reference)) {
        return battle;
    }

    const self = units.get(battle, reference)!;
    const refund = self.deployable.refund;
    if (refund !== null) {
        const amount = Math.max(
            0,
            Math.floor(Math.min(self.deployable.cost * refund.rate, refund.limit)),
        );
        battle = { ...battle, deployment: changeDp(battle.deployment, amount, battle.tick) };
    }

    const card = self.deployable.card;
    if (card !== null) {
        const definition = getCard(battle, card)!.definition.card;
        if (definition.increaseCostOnLeave) {
            battle = cards.incrementCostStage(battle, card);
        }
        if (definition.recoverOnLeave) {
            battle = cards.enqueueRecovery(battle, card);
        }
    }

    return remove(battle, reference.id, "RETREAT");
}
