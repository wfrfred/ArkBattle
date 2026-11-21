import type { Attack } from "../../actions/attack.js";
import type { Timing } from "../../actions/timing.js";
import type { Profile } from "../../../data/unit/enemy.js";
import type { Unit } from "../../../core/unit/index.js";
import type {
    Definitions as CapabilityDefinitions,
    Product,
} from "../../../core/unit/capability/catalog.js";
import {
    createDefinition as createGroundDefinition,
    type Definition as GroundDefinition,
} from "../ground.js";
import { create as createAttack } from "./action.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export interface AttackTiming {
    readonly timing: Timing;
    readonly hitRadius: number;
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
): { readonly definition: Definition; readonly action: Attack } {
    if (profile.id !== "enemy_1000_gopro") {
        throw new TypeError("Hound content requires its own profile");
    }

    const ground = createGroundDefinition(profile, timing.hitRadius, movement);
    const attack = createAttack(profile, timing.timing);
    const definition: Definition = {
        ...ground,
        profile,
        attackTiming: timing,
        attack,
        action: {
            speed: { default: profile.attackSpeed, min: 20, max: null },
            interval: { default: profile.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            definitions: [attack],
        },
    };

    return { definition, action: attack };
}
