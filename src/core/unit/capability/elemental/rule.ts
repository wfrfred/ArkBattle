import type { Rule as BaseRule } from "../../../rule.js";
import type { Unit } from "../../unit.js";
import type { Elemental, Type } from "./capability.js";
import type { Request as DamageRequest } from "../../../battle/damage/ep/contract.js";
import type { Request as HealingRequest } from "../../../battle/healing/ep/contract.js";

export interface DamageContext {
    readonly self: Unit & Elemental;
    readonly request: DamageRequest;
    readonly type: Type;
}

export interface HealingContext {
    readonly self: Unit & Elemental;
    readonly request: HealingRequest;
}

export type DamageRule = BaseRule<DamageContext>;

export type HealingRule = BaseRule<HealingContext>;

export interface Rules {
    readonly damageRules: readonly DamageRule[];
    readonly healingRules: readonly HealingRule[];
}

export type Key = keyof Rules;

export type Rule<K extends Key = Key> = Rules[K][number];
