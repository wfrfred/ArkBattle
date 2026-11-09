import { create as createAttack, type Attack } from "../../actions/attack.js";
import type { Profile } from "../../../data/arknights/enemy.js";
import { secondsToTicks } from "../../../data/arknights/tick.js";
import * as units from "../../../core/unit/index.js";
import { hasBlockable } from "../../../core/unit/capability/blocking/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import * as targeting from "../../../core/battle/targeting/index.js";

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
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined) {
                        return { state: battle, value: [] };
                    }

                    const owner = hasBlockable(self) ? self.blockable.relation?.blocker : undefined;
                    const target = owner === undefined ? undefined : units.get(battle, owner);
                    const eligible = targeting.damage(battle, self, () => true);

                    return {
                        state: battle,
                        value:
                            target !== undefined && hasTargetable(target) && eligible(target)
                                ? [units.ref(target)]
                                : [],
                    };
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
