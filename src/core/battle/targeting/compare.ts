import { Vec2 } from "../../common/vector.js";
import { ref, type Ref } from "../../common/ref.js";

import type { WorldPosition } from "../../geometry/coordinate.js";
import type { Unit } from "../../unit/unit.js";
import type { Vitality } from "../../unit/capability/vitality/capability.js";
import * as vitality from "../../unit/capability/vitality/query.js";
import { hasBlocker, type Blocker } from "../../unit/capability/blocking/blocker/blocker.js";
import {
    hasBlockable,
    type Blockable,
} from "../../unit/capability/blocking/blockable/blockable.js";
import { resolveTaunt, type Targetable } from "../../unit/capability/targetable/capability.js";
import type { State as BattleState } from "../state.js";

export function distance(origin: WorldPosition): (left: Unit, right: Unit) => number {
    return (left, right) =>
        Vec2.distanceSquared(origin, left.position) - Vec2.distanceSquared(origin, right.position);
}

export function hpRatio(left: Unit & Vitality, right: Unit & Vitality): number {
    return vitality.hpRatio(left) - vitality.hpRatio(right);
}

export function taunt(
    battle: BattleState,
): (left: Unit & Targetable, right: Unit & Targetable) => number {
    return (left, right) => resolveTaunt(battle, right) - resolveTaunt(battle, left);
}

export function blockedFirst(
    source: Unit & (Blocker | Blockable),
): (left: Unit, right: Unit) => number {
    const order = (reference: Ref<Unit>) => {
        if (hasBlockable(source) && source.blockable.relation?.blocker === reference) {
            return 0;
        }

        const index = hasBlocker(source)
            ? source.blocker.relations.findIndex((relation) => relation.blocked === reference)
            : -1;

        return index < 0 ? -1 : index + 1;
    };

    return (left, right) => {
        const leftOrder = order(ref(left));
        const rightOrder = order(ref(right));

        if (leftOrder < 0) {
            return rightOrder < 0 ? 0 : 1;
        }
        if (rightOrder < 0) {
            return -1;
        }

        return leftOrder - rightOrder;
    };
}
