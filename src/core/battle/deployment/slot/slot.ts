import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import * as entries from "../../../common/collection/entries.js";
import type { Contribution } from "../../../common/contribution.js";
import type { Modifier } from "../../../common/modifier.js";
import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";

export interface Definition {
    readonly limit: number | null;
}

export interface Pending {
    readonly amount: number;
    readonly atTick: number;
}

export interface State {
    readonly definition: Definition;
    readonly limit: readonly Contribution<Modifier>[];
    readonly used: number;
    readonly pending: readonly Pending[];
}

export function initialize(definition: Definition): State {
    if (definition.limit !== null) {
        assertNonnegativeSafeInteger(definition.limit, "deployment slot limit");
    }

    return { definition, limit: [], used: 0, pending: [] };
}

export function setLimitContribution(
    battle: BattleState,
    entry: Contribution<Modifier>,
): BattleState {
    const { slot } = battle.deployment;

    return replaceIn(battle, ["deployment", "slot", "limit"], entries.set(slot.limit, entry));
}

export function removeLimitContribution(battle: BattleState, id: string): BattleState {
    const { slot } = battle.deployment;

    return replaceIn(battle, ["deployment", "slot", "limit"], entries.remove(slot.limit, id));
}
