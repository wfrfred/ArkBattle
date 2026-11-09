import { create as createAttack, type Attack } from "../../actions/attack.js";
import * as targeting from "../../../core/battle/targeting/index.js";
import * as units from "../../../core/unit/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import { hasAllegiance } from "../../../core/unit/capability/allegiance/capability.js";
import { hasBlockable, hasBlocker } from "../../../core/unit/capability/blocking/index.js";
import { hasDirection } from "../../../core/unit/capability/occupancy/index.js";
import { hasLayer } from "../../../core/unit/capability/layer/index.js";
import { fromTiles } from "../../../core/geometry/range.js";
import { topK } from "../../../core/common/collection.js";

import type { Profile } from "../../../data/arknights/operator.js";
import { secondsToTicks } from "../../../data/arknights/tick.js";

export function create(profile: Profile): Attack {
    return createAttack({
        id: "normal-attack",
        speed: profile.attributes.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: secondsToTicks(profile.attributes.baseAttackTime),
        recoveryTicks: 0,
        followUps: [],
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined || !hasAllegiance(self)) {
                        return { state: battle, value: [] };
                    }

                    const withinRange = hasDirection(self)
                        ? targeting.inRange(
                              self.position,
                              fromTiles(profile.range, self.occupancy.direction),
                          )
                        : () => false;
                    const candidates = units
                        .all(battle)
                        .filter(hasTargetable)
                        .filter(targeting.damage(battle, self))
                        .filter((target) => hasLayer(target) && target.layer.type === "GROUND")
                        .filter(
                            (target) =>
                                withinRange(target) ||
                                (hasBlockable(target) &&
                                    target.blockable.relation?.blocker.id === self.id),
                        );
                    const blockedFirst = hasBlocker(self) ? targeting.blockedFirst(self) : () => 0;
                    const distance = targeting.distance(self.position);

                    return {
                        state: battle,
                        value: topK(
                            candidates,
                            1,
                            (left, right) => blockedFirst(left, right) || distance(left, right),
                        ).map(units.ref),
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        power: profile.attributes.attack,
                        powerSource: "SOURCE_ATTACK",
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
    });
}
