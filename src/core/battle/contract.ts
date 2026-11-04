import type { Seed } from "../common/rng.js";
import type { Map } from "../battlefield/map/map.js";
import type { MechanismPlacementDefinition } from "./creation/mechanism.js";
import type { SpawnScheduleDefinition } from "./schedule/definition.js";
import type { Id } from "../unit/unit.js";
import type { Input as DeploymentInput } from "./deployment/deployment.js";
import type { Card } from "./deployment/card/card.js";
import type { PredefinedDefinition, PredefinedCommand } from "./steps/predefined.js";
import type { AlternativeRouteCommand } from "./steps/movement.js";
import type { DeploymentCommand } from "./deployment/operations.js";
import type { Ref } from "../common/ref.js";
import type { Execution } from "../unit/action/execution.js";
import type { Id as ProjectileId } from "../projectile/projectile.js";

export type { Event } from "./event.js";

export type { UnitRemoval } from "../unit/unit.js";

export interface Definition {
    readonly predefines: readonly PredefinedDefinition[];
    readonly maxTicks: number;
    readonly routeMoveMultiplier: number;
}

export interface Input extends Definition {
    readonly deployment?: DeploymentInput;
    readonly map: Map;
    readonly schedule: SpawnScheduleDefinition;
    readonly initialMechanisms: readonly MechanismPlacementDefinition[];
    readonly rngState: Seed;
}

export type Command<T extends Card<any> = Card> =
    | PredefinedCommand
    | AlternativeRouteCommand
    | DeploymentCommand<T>
    | { readonly type: "ACTIVATE_SKILL"; readonly unitId: Id }
    | { readonly type: "FINISH_SKILL"; readonly unitId: Id }
    | {
          readonly type: "CANCEL_ACTION_EXECUTION";
          readonly ref: Ref<Execution>;
      }
    | { readonly type: "STOP_PROJECTILE"; readonly projectileId: ProjectileId }
    | { readonly type: "TRIGGER_BRANCH"; readonly branchId: string; readonly isLoop: boolean };

export interface Result {
    readonly reason: "SCHEDULE_COMPLETED" | "TIME_LIMIT";
    readonly elapsedTicks: number;
    readonly spawnedCount: number;
    readonly completedRouteCount: number;
    readonly remainingUnitIds: readonly Id[];
    readonly unspawnedCount: number;
}
