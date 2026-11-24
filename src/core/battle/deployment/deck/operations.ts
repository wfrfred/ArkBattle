import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";
import { ref, type Card } from "./card/card.js";
import { resolveCost as resolveCardCost } from "./card/dp/index.js";
import { advance as advanceCard } from "./card/operations.js";
import { all } from "./deck.js";

export function add<S extends object>(battle: BattleState, self: Card<S>): BattleState {
    const { deck } = battle.deployment;

    return replaceIn(battle, ["deployment", "deck"], {
        ...deck,
        cards: deck.cards.add(self.id, self),
        order: [...deck.order, ref<Card<any>>(self)],
    });
}

export function replace<S extends object>(battle: BattleState, self: Card<S>): BattleState {
    const { deck } = battle.deployment;

    return replaceIn(battle, ["deployment", "deck", "cards"], deck.cards.replace(self.id, self));
}

export function advance(battle: BattleState): BattleState {
    const candidates = all(battle);

    for (const candidate of candidates) {
        battle = advanceCard(battle, ref(candidate));
    }

    return sort(battle);
}

export function sort(battle: BattleState): BattleState {
    const { ordering, order: previous } = battle.deployment.deck;
    if (ordering === null) {
        return battle;
    }

    const order = ordering(battle, previous);

    return order.length === previous.length &&
        order.every((ref, index) => ref.id === previous[index]!.id)
        ? battle
        : replaceIn(battle, ["deployment", "deck", "order"], order);
}

export function resolveCost<S extends object>(battle: BattleState, self: Card<S>): number {
    return resolveCardCost(self, battle.deployment.deck.costCeiling);
}
