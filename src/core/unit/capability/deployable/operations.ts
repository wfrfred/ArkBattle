import type { State as BattleState } from "../../../battle/state.js";
import type { Ref } from "../../../common/ref.js";
import { modify } from "../../../battle/deployment/dp/operations.js";
import { remove } from "../../operations.js";
import { canRetreat } from "./query.js";
import type { Unit } from "../../unit.js";
import type { Deployable, State } from "./capability.js";

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
