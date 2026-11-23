import { assertNonnegativeSafeInteger } from "../../../../../common/assert.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Ref } from "../../../../../common/ref.js";
import type { State as BattleState } from "../../../../state.js";
import { replace } from "../../operations.js";
import type { Card } from "../card.js";
import { requireCard } from "../query.js";
import { resolveCooldown, resolveStockLimit } from "./query.js";

export function consume(battle: BattleState, reference: Ref<Card<any>>, count = 1): BattleState {
    assertNonnegativeSafeInteger(count, "card consumption count");
    const card = requireCard(battle, reference);
    const { stock } = card.supply;
    if (count > stock) {
        throw new RangeError("card stock is insufficient");
    }

    return replace(battle, replaceIn(card, ["supply", "stock"], stock - count));
}

export function consumeForDeployment(
    battle: BattleState,
    reference: Ref<Card<any>>,
    count: number,
): BattleState {
    const card = requireCard(battle, reference);
    const { supply } = card;
    const stock = supply.stock - count;
    const cooldown = supply.policy.type === "DEFAULT" ? resolveCooldown(card) : supply.cooldown;

    return stock === supply.stock && cooldown === supply.cooldown
        ? battle
        : replace(battle, { ...card, supply: { ...supply, stock, cooldown } });
}

export function recycle(battle: BattleState, reference: Ref<Card>): BattleState {
    const card = requireCard(battle, reference);
    const { supply } = card;

    switch (supply.policy.type) {
        case "DEFAULT":
            return battle;

        case "UNIQUE": {
            const stock = supply.stock + Math.min(1, remainingStockCapacity(card));
            const cooldown = resolveCooldown(card);

            return stock === supply.stock && cooldown === supply.cooldown
                ? battle
                : replace(battle, { ...card, supply: { ...supply, stock, cooldown } });
        }

        case "QUEUED":
            return enqueueRecovery(battle, reference, 1);
    }
}

export function recharge(
    battle: BattleState,
    reference: Ref<Card<any>>,
    count: number,
): BattleState {
    assertNonnegativeSafeInteger(count, "card recharge count");
    const card = requireCard(battle, reference);
    const stock = card.supply.stock + Math.min(count, remainingStockCapacity(card));

    return replace(battle, replaceIn(card, ["supply", "stock"], stock));
}

export function enqueueRecovery(
    battle: BattleState,
    reference: Ref<Card<any>>,
    count = 1,
): BattleState {
    assertNonnegativeSafeInteger(count, "card recovery count");
    const card = requireCard(battle, reference);
    const { supply } = card;
    const { policy } = supply;
    if (policy.type !== "QUEUED") {
        throw new TypeError("card recovery queue requires the QUEUED policy");
    }

    const added = Math.min(count, remainingStockCapacity(card));
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

function remainingStockCapacity(card: Card<any>): number {
    const { policy, stock } = card.supply;
    const pending = policy.type === "QUEUED" ? policy.pending : 0;

    return (resolveStockLimit(card) ?? Infinity) - stock - pending;
}

export function setCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    ticks: number,
): BattleState {
    assertNonnegativeSafeInteger(ticks, "cooldown ticks");
    const card = requireCard(battle, reference);

    return replace(battle, replaceIn(card, ["supply", "cooldown"], ticks));
}

export function reduceCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    ticks: number,
): BattleState {
    assertNonnegativeSafeInteger(ticks, "cooldown reduction ticks");
    const card = requireCard(battle, reference);
    const cooldown = Math.max(0, card.supply.cooldown - ticks);

    return replace(battle, replaceIn(card, ["supply", "cooldown"], cooldown));
}

export function setPaused(
    battle: BattleState,
    reference: Ref<Card<any>>,
    paused: boolean,
): BattleState {
    const card = requireCard(battle, reference);

    return replace(battle, replaceIn(card, ["supply", "paused"], paused));
}

export function advance(battle: BattleState, reference: Ref<Card>): BattleState {
    const card = requireCard(battle, reference);
    const { supply } = card;
    if (supply.paused) {
        return battle;
    }

    const cooldown = Math.max(0, supply.cooldown - 1);
    const { policy } = supply;
    if (cooldown > 0 || policy.type !== "QUEUED" || policy.pending === 0) {
        return replace(battle, replaceIn(card, ["supply", "cooldown"], cooldown));
    }

    const pending = policy.pending - 1;

    return replace(battle, {
        ...card,
        supply: {
            ...supply,
            stock: supply.stock + 1,
            policy: { ...policy, pending },
            cooldown: pending === 0 ? 0 : resolveCooldown(card),
        },
    });
}
