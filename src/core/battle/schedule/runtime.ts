import { createRng } from "../../common/rng.js";
import { replaceIn } from "../../common/object.js";
import { Vec2 } from "../../common/vector.js";
import { ref, type Ref } from "../../common/ref.js";
import { Tile, type WorldPosition } from "../../geometry/coordinate.js";
import type { RemovedHook } from "../../unit/hook.js";
import { initialize as initializeUnit } from "../../unit/initialize.js";
import type { Unit } from "../../unit/unit.js";
import type { Result, State as BattleState } from "../state.js";
import { add } from "../../unit/operations.js";
import type { Entry, Spawn, Wave } from "./definition.js";
import type { ActivePhase } from "./state.js";

function spawn(battle: BattleState, entry: Spawn): BattleState {
    const rng = createRng(battle.execution.rngState);
    const offset: WorldPosition = [
        entry.offset[0] + (rng.next() * 2 - 1) * entry.randomRange[0],
        entry.offset[1] + (rng.next() * 2 - 1) * entry.randomRange[1],
    ];

    battle = replaceIn(battle, ["execution", "rngState"], rng.state());
    const created = initializeUnit(battle, {
        definition: entry.definition,
        position: Vec2.add(Tile.center(entry.plan.startPosition), offset),
        initial: {
            route: { plan: entry.plan, offset },
            facing: { direction: "RIGHT" },
        },
    });
    battle = created.state;

    if (entry.wait !== "NONE") {
        const reference = ref(created.value);
        const { waiting } = battle.schedule;
        battle = replaceIn(battle, ["schedule", "waiting"], {
            wave: entry.wait === "WAVE" ? [...waiting.wave, reference] : waiting.wave,
            final: [...waiting.final, reference],
        });
    }

    return add(battle, created.value);
}

function advanceEntries(
    battle: BattleState,
    entries: readonly Entry[],
    nextEntry: number,
    origin: number,
): Result<number> {
    for (; nextEntry < entries.length; nextEntry++) {
        const entry = entries[nextEntry]!;
        if (origin + entry.atTick > battle.tick) {
            break;
        }

        if ("execute" in entry) {
            const { state, value: completed } = entry.execute(battle);
            battle = state;

            if (!completed) {
                break;
            }
        } else {
            battle = spawn(battle, entry);
        }
    }

    return { state: battle, value: nextEntry };
}

function enterFragment(battle: BattleState, wave: Wave, fragmentIndex: number): BattleState {
    const { schedule, tick } = battle;
    const fragment = wave.fragments[fragmentIndex];
    if (fragment === undefined) {
        return replaceIn(battle, ["schedule", "main"], { type: "WAITING", startTick: tick });
    }

    return {
        ...battle,
        schedule: {
            ...schedule,
            fragmentStartTick: tick,
            main: {
                type: "FRAGMENT",
                fragmentIndex,
                entries: [...fragment.entries].sort(
                    (first, second) => first.atTick - second.atTick,
                ),
                nextEntry: 0,
            },
        },
    };
}

function advanceMain(battle: BattleState): BattleState {
    while (true) {
        const { schedule, tick } = battle;
        const { main } = schedule;

        if (main.type === "COMPLETED") {
            return battle;
        }

        const wave = schedule.definition.waves[schedule.waveIndex]!;

        switch (main.type) {
            case "PRE_DELAY":
                if (tick < schedule.waveStartTick + wave.preDelayTicks) {
                    return battle;
                }

                battle = enterFragment(battle, wave, 0);
                break;

            case "FRAGMENT": {
                const fragment = wave.fragments[main.fragmentIndex]!;
                const origin = schedule.fragmentStartTick + fragment.preDelayTicks;

                const { state, value } = advanceEntries(
                    battle,
                    main.entries,
                    main.nextEntry,
                    origin,
                );
                if (value < main.entries.length) {
                    return value === main.nextEntry
                        ? state
                        : replaceIn(state, ["schedule", "main"], { ...main, nextEntry: value });
                }

                battle = enterFragment(state, wave, main.fragmentIndex + 1);
                break;
            }

            case "WAITING": {
                const timedOut =
                    wave.maxWaitingTicks !== null && tick >= main.startTick + wave.maxWaitingTicks;

                if (schedule.waiting.wave.length > 0 && !timedOut) {
                    return battle;
                }

                battle = {
                    ...battle,
                    schedule: {
                        ...schedule,
                        waiting:
                            schedule.waiting.wave.length === 0
                                ? schedule.waiting
                                : { ...schedule.waiting, wave: [] },
                        main: { type: "POST_DELAY", startTick: tick },
                    },
                };
                break;
            }

            case "POST_DELAY":
                if (tick < main.startTick + wave.postDelayTicks) {
                    return battle;
                }

                battle = {
                    ...battle,
                    schedule:
                        schedule.waveIndex + 1 === schedule.definition.waves.length
                            ? { ...schedule, main: { type: "COMPLETED" } }
                            : {
                                  ...schedule,
                                  waveIndex: schedule.waveIndex + 1,
                                  waveStartTick: tick,
                                  waiting: { ...schedule.waiting, wave: [] },
                                  main: { type: "PRE_DELAY" },
                              },
                };
                break;
        }
    }
}

function advancePhase(battle: BattleState, phase: ActivePhase): BattleState {
    const origin = phase.startTick + phase.phase.preDelayTicks;
    const { state, value } = advanceEntries(battle, phase.entries, phase.nextEntry, origin);

    if (value === phase.nextEntry && value < phase.entries.length) {
        return state;
    }

    const { activePhases } = state.schedule;

    const nextPhases =
        value === phase.entries.length
            ? activePhases.filter((current) => current !== phase)
            : activePhases.map((current) =>
                  current === phase ? { ...phase, nextEntry: value } : current,
              );

    return replaceIn(state, ["schedule", "activePhases"], nextPhases);
}

export function advance(battle: BattleState): BattleState {
    const phases = battle.schedule.activePhases;
    battle = advanceMain(battle);

    for (const phase of phases) {
        if (phase.startTick < battle.tick) {
            battle = advancePhase(battle, phase);
        }
    }

    return battle;
}

export function triggerBranch(battle: BattleState, id: string, loop: boolean): BattleState {
    const { schedule } = battle;
    const branch = schedule.definition.branches[id];

    if (branch === undefined) {
        throw new RangeError(`unknown schedule branch: ${id}`);
    }

    const nextIndex = schedule.nextPhaseIndices[id]!;
    const index = loop && nextIndex === branch.phases.length ? 0 : nextIndex;
    const definition = branch.phases[index];

    if (definition === undefined) {
        return battle;
    }

    const rng = createRng(battle.execution.rngState);
    const entries: Entry[] = [];

    for (const entry of definition.entries) {
        if ("options" in entry) {
            const [first, ...rest] = entry.options;
            const selected = rng.weighted([
                [first!.entries, first!.weight],
                ...rest.map(({ entries, weight }) => [entries, weight] as const),
            ]);

            entries.push(...selected);
        } else {
            entries.push(entry);
        }
    }

    entries.sort((first, second) => first.atTick - second.atTick);
    const phase: ActivePhase = { phase: definition, startTick: battle.tick, entries, nextEntry: 0 };
    battle = {
        ...battle,
        execution: { ...battle.execution, rngState: rng.state() },
        schedule: {
            ...schedule,
            nextPhaseIndices: { ...schedule.nextPhaseIndices, [id]: index + 1 },
            activePhases: [...schedule.activePhases, phase],
        },
    };

    return advancePhase(battle, phase);
}

export function releaseFromWave(battle: BattleState, reference: Ref<Unit>): BattleState {
    const { waiting } = battle.schedule;
    const wave = waiting.wave.filter((entry) => entry !== reference);

    return wave.length === waiting.wave.length
        ? battle
        : replaceIn(battle, ["schedule", "waiting", "wave"], wave);
}

export function resolveUnits(battle: BattleState, removedUnits: readonly Ref<Unit>[]): BattleState {
    const { waiting } = battle.schedule;
    const removed = new Set(removedUnits);
    const wave = waiting.wave.filter((entry) => !removed.has(entry));
    const final = waiting.final.filter((entry) => !removed.has(entry));

    return wave.length === waiting.wave.length && final.length === waiting.final.length
        ? battle
        : replaceIn(battle, ["schedule", "waiting"], {
              wave: wave.length === waiting.wave.length ? waiting.wave : wave,
              final: final.length === waiting.final.length ? waiting.final : final,
          });
}

export const removedHook: RemovedHook = {
    id: "@schedule/resolve-unit",
    invoke: (battle, { unit }) => ({ state: resolveUnits(battle, [ref(unit)]), value: undefined }),
};
