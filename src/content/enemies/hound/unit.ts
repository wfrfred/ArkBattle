import type { Timing } from "../../actions/timing.js";
import type { ActionCapability } from "../../../core/unit/capability/action/index.js";
import {
    createDefinition as createGroundDefinition,
    type GroundEnemy,
    type Parameters as GroundParameters,
} from "../ground.js";
import { create as createAttack } from "./action.js";
import { TICKS_PER_SECOND } from "../../../core/tick.js";

export interface Parameters extends GroundParameters {
    readonly attackSpeed: number;
    readonly baseAttackTime: number;
    readonly timing: Timing;
}

export type Hound = GroundEnemy & ActionCapability<Hound>;

export type Definition = Hound["definition"];

export function create(parameters: Parameters) {
    const ground = createGroundDefinition("enemy_1000_gopro", parameters);
    const attack = createAttack(parameters.timing);

    return {
        ...ground,
        action: {
            speed: { default: parameters.attackSpeed, min: 20, max: null },
            interval: { default: parameters.baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
            definitions: [attack],
        },
    } satisfies Definition;
}
