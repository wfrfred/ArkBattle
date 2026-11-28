import {
    Type,
    type Definition as ElementalDefinition,
} from "../../unit/capability/elemental/index.js";
import { createStun, createParalysis } from "./neural.js";
import { create as createErosion } from "./erosion.js";
import { create as createBurn } from "./burn.js";
import { createSpDrain, createAttackReduction } from "./necrosis.js";
import { createActionScaledDamage, createTimeScaledDamage } from "./mania.js";
import { secondsToTicks } from "../../tick.js";

export const allyBursts: ElementalDefinition["bursts"] = {
    [Type.MANIA]: createActionScaledDamage({
        durationTicks: secondsToTicks(15),
        effectDurationTicks: secondsToTicks(15),
        attackSpeed: 50,
        damagePerSecond: 100,
        damagePerAction: 50,
        maxDamagePerSecond: 600,
    }),
    [Type.NEURAL]: createStun({
        durationTicks: secondsToTicks(10),
        stunDurationTicks: secondsToTicks(10),
        damage: 1000,
    }),
    [Type.EROSION]: createErosion({
        damageType: "PHYSICAL",
        durationTicks: secondsToTicks(10),
        damage: 800,
        defReduction: 100,
    }),
    [Type.BURN]: createBurn({
        damageType: "ARTS",
        durationTicks: secondsToTicks(10),
        damage: 1200,
        resReduction: 20,
    }),
    [Type.NECROSIS]: createSpDrain({
        durationTicks: secondsToTicks(15),
        damagePerSecond: 100,
        spDrainPerSecond: 1,
    }),
};

export const enemyBursts: ElementalDefinition["bursts"] = {
    [Type.MANIA]: createTimeScaledDamage({
        durationTicks: secondsToTicks(15),
        attackSpeed: 20,
        damagePerSecond: 160,
        damageIncreasePerSecond: 130,
    }),
    [Type.NEURAL]: createParalysis({
        durationTicks: secondsToTicks(10),
        damage: 6000,
        paralysisStacks: 3,
    }),
    [Type.EROSION]: createErosion({
        damageType: "ELEMENTAL",
        durationTicks: secondsToTicks(8),
        damage: 5000,
        defReduction: 120,
    }),
    [Type.BURN]: createBurn({
        damageType: "ELEMENTAL",
        durationTicks: secondsToTicks(10),
        damage: 7000,
        resReduction: 20,
    }),
    [Type.NECROSIS]: createAttackReduction({
        durationTicks: secondsToTicks(15),
        damagePerSecond: 800,
        attackReductionRatio: 0.5,
    }),
};
