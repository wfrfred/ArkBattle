import { createChange, type Change } from "../../change.js";
import { ref } from "../../query.js";
import { hasBlocker } from "../blocking/blocker/blocker.js";
import { releaseAll } from "../blocking/blocker/operations.js";
import { hasBlockable } from "../blocking/blockable/blockable.js";
import { release } from "../blocking/blockable/operations.js";
import type { Unit } from "../../unit.js";
import type { State as BattleState, Result } from "../../../battle/state.js";

export type Type = "GROUND" | "AIR";

export interface Definition {
    readonly type: Type;
}

export interface State {
    readonly type: Type;
}

export interface Layer {
    readonly definition: { readonly layer: Definition };
    readonly layer: State;
}

export function hasLayer<U extends Unit>(unit: U): unit is U & Layer {
    return "layer" in unit && "layer" in unit.definition;
}

export function initialize<U extends Unit & Pick<Layer, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Layer> {
    return { state: battle, value: { ...unit, layer: { type: unit.definition.layer.type } } };
}

export function setType(type: Type): Change<Unit & Layer> {
    return createChange<Unit & Layer>(
        (unit) => ({ ...unit, layer: { type } }),
        (battle, previous) => {
            if (hasBlocker(previous)) {
                return releaseAll(battle, ref(previous));
            }
            if (hasBlockable(previous)) {
                return release(battle, ref(previous));
            }

            return battle;
        },
    );
}
