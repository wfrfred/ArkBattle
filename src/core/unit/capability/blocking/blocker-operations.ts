import type { State as BattleState } from "../../../battle/state.js";
import { update } from "../../../battle/unit.js";
import * as blocking from "../../../battle/blocking/operations.js";
import * as units from "../../query.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Rule } from "./rule.js";
import { DEFAULT_RADIUS, type Blocker, type State, type Layer, type Modifier } from "./blocker.js";

export function setRule(
    battle: BattleState,
    reference: Ref<Unit & Blocker>,
    rule: Rule,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    const rules = registry.set(unit.blocker.rules, rule);

    return rules === unit.blocker.rules
        ? battle
        : replace(battle, unit, { ...unit.blocker, rules });
}

export function removeRule(
    battle: BattleState,
    reference: Ref<Unit & Blocker>,
    id: string,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    const rules = registry.remove(unit.blocker.rules, id);

    return rules === unit.blocker.rules
        ? battle
        : replace(battle, unit, { ...unit.blocker, rules });
}

export function setCapacityContribution(
    battle: BattleState,
    reference: Ref<Unit & Blocker>,
    entry: contribution.Contribution<readonly Modifier[]>,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    const capacity = contribution.set(unit.blocker.capacity, entry);

    return capacity === unit.blocker.capacity
        ? battle
        : replace(battle, unit, { ...unit.blocker, capacity });
}

export function removeCapacityContribution(
    battle: BattleState,
    reference: Ref<Unit & Blocker>,
    id: string,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    const capacity = contribution.remove(unit.blocker.capacity, id);

    return capacity === unit.blocker.capacity
        ? battle
        : replace(battle, unit, { ...unit.blocker, capacity });
}

export function setLayer(
    battle: BattleState,
    reference: Ref<Unit & Blocker>,
    layer: Layer,
): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined || unit.blocker.layer === layer) {
        return battle;
    }

    const captured = unit.blocker.blocked.map((blocked) => ({ blocker: reference, blocked }));
    const next: Unit & Blocker = {
        ...unit,
        blocker: {
            ...unit.blocker,
            layer,
            radius: unit.definition.blocker.radius ?? DEFAULT_RADIUS[layer],
        },
    };

    return blocking.maintain(update(battle, blocking.releaseUpdates(battle, captured, [next])));
}

function replace(battle: BattleState, unit: Unit & Blocker, next: State): BattleState {
    return blocking.maintain(update(battle, [{ ...unit, blocker: next }]));
}
