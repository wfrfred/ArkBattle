import type { Context as DamageContext } from "../../../resource/hp/damage/hook.js";
import { key, type Hook } from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Vitality } from "./capability.js";
import type { Health } from "./health.js";
import type { DamageApplication } from "./operations.js";

export interface DamageCommittingContext extends DamageContext {
    readonly previous: Health;
}

export type DamageCommittingHook = Hook<DamageCommittingContext, Health>;

export const damageCommitting = key<DamageCommittingHook, Unit & Vitality>(
    "vitality.damageCommitting",
);

export interface DamageCommittedContext extends DamageContext {
    readonly application: DamageApplication;
}

export type DamageCommittedHook = Hook<DamageCommittedContext, void>;

export const damageCommitted = key<DamageCommittedHook, Unit & Vitality>(
    "vitality.damageCommitted",
);
