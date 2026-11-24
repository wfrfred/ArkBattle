import type { State as BattleState } from "../state.js";
import type { EndReason } from "../../unit/unit.js";
import type { State as DeployableState } from "../../unit/capability/deployable/capability.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import { recycle } from "./deck/card/operations.js";
import { replace } from "./deck/operations.js";
import { release } from "./slot/operations.js";

export function settleDeparture(
    battle: BattleState,
    reason: EndReason,
    { card, slots }: Pick<DeployableState, "card" | "slots">,
): BattleState {
    battle = reason === "DEATH" ? release(battle, slots, TICKS_PER_SECOND) : release(battle, slots);

    if (
        card !== null &&
        (reason === "RETREAT" || reason === "DEATH" || reason === "REDEPLOY_EXTERNAL")
    ) {
        const self = card.get(battle)!;

        return replace(battle, recycle(self));
    }

    return battle;
}
