import type { Identified, Ref } from "../../../common/ref.js";
import type { Definition as BaseDefinition, Unit } from "../../../unit/unit.js";
import type {
    Definition as DeployableDefinition,
    Deployable,
} from "../../../unit/capability/deployable/capability.js";
import type { Definition as OccupancyDefinition } from "../../../unit/capability/occupancy/capability.js";
import type { Contribution } from "../../../unit/contribution/contribution.js";
import type { Modifier } from "../../../unit/contribution/attribute.js";
import type { Hooks } from "../../../hook.js";
import type { Definition } from "./definition.js";
import type { Rule } from "./rule.js";

export type Id = number;

export type UnitDefinition<S extends object = object> = BaseDefinition & {
    readonly card: Definition<S>;
    readonly deployable: DeployableDefinition;
    readonly occupancy: OccupancyDefinition;
};

export type Clock = {
    readonly durationTicks: number;
} & (
    | { readonly type: "RUNNING"; readonly readyAtTick: number }
    | { readonly type: "PAUSED"; readonly remainingTicks: number }
);

export interface Recovery {
    readonly pending: number;
    readonly clock: Clock;
}

export type TimerTarget = "COOLDOWN" | "RECOVERY";

export interface Card<S extends object = object> extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly definition: UnitDefinition<S>;
    readonly deployedUnits: readonly Ref<Unit & Deployable>[];
    readonly unitHooks: Hooks;
    readonly rules: readonly Rule[];
    readonly state: S;
    readonly stock: number;
    readonly cooldown: Clock | null;
    readonly recovery: Recovery | null;
    readonly costStage: number;
    readonly costContributions: readonly Contribution<readonly Modifier[]>[];
    readonly redeployTimeContributions: readonly Contribution<readonly Modifier[]>[];
}

export function ref<T extends Card<any>>(self: T): Ref<T> {
    return { id: self.id } as Ref<T>;
}
