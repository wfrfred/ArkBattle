export {
    hasSkill,
    hasSkillDefinition,
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

export type { Rule } from "./rule.js";
