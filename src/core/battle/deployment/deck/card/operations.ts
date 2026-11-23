import type { Ref } from "../../../../common/ref.js";
import type { Contribution } from "../../../../common/contribution.js";
import type { Modifier } from "../../../../common/modifier.js";
import { replaceIn } from "../../../../common/object.js";
import type { State as BattleState } from "../../../state.js";
import { get } from "../deck.js";
import { replace } from "../operations.js";
import type { Card } from "./card.js";
import type { Key } from "../../../../hook.js";
import { type Entry, set, remove } from "../../../../common/collection/entries.js";
import type { Restriction } from "./restriction.js";
import * as dp from "./dp.js";
import { enqueue } from "./supply/operations.js";
import { resolveCooldown, resolveStockLimit } from "./supply/query.js";

export function setState<T extends Card>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const self = get(battle, reference)!;

    return state === self.state ? battle : replace(battle, { ...self, state });
}

export function incrementCostStage(battle: BattleState, reference: Ref<Card>): BattleState {
    return replace(battle, dp.incrementCostStage(get(battle, reference)!));
}

export function deploy<T extends Card>(card: T, count: number): T {
    const { supply } = card;
    const stock = supply.stock - count;
    const cooldown = supply.policy.type === "DEFAULT" ? resolveCooldown(card) : supply.cooldown;

    return stock === supply.stock && cooldown === supply.cooldown
        ? card
        : { ...card, supply: { ...supply, stock, cooldown } };
}

export function recycle<T extends Card>(card: T): T {
    if (card.definition.dp.increaseCostOnRetreatOrDeath) {
        card = dp.incrementCostStage(card);
    }

    const { supply } = card;

    switch (supply.policy.type) {
        case "DEFAULT":
            return card;

        case "UNIQUE": {
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
    const { supply } = card;
    let next = card;

    if (!supply.paused) {
        const cooldown = Math.max(0, supply.cooldown - 1);
        const { policy } = supply;
        if (cooldown === 0 && policy.type === "QUEUED" && policy.pending > 0) {
            const pending = policy.pending - 1;
            next = {
                ...card,
                supply: {
                    ...supply,
                    stock: supply.stock + 1,
                    policy: { ...policy, pending },
                    cooldown: pending === 0 ? 0 : resolveCooldown(card),
                },
            };
        } else {
            next = replaceIn(card, ["supply", "cooldown"], cooldown);
        }
    }

    battle = replace(battle, next);

    return next.definition.onTick?.(battle, next) ?? battle;
}

export function setUnitHook<H extends Entry, Owner extends object>(
    battle: BattleState,
    reference: Ref<Card>,
    key: Key<H, Owner>,
    entry: NoInfer<H>,
): BattleState {
    const self = get(battle, reference)!;
    const unitHooks = self.unitHooks.set(key, entry);

    return unitHooks === self.unitHooks ? battle : replace(battle, { ...self, unitHooks });
}

export function removeUnitHook<H extends Entry, Owner extends object>(
    battle: BattleState,
    reference: Ref<Card>,
    key: Key<H, Owner>,
    id: string,
): BattleState {
    const self = get(battle, reference)!;
    const unitHooks = self.unitHooks.remove(key, id);

    return unitHooks === self.unitHooks ? battle : replace(battle, { ...self, unitHooks });
}

export function setRestriction(
    battle: BattleState,
    reference: Ref<Card>,
    entry: Contribution<Restriction>,
): BattleState {
    const self = get(battle, reference)!;
    const restrictions = set(self.restrictions, entry);

    return restrictions === self.restrictions ? battle : replace(battle, { ...self, restrictions });
}

export function removeRestriction(
    battle: BattleState,
    reference: Ref<Card>,
    id: string,
): BattleState {
    const self = get(battle, reference)!;
    const restrictions = remove(self.restrictions, id);

    return restrictions === self.restrictions ? battle : replace(battle, { ...self, restrictions });
}

export function setCostContribution(
    battle: BattleState,
    reference: Ref<Card>,
    entry: Contribution<readonly Modifier[]>,
): BattleState {
    return replace(battle, dp.setCostContribution(get(battle, reference)!, entry));
}

export function removeCostContribution(
    battle: BattleState,
    reference: Ref<Card>,
    id: string,
): BattleState {
    return replace(battle, dp.removeCostContribution(get(battle, reference)!, id));
}
