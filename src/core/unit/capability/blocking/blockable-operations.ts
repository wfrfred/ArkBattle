import type { State as BattleState } from "../../../battle/state.js";
import { update } from "../../../battle/unit.js";
import * as blocking from "../../../battle/blocking/operations.js";
import * as units from "../../query.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Rule } from "./rule.js";
import { assertSafeInteger } from "../../../common/assert.js";
import type { Blockable, State } from "./blockable.js";

export function setRule(
    battle: BattleState,
    reference: Ref<Unit & Blockable>,
    rule: Rule,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    const rules = registry.set(unit.blockable.rules, rule);

    return rules === unit.blockable.rules
        ? battle
        : replace(battle, unit, { ...unit.blockable, rules });
}

export function removeRule(
    battle: BattleState,
    reference: Ref<Unit & Blockable>,
    id: string,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    const rules = registry.remove(unit.blockable.rules, id);

    return rules === unit.blockable.rules
        ? battle
        : replace(battle, unit, { ...unit.blockable, rules });
}

export function setVolumeContribution(
    battle: BattleState,
    reference: Ref<Unit & Blockable>,
    entry: contribution.Contribution<number>,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    assertSafeInteger(entry.value, "blocking volume addition");

    const volume = contribution.set(unit.blockable.volume, entry);

    return volume === unit.blockable.volume
        ? battle
        : replace(battle, unit, { ...unit.blockable, volume });
}

export function removeVolumeContribution(
    battle: BattleState,
    reference: Ref<Unit & Blockable>,
    id: string,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    const volume = contribution.remove(unit.blockable.volume, id);

    return volume === unit.blockable.volume
        ? battle
        : replace(battle, unit, { ...unit.blockable, volume });
}

function replace(battle: BattleState, unit: Unit & Blockable, next: State): BattleState {
    return blocking.maintain(update(battle, [{ ...unit, blockable: next }]));
}
