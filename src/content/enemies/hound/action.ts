import { create as createAttack, type Attack } from "../../actions/attack.js";
import type { Profile } from "../../../data/arknights/enemy.js";
import { secondsToTicks } from "../../../data/arknights/tick.js";
import * as filters from "../../../core/battle/targeting/filter.js";
import * as compare from "../../../core/battle/targeting/compare.js";
import { first } from "../../../core/battle/targeting/selector.js";

export interface Timing {
    readonly windupTicks: number;
    readonly recoveryTicks: number;
}

export function create(profile: Profile, timing: Timing): Attack {
    return createAttack({
        id: "normal-attack",
        speed: profile.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: secondsToTicks(profile.baseAttackTime),
        windupTicks: timing.windupTicks,
        recoveryTicks: timing.recoveryTicks,
        targetGroups: [
            {
                id: "primary",
                targeting: {
                    purposes: ["DAMAGE"],
                    filter: filters.and(
                        filters.present,
                        filters.alive,
                        filters.hostile,
                        filters.blocker,
                    ),
                    selector: first(1, compare.combine(compare.blockedFirst, compare.distance)),
                },
                operations: [
                    {
                        type: "DAMAGE",
                        power: profile.attack,
                        powerSource: "SOURCE_ATTACK",
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
        followUps: [],
    });
}
