import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import { remove } from "../../../battle/unit.js";
import { recover } from "../../../battle/deployment/dp.js";
import * as cards from "../../../battle/deployment/card/operations.js";
import { get as getCard } from "../../../battle/deployment/card/query.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import type { Deployable, State } from "./capability.js";

export function setDeployment<U extends Unit & Deployable>(
    self: U,
    deployment: Pick<State, "card" | "cost" | "slots" | "refund">,
): U {
    return { ...self, deployable: { ...self.deployable, ...deployment } };
}

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
        battle = recover(battle, amount);
    }

    const card = self.deployable.card;
    if (card !== null) {
        const definition = getCard(battle, card)!.definition.card;
        if (definition.increaseCostOnRetreatOrDeath) {
            battle = cards.incrementCostStage(battle, card);
        }
        if (definition.recoverOnRetreatOrDeath) {
            battle = cards.enqueueRecovery(battle, card);
        }
    }

    return remove(battle, reference.id, "RETREAT");
}
