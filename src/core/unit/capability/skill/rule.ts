import type { Rule as BaseRule } from "../../../rule.js";
import type { Unit } from "../../unit.js";
import type { Skill } from "./capability.js";
import type { Source } from "../../skill/sp.js";

import type { Operation } from "../../skill/activation.js";

export interface ActivationContext {
    readonly self: Unit & Skill;
}

export interface OperationContext {
    readonly self: Unit & Skill;
    readonly operation: Operation;
}

export interface RecoveryContext {
    readonly self: Unit & Skill;
    readonly source: Source;
}

export type ActivationRule = BaseRule<ActivationContext>;

export type OperationRule = BaseRule<OperationContext>;

export type RecoveryRule = BaseRule<RecoveryContext>;

export interface Rules {
    readonly activationRules: readonly ActivationRule[];
    readonly operationRules: readonly OperationRule[];
    readonly recoveryRules: readonly RecoveryRule[];
}

export type Key = keyof Rules;

export type Rule<K extends Key = Key> = Rules[K][number];
