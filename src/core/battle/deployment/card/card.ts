import type { Identified, Ref } from "../../../common/ref.js";
import type { Result, State as BattleState } from "../../state.js";
import type { Definition as UnitDefinition } from "../../../unit/unit.js";
import type { Definition as DeployableDefinition } from "../../../unit/capability/deployable/capability.js";
import type { Occupancy } from "../../../unit/capability/occupancy/capability.js";
import type { Contribution } from "../../../unit/contribution/contribution.js";
import type { Modifier } from "../../../unit/contribution/attribute.js";

export type Id = number;

export interface Program<S extends object = object> {
    readonly initialize: (battle: BattleState) => Result<S>;
    readonly onTick?: (battle: BattleState, self: Card<S>) => BattleState;
}

export type Definition<S extends object = object> = UnitDefinition & {
    readonly deployable: DeployableDefinition<S>;
} & Occupancy["definition"];

export type StatefulDefinition<S extends object> = Definition<S> & {
    readonly deployable: { readonly card: Program<S> };
};

export interface Supply {
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly recharge: "DEPLOYMENT" | "RETURN" | "QUEUED";
    readonly costPenalty: boolean;
}

export interface Initial {
    readonly supply?: Supply;
    readonly stock?: number | null;
}

export interface Input extends Initial {
    readonly definition: Definition<any>;
}

export interface Cooldown {
    readonly readyAtTick: number;
    readonly durationTicks: number;
}

export interface Card<S extends object = object> extends Identified<{ readonly id: Id }> {
    readonly id: Id;
    readonly definition: Definition<S>;
    readonly supply: Supply;
    readonly state: S;
    readonly stock: number | null;
    readonly cooldown: Cooldown | null;
    readonly pendingReturns: number;
    readonly costStage: number;
    readonly costContributions: readonly Contribution<readonly Modifier[]>[];
    readonly redeployTimeContributions: readonly Contribution<readonly Modifier[]>[];
}

export const operatorSupply: Supply = {
    stockLimit: null,
    activeLimit: 1,
    recharge: "RETURN",
    costPenalty: true,
};

export function ref<T extends Card<any>>(self: T): Ref<T> {
    return { id: self.id } as Ref<T>;
}
