import type { Id, Unit } from "../unit/unit.js";
import type { Id as ProjectileId, Projectile } from "../projectile/projectile.js";
import { Store } from "../common/collection/store.js";
import type { Map as TileMap } from "./map/map.js";
import * as maps from "./map/navigation.js";
import * as navigation from "./navigation/state.js";
import type { TileOccupancy } from "./occupancy.js";

export interface State {
    readonly map: TileMap;
    readonly units: ReadonlyMap<Id, Unit>;
    readonly projectiles: Store<ProjectileId, Projectile<object, any>>;
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
        projectiles: Store.empty<ProjectileId, Projectile<object, any>>(),
        occupancy: new Map(),
        navigation: state,
    };
}
