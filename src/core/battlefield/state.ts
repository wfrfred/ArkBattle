import type { Id, Unit } from "../unit/unit.js";
import type { Map as TileMap } from "./map/map.js";
import * as maps from "./map/navigation.js";
import * as navigation from "./navigation/state.js";
import type { TileOccupancy } from "./occupancy.js";
import { Projectiles } from "../projectile/projectiles.js";

export interface State {
    readonly map: TileMap;
    readonly units: ReadonlyMap<Id, Unit>;
    readonly projectiles: Projectiles;
    readonly navigation: navigation.State;
    readonly occupancy: ReadonlyMap<number, TileOccupancy>;
}

export function create(map: TileMap): State {
    const state = navigation.create({
        WALK: maps.create(map, "WALK"),
        FLY: maps.create(map, "FLY"),
    });

    return {
        map,
        units: new Map<Id, Unit>(),
        projectiles: Projectiles.empty(),
        occupancy: new Map(),
        navigation: state,
    };
}
