import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Ref } from "../../common/ref.js";
import type { State as BattleState, Result } from "../state.js";
import { operatorSupply, ref, type Card, type UnitDefinition, type Initial } from "./card/card.js";
import { get, all } from "./card/query.js";
import * as card from "./card/state.js";
import * as dp from "./dp.js";
import { refreshOrder } from "./order.js";
import { operator } from "./normal.js";

export function replaceCard(state: BattleState, value: Card<any>): BattleState {
    const index = state.deployment.cards.findIndex((current) => current.id === value.id);
    if (state.deployment.cards[index] === value) {
        return state;
    }

    const cards = [...state.deployment.cards];
    cards[index] = value as Card;

    return refreshOrder({ ...state, deployment: { ...state.deployment, cards } });
}

export function addCard<S extends object>(
    battle: BattleState,
    definition: UnitDefinition<S>,
    initial: Initial = {},
): Result<Ref<Card<S>>> {
    const supply = initial.supply ?? operatorSupply;
    const stock = initial.stock === undefined ? supply.stockLimit : initial.stock;
    if (supply.stockLimit !== null) {
        assertNonnegativeSafeInteger(supply.stockLimit, "card stock limit");
    }
    if (supply.activeLimit !== null) {
        assertNonnegativeSafeInteger(supply.activeLimit, "card active limit");
    }
    if (stock !== null) {
        assertNonnegativeSafeInteger(stock, "card stock");
    }
    if (supply.stockLimit !== null && (stock === null || stock > supply.stockLimit)) {
        throw new RangeError("card stock does not match its supply");
    }

    const id = battle.execution.nextCardId;
    battle = { ...battle, execution: { ...battle.execution, nextCardId: id + 1 } };
    const initialized = definition.deployable.card.initialize(battle);
    battle = initialized.state;
    const value: Card<S> = {
        id,
        definition,
        supply,
        program: initial.program ?? operator,
        hooks: [],
        rules: [],
        state: initialized.value,
        stock,
        cooldown: null,
        recovery: null,
        costStage: 0,
        costContributions: [],
        redeployTimeContributions: [],
    };
    // Erase the private state only when entering the heterogeneous collection.
    const entry: Card<any> = value;

    return {
        state: refreshOrder({
            ...battle,
            deployment: {
                ...battle.deployment,
                cards: [...battle.deployment.cards, entry],
                order: [...battle.deployment.order, ref(entry)],
            },
        }),
        value: ref(value),
    };
}

export function advance(state: BattleState, tick: number): BattleState {
    const candidates = all(state);

    for (const candidate of candidates) {
        const reference = ref(candidate);
        const self = card.advance(get(state, reference)!, tick);
        state = replaceCard(state, self);
        state = self.definition.deployable.card.onTick?.(state, self) ?? state;
    }

    const deployment = dp.advance(state.deployment, tick);

    return deployment === state.deployment ? state : { ...state, deployment };
}
