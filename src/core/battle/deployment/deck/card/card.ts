import type { Identified, Ref } from "../../../../common/ref.js";
import type { Definition as BaseDefinition } from "../../../../unit/unit.js";
import type { Definition as DeployableDefinition } from "../../../../unit/capability/deployable/capability.js";
import type { Definition as OccupancyDefinition } from "../../../../unit/capability/occupancy/capability.js";
import type { Contribution } from "../../../../common/contribution.js";
import type { Hooks } from "../../../../hook.js";
import type { State as BattleState } from "../../../state.js";
import type { Definition } from "./definition.js";
import type * as dp from "./dp/index.js";
import type { Restriction } from "./restriction.js";
import type * as supply from "./supply/supply.js";

export type Id = number;

export type UnitDefinition = BaseDefinition & {
    readonly deployable: DeployableDefinition;
    readonly occupancy: OccupancyDefinition;
    readonly route?: never;
};

export type Policy = "DEFAULT" | "UNIQUE" | "QUEUED";

export type Card<S extends object = object, P extends Policy = Policy> = {
    readonly state: S;
    readonly policy: P;
} & {
    [K in Policy]: Identified<{ readonly id: Id }> & {
        readonly id: Id;
        readonly policy: K;
        readonly definition: Definition<S, K>;
        readonly dp: dp.State<K>;
        readonly supply: supply.State<K>;
        readonly unitDefinition: UnitDefinition;
        readonly unitHooks: Hooks;
        readonly restrictions: readonly Contribution<Restriction>[];
    };
}[P];

export function ref<T extends Card<any>>(self: T): Ref<T> {
    return { id: self.id, get: getCard } as Ref<T>;
}

function getCard(this: object, battle: BattleState): Card | undefined {
    const { id } = this as Ref<Card>;

    return battle.deployment.deck.cards.get(id);
}
