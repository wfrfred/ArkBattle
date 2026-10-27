import { assertFiniteNumber, assertSafeInteger } from "../../core/common/assert.js";
import {
    create as createMap,
    type BlockEdge,
    type Map,
    type Marker,
} from "../../core/battlefield/map/map.js";
import {
    create as createTile,
    type Placement,
    type Elevation,
    type Passability,
} from "../../core/battlefield/map/tile.js";
import type { Terrain } from "../../core/battlefield/map/terrain.js";
import { Tiles } from "../../core/battlefield/map/tiles.js";
import {
    normal,
    hole,
    infection,
    mire,
    deepsea,
    smog,
    type DeepseaParams,
    type MireParams,
} from "../../content/terrain/definition.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import { Direction } from "../../core/geometry/direction.js";
import { parseBlackboard, type ArknightsBlackboardEntry } from "./blackboard.js";
import { secondsToTicks } from "./tick.js";
import type { TileDeploymentPrefab } from "./prefab.js";
import { parseSiteCondition } from "./site-condition.js";

export interface ArknightsTileContext {
    readonly tileKey: string;
    readonly position: TilePosition;
}

export interface ArknightsMapOptions {
    readonly mire?: MireParams;
    readonly deepsea?: DeepseaParams;
    readonly tileDeploymentPrefabs?: readonly TileDeploymentPrefab[];
    readonly consumeTileBlackboard?: (
        context: ArknightsTileContext,
        entry: ArknightsBlackboardEntry,
    ) => boolean;
}

const ORDINARY_TILE_KEYS = new Set([
    "tile_forbidden",
    "tile_road",
    "tile_floor",
    "tile_wall",
    "tile_achand",
    "tile_fence_bound",
    "tile_start",
    "tile_end",
    "tile_telin",
    "tile_telout",
]);

const MARKER_TYPES: Readonly<Record<string, Marker["type"]>> = {
    tile_start: "START",
    tile_end: "END",
    tile_telin: "TELEPORT_IN",
    tile_telout: "TELEPORT_OUT",
};

function record(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

function array(value: unknown, name: string): readonly unknown[] {
    if (!Array.isArray(value)) {
        throw new TypeError(`${name} must be an array`);
    }
    for (let index = 0; index < value.length; index++) {
        if (!Object.hasOwn(value, index) || value[index] === undefined) {
            throw new RangeError(`${name} is missing index ${index}`);
        }
    }

    return value;
}

function string(value: unknown, name: string): string {
    if (typeof value !== "string") {
        throw new TypeError(`${name} must be a string`);
    }

    return value;
}

function finite(value: unknown, name: string): number {
    assertFiniteNumber(value, name);

    return value;
}

function requireKnownFields(
    source: Record<string, unknown>,
    fields: readonly string[],
    name: string,
): void {
    for (const key of Object.keys(source)) {
        if (!fields.includes(key)) {
            throw new TypeError(`${name} has unsupported field ${key}`);
        }
    }
}

function requireEmpty(value: unknown, name: string): void {
    if (value !== undefined && value !== null && array(value, name).length !== 0) {
        throw new TypeError(`${name} is not supported`);
    }
}

function tileBlackboard(value: unknown): readonly ArknightsBlackboardEntry[] {
    if (value === null || value === undefined) {
        return Object.freeze([]);
    }

    return parseBlackboard(value, "tile blackboard", {
        allowEmptyKeys: true,
        allowMissingValueStr: true,
    });
}

function parseTile(
    value: unknown,
    position: TilePosition,
    options: ArknightsMapOptions,
    tiles: Tiles,
): { readonly tiles: Tiles; readonly marker: Marker | null } {
    const source = record(value, "tile definition");
    requireKnownFields(
        source,
        [
            "tileKey",
            "heightType",
            "buildableType",
            "passableMask",
            "playerSideMask",
            "advancedBuildableMask",
            "blackboard",
            "effects",
        ],
        "tile definition",
    );

    const tileKey = string(source.tileKey, "tile key");

    requireEmpty(source.effects, `${tileKey} effects`);

    const blackboard = tileBlackboard(source.blackboard);
    const consumed = new Set<string>();
    const heightType = string(source.heightType, "tile height type") as Elevation;
    const blockable = blackboard.find((entry) => entry.key === "tile_blockable");
    if (blockable !== undefined) {
        if (blockable.valueStr !== null) {
            throw new TypeError("tile_blockable requires a numeric blackboard value");
        }

        consumed.add(blockable.key);
    }

    function finish<P extends object>(terrain: Terrain<P>, walkCost = 1) {
        const context = { tileKey, position };

        for (const entry of blackboard) {
            if (
                !consumed.has(entry.key) &&
                options.consumeTileBlackboard?.(context, entry) !== true
            ) {
                throw new TypeError(`unconsumed blackboard ${entry.key} for ${tileKey}`);
            }
        }

        const prefab = options.tileDeploymentPrefabs?.find((entry) => entry.prefabKey === tileKey);
        const tile = createTile({
            terrain,
            initial: {
                elevation: heightType,
                allowsBlocking:
                    blockable === undefined ? heightType === "LOWLAND" : blockable.value !== 0,
                placement: string(source.buildableType, "tile buildable type") as Placement,
                passability: string(source.passableMask, "tile passable mask") as Passability,
                siteCondition:
                    prefab === undefined
                        ? parseSiteCondition(
                              source.advancedBuildableMask ?? (tileKey === "tile_deepsea" ? 2 : 1),
                              "tile advanced buildable mask",
                          )
                        : prefab.siteCondition,
                walkCost,
            },
        });
        const markerType = MARKER_TYPES[tileKey];

        return {
            tiles: tiles.add(tile),
            marker: markerType === undefined ? null : { type: markerType, position },
        };
    }

    switch (tileKey) {
        case "tile_infection": {
            function parameter(key: string): number {
                const entry = blackboard.find((item) => item.key === key);
                if (entry?.valueStr !== null) {
                    throw new TypeError(`infection requires numeric blackboard ${key}`);
                }

                consumed.add(key);

                return entry.value;
            }

            return finish(
                infection.create({
                    damage: parameter("damage"),
                    attackBonusRatio: parameter("atk"),
                    attackSpeedBonus: parameter("attack_speed"),
                    durationTicks: secondsToTicks(parameter("duration"), "infection duration"),
                }),
            );
        }

        case "tile_mire":
            if (options.mire === undefined) {
                throw new TypeError("mire controller parameters must be supplied explicitly");
            }

            return finish(mire.create(options.mire));

        case "tile_deepsea":
            if (options.deepsea === undefined) {
                throw new TypeError("deepsea controller parameters must be supplied explicitly");
            }

            return finish(deepsea.create(options.deepsea));

        case "tile_smog":
            return finish(smog.create({}));

        case "tile_hole":
            return finish(hole.create({}), 1_000_000);

        default:
            if (!ORDINARY_TILE_KEYS.has(tileKey)) {
                throw new TypeError(`unsupported tile key ${tileKey}`);
            }

            return finish(normal.create({}));
    }
}

function parseBlockEdge(value: unknown): BlockEdge {
    const source = record(value, "block edge");
    requireKnownFields(source, ["pos", "direction", "blockMask"], "block edge");
    const pos = record(source.pos, "block edge position");
    requireKnownFields(pos, ["row", "col"], "block edge position");
    const direction = source.direction;
    if (!Direction.is(direction)) {
        throw new TypeError("unsupported block edge direction");
    }

    assertSafeInteger(pos.row, "block edge row");
    assertSafeInteger(pos.col, "block edge column");

    return {
        position: [pos.row, pos.col],
        direction,
        blockMask: string(source.blockMask, "block edge mask") as Passability,
    };
}

export function parseBattlefieldMap(value: unknown, options: ArknightsMapOptions = {}): Map {
    const source = record(value, "map data");
    requireKnownFields(
        source,
        ["map", "tiles", "blockEdges", "tags", "effects", "layerRects"],
        "map data",
    );
    requireEmpty(source.tags, "map tags");
    requireEmpty(source.effects, "map effects");
    requireEmpty(source.layerRects, "map layers");

    const matrix = array(source.map, "map matrix");
    if (matrix.length === 0) {
        throw new RangeError("map matrix must have at least one row");
    }

    const columns = array(matrix[0], "map row").length;
    if (columns === 0) {
        throw new RangeError("map matrix must have at least one column");
    }

    const definitions = array(source.tiles, "tile definitions");
    let tiles = Tiles.empty();
    const markers: Marker[] = [];

    for (let row = 0; row < matrix.length; row++) {
        const sourceRowIndex = matrix.length - row - 1;
        const rawRow = array(matrix[sourceRowIndex], "map row");
        if (rawRow.length !== columns) {
            throw new RangeError("map matrix must be rectangular");
        }
        for (let col = 0; col < columns; col++) {
            const definitionIndex = finite(rawRow[col], "tile definition index");
            if (
                !Number.isSafeInteger(definitionIndex) ||
                definitionIndex < 0 ||
                definitionIndex >= definitions.length
            ) {
                throw new RangeError(`invalid tile definition index ${definitionIndex}`);
            }

            const parsed = parseTile(definitions[definitionIndex], [row, col], options, tiles);
            tiles = parsed.tiles;

            if (parsed.marker !== null) {
                markers.push(parsed.marker);
            }
        }
    }

    const blockEdges =
        source.blockEdges === null || source.blockEdges === undefined
            ? []
            : array(source.blockEdges, "block edges").map(parseBlockEdge);

    return createMap(matrix.length, columns, tiles, markers, blockEdges);
}
