import * as restriction from "../../../restriction.js";
import type { Ref } from "../../../common/ref.js";
import type { Query } from "../../../common/query.js";
import type { State as BattleState } from "../../state.js";
import type { Card } from "./card.js";
import type { RestrictionContext } from "./restriction.js";

export function get<T extends Card<any>>(battle: BattleState, reference: Ref<T>): T | undefined {
    return battle.deployment.cards.get(reference.id) as T | undefined;
}

export function all(battle: BattleState): Query<Card> {
    return battle.deployment.cards.values() as Query<Card>;
}

export function allows<T extends Card<any>>(
    battle: BattleState,
    context: Exclude<RestrictionContext<T>, { readonly purpose: "DEPLOY" }>,
): boolean {
    const self = get(battle, context.ref);

    return self !== undefined && restriction.allows(battle, context, self.restrictions);
}
