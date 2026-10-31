import type { WorldPosition } from "../geometry/coordinate.js";
import type { State as BattleState, Result } from "../battle/state.js";
import { initializers, type Definitions, type Product } from "./capability/catalog.js";
import { Effects } from "./effect/effects.js";
import type { Unit, Definition, Id } from "./unit.js";

export interface Input<D extends Definition & Partial<Definitions> = Definition> {
    readonly id: Id;
    readonly definition: D;
    readonly position: WorldPosition;
}

export function initialize<D extends Definition & Partial<Definitions>>(
    battle: BattleState,
    input: Input<D>,
): Result<Unit & Product<D>>;
export function initialize(
    battle: BattleState,
    input: Input<Definition & Partial<Definitions>>,
): Result<Unit> {
    if ("blocker" in input.definition && "blockable" in input.definition) {
        throw new TypeError("a unit cannot be both blocker and blockable");
    }

    let unit: Unit = {
        id: input.id,
        lifecycle: "PRESENT",
        definition: input.definition,
        hooks: [],
        position: input.position,
        effects: Effects.empty(),
    };

    for (const key of Object.keys(initializers) as (keyof typeof initializers)[]) {
        if (!(key in input.definition)) {
            continue;
        }

        // The selected key pairs this Unit's definition with its initializer before erasure.
        const initializer = initializers[key] as (battle: BattleState, unit: Unit) => Result<Unit>;
        const initialized = initializer(battle, unit);
        battle = initialized.state;
        unit = initialized.value;
    }

    return {
        state: battle,
        value: {
            ...unit,
            hooks: [...unit.hooks, ...input.definition.hooks],
        },
    };
}
