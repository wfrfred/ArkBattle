import type { Seed } from "../common/rng.js";
import type { Map } from "../battlefield/map/map.js";
import type { UnitPlacementDefinition } from "./creation/placement.js";
import type { MechanismPlacementDefinition } from "./creation/mechanism.js";
import type { SpawnScheduleDefinition } from "./schedule/definition.js";
import type { CombatEvent } from "./execution/event.js";
import type { WorldPosition } from "../geometry/coordinate.js";
import type { Signal as RouteSignal } from "../unit/capability/route/operations.js";
import type { Unit, Id, LeaveReason } from "../unit/unit.js";
import type { Input as DeploymentInput } from "./deployment/deployment.js";
import type { PredefinedDefinition, PredefinedCommand } from "./steps/predefined.js";
import type { AlternativeRouteCommand } from "./steps/movement.js";
import type {
    DeploymentCommand,
    Rejection as DeploymentRejection,
} from "./deployment/operations.js";
import type { Ref } from "../common/ref.js";
import type { Signal as ActionSignal } from "../unit/action/event.js";
import type { Execution } from "../unit/action/execution.js";
import type { Id as ProjectileId } from "../projectile/projectile.js";
import type { Signal as ProjectileSignal } from "../projectile/event.js";
import type { Signal as ElementalSignal } from "../unit/capability/elemental/operations.js";
import type { Signal as SkillSignal } from "../unit/skill/operations.js";

export interface Definition {
    readonly predefines: readonly PredefinedDefinition[];
    readonly maxTicks: number;
    readonly routeMoveMultiplier: number;
}

export interface Input extends Definition {
    readonly deployment?: DeploymentInput;
    readonly map: Map;
    readonly schedule: SpawnScheduleDefinition;
    readonly initialUnits: readonly UnitPlacementDefinition[];
    readonly initialMechanisms: readonly MechanismPlacementDefinition[];
    readonly rngState: Seed;
}

export type Command =
    | PredefinedCommand
    | AlternativeRouteCommand
    | DeploymentCommand
    | { readonly type: "ACTIVATE_SKILL"; readonly unitId: Id }
    | { readonly type: "FINISH_SKILL"; readonly unitId: Id }
    | {
          readonly type: "CANCEL_ACTION_EXECUTION";
          readonly ref: Ref<Execution>;
      }
    | { readonly type: "STOP_PROJECTILE"; readonly projectileId: ProjectileId }
    | { readonly type: "TRIGGER_BRANCH"; readonly branchId: string; readonly isLoop: boolean };

export type Event =
    | {
          readonly type: "DEPLOYMENT_REJECTED";
          readonly cardId: number;
          readonly reason: DeploymentRejection;
          readonly tick: number;
      }
    | CombatEvent
    | ActionSignal
    | ProjectileSignal
    | SkillSignal
    | ElementalSignal
    | {
          readonly type: "BLOCKING_ACQUIRED" | "BLOCKING_RELEASED";
          readonly blockerUnitId: Id;
          readonly blockedUnitId: Id;
          readonly tick: number;
      }
    | {
          readonly type: "UNIT_DEPLOYED";
          readonly unitId: Id;
          readonly position: WorldPosition;
          readonly tick: number;
      }
    | { readonly type: "ENEMY_SPAWNED"; readonly unitId: Id; readonly tick: number }
    | {
          readonly type: "ROUTE";
          readonly unitId: Id;
          readonly signal: RouteSignal;
          readonly position: WorldPosition;
          readonly tick: number;
      }
    | { readonly type: "ROUTE_COMPLETED"; readonly unitId: Id; readonly tick: number }
    | ({
          readonly type: "UNIT_REMOVED";
          readonly tick: number;
      } & UnitRemoval);

export interface UnitRemoval {
    readonly unitId: Id;
    readonly reason: LeaveReason;
    readonly unit: Unit;
}

export interface Result {
    readonly reason: "SCHEDULE_COMPLETED" | "TIME_LIMIT";
    readonly elapsedTicks: number;
    readonly spawnedCount: number;
    readonly completedRouteCount: number;
    readonly remainingUnitIds: readonly Id[];
    readonly unspawnedCount: number;
}
