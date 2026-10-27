import type { Attack } from "../../actions/attack.js";
import type { Profile } from "../../../data/arknights/enemy.js";
import type { Unit } from "../../../core/unit/unit.js";
import type {
    Definitions as CapabilityDefinitions,
    Product,
} from "../../../core/unit/capability/catalog.js";
import { create as createAction, createActions } from "../../../core/unit/action/initialize.js";
import {
    createDefinition as createGroundDefinition,
    type Definition as GroundDefinition,
} from "../ground.js";
import { create as createAttack, type Timing } from "./action.js";

export interface AttackTiming extends Timing {
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
    halfBodyWidth: number,
): { readonly definition: Definition; readonly action: Attack } {
    if (profile.id !== "enemy_1000_gopro" || profile.applyWay !== "MELEE") {
        throw new TypeError("Hound content requires its melee profile");
    }

    const ground = createGroundDefinition(profile, timing.hitRadius, halfBodyWidth);
    const attack = createAttack(profile, timing);
    const initializeAttack = createAction(attack);
    const definition: Definition = {
        ...ground,
        profile,
        attackTiming: timing,
        attack,
        action: { initialize: (battle) => createActions(battle, initializeAttack) },
    };

    return { definition, action: attack };
}
