import type { Seed } from "../common/rng.js";
import type { Map } from "../battlefield/map/map.js";
import type { Input as MechanismInput } from "../mechanism/index.js";
import type { Definition as ScheduleDefinition } from "./schedule/definition.js";
import type { Definition as UnitDefinition, Unit } from "../unit/unit.js";
import type { Input as UnitInput } from "../unit/initialize.js";
import type { Definitions as CapabilityDefinitions } from "../unit/capability/catalog.js";
import type { Input as DeploymentInput } from "./deployment/deployment.js";
import type { Card } from "./deployment/card/card.js";
import type { DeploymentCommand } from "./deployment/operations.js";
import type { Ref } from "../common/ref.js";
import type { ExecutionRef } from "../unit/capability/action/execution.js";
import type { Operation } from "../unit/capability/skill/activation.js";
import type { Skill } from "../unit/capability/skill/capability.js";

export type { Event } from "./event.js";

export interface Definition {
    readonly routeMoveMultiplier: number;
    readonly pushMultiplier: number;
}

export interface Input<
    CardStates extends readonly object[] = readonly object[],
    MechanismStates extends readonly object[] = readonly object[],
    UnitDefinitions extends readonly (UnitDefinition & Partial<CapabilityDefinitions>)[] =
        readonly (UnitDefinition & Partial<CapabilityDefinitions>)[],
> extends Omit<Definition, "pushMultiplier"> {
    readonly pushMultiplier?: number;
    readonly deployment?: DeploymentInput<CardStates>;
    readonly map: Map;
    readonly schedule: ScheduleDefinition;
    readonly initialMechanisms: {
        readonly [K in keyof MechanismStates]: MechanismInput<MechanismStates[K]>;
    };
    readonly initialUnits: {
        readonly [K in keyof UnitDefinitions]: UnitInput<UnitDefinitions[K]>;
    };
    readonly rngState: Seed;
}

export interface SkillCommand {
    readonly type: "SKILL";
    readonly ref: Ref<Unit & Skill>;
    readonly operation: "ACTIVATE" | Operation;
}

export type Command<T extends Card<any> = Card> =
    | DeploymentCommand<T>
    | SkillCommand
    | {
          readonly type: "CANCEL_ACTION_EXECUTION";
          readonly ref: ExecutionRef;
      };
