import { mergeDefinedFields, selectEnemyLayers } from "../../../data/enemy-database.js";
import {
    readAttributes,
    readCombatParameters,
    readSpawnFacts,
    validateWalkingPrefab,
    type Configuration,
} from "../parameters.js";

export const enemyId = "enemy_1000_gopro";

export function resolve(raw: unknown, configuration: Configuration) {
    const { id, layers } = selectEnemyLayers(
        raw,
        configuration.level,
        configuration.overwrittenData,
    );
    if (id !== enemyId) {
        throw new TypeError(`expected enemy ${enemyId}, got ${id}`);
    }

    const fields = mergeDefinedFields(layers);
    validateWalkingPrefab(fields, enemyId);

    return {
        ...readCombatParameters(readAttributes(layers), fields),
        ...readSpawnFacts(fields),
        delayToBornTicks: 0,
    };
}

export type Parameters = ReturnType<typeof resolve>;
