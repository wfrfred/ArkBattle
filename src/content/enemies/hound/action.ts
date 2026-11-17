import { create as createAttack, faceTarget, type Attack } from "../../actions/attack.js";
import type { Timing } from "../../actions/timing.js";
import type { Profile } from "../../../data/unit/enemy.js";
import { secondsToTicks } from "../../../data/time.js";
import * as units from "../../../core/unit/index.js";
import { hasBlockable } from "../../../core/unit/capability/blocking/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import { hasAllegiance } from "../../../core/unit/capability/allegiance/capability.js";
import * as targeting from "../../../core/battle/targeting/index.js";

export function create(profile: Profile, timing: Timing): Attack {
    return createAttack({
        id: "normal-attack",
        onStart: faceTarget,
        speed: profile.attackSpeed,
        triggerBindingId: "primary",
        intervalTicks: secondsToTicks(profile.baseAttackTime),
        timing,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined || !hasAllegiance(self)) {
                        return { state: battle, value: [] };
                    }

                    const owner = hasBlockable(self) ? self.blockable.relation?.blocker : undefined;
                    const target = owner === undefined ? undefined : units.get(battle, owner);
                    if (target === undefined || !hasTargetable(target)) {
                        return { state: battle, value: [] };
                    }

                    const eligible = targeting.damage(battle, self, () => true);

                    return {
                        state: battle,
                        value: eligible(target) ? [units.ref(target)] : [],
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        attackType: "NORMAL",
                        applyWay: "MELEE",
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
