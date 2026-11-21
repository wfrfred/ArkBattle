import type { Profile } from "../../../data/unit/enemy.js";
import { type Unit, ref } from "../../../core/unit/index.js";
import type { Product } from "../../../core/unit/capability/catalog.js";
import { hasExecution, type ActionCapability } from "../../../core/unit/capability/action/index.js";

import { hasBlockable } from "../../../core/unit/capability/blocking/index.js";
import {
    createDefinition as createGroundDefinition,
    type Definition as GroundDefinition,
} from "../ground.js";
import { createMelee, createRanged, type Attack, type Projectile, type Timing } from "./action.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export interface AttackTiming extends Timing {
    readonly hitRadius: number;
    readonly projectile: Projectile;
}

export type Enemy = Unit &
    Product<GroundDefinition> &
    ActionCapability<Enemy> & {
        readonly definition: {
            readonly profile: Profile;
            readonly attackTiming: AttackTiming;
            readonly attack: Attack;
        };
    };

export type Definition = Enemy["definition"];

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
        profile,
        attackTiming: timing,
        attack: ranged,
        action: {
            speed: { default: profile.attackSpeed, min: 20, max: null },
            interval: { default: profile.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            definitions: [melee, ranged],
            select: (battle, self) => ({
                state: battle,
                value: hasExecution(battle, ref(self))
                    ? []
                    : [
                          hasBlockable(self) && self.blockable.relation !== null
                              ? melee.id
                              : ranged.id,
                      ],
            }),
        },
    } satisfies Definition;

    return { definition, actions: { melee, ranged } };
}
