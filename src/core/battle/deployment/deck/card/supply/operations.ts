import { assertNonnegativeSafeInteger } from "../../../../../common/assert.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Ref } from "../../../../../common/ref.js";
import type { State as BattleState } from "../../../../state.js";
import { get } from "../../deck.js";
import { replace } from "../../operations.js";
import type { Card } from "../card.js";
import { remaining, resolveCooldown } from "./query.js";

export function consume(battle: BattleState, reference: Ref<Card>, count = 1): BattleState {
    assertNonnegativeSafeInteger(count, "card consumption count");
    const card = get(battle, reference)!;
    const { stock } = card.supply;
    if (count > stock) {
        throw new RangeError("card stock is insufficient");
    }

    return replace(battle, replaceIn(card, ["supply", "stock"], stock - count));
}

export function recharge(battle: BattleState, reference: Ref<Card>, count: number): BattleState {
    assertNonnegativeSafeInteger(count, "card recharge count");
    const card = get(battle, reference)!;
    const stock = card.supply.stock + Math.min(count, remaining(card) ?? Infinity);

    return replace(battle, replaceIn(card, ["supply", "stock"], stock));
}

export function enqueue(battle: BattleState, reference: Ref<Card>, count = 1): BattleState {
    assertNonnegativeSafeInteger(count, "card recovery count");
    const card = get(battle, reference)!;
    const { supply } = card;
    const { policy } = supply;
    if (policy.type !== "QUEUED") {
        throw new TypeError("card recovery queue requires the QUEUED policy");
    }

    const added = Math.min(count, remaining(card) ?? Infinity);
    if (added === 0) {
        return battle;
    }

    return replace(battle, {
        ...card,
        supply: {
            ...supply,
            policy: { ...policy, pending: policy.pending + added },
            cooldown: policy.pending === 0 ? resolveCooldown(card) : supply.cooldown,
        },
    });
}

export function setCooldown(battle: BattleState, reference: Ref<Card>, ticks: number): BattleState {
    assertNonnegativeSafeInteger(ticks, "cooldown ticks");
    const card = get(battle, reference)!;

    return replace(battle, replaceIn(card, ["supply", "cooldown"], ticks));
}

export function reduceCooldown(
    battle: BattleState,
    reference: Ref<Card>,
    ticks: number,
): BattleState {
    assertNonnegativeSafeInteger(ticks, "cooldown reduction ticks");
    const card = get(battle, reference)!;
    const cooldown = Math.max(0, card.supply.cooldown - ticks);

    return replace(battle, replaceIn(card, ["supply", "cooldown"], cooldown));
}

export function setPaused(battle: BattleState, reference: Ref<Card>, paused: boolean): BattleState {
    const card = get(battle, reference)!;

    return replace(battle, replaceIn(card, ["supply", "paused"], paused));
}
