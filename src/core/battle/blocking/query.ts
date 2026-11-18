import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../state.js";
import type { Unit } from "../../unit/unit.js";
import * as units from "../../unit/query.js";
import { hasBlocker, type Blocker } from "../../unit/capability/blocking/blocker.js";
import {
    hasBlockable,
    resolveVolume,
    type Blockable,
} from "../../unit/capability/blocking/blockable.js";
import type { Relation } from "../../unit/capability/blocking/contract.js";

export function blockerOf(
    battle: BattleState,
    reference: Ref<Unit & Blockable>,
): Ref<Unit & Blocker> | undefined {
    return units.get(battle, reference)?.blockable.relation?.blocker;
}

export function blocked(
    battle: BattleState,
    reference: Ref<Unit & Blocker>,
): readonly Ref<Unit & Blockable>[] {
    return (
        units.get(battle, reference)?.blocker.relations.map((relation) => relation.blocked) ?? []
    );
}

export function usedCapacity(battle: BattleState, reference: Ref<Unit & Blocker>): number {
    return (units.get(battle, reference)?.blocker.relations ?? []).reduce((used, relation) => {
        const unit = units.get(battle, relation.blocked)!;

        return used + resolveVolume(unit.definition.blockable, unit.blockable);
    }, 0);
}

export function relations(battle: BattleState, reference?: Ref<Unit>): readonly Relation[] {
    if (reference !== undefined) {
        const unit = units.get(battle, reference);
        if (unit === undefined) {
            return [];
        }
        if (hasBlocker(unit)) {
            return unit.blocker.relations;
        }
        if (hasBlockable(unit) && unit.blockable.relation !== null) {
            return [unit.blockable.relation];
        }

        return [];
    }

    return units
        .all(battle)
        .filter(hasBlocker)
        .flatMap((unit) => unit.blocker.relations)
        .toArray();
}

export function hasRelation(battle: BattleState, relation: Relation): boolean {
    const owner = units.get(battle, relation.blocker);
    const target = units.get(battle, relation.blocked);

    return (
        owner !== undefined &&
        owner.blocker.relations.includes(relation) &&
        target?.blockable.relation === relation
    );
}
