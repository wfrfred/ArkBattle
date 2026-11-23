import { assertNonnegativeSafeInteger } from "../../../../../common/assert.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Card } from "../card.js";
import { remaining, resolveCooldown } from "./query.js";

export function consume<T extends Card>(card: T, count = 1): T {
    assertNonnegativeSafeInteger(count, "card consumption count");
    const { stock } = card.supply;
    if (count > stock) {
        throw new RangeError("card stock is insufficient");
    }

    const supply = replaceIn(card.supply, ["stock"], stock - count);

    return supply === card.supply ? card : { ...card, supply };
}

export function recharge<T extends Card>(card: T, count: number): T {
    assertNonnegativeSafeInteger(count, "card recharge count");
    const stock = card.supply.stock + Math.min(count, remaining(card) ?? Infinity);
    const supply = replaceIn(card.supply, ["stock"], stock);

    return supply === card.supply ? card : { ...card, supply };
}

export function enqueue<T extends Card>(card: T, count = 1): T {
    assertNonnegativeSafeInteger(count, "card recovery count");
    const { supply } = card;
    const { policy } = supply;
    if (policy.type !== "QUEUED") {
        throw new TypeError("card recovery queue requires the QUEUED policy");
    }

    const added = Math.min(count, remaining(card) ?? Infinity);
    if (added === 0) {
        return card;
    }

    return {
        ...card,
        supply: {
            ...supply,
            policy: { ...policy, pending: policy.pending + added },
            cooldown: policy.pending === 0 ? resolveCooldown(card) : supply.cooldown,
        },
    };
}

export function setCooldown<T extends Card>(card: T, ticks: number): T {
    assertNonnegativeSafeInteger(ticks, "cooldown ticks");
    const supply = replaceIn(card.supply, ["cooldown"], ticks);

    return supply === card.supply ? card : { ...card, supply };
}

export function reduceCooldown<T extends Card>(card: T, ticks: number): T {
    assertNonnegativeSafeInteger(ticks, "cooldown reduction ticks");
    const cooldown = Math.max(0, card.supply.cooldown - ticks);
    const supply = replaceIn(card.supply, ["cooldown"], cooldown);

    return supply === card.supply ? card : { ...card, supply };
}

export function setPaused<T extends Card>(card: T, paused: boolean): T {
    const supply = replaceIn(card.supply, ["paused"], paused);

    return supply === card.supply ? card : { ...card, supply };
}
