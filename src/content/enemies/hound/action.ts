import { create as createAttack, type Attack } from "../../actions/attack.js";
import type { Profile } from "../../../data/arknights/enemy.js";
import { secondsToTicks } from "../../../data/arknights/tick.js";
import * as targeting from "../../../core/battle/targeting/index.js";
import { first } from "../../../core/battle/targeting/index.js";

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
                    filter: targeting.and(
                        targeting.present,
                        targeting.alive,
                        targeting.hostile,
                        targeting.blocker,
                    ),
                    selector: first(
                        1,
                        targeting.combine(targeting.blockedFirst, targeting.distance),
                    ),
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
