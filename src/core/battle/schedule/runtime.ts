import { createRng } from "../../common/rng.js";
import { Vec2 } from "../../common/vector.js";
import { Tile, type WorldPosition } from "../../geometry/coordinate.js";
import { initialize as initializeUnit } from "../../unit/initialize.js";
import type { Departure, Id as UnitId } from "../../unit/unit.js";
import type { State as BattleState } from "../state.js";
import { add } from "../unit.js";
import type { Hook } from "../unit-hook.js";
import type { Spawn } from "./definition.js";
import type { ActivePhase } from "./state.js";

function spawn(battle: BattleState, entry: Spawn): BattleState {
    const id = battle.execution.nextUnitId;
    const rng = createRng(battle.execution.rngState);
    const offset: WorldPosition = [
        entry.offset[0] + (rng.next() * 2 - 1) * entry.randomRange[0],
        entry.offset[1] + (rng.next() * 2 - 1) * entry.randomRange[1],
    ];

    battle = {
        ...battle,
        execution: { ...battle.execution, nextUnitId: id + 1, rngState: rng.state() },
    };
    const created = initializeUnit(battle, {
        id,
        definition: entry.definition,
        position: Vec2.add(Tile.center(entry.plan.startPosition), offset),
        initial: { route: { plan: entry.plan, offset } },
    });
    battle = created.state;

    if (entry.wait !== "NONE") {
        const { waiting } = battle.schedule;
        battle = {
            ...battle,
            schedule: {
                ...battle.schedule,
                waiting: {
                    wave: entry.wait === "WAVE" ? [...waiting.wave, id] : waiting.wave,
                    final: [...waiting.final, id],
                },
            },
        };
    }

    return add(battle, created.value);
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

                battle = {
                    ...battle,
                    schedule: {
                        ...schedule,
                        fragmentStartTick:
                            wave.fragments.length === 0 ? schedule.fragmentStartTick : tick,
                        main:
                            wave.fragments.length === 0
                                ? { type: "WAITING", startTick: tick }
                                : { type: "FRAGMENT", fragmentIndex: 0 },
                    },
                };
                break;

            case "FRAGMENT": {
                const fragment = wave.fragments[main.fragmentIndex]!;
                const origin = schedule.fragmentStartTick + fragment.preDelayTicks;

                for (const entry of fragment.spawns) {
                    if (origin + entry.atTick === tick) {
                        battle = spawn(battle, entry);
                    }
                }

                if (fragment.spawns.some((entry) => origin + entry.atTick > tick)) {
                    return battle;
                }

                const nextIndex = main.fragmentIndex + 1;
                battle = {
                    ...battle,
                    schedule: {
                        ...battle.schedule,
                        fragmentStartTick:
                            nextIndex === wave.fragments.length
                                ? battle.schedule.fragmentStartTick
                                : tick,
                        main:
                            nextIndex === wave.fragments.length
                                ? { type: "WAITING", startTick: tick }
                                : { type: "FRAGMENT", fragmentIndex: nextIndex },
                    },
                };
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

    for (const entry of phase.spawns) {
        if (origin + entry.atTick === battle.tick) {
            battle = spawn(battle, entry);
        }
    }

    if (phase.spawns.some((entry) => origin + entry.atTick > battle.tick)) {
        return battle;
    }

    return {
        ...battle,
        schedule: {
            ...battle.schedule,
            activePhases: battle.schedule.activePhases.filter((current) => current !== phase),
        },
    };
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
    const spawns: Spawn[] = [];

    for (const entry of definition.entries) {
        if ("options" in entry) {
            const [first, ...rest] = entry.options;
            const selected = rng.weighted([
                [first!.spawns, first!.weight],
                ...rest.map(({ spawns, weight }) => [spawns, weight] as const),
            ]);

            spawns.push(...selected);
        } else {
            spawns.push(...entry);
        }
    }

    const phase: ActivePhase = { phase: definition, startTick: battle.tick, spawns };
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

export function resolveUnits(battle: BattleState, removedUnitIds: readonly UnitId[]): BattleState {
    const { waiting } = battle.schedule;
    const removed = new Set(removedUnitIds);
    const wave = waiting.wave.filter((id) => !removed.has(id));
    const final = waiting.final.filter((id) => !removed.has(id));

    return wave.length === waiting.wave.length && final.length === waiting.final.length
        ? battle
        : {
              ...battle,
              schedule: {
                  ...battle.schedule,
                  waiting: {
                      wave: wave.length === waiting.wave.length ? waiting.wave : wave,
                      final: final.length === waiting.final.length ? waiting.final : final,
                  },
              },
          };
}

export const leaveHook: Hook<Departure> = {
    id: "@schedule/resolve-unit",
    invoke: (battle, { unit }) => ({ state: resolveUnits(battle, [unit.id]), value: undefined }),
};
