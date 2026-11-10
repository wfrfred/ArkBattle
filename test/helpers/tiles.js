import { Tiles } from "../../dist/core/battlefield/map/tiles.js";

export function tiles(entries) {
    return entries.reduce((result, tile) => result.add(tile), Tiles.empty());
}
