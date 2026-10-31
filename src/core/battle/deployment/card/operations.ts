import type { Ref } from "../../../common/ref.js";
import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { Contribution } from "../../../unit/contribution/contribution.js";
import type { Modifier } from "../../../unit/contribution/attribute.js";
import type { State as BattleState } from "../../state.js";
import { replaceCard } from "../resources.js";
import type { Card } from "./card.js";
import { get } from "./query.js";
import * as card from "./state.js";

export function setState<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const self = requireCard(battle, reference);

    return state === self.state ? battle : replaceCard(battle, { ...self, state });
}

export function recharge(
    battle: BattleState,
    reference: Ref<Card<any>>,
    count: number,
): BattleState {
    assertNonnegativeSafeInteger(count, "card recharge count");
    const self = requireCard(battle, reference);

    return replaceCard(battle, card.recharge(self, count));
}

export function reduceCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    ticks: number,
): BattleState {
    assertNonnegativeSafeInteger(ticks, "cooldown reduction ticks");
    const self = card.advance(requireCard(battle, reference), battle.tick);

    return replaceCard(
        battle,
        card.advance(card.reduceCooldown(self, ticks, battle.tick), battle.tick),
    );
}

export function clearCooldown(battle: BattleState, reference: Ref<Card<any>>): BattleState {
    const self = card.advance(requireCard(battle, reference), battle.tick);
    if (self.cooldown === null) {
        return replaceCard(battle, self);
    }

    return replaceCard(
        battle,
        card.advance(
            { ...self, cooldown: { ...self.cooldown, readyAtTick: battle.tick } },
            battle.tick,
        ),
    );
}

export function setCostContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<readonly Modifier[]>,
): BattleState {
    return replaceCard(battle, card.setCostContribution(requireCard(battle, reference), entry));
}

export function removeCostContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    return replaceCard(battle, card.removeCostContribution(requireCard(battle, reference), id));
}

export function setRedeployTimeContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<readonly Modifier[]>,
): BattleState {
    return replaceCard(
        battle,
        card.setRedeployTimeContribution(requireCard(battle, reference), entry),
    );
}

export function removeRedeployTimeContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    return replaceCard(
        battle,
        card.removeRedeployTimeContribution(requireCard(battle, reference), id),
    );
}

function requireCard<T extends Card<any>>(battle: BattleState, reference: Ref<T>): T {
    const self = get(battle, reference);
    if (self === undefined) {
        throw new RangeError(`unknown deployment card ${reference.id}`);
    }

    return self;
}
