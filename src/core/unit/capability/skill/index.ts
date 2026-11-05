export {
    hasSkill,
    initialize,
    setRule,
    removeRule,
    setHook,
    removeHook,
    setAmmoContribution,
    removeAmmoContribution,
} from "./capability.js";

export type { Definition, State, Skill } from "./capability.js";

export type { ActivationStarted, ActivationEnded, Events, Key, Context, Hook } from "./hook.js";

export type {
    ActivationRule,
    OperationRule,
    RecoveryRule,
    ActivationContext as ActivationRuleContext,
    OperationContext as OperationRuleContext,
    RecoveryContext as RecoveryRuleContext,
    Rule,
    Key as RuleKey,
    Rules,
} from "./rule.js";
