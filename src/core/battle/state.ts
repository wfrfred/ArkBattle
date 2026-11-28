import type { State as BattlefieldState } from "../battlefield/state.js";
import type { Effect, Id as EffectId } from "../effect/effect.js";
import { Store } from "../common/collection/store.js";
import type { Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import {
    initialize as initializeLifetime,
    type State as LifetimeState,
} from "../lifetime/lifetime.js";
import { Hooks } from "../hook.js";
import { removed as unitRemoved } from "./unit-hook.js";
import type { Definition } from "./contract.js";
import type { Event } from "./event.js";
import type { Id as ProjectileId } from "../projectile/projectile.js";
import type { Seed } from "../common/rng.js";
import type { Id as UnitId } from "../unit/unit.js";
import { initialize as initializeSchedule, type State as ScheduleState } from "./schedule/state.js";
import { removedHook as scheduleRemovedHook } from "./schedule/operations.js";
import {
    initialize as initializeStatistics,
    removedHook as statisticsRemovedHook,
    type State as StatisticsState,
} from "./statistics.js";
import {
    initialize as initializeDeployment,
    type State as DeploymentState,
} from "./deployment/deployment.js";

export interface BattleExecutionState {
    readonly rngState: Seed;
    readonly nextProjectileId: ProjectileId;
    readonly nextEffectId: EffectId;
    readonly nextUnitId: UnitId;
}

const defaultExecution: BattleExecutionState = {
    rngState: 0,
    nextUnitId: 0,
    nextProjectileId: 0,
    nextEffectId: 0,
};

export const DEFAULT_PUSH_MULTIPLIER = 0.5;

const defaultDefinition: Definition = {
    moveMultiplier: 1,
    pushMultiplier: DEFAULT_PUSH_MULTIPLIER,
};

export interface State {
    readonly definition: Definition;
    readonly battlefield: BattlefieldState;
    readonly effects: Store<Ref<Effect>, Effect>;
    readonly tick: number;
    readonly execution: BattleExecutionState;
    readonly deployment: DeploymentState;
    readonly lifetime: LifetimeState;
    readonly unitHooks: Hooks;
    readonly schedule: ScheduleState;
    readonly statistics: StatisticsState;
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
    deployment: DeploymentState = initializeDeployment(null),
    schedule: ScheduleState = initializeSchedule({ waves: [], branches: {} }),
    definition: Definition = defaultDefinition,
    statistics: StatisticsState = initializeStatistics(0),
): State {
    return {
        definition,
        battlefield,
        effects: Store.empty<Ref<Effect>, Effect>(),
        tick,
        execution,
        deployment,
        lifetime: initializeLifetime(),
        unitHooks: Hooks.empty()
            .set(unitRemoved, scheduleRemovedHook)
            .set(unitRemoved, statisticsRemovedHook),
        schedule,
        statistics,
        events: [],
    };
}

export function appendEvents(state: State, events: readonly Event[]): State {
    return events.length === 0 ? state : replaceIn(state, ["events"], [...state.events, ...events]);
}
