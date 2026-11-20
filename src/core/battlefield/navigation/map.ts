import { Tile, type TilePosition } from "../../geometry/coordinate.js";
import type { Direction } from "../../geometry/direction.js";

export interface Cell {
    readonly passable: boolean;
    readonly cost: number;
    readonly departures: Readonly<Record<Direction, boolean>>;
}

export class Map {
    readonly rows: number;
    readonly columns: number;
    readonly cells: readonly Cell[];

    constructor(rows: number, columns: number, cells: readonly Cell[]) {
        this.rows = rows;
        this.columns = columns;
        this.cells = cells;
    }

    contains(position: TilePosition): boolean {
        if (!Tile.is(position)) {
            return false;
        }

        const [row, col] = position;

        return row >= 0 && row < this.rows && col >= 0 && col < this.columns;
    }

    get(position: TilePosition): Cell | undefined {
        return this.contains(position)
            ? this.cells[position[0] * this.columns + position[1]]
            : undefined;
    }
}
