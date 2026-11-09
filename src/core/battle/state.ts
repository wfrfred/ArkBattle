import type { State as BattlefieldState } from "../battlefield/state.js";
import { Mechanisms } from "./mechanisms.js";
import * as dependency from "../lifetime/dependency.js";
import type { State as LifetimeState } from "../lifetime/lifetime.js";
import type { State as UnitHooks } from "./unit-hook.js";
import type { Definition } from "./contract.js";
import type { Event } from "./event.js";
import type { BattleExecutionState } from "./execution/state.js";
import type { PredefinedPresence } from "./steps/predefined.js";
import { initialize as initializeSchedule, type State as ScheduleState } from "./schedule/state.js";
import { leaveHook as scheduleLeaveHook } from "./schedule/runtime.js";
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
    readonly unitHooks: UnitHooks;
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
        unitHooks: { leave: [scheduleLeaveHook] },
        schedule,
        predefinedPresence: [],
        events: [],
    };
}

export function appendEvents(state: State, events: readonly Event[]): State {
    return events.length === 0 ? state : { ...state, events: [...state.events, ...events] };
}
