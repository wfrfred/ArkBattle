import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../state.js";
import type { Unit } from "../../unit/unit.js";
import * as units from "../../unit/query.js";
import { hasBlocker, type Blocker } from "../../unit/capability/blocking/blocker/blocker.js";
import {
    hasBlockable,
    resolveVolume,
    type Blockable,
} from "../../unit/capability/blocking/blockable/blockable.js";
import type { Relation } from "../../unit/capability/blocking/contract.js";

export function blockerOf(
    battle: BattleState,
    reference: Ref<Unit & Blockable>,
): Ref<Unit & Blocker> | undefined {
    return reference.get(battle)?.blockable.relation?.blocker;
}

export function blocked(
    battle: BattleState,
    reference: Ref<Unit & Blocker>,
): readonly Ref<Unit & Blockable>[] {
    return reference.get(battle)?.blocker.relations.map((relation) => relation.blocked) ?? [];
}

export function usedCapacity(battle: BattleState, reference: Ref<Unit & Blocker>): number {
    return (reference.get(battle)?.blocker.relations ?? []).reduce((used, relation) => {
        const unit = relation.blocked.get(battle)!;

        return used + resolveVolume(unit.definition.blockable, unit.blockable);
    }, 0);
}

export function relations(battle: BattleState, reference?: Ref<Unit>): readonly Relation[] {
    if (reference !== undefined) {
        const unit = reference.get(battle);
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
    const owner = relation.blocker.get(battle);
    const target = relation.blocked.get(battle);

    return (
        owner !== undefined &&
        owner.blocker.relations.includes(relation) &&
        target?.blockable.relation === relation
    );
}
