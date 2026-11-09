import { Tiles } from "../../dist/core/battlefield/map/tiles.js";

export function tiles(entries) {
    return entries.reduce((result, tile) => result.add(tile), Tiles.empty());
}

export function tilesOf(map, definition) {
    return Array.from({ length: map.tiles.size }, (_, index) => map.tiles.get(index, definition))
        .filter(tile => tile !== undefined);
}
