import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";
import { ref, type Card } from "./card/card.js";
import { advance as advanceCard } from "./card/operations.js";
import { all } from "./deck.js";

export function add<S extends object>(battle: BattleState, self: Card<S>): BattleState {
    const { deck } = battle.deployment;
    const reference = ref<Card<any>>(self);

    return replaceIn(battle, ["deployment", "deck"], {
        ...deck,
        cards: deck.cards.add(reference, self),
        order: [...deck.order, reference],
    });
}

export function replace<S extends object>(battle: BattleState, self: Card<S>): BattleState {
    const { deck } = battle.deployment;

    return replaceIn(battle, ["deployment", "deck", "cards"], deck.cards.replace(ref(self), self));
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

    return order.length === previous.length && order.every((ref, index) => ref === previous[index])
        ? battle
        : replaceIn(battle, ["deployment", "deck", "order"], order);
}
