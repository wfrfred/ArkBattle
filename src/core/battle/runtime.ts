import { createBattleState, type State } from "./state.js";
import { advance as advanceEffects } from "../unit/effect/operations.js";
import { assert, assertNonnegativeNumber } from "../common/assert.js";
import { create as createBattlefield } from "../battlefield/state.js";
import { reconcilePredefinedPresence } from "./steps/predefined.js";
import type { Input, Command } from "./contract.js";
import { prepare as prepareCombat, advance as advanceCombat } from "./steps/combat.js";
import { advance as advanceSchedule } from "./schedule/runtime.js";
import { resolveDeploymentCommands } from "./deployment/operations.js";
import { advanceMovement } from "./steps/movement.js";
import { advance as advanceBlocking } from "./blocking/operations.js";
import { advanceProjectiles } from "./steps/projectiles.js";
import { advance as advanceMechanisms } from "./mechanism.js";
import * as projectiles from "../projectile/query.js";
import { advanceElements } from "./steps/elemental.js";
import { advanceSkills } from "./steps/skills.js";
import { initialize as initializeSchedule } from "./schedule/state.js";
import { initializeBattlefield } from "./initialization.js";
import * as unit from "./unit.js";
import { addCard, advance as advanceDeployment } from "./deployment/resources.js";
import type { Card } from "./deployment/card/card.js";
import { initialize as initializeDeployment } from "./deployment/deployment.js";
import type { Projectile } from "../projectile/projectile.js";

export type { Input, Command, Event } from "./contract.js";

export function initialize<
    CardStates extends readonly object[],
    MechanismStates extends readonly object[],
    PredefinedTypes extends readonly object[],
>(input: Input<CardStates, MechanismStates, PredefinedTypes>): State;
export function initialize(input: Input<readonly any[], readonly any[], readonly any[]>): State {
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
        initializeSchedule(input.schedule),
        {
            predefines: input.predefines,
            routeMoveMultiplier: input.routeMoveMultiplier,
        },
    );

    for (const definition of input.deployment?.cards ?? []) {
        initial = addCard(initial, definition).state;
    }

    return initializeBattlefield(initial, input);
}

export function step(
    battle: State,
    commands: readonly Command<Card<any>, Projectile<any>>[],
): State {
    const projectileCandidates = projectiles.all(battle);
    let state: State = { ...battle, events: [] };

    state = advanceDeployment(state);

    state = prepareCombat(state, commands);

    state = resolveDeploymentCommands(state, commands);

    state = advanceSchedule(state);

    state = unit.advance(state);

    state = advanceEffects(state);

    state = advanceElements(state);

    state = advanceSkills(state, commands);

    state = advanceCombat(state);

    state = advanceProjectiles(state, projectileCandidates.map(projectiles.ref), commands);

    state = advanceMovement(state, {
        routeMoveMultiplier: battle.definition.routeMoveMultiplier,
    });

    state = advanceMechanisms(state);

    state = advanceBlocking(state);

    return {
        ...state,
        predefinedPresence: reconcilePredefinedPresence(state),
        tick: battle.tick + 1,
    };
}
