import type { Rule as BaseRule } from "../../../rule.js";
import type { Unit } from "../../unit.js";
import type { Elemental, Type } from "./capability.js";
import type { Request as DamageRequest } from "../../../battle/damage/ep/contract.js";
import type { Request as HealingRequest } from "../../../battle/healing/ep/contract.js";

export interface Contexts {
    readonly damage: {
        readonly self: Unit & Elemental;
        readonly request: DamageRequest;
        readonly type: Type;
    };
    readonly heal: { readonly self: Unit & Elemental; readonly request: HealingRequest };
}

export type Key = keyof Contexts;

export type Rule<K extends Key = Key> = BaseRule<Contexts[K]>;

export type Rules = { readonly [K in Key]: readonly Rule<K>[] };
