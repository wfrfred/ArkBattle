import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Ref } from "../../common/ref.js";
import type { State as BattleState, Result } from "../state.js";
import {
    operatorSupply,
    ref,
    type Card,
    type Definition,
    type StatefulDefinition,
    type Initial,
} from "./card/card.js";
import { get, all } from "./card/query.js";
import * as card from "./card/state.js";
import { changeDp } from "./deployment.js";

export function replaceCard(state: BattleState, value: Card<any>): BattleState {
    const index = state.deployment.cards.findIndex((current) => current.id === value.id);
    if (state.deployment.cards[index] === value) {
        return state;
    }

    const cards = [...state.deployment.cards];
    cards[index] = value as Card;

    return { ...state, deployment: { ...state.deployment, cards } };
}

export function addCard<S extends object>(
    battle: BattleState,
    definition: StatefulDefinition<S>,
    initial?: Initial,
): Result<Ref<Card<S>>>;
export function addCard(
    battle: BattleState,
    definition: Definition,
    initial?: Initial,
): Result<Ref<Card>>;
export function addCard(
    battle: BattleState,
    definition: Definition<any>,
    initial: Initial = {},
): Result<Ref<Card<any>>> {
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
    if (
        (supply.stockLimit !== null && (stock === null || stock > supply.stockLimit)) ||
        (supply.recharge === "QUEUED" && stock === null)
    ) {
        throw new RangeError("card stock does not match its supply");
    }

    const id = battle.execution.nextCardId;
    battle = { ...battle, execution: { ...battle.execution, nextCardId: id + 1 } };
    const initialized = definition.deployable.card?.initialize(battle) ?? {
        state: battle,
        value: {},
    };
    battle = initialized.state;
    const value: Card<any> = {
        id,
        definition,
        supply,
        state: initialized.value as object,
        stock,
        cooldown: null,
        pendingReturns: 0,
        costStage: 0,
        costContributions: [],
        redeployTimeContributions: [],
    };

    return {
        state: {
            ...battle,
            deployment: { ...battle.deployment, cards: [...battle.deployment.cards, value] },
        },
        value: ref(value),
    };
}

export function advance(state: BattleState, tick: number): BattleState {
    const candidates = all(state);

    for (const candidate of candidates) {
        const reference = ref(candidate);
        const self = card.advance(get(state, reference)!, tick);
        state = replaceCard(state, self);
        state = self.definition.deployable.card?.onTick?.(state, self) ?? state;
    }

    let deployment = state.deployment;
    const next = deployment.nextDpRecoveryAtTick;
    const interval = deployment.definition.dpRecoveryTicks;
    if (next !== null && interval !== null && tick >= next) {
        const count = Math.floor((tick - next) / interval) + 1;
        deployment = changeDp(deployment, count, tick);

        if (deployment.nextDpRecoveryAtTick !== null) {
            deployment = { ...deployment, nextDpRecoveryAtTick: next + count * interval };
        }
    }

    return deployment === state.deployment ? state : { ...state, deployment };
}
