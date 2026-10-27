export {
    hasVitality,
    hasVitalityDefinition,
    initialize,
    setDamageReceptionRule,
    removeDamageReceptionRule,
    setMaxHpContribution,
    removeMaxHpContribution,
    resolveMaxHp,
    setDefenseContribution,
    removeDefenseContribution,
    setResistanceContribution,
    removeResistanceContribution,
} from "./capability.js";

export type { Definition, DefenseValues, Input, State, Vitality } from "./capability.js";

export { resolveDefense } from "./query.js";
