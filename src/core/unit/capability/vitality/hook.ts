import type { Ref } from "../../../common/ref.js";
import { key, type Hook } from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Vitality } from "./capability.js";

export interface DamageCommittingContext {
    readonly target: Ref<Unit & Vitality>;
    readonly hpBefore: number;
}

export interface DamageCommittingHook extends Hook<DamageCommittingContext, number> {
    readonly priority?: number;
}

export const damageCommitting = key<DamageCommittingHook, Unit & Vitality>(
    "vitality.damageCommitting",
);
