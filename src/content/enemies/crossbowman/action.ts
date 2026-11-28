import { selectBlocker } from "../targeting.js";
import { normalMeleeOutput } from "../../actions/normal-melee.js";
import {
    create as createAttack,
    faceTarget,
    type Attack as BaseAttack,
} from "../../actions/attack.js";
import * as units from "../../../core/unit/index.js";
import { perSecondToPerTick } from "../../../core/tick.js";
import * as projectiles from "../../../core/projectile/index.js";
import { resolveAttack, type Offense } from "../../../core/unit/capability/offense/index.js";

import { hasVitality } from "../../../core/unit/capability/vitality/index.js";
import * as targeting from "../../../core/battle/targeting/index.js";
import type { Blockable } from "../../../core/unit/capability/blocking/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";
import { topK } from "../../../core/common/collection/order.js";
import { arrowApplyWay, createArrow } from "./projectile.js";

export type Host = Classification & Blockable & Offense;

export type Attack = BaseAttack<object, object, Host>;

export function createMelee(): Attack {
    return createAttack<Host>({
        id: "melee",
        onStart: faceTarget,
        period: { type: "ATTACK_SPEED" },
        timing: {
            type: "ATTACK_SPEED",
            beginTicks: 0,
            durationTicks: 30,
            releaseTicks: 15,
            minScale: 0.1,
            maxScale: 1,
        },
        applyWay: "MELEE",
        select: selectBlocker,
        output: normalMeleeOutput,
    });
}

export function createRanged(rangeRadius: number): Attack {
    const projectile = createArrow();

    return createAttack<Host>({
        id: "ranged",
        applyWay: arrowApplyWay,
        onStart: faceTarget,
        period: { type: "ATTACK_SPEED" },
        timing: {
            type: "ATTACK_SPEED",
            beginTicks: 0,
            durationTicks: 30,
            releaseTicks: 16,
            minScale: 0.1,
            maxScale: 1,
        },
        select(battle, source) {
            const self = source.get(battle);
            if (self === undefined) {
                return { state: battle, value: [] };
            }

            const blocker = self.blockable.relation?.blocker;
            const candidates = units
                .all(battle)
                .filter(hasTargetable)
                .filter(targeting.inCategories(["DEFAULT"]))
                .filter(targeting.damage(self)(battle))
                .filter((target) => target.ref !== blocker)
                .filter(
                    targeting.inRange(self.position, [
                        { type: "CIRCLE", offset: [0, 0], radius: rangeRadius },
                    ]),
                );

            return {
                state: battle,
                value: topK(candidates, 1, targeting.distance(self.position)).map(units.ref),
            };
        },
        output: (state, host, self) => {
            const source = host.get(state);
            const target = self.state.targets[0].get(state);
            if (source === undefined || target === undefined || !hasVitality(target)) {
                return state;
            }

            const initialized = projectiles.initialize(state, {
                definition: projectile,
                side: source.definition.classification.side,
                position: source.position,
                state: {
                    source: units.ref(source),
                    target: units.ref(target),
                    destination: target.position,
                    cachedAtk: resolveAttack(state, source),
                    speedPerTick: perSecondToPerTick(10),
                    stopDelayTicks: 0,
                    stopAtTick: null,
                    hitAttempted: false,
                    launchedAtTick: state.tick,
                },
            });

            return projectiles.add(initialized.state, initialized.value);
        },
    });
}
