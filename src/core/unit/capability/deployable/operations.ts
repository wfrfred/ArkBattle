import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Ref } from "../../../common/ref.js";
import type { TilePosition } from "../../../geometry/coordinate.js";
import type { Direction } from "../../../geometry/direction.js";
import { modify } from "../../../battle/deployment/dp/operations.js";
import { deploy, recycle } from "../../../battle/deployment/deck/card/operations.js";
import { replace } from "../../../battle/deployment/deck/operations.js";
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

export function redeploy(
    battle: BattleState,
    reference: Ref<Unit & Deployable>,
    tilePosition: TilePosition,
    direction: Direction | null,
    kind: "SELF" | "EXTERNAL",
): Result<Ref<Unit & Deployable> | null> {
    const self = reference.get(battle);
    if (self?.lifecycle !== "ACTIVE" || self.deployable.card === null) {
        return { state: battle, value: null };
    }

    const { card } = self.deployable;
    const nextDirection = direction ?? self.occupancy.direction;
    battle = remove(battle, reference, {
        reason: kind === "SELF" ? "REDEPLOY_SELF" : "REDEPLOY_EXTERNAL",
    });

    if (reference.get(battle) !== undefined) {
        throw new Error(
            "redeploy requires completed removal; use lifetime.defer during settlement",
        );
    }

    const result = deploy(battle, {
        card,
        tilePosition,
        direction: nextDirection,
        quote: {
            dp: null,
            stock: 0,
            slots: card.get(battle)!.definition.slot,
        },
        restrictions: [
            {
                id: "@deployment/cooldown",
                group: null,
                value: { allows: () => true },
            },
        ],
    });

    if (result.value === null && kind === "SELF") {
        return { state: replace(result.state, recycle(card.get(result.state)!)), value: null };
    }

    return result;
}
