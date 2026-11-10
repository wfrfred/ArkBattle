import type { WorldPosition } from "../geometry/coordinate.js";
import type { State as BattleState, Result } from "../battle/state.js";
import {
    initializers,
    type Definitions,
    type Initial,
    type Inputs,
    type Product,
} from "./capability/catalog.js";
import { Effects } from "./effect/effects.js";
import type { Unit, Definition, Id } from "./unit.js";
import { Hooks } from "../hook.js";

export type Input<D extends Definition & Partial<Definitions> = Definition> = {
    readonly id: Id;
    readonly definition: D;
    readonly position: WorldPosition;
    readonly hooks?: Hooks;
} & (Partial<Initial<D>> extends Initial<D>
    ? { readonly initial?: Initial<D> }
    : { readonly initial: Initial<D> });

export function initialize<D extends Definition & Partial<Definitions>>(
    battle: BattleState,
    input: Input<D>,
): Result<Unit & Product<D>>;
export function initialize(
    battle: BattleState,
    input: Omit<Input, "initial"> & { readonly initial?: Partial<Inputs> },
): Result<Unit> {
    let unit: Unit = {
        id: input.id,
        lifecycle: "PRESENT",
        definition: input.definition,
        hooks: input.hooks ?? Hooks.empty(),
        position: input.position,
        effects: Effects.empty(),
    };

    for (const key of Object.keys(initializers) as (keyof typeof initializers)[]) {
        if (!(key in input.definition)) {
            continue;
        }

        const initializer = initializers[key] as (
            battle: BattleState,
            unit: Unit,
            initial?: unknown,
        ) => Result<Unit>;
        const initialized = initializer(battle, unit, input.initial?.[key]);
        battle = initialized.state;
        unit = initialized.value;
    }

    return {
        state: battle,
        value: {
            ...unit,
            hooks: unit.hooks.merge(input.definition.hooks),
        },
    };
}
