import { remove, set } from "../../../../../common/collection/entries.js";
import type { Contribution } from "../../../../../common/contribution.js";
import type { Modifier } from "../../../../../common/modifier.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Ref } from "../../../../../common/ref.js";
import type { State as BattleState } from "../../../../state.js";
import { replace } from "../../operations.js";
import type { Card } from "../card.js";
import { requireCard } from "../query.js";
import { resolveStockLimit } from "./query.js";

export type Policy =
    | { readonly type: "DEFAULT" }
    | { readonly type: "UNIQUE" }
    | { readonly type: "QUEUED"; readonly pending: number };

export interface Definition {
    readonly policy: Policy;
    readonly stock: number;
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly cooldown: number;
}

export interface State {
    readonly policy: Policy;
    readonly stock: number;
    readonly cooldown: number;
    readonly paused: boolean;
    readonly stockLimit: readonly Contribution<Modifier>[];
    readonly activeLimit: readonly Contribution<Modifier>[];
    readonly redeployTime: readonly Contribution<readonly Modifier[]>[];
}

export function setStockLimitContribution(
    battle: BattleState,
    reference: Ref<Card>,
    entry: Contribution<Modifier>,
): BattleState {
    const card = requireCard(battle, reference);

    return replaceStockLimit(battle, card, set(card.supply.stockLimit, entry));
}

export function removeStockLimitContribution(
    battle: BattleState,
    reference: Ref<Card>,
    id: string,
): BattleState {
    const card = requireCard(battle, reference);

    return replaceStockLimit(battle, card, remove(card.supply.stockLimit, id));
}

function replaceStockLimit(
    battle: BattleState,
    card: Card,
    stockLimit: State["stockLimit"],
): BattleState {
    if (stockLimit === card.supply.stockLimit) {
        return battle;
    }

    card = replaceIn(card, ["supply", "stockLimit"], stockLimit);
    const limit = resolveStockLimit(card) ?? Infinity;
    const { supply } = card;
    const { policy, stock } = supply;
    if (policy.type !== "QUEUED") {
        return replace(battle, replaceIn(card, ["supply", "stock"], Math.min(stock, limit)));
    }

    const pending = Math.min(policy.pending, limit);
    const emptied = pending === 0 && policy.pending > 0;

    return replace(battle, {
        ...card,
        supply: {
            ...supply,
            stock: Math.min(stock, limit - pending),
            policy: { ...policy, pending },
            cooldown: emptied ? 0 : supply.cooldown,
            paused: emptied ? false : supply.paused,
        },
    });
}

export function setActiveLimitContribution(
    battle: BattleState,
    reference: Ref<Card>,
    entry: Contribution<Modifier>,
): BattleState {
    const card = requireCard(battle, reference);

    return replace(
        battle,
        replaceIn(card, ["supply", "activeLimit"], set(card.supply.activeLimit, entry)),
    );
}

export function removeActiveLimitContribution(
    battle: BattleState,
    reference: Ref<Card>,
    id: string,
): BattleState {
    const card = requireCard(battle, reference);

    return replace(
        battle,
        replaceIn(card, ["supply", "activeLimit"], remove(card.supply.activeLimit, id)),
    );
}

export function setRedeployTimeContribution(
    battle: BattleState,
    reference: Ref<Card>,
    entry: Contribution<readonly Modifier[]>,
): BattleState {
    const card = requireCard(battle, reference);

    return replace(
        battle,
        replaceIn(card, ["supply", "redeployTime"], set(card.supply.redeployTime, entry)),
    );
}

export function removeRedeployTimeContribution(
    battle: BattleState,
    reference: Ref<Card>,
    id: string,
): BattleState {
    const card = requireCard(battle, reference);

    return replace(
        battle,
        replaceIn(card, ["supply", "redeployTime"], remove(card.supply.redeployTime, id)),
    );
}
