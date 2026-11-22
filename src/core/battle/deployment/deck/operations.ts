import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";
import { ref, type Card } from "./card/card.js";
import * as card from "./card/state.js";
import { all, get } from "./deck.js";
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

export function replace(battle: BattleState, self: Card<any>): BattleState {
    const { deck } = battle.deployment;
    const cards = deck.cards.replace(self.id, self);

    return cards === deck.cards
        ? battle
        : refreshOrder(replaceIn(battle, ["deployment", "deck", "cards"], cards));
}

export function advanceCard(battle: BattleState, self: Card<any>): BattleState {
    return replace(battle, card.advance(self, battle.tick));
}

export function advance(battle: BattleState): BattleState {
    const tick = battle.tick;
    const candidates = all(battle);

    for (const candidate of candidates) {
        const self = card.advance(get(battle, ref(candidate))!, tick);
        battle = replace(battle, self);
        battle = self.definition.onTick?.(battle, self) ?? battle;
    }

    return battle;
}

export function resolveCost(battle: BattleState, self: Card<any>): number {
    return card.resolveCost(self, battle.deployment.deck.costCeiling);
}
