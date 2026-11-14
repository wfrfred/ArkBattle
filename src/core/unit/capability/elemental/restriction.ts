import type * as contribution from "../../contribution/contribution.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";
import type { Unit } from "../../unit.js";
import type { Elemental, Type } from "./capability.js";
import type { Request as DamageRequest } from "../../../battle/resource/ep/damage/contract.js";
import type { Request as HealingRequest } from "../../../battle/resource/ep/healing/contract.js";

export interface DamageContext {
    readonly self: Unit & Elemental;
    readonly request: DamageRequest;
    readonly type: Type;
}

export interface HealingContext {
    readonly self: Unit & Elemental;
    readonly request: HealingRequest;
}

export type DamageRestriction = BaseRestriction<DamageContext>;

export type HealingRestriction = BaseRestriction<HealingContext>;

export interface Restrictions {
    readonly damageRestrictions: readonly contribution.Contribution<DamageRestriction>[];
    readonly healingRestrictions: readonly contribution.Contribution<HealingRestriction>[];
}
