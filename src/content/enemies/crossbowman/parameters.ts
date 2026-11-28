import { mergeDefinedFields, selectEnemyLayers } from "../../../data/enemy-database.js";
import {
    readAttributes,
    readCombatParameters,
    readSpawnFacts,
    validateWalkingPrefab,
    numeric,
    type Configuration,
} from "../parameters.js";

export const enemyId = "enemy_1003_ncbow";

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
        rangeRadius: numeric(fields, "rangeRadius", 0),
        ...readSpawnFacts(fields),
        delayToBornTicks: 0,
    };
}

export type Parameters = ReturnType<typeof resolve>;
