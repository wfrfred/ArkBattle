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
    return units.get(battle, reference)?.blockable.blocker ?? undefined;
}

export function blocked(
    battle: BattleState,
    reference: Ref<Unit & Blocker>,
): readonly Ref<Unit & Blockable>[] {
    return units.get(battle, reference)?.blocker.blocked ?? [];
}

export function usedCapacity(battle: BattleState, reference: Ref<Unit & Blocker>): number {
    return blocked(battle, reference).reduce((used, target) => {
        const unit = units.get(battle, target);

        return unit === undefined
            ? used
            : used + resolveVolume(unit.definition.blockable, unit.blockable);
    }, 0);
}

export function relations(battle: BattleState, reference?: Ref<Unit>): readonly Relation[] {
    if (reference !== undefined) {
        const unit = units.get(battle, reference);
        if (unit === undefined) {
            return [];
        }
        if (hasBlocker(unit)) {
            const blocker = units.ref(unit);

            return unit.blocker.blocked.map((blocked) => ({ blocker, blocked }));
        }
        if (hasBlockable(unit) && unit.blockable.blocker !== null) {
            const blocker = unit.blockable.blocker;
            const blocked = units
                .get(battle, blocker)!
                .blocker.blocked.find((entry) => entry.id === unit.id)!;

            return [{ blocker, blocked }];
        }

        return [];
    }

    return units
        .all(battle)
        .filter(hasBlocker)
        .flatMap((unit) =>
            unit.blocker.blocked.map((target) => ({ blocker: units.ref(unit), blocked: target })),
        )
        .toArray();
}

export function hasRelation(battle: BattleState, relation: Relation): boolean {
    const owner = units.get(battle, relation.blocker);
    const target = units.get(battle, relation.blocked);

    return (
        owner !== undefined &&
        owner.blocker.blocked.includes(relation.blocked) &&
        target !== undefined &&
        target.blockable.blocker?.id === owner.id
    );
}
