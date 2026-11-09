import { Vec2 } from "../../common/vector.js";

import type { WorldPosition } from "../../geometry/coordinate.js";
import type { Unit } from "../../unit/unit.js";
import { resolveMaxHp, type Vitality } from "../../unit/capability/vitality/capability.js";
import { hasBlocker, type Blocker } from "../../unit/capability/blocking/blocker.js";
import { hasBlockable, type Blockable } from "../../unit/capability/blocking/blockable.js";
import { resolveTaunt, type Targetable } from "../../unit/capability/targetable/capability.js";
import type { State as BattleState } from "../state.js";

export function distance(origin: WorldPosition): (left: Unit, right: Unit) => number {
    return (left, right) =>
        Vec2.distanceSquared(origin, left.position) - Vec2.distanceSquared(origin, right.position);
}

export function hpRatio(left: Unit & Vitality, right: Unit & Vitality): number {
    const leftRatio = left.vitality.hp / resolveMaxHp(left.definition.vitality, left.vitality);
    const rightRatio = right.vitality.hp / resolveMaxHp(right.definition.vitality, right.vitality);

    return leftRatio - rightRatio;
}

export function taunt(
    battle: BattleState,
): (left: Unit & Targetable, right: Unit & Targetable) => number {
    return (left, right) => resolveTaunt(battle, right) - resolveTaunt(battle, left);
}

export function blockedFirst(
    source: Unit & (Blocker | Blockable),
): (left: Unit, right: Unit) => number {
    const order = (id: number) => {
        if (hasBlockable(source) && source.blockable.relation?.blocker.id === id) {
            return 0;
        }

        const index = hasBlocker(source)
            ? source.blocker.relations.findIndex((relation) => relation.blocked.id === id)
            : -1;

        return index < 0 ? -1 : index + 1;
    };

    return (left, right) => {
        const leftOrder = order(left.id);
        const rightOrder = order(right.id);

        if (leftOrder < 0) {
            return rightOrder < 0 ? 0 : 1;
        }
        if (rightOrder < 0) {
            return -1;
        }

        return leftOrder - rightOrder;
    };
}
