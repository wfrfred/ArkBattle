import type { Rule as BaseRule } from "../../../rule.js";
import type { Unit } from "../../unit.js";
import type { Skill } from "./capability.js";
import type { Source } from "../../skill/sp.js";

import type { Operation } from "../../skill/activation.js";

export interface Contexts {
    readonly activation: { readonly self: Unit & Skill };
    readonly operation: { readonly self: Unit & Skill; readonly operation: Operation };
    readonly recovery: { readonly self: Unit & Skill; readonly source: Source };
}

export type Key = keyof Contexts;

export type Rule<K extends Key = Key> = BaseRule<Contexts[K]>;

export type Rules = { readonly [K in Key]: readonly Rule<K>[] };
