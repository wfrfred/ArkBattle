import { replace } from "../../../battle/unit.js";
import type { State as BattleState } from "../../../battle/state.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import type { Direction, Facing } from "./capability.js";

export function turn(
    battle: BattleState,
    reference: Ref<Unit & Facing>,
    direction: Direction,
    mode: "NORMAL" | "FORCED" = "NORMAL",
): BattleState {
    const self = units.get(battle, reference);
    if (self?.lifecycle !== "PRESENT" || self.facing.direction === direction) {
        return battle;
    }
    if (
        mode === "NORMAL" &&
        !self.facing.rules.every((rule) => rule.allows(battle, { self, direction }))
    ) {
        return battle;
    }

    return replace(battle, [{ ...self, facing: { ...self.facing, direction } }]);
}
