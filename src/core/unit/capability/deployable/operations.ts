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
