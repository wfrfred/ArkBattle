import { addScheduleTicks, countFragmentSpawns } from "./definition.js";
import type { SpawnScheduleExecution, SpawnScheduleState } from "./state.js";

export function isSpawnScheduleCompleted(state: SpawnScheduleExecution): boolean {
    if (state.pendingSpawnCount !== 0 || state.managedFinalUnitIds.length !== 0) {
        return false;
    }
    if (state.type === "TIMELINE") {
        return state.cursor === state.definition.spawns.length;
    }

    return state.main.phase === "COMPLETED" && state.activeBranches.length === 0;
}

export function getSpawnedCount(state: SpawnScheduleState): number {
    return state.spawnedCount;
}

export function getSpawnScheduleCounts(state: SpawnScheduleExecution): {
    readonly spawnedCount: number;
    readonly unspawnedCount: number;
} {
    return {
        spawnedCount: getSpawnedCount(state),
        unspawnedCount: getUnspawnedCount(state),
    };
}

export function getUnspawnedCount(state: SpawnScheduleExecution): number {
    if (state.type === "TIMELINE") {
        return addScheduleTicks(
            state.definition.spawns.length - state.cursor,
            state.pendingSpawnCount,
        );
    }

    const { waves } = state.definition;
    let count = state.pendingSpawnCount;

    for (const queue of state.activeBranches) {
        count = addScheduleTicks(count, queue.spawns.length - queue.cursor);
    }

    for (let waveIndex = state.waveIndex; waveIndex < waves.length; waveIndex++) {
        const wave = waves[waveIndex]!;

        if (
            waveIndex !== state.waveIndex ||
            state.main.phase === "NOT_STARTED" ||
            state.main.phase === "PRE_DELAY"
        ) {
            for (const fragment of wave.fragments) {
                count = addScheduleTicks(count, countFragmentSpawns(fragment));
            }
        } else if (state.main.phase === "FRAGMENTS") {
            const { fragmentIndex, queue } = state.main;
            if (queue !== null) {
                count = addScheduleTicks(count, queue.spawns.length - queue.cursor);
            }
            for (
                let index = fragmentIndex + (queue === null ? 0 : 1);
                index < wave.fragments.length;
                index++
            ) {
                count = addScheduleTicks(count, countFragmentSpawns(wave.fragments[index]!));
            }
        }
    }

    return count;
}
