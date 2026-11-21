import {
    create as createAttack,
    faceTarget,
    sourceAttack,
    type Attack as BaseAttack,
} from "../../actions/attack.js";
import type { Timing } from "../../actions/timing.js";
import * as units from "../../../core/unit/index.js";
import type { Blockable } from "../../../core/unit/capability/blocking/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";
import type { Offense } from "../../../core/unit/capability/offense/index.js";
import * as targeting from "../../../core/battle/targeting/index.js";

export type Host = Classification & Blockable & Offense;

export type Attack = BaseAttack<object, object, Host>;

export function create(timing: Timing): Attack {
    return createAttack<Host>({
        id: "normal-attack",
        onStart: faceTarget,
        triggerBindingId: "primary",
        period: { type: "ATTACK_SPEED" },
        timing,
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined) {
                        return { state: battle, value: [] };
                    }

                    const owner = self.blockable.relation?.blocker;
                    const target = owner === undefined ? undefined : units.get(battle, owner);
                    if (target === undefined || !hasTargetable(target)) {
                        return { state: battle, value: [] };
                    }

                    const eligible = targeting.damage(self, () => true)(battle);

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
                        power: sourceAttack,
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
        followUps: [],
    });
}
