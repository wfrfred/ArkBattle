import type {
    Definition as ElementalDefinition,
    Type,
    BurstDefinition,
} from "../../core/unit/capability/elemental/index.js";

import { secondsToTicks } from "./tick.js";

const elements = { SANITY: "NEURAL", WATER: "EROSION", FIRE: "BURN", DARK: "NECROSIS" } as const;

export type Receiver = "CHARACTER" | "ENEMY";

export type ArknightsElementalBurstProfile = BurstDefinition;

export interface ArknightsElementalOptions {
    readonly receiver: Receiver;
    readonly boss?: boolean;
    readonly maxEp?: number;
    readonly recoveryPerSecond?: number;
    readonly elementResistance?: number;
    readonly damageResistance?: number;
    readonly burstRecoverySpeed?: number;
}

function profile(
    input: Partial<ArknightsElementalBurstProfile> &
        Pick<ArknightsElementalBurstProfile, "durationTicks">,
): ArknightsElementalBurstProfile {
    return {
        burstDamage: null,
        damagePerSecond: null,
        defReduction: 0,
        resReduction: 0,
        stun: false,
        paralysisStacks: 0,
        spDrainPerSecond: 0,
        blocksSkill: false,
        blocksSpRecovery: false,
        attackReductionRatio: 0,
        ...input,
    };
}

const profiles: Readonly<Record<Receiver, Readonly<Record<Type, ArknightsElementalBurstProfile>>>> =
    {
        CHARACTER: {
            NEURAL: profile({
                durationTicks: secondsToTicks(10),
                burstDamage: { type: "TRUE", power: 1000 },
                stun: true,
            }),
            EROSION: profile({
                durationTicks: secondsToTicks(10),
                burstDamage: { type: "PHYSICAL", power: 800 },
                defReduction: 100,
            }),
            BURN: profile({
                durationTicks: secondsToTicks(10),
                burstDamage: { type: "ARTS", power: 1200 },
                resReduction: 20,
            }),
            NECROSIS: profile({
                durationTicks: secondsToTicks(15),
                damagePerSecond: { type: "ARTS", power: 100 },
                spDrainPerSecond: 1,
                blocksSkill: true,
                blocksSpRecovery: true,
            }),
        },
        ENEMY: {
            NEURAL: profile({
                durationTicks: secondsToTicks(10),
                burstDamage: { type: "ELEMENTAL", power: 6000 },
                paralysisStacks: 3,
            }),
            EROSION: profile({
                durationTicks: secondsToTicks(8),
                burstDamage: { type: "ELEMENTAL", power: 5000 },
                defReduction: 120,
            }),
            BURN: profile({
                durationTicks: secondsToTicks(10),
                burstDamage: { type: "ELEMENTAL", power: 7000 },
                resReduction: 20,
            }),
            NECROSIS: profile({
                durationTicks: secondsToTicks(15),
                damagePerSecond: { type: "ELEMENTAL", power: 800 },
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

export function getArknightsElementalBurstProfile(
    receiver: Receiver,
    type: Type,
): ArknightsElementalBurstProfile {
    return profiles[receiver][type];
}

export function createArknightsElementalDefinition(
    options: ArknightsElementalOptions,
): ElementalDefinition {
    return {
        maxEp:
            options.maxEp ?? (options.receiver === "ENEMY" && options.boss === true ? 2000 : 1000),
        recoveryPerSecond: options.recoveryPerSecond ?? 0,
        elementResistance: options.elementResistance ?? 0,
        damageResistance: options.damageResistance ?? 0,
        burstRecoverySpeed: options.burstRecoverySpeed ?? 1,
        bursts: profiles[options.receiver],
    };
}
