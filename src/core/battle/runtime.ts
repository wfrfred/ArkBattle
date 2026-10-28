import { createBattleState, type State } from "./state.js";
import { advance as advanceEffects } from "../unit/effect/operations.js";
import { assert, assertNonnegativeNumber, assertPositiveSafeInteger } from "../common/assert.js";
import { create as createBattlefield } from "../battlefield/state.js";
import * as units from "../unit/query.js";
import { reconcilePredefinedPresence, advancePredefined } from "./steps/predefined.js";
import type { Input, Command, Result } from "./contract.js";
import { prepare as prepareCombat, advance as advanceCombat } from "./steps/combat.js";
import { advanceSpawning } from "./steps/spawning.js";
import { resolveDeploymentCommands } from "./deployment/operations.js";
import { advanceMovement, advanceRouteCommands, resolveRouteCompletion } from "./steps/movement.js";
import { advance as advanceBlocking } from "./blocking/operations.js";
import { advanceProjectiles } from "./steps/projectiles.js";
import { advance as advanceMechanisms } from "./mechanism.js";
import * as projectiles from "../projectile/query.js";
import { advanceElements } from "./steps/elemental.js";
import { advanceSkills } from "./steps/skills.js";
import { finishBattleEvents } from "./events.js";
import { getSpawnScheduleCounts, isSpawnScheduleCompleted } from "./schedule/query.js";
import { resolveScheduleUnits } from "./schedule/runtime.js";
import { createSpawnScheduleDefinition } from "./schedule/definition.js";
import { createSpawnScheduleExecution } from "./schedule/state.js";
import { initializeBattlefield } from "./initialization.js";
import * as unit from "./unit.js";
import { addCard, advance as advanceDeployment } from "./deployment/resources.js";
import { initialize as initializeDeployment } from "./deployment/deployment.js";

export type { Input, Command, Event, Result } from "./contract.js";

export function initialize(input: Input): State {
    assertPositiveSafeInteger(input.maxTicks, "battle tick budget");
    assertNonnegativeNumber(input.routeMoveMultiplier, "routeMoveMultiplier");
    assert(
        Number.isInteger(input.rngState) && input.rngState >= 0 && input.rngState < 2 ** 32,
        "battle RNG state must be an unsigned 32-bit integer",
        RangeError,
    );

    const predefinedIds = new Set<number>();

    for (const definition of input.predefines) {
        if (predefinedIds.has(definition.id)) {
            throw new RangeError(`duplicate predefined definition: ${definition.id}`);
        }

        predefinedIds.add(definition.id);
    }

    const scheduleDefinition = createSpawnScheduleDefinition(input.schedule);

    const battlefield = createBattlefield(input.map);
    let initial = createBattleState(
        battlefield,
        {
            rngState: input.rngState,
            nextCardId: 0,
            nextUnitId: 0,
            nextMechanismId: 0,
            nextOverlayId: 0,
            nextProjectileId: 0,
        },
        0,
        initializeDeployment(input.deployment?.definition),
        createSpawnScheduleExecution(scheduleDefinition),
        {
            predefines: input.predefines,
            maxTicks: input.maxTicks,
            routeMoveMultiplier: input.routeMoveMultiplier,
        },
    );

    for (const definition of input.deployment?.cards ?? []) {
        initial = addCard(initial, definition).state;
    }

    return initializeBattlefield(initial, input);
}

export function step(battle: State, commands: readonly Command[]): State {
    if (battle.result !== null) {
        return battle;
    }

    const tick = battle.tick;
    const projectileCandidates = projectiles.all(battle).map(projectiles.ref).toArray();
    let state: State = {
        ...battle,
        events: [],
        removedUnits: [],
    };

    state = advanceDeployment(state, tick);
    state = advancePredefined(state, battle.definition.predefines, commands);

    state = prepareCombat(state, commands);

    state = resolveDeploymentCommands(state, commands);

    state = advanceSpawning(state, commands, tick);

    state = unit.advance(state);

    state = advanceEffects(state);

    state = advanceElements(state);

    state = advanceSkills(state, commands);

    state = advanceRouteCommands(state, commands);

    state = advanceCombat(state);

    state = advanceProjectiles(state, projectileCandidates, commands);

    state = advanceMovement(state, {
        routeMoveMultiplier: battle.definition.routeMoveMultiplier,
    });

    state = advanceMechanisms(state);

    state = advanceBlocking(state);

    state = resolveRouteCompletion(state);

    state = {
        ...state,
        predefinedPresence: reconcilePredefinedPresence(state),
        schedule: resolveScheduleUnits(
            state.schedule,
            state.removedUnits.map((removed) => removed.unitId),
        ),
    };
    const finishedEvents = finishBattleEvents(state.events, state.removedUnits, tick);
    const tickIndex = tick + 1;
    const completedRouteCount = state.completedRouteCount + finishedEvents.completedRouteCount;
    const completed = isSpawnScheduleCompleted(state.schedule);
    const result: Result | null =
        completed || tickIndex >= battle.definition.maxTicks
            ? {
                  reason: completed ? "SCHEDULE_COMPLETED" : "TIME_LIMIT",
                  elapsedTicks: tickIndex,
                  completedRouteCount,
                  remainingUnitIds: units
                      .all(state)
                      .map((unit) => unit.id)
                      .toArray(),
                  ...getSpawnScheduleCounts(state.schedule),
              }
            : null;

    state = {
        ...state,
        tick: tickIndex,
        completedRouteCount,
        result,
        events: finishedEvents.events,
    };

    return state;
}

export function simulateBattle(input: Input): Result {
    let battle = initialize(input);

    while (battle.result === null) {
        battle = step(battle, []);
    }

    return battle.result;
}
