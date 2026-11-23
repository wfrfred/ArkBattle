import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";
import { ref, type Card } from "./card/card.js";
import { resolveCost as resolveCardCost } from "./card/dp.js";
import { advance as advanceCard } from "./card/operations.js";
import { all } from "./deck.js";
import { refreshOrder } from "./order.js";

export function add<S extends object>(battle: BattleState, self: Card<S>): BattleState {
    const { deck } = battle.deployment;

    return refreshOrder(
        replaceIn(battle, ["deployment", "deck"], {
            ...deck,
            cards: deck.cards.add(self.id, self),
            order: [...deck.order, ref(self)],
        }),
    );
}

export function replace(battle: BattleState, self: Card): BattleState {
    const { deck } = battle.deployment;
    const cards = deck.cards.replace(self.id, self);

    return cards === deck.cards
        ? battle
        : refreshOrder(replaceIn(battle, ["deployment", "deck", "cards"], cards));
}

export function advance(battle: BattleState): BattleState {
    const candidates = all(battle);

    for (const candidate of candidates) {
        battle = advanceCard(battle, ref(candidate));
    }

    return battle;
}

export function resolveCost(battle: BattleState, self: Card): number {
    return resolveCardCost(self, battle.deployment.deck.costCeiling);
}
