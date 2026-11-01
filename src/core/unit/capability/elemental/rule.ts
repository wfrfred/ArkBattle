import type { Rule as BaseRule } from "../../../rule.js";
import type { Unit } from "../../unit.js";
import type { Elemental } from "./capability.js";
import type { DamageRequest, HealRequest } from "./operations.js";

export interface Contexts {
    readonly damage: { readonly self: Unit & Elemental; readonly request: DamageRequest };
    readonly heal: { readonly self: Unit & Elemental; readonly request: HealRequest };
}

export type Key = keyof Contexts;

export type Rule<K extends Key = Key> = BaseRule<Contexts[K]>;

export type Rules = { readonly [K in Key]: readonly Rule<K>[] };
