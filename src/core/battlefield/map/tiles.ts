import { create, type Query } from "../../common/query.js";
import type { Terrain } from "./terrain.js";
import type { State, Tile } from "./tile.js";

export class Tiles {
    static readonly #empty = new Tiles([]);

    readonly #entries: readonly Tile[];

    private constructor(entries: readonly Tile[]) {
        this.#entries = entries;
    }

    static empty(): Tiles {
        return Tiles.#empty;
    }

    get size(): number {
        return this.#entries.length;
    }

    get(index: number): Tile | undefined;
    get<P extends object>(index: number, definition: Terrain<P>["definition"]): Tile<P> | undefined;
    get(index: number, definition?: Terrain["definition"]): Tile | undefined {
        const tile = this.#entries[index];

        if (definition === undefined) {
            return tile;
        }

        return tile?.definition.terrain.definition === definition ? tile : undefined;
    }

    values(): Query<Tile> {
        return create(() => this.#entries[Symbol.iterator]());
    }

    add(tile: Tile): Tiles {
        return new Tiles([...this.#entries, tile]);
    }

    replace(index: number, state: State): Tiles {
        const tile = this.#entries[index]!;
        if (tile.state === state) {
            return this;
        }

        const entries = [...this.#entries];
        entries[index] = { ...tile, state };

        return new Tiles(entries);
    }
}
