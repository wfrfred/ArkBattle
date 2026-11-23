import type { Ref } from "../../../../common/ref.js";
import type { Contribution } from "../../../../common/contribution.js";
import type { Modifier } from "../../../../common/modifier.js";
import type { State as BattleState } from "../../../state.js";
import { replace } from "../operations.js";
import type { Card } from "./card.js";
import type { Key } from "../../../../hook.js";
import { type Entry, set, remove } from "../../../../common/collection/entries.js";
import type { Restriction } from "./restriction.js";
import * as dp from "./dp.js";
import { requireCard } from "./query.js";
import { recycle as recycleSupply } from "./supply/operations.js";

export function setState<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const self = requireCard(battle, reference);

    return state === self.state ? battle : replace(battle, { ...self, state });
}

export function incrementCostStage(battle: BattleState, reference: Ref<Card<any>>): BattleState {
    return replace(battle, dp.incrementCostStage(requireCard(battle, reference)));
}

export function recycle(battle: BattleState, reference: Ref<Card>): BattleState {
    const { definition } = requireCard(battle, reference);
    if (definition.dp.increaseCostOnRetreatOrDeath) {
        battle = incrementCostStage(battle, reference);
    }

    return recycleSupply(battle, reference);
}

export function setUnitHook<H extends Entry, Owner extends object>(
    battle: BattleState,
    reference: Ref<Card<any>>,
    key: Key<H, Owner>,
    entry: NoInfer<H>,
): BattleState {
    const self = requireCard(battle, reference);
    const unitHooks = self.unitHooks.set(key, entry);

    return unitHooks === self.unitHooks ? battle : replace(battle, { ...self, unitHooks });
}

export function removeUnitHook<H extends Entry, Owner extends object>(
    battle: BattleState,
    reference: Ref<Card<any>>,
    key: Key<H, Owner>,
    id: string,
): BattleState {
    const self = requireCard(battle, reference);
    const unitHooks = self.unitHooks.remove(key, id);

    return unitHooks === self.unitHooks ? battle : replace(battle, { ...self, unitHooks });
}

export function setRestriction(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<Restriction>,
): BattleState {
    const self = requireCard(battle, reference);
    const restrictions = set(self.restrictions, entry);

    return restrictions === self.restrictions ? battle : replace(battle, { ...self, restrictions });
}

export function removeRestriction(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    const self = requireCard(battle, reference);
    const restrictions = remove(self.restrictions, id);

    return restrictions === self.restrictions ? battle : replace(battle, { ...self, restrictions });
}

export function setCostContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<readonly Modifier[]>,
): BattleState {
    return replace(battle, dp.setCostContribution(requireCard(battle, reference), entry));
}

export function removeCostContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    return replace(battle, dp.removeCostContribution(requireCard(battle, reference), id));
}
