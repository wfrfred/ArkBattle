import type { Ref } from "../../common/ref.js";
import type { Departure, Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { State as BattleState } from "../state.js";
import { remove } from "../unit.js";
import * as units from "../../unit/query.js";
import { setHook, removeHook } from "../unit-hook.js";
import * as cards from "./card/operations.js";
import { get } from "./card/query.js";
import { changeDp } from "./dp.js";

export { dispatch as notifyDeployed } from "./hook.js";

export function releaseSlots(battle: BattleState, departure: Departure): BattleState {
    const self = departure.unit as Unit & Deployable;

    return self.deployable.slots === 0
        ? battle
        : {
              ...battle,
              deployment: {
                  ...battle.deployment,
                  usedSlots: battle.deployment.usedSlots - self.deployable.slots,
              },
          };
}

export function retreat(battle: BattleState, reference: Ref<Unit & Deployable>): BattleState {
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
        const definition = get(battle, card)!.definition.card;
        const id = `@deployment/retreat/${reference.id}`;
        battle = setHook(battle, "leave", {
            id,
            accepts: (_current, departure) => departure.unit.id === reference.id,
            invoke: (current) => {
                current = removeHook(current, "leave", id);

                if (definition.increaseCostOnLeave) {
                    current = cards.incrementCostStage(current, card);
                }
                if (definition.recoverOnLeave) {
                    current = cards.enqueueRecovery(current, card);
                }

                return { state: current, value: undefined };
            },
        });
    }

    return remove(battle, reference.id, "RETREAT");
}
