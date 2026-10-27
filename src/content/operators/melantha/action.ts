import { create as createAttack, type Attack } from "../../actions/attack.js";
import * as filters from "../../../core/battle/targeting/filter.js";
import * as compare from "../../../core/battle/targeting/compare.js";
import { first } from "../../../core/battle/targeting/selector.js";
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
                    filter: filters.and(
                        filters.damage,
                        filters.ground,
                        filters.or(
                            filters.range(fromTiles(profile.range, direction)),
                            filters.blocking,
                        ),
                    ),
                    selector: first(1, compare.combine(compare.blockedFirst, compare.distance)),
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
