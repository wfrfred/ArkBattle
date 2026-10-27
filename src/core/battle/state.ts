import type { State as BattlefieldState } from "../battlefield/state.js";
import { Mechanisms } from "./mechanisms.js";
import * as dependency from "../unit/effect/dependency.js";
import type { Definition, Event, UnitRemoval, Result as BattleResult } from "./contract.js";
import type { BattleExecutionState } from "./execution/state.js";
import type { PredefinedPresence } from "./steps/predefined.js";
import { createSpawnScheduleDefinition } from "./schedule/definition.js";
import { createSpawnScheduleExecution, type SpawnScheduleExecution } from "./schedule/state.js";
import {
    initialize as initializeDeployment,
    type State as DeploymentState,
} from "./deployment/deployment.js";

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
    maxTicks: Number.MAX_SAFE_INTEGER,
    routeMoveMultiplier: 1,
};

export interface State {
    readonly definition: Definition;
    readonly battlefield: BattlefieldState;
    readonly mechanisms: Mechanisms;
    readonly tick: number;
    readonly execution: BattleExecutionState;
    readonly deployment: DeploymentState;
    readonly effect: {
        readonly dependency: dependency.State;
    };
    readonly schedule: SpawnScheduleExecution;
    readonly predefinedPresence: readonly PredefinedPresence[];
    readonly completedRouteCount: number;
    readonly result: BattleResult | null;
    readonly events: readonly Event[];
    readonly removedUnits: readonly UnitRemoval[];
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
    schedule: SpawnScheduleExecution = createSpawnScheduleExecution(
        createSpawnScheduleDefinition({ type: "TIMELINE", spawns: [] }),
    ),
    definition: Definition = defaultDefinition,
): State {
    return {
        definition,
        battlefield,
        mechanisms: Mechanisms.empty(),
        tick,
        execution,
        deployment,
        effect: { dependency: dependency.project(battlefield.units.values()) },
        schedule,
        predefinedPresence: [],
        completedRouteCount: 0,
        result: null,
        events: [],
        removedUnits: [],
    };
}

export function appendEvents(state: State, events: readonly Event[]): State {
    return events.length === 0 ? state : { ...state, events: [...state.events, ...events] };
}
