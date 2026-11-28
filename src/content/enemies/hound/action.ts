import { selectBlocker } from "../targeting.js";
import { normalMeleeOutput } from "../../actions/normal-melee.js";
import {
    create as createAttack,
    faceTarget,
    type Attack as BaseAttack,
} from "../../actions/attack.js";
import type { Blockable } from "../../../core/unit/capability/blocking/index.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";
import type { Offense } from "../../../core/unit/capability/offense/index.js";

export type Host = Classification & Blockable & Offense;

export type Attack = BaseAttack<object, object, Host>;

export function create(): Attack {
    return createAttack<Host>({
        id: "normal-attack",
        onStart: faceTarget,
        period: { type: "ATTACK_SPEED" },
        timing: {
            type: "ATTACK_SPEED",
            beginTicks: 0,
            durationTicks: 30,
            releaseTicks: 18,
            minScale: 0.1,
            maxScale: 1,
        },
        applyWay: "MELEE",
        select: selectBlocker,
        output: normalMeleeOutput,
    });
}
