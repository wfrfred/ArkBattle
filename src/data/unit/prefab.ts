import { assertNonnegativeNumber } from "../../core/common/assert.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";
import type { SteeringParameters } from "../../core/unit/capability/locomotion/index.js";
import { parsePrefabExtraction, getPrefabComponent } from "../prefab.js";
import { secondsToTicks } from "../time.js";

export interface EnemyMovementPrefab {
    readonly prefabKey: string;
    readonly alwaysCheckCurrentPoint: boolean;
    readonly delayToBornTicks: number;
    readonly onlyDelayToBornOnTileStart: boolean;
    readonly steeringParameters: SteeringParameters;
    readonly halfBodyWidth: number;
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
    const source = parsePrefabExtraction(value);
    const enemy = getPrefabComponent(source, "_alwaysCheckCurrentPoint");
    const movement = getPrefabComponent(source, "_steeringFactor");

    return {
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
        steeringParameters: {
            steeringFactor:
                nonnegative(movement._steeringFactor, "movement _steeringFactor") /
                TICKS_PER_SECOND,
            maxSteeringForce:
                nonnegative(movement._maxSteeringForce, "movement _maxSteeringForce") /
                TICKS_PER_SECOND ** 2,
        },
        halfBodyWidth: nonnegative(movement._halfBodyWidth, "movement _halfBodyWidth"),
    };
}
