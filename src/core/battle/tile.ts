import type { TilePosition } from "../geometry/coordinate.js";
import type { State as TileState } from "../battlefield/map/tile.js";
import * as tiles from "../battlefield/tile.js";
import * as blocking from "./blocking/operations.js";
import type { State } from "./state.js";

export function update(battle: State, position: TilePosition, state: TileState): State {
    const battlefield = tiles.update(battle.battlefield, position, state);

    return battlefield === battle.battlefield
        ? battle
        : blocking.maintain({ ...battle, battlefield });
}
