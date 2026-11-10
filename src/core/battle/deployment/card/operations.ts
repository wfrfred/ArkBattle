import type { Ref } from "../../../common/ref.js";
import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { Contribution } from "../../../unit/contribution/contribution.js";
import type { Modifier } from "../../../unit/contribution/attribute.js";
import type { State as BattleState } from "../../state.js";
import { replaceCard } from "../resources.js";
import type { Card, TimerTarget } from "./card.js";
import type { Key } from "../../../hook.js";
import { type Entry, set, remove } from "../../../common/collection/entries.js";
import type { Rule } from "./rule.js";
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

export function consume(battle: BattleState, reference: Ref<Card<any>>, count = 1): BattleState {
    assertNonnegativeSafeInteger(count, "card consumption count");
    const self = card.advance(requireCard(battle, reference), battle.tick);
    if (count > self.stock) {
        throw new RangeError("card stock is insufficient");
    }

    return replaceCard(battle, card.consume(self, count));
}

export function incrementCostStage(battle: BattleState, reference: Ref<Card<any>>): BattleState {
    return replaceCard(battle, card.incrementCostStage(requireCard(battle, reference)));
}

export function startCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    durationTicks?: number,
): BattleState {
    if (durationTicks !== undefined) {
        assertNonnegativeSafeInteger(durationTicks, "cooldown duration ticks");
    }

    const self = requireCard(battle, reference);

    return replaceCard(
        battle,
        card.advance(card.startCooldown(self, battle.tick, durationTicks), battle.tick),
    );
}

export function enqueueRecovery(
    battle: BattleState,
    reference: Ref<Card<any>>,
    count = 1,
): BattleState {
    assertNonnegativeSafeInteger(count, "card recovery count");
    const self = card.advance(requireCard(battle, reference), battle.tick);

    return replaceCard(
        battle,
        card.advance(card.enqueueRecovery(self, battle.tick, count), battle.tick),
    );
}

export function reduceCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    ticks: number,
    target: TimerTarget,
): BattleState {
    assertNonnegativeSafeInteger(ticks, "cooldown reduction ticks");
    const self = card.advance(requireCard(battle, reference), battle.tick);

    return replaceCard(
        battle,
        card.advance(card.reduceCooldown(self, ticks, battle.tick, target), battle.tick),
    );
}

export function clearCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    target: TimerTarget,
): BattleState {
    const self = card.advance(requireCard(battle, reference), battle.tick);

    return replaceCard(
        battle,
        card.advance(card.clearCooldown(self, battle.tick, target), battle.tick),
    );
}

export function pauseCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    target: TimerTarget,
): BattleState {
    const self = card.advance(requireCard(battle, reference), battle.tick);

    return replaceCard(battle, card.pauseCooldown(self, battle.tick, target));
}

export function resumeCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    target: TimerTarget,
): BattleState {
    const self = requireCard(battle, reference);

    return replaceCard(
        battle,
        card.advance(card.resumeCooldown(self, battle.tick, target), battle.tick),
    );
}

export function setUnitHook<H extends Entry>(
    battle: BattleState,
    reference: Ref<Card<any>>,
    key: Key<H>,
    entry: NoInfer<H>,
): BattleState {
    const self = requireCard(battle, reference);
    const unitHooks = self.unitHooks.set(key, entry);

    return unitHooks === self.unitHooks ? battle : replaceCard(battle, { ...self, unitHooks });
}

export function removeUnitHook<H extends Entry>(
    battle: BattleState,
    reference: Ref<Card<any>>,
    key: Key<H>,
    id: string,
): BattleState {
    const self = requireCard(battle, reference);
    const unitHooks = self.unitHooks.remove(key, id);

    return unitHooks === self.unitHooks ? battle : replaceCard(battle, { ...self, unitHooks });
}

export function setRule(battle: BattleState, reference: Ref<Card<any>>, entry: Rule): BattleState {
    const self = requireCard(battle, reference);
    const rules = set(self.rules, entry);

    return rules === self.rules ? battle : replaceCard(battle, { ...self, rules });
}

export function removeRule(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    const self = requireCard(battle, reference);
    const rules = remove(self.rules, id);

    return rules === self.rules ? battle : replaceCard(battle, { ...self, rules });
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
