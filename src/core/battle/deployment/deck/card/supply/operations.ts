import { assertNonnegativeSafeInteger } from "../../../../../common/assert.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Card } from "../card.js";
import { remaining, resolveCooldown } from "./query.js";

export function consume<S extends object>(card: Card<S>, count = 1): Card<S> {
    assertNonnegativeSafeInteger(count, "card consumption count");
    const { stock } = card.supply;
    if (count > stock) {
        throw new RangeError("card stock is insufficient");
    }

    return replaceIn(card, ["supply", "stock"], stock - count);
}

export function recharge<S extends object>(card: Card<S>, count: number): Card<S> {
    assertNonnegativeSafeInteger(count, "card recharge count");
    const stock = card.supply.stock + Math.min(count, remaining(card) ?? Infinity);

    return replaceIn(card, ["supply", "stock"], stock);
}

export function enqueue<S extends object>(card: Card<S>, count = 1): Card<S> {
    assertNonnegativeSafeInteger(count, "card recovery count");
    const { policy } = card.supply;
    if (policy.type !== "QUEUED") {
        throw new TypeError("card recovery queue requires the QUEUED policy");
    }

    const added = Math.min(count, remaining(card) ?? Infinity);
    if (added === 0) {
        return card;
    }

    let next = replaceIn(card, ["supply", "policy"], {
        ...policy,
        pending: policy.pending + added,
    });
    if (policy.pending === 0) {
        next = replaceIn(next, ["supply", "cooldown"], resolveCooldown(card));
    }

    return next;
}

export function setCooldown<S extends object>(card: Card<S>, ticks: number): Card<S> {
    assertNonnegativeSafeInteger(ticks, "cooldown ticks");

    return replaceIn(card, ["supply", "cooldown"], ticks);
}

export function reduceCooldown<S extends object>(card: Card<S>, ticks: number): Card<S> {
    assertNonnegativeSafeInteger(ticks, "cooldown reduction ticks");
    const cooldown = Math.max(0, card.supply.cooldown - ticks);

    return replaceIn(card, ["supply", "cooldown"], cooldown);
}

export function setPaused<S extends object>(card: Card<S>, paused: boolean): Card<S> {
    return replaceIn(card, ["supply", "paused"], paused);
}
