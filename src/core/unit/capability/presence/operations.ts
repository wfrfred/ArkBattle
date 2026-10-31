import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as blocking from "../../../battle/blocking/operations.js";
import { relations } from "../../../battle/blocking/query.js";
import { replace } from "../../../battle/unit.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import type { SpatialPresence } from "./capability.js";
import { hasBlockable } from "../blocking/blockable.js";

export function disappear(battle: BattleState, ref: Ref<Unit & SpatialPresence>): BattleState {
    const unit = units.get(battle, ref);
    if (unit?.lifecycle !== "PRESENT") {
        return battle;
    }

    const next = { ...unit, spatialPresence: { present: false } };

    return changePresence(battle, next);
}

export function appear(
    battle: BattleState,
    ref: Ref<Unit & SpatialPresence>,
    position: WorldPosition,
): BattleState {
    const unit = units.get(battle, ref);
    if (unit?.lifecycle !== "PRESENT") {
        return battle;
    }

    const next = { ...unit, position, spatialPresence: { present: true } };

    return changePresence(battle, next);
}

function changePresence(battle: BattleState, unit: Unit & SpatialPresence): BattleState {
    const next =
        hasBlockable(unit) && unit.blockable.adjustment !== null
            ? { ...unit, blockable: { ...unit.blockable, adjustment: null } }
            : unit;
    battle = replace(battle, [next]);

    return blocking.release(battle, relations(battle, units.ref(next)));
}
