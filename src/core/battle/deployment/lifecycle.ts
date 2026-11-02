import type { Ref } from "../../common/ref.js";
import type { Departure, Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { State as BattleState } from "../state.js";
import { remove } from "../unit.js";
import * as units from "../../unit/query.js";
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
        if (definition.increaseCostOnLeave) {
            battle = cards.incrementCostStage(battle, card);
        }
        if (definition.recoverOnLeave) {
            battle = cards.enqueueRecovery(battle, card);
        }
    }

    return remove(battle, reference.id, "RETREAT");
}
