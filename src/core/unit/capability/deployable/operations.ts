import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import { remove } from "../../operations.js";
import { modify } from "../../../battle/deployment/dp/operations.js";
import type { Unit } from "../../unit.js";
import type { Deployable, State } from "./capability.js";
import { allows } from "../../../restriction.js";

export function setDeployment<U extends Unit & Deployable>(
    self: U,
    input: Pick<State, "card" | "cost" | "slots"> & {
        readonly baseCost: number;
    },
): U {
    const { baseCost, card, cost, slots } = input;
    const rule = self.definition.deployable.refund;
    const refund =
        rule === null
            ? null
            : {
                  rate: rule.rate,
                  limit: rule.limit === "DEPLOYMENT_COST" ? Math.max(baseCost, cost) : baseCost,
              };

    return { ...self, deployable: { ...self.deployable, card, cost, slots, refund } };
}

export function canRetreat(battle: BattleState, reference: Ref<Unit & Deployable>): boolean {
    const self = reference.get(battle);

    return (
        self?.lifecycle === "ACTIVE" &&
        allows(battle, { self }, self.deployable.retreatRestrictions)
    );
}

export function retreat(battle: BattleState, reference: Ref<Unit & Deployable>): BattleState {
    if (!canRetreat(battle, reference)) {
        return battle;
    }

    const self = reference.get(battle)!;
    const refund = self.deployable.refund;
    if (refund !== null) {
        const amount = Math.max(
            0,
            Math.floor(Math.min(self.deployable.cost * refund.rate, refund.limit)),
        );
        battle = modify(battle, amount);
    }

    return remove(battle, reference, { reason: "RETREAT" });
}
