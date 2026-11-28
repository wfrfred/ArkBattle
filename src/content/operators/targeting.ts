import * as targeting from "../../core/battle/targeting/index.js";
import { all as allUnits, ref as unitRef, type Unit } from "../../core/unit/index.js";
import {
    hasTargetable,
    type Targetable,
} from "../../core/unit/capability/targetable/capability.js";
import type { Vitality } from "../../core/unit/capability/vitality/index.js";
import type { Classification } from "../../core/unit/capability/classification/index.js";
import { hasLayer, type Layer } from "../../core/unit/capability/layer/index.js";
import type { Occupancy } from "../../core/unit/capability/occupancy/index.js";
import { blockable, type Blocker } from "../../core/unit/capability/blocking/index.js";
import { fromTiles } from "../../core/geometry/range.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import { topK } from "../../core/common/collection/order.js";
import type { State as BattleState } from "../../core/battle/state.js";

export const inDefaultCategory = targeting.inCategories(["DEFAULT"]);

type Target = Unit & Targetable & Vitality & Classification & Layer;

export function groundTarget(battle: BattleState, self: Unit & Classification) {
    const eligible = targeting.damage(self)(battle);

    return (target: Unit): target is Target =>
        hasTargetable(target) &&
        eligible(target) &&
        hasLayer(target) &&
        target.layer.type === "GROUND";
}

export function inAttackRange(self: Unit & Occupancy, range: readonly TilePosition[]) {
    const { direction } = self.occupancy;

    return direction === null
        ? () => false
        : targeting.inRange(self.position, fromTiles(range, direction));
}

export function normalMeleeCandidates(
    battle: BattleState,
    self: Unit & Classification & Occupancy,
    range: readonly TilePosition[],
) {
    const withinRange = inAttackRange(self, range);

    return allUnits(battle)
        .filter(groundTarget(battle, self))
        .filter(
            (target) =>
                (inDefaultCategory(target) && withinRange(target)) ||
                (blockable.hasBlockable(target) && target.blockable.relation?.blocker === self.ref),
        );
}

export function selectNormalMeleeTarget(
    battle: BattleState,
    self: Unit & Classification & Occupancy & Blocker,
    range: readonly TilePosition[],
) {
    const blockedFirst = targeting.blockedFirst(self);
    const distance = targeting.distance(self.position);

    return topK(
        normalMeleeCandidates(battle, self, range),
        1,
        (left, right) => blockedFirst(left, right) || distance(left, right),
    ).map(unitRef);
}
