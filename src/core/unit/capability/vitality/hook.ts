import type { Context as DamageContext } from "../../../battle/resource/hp/damage/hook.js";
import { key, type Hook } from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Vitality } from "./capability.js";

export interface DamageCommittingContext extends DamageContext {
    readonly hpBefore: number;
}

export interface DamageCommittingHook extends Hook<DamageCommittingContext, number> {
    readonly priority?: number;
}

export const damageCommitting = key<DamageCommittingHook, Unit & Vitality>(
    "vitality.damageCommitting",
);
