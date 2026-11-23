import type { Ref } from "../../../../common/ref.js";
import { assertNonnegativeSafeInteger } from "../../../../common/assert.js";
import type { Contribution } from "../../../../common/contribution.js";
import type { Modifier } from "../../../../common/modifier.js";
import type { State as BattleState } from "../../../state.js";
import { get } from "../deck.js";
import { replace } from "../operations.js";
import type { Card } from "./card.js";
import type { Key } from "../../../../hook.js";
import { type Entry, set, remove } from "../../../../common/collection/entries.js";
import type { Restriction } from "./restriction.js";
import * as dp from "./dp.js";
import * as supply from "./supply.js";
import type { TimerTarget } from "./supply.js";

export function setState<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    state: NoInfer<T["state"]>,
): BattleState {
    const self = requireCard(battle, reference);

    return state === self.state ? battle : replace(battle, { ...self, state });
}

export function recharge(
    battle: BattleState,
    reference: Ref<Card<any>>,
    count: number,
): BattleState {
    assertNonnegativeSafeInteger(count, "card recharge count");
    const self = requireCard(battle, reference);

    return replace(battle, supply.recharge(self, count));
}

export function consume(battle: BattleState, reference: Ref<Card<any>>, count = 1): BattleState {
    assertNonnegativeSafeInteger(count, "card consumption count");
    const self = supply.advance(requireCard(battle, reference), battle.tick);
    if (count > self.supply.stock) {
        throw new RangeError("card stock is insufficient");
    }

    return replace(battle, supply.consume(self, count));
}

export function consumeForDeployment(battle: BattleState, self: Card, stock: number): BattleState {
    let next = supply.consume(self, stock);
    if (self.definition.supply.cooldownOnDeploy) {
        next = supply.advance(supply.startCooldown(next, battle.tick), battle.tick);
    }

    return replace(battle, next);
}

export function incrementCostStage(battle: BattleState, reference: Ref<Card<any>>): BattleState {
    return replace(battle, dp.incrementCostStage(requireCard(battle, reference)));
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

    return replace(
        battle,
        supply.advance(supply.startCooldown(self, battle.tick, durationTicks), battle.tick),
    );
}

export function enqueueRecovery(
    battle: BattleState,
    reference: Ref<Card<any>>,
    count = 1,
): BattleState {
    assertNonnegativeSafeInteger(count, "card recovery count");
    const self = supply.advance(requireCard(battle, reference), battle.tick);

    return replace(
        battle,
        supply.advance(supply.enqueueRecovery(self, battle.tick, count), battle.tick),
    );
}

export function recycle(battle: BattleState, reference: Ref<Card>): BattleState {
    const { definition } = requireCard(battle, reference);
    if (definition.dp.increaseCostOnRetreatOrDeath) {
        battle = incrementCostStage(battle, reference);
    }

    return definition.supply.recoverOnRetreatOrDeath ? enqueueRecovery(battle, reference) : battle;
}

export function reduceCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    ticks: number,
    target: TimerTarget,
): BattleState {
    assertNonnegativeSafeInteger(ticks, "cooldown reduction ticks");
    const self = supply.advance(requireCard(battle, reference), battle.tick);

    return replace(
        battle,
        supply.advance(supply.reduceCooldown(self, ticks, battle.tick, target), battle.tick),
    );
}

export function clearCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    target: TimerTarget,
): BattleState {
    const self = supply.advance(requireCard(battle, reference), battle.tick);

    return replace(
        battle,
        supply.advance(supply.clearCooldown(self, battle.tick, target), battle.tick),
    );
}

export function pauseCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    target: TimerTarget,
): BattleState {
    const self = supply.advance(requireCard(battle, reference), battle.tick);

    return replace(battle, supply.pauseCooldown(self, battle.tick, target));
}

export function resumeCooldown(
    battle: BattleState,
    reference: Ref<Card<any>>,
    target: TimerTarget,
): BattleState {
    const self = requireCard(battle, reference);

    return replace(
        battle,
        supply.advance(supply.resumeCooldown(self, battle.tick, target), battle.tick),
    );
}

export function setUnitHook<H extends Entry, Owner extends object>(
    battle: BattleState,
    reference: Ref<Card<any>>,
    key: Key<H, Owner>,
    entry: NoInfer<H>,
): BattleState {
    const self = requireCard(battle, reference);
    const unitHooks = self.unitHooks.set(key, entry);

    return unitHooks === self.unitHooks ? battle : replace(battle, { ...self, unitHooks });
}

export function removeUnitHook<H extends Entry, Owner extends object>(
    battle: BattleState,
    reference: Ref<Card<any>>,
    key: Key<H, Owner>,
    id: string,
): BattleState {
    const self = requireCard(battle, reference);
    const unitHooks = self.unitHooks.remove(key, id);

    return unitHooks === self.unitHooks ? battle : replace(battle, { ...self, unitHooks });
}

export function setRestriction(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<Restriction>,
): BattleState {
    const self = requireCard(battle, reference);
    const restrictions = set(self.restrictions, entry);

    return restrictions === self.restrictions ? battle : replace(battle, { ...self, restrictions });
}

export function removeRestriction(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    const self = requireCard(battle, reference);
    const restrictions = remove(self.restrictions, id);

    return restrictions === self.restrictions ? battle : replace(battle, { ...self, restrictions });
}

export function setCostContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<readonly Modifier[]>,
): BattleState {
    return replace(battle, dp.setCostContribution(requireCard(battle, reference), entry));
}

export function removeCostContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    return replace(battle, dp.removeCostContribution(requireCard(battle, reference), id));
}

export function setRedeployTimeContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    entry: Contribution<readonly Modifier[]>,
): BattleState {
    return replace(
        battle,
        supply.setRedeployTimeContribution(requireCard(battle, reference), entry),
    );
}

export function removeRedeployTimeContribution(
    battle: BattleState,
    reference: Ref<Card<any>>,
    id: string,
): BattleState {
    return replace(
        battle,
        supply.removeRedeployTimeContribution(requireCard(battle, reference), id),
    );
}

function requireCard<T extends Card<any>>(battle: BattleState, reference: Ref<T>): T {
    const self = get(battle, reference);
    if (self === undefined) {
        throw new RangeError(`unknown deployment card ${reference.id}`);
    }

    return self;
}
