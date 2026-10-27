import { create as createAttack, type Attack } from "../../actions/attack.js";
import * as targeting from "../../../core/battle/targeting/index.js";
import { first } from "../../../core/battle/targeting/index.js";

import type { Direction } from "../../../core/geometry/direction.js";
import { fromTiles } from "../../../core/geometry/range.js";
import type { Profile } from "../../../data/arknights/operator.js";
import { secondsToTicks } from "../../../data/arknights/tick.js";

export function create(profile: Profile, direction: Direction): Attack {
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
                targeting: {
                    purposes: ["DAMAGE"],
                    filter: targeting.and(
                        targeting.damage,
                        targeting.ground,
                        targeting.or(
                            targeting.range(fromTiles(profile.range, direction)),
                            targeting.blocking,
                        ),
                    ),
                    selector: first(
                        1,
                        targeting.combine(targeting.blockedFirst, targeting.distance),
                    ),
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
