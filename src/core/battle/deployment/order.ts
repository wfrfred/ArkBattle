import type { Ref } from "../../common/ref.js";
import { create, type Query } from "../../common/query.js";
import type { State as BattleState } from "../state.js";
import type { Card } from "./card/card.js";
import { get } from "./card/query.js";

export type Ordering = (battle: BattleState, cards: readonly Ref<Card>[]) => readonly Ref<Card>[];

export function ordered(battle: BattleState): Query<Card> {
    return create(() => battle.deployment.order.values()).map((reference) =>
        get(battle, reference)!,
    );
}

export function setOrdering(battle: BattleState, ordering: Ordering | null): BattleState {
    battle = {
        ...battle,
        deployment: { ...battle.deployment, ordering },
    };

    return refreshOrder(battle);
}

export function refreshOrder(battle: BattleState): BattleState {
    const { ordering, order: previous } = battle.deployment;
    if (ordering === null) {
        return battle;
    }

    const order = ordering(battle, previous);

    return order.length === previous.length &&
        order.every((ref, index) => ref.id === previous[index]!.id)
        ? battle
        : { ...battle, deployment: { ...battle.deployment, order } };
}
