import type { State as BattleState } from "../state.js";
import type { EndReason } from "../../unit/unit.js";
import type { State as DeployableState } from "../../unit/capability/deployable/capability.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import { recycle } from "./deck/card/operations.js";
import { release } from "./slot/operations.js";

export function settleDeparture(
    battle: BattleState,
    reason: EndReason,
    { card, slots }: Pick<DeployableState, "card" | "slots">,
): BattleState {
    const readyAtTick = reason === "DEATH" ? battle.tick + TICKS_PER_SECOND : battle.tick;
    battle = release(battle, slots, readyAtTick);

    return card !== null &&
        (reason === "RETREAT" || reason === "DEATH" || reason === "REDEPLOY_EXTERNAL")
        ? recycle(battle, card)
        : battle;
}
