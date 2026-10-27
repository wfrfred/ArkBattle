import { update } from "../unit.js";
import * as units from "../../unit/query.js";
import { endDependents } from "../../unit/effect/operations.js";
import type { Lifetime } from "../../unit/effect/effect.js";
import { type State as BattleState } from "../state.js";

export function closeLifetime(
    state: BattleState,
    lifetime: Lifetime,
    reason = "SCOPE_CLOSED",
): BattleState {
    if (lifetime.type === "UNIT") {
        const unit = units.get(state, lifetime.ref);

        if (unit !== undefined && unit.lifecycle !== "LEAVING") {
            state = update(state, [{ ...unit, lifecycle: "LEAVING" }]);
        }
    }

    return endDependents(state, lifetime, reason);
}
