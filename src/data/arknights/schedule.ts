import { assertNonnegativeSafeInteger } from "../../core/common/assert.js";
import { createRng, type Rng, type Seed } from "../../core/common/rng.js";
import type { Branch, Definition, Entry, Spawn, Wait } from "../../core/battle/schedule/index.js";
import type { ArknightsEnemyMovementContent } from "./enemy.js";
import type {
    ArknightsEnemyDbRef,
    ArknightsLevelDefinition,
    ArknightsSpawnAction,
} from "./level.js";
import type { Route } from "./route.js";
import { secondsToTicks } from "./tick.js";

export interface ArknightsActionSelection {
    readonly waveIndex: number;
    readonly fragmentIndex: number;
    readonly actionIndex: number;
}

export interface ArknightsScheduleSelection {
    readonly actions: readonly ArknightsActionSelection[];
    readonly branches: readonly string[];
}

export type ArknightsEnemyResolver = (
    reference: ArknightsEnemyDbRef,
) => ArknightsEnemyMovementContent;

export interface ArknightsScheduleCompilation {
    readonly schedule: Definition;
    readonly rngState: Seed;
    readonly omittedActions: readonly string[];
    readonly inactiveBranches: readonly string[];
}

function actionPath(selection: ArknightsActionSelection): string {
    return `waves[${selection.waveIndex}].fragments[${selection.fragmentIndex}].actions[${selection.actionIndex}]`;
}

function validateAction(action: ArknightsSpawnAction): void {
    if (
        action.hiddenGroup !== null ||
        action.randomSpawnGroupPackKey !== null ||
        action.randomType !== "ALWAYS" ||
        action.refreshType !== "ALWAYS" ||
        action.isUnharmfulAndAlwaysCountAsKilled
    ) {
        throw new RangeError(
            "movement schedules do not support hidden groups, random packs, non-ALWAYS random policies or special kill accounting",
        );
    }
    if (action.randomSpawnGroupKey === null && action.weight !== 0) {
        throw new RangeError("weighted movement spawns require a random group");
    }
}

function resolveActionSpawn(
    level: ArknightsLevelDefinition,
    action: ArknightsSpawnAction,
    route: Route,
    resolveEnemy: ArknightsEnemyResolver,
): Omit<Spawn, "atTick" | "wait"> {
    const reference = level.enemyDbRefs.find((reference) => reference.id === action.key);
    if (reference === undefined) {
        throw new RangeError(`spawn references missing enemy ${action.key}`);
    }

    const content = resolveEnemy(reference);
    if (content.delayToBornTicks !== 0) {
        throw new RangeError("movement schedules require synchronous enemy births");
    }

    return {
        definition: content.definition,
        plan: route.plan,
        offset: route.spawnOffset,
        randomRange: route.spawnRandomRange,
    };
}

function wait(action: ArknightsSpawnAction, fromBranch: boolean): Wait {
    if (!action.managedByScheduler) {
        return "NONE";
    }
    if (action.dontBlockWave || (fromBranch && !action.forceBlockWaveInBranch)) {
        return "FINAL";
    }

    return "WAVE";
}

function compileAction(
    level: ArknightsLevelDefinition,
    action: ArknightsSpawnAction,
    preDelay: number,
    fromBranch: boolean,
    resolveEnemy: ArknightsEnemyResolver,
): readonly Spawn[] {
    const route = (fromBranch ? level.extraRoutes : level.routes)[action.routeIndex];
    if (route === undefined) {
        throw new RangeError(`spawn references missing route ${action.routeIndex}`);
    }

    const spawn = resolveActionSpawn(level, action, route, resolveEnemy);
    const preDelayTicks = secondsToTicks(preDelay);

    return Array.from({ length: action.count }, (_, index) => ({
        ...spawn,
        atTick:
            secondsToTicks(preDelay + action.preDelay + index * action.interval) - preDelayTicks,
        wait: wait(action, fromBranch),
    }));
}

function compileEntries(
    level: ArknightsLevelDefinition,
    actions: readonly ArknightsSpawnAction[],
    preDelay: number,
    fromBranch: boolean,
    resolveEnemy: ArknightsEnemyResolver,
): readonly Entry[] {
    const entries: Entry[] = [];
    const groups = new Map<string, { weight: number; spawns: readonly Spawn[] }[]>();
    let previousGroup: string | null = null;

    for (const action of actions) {
        validateAction(action);
        const group = action.randomSpawnGroupKey;
        if (group !== null && group !== previousGroup && groups.has(group)) {
            throw new RangeError("branch random spawn group candidates must be contiguous");
        }

        previousGroup = group;
        const spawns = compileAction(level, action, preDelay, fromBranch, resolveEnemy);
        if (group === null) {
            entries.push(spawns);
            continue;
        }

        let options = groups.get(group);
        if (options === undefined) {
            options = [];
            groups.set(group, options);
            entries.push({ options });
        }

        options.push({ weight: action.weight, spawns });
    }

    for (const options of groups.values()) {
        if (!options.some((option) => option.weight > 0)) {
            throw new RangeError("random spawn groups require a positive total weight");
        }
    }

    return entries;
}

function selectActions(
    actions: readonly ArknightsSpawnAction[],
    rng: Rng,
): readonly ArknightsSpawnAction[] {
    const groups = new Map<string, ArknightsSpawnAction[]>();

    for (const action of actions) {
        validateAction(action);

        if (action.randomSpawnGroupKey !== null) {
            const group = groups.get(action.randomSpawnGroupKey) ?? [];
            group.push(action);
            groups.set(action.randomSpawnGroupKey, group);
        }
    }

    const selected = new Set<ArknightsSpawnAction>();

    for (const group of groups.values()) {
        const [first, ...rest] = group;
        selected.add(
            rng.weighted([
                [first!, first!.weight],
                ...rest.map((action) => [action, action.weight] as const),
            ]),
        );
    }

    return actions.filter((action) => action.randomSpawnGroupKey === null || selected.has(action));
}

export function compileSpawnSchedule(
    level: ArknightsLevelDefinition,
    selection: ArknightsScheduleSelection,
    resolveEnemy: ArknightsEnemyResolver,
    rngState: Seed = 0,
): ArknightsScheduleCompilation {
    const selected = new Set<string>();

    for (const item of selection.actions) {
        for (const index of [item.waveIndex, item.fragmentIndex, item.actionIndex]) {
            assertNonnegativeSafeInteger(index, "action selection indices");
        }

        const path = actionPath(item);
        const missingOrDuplicate =
            selected.has(path) ||
            level.waves[item.waveIndex]?.fragments[item.fragmentIndex]?.actions[
                item.actionIndex
            ] === undefined;
        if (missingOrDuplicate) {
            throw new RangeError(`action selection requires unique existing actions: ${path}`);
        }

        selected.add(path);
    }

    const selectedBranches = new Set<string>();

    for (const id of selection.branches) {
        if (selectedBranches.has(id) || !Object.hasOwn(level.branches, id)) {
            throw new RangeError(`branch selection requires a unique existing branch: ${id}`);
        }

        selectedBranches.add(id);
    }

    const rng = createRng(rngState);
    const omittedActions: string[] = [];
    const waves = level.waves.map((wave, waveIndex) => {
        if (wave.advancedWaveTag !== null) {
            throw new RangeError("advanced wave triggers require a content rule");
        }

        return {
            preDelayTicks: secondsToTicks(wave.preDelay),
            postDelayTicks: secondsToTicks(wave.postDelay),
            maxWaitingTicks:
                wave.maxTimeWaitingForNextWave === -1
                    ? null
                    : secondsToTicks(wave.maxTimeWaitingForNextWave),
            fragments: wave.fragments.map((fragment, fragmentIndex) => {
                const actions = fragment.actions.filter((_, actionIndex) => {
                    const path = actionPath({ waveIndex, fragmentIndex, actionIndex });
                    if (selected.has(path)) {
                        return true;
                    }

                    omittedActions.push(path);

                    return false;
                });

                return {
                    preDelayTicks: secondsToTicks(fragment.preDelay),
                    spawns: selectActions(actions, rng).flatMap((action) =>
                        compileAction(level, action, fragment.preDelay, false, resolveEnemy),
                    ),
                };
            }),
        };
    });

    const branches: [string, Branch][] = [...selectedBranches].map((id) => [
        id,
        {
            phases: level.branches[id]!.phases.map((phase) => ({
                preDelayTicks: secondsToTicks(phase.preDelay),
                entries: compileEntries(level, phase.actions, phase.preDelay, true, resolveEnemy),
            })),
        },
    ]);

    return {
        schedule: { waves, branches: Object.fromEntries(branches) },
        rngState: rng.state(),
        omittedActions,
        inactiveBranches: Object.keys(level.branches).filter((id) => !selectedBranches.has(id)),
    };
}
