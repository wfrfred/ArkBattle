import { replaceIn } from "../../../common/object.js";
import { create, type Query } from "../../../common/query.js";
import type { State as BattleState } from "../../state.js";
import type { Card } from "./card/card.js";

export type Ordering = (battle: BattleState, left: Card, right: Card) => number;

export function ordered(battle: BattleState): Query<Card> {
    return create(() => battle.deployment.deck.order.values()).map((reference) =>
        reference.get(battle)!,
    );
}

export function setOrdering(battle: BattleState, ordering: Ordering | null): BattleState {
    return replaceIn(battle, ["deployment", "deck", "ordering"], ordering);
}
