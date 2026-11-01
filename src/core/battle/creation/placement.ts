import type { WorldPosition } from "../../geometry/coordinate.js";
import * as initialization from "../../unit/initialize.js";
import type { Initial, Inputs, Product } from "../../unit/capability/catalog.js";
import type { Unit, Definition } from "../../unit/unit.js";
import type { ImmutableData } from "../../common/immutable-data.js";
import type { Hook } from "../../unit/hook.js";
import type { Result, State as BattleState } from "../state.js";

declare const paired: unique symbol;

interface PlacementInitial {
    readonly [paired]: true;
}

export interface UnitPlacementDefinition<D extends Definition = Definition> {
    readonly definition: D;
    readonly position: WorldPosition;
    readonly initial?: PlacementInitial;
    readonly hooks?: readonly Hook[];
}

interface Input<D extends Definition> {
    readonly definition: D;
    readonly position: WorldPosition;
    readonly initial?: Initial<NoInfer<D>>;
    readonly hooks?: readonly Hook[];
}

interface ErasedPlacement {
    readonly definition: Definition;
    readonly position: WorldPosition;
    readonly initial?: object;
    readonly hooks?: readonly Hook[];
}

type NormalizedUnitPlacement<P extends Input<any>> = P extends unknown
    ? UnitPlacementDefinition<ImmutableData<P["definition"]>>
    : never;

export function createUnitPlacementDefinition<D extends Definition>(
    placement: UnitPlacementDefinition<D>,
): UnitPlacementDefinition<ImmutableData<D>>;
export function createUnitPlacementDefinition<P extends Input<any>>(
    placement: P & { readonly initial?: Initial<NoInfer<P["definition"]>> },
): NormalizedUnitPlacement<P>;
export function createUnitPlacementDefinition(placement: ErasedPlacement): ErasedPlacement {
    return {
        definition: placement.definition,
        ...(placement.initial === undefined ? {} : { initial: placement.initial }),
        ...(placement.hooks === undefined ? {} : { hooks: placement.hooks }),
        position: placement.position,
    };
}

export function instantiateUnitPlacement<D extends Definition>(
    battle: BattleState,
    placement: UnitPlacementDefinition<D>,
): Result<Unit & Product<D>>;
export function instantiateUnitPlacement<P extends Input<any>>(
    battle: BattleState,
    placement: P & { readonly initial?: Initial<NoInfer<P["definition"]>> },
): Result<Unit & Product<P["definition"]>>;
export function instantiateUnitPlacement(
    battle: BattleState,
    placement: ErasedPlacement,
): Result<Unit> {
    const id = battle.execution.nextUnitId;
    battle = { ...battle, execution: { ...battle.execution, nextUnitId: id + 1 } };
    // The constructor or the immediate typed input pairs capabilities with their initial inputs.
    const initialized = initialization.initialize(battle, {
        id,
        definition: placement.definition,
        position: placement.position,
        ...(placement.initial === undefined
            ? {}
            : { initial: placement.initial as Partial<Inputs> }),
        ...(placement.hooks === undefined ? {} : { hooks: placement.hooks }),
    } as initialization.Input<any>);

    return initialized;
}
