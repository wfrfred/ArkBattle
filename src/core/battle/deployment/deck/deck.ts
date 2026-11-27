import { assertNonnegativeNumber } from "../../../common/assert.js";
import { Store } from "../../../common/collection/store.js";
import type { Query } from "../../../common/query.js";
import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../state.js";
import type { Card } from "./card/card.js";
import type { Ordering } from "./order.js";

export interface Definition {
    readonly costCeiling: number;
}

export interface State {
    readonly cards: Store<Ref<Card>, Card>;
    readonly order: readonly Ref<Card>[];
    readonly ordering: Ordering | null;
    readonly costCeiling: number;
}

export function initialize(definition: Definition): State {
    const { costCeiling } = definition;
    assertNonnegativeNumber(costCeiling, "deployment cost ceiling");

    return {
        cards: Store.empty(),
        order: [],
        ordering: null,
        costCeiling,
    };
}

export function all(battle: BattleState): Query<Card> {
    return battle.deployment.deck.cards.values();
}
