import type { Passability, Tile } from "./tile.js";
import type { Terrain } from "./terrain.js";
import type { Tiles } from "./tiles.js";
import { assertPositiveSafeInteger } from "../../common/assert.js";
import { Tile as TileCoordinates, type TilePosition } from "../../geometry/coordinate.js";
import { Direction } from "../../geometry/direction.js";

export interface Marker {
    readonly type: "START" | "END" | "TELEPORT_IN" | "TELEPORT_OUT";
    readonly position: TilePosition;
}

export interface BlockEdge {
    readonly position: TilePosition;
    readonly direction: Direction;
    readonly blockMask: Passability;
}

export interface Map {
    readonly rows: number;
    readonly columns: number;
    readonly tiles: Tiles;
    readonly markers: readonly Marker[];
    readonly blockEdges: readonly BlockEdge[];
}

export function contains(map: Map, position: TilePosition): boolean {
    if (!TileCoordinates.is(position)) {
        return false;
    }

    const [row, col] = position;

    return row >= 0 && row < map.rows && col >= 0 && col < map.columns;
}

export function get(map: Map, position: TilePosition): Tile | undefined;
export function get<P extends object>(
    map: Map,
    position: TilePosition,
    definition: Terrain<P>["definition"],
): Tile<P> | undefined;
export function get(
    map: Map,
    position: TilePosition,
    definition?: Terrain["definition"],
): Tile | undefined {
    if (!contains(map, position)) {
        return undefined;
    }

    const [row, col] = position;

    const index = row * map.columns + col;

    return definition === undefined ? map.tiles.get(index) : map.tiles.get(index, definition);
}

export function create(
    rows: number,
    columns: number,
    tiles: Tiles,
    markers: readonly Marker[],
    blockEdges: readonly BlockEdge[],
): Map {
    assertPositiveSafeInteger(rows, "battlefield row count");
    assertPositiveSafeInteger(columns, "battlefield column count");

    const tileCount = rows * columns;
    if (tiles.size !== tileCount) {
        throw new RangeError(`expected ${tileCount} tiles, got ${tiles.size}`);
    }

    const map: Map = {
        rows,
        columns,
        tiles,
        markers,
        blockEdges,
    };

    for (const [index, marker] of markers.entries()) {
        const position = marker.position;
        if (!contains(map, position)) {
            throw new RangeError(`marker at index ${index} is outside the map`);
        }
    }

    for (const [index, edge] of blockEdges.entries()) {
        const position = edge.position;
        if (!TileCoordinates.is(position)) {
            throw new RangeError(`block edge at index ${index} has an invalid tile position`);
        }

        const [dRow, dCol] = Direction.vector(edge.direction);
        const neighbor: TilePosition = [position[0] + dRow, position[1] + dCol];
        if (!contains(map, position) && !contains(map, neighbor)) {
            throw new RangeError(`block edge at index ${index} has no endpoint inside the map`);
        }
    }

    return map;
}
