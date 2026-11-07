import { Vec2 } from "../../common/vector.js";
import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import { createRng } from "../../common/rng.js";
import { Tile, type WorldPosition } from "../../geometry/coordinate.js";
import type { Definition, Unit } from "../../unit/unit.js";
import type { Definitions, Product } from "../../unit/capability/catalog.js";
import type { Route } from "../../unit/capability/route/capability.js";
import { initialize as initializeUnit, type Input as UnitInput } from "../../unit/initialize.js";
import type { Result, State as BattleState } from "../state.js";
import { createInput, normalize, type Input as RouteInput, type Timing } from "./route.js";

export type Input<D extends Definition & Partial<Definitions> = Definition> = Omit<
    UnitInput<D>,
    "position" | "hooks"
> & {
    readonly route: RouteInput;
    readonly timing: Timing;
    readonly alwaysCheckCurrentPoint: boolean;
};

type RoutedDefinition<D> = D extends unknown ? Omit<D, "route"> & Route["definition"] : never;

function sampleOffset(input: RouteInput, next: () => number): WorldPosition {
    return [
        input.spawnOffset[0] +
            (-input.spawnRandomRange[0] + next() * (2 * input.spawnRandomRange[0])),
        input.spawnOffset[1] +
            (-input.spawnRandomRange[1] + next() * (2 * input.spawnRandomRange[1])),
    ];
}

export function initialize<D extends Definition & Partial<Definitions>>(
    battle: BattleState,
    spawn: Input<D>,
): Result<Unit & Product<RoutedDefinition<D>> & Route>;
export function initialize<D extends Definition & Partial<Definitions>>(
    battle: BattleState,
    spawn: Input<D>,
): Result<Unit> {
    assertNonnegativeSafeInteger(spawn.id, "unit id");

    const input = createInput(spawn.route);
    const rng = createRng(battle.execution.rngState);
    const offset = sampleOffset(input, () => rng.next());
    const route = normalize(input, spawn.timing, offset, spawn.alwaysCheckCurrentPoint);

    battle = { ...battle, execution: { ...battle.execution, rngState: rng.state() } };

    const unitInput = {
        ...spawn,
        definition: { ...spawn.definition, route },
        position: Vec2.add(Tile.center(route.startPosition), route.offset),
    } as UnitInput<RoutedDefinition<D>>;

    return initializeUnit(battle, unitInput);
}
