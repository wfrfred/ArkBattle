import { assertPositiveSafeInteger } from "../common/assert.js";
import type { TilePosition } from "../geometry/coordinate.js";
import type { State } from "./state.js";
import type { State as TileState } from "./map/tile.js";
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

    assertPositiveSafeInteger(state.walkCost, "tile walk cost");
    const index = position[0] * field.map.columns + position[1];
    const map = { ...field.map, tiles: field.map.tiles.replace(index, state) };
    const navigationChanged =
        previous.state.passability !== state.passability ||
        previous.state.walkCost !== state.walkCost;

    return {
        ...field,
        map,
        navigation: navigationChanged
            ? {
                  ...field.navigation,
                  baseline: {
                      WALK: navigation.create(map, "WALK"),
                      FLY: navigation.create(map, "FLY"),
                  },
              }
            : field.navigation,
    };
}
