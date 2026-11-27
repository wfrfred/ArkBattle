import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";
import { ref, type Card } from "./card/card.js";
import { advance as advanceCard } from "./card/operations.js";
import { all } from "./deck.js";
import { register } from "../../../lifetime/operations.js";
import { sort as sortCards } from "../../../common/collection/order.js";
import { ordered } from "./order.js";

export function add(battle: BattleState, self: Card): BattleState {
    const { deck } = battle.deployment;
    const reference = ref(self);

    battle = replaceIn(battle, ["deployment", "deck"], {
        ...deck,
        cards: deck.cards.add(reference, self),
        order: [...deck.order, reference],
    });

    return register(battle, reference, []);
}

export function replace(battle: BattleState, self: Card): BattleState {
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

    const order = sortCards(ordered(battle), (left, right) => ordering(battle, left, right)).map(
        ref,
    );

    return order.every((ref, index) => ref === previous[index])
        ? battle
        : replaceIn(battle, ["deployment", "deck", "order"], order);
}
