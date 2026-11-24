import type { Ref } from "../../../../common/ref.js";
import type { Contribution } from "../../../../common/contribution.js";
import { replaceIn } from "../../../../common/object.js";
import type { State as BattleState } from "../../../state.js";
import { get } from "../deck.js";
import { replace } from "../operations.js";
import type { Card, Policy } from "./card.js";
import type { Key } from "../../../../hook.js";
import { type Entry, set, remove } from "../../../../common/collection/entries.js";
import type { Restriction } from "./restriction.js";
import * as dp from "./dp/dp.js";
import type { Parameters as CostParameters } from "./dp/parameter.js";
import { resolve as resolveCostParameters } from "./dp/query.js";
import { enqueue } from "./supply/operations.js";
import { resolveCooldown, resolveStockLimit } from "./supply/query.js";

export function setState<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const self = get(battle, reference)!;

    return state === self.state ? battle : replace(battle, { ...self, state });
}

export function incrementCostStage(battle: BattleState, reference: Ref<Card<any>>): BattleState {
    const self: Card = get(battle, reference)!;

    return replace(battle, dp.incrementCostStage(self));
}

export function deploy<S extends object, P extends Policy>(
    card: Card<S, P>,
    count: number,
): Card<S, P> {
    const { supply } = card;
    const stock = supply.stock - count;
    const cooldown = card.policy === "DEFAULT" ? resolveCooldown(card) : supply.cooldown;

    return stock === supply.stock && cooldown === supply.cooldown
        ? card
        : { ...card, supply: { ...supply, stock, cooldown } };
}

export function recycle<S extends object, P extends Policy>(card: Card<S, P>): Card<S, P>;
export function recycle<S extends object>(card: Card<S>): Card<S> {
    const { supply } = card;

    switch (card.policy) {
        case "DEFAULT":
            return card;

        case "UNIQUE": {
            if (resolveCostParameters(card).increase) {
                card = dp.incrementCostStage(card);
            }

            const stock = Math.min(supply.stock + 1, resolveStockLimit(card) ?? Infinity);
            const cooldown = resolveCooldown(card);

            return stock === supply.stock && cooldown === supply.cooldown
                ? card
                : { ...card, supply: { ...supply, stock, cooldown } };
        }

        case "QUEUED":
            return enqueue(card);
    }
}

export function advance(battle: BattleState, reference: Ref<Card>): BattleState {
    const card = get(battle, reference)!;
    let next = card;

    if (!card.supply.paused) {
        const cooldown = Math.max(0, card.supply.cooldown - 1);
        if (cooldown === 0 && card.policy === "QUEUED" && card.supply.pending > 0) {
            const pending = card.supply.pending - 1;
            next = {
                ...card,
                supply: {
                    ...card.supply,
                    stock: card.supply.stock + 1,
                    pending,
                    cooldown: pending === 0 ? 0 : resolveCooldown(card),
                },
            };
        } else {
            next = replaceIn(card, ["supply", "cooldown"], cooldown);
        }
    }

    battle = replace(battle, next);

    return (
        (
            next.definition as {
                readonly onTick?: (battle: BattleState, self: Card) => BattleState;
            }
        ).onTick?.(battle, next) ?? battle
    );
}

export function setUnitHook<H extends Entry, Owner extends object>(
    battle: BattleState,
    reference: Ref<Card<any>>,
    key: Key<H, Owner>,
    entry: NoInfer<H>,
): BattleState {
    const self: Card = get(battle, reference)!;
    const unitHooks = self.unitHooks.set(key, entry);

    return unitHooks === self.unitHooks ? battle : replace(battle, { ...self, unitHooks });
}

export function removeUnitHook<H extends Entry, Owner extends object>(
    battle: BattleState,
    reference: Ref<Card<any>>,
    key: Key<H, Owner>,
    id: string,
): BattleState {
    const self: Card = get(battle, reference)!;
    const unitHooks = self.unitHooks.remove(key, id);

    return unitHooks === self.unitHooks ? battle : replace(battle, { ...self, unitHooks });
}

export function setRestriction(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<Restriction>,
): BattleState {
    const self: Card = get(battle, reference)!;
    const restrictions = set(self.restrictions, entry);

    return restrictions === self.restrictions ? battle : replace(battle, { ...self, restrictions });
}

export function removeRestriction(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    const self: Card = get(battle, reference)!;
    const restrictions = remove(self.restrictions, id);

    return restrictions === self.restrictions ? battle : replace(battle, { ...self, restrictions });
}

export function setCostContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<CostParameters>,
): BattleState {
    const self: Card = get(battle, reference)!;

    return replace(battle, dp.setCostContribution(self, entry));
}

export function removeCostContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    const self: Card = get(battle, reference)!;

    return replace(battle, dp.removeCostContribution(self, id));
}
