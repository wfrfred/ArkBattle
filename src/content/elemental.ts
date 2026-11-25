import {
    Type,
    type Definition as ElementalDefinition,
} from "../core/unit/capability/elemental/index.js";
import { createStun, createParalysis } from "../core/effects/elemental/neural.js";
import { create as createErosion } from "../core/effects/elemental/erosion.js";
import { create as createBurn } from "../core/effects/elemental/burn.js";
import { createSpDrain, createAttackReduction } from "../core/effects/elemental/necrosis.js";
import {
    createActionScaledDamage,
    createTimeScaledDamage,
} from "../core/effects/elemental/mania.js";
import { secondsToTicks } from "../core/tick.js";

export type Receiver = "CHARACTER" | "ENEMY";

export interface Options {
    readonly receiver: Receiver;
    readonly boss: boolean;
    readonly maxEp: number | null;
    readonly recoveryPerSecond: number;
    readonly elementResistance: number;
    readonly damageResistance: number;
    readonly burstRecoverySpeed: number;
}

const bursts: Readonly<Record<Receiver, ElementalDefinition["bursts"]>> = {
    CHARACTER: {
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
    },
    ENEMY: {
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
    },
};

export function create(options: Options): ElementalDefinition {
    return {
        maxEp: {
            default: options.maxEp ?? (options.receiver === "ENEMY" && options.boss ? 2000 : 1000),
            min: 1,
            max: null,
        },
        recoverySpeed: { default: options.recoveryPerSecond, min: 0, max: null },
        elementResistance: { default: options.elementResistance, min: 0, max: 100 },
        damageResistance: { default: options.damageResistance, min: 0, max: 100 },
        burstRecoverySpeed: { default: options.burstRecoverySpeed, min: 0, max: null },
        bursts: bursts[options.receiver],
    };
}
