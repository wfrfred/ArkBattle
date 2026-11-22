import type { State as BattleState } from "../state.js";
import type { EndReason } from "../../unit/unit.js";
import type { State as DeployableState } from "../../unit/capability/deployable/capability.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import { recycle } from "./deck/card/operations.js";

export function settleDeparture(
    battle: BattleState,
    reason: EndReason,
    { card, slots }: Pick<DeployableState, "card" | "slots">,
): BattleState {
    if (slots !== 0) {
        const current = battle.deployment;
        const deployment =
            reason === "DEATH"
                ? {
                      ...current,
                      pendingSlotReleases: [
                          ...current.pendingSlotReleases,
                          { readyAtTick: battle.tick + TICKS_PER_SECOND, slots },
                      ],
                  }
                : { ...current, usedSlots: current.usedSlots - slots };
        battle = { ...battle, deployment };
    }

    return card !== null &&
        (reason === "RETREAT" || reason === "DEATH" || reason === "REDEPLOY_EXTERNAL")
        ? recycle(battle, card)
        : battle;
}
