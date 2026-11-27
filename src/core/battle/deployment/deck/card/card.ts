import { set, remove } from "../../../../common/collection/entries.js";
import { replaceIn } from "../../../../common/object.js";
import type { State as BattleState } from "../../../state.js";
import { replace } from "../operations.js";
import type { Config, Lifetime } from "../../../../lifetime/index.js";
import type { Definition as BaseDefinition, Unit } from "../../../../unit/unit.js";
import type {
    Definition as DeployableDefinition,
    Deployable,
} from "../../../../unit/capability/deployable/capability.js";
import type { Definition as OccupancyDefinition } from "../../../../unit/capability/occupancy/capability.js";
import type { Contribution } from "../../../../common/contribution.js";
import type { Ref } from "../../../../common/ref.js";
import type { Hooks } from "../../../../hook.js";
import type { EraseCallbacks } from "../../../../common/callback.js";
import type { Definition } from "./definition.js";
import type * as dp from "./dp/index.js";
import type { Restriction } from "./restriction.js";
import type * as supply from "./supply/supply.js";

export type UnitDefinition = BaseDefinition & {
    readonly deployable: DeployableDefinition;
    readonly occupancy: OccupancyDefinition;
    readonly locomotion?: never;
    readonly route?: never;
};

export type Policy = "DEFAULT" | "UNIQUE" | "QUEUED";

export type Card<S extends object = object, P extends Policy = Policy> = {
    readonly state: S;
    readonly policy: P;
    readonly config: Config<Card, never>;
    readonly units: readonly Ref<Unit & Deployable>[];
} & {
    [K in Policy]: Lifetime & {
        readonly policy: K;
        readonly definition: EraseCallbacks<Definition<S, K>>;
        readonly dp: dp.State<K>;
        readonly supply: supply.State<K>;
        readonly unitDefinition: UnitDefinition;
        readonly hooks: Hooks;
        readonly restrictions: readonly Contribution<Restriction>[];
    };
}[P];

export { ref } from "../../../../common/ref.js";

export function setRestriction(
    battle: BattleState,
    reference: Ref<Card>,
    entry: Contribution<Restriction>,
): BattleState {
    const self = reference.get(battle)!;
    const next = replaceIn(self, ["restrictions"], set(self.restrictions, entry));

    return next === self ? battle : replace(battle, next);
}

export function removeRestriction(
    battle: BattleState,
    reference: Ref<Card>,
    id: string,
): BattleState {
    const self = reference.get(battle)!;
    const next = replaceIn(self, ["restrictions"], remove(self.restrictions, id));

    return next === self ? battle : replace(battle, next);
}
