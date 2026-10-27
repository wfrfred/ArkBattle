import type { TilePosition } from "../../geometry/coordinate.js";
import { DIRECTIONS, type Direction } from "../../geometry/direction.js";

export interface Cell {
    readonly passable: boolean;
    readonly cost: number;
    readonly departures: Readonly<Record<Direction, boolean>>;
}

export type Hash = number;

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
        const [row, col] = position;

        return row >= 0 && row < this.rows && col >= 0 && col < this.columns;
    }

    get(position: TilePosition): Cell | undefined {
        return this.contains(position)
            ? this.cells[position[0] * this.columns + position[1]]
            : undefined;
    }

    equals(other: Map): boolean {
        return (
            this === other ||
            (this.rows === other.rows &&
                this.columns === other.columns &&
                this.cells.every((cell, index) => {
                    const compared = other.cells[index]!;

                    return (
                        cell.passable === compared.passable &&
                        cell.cost === compared.cost &&
                        DIRECTIONS.every(
                            (direction) =>
                                cell.departures[direction] === compared.departures[direction],
                        )
                    );
                }))
        );
    }
}

function append(hash: number, value: number): number {
    const low = value >>> 0;
    const high = Math.floor(value / 0x1_0000_0000);

    return Math.imul(Math.imul(hash ^ low, 0x0100_0193) ^ high, 0x0100_0193);
}

export function hash(map: Map): Hash {
    let result = append(append(0x811c_9dc5, map.rows), map.columns);

    for (const cell of map.cells) {
        result = append(append(result, Number(cell.passable)), cell.cost);

        for (const direction of DIRECTIONS) {
            result = append(result, Number(cell.departures[direction]));
        }
    }

    return result >>> 0;
}
