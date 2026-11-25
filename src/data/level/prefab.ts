import type { SiteCondition, State as TileState } from "../../core/battlefield/map/tile.js";
import type { Side } from "../../core/side.js";
import { parsePrefabExtraction, getPrefabComponent, type PrefabExtraction } from "../prefab.js";
import { parseTags } from "../unit/tags.js";
import { parseSiteCondition } from "./site-condition.js";

export interface TileDeploymentPrefab {
    readonly prefabKey: string;
    readonly siteCondition: SiteCondition | null;
    readonly forceBoxCollider?: boolean;
}

export type PredefinedPrefab =
    | {
          readonly type: "UNIT";
          readonly prefabKey: string;
          readonly side: Side;
          readonly filterTags: readonly string[];
          readonly tileChanges: Partial<TileState>;
      }
    | {
          readonly type: "EFFECT";
          readonly prefabKey: string;
          readonly skillPrefabKey: string;
          readonly terrain: "MIRE" | "DEEPSEA";
      };

function object(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

function boolean(value: unknown, name: string): boolean {
    if (typeof value !== "boolean") {
        throw new TypeError(`${name} must be boolean`);
    }

    return value;
}

function side(value: unknown): Side {
    switch (value) {
        case 1:
            return "ALLY";

        case 2:
            return "ENEMY";

        case 4:
            return "NEUTRAL";

        default:
            throw new TypeError("unsupported token _sideType");
    }
}

export function parseTileDeploymentPrefab(value: unknown): TileDeploymentPrefab {
    const source = parsePrefabExtraction(value);
    const tile = getPrefabComponent(source, "_tileKey");
    const siteCondition = parseSiteCondition(
        tile._advancedBuildableMask,
        "tile _advancedBuildableMask",
    );

    if (tile._tileKey !== source.prefabKey) {
        throw new TypeError(`unsupported tile deployment profile ${source.prefabKey}`);
    }

    const forceBoxCollider =
        tile._forceBoxCollider === 0 || tile._forceBoxCollider === 1
            ? tile._forceBoxCollider === 1
            : tile._forceBoxCollider;

    return {
        prefabKey: source.prefabKey,
        siteCondition,
        ...(forceBoxCollider === undefined
            ? {}
            : { forceBoxCollider: boolean(forceBoxCollider, "tile _forceBoxCollider") }),
    };
}

function buffKeys(source: PrefabExtraction): ReadonlySet<string> {
    const keys = new Set<string>();

    for (const fields of source.components) {
        if (!Object.hasOwn(fields, "_metadata") || !Array.isArray(fields._buffs)) {
            continue;
        }

        for (const value of fields._buffs) {
            const buff = object(value, "prefab buff");
            if (typeof buff.buffKey === "string") {
                keys.add(buff.buffKey);
            }
        }
    }

    return keys;
}

function tokenMode(
    source: PrefabExtraction,
    token: Record<string, unknown>,
): Record<string, unknown> {
    if (!Array.isArray(token._modes) || token._modes.length !== 1) {
        throw new TypeError(`${source.prefabKey} requires one token mode`);
    }

    const reference = object(token._modes[0], "token mode reference");
    if (reference.m_FileID !== 0 || typeof reference.m_PathID !== "string") {
        throw new TypeError(`${source.prefabKey} requires a local token mode reference`);
    }

    const mode = source.objects.get(reference.m_PathID);
    if (mode === undefined) {
        throw new TypeError(`${source.prefabKey} token mode is missing`);
    }

    return mode;
}

function tileChanges(
    mode: Record<string, unknown>,
    options: Record<string, unknown>,
): Partial<TileState> {
    const placement = options.buildableType;
    const passability = options.passableMask;

    if (placement !== 0 && placement !== 1 && placement !== 2 && placement !== 3) {
        throw new TypeError("unsupported token mode buildable type");
    }
    if (passability !== 0 && passability !== 1 && passability !== 2 && passability !== 3) {
        throw new TypeError("unsupported token mode passable mask");
    }

    return {
        ...(boolean(mode._keepCurrentPassableMask, "token mode _keepCurrentPassableMask")
            ? {}
            : {
                  passability: ({ 0: "NONE", 1: "WALK_ONLY", 2: "FLY_ONLY", 3: "ALL" } as const)[
                      passability
                  ],
              }),
        ...(boolean(mode._keepCurrentBuildableType, "token mode _keepCurrentBuildableType")
            ? {}
            : {
                  placement: ({ 0: "NONE", 1: "MELEE", 2: "RANGED", 3: "ALL" } as const)[placement],
              }),
        ...(boolean(mode._rewriteTileHeightType, "token mode _rewriteTileHeightType")
            ? { elevation: elevation(options.heightType) }
            : {}),
        ...(boolean(mode._rewriteTileAdvancedBuildMask, "token mode _rewriteTileAdvancedBuildMask")
            ? {
                  siteCondition: parseSiteCondition(
                      options.advancedBuildMask,
                      "token mode advancedBuildMask",
                  ),
              }
            : {}),
    };
}

function elevation(value: unknown): TileState["elevation"] {
    if (value !== 0 && value !== 1) {
        throw new TypeError("unsupported token mode height type");
    }

    return value === 0 ? "LOWLAND" : "HIGHLAND";
}

export function parsePredefinedPrefab(value: unknown, skillValue?: unknown): PredefinedPrefab {
    const source = parsePrefabExtraction(value);
    const token = getPrefabComponent(source, "_rewriteTileOptions");
    if (boolean(token._rewriteTileOptions, "token _rewriteTileOptions")) {
        const mode = tokenMode(source, token);
        const options = object(mode._tileOptions, "token mode tile options");
        if (
            options.overrideObstacleLikeMoveCost !== true ||
            token._ignoreBlockAnyRoutes !== true ||
            token._motionMode !== 0 ||
            token._blockMode !== 0
        ) {
            throw new TypeError(`unsupported spatial token profile ${source.prefabKey}`);
        }

        return {
            type: "UNIT",
            prefabKey: source.prefabKey,
            side: side(token._sideType),
            filterTags: parseTags(token._filterTag),
            tileChanges: tileChanges(mode, options),
        };
    }
    if (token._disableUIHub !== true || token._withdrawable !== false || token._category !== 2) {
        throw new TypeError(`unsupported token effect profile ${source.prefabKey}`);
    }
    if (skillValue === undefined) {
        throw new TypeError(`${source.prefabKey} requires a skill prefab`);
    }

    const skill = parsePrefabExtraction(skillValue);
    const keys = buffKeys(skill);
    const mire = keys.has("buff_mire[mark]") && keys.has("buff_mire[checker]");
    const deepsea = keys.has("sea_drown[enemy]") && keys.has("buff_sea");
    if (mire === deepsea) {
        throw new TypeError(`unsupported effect profile ${source.prefabKey}`);
    }

    return {
        type: "EFFECT",
        prefabKey: source.prefabKey,
        skillPrefabKey: skill.prefabKey,
        terrain: mire ? "MIRE" : "DEEPSEA",
    };
}
