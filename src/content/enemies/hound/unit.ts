import type { Timing } from "../../actions/timing.js";
import type { Profile } from "../../../data/unit/enemy.js";
import type { Unit } from "../../../core/unit/index.js";
import type { Product } from "../../../core/unit/capability/catalog.js";
import type { ActionCapability } from "../../../core/unit/capability/action/index.js";
import {
    createDefinition as createGroundDefinition,
    type Definition as GroundDefinition,
} from "../ground.js";
import { create as createAttack, type Attack } from "./action.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export interface AttackTiming {
    readonly timing: Timing;
    readonly hitRadius: number;
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
): { readonly definition: Definition; readonly action: Attack } {
    if (profile.id !== "enemy_1000_gopro") {
        throw new TypeError("Hound content requires its own profile");
    }

    const ground = createGroundDefinition(profile, timing.hitRadius, movement);
    const attack = createAttack(timing.timing);
    const definition = {
        ...ground,
        profile,
        attackTiming: timing,
        attack,
        action: {
            speed: { default: profile.attackSpeed, min: 20, max: null },
            interval: { default: profile.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            definitions: [attack],
        },
    } satisfies Definition;

    return { definition, action: attack };
}
