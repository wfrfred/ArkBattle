import { assertNonnegativeNumber } from "../../core/common/assert.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";
import type {
    Placement,
    SiteCondition,
    State as TileState,
} from "../../core/battlefield/map/tile.js";
import { parseSiteCondition, parseAllowedSiteConditions } from "./site-condition.js";
import {
    createSteeringParameters,
    type SteeringParameters,
} from "../../core/unit/capability/locomotion/index.js";
import { secondsToTicks } from "./tick.js";

export interface EnemyMovementPrefab {
    readonly prefabKey: string;
    readonly alwaysCheckCurrentPoint: boolean;
    readonly delayToBornTicks: number;
    readonly onlyDelayToBornOnTileStart: boolean;
    readonly steeringParameters: SteeringParameters;
    readonly halfBodyWidth: number;
}

export interface TileDeploymentPrefab {
    readonly prefabKey: string;
    readonly siteCondition: SiteCondition | null;
}

export type PredefinedPrefab =
    | {
          readonly type: "UNIT";
          readonly prefabKey: string;
          readonly tileChanges: Partial<TileState>;
          readonly deployable: {
              readonly placement: Exclude<Placement, "NONE">;
              readonly allowedSiteConditions: readonly SiteCondition[];
          };
      }
    | {
          readonly type: "MECHANISM";
          readonly prefabKey: string;
          readonly skillPrefabKey: string;
          readonly terrain: "MIRE" | "DEEPSEA";
      };

interface PrefabExtraction {
    readonly prefabKey: string;
    readonly components: readonly Record<string, unknown>[];
    readonly objects: ReadonlyMap<string, Record<string, unknown>>;
}

function object(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

function extraction(value: unknown): PrefabExtraction {
    const source = object(value, "prefab extraction");
    if (typeof source.prefabKey !== "string" || source.prefabKey.length === 0) {
        throw new TypeError("prefab extraction prefabKey must be nonempty");
    }
    if (!Array.isArray(source.components)) {
        throw new TypeError("prefab components must be an array");
    }

    const components: Record<string, unknown>[] = [];
    const objects = new Map<string, Record<string, unknown>>();

    for (let index = 0; index < source.components.length; index++) {
        if (!Object.hasOwn(source.components, index)) {
            throw new TypeError("prefab components must be dense");
        }

        const component = object(source.components[index], `prefab component ${index}`);
        const fields = object(component.fields, `prefab component ${index} fields`);
        components.push(fields);

        if (component.object !== undefined) {
            const record = object(component.object, `prefab component ${index} object`);
            if (typeof record.id !== "string" || record.id.length === 0 || objects.has(record.id)) {
                throw new TypeError(`invalid prefab component object id at index ${index}`);
            }

            objects.set(record.id, fields);
        }
    }

    return { prefabKey: source.prefabKey, components, objects };
}

function component(source: PrefabExtraction, field: string): Record<string, unknown> {
    const matches = source.components.filter((value) => Object.hasOwn(value, field));
    if (matches.length !== 1) {
        throw new TypeError(`${source.prefabKey} requires one component with ${field}`);
    }

    return matches[0]!;
}

function boolean(value: unknown, name: string): boolean {
    if (typeof value !== "boolean") {
        throw new TypeError(`${name} must be boolean`);
    }

    return value;
}

function nonnegative(value: unknown, name: string): number {
    assertNonnegativeNumber(value, name);

    return value;
}

export function parseEnemyMovementPrefab(value: unknown): EnemyMovementPrefab {
    const source = extraction(value);
    const enemy = component(source, "_alwaysCheckCurrentPoint");
    const movement = component(source, "_steeringFactor");

    return Object.freeze({
        prefabKey: source.prefabKey,
        alwaysCheckCurrentPoint: boolean(
            enemy._alwaysCheckCurrentPoint,
            "enemy _alwaysCheckCurrentPoint",
        ),
        delayToBornTicks: secondsToTicks(nonnegative(enemy._delayToBorn, "enemy _delayToBorn")),
        onlyDelayToBornOnTileStart: boolean(
            enemy._onlyDelayToBornOnTileStart,
            "enemy _onlyDelayToBornOnTileStart",
        ),
        steeringParameters: createSteeringParameters({
            steeringFactor:
                nonnegative(movement._steeringFactor, "movement _steeringFactor") /
                TICKS_PER_SECOND,
            maxSteeringForce:
                nonnegative(movement._maxSteeringForce, "movement _maxSteeringForce") /
                TICKS_PER_SECOND ** 2,
        }),
        halfBodyWidth: nonnegative(movement._halfBodyWidth, "movement _halfBodyWidth"),
    });
}

export function parseTileDeploymentPrefab(value: unknown): TileDeploymentPrefab {
    const source = extraction(value);
    const tile = component(source, "_tileKey");
    const siteCondition = parseSiteCondition(
        tile._advancedBuildableMask,
        "tile _advancedBuildableMask",
    );

    if (tile._tileKey !== source.prefabKey) {
        throw new TypeError(`unsupported tile deployment profile ${source.prefabKey}`);
    }

    return Object.freeze({ prefabKey: source.prefabKey, siteCondition });
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

    return Object.freeze({
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
    });
}

function elevation(value: unknown): TileState["elevation"] {
    if (value !== 0 && value !== 1) {
        throw new TypeError("unsupported token mode height type");
    }

    return value === 0 ? "LOWLAND" : "HIGHLAND";
}

function deployable(
    token: Record<string, unknown>,
): Extract<PredefinedPrefab, { readonly type: "UNIT" }>["deployable"] {
    const condition = object(token._buildCondition, "token build condition");
    const extra = object(condition.extraBuildConditionArray, "token extra build condition");
    const buildableType = condition.buildableType;
    if (buildableType !== 1 && buildableType !== 2 && buildableType !== 3) {
        throw new TypeError("unsupported token deployment buildable type");
    }

    boolean(condition.needSpecifyDirection, "token deployment needSpecifyDirection");

    for (const key of [
        "isTryingOverlapCharacater",
        "limitByHostAttackRange",
        "limitByHostAbilityRange",
        "canNotBuildInHostAttackRange",
        "excludeNoTargetTile",
        "checkManuallyBuildableType",
        "_excludeOccupiedByWalkEnemy",
        "allowWalkEnemyInHostRange",
        "_checkUpdateBuildable",
    ]) {
        if (condition[key] !== false) {
            throw new TypeError(`unsupported token deployment condition ${key}`);
        }
    }
    if (
        condition.abilityName !== "" ||
        condition.tileKey !== "" ||
        condition.extraLocateRange !== "" ||
        condition.manuallyBuildableType !== 0 ||
        typeof extra.SerializedState !== "string" ||
        !Array.isArray(extra.SerializedObjectReferences) ||
        extra.SerializedObjectReferences.length !== 0
    ) {
        throw new TypeError("unsupported token extra deployment condition");
    }

    const serialized: unknown = JSON.parse(extra.SerializedState);
    if (serialized !== null && (!Array.isArray(serialized) || serialized.length !== 0)) {
        throw new TypeError("unsupported token serialized deployment condition");
    }

    return Object.freeze({
        placement: ({ 1: "MELEE", 2: "RANGED", 3: "ALL" } as const)[buildableType],
        allowedSiteConditions: parseAllowedSiteConditions(
            condition.advancedBuildableMask,
            "token deployment advancedBuildableMask",
        ),
    });
}

export function parsePredefinedPrefab(value: unknown, skillValue?: unknown): PredefinedPrefab {
    const source = extraction(value);
    const token = component(source, "_rewriteTileOptions");
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

        return Object.freeze({
            type: "UNIT",
            prefabKey: source.prefabKey,
            tileChanges: tileChanges(mode, options),
            deployable: deployable(token),
        });
    }
    if (token._disableUIHub !== true || token._withdrawable !== false || token._category !== 2) {
        throw new TypeError(`unsupported token mechanism profile ${source.prefabKey}`);
    }
    if (skillValue === undefined) {
        throw new TypeError(`${source.prefabKey} requires a skill prefab`);
    }

    const skill = extraction(skillValue);
    const keys = buffKeys(skill);
    const mire = keys.has("buff_mire[mark]") && keys.has("buff_mire[checker]");
    const deepsea = keys.has("sea_drown[enemy]") && keys.has("buff_sea");
    if (mire === deepsea) {
        throw new TypeError(`unsupported mechanism profile ${source.prefabKey}`);
    }

    return Object.freeze({
        type: "MECHANISM",
        prefabKey: source.prefabKey,
        skillPrefabKey: skill.prefabKey,
        terrain: mire ? "MIRE" : "DEEPSEA",
    });
}
