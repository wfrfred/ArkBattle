import { createBattleState, DEFAULT_PUSH_MULTIPLIER, type State } from "./state.js";
import { advance as advanceEffects } from "../unit/effect/operations.js";
import { assert, assertNonnegativeNumber } from "../common/assert.js";
import { replaceIn } from "../common/object.js";
import { create as createBattlefield } from "../battlefield/state.js";
import type { Input, Command } from "./contract.js";
import type { Definition as UnitDefinition } from "../unit/unit.js";
import type { Definitions as CapabilityDefinitions } from "../unit/capability/catalog.js";
import { prepare as prepareCombat, advance as advanceCombat } from "./steps/combat.js";
import { advance as advanceSchedule } from "./schedule/runtime.js";
import {
    advance as advanceDeployment,
    resolveDeploymentCommands,
} from "./deployment/operations.js";
import { advanceMovement } from "./steps/movement.js";
import { advance as advanceBlocking } from "./blocking/operations.js";
import { advance as advanceProjectiles } from "../projectile/operations.js";
import { advance as advanceMechanisms } from "../mechanism/mechanism.js";
import * as projectiles from "../projectile/query.js";
import { advanceElements } from "./steps/elemental.js";
import { advanceVitality } from "./steps/vitality.js";
import { advanceSkills } from "./steps/skills.js";
import { initialize as initializeSchedule } from "./schedule/state.js";
import { initializeBattlefield } from "./initialization.js";
import * as unit from "../unit/operations.js";
import * as cards from "./deployment/deck/card/index.js";
import { initialize as initializeDeployment } from "./deployment/deployment.js";

export type { Input, Command, Event } from "./contract.js";

export function initialize<
    CardStates extends readonly object[],
    MechanismStates extends readonly object[],
    UnitDefinitions extends readonly (UnitDefinition & Partial<CapabilityDefinitions>)[],
>(input: Input<CardStates, MechanismStates, UnitDefinitions>): State;
export function initialize(input: Input<readonly object[], readonly any[]>): State {
    const { pushMultiplier = DEFAULT_PUSH_MULTIPLIER } = input;
    assertNonnegativeNumber(input.routeMoveMultiplier, "routeMoveMultiplier");
    assertNonnegativeNumber(pushMultiplier, "pushMultiplier");
    assert(
        Number.isInteger(input.rngState) && input.rngState >= 0 && input.rngState < 2 ** 32,
        "battle RNG state must be an unsigned 32-bit integer",
        RangeError,
    );

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
            routeMoveMultiplier: input.routeMoveMultiplier,
            pushMultiplier,
        },
    );

    for (const card of input.deployment?.cards ?? []) {
        const initialized = cards.initialize(initial, card);
        initial = cards.add(initialized.state, initialized.value);
    }

    return initializeBattlefield(initial, input);
}

export function step(battle: State, commands: readonly Command[]): State {
    const projectileCandidates = projectiles.all(battle).map(projectiles.ref);
    let state = replaceIn(battle, ["events"], []);

    state = advanceDeployment(state);

    state = prepareCombat(state, commands);

    state = resolveDeploymentCommands(state, commands);

    state = advanceSchedule(state);

    state = unit.advance(state);

    state = advanceEffects(state);

    state = advanceVitality(state);

    state = advanceElements(state);

    state = advanceSkills(state, commands);

    state = advanceCombat(state);

    state = advanceProjectiles(state, projectileCandidates);

    state = advanceMovement(state, {
        routeMoveMultiplier: battle.definition.routeMoveMultiplier,
    });

    state = advanceMechanisms(state);

    state = advanceBlocking(state);

    return replaceIn(state, ["tick"], battle.tick + 1);
}
