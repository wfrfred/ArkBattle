import type { Ref } from "../common/ref.js";
import type { TilePosition } from "../geometry/coordinate.js";
import type { Occupancy } from "../unit/capability/occupancy/capability.js";
import type { Unit } from "../unit/unit.js";
import { contains } from "./map/map.js";
import type { State } from "./state.js";

export interface TileOccupancy {
    readonly occupant: Ref<Unit & Occupancy> | null;
    readonly support: Ref<Unit & Occupancy> | null;
}

export function at(field: State, tile: TilePosition): TileOccupancy | undefined {
    if (!contains(field.map, tile)) {
        return undefined;
    }

    return field.occupancy.get(tile[0] * field.map.columns + tile[1]);
}
