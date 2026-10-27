import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { State as BattleState, Result } from "../state.js";
import * as card from "./card.js";
import { changeDp } from "./deployment.js";

export function updateCard(state: BattleState, value: card.Card): BattleState {
    const index = state.deployment.cards.findIndex((current) => current.id === value.id);

    if (index < 0) {
        throw new RangeError(`unknown deployment card ${value.id}`);
    }
    if (state.deployment.cards[index] === value) {
        return state;
    }

    const cards = [...state.deployment.cards];
    cards[index] = value;

    return { ...state, deployment: { ...state.deployment, cards } };
}

export function addCard(state: BattleState, definition: card.Input): Result<card.Id> {
    const id = state.execution.nextCardId;
    assertNonnegativeSafeInteger(id + 1, "deployment card allocation progress");
    const value = card.create(id, definition);

    return {
        state: {
            ...state,
            execution: { ...state.execution, nextCardId: id + 1 },
            deployment: { ...state.deployment, cards: [...state.deployment.cards, value] },
        },
        value: id,
    };
}

export function advance(state: BattleState, tick: number): BattleState {
    for (const value of state.deployment.cards) {
        state = updateCard(state, card.advance(value, tick));
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
