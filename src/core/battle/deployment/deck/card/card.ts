import type { Identified, Ref } from "../../../../common/ref.js";
import type { Definition as BaseDefinition } from "../../../../unit/unit.js";
import type { Definition as DeployableDefinition } from "../../../../unit/capability/deployable/capability.js";
import type { Definition as OccupancyDefinition } from "../../../../unit/capability/occupancy/capability.js";
import type { Contribution } from "../../../../common/contribution.js";
import type { Hooks } from "../../../../hook.js";
import type { Definition } from "./definition.js";
import type * as dp from "./dp.js";
import type { Restriction } from "./restriction.js";
import type * as supply from "./supply/supply.js";

export type Id = number;

export type UnitDefinition = BaseDefinition & {
    readonly deployable: DeployableDefinition;
    readonly occupancy: OccupancyDefinition;
    readonly route?: never;
};

export interface Card<S extends object = object> extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly definition: Definition<S>;
    readonly dp: dp.State;
    readonly supply: supply.State;
    readonly unitDefinition: UnitDefinition;
    readonly unitHooks: Hooks;
    readonly restrictions: readonly Contribution<Restriction>[];
    readonly state: S;
}

export function ref<T extends Card>(self: T): Ref<T> {
    return { id: self.id } as Ref<T>;
}
