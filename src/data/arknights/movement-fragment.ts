import type { Seed } from "../../core/common/rng.js";
import type { Input } from "../../core/battle/index.js";
import type { ArknightsLevelDefinition } from "./level.js";
import { compileSpawnSchedule, type ArknightsEnemyResolver } from "./schedule.js";
import { secondsToTicks } from "./tick.js";

export interface ArknightsFragmentSelection {
    readonly waveIndex: number;
    readonly fragmentIndex: number;
    readonly actionIndices: readonly number[];
}

export interface ArknightsFragmentOptions {
    readonly rngState: Seed;
    readonly resolveEnemy: ArknightsEnemyResolver;
}

export interface ArknightsMovementFragment {
    readonly spec: Input & { readonly maxTicks: number };
    readonly selection: ArknightsFragmentSelection;
    readonly omittedActions: readonly string[];
    readonly inactiveBranches: readonly string[];
}

export function compileLevelMovementFragment(
    level: ArknightsLevelDefinition,
    selection: ArknightsFragmentSelection,
    options: ArknightsFragmentOptions,
): ArknightsMovementFragment {
    if (selection.waveIndex !== 0 || selection.fragmentIndex !== 0) {
        throw new RangeError("later wave and fragment start times require the complete schedule");
    }

    const wave = level.waves[0];
    const fragment = wave?.fragments[0];
    if (wave === undefined || fragment === undefined) {
        throw new RangeError("selected fragment does not exist");
    }
    if (wave.advancedWaveTag !== null) {
        throw new RangeError("advanced wave tags require a content rule");
    }

    for (const predefines of [level.predefines, level.hardPredefines]) {
        if (predefines.characterInsts.length !== 0 || predefines.tokenInsts.length !== 0) {
            throw new RangeError("predefined instances require a content initializer");
        }
    }

    if (
        !level.options.steeringEnabled ||
        level.options.functionDisableMask !== "NONE" ||
        (level.options.configBlackBoard?.length ?? 0) !== 0
    ) {
        throw new RangeError("unsupported level movement controls");
    }

    const selected = new Set<number>();

    for (const index of selection.actionIndices) {
        if (
            !Number.isSafeInteger(index) ||
            index < 0 ||
            index >= fragment.actions.length ||
            selected.has(index)
        ) {
            throw new RangeError("action selection requires unique existing indices");
        }

        selected.add(index);
    }
    if (selected.size === 0) {
        throw new RangeError("movement fragment must select at least one action");
    }

    const compiled = compileSpawnSchedule(
        { ...level, waves: [{ ...wave, fragments: [fragment] }], branches: {} },
        {
            actions: [...selected].map((actionIndex) => ({
                waveIndex: 0,
                fragmentIndex: 0,
                actionIndex,
            })),
            branches: [],
        },
        options.resolveEnemy,
        options.rngState,
    );
    const omittedActions: string[] = [];

    for (const [waveIndex, currentWave] of level.waves.entries()) {
        for (const [fragmentIndex, currentFragment] of currentWave.fragments.entries()) {
            for (const actionIndex of currentFragment.actions.keys()) {
                if (waveIndex !== 0 || fragmentIndex !== 0 || !selected.has(actionIndex)) {
                    omittedActions.push(
                        `waves[${waveIndex}].fragments[${fragmentIndex}].actions[${actionIndex}]`,
                    );
                }
            }
        }
    }

    return {
        spec: {
            map: level.map,
            schedule: compiled.schedule,
            predefines: [],
            initialMechanisms: [],
            maxTicks: secondsToTicks(level.options.maxPlayTime),
            routeMoveMultiplier: level.options.moveMultiplier,
            rngState: compiled.rngState,
        },
        selection: {
            ...selection,
            actionIndices: [...selected].sort((left, right) => left - right),
        },
        omittedActions,
        inactiveBranches: Object.keys(level.branches),
    };
}
