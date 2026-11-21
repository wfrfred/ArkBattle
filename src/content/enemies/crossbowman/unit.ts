import { ref } from "../../../core/unit/index.js";
import { hasExecution, type ActionCapability } from "../../../core/unit/capability/action/index.js";
import type { Timing as AttackTiming } from "../../actions/timing.js";

import {
    createDefinition as createGroundDefinition,
    type GroundEnemy,
    type Parameters as GroundParameters,
} from "../ground.js";
import { createMelee, createRanged } from "./action.js";
import type { Projectile } from "./projectile.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export interface Parameters extends GroundParameters {
    readonly attackSpeed: number;
    readonly baseAttackTime: number;
    readonly timing: { readonly melee: AttackTiming; readonly ranged: AttackTiming };
    readonly rangeRadius: number;
    readonly projectile: Projectile;
}

export type Crossbowman = GroundEnemy & ActionCapability<Crossbowman>;

export type Definition = Crossbowman["definition"];

export function create(parameters: Parameters) {
    const ground = createGroundDefinition("enemy_1003_ncbow", parameters);
    const melee = createMelee(parameters.timing.melee);
    const ranged = createRanged(
        parameters.rangeRadius,
        parameters.timing.ranged,
        parameters.projectile,
    );

    return {
        ...ground,
        action: {
            speed: { default: parameters.attackSpeed, min: 20, max: null },
            interval: { default: parameters.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            definitions: [melee, ranged],
            select: (battle, self) => ({
                state: battle,
                value: hasExecution(battle, ref(self))
                    ? []
                    : [self.blockable.relation !== null ? melee.id : ranged.id],
            }),
        },
    } satisfies Definition;
}
