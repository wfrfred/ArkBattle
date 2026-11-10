import {
    Type,
    type Definition as ElementalDefinition,
    type BurstDefinition,
} from "../core/unit/capability/elemental/index.js";
import { createStun, createParalysis } from "../core/effects/elemental/neural.js";
import {
    createPhysical,
    createElemental as createElementalErosion,
} from "../core/effects/elemental/erosion.js";
import {
    createArts,
    createElemental as createElementalBurn,
} from "../core/effects/elemental/burn.js";
import { createSpDrain, createAttackReduction } from "../core/effects/elemental/necrosis.js";
import { secondsToTicks } from "./tick.js";

const elements = {
    SANITY: Type.NEURAL,
    WATER: Type.EROSION,
    FIRE: Type.BURN,
    DARK: Type.NECROSIS,
} as const;

export type Receiver = "CHARACTER" | "ENEMY";

export interface ArknightsElementalOptions {
    readonly receiver: Receiver;
    readonly boss?: boolean;
    readonly maxEp?: number;
    readonly recoveryPerSecond?: number;
    readonly elementResistance?: number;
    readonly damageResistance?: number;
    readonly burstRecoverySpeed?: number;
}

const bursts: Readonly<Record<Receiver, Readonly<Record<Type, BurstDefinition>>>> = {
    CHARACTER: {
        [Type.NEURAL]: createStun({
            durationTicks: secondsToTicks(10),
            stunDurationTicks: secondsToTicks(10),
            damage: 1000,
        }),
        [Type.EROSION]: createPhysical({
            durationTicks: secondsToTicks(10),
            damage: 800,
            defReduction: 100,
        }),
        [Type.BURN]: createArts({
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
        [Type.NEURAL]: createParalysis({
            durationTicks: secondsToTicks(10),
            damage: 6000,
            paralysisStacks: 3,
        }),
        [Type.EROSION]: createElementalErosion({
            durationTicks: secondsToTicks(8),
            damage: 5000,
            defReduction: 120,
        }),
        [Type.BURN]: createElementalBurn({
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

export function parseElementType(value: unknown): Type {
    for (const [index, key] of Object.keys(elements).entries()) {
        if (value === key || value === index + 1) {
            return elements[key as keyof typeof elements];
        }
    }

    throw new TypeError(`unsupported element type: ${String(value)}`);
}

export function createArknightsElementalDefinition(
    options: ArknightsElementalOptions,
): ElementalDefinition {
    return {
        maxEp:
            options.maxEp ?? (options.receiver === "ENEMY" && options.boss === true ? 2000 : 1000),
        recoverySpeed: options.recoveryPerSecond ?? 0,
        elementResistance: options.elementResistance ?? 0,
        damageResistance: options.damageResistance ?? 0,
        burstRecoverySpeed: options.burstRecoverySpeed ?? 1,
        bursts: bursts[options.receiver],
    };
}
