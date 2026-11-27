import type { Unit } from "../unit/unit.js";
import type { Projectile } from "../projectile/projectile.js";
import type { Ref } from "../common/ref.js";
import { Store } from "../common/collection/store.js";
import type { Map as TileMap } from "./map/map.js";
import * as maps from "./map/navigation.js";
import * as navigation from "./navigation/state.js";
import type { TileOccupancy } from "./occupancy.js";

export interface State {
    readonly map: TileMap;
    readonly units: ReadonlyMap<Ref<Unit>, Unit>;
    readonly projectiles: Store<Ref<Projectile>, Projectile>;
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
        units: new Map<Ref<Unit>, Unit>(),
        projectiles: Store.empty<Ref<Projectile>, Projectile>(),
        occupancy: new Map(),
        navigation: state,
    };
}
