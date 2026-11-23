import type { Ref } from "../../../common/ref.js";
import { replaceIn } from "../../../common/object.js";
import { create, type Query } from "../../../common/query.js";
import type { State as BattleState } from "../../state.js";
import type { Card } from "./card/card.js";
import { get } from "./deck.js";

export type Ordering = (battle: BattleState, cards: readonly Ref<Card>[]) => readonly Ref<Card>[];

export function ordered(battle: BattleState): Query<Card> {
    return create(() => battle.deployment.deck.order.values()).map((reference) =>
        get(battle, reference)!,
    );
}

export function setOrdering(battle: BattleState, ordering: Ordering | null): BattleState {
    return replaceIn(battle, ["deployment", "deck", "ordering"], ordering);
}
