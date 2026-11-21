import type { Profile } from "../../../data/unit/enemy.js";
import { ref } from "../../../core/unit/index.js";
import { hasExecution, type ActionCapability } from "../../../core/unit/capability/action/index.js";

import {
    createDefinition as createGroundDefinition,
    type Definition as GroundDefinition,
    type GroundEnemy,
} from "../ground.js";
import { createMelee, createRanged, type Attack, type Timing } from "./action.js";
import type { Projectile } from "./projectile.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export interface AttackTiming extends Timing {
    readonly hitRadius: number;
    readonly projectile: Projectile;
}

export type Crossbowman = GroundEnemy & ActionCapability<Crossbowman>;

export type Definition = Crossbowman["definition"];

export function create(
    profile: Profile,
    timing: AttackTiming,
    movement: Pick<GroundDefinition["locomotion"], "steeringParameters" | "halfBodyWidth">,
): {
    readonly definition: Definition;
    readonly actions: { readonly melee: Attack; readonly ranged: Attack };
} {
    if (profile.id !== "enemy_1003_ncbow") {
        throw new TypeError("Crossbowman content requires its own profile");
    }

    const ground = createGroundDefinition(profile, timing.hitRadius, movement);
    const melee = createMelee(timing);
    const ranged = createRanged(profile, timing, timing.projectile);
    const definition = {
        ...ground,
        action: {
            speed: { default: profile.attackSpeed, min: 20, max: null },
            interval: { default: profile.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            definitions: [melee, ranged],
            select: (battle, self) => ({
                state: battle,
                value: hasExecution(battle, ref(self))
                    ? []
                    : [self.blockable.relation !== null ? melee.id : ranged.id],
            }),
        },
    } satisfies Definition;

    return { definition, actions: { melee, ranged } };
}
