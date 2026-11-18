import type { Attack } from "../../actions/attack.js";
import type { Profile } from "../../../data/unit/enemy.js";
import { type Unit, ref } from "../../../core/unit/index.js";
import type {
    Definitions as CapabilityDefinitions,
    Product,
} from "../../../core/unit/capability/catalog.js";
import {
    create as createAction,
    createActions,
    isCasting,
} from "../../../core/unit/capability/action/index.js";

import { hasBlockable } from "../../../core/unit/capability/blocking/index.js";
import {
    createDefinition as createGroundDefinition,
    type Definition as GroundDefinition,
} from "../ground.js";
import { createMelee, createRanged, type Projectile, type Timing } from "./action.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export interface AttackTiming extends Timing {
    readonly hitRadius: number;
    readonly projectile: Projectile;
}

export interface Definition extends GroundDefinition, Pick<CapabilityDefinitions, "action"> {
    readonly profile: Profile;
    readonly attackTiming: AttackTiming;
    readonly attack: Attack;
}

export type Enemy = Unit & Product<Definition>;

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
    const melee = createMelee(profile, timing);
    const ranged = createRanged(profile, timing, timing.projectile);
    const initializeMelee = createAction(melee);
    const initializeRanged = createAction(ranged);
    const definition: Definition = {
        ...ground,
        profile,
        attackTiming: timing,
        attack: ranged,
        action: {
            speed: { default: profile.attackSpeed, min: 20, max: null },
            interval: { default: profile.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            initialize: (battle, self) =>
                createActions(battle, self, initializeMelee, initializeRanged),
            select: (battle, self) => ({
                state: battle,
                value: isCasting(battle, ref(self))
                    ? []
                    : [
                          hasBlockable(self) && self.blockable.relation !== null
                              ? melee.id
                              : ranged.id,
                      ],
            }),
        },
    };

    return { definition, actions: { melee, ranged } };
}
