import { create, type Query } from "../../common/query.js";
import type { Definition } from "./terrain.js";
import type { State, Tile, View } from "./tile.js";

export class Tiles {
    static readonly #empty = new Tiles([]);

    readonly #entries: readonly View[];

    private constructor(entries: readonly View[]) {
        this.#entries = entries;
    }

    static empty(): Tiles {
        return Tiles.#empty;
    }

    get size(): number {
        return this.#entries.length;
    }

    get(index: number): View | undefined;
    get<P extends object>(index: number, definition: Definition<P>): Tile<P> | undefined;
    get<P extends object>(index: number, definition?: Definition<P>): View | Tile<P> | undefined {
        const tile = this.#entries[index];

        if (definition === undefined) {
            return tile;
        }

        return tile?.definition.terrain.definition === definition ? tile : undefined;
    }

    read<R>(index: number, reader: <P extends object>(tile: Tile<P>) => R): R | undefined {
        const tile = this.#entries[index];

        return tile === undefined ? undefined : reader(tile as Tile<object>);
    }

    values(): Query<View> {
        return create(() => this.#entries[Symbol.iterator]());
    }

    add<P extends object>(tile: Tile<P>): Tiles {
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
