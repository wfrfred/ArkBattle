export {
    hasVitality,
    hasVitalityDefinition,
    initialize,
    setRule,
    removeRule,
    setMaxHpContribution,
    removeMaxHpContribution,
    resolveMaxHp,
    setDefenseContribution,
    removeDefenseContribution,
    setResistanceContribution,
    removeResistanceContribution,
} from "./capability.js";

export type { Definition, DefenseValues, Input, State, Vitality } from "./capability.js";

export type {
    ReceptionRule as Rule,
    ReceivingContext as RuleContext,
} from "../../../battle/damage/hook.js";

export { resolveDefense } from "./query.js";
