import type { State as BattlefieldState } from "../battlefield/state.js";
import { Mechanisms } from "../mechanism/mechanisms.js";
import * as dependency from "../lifetime/dependency.js";
import type { State as LifetimeState } from "../lifetime/lifetime.js";
import { Hooks } from "../hook.js";
import { leave as unitLeave } from "./unit-hook.js";
import type { Definition } from "./contract.js";
import type { Event } from "./event.js";
import type { Id as ProjectileId } from "../projectile/projectile.js";
import type { Seed } from "../common/rng.js";
import type { Id as UnitId } from "../unit/unit.js";
import type { MechanismId } from "../mechanism/index.js";
import type { Id as OverlayId } from "../battlefield/navigation/overlay.js";
import type { PredefinedPresence } from "./predefined.js";
import { initialize as initializeSchedule, type State as ScheduleState } from "./schedule/state.js";
import { leaveHook as scheduleLeaveHook } from "./schedule/runtime.js";
import {
    initialize as initializeDeployment,
    type State as DeploymentState,
} from "./deployment/deployment.js";

export interface BattleExecutionState {
    readonly rngState: Seed;
    readonly nextCardId: number;
    readonly nextProjectileId: ProjectileId;
    readonly nextUnitId: UnitId;
    readonly nextMechanismId: MechanismId;
    readonly nextOverlayId: OverlayId;
}

const defaultExecution: BattleExecutionState = {
    rngState: 0,
    nextCardId: 0,
    nextUnitId: 0,
    nextMechanismId: 0,
    nextOverlayId: 0,
    nextProjectileId: 0,
};

const defaultDefinition: Definition = {
    predefines: [],
    routeMoveMultiplier: 1,
};

export interface State {
    readonly definition: Definition;
    readonly battlefield: BattlefieldState;
    readonly mechanisms: Mechanisms;
    readonly tick: number;
    readonly execution: BattleExecutionState;
    readonly deployment: DeploymentState;
    readonly lifetime: LifetimeState;
    readonly unitHooks: Hooks;
    readonly schedule: ScheduleState;
    readonly predefinedPresence: readonly PredefinedPresence[];
    readonly events: readonly Event[];
}

export interface Result<A> {
    readonly state: State;
    readonly value: A;
}

export function createBattleState(
    battlefield: BattlefieldState,
    execution: BattleExecutionState = defaultExecution,
    tick = 0,
    deployment: DeploymentState = initializeDeployment(),
    schedule: ScheduleState = initializeSchedule({ waves: [], branches: {} }),
    definition: Definition = defaultDefinition,
): State {
    return {
        definition,
        battlefield,
        mechanisms: Mechanisms.empty(),
        tick,
        execution,
        deployment,
        lifetime: {
            dependencies: dependency.empty(),
            endings: new Map(),
            settling: false,
        },
        unitHooks: Hooks.empty().set(unitLeave, scheduleLeaveHook),
        schedule,
        predefinedPresence: [],
        events: [],
    };
}

export function appendEvents(state: State, events: readonly Event[]): State {
    return events.length === 0 ? state : { ...state, events: [...state.events, ...events] };
}
