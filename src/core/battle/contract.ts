import type { Seed } from "../common/rng.js";
import type { Map } from "../battlefield/map/map.js";
import type { MechanismPlacementDefinition } from "./creation/mechanism.js";
import type { Definition as ScheduleDefinition } from "./schedule/definition.js";
import type { Unit } from "../unit/unit.js";
import type { Input as DeploymentInput } from "./deployment/deployment.js";
import type { Card } from "./deployment/card/card.js";
import type { StoredPredefinedDefinition } from "./steps/predefined.js";
import type { DeploymentCommand } from "./deployment/operations.js";
import type { Ref } from "../common/ref.js";
import type { Execution } from "../unit/action/execution.js";
import type { Projectile } from "../projectile/projectile.js";
import type { Skill } from "../unit/capability/skill/capability.js";

export type { Event } from "./event.js";

export interface Definition {
    readonly predefines: readonly StoredPredefinedDefinition[];
    readonly routeMoveMultiplier: number;
}

export interface Input<
    CardStates extends readonly object[] = readonly object[],
    MechanismStates extends readonly object[] = readonly object[],
> extends Definition {
    readonly deployment?: DeploymentInput<CardStates>;
    readonly map: Map;
    readonly schedule: ScheduleDefinition;
    readonly initialMechanisms: {
        readonly [K in keyof MechanismStates]: MechanismPlacementDefinition<MechanismStates[K]>;
    };
    readonly rngState: Seed;
}

export type Command<T extends Card<any> = Card, P extends Projectile<any> = Projectile> =
    | DeploymentCommand<T>
    | { readonly type: "ACTIVATE_SKILL"; readonly ref: Ref<Unit & Skill> }
    | { readonly type: "STOP_SKILL"; readonly ref: Ref<Unit & Skill> }
    | {
          readonly type: "CANCEL_ACTION_EXECUTION";
          readonly ref: Ref<Execution>;
      }
    | { readonly type: "STOP_PROJECTILE"; readonly ref: Ref<P> };
