import { assertNonnegativeSafeInteger } from "../../../../../common/assert.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Card, Policy } from "../card.js";
import { remaining, resolveCooldown } from "./query.js";

export function consume<S extends object, P extends Policy>(
    card: Card<S, P>,
    count = 1,
): Card<S, P> {
    assertNonnegativeSafeInteger(count, "card consumption count");
    const { stock } = card.supply;
    if (count > stock) {
        throw new RangeError("card stock is insufficient");
    }

    return count === 0 ? card : { ...card, supply: { ...card.supply, stock: stock - count } };
}

export function recharge<S extends object, P extends Policy>(
    card: Card<S, P>,
    count: number,
): Card<S, P> {
    assertNonnegativeSafeInteger(count, "card recharge count");
    const stock = card.supply.stock + Math.min(count, remaining(card) ?? Infinity);

    return stock === card.supply.stock ? card : { ...card, supply: { ...card.supply, stock } };
}

export function enqueue<S extends object>(card: Card<S, "QUEUED">, count = 1): Card<S, "QUEUED"> {
    assertNonnegativeSafeInteger(count, "card recovery count");
    const { pending } = card.supply;

    const added = Math.min(count, remaining(card) ?? Infinity);
    if (added === 0) {
        return card;
    }

    let next = replaceIn(card, ["supply", "pending"], pending + added);
    if (pending === 0) {
        next = replaceIn(next, ["supply", "cooldown"], resolveCooldown(card));
    }

    return next;
}

export function setCooldown<S extends object, P extends Policy>(
    card: Card<S, P>,
    ticks: number,
): Card<S, P> {
    assertNonnegativeSafeInteger(ticks, "cooldown ticks");

    return ticks === card.supply.cooldown
        ? card
        : { ...card, supply: { ...card.supply, cooldown: ticks } };
}

export function reduceCooldown<S extends object, P extends Policy>(
    card: Card<S, P>,
    ticks: number,
): Card<S, P> {
    assertNonnegativeSafeInteger(ticks, "cooldown reduction ticks");
    const cooldown = Math.max(0, card.supply.cooldown - ticks);

    return cooldown === card.supply.cooldown
        ? card
        : { ...card, supply: { ...card.supply, cooldown } };
}

export function setPaused<S extends object, P extends Policy>(
    card: Card<S, P>,
    paused: boolean,
): Card<S, P> {
    return paused === card.supply.paused ? card : { ...card, supply: { ...card.supply, paused } };
}
