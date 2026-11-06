import type { Seed } from "../common/rng.js";
import type { Map } from "../battlefield/map/map.js";
import type { MechanismPlacementDefinition } from "./creation/mechanism.js";
import type { SpawnScheduleDefinition } from "./schedule/definition.js";
import type { Id, Unit } from "../unit/unit.js";
import type { Input as DeploymentInput } from "./deployment/deployment.js";
import type { Card } from "./deployment/card/card.js";
import type { StoredPredefinedDefinition, PredefinedDefinition } from "./steps/predefined.js";
import type { AlternativeRouteCommand } from "./steps/movement.js";
import type { DeploymentCommand } from "./deployment/operations.js";
import type { Ref } from "../common/ref.js";
import type { Execution } from "../unit/action/execution.js";
import type { Projectile } from "../projectile/projectile.js";
import type { Skill } from "../unit/capability/skill/capability.js";

export type { Event } from "./event.js";

export type { UnitRemoval } from "../unit/unit.js";

export interface Definition {
    readonly predefines: readonly StoredPredefinedDefinition[];
    readonly maxTicks: number;
    readonly routeMoveMultiplier: number;
}

export interface Input<
    CardStates extends readonly object[] = readonly object[],
    MechanismStates extends readonly object[] = readonly object[],
    PredefinedTypes extends readonly object[] = readonly object[],
> extends Definition {
    readonly predefines: {
        readonly [K in keyof PredefinedTypes]: PredefinedDefinition<PredefinedTypes[K]>;
    };
    readonly deployment?: DeploymentInput<CardStates>;
    readonly map: Map;
    readonly schedule: SpawnScheduleDefinition;
    readonly initialMechanisms: {
        readonly [K in keyof MechanismStates]: MechanismPlacementDefinition<MechanismStates[K]>;
    };
    readonly rngState: Seed;
}

export type Command<T extends Card<any> = Card, P extends Projectile<any> = Projectile> =
    | AlternativeRouteCommand
    | DeploymentCommand<T>
    | { readonly type: "ACTIVATE_SKILL"; readonly ref: Ref<Unit & Skill> }
    | { readonly type: "STOP_SKILL"; readonly ref: Ref<Unit & Skill> }
    | {
          readonly type: "CANCEL_ACTION_EXECUTION";
          readonly ref: Ref<Execution>;
      }
    | { readonly type: "STOP_PROJECTILE"; readonly ref: Ref<P> }
    | { readonly type: "TRIGGER_BRANCH"; readonly branchId: string; readonly isLoop: boolean };

export interface Result {
    readonly reason: "SCHEDULE_COMPLETED" | "TIME_LIMIT";
    readonly elapsedTicks: number;
    readonly spawnedCount: number;
    readonly completedRouteCount: number;
    readonly remainingUnitIds: readonly Id[];
    readonly unspawnedCount: number;
}
