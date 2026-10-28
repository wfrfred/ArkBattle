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
    const states: Record<string, unknown> = {};

    for (const key of Object.keys(initializers) as (keyof typeof initializers)[]) {
        if (!(key in input.definition)) {
            continue;
        }

        const definition = input.definition[key];
        const initialized = initializers[key](battle, definition as never);
        battle = initialized.state;
        states[key] = initialized.value;
    }

    return {
        state: battle,
        value: {
            id: input.id,
            lifecycle: "PRESENT",
            definition: input.definition,
            position: input.position,
            effects: Effects.empty(),
            ...states,
        },
    };
}
