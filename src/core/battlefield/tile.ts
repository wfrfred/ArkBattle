import type { TilePosition } from "../geometry/coordinate.js";
import type { State } from "./state.js";
import { validateState, type State as TileState } from "./map/tile.js";
import * as maps from "./map/map.js";
import * as navigation from "./map/navigation.js";

export function update(field: State, position: TilePosition, state: TileState): State {
    const previous = maps.get(field.map, position);
    if (previous === undefined) {
        throw new RangeError("tile is outside the map");
    }
    if (previous.state === state) {
        return field;
    }

    validateState(state);
    const index = position[0] * field.map.columns + position[1];
    const map = { ...field.map, tiles: field.map.tiles.replace(index, state) };
    const walkChanged =
        navigation.includesMode(previous.state.passability, "WALK") !==
            navigation.includesMode(state.passability, "WALK") ||
        previous.state.walkCost !== state.walkCost;
    const flyChanged =
        navigation.includesMode(previous.state.passability, "FLY") !==
        navigation.includesMode(state.passability, "FLY");

    return {
        ...field,
        map,
        navigation:
            walkChanged || flyChanged
                ? {
                      WALK: walkChanged
                          ? { ...field.navigation.WALK, baseline: navigation.create(map, "WALK") }
                          : field.navigation.WALK,
                      FLY: flyChanged
                          ? { ...field.navigation.FLY, baseline: navigation.create(map, "FLY") }
                          : field.navigation.FLY,
                  }
                : field.navigation,
    };
}
